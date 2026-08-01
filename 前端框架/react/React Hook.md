## React Hook

### Hooks 优缺点

#### 优点

**1. 逻辑复用更自然 —— 告别 HOC 嵌套地狱**

Class 组件复用逻辑只能靠 HOC、render props，层层嵌套导致"包装器地狱"：

```jsx
// Class 组件时代：层层嵌套，调试时组件树一坨
export default withRouter(withAuth(withTheme(withStyles(MyComponent))))
```

Hooks 通过自定义 Hook 扁平化复用：

```jsx
// Hooks 时代：组合式调用，逻辑清晰
function MyComponent() {
  const router = useRouter()
  const user = useAuth()
  const theme = useTheme()
  const styles = useStyles()
  // ...
}
```

**2. 关注点分离 —— 按逻辑而非生命周期组织代码**

Class 组件中不相关的逻辑被迫分散在不同的生命周期方法中，Hooks 可以按功能聚合在一起：

```jsx
// Class 组件：订阅和埋点逻辑散落在 componentDidMount / componentWillUnmount
class FriendStatus extends React.Component {
  componentDidMount() {
    subscribeToFriendStatus(...)
    trackPageView(...)
  }
  componentWillUnmount() {
    unsubscribeFromFriendStatus(...)
    trackPageClose(...)
  }
}

// Hooks：将同一关注点的设置和清理放在一起
function FriendStatus() {
  useFriendSubscription(id)    // 订阅相关逻辑封装在一起
  usePageTracking(id)          // 埋点相关逻辑封装在一起
}
```

**3. 函数式思维 —— 更简洁、组合性更强**

- 代码量显著减少：Class 组件改为函数组件通常能减少 20-30% 代码，省掉 `this`、`render()`、`constructor` 等样板代码
- 自定义 Hook 可以扁平组合，不产生额外组件层级（对比 HOC 层层嵌套）
- 每个 Hook 是独立的命名导出（`useState`、`useEffect` 等），打包工具可精确到单个 Hook 做 tree-shaking；而 Class 组件继承 `React.Component` 就携带了整个基类的全部生命周期逻辑
- 符合 React 并发渲染（Fiber + Scheduler）的"快照"模型：每次渲染是一次独立的函数调用，不存在 `this.state` 被异步修改的问题

**4. 类型推导更友好**

Class 组件的 `this.state` 和 `this.props` 类型推导往往需要额外的泛型声明，而 Hooks 的 `useState`、`useRef` 等可直接从初始值推断类型。

#### 缺点 / 局限性

**1. 心智模型较重 —— 闭包陷阱**

最经典的坑：定时器中拿到的永远是旧的 state。

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1)  // 永远是 0 + 1 → count 被闭包捕获
    }, 1000)
    return () => clearInterval(timer)
  }, [])  // 空依赖，effect 只运行一次

  return <div>{count}</div>  // 永远显示 1
}
```

解法是用函数式更新 `setCount(c => c + 1)` 或用 `useRef` 持有最新值。

**2. 依赖数组的心智负担**

`useEffect` / `useMemo` / `useCallback` 都需要手动声明依赖数组，遗漏或过度声明都会出问题：

```jsx
useEffect(() => {
  doSomething(a, b)
}, [a])  // 遗漏 b → ESLint 报 warning；加上 b 可能反而不符合业务预期
```

`useCallback` 几乎总是和 `React.memo` 配对使用才有效果，脱离 `React.memo` 它就是纯开销。

**3. 不能在条件/循环中使用**

必须是"无条件调用 + 稳定顺序"，这使得某些场景下不如 Class 组件灵活：

```jsx
// 编译报错：Hooks 必须无条件调用
function Bad({ flag }) {
  if (flag) {
    const data = useFetchSomething()  // ❌
  }
  // ...
}
```

需要把条件逻辑放进 Hook 内部，或者拆分组件。

**4. useEffect 不等于生命周期**

`useEffect` 的语义是"同步副作用到外部系统"，不是 `componentDidMount` / `componentDidUpdate` / `componentWillUnmount` 的集合。严格模式（Strict Mode）下 effect 会执行两次，用清理函数保证幂等。

**5. 性能误用**

滥用 `useMemo` / `useCallback` 反而增加开销（每次渲染都要跑依赖比对），不用可能更快。React 官方文档明确指出：

> **You should only rely on `useMemo` as a performance optimization.** If your code doesn't work without it, find the underlying problem and fix it first. Then you may add `useMemo` to improve performance.
>
> —— [react.dev/reference/react/useMemo](https://react.dev/reference/react/useMemo)

文档还列出了 `useMemo` 真正有价值的三种场景：
1. 计算明显很慢且依赖很少变化
2. 将值传给 `memo` 包裹的组件
3. 该值作为其他 Hook 的依赖项

**其他情况下添加 `useMemo` 没有任何收益（There is no benefit）。** 如果交互仍然卡顿，用 React DevTools Profiler 定位瓶颈再针对性添加。

**6. useRef 的"逃生舱"语义模糊**

`useRef` 既用于 DOM 引用，又用于保存可变值（绕过渲染周期），两种用途混在一起，新手容易困惑。

---

### 常用 Hooks 速查

| Hook | 用途 | 返回值 |
|------|------|--------|
| `useState` | 声明状态变量 | `[state, setState]` |
| `useEffect` | 处理副作用（请求、订阅、DOM 操作） | 无 |
| `useRef` | 引用 DOM 元素 / 持有可变值 | `{ current: ... }` |
| `useMemo` | 缓存计算结果 | 计算后的值 |
| `useCallback` | 缓存函数引用 | 缓存的函数 |
| `useContext` | 消费 Context | Context 当前值 |
| `useReducer` | 复杂状态管理 | `[state, dispatch]` |
| `useTransition` | 标记非紧急更新 | `[isPending, startTransition]` |
| `useDeferredValue` | 延迟更新某个值 | 延迟后的值 |
| `useImperativeHandle` | 自定义 ref 暴露内容 | 无 |
| `useLayoutEffect` | DOM 变更后同步执行 | 无 |
| `useId` | 生成唯一 ID | string |

---

### Hooks 规则

1. **只在函数组件 / 自定义 Hook 中调用**（不在 class 组件、普通函数中调用）
2. **只在顶层调用**（不在循环、条件、嵌套函数中调用）
3. **自定义 Hook 命名以 `use` 开头**（约定，让 ESLint 插件能检查规则）

> 为什么要求顺序调用？React 用链表按调用顺序绑定 state。条件调用会打乱顺序，导致对应关系错乱。详见 [为什么 hooks 要保证顺序调用](./面试题/为什么%20hooks%20要保证顺序调用.md)

---

### useImperativeHandle

`useImperativeHandle` 允许子组件向父组件暴露自定义的 ref 接口，而不是直接暴露 DOM 节点。

```jsx
const Child = forwardRef((props, ref) => {
  const inputRef = useRef()

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = '' }
  }))

  return <input ref={inputRef} />
})

// 父组件
function Parent() {
  const childRef = useRef()
  return (
    <>
      <Child ref={childRef} />
      <button onClick={() => childRef.current.focus()}>Focus</button>
      <button onClick={() => childRef.current.clear()}>Clear</button>
    </>
  )
}
```

常用于：封装组件库时，对外暴露命令式 API（focus、scrollTo、reset 等），同时隐藏内部 DOM 结构。
