# Min-Vue

一个最小可运行的 Vue3 原理实现，覆盖「运行时 + 编译器基础」完整链路，目标是让你在 1-2 小时内快速建立整体心智模型。

## 你将掌握什么

- 响应式：`reactive`、`effect`、`track/trigger`、`computed`、`watch`
- 运行时：VNode、组件实例、`mount + patch`
- 编译器：`template -> AST -> render`
- 串联：`createApp` 如何把编译产物接到渲染更新链路

## 项目结构

```text
min-vue/
├── src/
│   ├── reactivity/
│   │   ├── effect.ts
│   │   ├── reactive.ts
│   │   ├── computed.ts
│   │   ├── watch.ts
│   │   └── scheduler.ts
│   ├── runtime-core/
│   │   ├── component.ts
│   │   ├── h.ts
│   │   ├── renderer.ts
│   │   └── vnode.ts
│   ├── runtime-dom/
│   │   └── index.ts
│   ├── compiler-core/
│   │   ├── ast.ts
│   │   ├── parse.ts
│   │   ├── codegen.ts
│   │   └── compile.ts
│   └── index.ts
├── examples/
│   ├── basic.html
│   ├── basic.ts
│   ├── computed.html
│   ├── computed.ts
│   ├── watch.html
│   └── watch.ts
└── tests/
    └── reactivity.spec.ts
```

## 阶段 1：响应式闭环

一句话结论：读取数据时收集依赖，修改数据时触发依赖重新执行。

```mermaid
flowchart LR
  reactiveObj[reactiveProxy] --> getTrack[getTrack]
  getTrack --> depMap[TargetMap]
  stateSet[stateSet] --> triggerRun[triggerRun]
  depMap --> triggerRun
  triggerRun --> effectFn[effectFn]
```

最小示例：

```ts
const state = reactive({ count: 0 });
let view = "";

effect(() => {
  view = `count=${state.count}`;
});

state.count += 1;
// view => "count=1"
```

## 阶段 2：运行时渲染闭环

一句话结论：组件 render 返回 VNode，renderer 负责把 VNode 同步到真实 DOM。

```mermaid
flowchart TD
  componentRender[componentRender] --> vnodeTree[vnodeTree]
  vnodeTree --> patchNode[patchNode]
  patchNode --> domCreate[domCreateOrUpdate]
  reactiveTrigger[reactiveTrigger] --> componentRender
```

最小示例：

```ts
const App = {
  render(ctx) {
    return h("div", null, `count: ${ctx.count}`);
  },
  setup() {
    return { count: 0 };
  }
};
```

## 阶段 3：编译器基础闭环

一句话结论：把模板字符串解析成 AST，再生成可执行 render 函数。

```mermaid
flowchart LR
  templateIn[template] --> parseAst[parseToAst]
  parseAst --> astNode[astNode]
  astNode --> codeGenerate[codeGenerate]
  codeGenerate --> renderFn[renderFunction]
```

最小示例：

```ts
const render = compile("<div>count: {count}</div>");
const vnode = render({ count: 1 });
```

## 阶段 4：运行时 + 编译器串联

一句话结论：`createApp` 挂载组件时，若组件无 render 则先编译 template，再进入响应式更新循环。

```mermaid
flowchart TD
  appMount[createAppMount] --> setupComp[setupComponent]
  setupComp --> hasRender{hasRender}
  hasRender -->|yes| runRender[runRender]
  hasRender -->|no| compileTpl[compileTemplate]
  compileTpl --> runRender
  runRender --> patchDom[patchDom]
  stateChange[stateChange] --> runRender
```

## 阶段 5：computed 和 watch

### computed —— 懒计算的响应式引用

一句话结论：computed 是带缓存的派生值，依赖不变不重复计算，依赖变化则标记 dirty 并通知外层 effect。

```mermaid
flowchart LR
  A["读取 comp.value"] --> B{"_dirty?"}
  B -->|"true"| C["执行 getter 并缓存"]
  C --> D["_dirty = false"]
  B -->|"false"| E["返回缓存值"]
  D --> E
  F["依赖数据变化"] --> G["scheduler"]
  G --> H["_dirty = true"]
  H --> I["触发 dep 中的外层 effect"]
  I --> A
```

最小示例：

```ts
const state = reactive({ count: 1 });
const double = computed(() => state.count * 2);

console.log(double.value); // 2（首次访问，执行 getter）
console.log(double.value); // 2（缓存命中）
```

### watch —— 监听数据变化执行副作用

一句话结论：watch 内部创建 ReactiveEffect 并以 scheduler 处理更新，依赖变化时重新执行 getter 获取新值，驱动回调。

```mermaid
flowchart TD
  A["watch(source, cb)"] --> B["构造 getter"]
  B --> C["new ReactiveEffect(getter, job)"]
  C --> D["首次 run() 收集依赖"]
  D --> E["依赖变化 → scheduler → job()"]
  E --> F["effect.run() → newValue"]
  F --> G["cleanup()"]
  G --> H["cb(newValue, oldValue, onCleanup)"]
```

最小示例：

```ts
const state = reactive({ count: 0 });

watch(
  () => state.count,
  (newVal, oldVal) => {
    console.log(`${oldVal} → ${newVal}`);
  }
);

state.count = 1; // 输出: "0 → 1"
```

### computed API

| API | 说明 |
|-----|------|
| `computed(getter)` | 只读计算属性，返回 `{ value }` 对象 |
| `computed({ get, set })` | 可写计算属性，返回 `{ value, set }` 对象 |

### watch API

| API | 说明 |
|-----|------|
| `watch(source, cb)` | 监听 source 变化，调用 `cb(newVal, oldVal, onCleanup)` |
| `watch(source, cb, { immediate })` | `immediate: true` 立即执行一次 cb |
| `watch(source, cb, { deep })` | `deep: true` 深度监听对象内部变化 |
| `watch([s1, s2], cb)` | 监听多个 source，cb 收到数组 `[newVals, oldVals]` |
| `stop = watch(...)` | 返回值是 stop 函数，调用后停止监听 |

### 四个核心类的协作关系

```
watch(source, cb)                computed(getter)
      │                                │
      ▼                                ▼
ReactiveEffect(getter, job)    ComputedRefImpl
      │                                │
      │                          ┌─────┴──────┐
      │                          │ _effect     │ ReactiveEffect(getter, scheduler)
      │                          │ _dirty      │ boolean
      │                          │ _value      │ 缓存值
      │                          │ dep         │ Set<ReactiveEffect>
      │                          └─────────────┘
      │
      ▼
effect.run() → getter() → 收集依赖(谁→谁)
      │
      ▼
 依赖变化 → scheduler
      │
      ▼
   job() → newValue → cb(newValue, oldValue)
```

## 运行与验证

```bash
cd interview/vue/min-vue
pnpm config set registry https://registry.npmmirror.com
pnpm install
pnpm dev
```

打开 `http://localhost:5173/examples/basic.html`，你会看到页面里的 `count` 每秒 +1。

测试：

```bash
pnpm test
```

## 调用链路详解

### 0. 模块速览

| 目录 | 核心文件 | 职责 |
|------|----------|------|
| `reactivity/` | `effect.ts`, `reactive.ts`, `computed.ts`, `watch.ts`, `scheduler.ts` | 响应式系统：Proxy 代理 + 依赖收集/触发 + 计算属性 + 侦听器 |
| `runtime-core/` | `vnode.ts`, `h.ts`, `component.ts`, `renderer.ts` | 平台无关运行时：VNode 定义、组件实例、patch 渲染 |
| `runtime-dom/` | `index.ts` | 浏览器 DOM 操作 + createApp 入口 |
| `compiler-core/` | `parse.ts`, `ast.ts`, `codegen.ts`, `compile.ts` | 模板编译器：template → AST → render 函数 |

### 1. 整体架构图

```mermaid
graph TB
    subgraph "用户代码"
        A[组件定义] --> B[h 函数]
        B --> C[createApp]
    end

    subgraph "runtime-dom/index.ts"
        C --> D[createRenderer]
        D --> E[createDomRendererOptions]
        D --> F[compile]
    end

    subgraph "runtime-core/renderer.ts"
        C --> G[render]
        G --> H[patch]
        H --> I{节点类型}
        I -->|组件| J[processComponent]
        I -->|元素| K[processElement]
        I -->|文本| L[processText]
        J --> M[mountComponent]
        M --> N[createComponentInstance]
        M --> O[setupComponent]
        O --> P{有 render?}
        P -->|是| Q[使用 render]
        P -->|否,有 template| R[compile template]
        R --> Q
        M --> S[setupRenderEffect]
        S --> T[effect]
        K --> U[mountElement / patchElement]
        L --> V[mount/patch text]
    end

    subgraph "reactivity/"
        T --> W[ReactiveEffect.run]
        W --> X[执行组件 render]
        X --> Y[返回 VNode]
        Y --> H
        Z[Proxy set] --> AA[trigger]
        AA --> W
        AB[Proxy get] --> AC[track]
        AC --> AD[收集依赖]
    end

    subgraph "compiler-core/"
        R --> AE[parse]
        AE --> AF[AST]
        AF --> AG[generate]
        AG --> AH[render 函数]
    end

    subgraph "浏览器 DOM"
        U --> AI[createElement]
        U --> AJ[insert/remove]
        V --> AK[createTextNode]
    end

    style A fill:#e1f5ff
    style Y fill:#c8e6c9
    style Z fill:#fff9c4
    style AA fill:#ffccbc
    style AE fill:#e1bee7
```

### 2. 完整渲染流程时序图

```mermaid
sequenceDiagram
    participant User as 用户代码
    participant Renderer as renderer.ts
    participant Component as component.ts
    participant Reactive as effect.ts
    participant Compiler as compiler-core/

    Note over User,Compiler: 首次渲染

    User->>Renderer: createApp(Component).mount(container)
    Renderer->>Renderer: patch(null, rootVNode, container)
    Renderer->>Component: mountComponent(vnode)
    Component->>Component: createComponentInstance + setupComponent
    alt 有 template 无 render
        Component->>Compiler: compile(template) → render 函数
    end
    Component->>Renderer: setupRenderEffect(instance)
    Renderer->>Reactive: effect(renderWrapper)
    Reactive->>Reactive: run() → activeEffect = this
    Renderer->>Component: instance.render(instance.state)
    Component->>Reactive: 读取 state.xxx → track 收集依赖
    Component-->>Renderer: subTree VNode
    Renderer->>Renderer: patch(null, subTree, container) → DOM 创建
    Reactive->>Reactive: activeEffect = undefined

    Note over User,Compiler: 响应式更新

    Reactive->>Reactive: state.xxx = newVal → trigger → dep.forEach(effect.run())
    Reactive->>Reactive: run() → activeEffect = this
    Renderer->>Component: instance.render(instance.state) → nextTree
    Renderer->>Renderer: patch(prevTree, nextTree, container) → DOM 更新
    Reactive->>Reactive: activeEffect = undefined
```

### 3. 响应式系统详细流程

#### 四个核心函数

| 函数 | 位置 | 作用 |
|------|------|------|
| `reactive(target)` | `reactive.ts` | 创建 Proxy 代理对象，拦截 get/set |
| `effect(fn)` | `effect.ts` | 创建 ReactiveEffect 并立即执行 fn，返回 stop 函数 |
| `track(target, key)` | `effect.ts` | 依赖收集：把当前 activeEffect 注册到 target[key] 的依赖集合中 |
| `trigger(target, key)` | `effect.ts` | 依赖触发：遍历 target[key] 的依赖集合并重新执行每个 effect |

**关键桥梁变量**：`let activeEffect: ReactiveEffect | undefined` — 模块级全局变量，由 `ReactiveEffect.run()` 在执行 fn 前设置 `activeEffect = this`，fn 执行后设为 `undefined`。**只有在 effect 回调内读取响应式数据时，track 才会收集依赖**。

#### 主流程图

```mermaid
flowchart TD
    subgraph "初始化: effect(fn)"
        A["1. effect(fn) 被调用<br/>（setupRenderEffect 或用户代码）"] --> B["2. new ReactiveEffect(fn)"]
        B --> C["3. reactiveEffect.run()"]
    end

    subgraph "依赖收集: run() → fn() → track()"
        C --> D["4. activeEffect = this<br/>（标记当前正在执行的 effect）"]
        D --> E["5. 执行 this.fn()"]
        E --> F["6. fn() 内读取 state.xxx<br/>→ Proxy get → track(target, key)"]
        F --> G["7. track 将 activeEffect 加入<br/>target[key] 的依赖集合"]
        G --> H["8. activeEffect = undefined<br/>（执行完毕，停止收集）"]
    end

    subgraph "依赖触发: set() → trigger() → run()"
        I["9. state.xxx = newVal<br/>→ Proxy set → trigger(target, key)"] --> J["10. trigger 取出 target[key]<br/>的所有依赖 effect"]
        J --> K["11. dep.forEach(effect<br/>→ effect.run())"]
        K --> D
    end

    style A fill:#e3f2fd
    style D fill:#fff9c4
    style F fill:#ffccbc
    style I fill:#c8e6c9
```

#### 依赖收集数据结构

```
// effect.ts 模块级变量
let activeEffect: ReactiveEffect | undefined;  // 当前正在执行的 effect

// 依赖存储
targetMap: WeakMap<object, KeyToDepMap>
    └── depsMap: Map<PropertyKey, Dep>
        └── dep: Set<ReactiveEffect>

// 示例
state = reactive({ count: 0, name: 'vue' })

targetMap.get(state) → Map {
  'count' → Set { effect1, effect2 },   // effect1 和 effect2 都依赖 state.count
  'name'  → Set { effect1 }             // 只有 effect1 依赖 state.name
}
```

### 4. Patch 详细流程

#### 核心函数一览（renderer.ts）

| 函数 | 作用 |
|------|------|
| `patch(n1, n2, container)` | 入口：类型变了则销毁旧的，否则按 n2.type 分发到 processText / processElement / processComponent |
| `processText` | 处理文本 VNode：无 n1 则 createTextNode + insert，有 n1 则复用 el 并 setText |
| `processElement` | 处理元素 VNode：无 n1 → mountElement，有 n1 → patchElement |
| `mountElement(vnode, container)` | 首次挂载元素：createElement → patchProp → 递归 patch children → insert |
| `patchElement(n1, n2, container)` | 更新元素：复用 el → patchProps → patchChildren |
| `patchProps(el, old, new)` | 对比新旧 props：新增/更新属性，移除不存在的属性 |
| `patchChildren(n1, n2, el, container)` | 对比新旧 children：按 string / Array / null 三种情况处理，Array 时按索引逐个 patch |
| `processComponent` | 处理组件 VNode：无 n1 → mountComponent，有 n1 → updateComponent |
| `mountComponent(vnode, container)` | 首次挂载组件：createComponentInstance → setupComponent → setupRenderEffect → effect |
| `updateComponent(n1, n2)` | 更新组件：复用 instance，更新 vnode 引用，调用 instance.update() 重新执行 effect |

> `patch` 函数有两层 `!n1` 判断，各司其职：
> - **第一层**：`n1 && n1.type !== n2.type` — 类型变了，销毁旧 DOM 并当作全新挂载
> - **第二层**：每个 handler 内的 `!n1` — 判断是 mount 还是 update

#### 主流程图

```mermaid
flowchart TD
    A["patch(n1, n2, container)"] --> B{"n1 && n1.type !== n2.type"}
    B -->|"true"| C["options.remove(n1.el); n1 = null"]
    C --> D["type = n2.type"]
    B -->|"false"| D

    D -->|"type === Text"| E["processText"]
    D -->|"isString(type)"| F["processElement"]
    D -->|"else"| G["processComponent"]

    E --> E1{"!n1"}
    E1 -->|"true (mount)"| E2["createText + insert"]
    E1 -->|"false (patch)"| E3["复用 el, setText"]

    F --> F1{"!n1"}
    F1 -->|"true"| F2["mountElement"]
    F1 -->|"false"| F3["patchElement"]
    F2 --> F2A["createElement → patchProps → patch children → insert"]
    F3 --> F3A["复用 el → patchProps → patchChildren"]

    G --> G1{"!n1"}
    G1 -->|"true"| G2["mountComponent"]
    G1 -->|"false"| G3["updateComponent"]
    G2 --> G2A["createInstance → setup → setupRenderEffect → effect"]
    G3 --> G3A["复用 instance, 更新 vnode, instance.update()"]

    style A fill:#e3f2fd
    style D fill:#fff9c4
    style F1 fill:#ffccbc
    style G1 fill:#c8e6c9
```

### 5. 编译器流水线详细流程

#### 核心函数一览

| 文件 | 函数 | 作用 |
|------|------|------|
| `compile.ts` | `compile(template)` | 入口：parse → generate，返回 `(ctx) => VNode` 渲染函数 |
| `parse.ts` | `parse(template)` | 创建 ParserContext，调用 parseChildren，返回 ROOT AST |
| `parse.ts` | `parseChildren(context, ancestors)` | 递归下降解析：循环调用 isEnd 判断终止，否则按前缀分发到 parseInterpolation / parseElement / parseText |
| `parse.ts` | `parseElement(context, ancestors)` | 解析 `<tag>children</tag>`：正则匹配开始标签 → advanceBy → 递归 parseChildren → 匹配结束标签 → advanceBy |
| `parse.ts` | `parseInterpolation(context)` | 解析 `&#123;&#123; expression &#125;&#125;`：找到 `&#125;&#125;` → advanceBy → 返回 INTERPOLATION 节点 |
| `parse.ts` | `parseText(context)` | 解析纯文本：找到最近的 `<` 或 `&#123;&#123;` 位置 → advanceBy → 返回 TEXT 节点 |
| `parse.ts` | `isEnd(context, ancestors)` | 判断是否终止：source 为空 或 遇到祖先的结束标签 |
| `parse.ts` | `advanceBy(context, n)` | 消费 source 的前 n 个字符：`context.source = source.slice(n)` |
| `codegen.ts` | `generate(ast)` | 校验单根节点 → 调用 generateNode → 返回 `(ctx) => VNode` |
| `codegen.ts` | `generateNode(node, ctx)` | 按 node.type 分发：ELEMENT → h() 调用，TEXT → node.content，INTERPOLATION → resolveExpression |
| `codegen.ts` | `mergeChildren(children)` | 优化 children：全 string 则 join 为纯文本，否则纯 string 用 `h('span')` 包裹 |
| `codegen.ts` | `resolveExpression(ctx, expr)` | 从 ctx 中取插值变量的值，不存在则抛错 |

#### 主流程图

```mermaid
flowchart TD
    A["compile(template)"] --> B["parse(template)"]
    B --> C["parseChildren(context, ancestors=[])"]
    C --> D["循环: isEnd / parseInterpolation / parseElement / parseText"]
    D --> E["return ROOT { children }"]

    E --> F["generate(ast)"]
    F --> G["校验单根节点"]
    G --> H["generateNode(root, ctx)"]
    H --> I["ELEMENT → h(tag, null, mergeChildren(...))"]
    H --> J["TEXT → node.content"]
    H --> K["INTERPOLATION → resolveExpression(ctx, content)"]

    I --> L["mergeChildren: 优化 children 结构"]
    L --> M["return (ctx) => VNode"]

    style A fill:#e3f2fd
    style B fill:#fff9c4
    style F fill:#c8e6c9
    style H fill:#ffccbc
```

#### AST 结构示例

```text
template: "<div><p>count: {count}</p></div>"

AST:
{
  type: "ROOT",
  children: [
    { type: "ELEMENT", tag: "div", children: [
      { type: "ELEMENT", tag: "p", children: [
        { type: "TEXT", content: "count: " },
        { type: "INTERPOLATION", content: "count" }
      ]}
    ]}
  ]
}

生成的 render 函数:
(ctx) => h("div", null, h("p", null, "count: " + String(ctx.count)))
```

### 6. 组件挂载与更新流程

#### 核心函数一览（component.ts）

| 函数 | 作用 |
|------|------|
| `createComponentInstance(vnode)` | 创建组件实例：初始化 state、render、subTree、isMounted、update 等字段 |
| `setupComponent(instance, compile)` | 执行 component.setup()，将返回值用 reactive 包装为 instance.state，有 render 直接用，有 template 则先 compile |
| `setupRenderEffect(instance, vnode, container)` | 创建 `instance.update = () => effect(...)` 并立即调用：首次渲染时 patch subTree，更新时 patch 新旧 subTree |

#### 主流程时序图

```mermaid
sequenceDiagram
    participant Renderer as renderer.ts
    participant Component as component.ts
    participant Reactive as effect.ts

    Note over Renderer,Reactive: 首次挂载

    Renderer->>Component: createComponentInstance(vnode)
    Renderer->>Component: setupComponent(instance, compile)
    Component->>Component: setup() → reactive(result) → state
    Component->>Component: render = component.render || compile(template)
    Renderer->>Component: setupRenderEffect(instance, vnode, container)
    Component->>Reactive: effect(renderWrapper)
    Reactive->>Reactive: effect.run() → activeEffect = this
    Renderer->>Component: instance.render(instance.state) → subTree
    Component->>Reactive: 读取 state.xxx (track 收集依赖)
    Reactive->>Reactive: activeEffect = undefined
    Renderer->>Renderer: patch(null, subTree, container)

    Note over Renderer,Reactive: 响应式更新

    Reactive->>Reactive: state.xxx = newVal (set → trigger)
    Reactive->>Reactive: dep.forEach(effect → effect.run())
    Component->>Renderer: instance.render(instance.state) → nextTree
    Renderer->>Renderer: patch(prevTree, nextTree, container)
```

### 7. 时间线对比：mini-react vs min-vue

| 维度 | mini-react | min-vue |
|------|-----------|---------|
| 响应式 | 手动 setState 触发调度 | Proxy 自动 track/trigger |
| 更新粒度 | 整个 Fiber 树协调 | 组件级 effect 自动重新渲染 |
| 渲染调度 | 时间切片 + 可中断 | 同步 patch（无调度器） |
| 模板 | 无（createElement） | template → compile → render |
| 组件状态 | useState Hook | setup() + reactive state |
| DOM 操作 | 一次性 commit | 立即 patch |
| 双缓冲 | 有（alternate Fiber） | 无（直接原地 patch） |
| 调度 | 时间切片 + MessageChannel | 微任务 nextTick 合并更新 |

### 8. Scheduler 调度器

#### 解决什么问题

**没有 scheduler 时**：每次 `state.xxx = newVal` 触发 `trigger` → 立即 `effect.run()` → 同步 patch DOM。同一个同步代码块中修改 3 次 state 就会 patch 3 次，最后一次才是最终结果。

**有 scheduler 时**：`trigger` 不直接 `run()`，而是调用 `effect.scheduler()` → `queueJob(effect)` → 将 effect 加入 `Set` 去重 → 微任务 `Promise.resolve().then(flushJobs)` → 一次 `flushJobs` 统一执行所有 effect。

#### 核心函数一览

| 文件 | 函数 | 作用 |
|------|------|------|
| `scheduler.ts` | `nextTick(fn?)` | `Promise.resolve().then(fn)` 的封装，返回 Promise |
| `scheduler.ts` | `queueJob(job)` | 将 effect 加入队列（Set 去重），首次调用时通过 `nextTick` 注册 `flushJobs` |
| `scheduler.ts` | `flushJobs()` | 排空队列：遍历所有 effect 执行 `job.run()`，清空队列 |
| `effect.ts` | `ReactiveEffect(fn, scheduler?)` | 构造函数新增 `scheduler` 可选参数 |
| `effect.ts` | `trigger()` | 改为：如果 effect 有 scheduler 则调用 scheduler，否则直接 `effect.run()` |
| `renderer.ts` | `setupRenderEffect()` | 改为：创建 `new ReactiveEffect(componentUpdateFn, () => queueJob(componentEffect))` |

#### 主流程图

```mermaid
flowchart TD
    subgraph "无 scheduler (旧)"
        A1["state.count = 1"] --> B1["trigger → effect.run() → patch"]
        A2["state.name = 'a'"] --> B2["trigger → effect.run() → patch"]
        A3["state.count = 2"] --> B3["trigger → effect.run() → patch"]
        B1 --> B2 --> B3 --> C1["3 次同步 patch"]
    end

    subgraph "有 scheduler (新)"
        D1["state.count = 1"] --> E1["trigger → effect.scheduler()"]
        D2["state.name = 'a'"] --> E2["trigger → effect.scheduler()"]
        D3["state.count = 2"] --> E3["trigger → effect.scheduler()"]
        E1 --> F["queueJob(effect) → Set 去重"]
        E2 --> F
        E3 --> F
        F --> G{"isFlushPending?"}
        G -->|"否"| H["nextTick(flushJobs)"]
        H --> I["微任务队列: flushJobs"]
        I --> J["effect.run() → patch"]
        J --> K["1 次异步 patch"]
    end

    style C1 fill:#ffccbc
    style K fill:#c8e6c9
```

#### 关键代码变更

**effect.ts — trigger 判断 scheduler：**
```ts
// 旧：直接同步执行
dep.forEach((e) => e.run());

// 新：有 scheduler 则走调度，否则直接执行
dep.forEach((e) => {
  if (e.scheduler) { e.scheduler(); }
  else { e.run(); }
});
```

**renderer.ts — 组件 effect 传入 scheduler：**
```ts
// 旧：每次 instance.update() 创建新 effect
instance.update = () => {
  effect(() => { /* render + patch */ });
};

// 新：创建稳定的 ReactiveEffect，scheduler 引用自身入队
const componentEffect = new ReactiveEffect(
  () => { /* render + patch */ },
  () => queueJob(componentEffect)
);
instance.update = () => componentEffect.run();
```

**scheduler.ts — 调度核心：**
```ts
const queue = new Set();          // Set 天然去重
let isFlushPending = false;

export const queueJob = (job) => {
  queue.add(job);
  if (!isFlushPending) {
    isFlushPending = true;
    Promise.resolve().then(() => {  // 微任务
      isFlushPending = false;
      queue.forEach((j) => j.run());
      queue.clear();
    });
  }
};
```

#### scheduler 与 trigger / renderer 的协作关系

```mermaid
sequenceDiagram
    participant State as 响应式数据
    participant Trigger as trigger()
    participant Effect as ReactiveEffect
    participant Scheduler as scheduler.ts
    participant Micro as 微任务队列

    Note over State,Micro: 同步代码块中连续修改 3 次 state

    State->>Trigger: state.count = 1
    Trigger->>Effect: effect.scheduler()
    Effect->>Scheduler: queueJob(componentEffect)
    Scheduler->>Scheduler: Set.add(effect), isFlushPending = true
    Scheduler->>Micro: Promise.resolve().then(flushJobs)

    State->>Trigger: state.name = 'a'
    Trigger->>Effect: effect.scheduler()
    Effect->>Scheduler: queueJob(componentEffect)
    Scheduler->>Scheduler: Set.add(effect) 已存在，跳过

    State->>Trigger: state.count = 2
    Trigger->>Effect: effect.scheduler()
    Effect->>Scheduler: queueJob(componentEffect)
    Scheduler->>Scheduler: Set.add(effect) 已存在，跳过

    Note over Micro: 同步代码执行完毕，微任务执行

    Micro->>Scheduler: flushJobs()
    Scheduler->>Effect: effect.run() 仅一次
    Effect->>Effect: render + patch DOM
```

### 9. computed 实现详解

#### 核心字段与函数

| 字段/函数 | 位置 | 作用 |
|-----------|------|------|
| `_dirty` | `ComputedRefImpl` | dirty 标记：`true` 表示缓存失效，下次读取需重新计算 |
| `_value` | `ComputedRefImpl` | 缓存最近一次 getter 的返回值 |
| `_effect` | `ComputedRefImpl` | 内部 `ReactiveEffect`，执行 getter 并收集 getter 的依赖 |
| `dep` | `ComputedRefImpl` | `Set<ReactiveEffect>`，依赖此计算属性的外层 effect 集合 |
| `get value()` | `ComputedRefImpl` | 读取时：① 将当前 `activeEffect` 加入 `dep`  ② 若 `_dirty` 则执行 `_effect.run()` 重新计算  ③ 返回 `_value` |
| `scheduler` | `ComputedRefImpl._effect` | getter 依赖变化时：标记 `_dirty = true`，遍历 `dep` 触发所有外层 effect 的 `run/scheduler` |

#### 完整工作流程

```mermaid
sequenceDiagram
    participant Outer as 外层 effect
    participant Comp as ComputedRefImpl
    participant Inner as 内部 ReactiveEffect
    participant State as 响应式数据

    Note over Outer,State: 首次读取 comp.value

    Outer->>Comp: comp.value
    Comp->>Comp: activeEffect(Outer) 加入 dep
    Comp->>Comp: _dirty = true
    Comp->>Inner: _effect.run()
    Inner->>Inner: activeEffect = 内部 effect
    Inner->>State: getter 读取 state.xxx → track
    State-->>Inner: 返回 value
    Inner->>Inner: activeEffect = 恢复 (Outer)
    Inner-->>Comp: 返回计算结果
    Comp->>Comp: _value = 结果，_dirty = false
    Comp-->>Outer: 返回 _value

    Note over Outer,State: 依赖数据变化

    State->>Inner: set → trigger → scheduler()
    Inner->>Comp: 标记 _dirty = true
    Comp->>Comp: 遍历 dep 触发 effect
    Comp->>Outer: outer.run() 或 outer.scheduler()
    Outer->>Comp: comp.value（同上，重新计算 + 缓存）
```

### 10. watch 实现详解

#### 核心函数

| 函数 | 位置 | 作用 |
|------|------|------|
| `watch(source, cb, options?)` | `watch.ts` | 入口：根据 source 类型构造 getter，创建 ReactiveEffect，返回 stop 函数 |
| `traverse(value, seen)` | `watch.ts` | 深度遍历对象/数组，递归访问所有属性以收集深层依赖 |
| `job()` | watch 内部的 scheduler | 重新运行 getter → 调用 cleanup → 调用 `cb(newValue, oldValue, onCleanup)` |
| `onCleanup(fn)` | watch 内部的注册函数 | 注册清理函数，在下次 job 执行前调用 |

#### 完整工作流程

```mermaid
sequenceDiagram
    participant User as 用户代码
    participant Watch as watch()
    participant Effect as ReactiveEffect
    participant State as 响应式数据

    Note over User,State: 注册 watch

    User->>Watch: watch(() => state.count, cb)
    Watch->>Watch: 构造 getter: () => state.count
    Watch->>Watch: 定义 job scheduler
    Watch->>Effect: new ReactiveEffect(getter, job)
    Effect->>Effect: effect.run() 首次执行
    Effect->>State: getter 读取 state.count → track
    State-->>Effect: 返回 0
    Watch->>Watch: oldValue = 0

    Note over User,State: state.count = 1

    State->>State: Proxy set → trigger
    State->>Effect: scheduler → job()
    Effect->>Effect: effect.run() 重新执行 getter
    Effect->>State: getter 读取 state.count（重新 track）
    State-->>Effect: 返回 1
    Watch->>Watch: cleanup() 执行上一轮注册的清理函数
    Watch->>User: cb(1, 0, onCleanup)
    Watch->>Watch: oldValue = 1

    Note over User,State: stop()

    User->>Watch: stop()
    Watch->>Effect: effect.stop()
    Effect->>Effect: active = false，清空所有 deps
```

## 当前实现限制

- 仅支持单根模板节点。
- 仅支持基础元素、文本、`&#123;&#123;变量&#125;&#125;` 插值。
- children diff 是简化版（按索引更新），未实现 keyed diff。
- 未实现 `ref`、`shallowReactive`、`readonly` 等响应式 API。

## 下一步扩展建议

1. 实现 keyed diff，补齐列表更新优化能力。
2. 增加 `ref` / `toRef` / `toRefs`，完善响应式 API。
