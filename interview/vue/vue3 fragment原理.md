## Fragment 的原理

Fragment（片段）是 Vue3 新增的一个特性，允许组件返回多个根元素而不是像 Vue2 那样必须有单一根节点。其原理可以分为“编译阶段”和“运行时处理”两个部分：

### 2. Fragment 的基本实现原理

**核心思想：用一个“虚拟片段标志”表示一组节点，但渲染时不会在真实 DOM 生成包裹元素。**

#### （1）虚拟 DOM 层

在模板编译成 VNode 过程中，如果检测到根节点为多个，Vue3 会自动用一个特殊的 `Fragment` 类型的 VNode 包裹它们：

```js
import { Fragment, h } from 'vue';

h(Fragment, null, [
    h('div'),
    h('span'),
    // ... 其他子节点
]);
```

Fragment 在虚拟 DOM 层就是“一个 type=Fragment，children=数组”的特殊 VNode。

#### （2）渲染/patch 过程

在渲染是真正挂载到 DOM 时，遇到 Fragment 节点，Vue3 会**遍历其 children 并渲染每个子节点**，本身不会生成额外的 DOM 元素。也就是说，Fragment 只做“包裹”而不投射到页面结构。

-   patch 过程遇到 type 为 Fragment 的 vnode，不会创建 `document.createElement('fragment')`，而是递归处理 children。
-   挂载、更新、卸载 Fragment 的时候，也都是直接操作它内部的子节点。

#### （3）diff 算法支持

由于 Fragment 可能嵌套、也可以和普通元素并列，Vue3 patch 算法在对比 vnode 时支持对子节点数组的高效比对（如双端 diff 和最长递增子序列算法），从而保证性能和一致性。

#### （4）特殊 DOM 标识

为了方便插入/删除片段，Vue3 内部会在 Fragment 的开头和结尾插入注释节点（比如 `<!--fragment start-->` 和 `<!--fragment end-->`，实现上通常是空注释），用于边界定位和 DOM 操作。

### 3. 小结

-   Fragment 本质是“虚拟容器”，不会渲染为真实 DOM 节点。
-   允许组件返回多根节点，消除无效包裹。
-   Vue3 在虚拟 DOM/patch/diff 层做了特殊处理，保证了多根节点的插入、更新与删除都正确高效。

**简单例子：**

```vue
<template>
    <div>header</div>
    <main>main</main>
    <footer>footer</footer>
</template>
```

编译后等效为：

```js
h(Fragment, null, [h('div', null, 'header'), h('main', null, 'main'), h('footer', null, 'footer')]);
```

渲染到页面时不会有多一层“包裹元素”，而是直接插入 dom。

---
