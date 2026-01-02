# React 18 前后批处理原理

## 什么是批处理？

批处理（Batching）是指将多个状态更新合并为一次渲染，减少不必要的重渲染，提升性能。

## React 18 之前的批处理

### 特点

**只在特定上下文中自动批处理：**

-   ✅ 合成事件（Synthetic Events）中
-   ✅ 生命周期方法中
-   ❌ 异步操作中（setTimeout、Promise、原生事件等）**不会自动批处理**

> **合成事件简介**：React 对浏览器原生事件的封装，提供跨浏览器一致性。React 会在合成事件处理函数外层自动调用 `batchedUpdates`，因此事件回调中的多个 `setState` 会被自动批处理。例如 `onClick`、`onChange` 等都是合成事件。

### 示例

```javascript
// ✅ 会批处理：合成事件中
function handleClick() {
    setCount((c) => c + 1);
    setName('new name');
    // 只触发一次渲染
}

// ❌ 不会批处理：异步操作中
setTimeout(() => {
    setCount((c) => c + 1);
    setName('new name');
    // 触发两次渲染！
}, 1000);
```

### 底层原理

**核心机制：`batchedUpdates` + 更新队列**

```javascript
// 简化版源码逻辑
let isBatchingUpdates = false; // 批处理标志
let updateQueue = []; // 更新队列

// 1. 事件处理函数被 batchedUpdates 包装
function batchedUpdates(callback) {
    const previousIsBatching = isBatchingUpdates;
    isBatchingUpdates = true; // 开启批处理模式

    try {
        callback(); // 执行事件处理函数
    } finally {
        isBatchingUpdates = previousIsBatching;

        // 2. 批处理结束后，统一执行所有更新
        if (!isBatchingUpdates) {
            flushUpdates(updateQueue);
            updateQueue.length = 0;
        }
    }
}

// 3. setState 时检查是否在批处理模式
function setState(update) {
    if (isBatchingUpdates) {
        // 批处理模式：加入队列，暂不执行
        updateQueue.push(update);
    } else {
        // 非批处理模式：立即执行
        flushUpdates([update]);
    }
}
```

**为什么异步操作不会批处理？**

1. **合成事件**：React 会在事件处理函数外层自动调用 `batchedUpdates`

    ```javascript
    // React 内部处理
    element.addEventListener('click', (e) => {
        batchedUpdates(() => {
            handleClick(e); // 你的处理函数
        });
    });
    ```

2. **异步操作**：执行时已经脱离了 `batchedUpdates` 的上下文
    ```javascript
    setTimeout(() => {
      // 此时 isBatchingUpdates = false
      setState(...);  // 立即执行，不会批处理
    }, 1000);
    ```

### 解决方案（React 18 前）

使用 `unstable_batchedUpdates` 手动开启批处理：

```javascript
import { unstable_batchedUpdates } from 'react-dom';

setTimeout(() => {
    unstable_batchedUpdates(() => {
        setCount((c) => c + 1);
        setName('new name');
        // 现在会批处理了
    });
}, 1000);
```

## React 18+ 的自动批处理

### 特点

**所有更新都会自动批处理，包括：**

-   ✅ 合成事件中
-   ✅ 生命周期方法中
-   ✅ **异步操作中**（setTimeout、Promise、原生事件等）
-   ✅ 任何其他场景

### 示例

```javascript
// ✅ 所有场景都会自动批处理
function handleClick() {
    setCount((c) => c + 1);
    setName('new name');
    // 只触发一次渲染
}

setTimeout(() => {
    setCount((c) => c + 1);
    setName('new name');
    // 现在也只会触发一次渲染！
}, 1000);

fetch('/api').then(() => {
    setCount((c) => c + 1);
    setName('new name');
    // 也会批处理！
});
```

### 底层原理

**核心改进：基于更新优先级的统一调度**

```javascript
// React 18+ 简化版逻辑
let updateQueue = [];
let scheduledCallback = null; // 调度回调

// 1. 所有 setState 都先加入队列
function setState(update) {
    updateQueue.push(update);

    // 2. 使用调度器统一调度（而非立即执行）
    if (!scheduledCallback) {
        scheduledCallback = scheduleCallback(() => {
            flushUpdates(updateQueue);
            updateQueue.length = 0;
            scheduledCallback = null;
        });
    }
}

// 3. 调度器确保在同一"批次"中的更新会被合并
function scheduleCallback(callback) {
    // React 18 主要使用微任务（Promise/queueMicrotask）调度
    // 关键：微任务在当前事件循环的最后执行，确保同一批次内的更新被合并
    return scheduleMicroTask(callback);
}

// 4. 微任务的具体实现（简化版）
function scheduleMicroTask(callback) {
    // 使用 Promise.resolve().then() 或 queueMicrotask 创建微任务
    Promise.resolve().then(callback);
    // 或：queueMicrotask(callback);
}

// 5. 执行所有累积的更新
function flushUpdates(updates) {
    // 合并所有更新，只触发一次渲染
    updates.forEach((update) => {
        // 应用更新到组件状态
        applyUpdate(update);
    });
    // 只执行一次 Diff 和 DOM 更新
    performRender();
}
```

**合并机制详解：**

1. **更新队列累积**：

    ```javascript
    setState(1); // updateQueue = [1], scheduledCallback = 微任务A
    setState(2); // updateQueue = [1, 2], scheduledCallback 已存在（复用微任务A）
    setState(3); // updateQueue = [1, 2, 3], scheduledCallback 已存在（复用微任务A）
    ```

2. **微任务只调度一次**：

    - 第一个 `setState` 时创建微任务并加入微任务队列
    - 后续的 `setState` 只往 `updateQueue` 添加更新，**不会创建新的微任务**
    - 关键：`scheduledCallback` 标志确保同一批次只调度一次

3. **执行时机**：

    ```
    时间线：
    [宏任务：setTimeout回调执行]
      ├─ setState(1) → updateQueue.push(1), 创建微任务A
      ├─ setState(2) → updateQueue.push(2), 微任务A已存在
      ├─ setState(3) → updateQueue.push(3), 微任务A已存在
      └─ 宏任务执行完毕

    [微任务队列执行]
      └─ 微任务A执行 → flushUpdates([1, 2, 3]) → 只渲染一次
    ```

**关键机制：**

1. **统一调度入口**：所有更新都通过调度器，不再依赖 `batchedUpdates` 上下文
2. **异步任务调度**：**主要使用微任务（Promise/queueMicrotask）统一调度**
    - 微任务在当前事件循环的最后执行，能确保同一批次内的所有更新被合并
    - 微任务优先于宏任务执行，响应更快
    - 极少数情况下可能使用宏任务（如某些特殊异步场景）
3. **同一批次合并**：在同一事件循环周期内的更新会被自动合并

### 特殊情况：需要立即更新

使用 `flushSync` 强制同步更新（会打断批处理）：

```javascript
import { flushSync } from 'react-dom';

function handleClick() {
    flushSync(() => {
        setCount((c) => c + 1); // 立即更新
    });
    setName('new name'); // 单独批处理
}
```

## 对比总结

| 特性       | React 18 前    | React 18+     |
| ---------- | -------------- | ------------- |
| 合成事件   | ✅ 自动批处理  | ✅ 自动批处理 |
| 生命周期   | ✅ 自动批处理  | ✅ 自动批处理 |
| setTimeout | ❌ 不批处理    | ✅ 自动批处理 |
| Promise    | ❌ 不批处理    | ✅ 自动批处理 |
| 原生事件   | ❌ 不批处理    | ✅ 自动批处理 |
| 实现方式   | 基于上下文标志 | 基于统一调度  |

## 性能影响

**批处理的好处：**

-   减少渲染次数：多次更新合并为一次
-   减少 Diff 计算：避免重复的虚拟 DOM 对比
-   提升用户体验：减少页面闪烁和卡顿

## 总结

-   **React 18 前**：批处理依赖上下文（`batchedUpdates`），异步操作需要手动处理
-   **React 18+**：所有更新统一通过调度器处理，自动批处理所有场景
-   **核心改进**：从"上下文驱动"改为"调度器驱动"，实现真正的自动批处理
