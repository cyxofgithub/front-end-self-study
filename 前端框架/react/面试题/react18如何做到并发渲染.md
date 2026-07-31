# React 18 如何做到可中断渲染？

## 一、先分清两种「中断」

React 的渲染会停下来，但有两种**完全不同的停法**：

| | 时间切片暂停 | 优先级抢占中断 |
|---|---|---|
| **触发原因** | 当前帧 JS 执行超过 5ms | 更高优先级的更新到达（如用户点击） |
| **workInProgress** | 保留不动 | 整棵树丢弃 |
| **恢复方式** | 从断点继续 | 丢弃后从头开始 |
| **类比** | 看书看累了合上书，下次翻开同一页继续 | 看到一半来了本更重要的书，把当前这本扔了，先看重要的，回头再重新看这本 |

下面分开讲。

---

## 二、时间切片：暂停后从断点继续

这是 `workInProgress` 的经典用法——**它就是断点指针**。

### 怎么停？时间到了就停

```javascript
function workLoop(startTime) {
    // workInProgress 是当前正在处理的 Fiber 节点
    while (workInProgress && !shouldYieldToHost(startTime)) {
        workInProgress = performUnitOfWork(workInProgress);
    }
    // 时间到了 → 退出循环
    return workInProgress !== null; // true = 还有工作没做完
}

function shouldYieldToHost(startTime) {
    return performance.now() - startTime >= 5; // 超过 5ms 就让出
}
```

**停的时候发生了什么？**
- `workInProgress` 指向当时正在处理的那个 Fiber 节点
- 这个变量的值没有被清空，也不会被修改
- 调度器记录「还有工作没做完」，下帧接着来

### 怎么恢复？workInProgress 还在，直接续上

```javascript
function performWorkUntilDeadline() {
    requestAnimationFrame((rafTime) => {
        frameStartTime = rafTime;
        const hasMoreWork = workLoop(frameStartTime); // ← 又来一遍 workLoop

        if (hasMoreWork) {
            port.postMessage(null); // 还没完？下帧继续
        }
    });
}
```

**恢复的本质：** `workInProgress` 值没变，下一帧 `performUnitOfWork(workInProgress)` 直接从上次停下的节点继续深度优先遍历。Fiber 是链表结构（`child → sibling → return`），只要记住当前节点指针，随时能续上。

```
上一帧结束时：                    下一帧开始时：
workInProgress → Fiber(D)        workInProgress → Fiber(D)  ← 还是同一个节点！
                  │                                │
             处理到一半                        从 D.sibling 继续
```

---

## 三、优先级抢占：丢弃后从头开始

这是**真正的「中断」**——高优先级更新来了，正在做的低优先级工作就不要了，全部扔掉重来。

### 为什么必须丢弃而不是续上？

因为高优先级更新会**改变状态**。比如你在渲染一个 Transition 更新的搜索结果，用户突然点了一个按钮触发 `setState`（SyncLane）。这个 `setState` 会改变 Fiber 树上的 `memoizedState`、`props`，整个组件树的状态都变了。旧的 `workInProgress` 上存的是旧状态，续上也没意义了。

### 怎么停？三步扔掉

```javascript
function scheduleUpdateOnFiber(fiber, lane) {
    pendingLanes = mergeLanes(pendingLanes, lane);

    if (workInProgressRoot !== null) {
        if (isHigherPriorityLane(lane, workInProgressRootRenderLanes)) {
            // ① 取消调度器里排着的后续工作
            cancelCallback(currentScheduledTask);

            // ② 丢弃当前的 workInProgress 树（整个不要了）
            prepareFreshStack(root, lane);
            //    ↑ 内部：清空 workInProgress，创建新的 workInProgress 树

            // ③ 立刻以最高优先级调度新的渲染
            scheduleSyncWork(root, performUnitOfWork);
            //    ↑ ImmediatePriority(-1ms 超时)，调度器当过期任务处理
            //    ↑ 过期任务 = 同步执行，不经过时间切片，不会再次被中断
        }
    }
}
```

**三步下来，旧的 workInProgress 树被彻底丢弃。** `scheduleSyncWork` 会让调度器立即执行高优先级渲染，且因为该任务已「过期」（超时 -1ms），会以同步方式一口气跑完，不会再次被打断。

### 怎么恢复？重新调度，从头开始

高优先级渲染 commit 之后：

```javascript
// completeWork 在根节点时触发：
function completeWork(fiber) {
    if (!fiber.return) {
        // 到达根节点 → 提交
        commitRoot(workInProgressRoot, deletions);

        // 把已经完成的 SyncLane 从待处理列表里移除
        pendingLanes = removeLane(pendingLanes, SyncLane);

        // pendingLanes 里还剩 TransitionLane → 重新调度
        if (pendingLanes !== 0) {
            ensureRootIsScheduled(workInProgressRoot);
        }
    }
}

function ensureRootIsScheduled(root) {
    const nextLane = getHighestPriorityLane(pendingLanes);
    // 以 NormalPriority 重新调度低优先级任务
    scheduleCallback(NormalPriority, () => {
        prepareFreshStack(root, nextLane); // 创建全新的 workInProgress 树
        return performConcurrentWorkOnRoot(root); // 从头 beginWork
    });
}
```

**恢复的不是「做到哪了」，而是「要做什么」。** 组件函数重新执行，`beginWork` / `completeWork` 从头来过。但因为 Fiber 树上 `alternate` 保留了上次渲染的 DOM 节点，Diff 时类型相同的节点直接复用 DOM，所以并**不慢**。

---

## 四、两张图对比

```
时间切片暂停与恢复：
═══════════════════════════════════════════════════
帧 1                           帧 2
│                              │
├─ workLoop ─┤ 5ms到了          ├─ workLoop ─┤
│ workInProgress 逐步推进       │ workInProgress 接着跑
│ FiberA → FiberB → FiberC     │ FiberC.sibling → FiberD → ...
│               ↑ 停下          │   ↑ 直接从这续上
│                              │
═══════════════════════════════════════════════════
  workInProgress 全程指向同一个 Fiber 树，只是指针位置在变


优先级抢占中断与恢复：
═══════════════════════════════════════════════════
渲染 Transition 更新            用户点击 → SyncLane
│                              │
├─ beginWork(App) ─┤           ├─ cancelCallback()  ← 取消旧任务
│                  │           ├─ prepareFreshStack() ← 丢弃 workInProgress 树
│   处理到一半...   │           ├─ scheduleSyncWork() ← 新树，立即同步执行
│                  │           ├─ beginWork(App) → ... → commit ✅
│                  │           │
│                  │           ├─ ensureRootIsScheduled() ← 重新调度 Transition
│                  │           ├─ prepareFreshStack() ← 再建一棵新树
│                  │           ├─ beginWork(App) → ... → commit ✅
│                  │           │   (这次从头跑，但复用 alternate 上的 DOM)
════════════════════════════════════════════════════
  旧的 workInProgress 树被丢弃     新的 workInProgress 树从头构建
```

---

## 五、重新渲染时怎么知道哪些组件要更新？（childLanes 跳过机制）

上一节说中断后恢复是「从头 beginWork」，那是不是整棵树每个组件都要重新执行一遍？**不是。** 大部分组件会被跳过，靠两个字段：

| 字段 | 含义 | 什么时候设置 |
|------|------|------------|
| `fiber.lanes` | **这个 Fiber 自身**有没有待处理的更新 | `setState` 时标记 |
| `fiber.childLanes` | **这棵子树**里有没有待处理的更新 | `setState` 时沿 `return` 链冒泡 |

### 5.1 setState 时：标记 lanes 并冒泡 childLanes

```javascript
function scheduleUpdateOnFiber(fiber, lane) {
    // ① 标记这个 fiber 自己要更新
    fiber.lanes |= lane;

    // ② 沿 return 链冒泡，告诉每个祖先"你子树里有活"
    let node = fiber.return;
    while (node !== null) {
        node.childLanes |= lane;
        node = node.return;
    }

    // ...然后走调度流程
}
```

**举例：** 只有 `ResultList` 组件触发了 TransitionLane 更新：

```
setState 调用后，冒泡标记：
                    Root (childLanes |= TransitionLane)
                     │
            ┌────────┴────────┐
            ▼                 ▼
          Header             App (childLanes |= TransitionLane)
      (childLanes: 0)        │
        没被标记！     ┌──────┴──────┐
                       ▼              ▼
                    Sidebar         List (childLanes |= TransitionLane)
                 (childLanes: 0)    │
                   没被标记！   ┌───┴───┐
                                ▼       ▼
                             Item1   ResultList
                                   (lanes |= TransitionLane)
                                    ↑ 这里触发了 setState
```

### 5.2 beginWork 时：检查 childLanes，整棵子树跳过

重新渲染时 `beginWork` 的第一件事：

```javascript
function beginWork(current, workInProgress, renderLanes) {
    // ⚠️ 检查子树有没有当前 lane 的更新
    if ((current.childLanes & renderLanes) === 0) {
        // 没有 → 整棵子树跳过，不执行组件函数
        return null;
    }

    // 否则按节点类型处理...
}
```

**在上面的例子里：** `Header.childLanes` 是 0 → 整棵 Header 子树跳过，组件函数根本不执行。

### 5.3 到达了但自身不需要更新：bailout

即使因为父节点的 `childLanes` 有标记而到达了某个组件，它还有一次自救：

```javascript
function updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes) {
    // 检查：自己有没有待处理的 lane？
    const hasOwnUpdate = (workInProgress.lanes & renderLanes) !== NoLanes;

    if (!hasOwnUpdate && oldProps === newProps) {
        // ⚠️ 组件自身没有更新、props 也没变 → bailout 跳过！
        return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    }

    // 需要更新：执行组件函数
    let children = Component(nextProps);
    reconcileChildren(current, workInProgress, children, renderLanes);
    return workInProgress.child;
}
```

### 5.4 完整遍历过程（结合例子）

```
中断后恢复，重新 beginWork(Root)，renderLanes = TransitionLane：

beginWork(Root)
  root.childLanes & TransitionLane ≠ 0？→ 有，继续
  
  beginWork(App)
    App.childLanes & TransitionLane ≠ 0？→ 有，继续
    
    beginWork(Header)
      Header.childLanes & TransitionLane ≠ 0？→ 没有！→ 整棵跳过 ✅
      （组件函数不执行，beginWork 直接返回 null）

    beginWork(Sidebar)  
      Sidebar.childLanes & TransitionLane ≠ 0？→ 没有！→ 整棵跳过 ✅

    beginWork(List)
      List.childLanes & TransitionLane ≠ 0？→ 有，继续
      
      beginWork(Item1)
        到达了但 Item1.lanes & TransitionLane = 0、props 没变 → bailout ✅

      beginWork(ResultList)
        ResultList.lanes & TransitionLane ≠ 0 → 需要更新！
        执行组件函数 → 计算新状态 → reconcileChildren ✅
```

**整棵树遍历了一遍，但真正执行组件函数的只有 `ResultList` 一个组件。** 其他组件要么被 `childLanes` 整棵跳过，要么被 bailout。开销接近 O(深度) 而不是 O(节点数)。

---

## 六、总结

| | 时间切片 | 优先级抢占 |
|---|---|---|
| **触发** | 5ms 时间片用完 | 更高优先级更新到达 |
| **怎么停** | `shouldYieldToHost` → `workLoop` 退出，`workInProgress` 不动 | `cancelCallback` + `prepareFreshStack` 丢弃整棵树 |
| **怎么恢复** | 下帧 `workLoop` 续上，`workInProgress` 还是那个节点 | 高优完事后 `ensureRootIsScheduled` → 从头 `beginWork` |
| **workInProgress** | **保留**，它是断点 | **丢弃**，建新的 |
| **恢复速度** | 无缝续上 | 重新遍历，靠 `childLanes` 跳过无关子树，靠 bailout 跳过无关叶子 |

核心记住三个东西：

- **`workInProgress`** 变量指向当前 Fiber 节点 → 时间切片靠它从断点续上
- **`pendingLanes`** 位掩码记录还有什么优先级要做 → 抢占中断后靠它知道要重新调度什么
- **`childLanes`** 在 setState 时就冒泡标记好了 → 重新渲染时大部分子树直接跳过，不会真正执行
