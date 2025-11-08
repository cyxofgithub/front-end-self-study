## 说说对 fiber 架构的理解

### 背景

谈这个话题我觉得首先要补充一个知识点，我们知道 JavaScript 主线程和页面渲染引擎两个线程是互斥的，当其中一个线程执行时，另一个线程只能挂起等待。如果 JavaScript 线程长时间地占用了主线程，那么渲染层面的更新就不得不长时间地等待，界面长时间不更新，会导致页面响应度变差，用户可能会感觉到卡顿。

而这也正是 React 15 的 Stack Reconciler 所面临的问题，当 React 在渲染组件时，从开始到渲染完成整个过程是一气呵成的，无法中断

如果组件较大，那么 js 线程会一直执行，然后等到整棵 VDOM 树计算完成后，才会交给渲染的线程。这就会导致一些用户交互、动画等任务无法立即得到处理，导致卡顿的情况

### 是什么

React Fiber 其实就是 Facebook 针对这个问题对 React 做出的一个重大改变与优化

主要做了以下的操作：

1、为每个增加了优先级，优先级高的任务可以中断低优先级的任务。然后再重新，注意是重新执行优先级低的任务
2、增加了异步任务，调用 requestIdleCallback api，浏览器空闲的时候执行
3、dom diff 树变成了链表，这都是为找到被中断的任务，重新执行
注：链表的结构只要记住当前节点的指针就可以恢复中断的任务

### winodw.requestIdleCallback 使用示例

```javascript
import React, { useEffect, useState } from "react";

function App() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const handleIdleCallback = (deadline) => {
            // 浏览器有空闲的时候执行
            if (deadline.timeRemaining() > 0) {
                console.log(deadline.timeRemaining());

                setCount((prevCount) => prevCount + 1);
            }
        };

        if (count < 10) {
            window.requestIdleCallback(handleIdleCallback);
        }
    }, [count]);

    return (
        <div>
            <h1>Count: {count}</h1>
        </div>
    );
}

export { App };
```

### fiber 节点

每个 Fiber 节点对应一个 React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的 DOM 节点等信息，保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

```javascript
type Fiber = {
    // 用于标记fiber的WorkTag类型，主要表示当前fiber代表的组件类型如FunctionComponent、ClassComponent等
    tag: WorkTag,
    // ReactElement里面的key
    key: null | string,
    // ReactElement.type，调用`createElement`的第一个参数
    elementType: any,
    // The resolved function/class/ associated with this fiber.
    // 表示当前代表的节点类型
    type: any,
    // 表示当前FiberNode对应的element组件实例
    stateNode: any,

    // 指向他在Fiber节点树中的`parent`，用来在处理完这个节点之后向上返回
    return: Fiber | null,
    // 指向自己的第一个子节点
    child: Fiber | null,
    // 指向自己的兄弟结构，兄弟节点的return指向同一个父节点
    sibling: Fiber | null,
    index: number,

    ref:
        | null
        | (((handle: mixed) => void) & { _stringRef: ?string })
        | RefObject,

    // 当前处理过程中的组件props对象
    pendingProps: any,
    // 上一次渲染完成之后的props
    memoizedProps: any,

    // 该Fiber对应的组件产生的Update会存放在这个队列里面
    updateQueue: UpdateQueue<any> | null,

    // 上一次渲染的时候的state
    memoizedState: any,

    // 一个列表，存放这个Fiber依赖的context
    firstContextDependency: ContextDependency<mixed> | null,

    mode: TypeOfMode,

    // Effect
    // 用来记录Side Effect
    effectTag: SideEffectTag,

    // 单链表用来快速查找下一个side effect
    nextEffect: Fiber | null,

    // 子树中第一个side effect
    firstEffect: Fiber | null,
    // 子树中最后一个side effect
    lastEffect: Fiber | null,

    // 代表任务在未来的哪个时间点应该被完成，之后版本改名为 lanes
    expirationTime: ExpirationTime,

    // 快速确定子树中是否有不在等待的变化
    childExpirationTime: ExpirationTime,

    // fiber的版本池，即记录fiber更新过程，便于恢复
    alternate: Fiber | null,
};
```
