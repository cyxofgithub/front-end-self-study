### 详细对比：React DOM vs React Native 的 渲染流程

| 阶段                         | React DOM 流程                                                 | React Native 流程                                                                                               |
| ---------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **JSX → 虚拟 DOM**           | 编译为 `{type: 'div', props: {...}}` 等 Web 标签               | 编译为 `{type: 'View', props: {...}}` 等原生组件                                                                |
| **Fiber 树构建**             | 基于虚拟 DOM 构建 Fiber 树，标记 `PLACEMENT`/`UPDATE` 等副作用 | **完全相同**：构建 Fiber 树，标记相同的副作用类型                                                               |
| **协调阶段（可中断）**       | 基于 Fiber 链表做可中断遍历，对比新旧 Fiber 节点               | **完全相同**：复用 React 核心的可中断协调逻辑                                                                   |
| **Commit 阶段**              | 遍历副作用链表，执行 `createElement`/`appendChild` 等 DOM 操作 | 遍历副作用链表，通过 **JS Bridge** 调用原生 API，创建/更新原生组件（如 iOS 的 `UIView`、Android 的 `TextView`） |
| **Fiber 节点的 `stateNode`** | 指向浏览器 DOM 元素（如 `div` 对应的 DOM 对象）                | 指向原生组件的「句柄（handle）」，用于 JS 侧和原生侧通信                                                        |
