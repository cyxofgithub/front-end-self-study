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
│   ├── hooks/
│   │   └── hooks.js              # useState 和 useEffect 实现
│   └── index.js                  # 主入口，提供 render 函数
├── examples/
│   └── example.html              # 示例页面
└── README.md                     # 项目说明
```

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

### 4. 模块交互流程图

#### 4.1 整体架构图

```mermaid
graph TB
    subgraph "用户代码"
        A[组件定义] --> B[createElement]
        B --> C[render]
    end

    subgraph "index.js"
        C --> D[createRootFiber]
        D --> E[updateContainer]
    end

    subgraph "scheduler.js"
        E --> F[scheduleWork]
        F --> G[MessageChannel]
        G --> H[performWorkUntilDeadline]
        H --> I[workLoop]
        I --> J{时间片用完?}
        J -->|否| K[performUnitOfWork]
        J -->|是| L[让出主线程]
        L --> G
    end

    subgraph "reconciler.js"
        K --> M[beginWork]
        M --> N{节点类型}
        N -->|函数组件| O[updateFunctionComponent]
        N -->|原生DOM| P[updateHostComponent]
        N -->|根节点| Q[updateHostRoot]
        O --> R[执行组件函数]
        R --> S[调用 Hooks]
        S --> T[reconcileChildren]
        P --> T
        Q --> T
        T --> U[生成 Fiber 节点]
        U --> V[completeWork]
        V --> W[收集副作用]
        W --> X{还有工作?}
        X -->|是| K
        X -->|否| Y[commitRoot]
    end

    subgraph "commit.js"
        Y --> Z[beforeMutation]
        Z --> AA[mutation]
        AA --> AB[layout]
        AB --> AC[DOM 更新完成]
    end

    subgraph "hooks.js"
        S --> AD[useState]
        S --> AE[useEffect]
        AD --> AF[状态更新队列]
        AE --> AG[副作用链表]
    end

    AC --> AH[浏览器渲染]

    style A fill:#e1f5ff
    style AH fill:#c8e6c9
    style F fill:#fff9c4
    style Y fill:#ffccbc
```

#### 4.2 完整渲染流程时序图

```mermaid
sequenceDiagram
    participant User as 用户代码
    participant Index as index.js
    participant Reconciler as reconciler.js
    participant Scheduler as scheduler.js
    participant Hooks as hooks.js
    participant Commit as commit.js
    participant DOM as 浏览器DOM

    User->>Index: render(element, container)
    Index->>Index: createRootFiber(container)
    Index->>Reconciler: updateContainer(rootFiber)

    Reconciler->>Scheduler: scheduleWork(fiber, performUnitOfWork)
    Scheduler->>Scheduler: MessageChannel.postMessage()

    loop 时间切片循环
        Scheduler->>Scheduler: requestAnimationFrame()
        Scheduler->>Scheduler: workLoop(startTime)

        loop 工作单元循环
            Scheduler->>Reconciler: performUnitOfWork(fiber)
            Reconciler->>Reconciler: beginWork(fiber)

            alt 函数组件
                Reconciler->>Hooks: setCurrentlyRenderingFiber(fiber)
                Reconciler->>Reconciler: 执行组件函数 type(props)
                Reconciler->>Hooks: useState/useEffect
                Hooks-->>Reconciler: 返回状态/副作用
            end

            Reconciler->>Reconciler: reconcileChildren(fiber, children)
            Reconciler->>Reconciler: createFiberFromElement()
            Reconciler->>Reconciler: completeWork(fiber)
            Reconciler->>Reconciler: 收集副作用到 effects
            Reconciler-->>Scheduler: 返回下一个工作单元
        end

        Scheduler->>Scheduler: shouldYieldToHost()?
        alt 时间片用完
            Scheduler->>Scheduler: 让出主线程
        end
    end

    Reconciler->>Commit: commitRoot(rootFiber, deletions)

    Commit->>Commit: beforeMutation (清理 useEffect)
    Commit->>DOM: mutation (DOM 操作)
    Commit->>DOM: commitPlacement (新增)
    Commit->>DOM: commitUpdate (更新)
    Commit->>DOM: commitDeletion (删除)
    Commit->>Commit: layout (执行 useEffect)

    DOM->>DOM: 浏览器渲染
```

#### 4.3 协调阶段详细流程

```mermaid
flowchart TD
    A[performUnitOfWork] --> B[beginWork]
    B --> C{节点类型判断}

    C -->|HOST_ROOT| D[updateHostRoot]
    C -->|FUNCTION_COMPONENT| E[updateFunctionComponent]
    C -->|HOST_COMPONENT| F[updateHostComponent]

    D --> G[reconcileChildren]
    E --> H[setCurrentlyRenderingFiber]
    H --> I[执行组件函数 type props]
    I --> J[调用 Hooks]
    J --> G
    F --> K{首次渲染?}
    K -->|是| L[createDOMNode]
    K -->|否| G
    L --> G

    G --> M[遍历 children]
    M --> N{对比新旧节点}
    N -->|类型相同| O[复用节点 UPDATE]
    N -->|类型不同| P[创建新节点 PLACEMENT]
    N -->|旧节点多余| Q[标记删除 DELETION]

    O --> R[建立 Fiber 关系]
    P --> R
    Q --> R

    R --> S{有子节点?}
    S -->|是| T[返回 child]
    S -->|否| U[completeWork]

    T --> A
    U --> V[收集副作用到 effects]
    V --> W{有兄弟节点?}
    W -->|是| X[返回 sibling]
    W -->|否| Y{有父节点?}
    Y -->|是| U
    Y -->|否| Z[所有工作完成]

    X --> A
    Z --> AA[commitRoot]

    style A fill:#e3f2fd
    style G fill:#fff9c4
    style U fill:#ffccbc
    style AA fill:#c8e6c9
```

#### 4.4 提交阶段详细流程

```mermaid
flowchart TD
    A[commitRoot] --> B[beforeMutation 阶段]
    B --> C[遍历 effects 链表]
    C --> D{有 cleanup?}
    D -->|是| E[执行清理函数]
    D -->|否| F[继续遍历]
    E --> F
    F --> G{还有节点?}
    G -->|是| C
    G -->|否| H[mutation 阶段]

    H --> I[处理 deletions]
    I --> J[commitDeletion]
    J --> K[删除 DOM 节点]

    H --> L[遍历 effects 链表]
    L --> M[commitWork]
    M --> N{effectTag}
    N -->|PLACEMENT| O[commitPlacement]
    N -->|UPDATE| P[commitUpdate]

    O --> Q[getParentDOM]
    Q --> R[appendChild]

    P --> S{文本节点?}
    S -->|是| T[更新 nodeValue]
    S -->|否| U[updateDOMProperties]

    L --> V{还有节点?}
    V -->|是| L
    V -->|否| W[layout 阶段]

    W --> X[遍历 effects 链表]
    X --> Y{有 effectCallback?}
    Y -->|是| Z[执行 effect 回调]
    Y -->|否| AA[继续遍历]
    Z --> AA
    AA --> AB{还有节点?}
    AB -->|是| X
    AB -->|否| AC[提交完成]

    AC --> AD[设置 alternate]
    AD --> AE[浏览器渲染]

    style A fill:#e3f2fd
    style B fill:#fff9c4
    style H fill:#ffccbc
    style W fill:#c8e6c9
    style AE fill:#a5d6a7
```

#### 4.5 Hooks 工作流程

```mermaid
flowchart TD
    A[组件函数执行] --> B[setCurrentlyRenderingFiber]
    B --> C[初始化 workInProgressHook]

    C --> D{调用 Hook}
    D -->|useState| E[useState]
    D -->|useEffect| F[useEffect]

    E --> G{首次渲染?}
    G -->|是| H[创建 Hook 节点]
    G -->|否| I[获取已有 Hook]
    H --> J[初始化 memoizedState]
    I --> K[处理更新队列]
    K --> L[更新 memoizedState]
    J --> M[创建 setState 函数]
    L --> M
    M --> N[返回 state, setState]

    F --> O{首次渲染?}
    O -->|是| P[创建 Hook 节点]
    O -->|否| Q[获取已有 Hook]
    P --> R[设置 effectCallback]
    Q --> S{依赖变化?}
    S -->|是| T[设置 cleanup 和 effectCallback]
    S -->|否| U[跳过执行]
    R --> V[存储到 fiber.effectCallback]
    T --> V

    N --> W[workInProgressHook = hook.next]
    V --> W
    W --> X{还有 Hook?}
    X -->|是| D
    X -->|否| Y[组件渲染完成]

    Y --> Z[completeWork]
    Z --> AA[收集副作用]

    style A fill:#e3f2fd
    style E fill:#fff9c4
    style F fill:#fff9c4
    style AA fill:#ffccbc
```

#### 4.6 时间切片机制

```mermaid
sequenceDiagram
    participant Scheduler as scheduler.js
    participant Browser as 浏览器
    participant Reconciler as reconciler.js

    Scheduler->>Browser: requestAnimationFrame()
    Browser-->>Scheduler: rafTime (帧开始时间)

    Scheduler->>Scheduler: frameStartTime = rafTime

    loop 工作循环
        Scheduler->>Reconciler: performUnitOfWork(fiber)
        Reconciler-->>Scheduler: nextFiber

        Scheduler->>Scheduler: performance.now()
        Scheduler->>Scheduler: shouldYieldToHost()

        alt 时间片未用完 (< 5ms)
            Scheduler->>Scheduler: 继续执行
        else 时间片用完 (>= 5ms)
            Scheduler->>Browser: 让出主线程
            Browser->>Browser: 执行其他任务
            Browser->>Scheduler: MessageChannel 回调
            Scheduler->>Browser: requestAnimationFrame()
        end
    end

    alt 还有未完成工作
        Scheduler->>Browser: port.postMessage()
        Browser->>Scheduler: MessageChannel 回调
    else 所有工作完成
        Scheduler->>Scheduler: isScheduled = false
    end
```

## 核心模块

### createElement.js

创建虚拟 DOM 对象，将 JSX 转换为虚拟 DOM。

```javascript
createElement(
    'div',
    { id: 'app' },
    'Hello',
    createElement('span', null, 'World')
);
```

### fiber.js

定义 Fiber 节点结构和工具函数：

-   `TAG`: 节点类型（HOST_COMPONENT、FUNCTION_COMPONENT、HOST_ROOT）
-   `EFFECT_TAG`: 副作用类型（PLACEMENT、UPDATE、DELETION）
-   `createFiber`: 创建 Fiber 节点
-   `createRootFiber`: 创建根 Fiber 节点

### scheduler.js

任务调度器，使用 React 原生 API 实现时间切片：

-   **MessageChannel**: 用于任务调度，`port.postMessage()` 会在浏览器空闲时执行回调
-   **requestAnimationFrame**: 获取帧开始时间（rafTime），精确对齐浏览器刷新节奏
-   **performance.now()**: 高精度时间戳，用于计算时间差
-   **shouldYieldToHost**: 判断是否需要让出主线程，每帧允许 5ms JS 执行
-   **performWorkUntilDeadline**: 工作循环入口，结合 `requestAnimationFrame` 和 `MessageChannel` 实现时间切片

### reconciler.js

协调器，负责协调阶段的工作：

-   **beginWork**: 处理当前 Fiber 节点，返回子节点
-   **completeWork**: 完成当前节点的工作，构建 DOM 节点
-   **reconcileChildren**: 协调子节点，生成新的 Fiber 节点
-   **performUnitOfWork**: 执行单个工作单元（深度优先遍历）

**fiber 树的遍历顺序**

```
        Root
         ↓ child
        App
      ↙    ↛
   div    button   (sibling)
    ↓       ↓
  span   "Click"
```

### commit.js

提交阶段，将协调阶段计算出的更新应用到实际的 DOM：

-   **commitRoot**: 提交根节点
-   **commitWork**: 提交单个节点
-   **commitPlacement**: 处理新增节点
-   **commitUpdate**: 处理更新节点
-   **commitDeletion**: 处理删除节点

三个子阶段：

1. **beforeMutation**: 执行 useEffect 清理函数
2. **mutation**: 执行 DOM 操作
3. **layout**: 执行 useEffect 回调

### hooks.js

React Hooks 实现：

-   **useState**: 基于 Fiber 节点存储状态，使用队列管理状态更新
-   **useEffect**: 基于副作用链表管理 effect，通过依赖数组决定是否重新执行

Hooks 存储在 Fiber 节点的 `memoizedState` 上，形成一个链表。每次渲染时，通过工作指针（`workInProgressHook`）遍历链表。

## 使用方法

### 1. 打开示例页面

直接在浏览器中打开 `examples/example.html`（需要使用支持 ES6 模块的浏览器）。

### 2. 编写组件

```javascript
import { createElement, render } from './src/index.js';
import { useState, useEffect } from './src/hooks/hooks.js';

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

## 关键实现点

1. **Fiber 双缓冲技术**：使用 `alternate` 指针连接新旧 Fiber 树
2. **工作循环**：深度优先遍历，通过 `child` → `sibling` → `return` 遍历
3. **副作用收集**：在 `completeWork` 阶段收集副作用，在 `commit` 阶段统一处理
4. **Hooks 存储**：将 hooks 存储在 Fiber 节点的 `memoizedState` 上
5. **时间切片**：使用 `MessageChannel` + `requestAnimationFrame` + `performance.now()`，通过 `shouldYieldToHost` 判断，每帧允许 5ms JS 执行（与 React 源码一致）

## 与 React 源码的对应关系

| Mini-React         | React 源码                |
| ------------------ | ------------------------- |
| `createElement.js` | `ReactElement.js`         |
| `fiber.js`         | `ReactFiber.js`           |
| `scheduler.js`     | `Scheduler.js`            |
| `reconciler.js`    | `ReactFiberReconciler.js` |
| `commit.js`        | `ReactFiberCommitWork.js` |
| `hooks.js`         | `ReactHooks.js`           |

## 学习要点

1. **虚拟 DOM 的作用**：虚拟 DOM 是对 UI 的抽象描述，不关注具体的渲染细节
2. **Fiber 的作用**：Fiber 是 React 的协调器，负责协调虚拟 DOM 的渲染
3. **时间切片**：通过 MessageChannel 和 requestAnimationFrame 实现可中断的渲染
4. **协调阶段**：可中断，负责计算差异
5. **提交阶段**：不可中断，负责执行 DOM 操作
6. **Hooks 原理**：基于链表结构，通过调用顺序来访问对应的 Hook

## 注意事项

-   这是一个教学项目，代码精简，去除了生产环境的复杂优化
-   仅支持函数式组件和基础的 Hooks（useState、useEffect）
-   不支持 JSX 语法，需要使用 `createElement` 函数
-   需要在支持 ES6 模块的浏览器中运行

## 参考资源

-   [React 源码](https://github.com/facebook/react)
-   [React Fiber 架构](https://github.com/acdlite/react-fiber-architecture)
-   [React Hooks 原理](https://react.dev/reference/react)
