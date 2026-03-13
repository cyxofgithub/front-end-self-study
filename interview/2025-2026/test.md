## 京东上海 4 轮面试

### react18 以前批处理是啥样的？ react18+的批处理怎么做的，从底层讲讲

react18 前：依赖于 batchUpdate 进行批处理，在其上下文下的 setState 调用会加入更新队列，在调用上下文最后统一处理更新队列

react18 后：自动批处理，不依赖于 batchUpdate 调用默认加入更新队列，在每个事件循环第一次调用时会注册微任务方便在同步代码结束后统一处理更新队列

[详细参考](../react/react18前后批处理原理.md)

### useLayoutEffect 和 useEffect 啥区别，从底层讲讲

-   useLayoutEffect: 在 commit 阶段浏览器绘制前同步阶段执行，会阻塞渲染
-   useEffect：在浏览器绘制后执行，异步执行（通过 messagechanel/setTimeout，优先使用前者宏任务优先级更高，浏览器兼容有问题采用后者）

[详细参考](../react/useLayoutEffect、useEffetct区别及底层原理.md)
