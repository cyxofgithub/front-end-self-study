# Mini-React

一个精简的 React 实现，用于理解函数式组件从定义到浏览器渲染的完整流程。

## 项目结构

```
mini-react/
├── src/
│   ├── core/
│   │   ├── createElement.js      # 创建虚拟 DOM 对象
│   │   ├── fiber.js              # Fiber 节点定义和工具函数
│   │   ├── reconciler.js         # 协调阶段（可中断的渲染）
│   │   ├── commit.js             # 提交阶段（DOM 操作）
│   │   └── scheduler.js          # 调度器（任务调度和时间切片）
│   ├── events/
│   │   ├── SyntheticEvent.js     # 合成事件：包装原生事件
│   │   └── eventSystem.js        # 事件委托：根容器注册 + 统一派发
│   ├── hooks/
│   │   └── hooks.js              # useState 和 useEffect 实现
│   └── index.js                  # 主入口，提供 render 函数
├── docs/                         # 详细文档（见下方索引）
├── examples/
│   ├── example.html              # 示例页面
│   └── event-example.html        # 事件系统示例（冒泡/捕获/委托）
└── README.md                     # 本文档
```

## 文档索引

| 主题 | 内容 |
| --- | --- |
| [核心模块详解](./docs/core-modules.md) | createElement / fiber / scheduler / reconciler / commit / hooks 各模块职责与关键实现 |
| [模块交互流程图](./docs/render-flow.md) | 整体架构、渲染时序、协调/提交阶段、Hooks、时间切片共 6 张 Mermaid 图 |
| [事件系统](./docs/events.md) | 事件委托的实现：handler 存 Fiber、根容器统一注册、沿树派发 |

## 核心概念

### 1. 虚拟 DOM (Virtual DOM)

虚拟 DOM 是对真实 DOM 的抽象描述，格式为：

```javascript
{
  type: 'div',           // 元素类型或组件函数
  props: {                // 属性
    id: 'app',
    children: [...]      // 子节点
  }
}
```

### 2. Fiber 架构

Fiber 是 React 的协调器，每个组件对应一个 Fiber 节点：

```javascript
{
  tag: 'FUNCTION_COMPONENT',  // 节点类型
  type: Component,            // 组件函数
  props: {...},               // 属性
  stateNode: null,           // DOM 节点或组件实例
  child: null,               // 第一个子节点
  sibling: null,             // 下一个兄弟节点
  return: null,              // 父节点
  alternate: null,           // 对应的另一棵树上的节点（双缓冲）
  effectTag: 'PLACEMENT',    // 副作用类型
  effects: []                // 副作用链表
}
```

### 3. 渲染流程

```
1. 组件定义（函数式组件）
   ↓
2. createElement 创建虚拟 DOM
   ↓
3. render 初始化 Fiber 根节点
   ↓
4. scheduler 调度任务（时间切片）
   ↓
5. reconciler 协调阶段（可中断）
   - beginWork: 处理组件，执行函数获取子节点
   - reconcileChildren: 对比新旧节点，生成 Fiber 节点
   - completeWork: 创建 DOM 节点
   ↓
6. commit 提交阶段（不可中断）
   - beforeMutation: 执行 useEffect 清理函数
   - mutation: 执行 DOM 操作
   - layout: 执行 useEffect 回调
   ↓
7. 浏览器渲染
```

详细交互图见 [模块交互流程图](./docs/render-flow.md)。

## 使用方法

### 1. 打开示例页面

直接在浏览器中打开 `examples/example.html`（需要使用支持 ES6 模块的浏览器）。

### 2. 编写组件

```javascript
import { createElement, render, useState, useEffect } from './src/index.js';

function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log(`Count: ${count}`);
    }, [count]);

    return createElement(
        'div',
        null,
        createElement('p', null, `计数: ${count}`),
        createElement('button', { onClick: () => setCount(count + 1) }, '增加')
    );
}

render(createElement(Counter), document.getElementById('root'));
```

### 3. 事件系统示例

直接打开 `examples/event-example.html`，查看捕获/冒泡顺序、`stopPropagation`、事件委托下的闭包更新（详见 [事件系统](./docs/events.md)）。

## 关键实现点

1. **Fiber 双缓冲技术**：使用 `alternate` 指针连接新旧 Fiber 树
2. **工作循环**：深度优先遍历，通过 `child` → `sibling` → `return` 遍历
3. **副作用收集**：在 `completeWork` 阶段收集副作用，在 `commit` 阶段统一处理
4. **Hooks 存储**：将 hooks 存储在 Fiber 节点的 `memoizedState` 上
5. **时间切片**：使用 `MessageChannel` + `requestAnimationFrame` + `performance.now()`，通过 `shouldYieldToHost` 判断，每帧允许 5ms JS 执行（与 React 源码一致）
6. **事件委托**：handler 只存 Fiber props，监听器统一注册在根容器；派发时靠 expando 属性登记（`__reactFiber$mini`/`__reactProps$mini`，与源码 ReactDOMComponentTree 一致）+ 沿 `return` 指针上溯收集执行路径（详见 [事件系统](./docs/events.md)）

## 与 React 源码的对应关系

| Mini-React         | React 源码                |
| ------------------ | ------------------------- |
| `createElement.js` | `ReactElement.js`         |
| `fiber.js`         | `ReactFiber.js`           |
| `scheduler.js`     | `Scheduler.js`            |
| `reconciler.js`    | `ReactFiberReconciler.js` |
| `commit.js`        | `ReactFiberCommitWork.js` |
| `hooks.js`         | `ReactHooks.js`           |
| `events/eventSystem.js` | `dom-plugin-event-system`（`DOMPluginEventSystem.js`、`ReactDOMEventListener.js`） |
| `events/SyntheticEvent.js` | `SyntheticEventType.js` + `createSyntheticEvent` 工厂 |

## 学习要点

1. **虚拟 DOM 的作用**：虚拟 DOM 是对 UI 的抽象描述，不关注具体的渲染细节
2. **Fiber 的作用**：Fiber 是 React 的协调器，负责协调虚拟 DOM 的渲染
3. **时间切片**：通过 MessageChannel 和 requestAnimationFrame 实现可中断的渲染
4. **协调阶段**：可中断，负责计算差异
5. **提交阶段**：不可中断，负责执行 DOM 操作
6. **Hooks 原理**：基于链表结构，通过调用顺序来访问对应的 Hook
7. **事件委托**：监听器在根容器，handler 在 Fiber 上，派发时沿树上溯收集（详见 [事件系统](./docs/events.md)）

## 注意事项

-   这是一个教学项目，代码精简，去除了生产环境的复杂优化
-   仅支持函数式组件和基础的 Hooks（useState、useEffect）
-   不支持 JSX 语法，需要使用 `createElement` 函数
-   需要在支持 ES6 模块的浏览器中运行

## 参考资源

-   [React 源码](https://github.com/facebook/react)
-   [React Fiber 架构](https://github.com/acdlite/react-fiber-architecture)
-   [React Hooks 原理](https://react.dev/reference/react)
