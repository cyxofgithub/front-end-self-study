## 1. 总览

| | React | Vue 3 |
|---|---|---|
| 算法 | 单指针 + `lastPlacedIndex` | 双端对比 + LIS（最长递增子序列） |
| 遍历方式 | 只从左到右一遍 | 先头头、尾尾，再处理中间 |
| 移动策略 | 贪心：`oldIndex < lastPlacedIndex` 就右移 | 最优：LIS 算不动节点，其余移动 |
| 移动次数 | 非最优（可能多移） | 理论最小值 |
| 复杂度 | O(n) | O(n log n)（LIS 的二分查找） |
| 调度 | Fiber（可中断） | 微任务队列（不可中断，但粒度小） |

---

## 2. React diff

### 核心变量

```
keyToOldIndexMap = { key -> oldIndex }    // 为旧列表建 key 映射
lastPlacedIndex  = -1                       // 上一个"位置正确"节点的 oldIndex
lastPlacedNode   = null                     // 上一个已就位的 DOM 节点
```

### 过程

> 只从左到右遍历 newList 一遍。对每个 newChild：
> 1. **查 oldIndex**（在旧列表中的位置）
> 2. **new 节点**（`oldIndex === undefined`）→ 挂载，插入到 `lastPlacedNode.nextSibling` 前
> 3. **old 节点存在** → 先 `patch(oldChild, newChild)` 复用 DOM + 递归更新内容
>    - **`oldIndex < lastPlacedIndex`** → 位置不对，移动 DOM 到 `lastPlacedNode.nextSibling` 前
>    - **`oldIndex >= lastPlacedIndex`** → 顺序正确，不动，更新 `lastPlacedIndex = oldIndex`
> 4. 更新 `lastPlacedNode = newChild.el`

### 示例

```
old  [A#0, B#1, C#2, D#3]
new  [A#0, C#2, B#1, D#3]
```

| i | newChild | oldIndex | lastPlacedIndex | 操作 |
|---|----------|----------|-----------------|------|
| 0 | A | 0 | -1 → 0 | patch，不动 |
| 1 | C | 2 | 0 → 2 | patch，不动 |
| 2 | B | 1 | 2 | patch，**1 < 2，移动**到 C 之后 |
| 3 | D | 3 | 2 → 3 | patch，不动 |

结果：B 被移动到 C 和 D 之间，最终 DOM 顺序 A → C → B → D。

> `lastPlacedIndex` 本质是在找**隐式递增序列**：A(0) → C(2) → D(3) 递增，B(1) 打断了序列所以需要移动。但它是贪心的，不是全局最优。

---

## 3. Vue 3 diff（双端对比 + LIS）

### 五步算法

```
          old [a, b, c, d, e, f]
          new [a, c, d, b, g, f]
指针:      i→                ←e1
                        ←e2

步骤 1: sync from start  → a 相同，i++
步骤 2: sync from end    → f 相同，e1--, e2--
步骤 3: i > e1 ? 旧列表耗尽 → 挂载剩余新节点
步骤 4: i > e2 ? 新列表耗尽 → 删除剩余旧节点
步骤 5: 中间乱序         → key 映射 + LIS 最小移动
```

### 步骤 5 详解

> 中间剩余 old `[b, c, d, e]`，new `[c, d, b, g]`

**5a — 建 key 映射：** `keyToNewIndexMap = { c#2 -> 0, d#3 -> 1, b#1 -> 2, g#5 -> 3 }`

**5b — 遍历旧节点找匹配：**

| oldChild | key | newIndex | 操作 |
|----------|-----|----------|------|
| b#1 | 1 | 2 | patch(old, new[2])，记录 map[2]=oldIdx(b) |
| c#2 | 2 | 0 | patch(old, new[0])，记录 map[0]=oldIdx(c) |
| d#3 | 3 | 1 | patch(old, new[1])，记录 map[1]=oldIdx(d) |
| e#4 | 4 | undefined | map 里没有 → remove |

`newIndexToOldIndexMap = [c的oldIdx, d的oldIdx, b的oldIdx] = [1, 2, 0]`

**5c — LIS + 从右向左移动/挂载：**

`getSequence([1, 2, 0])` → 递增子序列为 `[1, 2]`，对应 `newIndexToOldIndexMap` 的索引 `[0, 1]`（即 c 和 d 不需要移动）。

从右向左遍历 new 中间区域：

| j | newChild | map[j] | 在 LIS 中？ | 操作 |
|---|----------|--------|------------|------|
| 3 | g#5 | -1 | — | 新节点，mount + insertBefore |
| 2 | b#1 | 0 | **否** | 移动 DOM 到 anchor 前 |
| 1 | d#3 | 2 | **是** | 不动，`lastSeqIdx--` |
| 0 | c#2 | 1 | **是** | 不动，`lastSeqIdx--` |

最终 DOM 顺序：a → c → d → b → g → f。

> 从右向左遍历 + insertBefore 保证 anchor（下一个兄弟节点）已经就位，插入位置始终正确。

---

## 4. 核心区别

### 4.1 双端同步 vs 单端扫描

Vue 先头头、尾尾同步能快速跳过不变的头尾。React 只从左到右，但如果头部插入一个节点，React 的第一个新节点 oldIndex 就是 undefined（新节点），后面所有节点 oldIndex 都比 lastPlacedIndex 小，每个都要移动——极端情况下 React 会把整个列表重排一遍，而 Vue 选择直接挂载新头部。

### 4.2 LIS 最小移动 vs lastPlacedIndex 贪心

```
old [A#0, B#1, C#2, D#3, E#4]
new [B#1, D#3, A#0, E#4, C#2]
```

| | 移动次数 |
|---|---|
| React | 可能需要 3-4 次（贪心，部分节点可能被多次右移） |
| Vue 3 | 2 次（LIS 找到最长递增序列，其余两个移动） |

### 4.3 可中断 vs 不可中断

| | React | Vue |
|---|---|---|
| 调度 | Fiber 架构，diff 可被高优先级任务中断 | 微任务批量，单次 diff 不可中断 |
| 原因 | 并发模式下渲染可能被打断 | 依赖收集粒度细，diff 本身足够快 |
| 代价 | Fiber 节点 + lanes 优先级维护 | 细粒度依赖追踪的运行时开销 |

### 4.4 编译优化

| | React | Vue |
|---|---|---|
| 编译 | JSX → `React.createElement`，运行时处理 | Template → render 函数 + patchFlags |
| 优化 | React Compiler（自动 memo） | 编译时静态提升、动态标记 |
| diff | 全量 diff | 跳过静态节点、按 flag 定向 patch |

---

## 5. Vue 2 → Vue 3 diff 演进

| | Vue 2 | Vue 3 |
|---|---|---|
| 算法 | 双端对比（四向：头头/尾尾/头尾/尾头） | 双端对比 + LIS |
| 中间乱序 | 逐个在旧列表中查找，移动 | 建 Map + LIS 最小移动 |
| 静态节点 | diff 中不做区分 | 编译时标记，diff 直接跳过 |
| 动态绑定 | 全量 patchProps | patchFlags：按需检查 class/style/text 等 |

---

## 6. 一句话总结

- **React**：单指针一遍扫，`lastPlacedIndex` 贪心右移，简单但有冗余移动。
- **Vue 3**：双端快速收敛 + LIS 最优移动，编译时静态标记配合运行时跳过，diff 粒度更细。

---

## 7. 各自优劣

### React diff

| 优势 | 劣势 |
|------|------|
| 算法简单，单指针一 pass 到底，代码量少、好理解 | 移动次数非最优，极端重排场景 DOM 操作偏多 |
| O(n) 时间复杂度，比 Vue 3 少一个 log n 因子 | 头部插入会导致整个列表重排（后续每个节点 `oldIndex < lastPlacedIndex`） |
| Fiber 可中断，不阻塞用户输入（并发模式） | 无编译优化加持，每次运行时全量 diff |
| JSX 灵活，不依赖模板编译也能正常工作 | `lastPlacedIndex` 贪心，某些排列下移动次数远超理论最小值 |

### Vue 3 diff

| 优势 | 劣势 |
|------|------|
| LIS 保证移动次数理论最优 | 算法复杂（双端 + 二分 + LIS 回溯），理解门槛高 |
| 双端对比快速收敛，不变的头尾直接跳过 | O(n log n) 比 React 的 O(n) 多一个 log n 因子 |
| 编译时 patchFlags + 静态提升，跳过不必要 diff | 不可中断，巨型 vnode 树可能产生长任务 |
| 模板编译可做更多 AOT 优化（静态节点甚至不生成 vnode） | 依赖模板编译才能发挥完整优势，JSX/render 函数场景拿不到 patchFlags |
| 细粒度响应式依赖追踪，精确知道哪个组件该更新 | 每次 diff 分配 Map + 数组 + LIS 结果数组，小列表场景有额外内存开销 |

### 选择视角

| 场景 | 更适合 |
|------|--------|
| 大量列表重排（拖拽排序、表格列排序） | Vue 3（LIS 移动最少） |
| 复杂交互不卡顿（富文本、动画密集页） | React（Fiber 可中断） |
| 列表以增删为主、很少重排（feed 流、聊天） | 两者差异不大 |
| 团队新手多、需要代码好理解 | React（diff 实现更直观） |
| SSR / 静态内容为主（博客、文档站） | Vue 3（编译器可大幅削减客户端 diff 量）
