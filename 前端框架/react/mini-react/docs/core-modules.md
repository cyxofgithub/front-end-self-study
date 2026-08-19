# 核心模块详解

各源码模块的职责与关键实现点。

## createElement.js

创建虚拟 DOM 对象，将 JSX 转换为虚拟 DOM。

```javascript
createElement(
    'div',
    { id: 'app' },
    'Hello',
    createElement('span', null, 'World')
);
```

## fiber.js

定义 Fiber 节点结构和工具函数：

-   `TAG`: 节点类型（HOST_COMPONENT、FUNCTION_COMPONENT、HOST_ROOT）
-   `EFFECT_TAG`: 副作用类型（PLACEMENT、UPDATE、DELETION）
-   `createFiber`: 创建 Fiber 节点
-   `createRootFiber`: 创建根 Fiber 节点

## scheduler.js

任务调度器，使用 React 原生 API 实现时间切片：

-   **MessageChannel**: 用于任务调度，`port.postMessage()` 会在浏览器空闲时执行回调
-   **requestAnimationFrame**: 获取帧开始时间（rafTime），精确对齐浏览器刷新节奏
    -   关键：不是「rAF + 16ms」，而是**一帧总预算约 16.6ms**（60Hz）。这 16.6ms 要完成整条流水线：`[rAF 回调] → [Layout] → [Paint] → [Composite]`，总耗时 ≤ 16.6ms 才不掉帧。把任务拆成 5ms 以内，是为了不占满预算，给浏览器留时间做布局和绘制。
-   **performance.now()**: 高精度时间戳，用于计算时间差
-   **shouldYieldToHost**: 判断是否需要让出主线程，每帧允许 5ms JS 执行
-   **performWorkUntilDeadline**: 工作循环入口，结合 `requestAnimationFrame` 和 `MessageChannel` 实现时间切片

**一帧时间线（含宏任务 / 微任务 / 同步代码）：**

```
帧 N 开始
    → [宏任务 1]（内含同步代码顺序执行）
    → [微任务队列清空]（该宏任务触发的 Promise、queueMicrotask 等）
    → （可有多轮 宏任务 → 微任务，直到到达渲染时机）
    → [rAF 回调]
    → [Layout] → [Paint] → [Composite]
    → 帧 N+1 开始
       ↑___________________________________________________________↑
                      总耗时必须 ≤ 16.6ms（才不会掉帧）
```

-   **同步代码**：在「当前正在执行的宏任务」内部顺序执行；一个宏任务未执行完，不会去执行下一个宏任务或 rAF。
-   **微任务**：当前宏任务中同步代码执行完后、下一个宏任务（或 rAF）之前，会清空整个微任务队列。
-   **rAF**：在浏览器下一次重绘前执行，与 Layout/Paint/Composite 同属本帧的渲染流水线。

## reconciler.js

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

## commit.js

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

## hooks.js

React Hooks 实现：

-   **useState**: 基于 Fiber 节点存储状态，使用队列管理状态更新
-   **useEffect**: 基于副作用链表管理 effect，通过依赖数组决定是否重新执行

Hooks 存储在 Fiber 节点的 `memoizedState` 上，形成一个链表。每次渲染时，通过工作指针（`workInProgressHook`）遍历链表。

[← 返回主文档](../README.md)
