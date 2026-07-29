# React 主流版本区别

## 版本演进概览

| 版本  | 发布时间 | 核心主题                |
| ----- | -------- | ----------------------- |
| 16.0  | 2017.09  | Fiber 架构重写          |
| 16.3  | 2018.03  | 新 Context API、StrictMode |
| 16.8  | 2019.02  | Hooks 正式发布          |
| 17.0  | 2020.10  | "无新特性"，渐进式升级  |
| 18.0  | 2022.03  | 并发渲染                |
| 19.0  | 2024.12  | Server Components 稳定 + Actions |

---

## React 16

### 核心变化

#### 1. Fiber 架构（16.0）

React 16 重写了核心调和算法（Reconciler），从 Stack Reconciler 升级为 **Fiber Reconciler**。

- **Stack Reconciler**：递归遍历虚拟 DOM，同步不可中断，长任务会阻塞主线程
- **Fiber Reconciler**：将渲染工作拆分成小任务单元（Fiber 节点），可中断、可恢复

```javascript
// Fiber 节点结构（简化）
const fiber = {
    tag: 'FunctionComponent',  // 组件类型
    type: App,                 // 组件函数/类
    stateNode: null,           // 对应的 DOM 节点或组件实例
    return: parentFiber,       // 父 Fiber
    child: childFiber,         // 第一个子 Fiber
    sibling: siblingFiber,     // 下一个兄弟 Fiber
    alternate: null,           // 指向另一棵树的对应节点（双缓冲）
    lanes: 0,                  // 优先级
    memoizedState: null,       // 当前状态
    pendingProps: {},          // 新 props
    effectTag: 'Update',       // 副作用标签
};
```

详见 `react fiber.md`、`说说对fiber架构的理解.md`。

#### 2. 错误边界（16.0）

新增 `componentDidCatch` 和 `getDerivedStateFromError`，允许组件捕获子组件树中的 JS 错误并展示降级 UI。

```javascript
class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}
```

#### 3. Portals（16.0）

将子节点渲染到 DOM 树中的任意位置，而事件冒泡仍遵循 React 组件树。

```jsx
ReactDOM.createPortal(child, document.getElementById('modal-root'));
```

#### 4. Fragments（16.2）

无需额外 DOM 节点包裹多个子节点。

```jsx
// <></> 是 <React.Fragment> 的语法糖
<>
    <ChildA />
    <ChildB />
</>
```

#### 5. 新 Context API（16.3）

旧 Context API 存在 props 穿透问题且不稳定。16.3 提供了新的 `React.createContext` + Provider/Consumer 模式。

```javascript
const ThemeContext = React.createContext('light');

// 提供者
<ThemeContext.Provider value="dark">
    <App />
</ThemeContext.Provider>;

// 消费者
<ThemeContext.Consumer>
    {(value) => <div>{value}</div>}
</ThemeContext.Consumer>;
```

#### 6. StrictMode（16.3）

用于标识潜在问题（不安全的生命周期、废弃 API、意外的副作用）。

#### 7. Hooks（16.8）

这是 React 最重要的更新之一，让函数组件拥有状态和副作用管理能力。

- `useState`：状态管理
- `useEffect`：副作用处理
- `useContext`：消费 Context
- `useReducer`：复杂状态管理
- `useCallback` / `useMemo`：性能优化
- `useRef`：引用 DOM 或保存可变值
- `useImperativeHandle` / `useLayoutEffect`：布局相关

详见 `react hook原理.md`、`useLayoutEffect、useEffetct区别及底层原理.md`。

#### 8. 代码分割（16.6）

`React.lazy` + `Suspense` 实现组件级代码分割。

```jsx
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
    <LazyComponent />
</Suspense>;
```

#### 9. memo（16.6）

浅比较 props 的高阶组件，等价于 `PureComponent` 的函数版本。

```jsx
const MemoizedComponent = React.memo(({ value }) => <div>{value}</div>);
```

---

## React 17

### 核心主题：无新特性的渐进式升级

React 17 被官方称为 "stepping stone" 版本，几乎不引入面向开发者的新 API，重点在于平滑迁移。

### 核心变化

#### 1. 事件委托位置变更

- **16**：将所有合成事件委托到 `document`
- **17**：将合成事件委托到 React 树的**根节点**（`ReactDOM.render` 的容器）

```javascript
// 16: 事件委托到 document
document.addEventListener('click', handleEvent);

// 17: 事件委托到根节点
rootNode.addEventListener('click', handleEvent);
```

**为什么改？** 当一个页面存在多个 React 版本时（如微前端场景），不同版本的 React 都往 `document` 上绑事件会互相冲突。委托到各自的根节点，多版本可共存。

#### 2. 全新 JSX 变换

不再需要手动引入 `React`。

```jsx
// 旧版变换（16 及之前）
import React from 'react';
function App() {
    return <h1>Hello</h1>;
}
// 编译后：React.createElement('h1', null, 'Hello')

// 新版变换（17+）
// 无需 import React
function App() {
    return <h1>Hello</h1>;
}
// 编译后：import { jsx as _jsx } from 'react/jsx-runtime';
// _jsx('h1', { children: 'Hello' })
```

#### 3. useEffect 清理函数变为异步执行

- **16**：清理函数（return 的函数）在组件卸载时**同步**执行
- **17**：清理函数改为**异步**执行，与屏幕更新对齐，减少布局抖动

#### 4. 取消事件池（Event Pooling）

- **16**：合成事件对象会被复用（事件池），事件回调外访问 `e` 会得到 null，需调 `e.persist()`
- **17**：取消事件池，事件对象在事件回调外依然可访问

#### 5. 废弃的生命周期别名移除

`componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate` 的 `UNSAFE_` 前缀之外的别名被彻底移除。

---

## React 18

### 核心主题：并发渲染（Concurrent Rendering）

### 核心变化

#### 1. 新的根 API：createRoot（并发模式入口）

```jsx
// React 17
ReactDOM.render(<App />, document.getElementById('root'));

// React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

`createRoot` 开启了并发渲染能力，React 可以"打断"渲染去处理更高优先级的任务（如用户输入），完成后再继续之前的渲染。

#### 2. 自动批处理

所有状态更新都自动批处理，包括异步操作中的更新。

详见 `react18前后批处理原理.md`。

#### 3. Transitions（过渡更新）

区分**紧急更新**（如输入框打字）和**过渡更新**（如搜索结果列表），过渡更新可以被中断。

```jsx
import { startTransition, useTransition, useDeferredValue } from 'react';

// 方式 1：startTransition
function handleChange(value) {
    setInput(value); // 紧急更新：立即更新输入框
    startTransition(() => {
        setSearchResults(value); // 过渡更新：可被中断
    });
}

// 方式 2：useTransition
const [isPending, startTransition] = useTransition();

// 方式 3：useDeferredValue —— 延迟一个值的更新
const deferredValue = useDeferredValue(inputValue);
```

#### 4. Suspense 增强

Suspense 在 16 中只支持 `React.lazy` 代码分割，18 中支持**服务端渲染和数据获取**。

```jsx
// 使用 Suspense 处理异步数据
function ProfilePage() {
    return (
        <Suspense fallback={<Spinner />}>
            <ProfileDetails />
            <Suspense fallback={<PostsSkeleton />}>
                <ProfileTimeline />
            </Suspense>
        </Suspense>
    );
}
```

#### 5. 新的 Hooks

| Hook                    | 用途                                                                         |
| ----------------------- | ---------------------------------------------------------------------------- |
| `useId`                 | 生成唯一 ID，支持服务端渲染                                                  |
| `useTransition`         | 标记非紧急更新，获取过渡状态                                                 |
| `useDeferredValue`      | 延迟值的更新，保持 UI 响应                                                   |
| `useSyncExternalStore`  | 同步订阅外部 store（为并发模式下的外部库准备）                               |
| `useInsertionEffect`    | 在 DOM 变更之前、`useLayoutEffect` 之前执行（为 CSS-in-JS 库准备）          |

#### 6. Strict Mode 行为变更

开发模式下，组件会**双重挂载/卸载**（mount → unmount → mount），以检测副作用问题，为并发渲染做准备。

---

## React 19

### 核心主题：Server Components 稳定 + Actions

### 核心变化

#### 1. React Server Components（RSC）

Server Components 在 React 19 中**正式稳定**，组件可在服务端运行，零 JS 发送到客户端。

```jsx
// Server Component（无 'use client' 指令，默认即为 Server Component）
async function BlogList() {
    // 直接 await 数据，无需 useEffect + useState
    const posts = await db.posts.findMany();
    return (
        <ul>
            {posts.map((p) => (
                <li key={p.id}>{p.title}</li>
            ))}
        </ul>
    );
}
```

**Server Component vs Client Component：**

| 对比项     | Server Component | Client Component |
| ---------- | ---------------- | ---------------- |
| 运行位置   | 服务端           | 浏览器           |
| 能否用 hooks | ❌              | ✅               |
| 能否用事件 | ❌              | ✅               |
| 能否用 async | ✅             | ❌              |
| 打包体积   | 不增加 JS 体积   | 增加 JS 体积     |

#### 2. Actions（Server Actions / Form Actions）

React 19 引入了 **Actions** 概念，统一处理异步数据变更。

```jsx
import { useActionState, useFormStatus, useOptimistic } from 'react';

// useActionState —— 管理表单提交状态
async function submitForm(prevState, formData) {
    const title = formData.get('title');
    try {
        await createPost(title);
        return { success: true };
    } catch {
        return { error: 'Failed to create post' };
    }
}

function CreatePost() {
    const [state, formAction, isPending] = useActionState(submitForm, null);
    return (
        <form action={formAction}>
            <input name="title" />
            <SubmitButton />
            {state?.error && <p>{state.error}</p>}
        </form>
    );
}

// useFormStatus —— 获取当前表单提交状态（用于子组件）
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending}>
            {pending ? 'Submitting...' : 'Submit'}
        </button>
    );
}

// useOptimistic —— 乐观更新
function TodoList({ todos }) {
    const [optimisticTodos, addOptimisticTodo] = useOptimistic(
        todos,
        (state, newTodo) => [...state, { id: Date.now(), text: newTodo, pending: true }],
    );

    async function addTodo(formData) {
        const text = formData.get('text');
        addOptimisticTodo(text); // 立即显示新项
        await saveTodo(text);     // 后台同步
    }
    // ...
}
```

#### 3. `use()` Hook

新的 `use()` hook 可以在 render 中读取 Promise 或 Context，让异步数据获取更简洁。

```jsx
// resolve Promise
async function fetchUser(id) {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
}

function UserProfile({ id }) {
    // use() 会暂停渲染直到 Promise resolve
    const user = use(fetchUser(id));
    return <div>{user.name}</div>;
}

// 也可以在条件语句中使用（Hooks 做不到！）
function Card({ data }) {
    if (data) {
        const theme = use(ThemeContext); // ✅ use() 支持条件调用
    }
    // ...
}
```

**`use()` vs `Suspense`：** `use()` 抛出 Promise 会被最近的 `<Suspense>` 捕获，显示 fallback，resolve 后重新渲染。无需手动 loading 状态。

#### 4. ref 作为 prop

ref 现在可以直接作为 prop 传递，无需 `forwardRef` 包装。

```jsx
// React 18：必须用 forwardRef
const MyInput = React.forwardRef((props, ref) => (
    <input ref={ref} {...props} />
));

// React 19：ref 就是普通 prop
function MyInput({ ref, ...props }) {
    return <input ref={ref} {...props} />;
}
```

#### 5. Document Metadata 原生支持

在组件中直接写 `<title>`、`<meta>`、`<link>`，React 自动提升到 `<head>`。

```jsx
function BlogPost({ post }) {
    return (
        <>
            <title>{post.title}</title>
            <meta name="description" content={post.excerpt} />
            <article>{post.content}</article>
        </>
    );
}
```

#### 6. 资源预加载 API

```jsx
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom';

// DNS 预解析
prefetchDNS('https://api.example.com');
// 预连接
preconnect('https://api.example.com');
// 预加载资源
preload('/hero-image.png', { as: 'image' });
// 预加载 + 执行脚本
preinit('/analytics.js', { as: 'script' });
```

#### 7. ref 清理函数

`useRef` 支持返回清理函数，类似 `useEffect`。

```jsx
const ref = useRef((node) => {
    // node 挂载时的回调
    return () => {
        // node 卸载时的清理
        console.log('cleanup');
    };
});
```

#### 8. Context 简化

`<Context.Provider>` 简写为 `<Context>`。

```jsx
// React 18
<ThemeContext.Provider value="dark">
    <App />
</ThemeContext.Provider>

// React 19 —— 直接使用 Context
<ThemeContext value="dark">
    <App />
</ThemeContext>
```

#### 9. 改进的错误报告

- 不再吞掉渲染错误信息
- 错误展示包含源码位置和组件调用栈
- 重复错误的去重处理

---

## 版本特点速记

| 版本 | 一句话总结                              | 面试高频重点                  |
| ---- | --------------------------------------- | ----------------------------- |
| 16   | Fiber 重写 + Hooks 革命                 | Fiber 原理、Hooks 原理、Diff |
| 17   | 平滑升级，新旧 JSX 变换                 | 事件委托变化、JSX 变换       |
| 18   | 并发渲染，自动批处理                    | 批处理、Transitions、createRoot |
| 19   | Server Components 稳定 + Actions + use() | RSC、Actions、ref prop、use() |

---

## 从升级角度看各版本变更

### 从 16 → 17

- 几乎不需要改代码
- `ReactDOM.render` 不变
- 移除 `import React from 'react'`（需编译配置 Babel）
- 事件委托移到根节点

### 从 17 → 18

- `ReactDOM.render` → `createRoot`
- 批处理行为变化：异步操作也会批处理（通常是好事，但如果依赖了"不批处理"的行为需要检查）
- 开发环境 Strict Mode 双重挂载
- 新增 `useTransition`、`useDeferredValue` 等并发 API

### 从 18 → 19

- ref 无需 `forwardRef`
- `<Context.Provider>` → `<Context>`
- 新增 Actions 系列 hooks：`useActionState`、`useFormStatus`、`useOptimistic`
- `use()` hook 可在条件语句中使用 Context/Promise
- RSC 正式稳定（需 Next.js App Router 等框架支持）
