## 先对齐核心概念（React ↔ 小程序）

先把 React 和小程序的核心机制做对应，方便你快速类比：
| React 核心环节 | 小程序对应环节 | 核心作用 |
|-------------------------------|-----------------------------------------|-------------------------------------------|
| ReactDOM.createRoot/render | App()/Page() + 宿主环境初始化 | 入口调用，启动应用/页面的渲染流程 |
| JSX → 虚拟 DOM（React.createElement） | WXML/WXSS + 数据 → 虚拟节点树 | 描述界面结构，不直接操作真实 DOM |
| reconcileRootFiber（根协调） | 小程序首次渲染的“根数据协调” | 首次构建完整的界面描述，可中断（宿主管控） |
| reconcileChildFiber（局部协调）| 小程序 setData 触发的“数据 diff” | 对比新旧数据，标记差异 |
| commit 副作用（placement/update/delete） | 渲染层执行真实 DOM 操作 | 将差异转换为真实界面更新 |
| setState 触发更新 | setData 触发更新 | 触发协调 →commit 的更新闭环 |
