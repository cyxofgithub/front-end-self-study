## 原理

### Virtual DOM 原理

#### 是什么

-   定义：Virtual DOM 是真实 DOM 的 JavaScript 对象表示
-   作用：减少直接操作 DOM，提高性能（内存中对象操作，无需触发浏览器重排重绘）
-   结构：包含 type、props、children 等属性

#### 优势

-   跨平台：可以渲染到不同环境（Web、Native、VR 等）
-   性能优化：批量更新，减少重排重绘
-   开发体验：声明式编程，关注数据而非 DOM 操作

#### 示例

```javascript
// React 虚拟 DOM 对象（简化版）
const virtualDOM = {
    // 元素类型：可以是标签名（字符串）、组件函数或类
    type: 'div',

    // 元素属性：包括 HTML 属性、事件处理函数、样式等
    props: {
        className: 'container',
        id: 'main-content',
        style: {
            width: '100%',
            padding: '20px',
        },
        onClick: () => console.log('容器被点击'),
    },

    // 子节点：可以是文本、其他虚拟 DOM 对象或数组
    children: [
        {
            type: 'h1',
            props: {
                style: { color: '#333' },
            },
            children: 'React 虚拟 DOM 示例',
        },
        {
            type: 'p',
            props: {},
            children: '这是一个虚拟 DOM 对象的结构展示',
        },
        {
            // 子元素也可以是组件（这里用函数组件举例）
            type: (props) => <span>{props.text}</span>,
            props: { text: '动态生成的内容' },
            children: null,
        },
    ],
};
```

### 掌握 Diff 算法和优化策略

#### 算法原理

Diffing 算法的核心思路是分层对比（只对比同层级节点，不跨层比较），并基于以下规则减少计算量：

**1、规则 1：节点类型不同 → 直接替换**
若新旧节点的 type 不同（如 div 变为 p），React 会直接销毁旧节点及其所有子节点，创建新节点树。例：<div>...</div> 变为 <p>...</p> 时，整个 div 及其子节点会被移除，重新创建 p 节点树。

**2、规则 2：节点类型相同 → 对比属性和子节点**
若 type 相同（如都是 div），React 会：
对比并更新属性（如 className、style、事件等），只更新变化的属性；
递归对比子节点（通过 children 字段）。

**3、规则 3：列表节点必须指定 key → 精准复用节点**
对于列表类子节点（如 [<li>, <li>, ...]），若不指定 key，React 会按索引对比，导致插入 / 删除元素时大量节点被误删重建（性能极差）。指定 key 后，React 会通过 key 匹配新旧节点：

-   key 相同的节点会被复用（只更新差异属性）；
-   key 不存在于新列表中 → 销毁旧节点；
-   key 不存在于旧列表中 → 创建新节点。
    注意：key 需唯一且稳定（避免用索引，否则与不指定 key 效果一致）。

示例代码：[diff 算法](./code/diff.ts)

#### 优化策略

##### 分层对比

原理：前端 UI 中，DOM 节点跨层级移动的场景极少（例如，将一个 div 的子节点移动到另一个 div 中）。基于这一观察，Diff 算法只对比同一层级的节点，不跨层级遍历，从而将时间复杂度从传统树形 Diff 的 O(n³) 降至 O(n)（n 为节点总数）。

为什么是 O(n³)？

```javascript
// 旧树
const oldTree = [
    { id: 'A', children: [{ id: 'B', children: [] }] },
    { id: 'C', children: [] },
];

// 新树
const newTree = [
    { id: 'C', children: [] },
    { id: 'A', children: [{ id: 'B', children: [] }] },
];

function diffTrees(oldTree, newTree) {
    for (let i = 0; i < oldTree.length; i++) {
        // 第一层：遍历旧树的每个节点o（n）
        for (let j = 0; j < newTree.length; j++) {
            // 第二层：遍历新树的每个节点 o（n）
            // 第三层：比较这两个节点的所有可能路径（递归比较子节点）
            compareNodeAndChildren(oldTree[i], newTree[j], []);
        }
    }
}

// 递归比较子节点的过程是 O(n) 是因为：
// 每个节点最多被访问一次
// 递归深度通常远小于节点总数
// 递归只是遍历树的一种方式，不会导致重复计算
function compareNodeAndChildren(node1, node2, path) {
    // 比较节点内容
    if (node1.id === node2.id) {
        // 比较路径（层级关系）
        console.log(`节点${node1.id} 路径: ${path.join('->')}`);
    }
    // 递归比较子节点
    for (let k = 0; k < node1.children.length; k++) {
        for (let l = 0; l < node2.children.length; l++) {
            compareNodeAndChildren(node1.children[k], node2.children[l], path.concat(node1.id));
        }
    }
}
```

##### 列表 key 优化

原理：列表类节点（如 ul>li、div>span 等重复结构）是 Diff 性能的关键痛点：若不做特殊处理，插入 / 删除列表中间的节点会导致后续所有节点被误判为 “修改” 或 “删除重建”。
通过为列表节点添加唯一且稳定的 key，算法可快速匹配新旧列表中 “相同” 的节点，避免不必要的销毁和重建。

##### 同类型节点复用，不同类型节点直接替换

原理：若两个节点的类型不同（如 div vs p、Button 组件 vs Input 组件），其内部结构大概率完全不同，继续对比子节点的收益远低于直接重建。因此，算法会直接销毁旧节点及其子树，创建新节点及其子树，避免无效的子节点对比。

##### 属性对比优化（只更新变化的属性）

原理：节点类型相同时，属性（props）的变化通常远少于属性总数。算法会只对比并更新变化的属性，而非全量替换所有属性。避免不必要的属性操作（如 class 未变化时不重复设置），减少 DOM 重排重绘。

##### 任务拆分与优先级调度（避免主线程阻塞）

原理：Diff 过程若耗时过长（如超过 16ms），会阻塞主线程，导致页面卡顿（尤其是用户交互时）。现代框架（如 React 16+）通过任务拆分和优先级调度，将 Diff 过程分解为可中断的小单元，优先处理高优先级任务（如用户输入、动画）。

具体实现（以 React Fiber 为例）：
1、Fiber 节点拆分：将虚拟 DOM 树拆分为链表结构的 Fiber 节点，每个节点对应一个 Diff 任务单元。
2、时间切片：每处理完一个 Fiber 节点，检查是否有剩余时间（通过 requestIdleCallback 或自定义调度）：

    -   有剩余时间：继续处理下一个节点。
    -   无剩余时间或有高优先级任务：暂停当前 Diff，保存中间状态，待空闲时恢复。

3、优先级排序：用户输入（click、input）> 动画（requestAnimationFrame）> 普通更新，确保关键操作优先响应。

##### 批量更新（减少 Diff 次数）

原理：短时间内多次状态更新（如连续调用 setState）会触发多次 Diff，而这些更新可以合并为一次，减少重复计算。

具体实现（以 React 为例）：

-   自动批处理：React 会将多个连续的状态更新（如事件回调中多次 setState）合并为一次 Diff，只执行一次 DOM 更新。
-   显式批处理：通过 unstable_batchedUpdates（React 18 前）或自动支持（React 18+），将异步操作中的更新（如 setTimeout、Promise 回调）也纳入批处理。

效果：例如，连续执行 3 次 setState，传统方式会触发 3 次 Diff，批处理后只触发 1 次，减少 2/3 的计算量

### 理解 Fiber 架构的设计思想

#### 解决了什么问题？

它解决了 React 16 之前栈协调器（Stack Reconciler）的主线程阻塞问题：

-   栈协调器通过递归遍历虚拟 DOM，一旦开始更新就无法中断，若任务耗时超过 16ms（浏览器一帧时间），会导致页面卡顿、输入无响应。
-   Fiber 通过任务拆分、时间切片和优先级调度，确保主线程不被长时间占用，提升用户交互流畅度。

#### 有哪些阶段？

1、调度阶段（Scheduler）：确定任务优先级
2、协调阶段（Reconciliation）：计算差异（可中断）
3、提交阶段（Commit）：执行 DOM 操作（不可中断）

#### 协作关系

```javascript
const Scheduler = {
    // 优先级定义（数值越小优先级越高）
    priorities: {
        USER_BLOCKING: 1, // 用户交互（点击、输入）
        NORMAL: 2, // 普通更新
        LOW: 3, // 低优先级
    },
    // 当前正在执行的任务
    currentTask: null,
    // 任务队列
    taskQueue: [],

    // 1、调度任务
    scheduleTask(task, priority) {
        task.priority = priority;
        this.taskQueue.push(task);
        // 按优先级排序任务队列
        this.taskQueue.sort((a, b) => a.priority - b.priority);
        // 启动调度
        this.startWork();
    },

    // 2、开始工作（使用requestIdleCallback模拟时间切片）
    startWork() {
        if (this.currentTask) return; // 已有任务在执行

        this.currentTask = this.taskQueue.shift();
        if (!this.currentTask) return;

        // 利用浏览器空闲时间执行任务，超时16ms强制让出主线程
        requestIdleCallback(
            (deadline) => {
                this.workLoop(deadline);
            },
            { timeout: 16 }
        );
    },

    // 3、工作循环（可中断）
    workLoop(deadline) {
        while (this.currentTask && deadline.timeRemaining() > 0) {
            // 执行任务单元
            const shouldYield = !this.currentTask.execute();
            if (shouldYield) {
                this.currentTask = null;
                break; // 需要让出主线程
            }
        }

        if (!this.currentTask) {
            // 任务完成，进入提交阶段
            this.commitEffects();
            return;
        }

        // 未完成，下次空闲时继续
        requestIdleCallback(
            (deadline) => {
                this.workLoop(deadline);
            },
            { timeout: 16 }
        );
    },

    // 4、提交阶段：执行所有副作用（DOM操作）
    commitEffects() {
        while (effectList) {
            const fiber = effectList;
            // 执行DOM操作
            commitWork(fiber);
            effectList = fiber.nextEffect;
        }
    },
};
```

#### 协调阶段如何做到中断恢复？

链表结构可以中断深度遍历的过程

```javascript
// 1. 定义Fiber节点类（数据结构）
class Fiber {
    constructor(type, props) {
        // 节点类型（如'div'、函数组件）
        this.type = type;
        // 新属性
        this.props = props;
        // 旧属性（用于对比）
        this.memoizedProps = null;
        // 子节点（第一个子Fiber）
        this.child = null;
        // 兄弟节点
        this.sibling = null;
        // 父节点
        this.return = null;
        // 副作用标记（如更新、插入、删除）
        this.effectTag = null; // 'UPDATE' | 'PLACEMENT' | 'DELETION'
        // 副作用链表（收集所有需要执行的副作用）
        this.nextEffect = null;
        // 优先级（数值越小优先级越高）
        this.priority = 0;
    }
}
```

```javascript
// 处理单个工作单元（可中断的核心）
function performUnitOfWork(fiber) {
    // 1. 处理当前Fiber（对比属性，标记副作用）

    // 2. 确定下一个工作单元（深度优先遍历）
    // 2.1 先处理子节点
    if (fiber.child) {
        nextUnitOfWork = fiber.child;
        return false;
    }

    let next = fiber;
    while (next) {
        if (next.sibling) {
            nextUnitOfWork = next.sibling; // 2.2 没有子节点处理兄弟节点
            return false;
        }
        next = next.return; //  2.3 没有兄弟节点回溯到父节点
    }

    // 3 、所有节点处理完毕
    nextUnitOfWork = null;
    return true; // 返回 true 表示任务完成，可进入提交阶段
}
```

#### Fiber 中的 “双缓存机制” 是什么？为什么需要它？

双缓存机制是指 Fiber 同时维护两棵树：

-   Current 树：与当前 DOM 一致的 Fiber 树，用于展示当前 UI。

-   WorkInProgress 树：正在构建的新 Fiber 树，所有更新操作（Diff、标记副作用）都在这棵树上进行。

工作流程：
1、更新开始时，以 Current 树为模板复制出 WorkInProgress 树；
2、在 WorkInProgress 树上执行 Diff 和标记副作用；
3、更新完成后，通过切换 current 指针，将 WorkInProgress 树变为新的 Current 树，一次性更新 DOM。

必要性：

-   避免更新过程中 “中间状态” 暴露给用户，防止 UI 闪烁（如部分节点已更新、部分未更新的不一致状态）。
-   确保 DOM 操作的原子性（要么完全更新，要么不更新），提升渲染稳定性。

举例：
假设要渲染一个包含 100 个项的列表，单树模式下：

-   每生成一个列表项，就会立即更新到树中，并触发真实 DOM 渲染。
-   用户会看到列表 “逐个弹出”，过程中可能伴随布局抖动（因频繁重排），表现为明显的闪烁。

#### Fiber 架构与 Stack Reconciler 有什么区别？

| 维度       | Stack Reconciler（栈协调器）       | Fiber 架构                                 |
| ---------- | ---------------------------------- | ------------------------------------------ |
| 遍历方式   | 递归遍历虚拟 DOM 树（栈结构）      | 链表遍历 Fiber 树（指针跳转）              |
| 可中断性   | 不可中断，一旦开始必须完成整个遍历 | 可中断，按工作单元拆分，支持暂停 / 恢复    |
| 优先级支持 | 无，所有更新同等对待               | 支持优先级调度，高优先级任务可中断低优先级 |
| 性能问题   | 大任务阻塞主线程，导致卡顿         | 时间切片避免阻塞，提升用户交互流畅度       |
| 错误恢复   | 递归中出错会导致整个更新失败       | 可定位错误单元，不影响整体流程             |

### 理解 Hooks 的实现原理

React Hook 是 React 16.8 引入的核心特性，允许函数组件使用状态、生命周期等原本只有类组件才能使用的功能。

#### 原理说明

1、useState、useEffect 等 hook 通过链表存储在 fiber.memorizedState 上，以 useState 为例，Hook 节点的简化结构：

```javascript
const hookNode = {
    memoizedState: null, // 存储当前状态值（如 count 的值）
    queue: null, // 状态更新队列（存储待执行的 setXxx 操作）
    next: null, // 指向下一个 Hook 节点（形成链表）
};
```

示例：若组件中有两个 useState，则 Hook 链表结构为：

```javascript
fiber.memoizedState → hook1（第一个 useState）→ hook2（第二个 useState）→ null
```

2、组件首次调用 hook 时 hook 函数会创建 hook 对象，更新时则直接从 fiberMemoizedState 读取

3、更新时第一个 hook 通过 fiber.memoizedState 读取后会移动指针 fiber.memoizedState = hook.next 这就是为什么要保证 hook 的执行顺序

#### useState 核心实现

-   状态存储在 hook.memoizedState 中。
-   setXxx 将更新操作存入 queue 队列，触发重新渲染。
-   重新渲染时，遍历队列计算新状态，更新 memoizedState。

```javascript
function useState(initialState) {
    // 获取当前组件的 Fiber 节点（React 内部维护的全局变量）
    const fiber = getCurrentFiber();
    // 首次渲染：创建 Hook 节点
    if (!fiber.memoizedState) {
        fiber.memoizedState = {
            memoizedState: initialState, // 初始状态
            queue: { pending: null }, // 存储待执行的更新（setXxx）
            next: null,
        };
    }
    const hook = fiber.memoizedState; // 复用已有节点

    // 处理更新队列（如 setCount 触发的更新）
    if (hook.queue.pending) {
        let newState = hook.memoizedState;
        let updates = hook.queue.pending;

        // 遍历更新队列，计算新状态
        // 这里其实就是 batch update 的核心原理：把所有 setState（或 setXxx）产生的更新都收集到一个队列里，
        // 然后在一次渲染流程中依次处理这些更新，最终只触发一次状态变更和渲染。
        while (updates) {
            // 判断 action 是否为函数，如果是函数就用上一次的 state 计算新 state，否则直接赋值
            if (typeof updates.action === 'function') {
                newState = updates.action(newState);
            } else {
                newState = updates.action;
            }
            updates = updates.next;
        }
        hook.queue.pending = null; // 清空队列
        hook.memoizedState = newState; // 更新状态
    }

    // 创建 setXxx 函数（dispatch）
    const dispatch = (action) => {
        // 将更新添加到队列（链表结构）
        const update = { action, next: null };
        if (hook.queue.pending) {
            hook.queue.pending.next = update;
        } else {
            hook.queue.pending = update; // 第一个更新
        }
        // 触发组件重新渲染
        scheduleUpdate(fiber);
    };

    // 移动指针到下一个 Hook 节点（供后续 Hooks 调用）
    fiber.memoizedState = hook.next;
    return [hook.memoizedState, dispatch];
}
```

#### useEffect 核心实现

-   依赖数组变化时，标记副作用需要执行。
-   React 在提交阶段（DOM 更新后）执行副作用，并在下次执行前调用清理函数

```javascript
function useEffect(effect, deps) {
    const fiber = getCurrentFiber();
    // 首次渲染：创建 Effect Hook 节点
    if (!fiber.memoizedState) {
        fiber.memoizedState = {
            deps, // 依赖数组
            effect, // 副作用函数
            cleanup: null, // 清理函数（effect 的返回值）
            next: null,
        };
    }
    const hook = fiber.memoizedState;

    // 对比依赖：判断是否需要执行副作用
    // Object.is 用于判断两个值是否严格相等，类似于 ===，但能区分 +0 和 -0，也能判断 NaN
    const hasChanged = deps ? !deps.every((d, i) => Object.is(d, hook.deps[i])) : true; // 无依赖时每次渲染都执行

    if (hasChanged) {
        hook.deps = deps;
        hook.effect = effect;
        // 调度副作用（在 DOM 更新后执行）
        scheduleEffect(hook);
    }

    // 移动指针到下一个 Hook 节点
    fiber.memoizedState = hook.next;
}

// 在 DOM 更新后执行副作用
function scheduleEffect(hook) {
    commitQueue.push(() => {
        // 先执行上一次的清理函数（如移除事件监听）
        if (hook.cleanup) hook.cleanup();
        // 执行当前副作用，保存清理函数
        hook.cleanup = hook.effect();
    });
}
```

#### batchUpdate 原理

```javascript
let isBatchingUpdates = false;
// 5. 批量更新上下文包装函数（核心）
function batchedUpdates(callback) {
    // 这一步的作用是记录当前批量更新的状态（是否处于批量模式），
    // 为什么嵌套需要这一步？
    // 因为 batchedUpdates 可能会被嵌套调用（比如在一个批量更新回调里又调用了 batchedUpdates），
    // 如果不保存之前的 isBatchingUpdates 状态，嵌套的batchUpdate结束后会将状态改为false，导致提前flush触发更新。
    // 所以要先保存当前批量状态，等 finally 恢复，保证嵌套场景下批量逻辑正确。
    const previousIsBatching = isBatchingUpdates;

    // 开启批量更新模式
    isBatchingUpdates = true;

    try {
        // 执行用户回调（里面可能有多次setState）
        callback();
    } finally {
        // 恢复批量状态
        isBatchingUpdates = previousIsBatching;

        // 如果当前不在嵌套的批量模式中，执行所有暂存的更新
        if (!isBatchingUpdates) {
            const updatesToFlush = [...updateQueue];
            updateQueue.length = 0; // 清空队列
            flushUpdates(updatesToFlush);
        }
    }
}

batchedUpdates(() => {
    // 嵌套调用批量更新
    batchedUpdates(() => {
        scheduleUpdate(CounterComponent, (prev) => prev + 1);
    });

    scheduleUpdate(CounterComponent, (prev) => prev + 1);
});
```

### 了解调度系统的工作机制

调度系统的工作流程可分为 “任务调度”→“任务执行”→“任务中断与恢复” 三个阶段：

通过以下机制确保高效的任务管理：
1、优先级分级：区分任务紧急程度，优先处理用户交互等关键操作。
2、时间切片：限制单次任务执行时间，避免阻塞主线程。
3、任务中断与恢复：高优先级任务可中断低优先级任务，平衡响应速度与任务完成度。
4、与 Fiber 协同：将组件更新拆分为可中断的小单元，实现细粒度的任务控制。

#### 详细说明

1. 任务调度（注册任务）：
   当有任务需要执行（如 setState 触发更新、useEffect 回调），React 会调用调度系统的 scheduleCallback 方法注册任务：

```javascript
// 调度一个高优先级任务（如用户点击）
scheduleCallback(UserBlocking, () => {
    // 任务内容：如更新组件状态
});
```

注册过程中，调度系统会：

-   计算任务的 **expirationTime**（根据优先级：高优先级任务过期时间近，低优先级任务过期时间远）。
-   将任务加入 “优先级队列”，并按 expirationTime 排序（确保高优先级任务在队首）。

2. 任务执行（工作循环）
   调度系统通过一个工作循环（work loop） 处理队列中的任务，核心逻辑如下：

-   从优先级队列中取出队首任务（优先级最高、最早过期的任务）。
-   执行任务的 callback 函数（任务内容），但限制单次执行时间（时间切片）。
-   若任务未执行完（如长任务被拆分），将剩余部分重新加入队列，等待下次执行。
-   重复步骤 1-3，直到队列清空

3. 任务中断与恢复

-   高优先级任务可以中断正在执行的低优先级任务，确保紧急操作优先响应：
-   当新的高优先级任务被调度时，调度系统会标记当前执行的低优先级任务为 “中断”。
-   低优先级任务的 callback 函数返回一个 “剩余任务函数”，用于后续恢复执行。
-   高优先级任务执行完成后，调度系统会重新将低优先级任务的剩余部分加入队列，等待执行。

4. 与 Fiber 架构的协同

-   调度系统与 Fiber 架构紧密配合，实现 “可中断的更新”：
-   Fiber 将组件更新拆分为小单元（Fiber 节点），每个单元对应一个任务。
-   调度系统负责决定每个单元的执行时机：若当前有空闲时间，执行下一个 Fiber 单元；若超时或有高优先级任务，暂停并保存当前进度（nextUnitOfWork）。
-   当高优先级任务完成后，调度系统会恢复低优先级任务的执行，从 nextUnitOfWork 继续处理剩余 Fiber 单元。

### 掌握状态更新的完整流程

React 状态更新是一个从 “触发更新” 到 “DOM 渲染” 的完整流水线，涉及更新触发、调度优先级、协调计算（Diff）、提交更新四个核心阶段。这个流程在 Fiber 架构和 Hooks 机制的支撑下，实现了高效、可中断、带优先级的状态管理。以下是详细流程：

**一、阶段 1：触发状态更新（Update Trigger）**
状态更新的起点是 “触发更新”，常见触发方式包括：

-   函数组件：useState 的更新函数（如 setCount）、useReducer 的 dispatch。
-   类组件：this.setState、this.forceUpdate。

核心操作：创建更新对象（Update Object）
无论哪种触发方式，React 都会创建一个更新对象（Update），记录更新的相关信息。以 useState 为例：

```javascript
// 简化的更新对象结构
const update = {
    action: (prevState) => prevState + 1, // 更新函数（如 setCount(c => c+1)）
    priority: UserBlockingPriority, // 优先级（由调度器决定）
    next: null, // 指向下一个更新（形成更新队列）
};
```

这些更新对象会被加入到对应 Hook 或类组件的更新队列（Update Queue）中，等待处理。

**二、阶段 2：调度更新（Scheduler）**
更新被触发后，不会立即执行，而是先进入调度阶段—— 由 React 的 Scheduler（调度系统）决定 “何时执行该更新”。

1. 确定优先级
   调度器根据更新的 “紧急程度” 分配优先级（参考前文调度系统的优先级分级）：
    - 用户交互（如点击、输入）→ UserBlocking 优先级（高）。
    - 网络请求后的更新 → Normal 优先级（中）。
    - 低优先级计算（如日志）→ Low 或 Idle 优先级（低）。
2. 加入任务队列
   调度器将更新封装为 “调度任务”，加入优先级队列（按优先级排序）：
    - 高优先级任务（如用户点击）会被插入队列前端，优先执行。
    - 若当前有低优先级任务正在执行，高优先级任务会中断低优先级任务，抢占主线程。
3. 时间切片（Time Slicing）
   调度器通过 “时间切片” 控制任务执行时长（单次执行不超过 5ms），避免长时间阻塞主线程：
    - 若任务在时间切片内完成，继续处理下一个任务。
    - 若超时，暂停当前任务，保存进度，让出主线程给浏览器渲染（避免卡顿），待下次空闲时恢复执行。

**三、阶段 3：协调（Reconciliation）—— 计算差异（可中断）**
调度器确定执行更新后，进入协调阶段（又称 “Diff 阶段”）。这一阶段的核心是：基于当前状态计算新的 UI 结构，标记需要更新的 DOM 操作（副作用）。

1、构建 WorkInProgress 树
2、遍历 Fiber 树（深度优先 + 链表遍历）：React 从根 Fiber 节点开始，按 “深度优先” 顺序遍历 WorkInProgress 树，逐个处理 Fiber 节点
3、收集副作用链表（Effect List）：所有标记了 effectTag 的 Fiber 节点会被串联成副作用链表（effectList），方便后续提交阶段批量执行 DOM 操作。
4、可中断与恢复：协调阶段是可中断的：每处理完一个 Fiber 节点，调度器会检查是否超时或有高优先级任务。若需要中断，会保存当前遍历位置（nextUnitOfWork），下次恢复时从该位置继续遍历。

**四、阶段 4：提交（Commit）—— 执行 DOM 操作（不可中断）**
协调阶段完成后，进入提交阶段：执行副作用链表中的所有操作（DOM 增删改），并更新真实 UI。这一阶段不可中断（确保 DOM 操作的原子性，避免 UI 不一致）。

1. 前置处理（Before Mutation）
    - 执行 getSnapshotBeforeUpdate（类组件）等生命周期方法，获取更新前的 DOM 状态（如滚动位置）。
    - 处理 Deletion 副作用的前置清理（如移除事件监听）。
2. 执行 DOM 操作（Mutation）
   遍历副作用链表，按 effectTag 执行具体的 DOM 操作：
    - Placement：插入新节点到 DOM 中。
    - Update：更新已有节点的属性（如 className、style）。
    - Deletion：从 DOM 中删除节点。
3. 后置处理（Layout）
    - 更新 ref 引用（如 useRef 的 current 指向最新 DOM 节点）。
    - 执行生命周期方法（如 componentDidMount、componentDidUpdate）。
    - 执行 Hooks 副作用（如 useEffect 的回调）：**useEffect 的回调（effect）会在 DOM 更新后（即 commit 阶段的最后）被统一执行。**
    - **如果 useEffect 返回了一个清理函数（cleanup），这个清理函数会在下次 effect 执行前，或者组件卸载时被调用。也就是说，React 会先执行上一次的 cleanup，再执行新的 effect。**
    - 切换 Fiber 树指针：将 WorkInProgress 树设置为新的 Current 树（root.current = workInProgress），完成更新。

## 基础概念

### 函数组件 vs 类组件的区别

#### 1、函数组件更简洁，性能更好，原因如下：

**更少的内存占用：**

```javascript
// 类组件 - 需要创建实例
class ClassComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }
    // 包含完整的组件实例
}

// 函数组件 - 纯函数调用
function FunctionComponent(props) {
    const [count, setCount] = useState(0);
    // 没有实例，只有函数调用
}
```

**更好的树摇优化（Tree Shaking）**

先明确：什么是树摇（Tree Shaking）？

树摇是现代打包工具（基于 ESM）的一种优化手段，通过静态分析模块依赖关系，识别并移除代码中 “未被引用的导出内容”（死代码），从而减小打包体积。其生效的前提是：

-   代码使用 ES6 模块系统（import/export，而非 CommonJS 的 require/module.exports），因为 ESM 是 “静态的”（导入导出在编译时确定，而非运行时）。
-   代码中的未使用部分是 “无副作用的”（即移除后不影响程序运行）。

核心原因：
1、函数组件是 “纯函数”，结构更简洁，无冗余代码
函数组件本质是接收 props 并返回 JSX 的纯函数，没有类组件的 “继承”“实例”“原型方法” 等复杂结构：

```javascript
// 函数组件：结构简洁，无多余代码
export function Button(props) {
    return <button>{props.text}</button>;
}

// 类组件：必须继承 React.Component，包含原型方法和实例属性
export class Button extends React.Component {
    render() {
        // render 是类的原型方法
        return <button>{this.props.text}</button>;
    }
}
```

-   类组件即使只使用 render 方法，也必须包含 class 定义、extends 继承等结构，这些代码难以被树摇（因为类可能被继承或动态调用）。
-   函数组件没有这些 “固定结构开销”，若未被引用，整个函数可被直接标记为死代码并移除。

类组件的树摇劣势举例：

```javascript
export class Card extends React.Component {
    // 未被使用的方法
    handleClick() {
        /* ... */
    }
    formatData() {
        /* ... */
    }

    render() {
        return <div>{this.props.content}</div>;
    }
}
```

打包工具无法安全移除 handleClick 和 formatData，因为：

-   这些方法可能被类的子类继承并使用；
-   可能通过动态方式调用（如 this['handleClick']()）；
-   类的原型链结构使静态分析难以确定方法是否 “真正未被使用”。

而函数组件若有未使用的内部函数，会被直接识别为死代码：

```javascript
export function Card(props) {
    // 未被使用的内部函数：会被树摇移除
    const handleClick = () => {
        /* ... */
    };

    return <div>{props.content}</div>;
}
```

#### 2、类组件有生命周期，可以使用 this

#### 3、Hooks 出现后函数组件功能更强大

### jsx 相关

#### JSX 是什么？

-   JavaScript XML 的缩写
-   语法糖，最终编译为 React.createElement()
-   可以在 JSX 中使用表达式和条件渲染

##### vue jsx

```javascript
// VueComponent.jsx
export default {
    data() {
        return {
            message: 'Hello Vue JSX!',
            count: 0,
        };
    },
    methods: {
        handleClick() {
            this.count++;
        },
    },
    render() {
        return (
            <div class="container">
                <h1>Vue JSX Example</h1>
                <button onClick={this.handleClick}>Count: {this.count}</button>
                <p>{this.message}</p>
                {this.count > 0 && <span>You clicked {this.count} times</span>}
            </div>
        );
    },
};
```

编译结果：

```javascript
// 编译后的代码
export default {
    data() {
        return {
            message: 'Hello Vue JSX!',
            count: 0,
        };
    },
    methods: {
        handleClick() {
            this.count++;
        },
    },
    render() {
        return this.$createElement(
            'div',
            {
                class: 'container',
            },
            [
                this.$createElement('h1', 'Vue JSX Example'),
                this.$createElement(
                    'button',
                    {
                        on: {
                            click: this.handleClick,
                        },
                    },
                    `Count: ${this.count}`
                ),
                this.$createElement('p', this.message),
                this.count > 0 ? this.$createElement('span', `You clicked ${this.count} times`) : null,
            ]
        );
    },
};
```

##### react jsx

```javascript
// ReactComponent.jsx
import React, { useState } from 'react';

function ReactComponent() {
    const [message, setMessage] = useState('Hello React JSX!');
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);
    };

    return (
        <div className="container">
            <h1>React JSX Example</h1>
            <button onClick={handleClick}>Count: {count}</button>
            <p>{message}</p>
            {count > 0 && <span>You clicked {count} times</span>}
        </div>
    );
}

export default ReactComponent;
```

编译结果：

```javascript
// 编译后的代码
import React, { useState } from 'react';

function ReactComponent() {
    const [message, setMessage] = useState('Hello React JSX!');
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);
    };

    return React.createElement(
        'div',
        {
            className: 'container',
        },
        [
            React.createElement('h1', null, 'React JSX Example'),
            React.createElement(
                'button',
                {
                    onClick: handleClick,
                },
                `Count: ${count}`
            ),
            React.createElement('p', null, message),
            count > 0 ? React.createElement('span', null, `You clicked ${count} times`) : null,
        ]
    );
}

export default ReactComponent;
```

## hook 相关

### 常用 hooks

1、useContext

-   跨组件数据传递
-   避免 props drilling(全局共享状态子组件需要定义多个属性)

创建：

```javascript
// UserContext.js
import React, { createContext, useContext, useState } from 'react';

// 创建 Context
const UserContext = createContext();

// 提供者组件
export function UserProvider({ children }) {
    const [user, setUser] = useState({
        name: '张三',
        age: 25,
        email: 'zhangsan@example.com',
    });

    const updateUser = (newUser) => {
        setUser(newUser);
    };

    return <UserContext.Provider value={{ user, updateUser }}>{children}</UserContext.Provider>;
}

// 自定义 Hook 方便使用
export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
}
```

在组件中使用：

```javascript
// App.js
import { UserProvider } from './UserContext';
import UserProfile from './UserProfile';
import UserSettings from './UserSettings';

function App() {
    return (
        <UserProvider>
            <div className="app">
                <UserProfile />
                <UserSettings />
            </div>
        </UserProvider>
    );
}

// UserProfile.js - 直接使用 Context
import { useUser } from './UserContext';

function UserProfile() {
    const { user } = useUser();

    return (
        <div className="profile">
            <h2>用户信息</h2>
            <p>姓名: {user.name}</p>
            <p>年龄: {user.age}</p>
            <p>邮箱: {user.email}</p>
        </div>
    );
}

// UserSettings.js - 修改 Context 数据
import { useUser } from './UserContext';

function UserSettings() {
    const { user, updateUser } = useUser();

    const handleNameChange = (newName) => {
        updateUser({ ...user, name: newName });
    };

    return (
        <div className="settings">
            <h2>设置</h2>
            <input value={user.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="输入新姓名" />
        </div>
    );
}
```

避免 Props Drilling 的对比：

```javascript
// ❌ 不好的做法 - Props Drilling
function App() {
    const [user, setUser] = useState({ name: '张三' });

    return (
        <div>
            <Header user={user} />
            <MainContent user={user} setUser={setUser} />
            <Footer user={user} />
        </div>
    );
}

function Header({ user }) {
    return <header>欢迎, {user.name}!</header>;
}

function MainContent({ user, setUser }) {
    return (
        <div>
            <Sidebar user={user} />
            <Content user={user} setUser={setUser} />
        </div>
    );
}
```

```javascript
// ✅ 好的做法 - 使用 Context
function App() {
    return (
        <UserProvider>
            <div>
                <Header />
                <MainContent />
                <Footer />
            </div>
        </UserProvider>
    );
}

function Header() {
    const { user } = useUser();
    return <header>欢迎, {user.name}!</header>;
}
```

2、useReducer

-   复杂状态管理
-   与 useState 的区别

```javascript
// ✅ 使用 useReducer - 集中状态管理
const FETCH_ACTIONS = {
    FETCH_START: 'fetch_start',
    FETCH_SUCCESS: 'fetch_success',
    FETCH_ERROR: 'fetch_error',
};

function fetchReducer(state, action) {
    switch (action.type) {
        case FETCH_ACTIONS.FETCH_START:
            return { ...state, loading: true, error: null };
        case FETCH_ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                count: state.count + 1,
            };
        case FETCH_ACTIONS.FETCH_ERROR:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

function ComplexComponent() {
    const [state, dispatch] = useReducer(fetchReducer, {
        count: 0,
        loading: false,
        error: null,
        data: null,
    });

    const handleFetch = async () => {
        dispatch({ type: FETCH_ACTIONS.FETCH_START });
        try {
            const result = await fetchData();
            dispatch({ type: FETCH_ACTIONS.FETCH_SUCCESS, payload: result });
        } catch (err) {
            dispatch({ type: FETCH_ACTIONS.FETCH_ERROR, payload: err.message });
        }
    };

    // 状态更新集中，易于维护和测试
}
```

```javascript
// ❌ 使用 useState - 复杂状态管理
function ComplexComponent() {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const handleFetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchData();
            setData(result);
            setCount((prev) => prev + 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 状态更新分散，难以维护
}
```

## 全局状态管理

### Redux Toolkit (RTK) - 企业级标准

#### 为什么是 RTK

Redux Toolkit 是 Redux 官方推荐的工具集，解决了传统 Redux 的三个主要问题：

-   配置复杂 - 需要手动配置 store、middleware
-   样板代码多 - 需要写大量的 action creators、reducers
-   需要额外库 - 需要 redux-thunk、redux-immutable-state-invariant 等

#### 核心概念解析

Slice（切片）：将相关的状态和逻辑组织在一起，类似于 Vuex 的 module。

传统 Redux 需要写很多样板代码:

```javascript
// Action Types
const SET_USER = 'SET_USER';
const SET_LOADING = 'SET_LOADING';

// Action Creators
const setUser = (user) => ({ type: SET_USER, payload: user });
const setLoading = (loading) => ({ type: SET_LOADING, payload: loading });

// Reducer
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case SET_LOADING:
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};
```

RTK 简化写法:

```javascript
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload; // 可以直接修改，Immer 会处理不可变性
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});
```

#### 异步处理对比

传统 Redux 需要手动处理异步：

```javascript
// 需要 redux-thunk
const fetchUser = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const user = await api.getUser(id);
        dispatch(setUser(user));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};
```

RTK 使用 createAsyncThunk：

```javascript
// 自动生成 pending/fulfilled/rejected 状态
export const fetchUser = createAsyncThunk('user/fetchUser', async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
});

// 在 extraReducers 中处理这些状态
extraReducers: (builder) => {
    builder
        .addCase(fetchUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
};
```

#### 完整的使用示例

##### 1. 安装依赖

首先需要安装 Redux Toolkit 和 React-Redux（如果在 React 项目中使用）：

```sh
npm install @reduxjs/toolkit react-redux
# 或
yarn add @reduxjs/toolkit react-redux
```

##### 2. 创建 Redux Store

使用 RTK 的 configureStore 替代传统的 createStore，它内置了中间件配置：

```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice'; // 后续创建的切片

export const store = configureStore({
    reducer: {
        counter: counterReducer, // 将切片 reducer 添加到 store
    },
});
```

##### 3. 创建 Slice（切片）

使用 createSlice 定义状态、reducer 和 actions（无需手动编写 action types）：

```javascript
// src/store/slices/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

// 初始状态
const initialState = {
    value: 0,
};

// 创建切片
const counterSlice = createSlice({
    name: 'counter', // 切片名称（用于生成 action type）
    initialState,
    reducers: {
        // 定义 reducer 函数（自动生成对应的 action creators）
        increment: (state) => {
            // RTK 内部使用 Immer，可直接"修改"状态（实际是生成新状态）
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        },
    },
});

// 导出 action creators
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 导出切片的 reducer（用于配置 store）
export default counterSlice.reducer;
```

##### 4. 在应用中提供 Store

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
```

##### 5. 在组件中使用 Redux 状态和 Actions

使用 useSelector 获取状态，useDispatch 触发 actions：

```javascript
// src/components/Counter.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../store/slices/counterSlice';

export default function Counter() {
    // 获取状态
    const count = useSelector((state) => state.counter.value);
    // 获取 dispatch 函数
    const dispatch = useDispatch();

    return (
        <div>
            <h1>Count: {count}</h1>
            <button onClick={() => dispatch(increment())}>+</button>
            <button onClick={() => dispatch(decrement())}>-</button>
            <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
        </div>
    );
}
```

#### 核心原理

Redux 触发 React 组件渲染的核心是通过 状态订阅 + 变化检测 + React 重渲染机制 的联动，以下是结合伪代码的简化总结：

##### 1. Redux Store 基础能力

```javascript
// Redux 核心：状态存储与订阅机制
function createStore(reducer) {
    let state;
    const listeners = []; // 存储订阅者

    // 触发状态更新的唯一方法
    function dispatch(action) {
        state = reducer(state, action); // 计算新状态
        listeners.forEach((listener) => listener()); // 通知所有订阅者
    }

    // 订阅状态变化
    function subscribe(listener) {
        listeners.push(listener);
        return () => {
            /* 取消订阅逻辑 */
        }; // 组件卸载时调用
    }

    return { getState: () => state, dispatch, subscribe };
}
```

##### 2. react-redux 连接层（核心桥梁）

```javascript
// 1. Provider：通过 Context 传递 Store 到组件树
const ReduxContext = React.createContext();
function Provider({ store, children }) {
    return <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>;
}

// 2. useSelector：订阅状态并触发组件重渲染
function useSelector(selector) {
    // 从 Context 获取 Redux Store
    const store = React.useContext(ReduxContext);
    // 用 React 状态存储选中的 Redux 状态（用于触发重渲染）
    const [selectedState, setSelectedState] = React.useState();

    // 组件初始化时订阅 Redux 状态变化
    React.useEffect(() => {
        // 初始化：获取初始状态
        setSelectedState(selector(store.getState()));

        // 定义订阅回调：状态变化时执行
        const listener = () => {
            const newState = store.getState(); // 获取最新 Redux 状态
            const newSelected = selector(newState); // 用选择器提取需要的部分

            // 对比新旧状态（浅比较），不同则更新组件状态触发重渲染
            if (newSelected !== selectedState) {
                setSelectedState(newSelected);
            }
        };

        // 订阅 Redux 状态变化
        const unsubscribe = store.subscribe(listener);
        // 组件卸载时取消订阅
        return () => unsubscribe();
    }, [store, selector]);

    return selectedState; // 返回选中的状态给组件使用
}
```

##### 3. 组件使用与触发流程

```javascript
// 步骤1：创建 Redux Store 并通过 Provider 注入
const store = createStore(counterReducer);
ReactDOM.render(
    <Provider store={store}>
        <Counter />
    </Provider>,
    document.getElementById('root')
);

// 步骤2：组件中使用 useSelector 订阅状态
function Counter() {
    // 订阅 Redux 中的 count 状态
    const count = useSelector((state) => state.count);
    const dispatch = useDispatch();

    return (
        <div>
            <p>{count}</p>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
        </div>
    );
}
```

#### 总结

实际使用场景
适用场景：

-   大型电商平台（状态复杂，需要时间旅行调试）
-   企业管理系统（团队协作，需要严格规范）
-   需要复杂中间件的应用

优势：

-   调试工具强大（Redux DevTools）
-   生态最完善
-   团队协作友好
-   状态变化可追踪

### Zustand - 轻量级首选

Zustand 是一个轻量级的 React 状态管理库，它以简洁的 API 和易用性著称，相比 Redux 等库更加简单直观。

#### 基本使用方法：

##### 1. 安装

```sh
npm install zustand
# 或
yarn add zustand
```

##### 2. 基本使用

**创建 store**
使用 create 函数创建一个 store，它接收一个函数作为参数，该函数返回一个状态对象和修改状态的方法：

```javascript
import { create } from 'zustand';

// 创建一个计数器 store
const useCounterStore = create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
}));
```

**在组件中使用**
在组件中直接调用创建的 store 钩子即可获取状态和方法：

```javascript
function Counter() {
    // 选择性获取需要的状态和方法
    const { count, increment, decrement, reset } = useCounterStore();

    return (
        <div>
            <h1>Count: {count}</h1>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}
```

##### 3. 高级特性

**选择性订阅**

为了性能优化，可以只订阅需要的状态：

```javascript
// 只获取 count，组件只会在 count 变化时重新渲染
const count = useCounterStore((state) => state.count);
```

**异步操作**

Zustand 支持异步操作，直接在方法中使用 async/await 即可：

```javascript
const useUserStore = create((set) => ({
    user: null,
    loading: false,
    fetchUser: async (userId) => {
        set({ loading: true });
        try {
            const response = await fetch(`/api/users/${userId}`);
            const user = await response.json();
            set({ user, loading: false });
        } catch (error) {
            set({ loading: false });
            console.error(error);
        }
    },
}));
```

**中间件**
Zustand 支持中间件，例如使用持久化、订阅选择器：

```javascript
// 持久化
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
        }),
        {
            name: 'user-storage', // localStorage 的 key
            partialize: (state) => ({ user: state.user }), // 只持久化用户信息
        }
    )
);

// 订阅选择器
import { subscribeWithSelector } from 'zustand/middleware';

const useStore = create(
    subscribeWithSelector((set, get) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
    }))
);

// 监听状态变化
useStore.subscribe(
    (state) => state.count,
    (count) => console.log('count changed:', count)
);
```

##### 4. 与 TypeScript 配合 4. 与 TypeScript 配合

Zustand 对 TypeScript 有很好的支持，可以为状态和方法定义类型：

```javascript
import { create } from 'zustand';

interface CounterState {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
}

const useCounterStore =
    create <
    CounterState >
    ((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        reset: () => set({ count: 0 }),
    }));
```

##### 总结

Zustand 的核心优势在于：

-   极简的 API，学习成本低
-   无需 Provider 包裹
-   支持选择性订阅，优化性能
-   良好的 TypeScript 支持
-   轻量（约 1KB）

## 性能优化

-   避免在 render 中创建对象和函数
-   合理使用 React.memo、useMemo、useCallback
-   使用 key 属性优化列表渲染
-   代码分割和懒加载（lazy）

```javascript
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Suspense>
    );
}
```

-   及时清理副作用和定时器

```javascript
// 清理副作用
useEffect(() => {
    const subscription = someAPI.subscribe();

    return () => {
        subscription.unsubscribe();
    };
}, []);

// 清理定时器
useEffect(() => {
    const timer = setInterval(() => {
        // 执行定时任务
    }, 1000);

    return () => {
        clearInterval(timer);
    };
}, []);
```

-   定期使用性能分析工具
    使用 React DevTools 的 Profiler 来识别性能瓶颈：

```javascript
import { Profiler } from 'react';

function onRenderCallback(
    id, // Profiler树的id
    phase, // "mount" (首次) 或 "update" (重渲染)
    actualDuration, // 渲染花费的时间
    baseDuration, // 估计不使用memoization的情况下渲染花费的时间
    startTime, // 渲染开始的时间
    commitTime, // 渲染提交的时间
    interactions // 导致更新的交互的集合
) {
    console.log('Render time:', actualDuration);
}

function App() {
    return (
        <Profiler id="App" onRender={onRenderCallback}>
            <YourComponent />
        </Profiler>
    );
}
```

## 路由

### React 路由的实现原理是什么？

核心原理：基于浏览器的 History API 或 哈希（Hash） 监听 URL 变化，通过 “路径 - 组件” 映射表匹配并渲染对应组件。

-   **History 模式（BrowserRouter）：**
    利用 HTML5 的 history.pushState()、history.replaceState() 方法修改 URL，不会触发页面刷新；通过 popstate 事件监听浏览器前进 / 后退操作，同步更新组件。
-   **Hash 模式（HashRouter）：**
    利用 URL 中的哈希（# 后面的部分）变化不会触发页面请求的特性，通过 hashchange 事件监听哈希变化，同步更新组件。
-   **匹配逻辑：**
    Routes 组件维护一个路由映射表，当 URL 变化时，遍历 Route 组件，通过 “最长路径匹配优先” 原则找到第一个匹配的 Route，渲染其 element 属性指定的组件。

### React Router v5 和 v6 有哪些主要区别？

| 特性         | v5                                   | v6                                                      |
| ------------ | ------------------------------------ | ------------------------------------------------------- |
| 路由容器     | Switch（匹配第一个符合条件的路由）   | Routes（功能类似，但必须包裹 Route）                    |
| 路由组件渲染 | component/render 属性                | element 属性（直接传入组件实例，如 element={<Home />}） |
| 嵌套路由     | 子路由通过 children 或路径拼接       | 必须使用 Outlet 作为子路由占位符，路径自动相对父路由    |
| 导航方法     | useHistory() 返回 history 对象       | useNavigate() 返回 navigate 函数（更简洁）              |
| 重定向       | <Redirect to="/" />                  | <Navigate to="/" />                                     |
| 路由参数获取 | useParams() 用法类似，但类型推断更弱 | useParams() 类型推断更严格（需配合 TypeScript 泛型）    |
| 路由匹配精度 | 需手动添加 exact 属性实现精确匹配    | 默认精确匹配（无需 exact）                              |
| 路由守卫     | 需自定义高阶组件包裹 Route           | 可通过 Outlet 结合条件渲染实现                          |

### 如何实现路由守卫（权限控制，如未登录不能访问首页）？

路由守卫用于限制页面访问权限（如登录后才能访问个人中心），核心思路是 “条件渲染 + 重定向”。
实现方式：自定义私有路由组件，通过 Outlet 渲染子路由（已登录）或 Navigate 重定向（未登录）。

```javascript
// 私有路由组件
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
    const isLogin = localStorage.getItem('token'); // 假设通过 token 判断登录状态

    if (!isLogin) {
        // 未登录：重定向到登录页，并记录当前路径（登录后可跳转回来）
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // 已登录：渲染子路由
    return <Outlet />;
}

// 路由配置
<Routes>
    <Route path="/profile" element={<PrivateRoute />}>
        <Route index element={<Profile />} /> {/* 只有登录后才能访问 */}
    </Route>
    <Route path="/login" element={<Login />} />
</Routes>;
```

### React 路由和 Vue 路由的核心区别？

| 维度       | React 路由（react-router-dom）   | Vue 路由（vue-router）                    |
| ---------- | -------------------------------- | ----------------------------------------- |
| 核心思想   | 基于组件（Route、Link 等组件）   | 基于配置（路由配置数组）+ 组件            |
| 路由匹配   | Routes 包裹 Route，最长路径优先  | 基于 path-to-regexp，支持更复杂的匹配规则 |
| 嵌套路由   | 需显式使用 Outlet 作为占位符     | 基于 `<router-view>` 自动匹配嵌套路由     |
| 编程式导航 | useNavigate() 返回 navigate 函数 | this.\$router.push() 或 useRouter()       |
| 路由守卫   | 需自定义组件实现                 | 内置 beforeEach、beforeEnter 等钩子       |

## 错误处理

### 分类

| 错误类型   | 发生场景                                                         | 特点                                                               |
| ---------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| 渲染时错误 | 组件渲染阶段（如 render 函数、JSX 解析、子组件初始化）抛出的错误 | 会导致组件树中断渲染，若未处理，可能引发整个应用崩溃               |
| 运行时错误 | 事件处理函数、异步代码（setTimeout/Promise/fetch）、useEffect 等 | 不会直接中断组件渲染，但可能导致功能异常（如数据未加载、交互失效） |

### 错误边界（Error Boundary）

#### 什么是错误边界（Error Boundary）？它的作用是什么？

解析：错误边界是 React 提供的捕获子组件渲染错误的机制，本质是实现了 getDerivedStateFromError 或 componentDidCatch 方法的类组件。

作用：

-   捕获子组件树中的渲染错误（如 JSX 语法错误、组件初始化错误）。
-   防止错误扩散导致整个应用崩溃，仅展示出错部分的备用 UI。
-   收集错误信息用于日志上报。

#### 2. 错误边界能捕获哪些错误？不能捕获哪些错误？

能捕获的错误：

-   子组件的 render 方法中抛出的错误。
-   子组件生命周期方法中抛出的错误（如 componentDidMount）。
-   子组件的构造函数（constructor）中抛出的错误。

不能捕获的错误(通过 try catch 处理)：

-   错误边界自身的错误（只能捕获子组件的错误）。
-   事件处理函数中的错误（如 onClick，React 不将事件处理视为渲染阶段）。
-   异步代码中的错误（如 setTimeout、Promise、fetch）。
-   服务器端渲染（SSR）中的错误。

#### 3. 如何实现一个错误边界？

实现步骤：

-   创建类组件，定义 hasError 状态标记是否出错。
-   实现 static getDerivedStateFromError：接收错误，返回新状态（{ hasError: true }），用于渲染备用 UI。
-   实现 componentDidCatch：接收错误和错误信息，用于日志上报。
-   在 render 中根据 hasError 状态，渲染备用 UI 或子组件。

```javascript
class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true }; // 触发备用 UI 渲染
    }

    componentDidCatch(error, errorInfo) {
        console.error('错误上报：', error, errorInfo); // 日志上报
    }

    render() {
        return this.state.hasError ? this.props.fallback : this.props.children;
    }
}
```

#### 4、React 18 对错误处理有哪些更新？

主要更新：

-   自动卸载出错的子树：React 18 中，错误边界捕获错误后，会自动卸载出错的子组件树（释放资源），而 React 17 及之前会保留出错的子树。
-   更严格的错误边界检查：若错误边界未正确实现 getDerivedStateFromError 或 componentDidCatch，React 18 会抛出警告。
-   并发渲染中的错误处理：在并发渲染模式下，错误边界的行为更稳定，确保错误仅影响出错的渲染分支。

## 测试

### Jest + React Testing Library：协同工作的底层逻辑与实践

Jest 和 React Testing Library（RTL）是 React 测试的 “黄金组合”，但两者职责边界清晰，需理解其协同逻辑才能在面试中体现深度。

#### 1. 核心职责：各司其职，互补协同

-   Jest：负责 “测试的基础设施”
    -   作为测试运行器：解析测试文件、执行测试用例、生成测试报告（如通过率、覆盖率）。
    -   作为断言库：提供 expect().toBe()、expect().toHaveBeenCalled() 等方法，验证结果是否符合预期。
    -   作为模拟工具：通过 jest.mock()、jest.fn() 等 API 模拟函数、模块、定时器等，隔离外部依赖。
-   RTL：负责 “模拟用户视角的交互”
    -   基于 DOM Testing Library，提供组件渲染（render()）、DOM 查询（screen.getBy\*）、事件模拟（配合 userEvent）等能力。
    -   核心原则：“测试用户能看到和做到的事”，不关注组件内部实现（如 state、props 传递细节）。

#### 2. 协同流程：从渲染到断言的完整链路

以 “测试一个点击按钮后显示文本的组件” 为例，看两者如何配合：

```javascript
// ButtonWithMessage.jsx
function ButtonWithMessage() {
    const [showMessage, setShowMessage] = useState(false);
    return (
        <div>
            <button onClick={() => setShowMessage(true)}>点击显示</button>
            {showMessage && <p>Hello World</p>}
        </div>
    );
}

// ButtonWithMessage.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ButtonWithMessage from './ButtonWithMessage';

test('点击按钮后显示Hello World', async () => {
    // 1. RTL负责渲染组件到虚拟DOM
    render(<ButtonWithMessage />);

    // 2. RTL通过用户可见文本查询元素（模拟用户视角）
    const button = screen.getByRole('button', { name: /点击显示/ });

    // 3. RTL + userEvent模拟用户点击（更真实的交互）
    const user = userEvent.setup();
    await user.click(button);

    // 4. Jest负责断言结果（验证用户看到的内容）
    expect(screen.getByText('Hello World')).toBeInTheDocument();
});
```

协同点：

-   RTL 处理 “组件如何渲染”“用户如何交互”，确保测试贴近真实使用场景；
-   Jest 处理 “结果是否正确”，通过断言验证最终状态。

#### 3. 面试易错点：理解 “为何不推荐测试实现细节”

RTL 刻意不提供访问组件内部状态（如 state）或方法（如 instance()）的 API，这是面试高频考点：

-   反例：用 Enzyme 测试时可能写 expect(wrapper.state('showMessage')).toBe(true)，但如果组件重构为 Redux 管理状态，测试会失效；
-   正例：用 RTL 测试 screen.getByText('Hello World') 是否存在，无论内部状态如何管理，只要用户看到的结果不变，测试就有效。

Jest + RTL 的组合强制开发者 “站在用户角度写测试”，这是 React 官方推荐的核心原因。

### 单元测试 vs 集成测试：边界与取舍

React 测试中，单元测试和集成测试的划分不是 “非此即彼”，而是 “互补覆盖”，面试中需讲清两者的边界、适用场景及权衡。

#### 定义与核心区别

| 维度     | 单元测试（Unit Testing）                | 集成测试（Integration Testing）            |
| -------- | --------------------------------------- | ------------------------------------------ |
| 测试对象 | 独立单元（单个组件、函数、Hook）        | 多个单元的协同（组件树、组件与工具的交互） |
| 核心目标 | 验证单元逻辑的正确性                    | 验证单元协作的正确性                       |
| 依赖处理 | 隔离外部依赖（通过 Mock/Stub 消除依赖） | 保留必要依赖（如子组件、真实 API 模拟）    |
| 示例场景 | 测试 Button 组件的样式渲染              | 测试 Form 组件与 Input 组件的联动          |

#### React 中的实践场景

-   单元测试适用场景：
    -   纯函数（如 formatPrice 价格格式化函数）；
    -   独立 UI 组件（如 Avatar、Badge，无复杂子组件）；
    -   自定义 Hook（如 useLocalStorage，需验证状态逻辑）。
        示例：测试一个计算总价的工具函数

```javascript
// utils/cart.js
export const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// utils/cart.test.js
import { calculateTotal } from './cart';

test('计算商品总价', () => {
    const items = [
        { price: 10, quantity: 2 },
        { price: 15, quantity: 1 },
    ];
    // 单元测试直接验证函数输出
    expect(calculateTotal(items)).toBe(35); // 10*2 + 15*1 = 35
});
```

-   集成测试适用场景：
    -   组件树（如 List 与 ListItem 的渲染关系）；
    -   交互流程（如 “输入表单 → 点击提交 → 显示成功提示”）；
    -   状态管理联动（如组件与 Redux、Context 的数据同步）。

示例：测试表单提交后的数据处理

```javascript
// CheckoutForm.jsx（包含Input和Button子组件）
function CheckoutForm({ onSubmit }) {
    const [name, setName] = useState('');
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(name);
            }}
        >
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="输入姓名" />
            <button type="submit">提交</button>
        </form>
    );
}

// CheckoutForm.test.jsx
test('表单提交后调用onSubmit并传递输入值', async () => {
    const mockSubmit = jest.fn();
    render(<CheckoutForm onSubmit={mockSubmit} />);

    const user = userEvent.setup();
    // 模拟用户输入（Input组件）和点击提交（Button组件）
    await user.type(screen.getByPlaceholderText('输入姓名'), '张三');
    await user.click(screen.getByRole('button', { name: /提交/ }));

    // 验证组件协作：输入值正确传递给onSubmit
    expect(mockSubmit).toHaveBeenCalledWith('张三');
});
```

#### 面试高频问题：“什么时候优先写集成测试？”

-   当功能正确性依赖多个单元的交互时（如表单提交必须依赖输入框和按钮的配合）；
-   当组件重构时，集成测试更能保证用户体验不变（单元测试可能因实现变化频繁失效）；
-   遵循 “测试金字塔” 原则：底层单元测试保证基础逻辑，中层集成测试覆盖交互，顶层 E2E 测试验证核心流程。

### Mock 和 Stub：测试中的 “替身术”

Mock 和 Stub 是隔离外部依赖的核心技术，但很多开发者混淆两者的区别。面试中需讲清定义、使用场景及 Jest 中的实现方式。

#### 概念与核心区别

-   Stub（桩）：
    用于 “提供测试所需的固定返回值”，不关心被调用的细节（如次数、参数）。
    作用：替代外部依赖（如 API、数据库），让测试聚焦于当前单元的逻辑。

-   Mock（模拟）：
    不仅提供返回值，还会 “记录自身被调用的细节”（如调用次数、参数），用于验证交互是否符合预期。
    作用：验证单元之间的协作是否正确（如 “组件是否正确调用了回调函数”）。

#### Jest 中的实现与场景

-   Stub 的使用：模拟 API 返回、工具函数结果等
    例：测试一个依赖 API 数据的组件，用 Stub 提供固定数据：

```javascript
// UserProfile.jsx（依赖API获取用户数据）
function UserProfile() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        fetch('/api/user/1')
            .then((res) => res.json())
            .then((data) => setUser(data));
    }, []);
    return user ? <div>{user.name}</div> : <div>加载中</div>;
}

// UserProfile.test.jsx（用Stub模拟API返回）
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// 定义Stub：GET /api/user/1 固定返回 {name: '张三'}
const server = setupServer(
    rest.get('/api/user/1', (req, res, ctx) => {
        return res(ctx.json({ name: '张三' })); // Stub提供固定数据
    })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

test('显示用户名称', async () => {
    render(<UserProfile />);
    // 无需关心API如何被调用，只验证结果（Stub的核心）
    expect(await screen.findByText('张三')).toBeInTheDocument();
});
```

-   mock 的使用：：验证函数调用、组件交互等
    例：测试一个按钮点击后是否正确调用回调函数：

```javascript
// ActionButton.jsx
function ActionButton({ onClick, label }) {
    return <button onClick={onClick}>{label}</button>;
}

// ActionButton.test.jsx（用Mock验证交互）
test('点击按钮调用onClick', async () => {
    // 创建Mock函数（会记录调用细节）
    const mockOnClick = jest.fn();
    render(<ActionButton onClick={mockOnClick} label="删除" />);

    await userEvent.click(screen.getByText('删除'));

    // 验证Mock被调用（次数、参数）—— Mock的核心价值
    expect(mockOnClick).toHaveBeenCalledTimes(1); // 调用1次
    expect(mockOnClick).toHaveBeenCalledWith(expect.any(MouseEvent)); // 参数正确
});
```

### 总结

-   Jest + RTL：前者是 “测试引擎”，后者是 “用户视角模拟器”，协同保证测试的真实性和健壮性；
-   单元测试 vs 集成测试：前者保独立逻辑，后者保交互流程，需根据场景平衡覆盖；
-   Mock vs Stub：Stub 解决 “依赖数据”，Mock 解决 “交互验证”，避免过度使用导致测试失真。

## 高级特性

### 并发特性

#### Concurrent Mode（并发模式）：渲染机制的底层革新

Concurrent Mode 是 React 渲染架构的核心升级，它不是一个 API，而是一种可中断、可恢复、优先级可控的渲染机制。

##### 解决的核心问题：同步渲染的局限性

在 React 18 之前，渲染是 “同步且不可中断” 的：一旦开始渲染（如执行 setState 触发更新），React 会持续占用主线程完成整个渲染过程（从 Reconciliation 到 Commit）。如果渲染任务复杂（如大列表渲染、重计算），会阻塞用户交互（如输入、点击），导致 UI 卡顿。
例：用户在输入框打字时，若同时触发一个复杂列表的重新渲染，输入会卡顿 —— 因为同步渲染中，列表渲染会阻塞输入事件的处理。

##### 并发模式的核心能力：渲染可中断与优先级调度

Concurrent Mode 允许 React 将渲染工作分解为 “小单元”，在执行过程中根据优先级暂停、恢复或放弃：

-   优先级划分：React 为不同更新分配优先级（如用户输入 > 动画 > 数据加载）；
-   中断与恢复：高优先级任务（如输入）可中断低优先级任务（如列表渲染），待高优先级任务完成后，低优先级任务可从断点恢复；
-   避免浪费：若低优先级任务被中断后，相关状态已失效（如用户快速切换筛选条件），React 可直接放弃该任务，避免无效计算。
    这一机制让 React 在处理复杂更新时，仍能保持 UI 对用户操作的即时响应。

##### 与 React 18 的关系：从 “显式模式” 到 “自动启用”

React 18 中，Concurrent Mode 不再需要通过 ReactDOM.unstable_createRoot 显式开启，而是通过使用并发特性（如 Suspense、startTransition）自动启用。即：当应用使用了这些特性，React 会自动切换到并发渲染模式；未使用时，仍保持同步渲染的兼容性。

### Suspense：异步操作的 “优雅等待” 方案

Suspense 是用于声明式处理异步操作等待状态的 API，核心作用是：在异步操作（如代码分割、数据加载）完成前，显示 “加载占位符”（fallback），完成后自动切换到目标内容。

#### 1. 设计动机：解决 “异步加载的碎片化状态管理”

传统处理异步加载（如请求数据）时，需要手动管理 loading、error、data 三种状态，代码分散且重复：

```javascript
// 传统方式：手动管理加载状态
function UserProfile() {
    const [state, setState] = useState({
        loading: true,
        data: null,
        error: null,
    });

    useEffect(() => {
        fetchUser().then(
            (data) => setState({ loading: false, data }),
            (error) => setState({ loading: false, error })
        );
    }, []);

    if (state.loading) return <Spinner />;
    if (state.error) return <ErrorMessage />;
    return <Profile data={state.data} />;
}
```

Suspense 通过声明式语法将异步等待逻辑集中管理，简化代码：

```javascript
// Suspense方式：声明式等待
function UserProfile() {
    // fetchUser抛出 throw promsie 会“暂停”组件渲染，直到数据就绪（需配合Suspense兼容的数据获取库）
    const data = fetchUser();
    return <Profile data={data} />;
}

// 父组件中用Suspense统一指定加载占位符
function App() {
    return (
        <Suspense fallback={<Spinner />}>
            <UserProfile />
        </Suspense>
    );
}
```

#### 2. 核心用法与场景

Suspense 的能力随 React 版本逐步扩展，目前成熟场景包括：

-   场景 1：代码分割（Code Splitting）

```javascript
// 动态导入组件（仅在需要时加载）
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
    return (
        <div>
            {/* 加载LazyComponent时显示"加载中..." */}
            <Suspense fallback={<div>加载中...</div>}>
                <LazyComponent />
            </Suspense>
        </div>
    );
}
```

原理：React.lazy 返回的组件在加载时会 “抛出 Promise”，Suspense 捕获该 Promise 并显示 fallback，直到 Promise resolve。

-   场景 2：数据加载（实验性，需配合特定库）

需使用支持 Suspense 的数据获取库（如 Relay、React Query 的实验版本），核心是让数据请求函数在数据未就绪时 “抛出 Promise”，由 Suspense 接管等待逻辑。
注意：React 官方尚未支持 “原生 fetch+Suspense”，直接在 useEffect 中 fetch 无法配合 Suspense 使用（需通过库封装）。

#### 3. 关键特性：边界与复用

-   Suspense 边界：Suspense 是 “向上查找” 的，即子组件触发的异步等待会寻找最近的父级 Suspense 组件作为边界；
-   复用 fallback：多个异步操作可共享同一个 Suspense 边界，避免重复定义 loading 状态；
-   避免瀑布流：配合 startTransition 或并发渲染，可并行处理多个异步操作，减少等待时间。

### startTransition：标记 “非紧急更新”，保持 UI 响应

startTransition 是用于区分更新优先级的 API，允许将部分更新标记为 “非紧急更新”（transition），React 会优先处理紧急更新（如输入、点击），延迟处理非紧急更新，从而避免 UI 卡顿。

#### 1. 解决的核心问题：高优先级操作被低优先级更新阻塞

例：在搜索框输入时，实时根据输入过滤大列表。若直接在 onChange 中触发列表过滤和重新渲染，当列表规模大时，过滤计算和渲染会阻塞输入事件，导致输入卡顿（用户输入后，字符显示延迟）。

原因：输入事件（紧急更新）和列表过滤（非紧急更新）在同步渲染中会按顺序执行，低优先级的过滤会阻塞高优先级的输入。

#### 2. 工作原理：优先级划分与延迟执行

startTransition 接收一个函数，函数内的状态更新会被标记为 “非紧急更新”：

```javascript
import { startTransition } from 'react';

function SearchBox() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);

    const handleChange = (e) => {
        const value = e.target.value;
        // 1. 紧急更新：更新输入框内容（用户即时可见）
        setInput(value);

        // 2. 非紧急更新：标记为transition，延迟执行
        startTransition(() => {
            // 过滤逻辑（可能耗时）
            const filtered = largeList.filter((item) => item.includes(value));
            setResults(filtered);
        });
    };

    return (
        <div>
            <input value={input} onChange={handleChange} />
            <ResultsList results={results} />
        </div>
    );
}
```

-   紧急更新（setInput）：立即执行，确保用户输入即时响应；
-   非紧急更新（setResults）：被标记为 transition，React 会在主线程空闲时执行，若期间有新的紧急更新（如用户继续输入），可中断当前 transition 更新，避免卡顿。

#### 3. 关键特性与使用场景

-   与 setTimeout 的区别：setTimeout 只是延迟执行，仍会阻塞主线程；startTransition 的更新可被中断，且优先级低于用户交互；
-   适用场景：
    -   搜索框实时过滤（输入是紧急，过滤结果是非紧急）；
    -   标签页切换（点击标签是紧急，加载标签内容是非紧急）；
    -   数据可视化的参数调整（拖动滑块是紧急，重新绘制图表是非紧急）；
-   配合 useTransition：通过 useTransition 可获取 transition 的 pending 状态，用于显示 “正在加载” 提示：

```javascript
import { useTransition } from 'react';

function SearchBox() {
  const [isPending, startTransition] = useTransition();
  // ...
  return (
    <div>
      <input ... />
      {isPending && <div>正在搜索...</div>}
      <ResultsList ... />
    </div>
  );
}
```

#### 4、与防抖的区别

| 特性     | 防抖（debounce）                                               | startTransition（并发特性）                                             |
| -------- | -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 核心目标 | 限制函数在「时间窗口内的执行次数」（如 100ms 内只执行一次）    | 区分更新的「优先级」（紧急更新优先，非紧急更新延迟）                    |
| 作用层面 | 控制「函数调用时机」（纯 JavaScript 机制）                     | 控制「React 状态更新的调度优先级」（依赖 React 并发渲染）               |
| 适用场景 | 高频触发的函数（如 resize、scroll、输入框实时搜索的 API 请求） | React 组件中，非紧急的状态更新（如搜索结果渲染、列表筛选后的 DOM 更新） |

**为什么不能互相替代？**

1. 防抖的核心价值：减少 “外部资源消耗”
   防抖的典型场景是限制高频触发的 “外部操作”（如 API 请求、DOM 操作、计算任务），核心是通过 “等待用户操作停止一段时间后再执行” 来减少资源浪费。
   例如：用户快速输入搜索词时，防抖可以让 API 请求只在用户停止输入 100ms 后发送，避免短时间内发送 10 次请求（浪费带宽和服务器资源）。
   而 startTransition 不控制 “函数是否执行”，只控制 “执行后的状态更新何时渲染”。即使你用 startTransition 包裹 API 请求，API 请求依然会被频繁触发（只是结果渲染被延迟），依然会浪费资源。

2. startTransition 的核心价值：保证 “用户交互流畅性”
   startTransition 的作用是让非紧急的渲染更新 “让位于” 紧急的用户交互（如输入、点击），避免主线程被阻塞导致的 UI 卡顿。
   例如：用户输入时，输入框本身的状态更新（紧急）需要立即响应，而搜索结果的渲染（非紧急）可以延迟。但 startTransition 不会阻止搜索逻辑本身的执行（比如筛选计算），只是让渲染等待。
   如果你的问题是 “频繁触发的计算 / 渲染导致 UI 卡”，startTransition 有用；但如果问题是 “频繁触发的 API 请求浪费资源”，startTransition 无能为力，必须用防抖。

**结合使用**

-   防抖解决 “API 请求频繁触发” 的问题（减少资源消耗）；
-   startTransition 解决 “请求结果返回后，渲染大量数据导致输入卡顿” 的问题（保证交互流畅）。

```javascript
import { useState, startTransition } from 'react';
import { debounce } from 'lodash'; // 假设使用防抖工具

function Search() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);

    // 1. 用防抖限制API请求频率（减少外部资源消耗）
    const fetchResults = debounce(async (query) => {
        const res = await fetch(`/api/search?query=${query}`);
        const data = await res.json();

        // 2. 用startTransition标记结果更新为低优先级（避免渲染阻塞输入）
        startTransition(() => {
            setResults(data);
        });
    }, 100); // 等待用户停止输入100ms后再请求

    const handleInput = (e) => {
        const query = e.target.value;
        setInput(query); // 紧急更新：输入框立即响应
        fetchResults(query); // 触发防抖后的请求
    };

    return (
        <div>
            <input value={input} onChange={handleInput} />
            <ul>
                {results.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}
```

### 其他

#### Portal

##### 核心概念

Portal 是 React 提供的一种将子组件渲染到父组件 DOM 层级之外的技术，突破了默认的 "父组件 DOM 容器内渲染" 的限制。
语法：ReactDOM.createPortal(child, container)，其中 child 是要渲染的 React 元素，container 是目标 DOM 节点（如 document.body）。

##### 常考面试题

###### 什么是 Portal？它解决了什么问题？

-   Portal 允许组件渲染到当前组件树的 DOM 层级之外（如直接渲染到 body）。
-   解决的核心问题：
    -   样式隔离：避免父组件的 overflow: hidden、z-index 等样式限制子组件（如模态框被父容器裁剪）。
    -   DOM 语义合规：某些场景下子元素必须放在特定 DOM 位置（如 dialog 元素通常建议放在 body 下）。
    -   事件冒泡一致性：即使渲染到外部，事件依然会按照 React 组件树冒泡（而非实际 DOM 层级），保证逻辑一致性。

```javascript
import { createPortal } from 'react-dom';

function Modal({ children, isOpen, onClose }) {
    if (!isOpen) return null;
    // 渲染到body下，避免被父组件样式影响
    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body // 目标容器
    );
}
```

###### portal 的事件冒泡有什么特点？

-   Portal 的事件会沿着 React 组件树冒泡，而非实际的 DOM 层级。
-   例如：上述 Modal 组件虽然渲染在 body 下，但它的点击事件会冒泡到它在 React 组件树中的父组件（而非 body 的父元素）。
-   这是因为 React 事件系统基于虚拟 DOM，与实际 DOM 结构解耦，保证了组件逻辑的一致性。

###### 使用 Portal 时需要注意什么？

-   目标容器存在性：确保 container 在组件挂载时已存在（可在 useEffect 中动态创建）。
-   清理工作：若动态创建容器，需在组件卸载时移除（避免 DOM 残留）。
-   样式定位：渲染到 body 的元素可能需要通过 fixed 定位，避免受滚动影响。

#### Refs 的使用

##### 核心概念

Refs 用于直接访问 DOM 节点或 React 组件实例，绕开 React 的声明式数据流，适用于需要直接操作底层的场景:

-   表单控制：获取输入框的值（如 input 的 focus()、select()方法）。
-   媒体操作：视频 / 音频的 play()、pause()。
-   动画控制：通过 DOM 操作触发 CSS 动画或第三方动画库（如 GreenSock）。
-   访问子组件实例：调用类组件的方法（函数组件默认无实例，需配合 forwardRef）。

##### 创建 Refs 的方式有哪些？区别是什么？

三种方式：

-   createRef：类组件和函数组件均可使用，每次渲染会创建新的 Ref 对象。

```javascript
class MyComponent extends React.Component {
    myRef = React.createRef();
    render() {
        return <div ref={this.myRef} />;
    }
}
```

-   useRef：仅用于函数组件，在组件生命周期内保持同一个 Ref 对象（类似类组件的 this），且不仅可存 DOM，还可存任意值（如定时器 ID）。

```javascript
function MyComponent() {
  const myRef = useRef(null); // 初始化值
  // 存定时器ID（非DOM用途）
  const timerRef = useRef(null);
  useEffect(() => {
    timerRef.current = setInterval(...);
    return () => clearInterval(timerRef.current);
  }, []);
  return <div ref={myRef} />;
}
```

-   回调 Ref：通过函数手动管理 Ref 赋值，更灵活（可在赋值时执行额外逻辑）。

```javascript
function MyComponent() {
    let domRef;
    const setRef = (el) => {
        domRef = el; // 手动存储DOM引用
        if (el) el.focus(); // 赋值时自动聚焦
    };
    return <input ref={setRef} />;
}
```

核心区别：useRef 在函数组件中保持引用不变，适合存储跨渲染周期的值；createRef 每次渲染重建，适合简单场景；回调 Ref 适合需要额外逻辑的场景。

##### 如何在函数组件中使用 Ref 访问子组件？

函数组件默认无实例，需通过 forwardRef 转发 Ref：

```javascript
// 子组件：用forwardRef转发Ref
const Child = forwardRef((props, ref) => {
    return <input ref={ref} />; // 将Ref绑定到内部DOM
});

// 父组件：使用Ref访问子组件的DOM
function Parent() {
    const childRef = useRef(null);
    const handleClick = () => {
        childRef.current.focus(); // 调用子组件input的focus方法
    };
    return (
        <>
            <Child ref={childRef} />
            <button onClick={handleClick}>聚焦输入框</button>
        </>
    );
}
```

##### 为什么要避免过度使用 Refs？

-   React 的核心思想是数据驱动 UI（通过 state 和 props 控制渲染），而 Refs 是 "命令式" 操作，破坏了声明式范式。
-   过度使用会导致逻辑分散（部分状态在 state，部分在 Ref），增加维护成本。
-   多数场景下，用 state+ 事件回调可替代 Refs（如表单可用 controlled component 而非 Ref 获取值）。

#### Fragment

##### 核心概念

Fragment 用于组合多个子元素，而不添加额外的 DOM 节点，解决 "组件必须返回单个根元素" 的限制。
语法：<React.Fragment>...</React.Fragment> 或简写 <>（空标签，不支持 key 属性）。

##### 常考面试题

###### Fragment 解决了什么问题？

避免多余 DOM 节点：React 要求组件返回单个根元素，若用 div 包裹多个子元素，会生成冗余 DOM，可能影响 CSS 布局（如 flex、grid 的层级问题）或不符合 HTML 语义（如 table 中 tr 必须直接放在 tbody 下）。

###### Fragment 与空标签<>的区别？

-   功能一致：均不生成额外 DOM。
-   区别：
    -   <>是 Fragment 的简写，不支持 key 属性。
    -   <React.Fragment>支持 key，可用于列表渲染（需为每个 Fragment 指定唯一 key）。

```javascript
// 列表渲染必须用带key的Fragment
function ListItems({ items }) {
    return (
        <>
            {items.map((item) => (
                <React.Fragment key={item.id}>
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                </React.Fragment>
            ))}
        </>
    );
}
```

###### Fragment 会影响事件冒泡吗？

不会。Fragment 本身不生成 DOM 节点，事件会直接冒泡到父组件的实际 DOM 节点，与无 Fragment 包裹的情况一致。
