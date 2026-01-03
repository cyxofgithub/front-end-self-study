# useLayoutEffect 和 useEffect 的区别及底层原理

## 核心区别

### 执行时机

-   **useEffect**：在浏览器**绘制之后**异步执行，不会阻塞浏览器绘制
-   **useLayoutEffect**：在浏览器**绘制之前**同步执行，会阻塞浏览器绘制

### 执行流程对比

```
React 渲染流程：
1. 协调阶段（Reconciliation）- 生成 Fiber 树、diff 计算变更，可中断
2. 提交阶段（Commit）- 执行 dom 操作和副作用，不可中断
   ├─ Before Mutation（DOM 更新前）
   ├─ Mutation（执行 DOM 操作）
   └─ Layout（DOM 更新后，浏览器绘制前）
      ├─ useLayoutEffect 在这里同步执行 ⚡
      └─ 更新 ref、执行生命周期
3. 浏览器绘制（Paint）
4. useEffect 在这里异步执行 🎨
```

## 使用场景

### useEffect（默认选择）

适用于大多数副作用场景：

-   数据获取（API 请求）
-   订阅事件
-   设置定时器
-   手动操作 DOM（不依赖布局）

```javascript
useEffect(() => {
    // 异步执行，不阻塞渲染
    fetchData();
    return () => {
        // 清理函数
    };
}, [deps]);
```

### useLayoutEffect（特殊场景）

适用于需要**同步读取 DOM 布局**的场景：

-   测量 DOM 尺寸
-   调整滚动位置
-   防止视觉闪烁（在绘制前修改样式）

```javascript
useLayoutEffect(() => {
    // 同步执行，阻塞绘制
    const height = elementRef.current.offsetHeight;
    // 在浏览器绘制前修改样式，避免闪烁
    elementRef.current.style.height = `${height}px`;
}, [deps]);
```

## 底层原理

### React 渲染流程

React 的渲染分为两个阶段：

1. **协调阶段（Reconciliation）**：可中断，生成 Fiber 树
2. **提交阶段（Commit）**：不可中断，执行 DOM 操作

### Commit 阶段的三个子阶段

```javascript
// 伪代码展示执行顺序
function commitRoot(root) {
    // 1. Before Mutation：DOM 更新前
    commitBeforeMutationEffects();

    // 2. Mutation：执行 DOM 操作
    commitMutationEffects();

    // 3. Layout：DOM 更新后，浏览器绘制前
    commitLayoutEffects(); // useLayoutEffect 在这里执行

    // 4. 浏览器绘制（Paint）
    // 5. useEffect 的 effect 在这里异步执行
    scheduleEffectCallback(); // useEffect 在这里执行
}
```

### Hook 存储结构

两个 Hook 在 Fiber 节点中的存储结构相同：

```javascript
// Fiber 节点中的 Hook 链表
fiber.memoizedState = {
  deps: [依赖数组],
  effect: 副作用函数,
  cleanup: 清理函数,
  tag: 'useEffect' | 'useLayoutEffect', // 标记类型
  next: 下一个 Hook
};
```

### 执行机制

**useLayoutEffect**：

-   在 `commitLayoutEffects` 阶段**同步**执行
-   使用 `flushSync` 同步调度，阻塞浏览器绘制
-   适合需要立即读取 DOM 的场景

**useEffect**：

-   在 `commitLayoutEffects` 后**异步**调度
-   使用 `scheduleCallback` 异步调度，不阻塞绘制
-   **异步实现机制**：
    -   React 使用 `Scheduler` 包来调度任务
    -   **优先使用 `MessageChannel`**：通过 `postMessage` 实现异步调度（现代浏览器）
        -   原因：`MessageChannel` 的优先级比 `setTimeout` 更高，执行更及时
        -   实现：创建 `MessageChannel`，通过 `port1.postMessage` 触发，在 `port2.onmessage` 中执行回调
    -   **降级到 `setTimeout`**：如果 `MessageChannel` 不可用，则使用 `setTimeout(fn, 0)` 作为降级方案
    -   实际执行时机：在浏览器完成绘制后的下一个事件循环中执行

## 性能影响

### useEffect（推荐）

✅ **优点**：

-   不阻塞浏览器绘制，用户体验更好
-   适合大多数场景

❌ **缺点**：

-   可能出现视觉闪烁（先绘制旧状态，再更新）

### useLayoutEffect（谨慎使用）

✅ **优点**：

-   可以避免视觉闪烁
-   同步读取 DOM，数据更准确

❌ **缺点**：

-   阻塞浏览器绘制，可能影响性能
-   执行时间过长会导致页面卡顿

## 实际示例

### 防止闪烁的场景

```javascript
function App() {
    const [width, setWidth] = useState(0);
    const divRef = useRef(null);

    // ❌ 使用 useEffect 会闪烁
    useEffect(() => {
        setWidth(divRef.current.offsetWidth);
    }, []);

    // ✅ 使用 useLayoutEffect 不会闪烁
    useLayoutEffect(() => {
        setWidth(divRef.current.offsetWidth);
    }, []);

    return <div ref={divRef}>宽度: {width}px</div>;
}
```

### 数据获取场景

```javascript
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);

    // ✅ useEffect 更适合数据获取
    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]);

    return <div>{user?.name}</div>;
}
```

## 总结

| 特性     | useEffect    | useLayoutEffect  |
| -------- | ------------ | ---------------- |
| 执行时机 | 浏览器绘制后 | 浏览器绘制前     |
| 执行方式 | 异步         | 同步             |
| 阻塞渲染 | 否           | 是               |
| 使用场景 | 大多数副作用 | DOM 测量、防闪烁 |
| 性能影响 | 较小         | 可能较大         |
| 推荐度   | ⭐⭐⭐⭐⭐   | ⭐⭐⭐           |

**最佳实践**：默认使用 `useEffect`，只有在需要同步读取 DOM 或防止闪烁时才使用 `useLayoutEffect`。
