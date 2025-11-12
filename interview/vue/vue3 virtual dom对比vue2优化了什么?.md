Vue3 相比 Vue2 在 Virtual DOM 方面做了非常多的“性能优化”和“原理层面的改进”，其核心可以概括为：

## 1. Diff 算法的升级与优化

### Vue2 的 diff 核心特点

-   使用“双端对比”+“同层比较”，只对同级节点进行 patch。
-   采用简单的递归深度优先遍历，借助 key，但静态节点与动态节点没有本质区分。
-   Patch 过程会频繁进行 `VNode` 的创建和销毁，静态子树仍然每次都参与 patch。
-   没有特别针对大型列表、静态片段等场景优化。

### Vue3 的升级与主要优化点

#### a) 静态提升（Static Hoisting）

-   编译阶段分析哪些 DOM 结构是静态的，直接提升到渲染函数外。
-   静态节点只生成一次，patch 时**不会反复创建/比较**，只会复用，大大减少 vnode 的生成和 patch 过程。

#### b) Patch Flag 革新

-   编译时为每个 vnode 节点**打上类型标记(flag)**，如：只包含文本变化、只包含 class 变化、children 是动态列表等。
-   更新时**只检查有动态内容的部分**，省略静态部分的 diff，提高效率。

#### c) 基于 Longest Increasing Subsequence (LIS) 的子节点 Diff 算法优化

-   Vue3 在处理子节点移动时，借鉴 React、Inferno 的思想，利用“最长递增子序列”算法，尽量复用 DOM，最小化节点移动操作。
-   列表 patch 时复杂度从 O(n^3) 降为 O(n)，对于中大型长列表特别高效。

#### d) Fragment、多根节点原生支持

-   Vue3 Virtual DOM 原生支持 Fragment，无需强制单根节点，使 patch 更抽象、灵活，省略了大量冗余 div、span。

#### e) 更小体积 + 更快内存分配

-   虚拟节点结构更加精简，不再需要实例化“组件 vnode 对象树+slot vnode 数组”等复杂结构。
-   代码经过 tree shaking 后，未用到的特性不会被打包。

---

## 2. 源码结构与维护便利性

-   Vue3 的 Virtual DOM 独立于 runtime、响应式系统，更易维护和扩展。
-   **类型友好**，全面 TypeScript 重写，提高了类型安全和 IDE 智能提示体验。

---

## 3. 实际性能提升

-   “热区”渲染（即大量静态 DOM + 少量动态内容）场景，Vue3 的 patch 性能大幅优于 Vue2。
-   内存、首次渲染、重复渲染速度都有明显提升。
-   源码体积更小、更易被 Tree Shaking 优化。

---

## 总结对比

|            | Vue2 Virtual DOM   | Vue3 Virtual DOM         |
| ---------- | ------------------ | ------------------------ |
| Diff 算法  | 普通递归，同层对比 | 静态提升、PatchFlag、LIS |
| 静态分析   | 无                 | 有，节省大量 patch       |
| Patch 效率 | 一律递归 patch     | 只动动态部分/差异部分    |
| Fragment   | 不支持             | 支持多根节点灵活返回     |
| 内存效率   | vnode 性能较一般   | vnode 结构更轻巧         |
| TypeScript | 支持较差           | 全面 TS 重写             |

最长递增子序列优化说明：参考[diff 算法性能的提升](../面经总结.md)
