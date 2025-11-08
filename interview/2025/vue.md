## 一、响应式原理（Vue 2 vs Vue 3）

**面试题：**Vue 的响应式原理是什么？Vue 2 和 Vue 3 的响应式实现有什么区别？

### 1. 核心目标

响应式系统是 Vue 数据驱动视图的基础：当数据（data）发生变化时，视图会自动更新，无需手动操作 DOM。

### 2. Vue 2 响应式实现（Object.defineProperty）

-   原理：通过 Object.defineProperty 对 data 中的属性进行拦截（劫持），在属性被访问时收集依赖，在属性被修改时触发更新。
-   核心流程：

1. 初始化劫持：new Vue() 时，通过 Observer 类遍历 data 中的所有属性，用 Object.defineProperty 重写 getter 和 setter。
2. 依赖收集：当组件渲染时，会读取 data 中的属性，触发 getter，此时将当前组件的 Watcher（观察者）添加到属性对应的 Dep（依赖管理器）中。
3. 触发更新：当属性被修改时，触发 setter，Dep 会通知所有收集到的 Watcher 执行更新（重新渲染组件）。

-   局限性：
    -   无法监听数组索引 / 长度变化（如 arr[0] = 1、arr.length = 0），需通过 \$set 或数组变异方法（push、pop 等）触发更新。
    -   无法监听对象新增 / 删除属性（如 obj.newKey = 1），需通过 \$set 或 Vue.set 手动触发。

举例：

假设组件模板中有 {{ username }}，data 中定义 username: 'zhangsan'，整个过程如下：

1. 组件初始化，创建 渲染 Watcher，执行 Watcher.get()，Dep.target = 渲染 Watcher；
2. 执行渲染函数，读取 this.username，触发 username 的 getter；
3. username 对应的 Dep 执行 depend()，将 渲染 Watcher 加入 Dep.subs；
4. 渲染 Watcher 将 username 的 Dep 加入自身 deps 数组；
5. 当 this.username = 'lisi' 时，触发 username 的 setter，Dep 执行 notify()，遍历 subs 中的渲染 Watcher，调用其 update() 方法；
6. 渲染 Watcher 重新执行渲染函数，将 DOM 中的 zhangsan 更新为 lisi。

### 3. Vue 3 响应式实现（Proxy）

-   原理：使用 ES6 的 Proxy 对数据对象进行代理，直接拦截对象的读取、修改、新增、删除等操作，解决了 Vue 2 的局限性。
-   核心流程：

1. 创建代理：通过 reactive 函数对数据对象创建 Proxy，代理对象会拦截 get（读取）、set（修改 / 新增）、deleteProperty（删除）等操作。
2. 依赖收集：读取属性时，Proxy 的 get 拦截器会收集当前 effect（副作用函数，类似 Vue 2 的 Watcher）到 targetMap（依赖映射表）中。
3. 触发更新：修改 / 新增 / 删除属性时，Proxy 的 set/deleteProperty 拦截器会从 targetMap 中找到对应的 effect 并执行（触发视图更新）。

-   优势：
    -   天然支持监听数组索引、长度变化和对象新增 / 删除属性。
    -   无需递归遍历对象所有属性（Proxy 直接代理整个对象），性能更优。

## 二、虚拟 DOM 与 Diff 算法

**面试题：**Vue 为什么要用虚拟 DOM？Diff 算法的核心逻辑是什么？

### 1. 虚拟 DOM（Virtual DOM）

-   **定义：**虚拟 DOM 是用 JavaScript 对象（如 { tag: 'div', props: {}, children: [] }）描述真实 DOM 的结构，是对真实 DOM 的抽象。
-   **为什么用虚拟 DOM：**
    -   减少 DOM 操作：真实 DOM 操作成本高（重绘 / 回流），虚拟 DOM 可先在 JS 层计算差异，再批量更新真实 DOM。
    -   跨平台兼容：虚拟 DOM 与平台无关，可渲染到 DOM、Canvas、SSR 等场景（如 Vue 3 的 render 函数可生成虚拟 DOM）。

### 2. Diff 算法（差异计算）

-   核心目标：对比新旧虚拟 DOM 树，找出最小差异并更新到真实 DOM，避免全量重绘。

#### Vue 2 Diff （双端比较法）

Vue2 的 diff 采用「双端比较」策略，对新旧虚拟 DOM（VNode）的所有节点进行全量比较，通过首尾指针向中间收缩的方式处理节点的增删改移。

```javascript
// Vue2 diff 核心逻辑伪代码
function patch(oldVNode, newVNode) {
    // 1. 若节点类型不同，直接替换整个节点
    if (oldVNode.type !== newVNode.type) {
        replace(oldVNode, newVNode);
        return;
    }

    // 2. 若为文本节点，直接更新文本
    if (oldVNode.isText) {
        updateText(oldVNode, newVNode.text);
        return;
    }

    // 3. 处理属性更新
    updateProps(oldVNode, newVNode);

    // 4. 双端比较子节点（核心）
    let oldStartIdx = 0;
    let oldEndIdx = oldVNode.children.length - 1;
    let newStartIdx = 0;
    let newEndIdx = newVNode.children.length - 1;

    let oldStartVNode = oldVNode.children[oldStartIdx];
    let oldEndVNode = oldVNode.children[oldEndIdx];
    let newStartVNode = newVNode.children[newStartIdx];
    let newEndVNode = newVNode.children[newEndIdx];

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        // 4.1 旧首与新首匹配：直接复用，指针后移
        if (isSameVNode(oldStartVNode, newStartVNode)) {
            patch(oldStartVNode, newStartVNode); // 递归比较子节点
            oldStartVNode = oldVNode.children[++oldStartIdx];
            newStartVNode = newVNode.children[++newStartIdx];
        }
        // 4.2 旧尾与新尾匹配：直接复用，指针前移
        else if (isSameVNode(oldEndVNode, newEndVNode)) {
            patch(oldEndVNode, newEndVNode);
            oldEndVNode = oldVNode.children[--oldEndIdx];
            newEndVNode = newVNode.children[--newEndIdx];
        }
        // 4.3 旧首与新尾匹配：复用并移动到旧尾后，指针调整
        else if (isSameVNode(oldStartVNode, newEndVNode)) {
            patch(oldStartVNode, newEndVNode);
            insertAfter(oldStartVNode.el, oldEndVNode.el); // 移动DOM
            oldStartVNode = oldVNode.children[++oldStartIdx];
            newEndVNode = newVNode.children[--newEndIdx];
        }
        // 4.4 旧尾与新首匹配：复用并移动到旧首前，指针调整
        else if (isSameVNode(oldEndVNode, newStartVNode)) {
            patch(oldEndVNode, newStartVNode);
            insertBefore(oldEndVNode.el, oldStartVNode.el); // 移动DOM
            oldEndVNode = oldVNode.children[--oldEndIdx];
            newStartVNode = newVNode.children[++newStartIdx];
        }
        // 4.5 都不匹配：用新节点key在旧节点中查找
        else {
            const keyToIdx = createKeyToOldIdx(oldVNode.children, oldStartIdx, oldEndIdx);
            const idxInOld = keyToIdx.get(newStartVNode.key);
            if (idxInOld === undefined) {
                // 旧节点中无此key，新增节点
                createEl(newStartVNode);
                insertBefore(newStartVNode.el, oldStartVNode.el);
            } else {
                // 找到匹配节点，复用并移动
                const vnodeToMove = oldVNode.children[idxInOld];
                patch(vnodeToMove, newStartVNode);
                oldVNode.children[idxInOld] = undefined; // 标记为已处理
                insertBefore(vnodeToMove.el, oldStartVNode.el);
            }
            newStartVNode = newVNode.children[++newStartIdx];
        }
    }

    // 5. 处理剩余节点（新增或删除）
    if (oldStartIdx <= oldEndIdx) {
        // 旧节点有剩余，删除
        removeVNodes(oldVNode.children, oldStartIdx, oldEndIdx);
    } else if (newStartIdx <= newEndIdx) {
        // 新节点有剩余，新增
        addVNodes(newVNode.children, newStartIdx, newEndIdx, oldStartVNode.el);
    }
}
```

**核心特点：**

-   全量比较所有子节点，无论节点是否有变化；
-   依赖「双端指针」处理节点移动，逻辑较复杂；
-   对静态节点（无变化的节点）也会进行比较，存在性能浪费。

#### Vue3 的 diff 算法（静态标记 + 最长递增子序列）还没看完

Vue3 对 diff 算法做了大幅优化，核心思路是：

**1. 静态标记（PatchFlags）：**编译时标记静态节点（如纯文本、无绑定的元素），Diff 时直接跳过，无需对比。
**2. 只比较有变化的节点：**仅处理含动态内容的节点（如绑定了 v-if、v-for、:class 等）；
**3. 最长递增子序列：**优化节点移动逻辑，减少 DOM 操作次数。

```javascript
// Vue3 diff 核心逻辑伪代码
function patchChildren(n1, n2, container) {
    const c1 = n1.children; // 旧子节点
    const c2 = n2.children; // 新子节点
    const { patchFlag, dynamicChildren } = n2;

    // 1. 若有动态节点标记，直接处理动态节点（核心优化）
    if (patchFlag & PatchFlags.DYNAMIC_CHILDREN) {
        patchDynamicChildren(c1, c2, dynamicChildren, container);
        return;
    }

    // 2. 无动态标记，降级为全量比较（与Vue2类似，但较少进入此分支）
    if (!c1 && !c2) return;
    if (!c1) {
        // 旧节点为空，全量新增
        mountChildren(c2, container);
    } else if (!c2) {
        // 新节点为空，全量删除
        unmountChildren(c1);
    } else {
        // 3. 非静态节点且有key，使用最长递增子序列优化移动
        patchKeyedChildren(c1, c2, container);
    }
}

// 处理带key的子节点（核心优化：最长递增子序列）
function patchKeyedChildren(c1, c2, container) {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1; // 旧节点尾索引
    let e2 = l2 - 1; // 新节点尾索引

    // 1. 先处理首尾相同的节点（快速跳过无需移动的节点）
    while (i <= e1 && i <= e2 && isSameVNode(c1[i], c2[i])) {
        patch(c1[i], c2[i]);
        i++;
    }
    while (i <= e1 && i <= e2 && isSameVNode(c1[e1], c2[e2])) {
        patch(c1[e1], c2[e2]);
        e1--;
        e2--;
    }

    // 2. 旧节点处理完，新增剩余新节点
    if (i > e1) {
        if (i <= e2) {
            const nextPos = e2 + 1;
            const anchor = nextPos < l2 ? c2[nextPos].el : null;
            while (i <= e2) {
                patch(null, c2[i], container, anchor);
                i++;
            }
        }
    }
    // 3. 新节点处理完，删除剩余旧节点
    else if (i > e2) {
        while (i <= e1) {
            unmount(c1[i]);
            i++;
        }
    }
    // 4. 核心：处理中间需要移动/新增/删除的节点
    else {
        // 构建新节点key到索引的映射
        const keyToNewIndexMap = new Map();
        for (let j = i; j <= e2; j++) {
            keyToNewIndexMap.set(c2[j].key, j);
        }

        // 收集需要处理的旧节点索引
        const toBePatched = e2 - i + 1;
        const newIndexToOldIndexMap = new Array(toBePatched).fill(0);

        // 标记已处理的旧节点，计算新节点在旧节点中的位置
        for (let j = i; j <= e1; j++) {
            const oldVNode = c1[j];
            const newIndex = keyToNewIndexMap.get(oldVNode.key);
            if (newIndex === undefined) {
                unmount(oldVNode); // 旧节点在新节点中不存在，删除
            } else {
                newIndexToOldIndexMap[newIndex - i] = j + 1; // +1避免0（0表示新增）
                patch(oldVNode, c2[newIndex]); // 复用并更新
            }
        }

        // 计算最长递增子序列（LIS），优化节点移动
        const increasingNewIndexSequence = getLIS(newIndexToOldIndexMap);
        let ptr = increasingNewIndexSequence.length - 1;

        // 从后往前处理新节点，确定移动/新增
        for (let j = toBePatched - 1; j >= 0; j--) {
            const newIndex = i + j;
            const newVNode = c2[newIndex];
            const anchor = newIndex + 1 < l2 ? c2[newIndex + 1].el : null;

            if (newIndexToOldIndexMap[j] === 0) {
                // 新增节点
                patch(null, newVNode, container, anchor);
            } else {
                // 移动节点：若不在LIS中则需要移动
                if (ptr < 0 || j !== increasingNewIndexSequence[ptr]) {
                    insert(newVNode.el, container, anchor);
                } else {
                    ptr--;
                }
            }
        }
    }
}
```

核心特点：

-   编译时标记静态节点（patchFlags），diff 时直接跳过，减少比较次数；
-   优先处理首尾相同的节点，快速排除无需移动的节点；
-   对需要移动的节点，通过「最长递增子序列」计算最少移动次数，大幅减少 DOM 操作；
-   只关注动态节点（如 v-for 列表、带动态绑定的节点），静态节点完全复用。

## 三、生命周期钩子

面试题：Vue 组件的生命周期有哪些？各阶段的作用是什么？父子组件生命周期执行顺序？

### 1. 核心生命周期（Vue 2）

| 阶段   | 钩子函数      | 作用                                             |
| ------ | ------------- | ------------------------------------------------ |
| 初始化 | beforeCreate  | 实例创建前，data、methods 未初始化               |
|        | created       | 实例创建完成，可访问 data、methods，但未挂载 DOM |
| 挂载   | beforeMount   | 挂载前，模板已编译但未渲染到 DOM                 |
|        | mounted       | 挂载完成，可访问 DOM 元素（如 \$el）             |
| 更新   | beforeUpdate  | 数据更新前，DOM 未更新                           |
|        | updated       | 数据更新完成，DOM 已同步                         |
| 销毁   | beforeDestroy | 实例销毁前，可清理定时器、事件监听等             |
|        | destroyed     | 实例销毁完成，所有监听、子组件均销毁             |

### 2. Vue 3 生命周期变化

Vue 3 保留了大部分生命周期，但通过 Composition API 提供了更灵活的钩子（需从 vue 导入）：

-   onBeforeMount、onMounted（对应 Vue 2 的 beforeMount、mounted）
-   onBeforeUpdate、onUpdated（对应更新阶段）
-   onBeforeUnmount、onUnmounted（对应销毁阶段，名称更直观）

### 3. 父子组件生命周期顺序

-   挂载时：父 beforeCreate → 父 created → 父 beforeMount → 子 beforeCreate → 子 created → 子 beforeMount → 子 mounted → 父 mounted
-   更新时：父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated
-   销毁时：父 beforeDestroy → 子 beforeDestroy → 子 destroyed → 父 destroyed
-

## 四、组件通信方式

面试题：Vue 中组件通信有哪些方式？各自的使用场景是什么？

### 1. 父子组件通信

-   props / \$emit：
    -   父 → 子：父组件通过 props 传递数据，子组件声明 props 接收（单向数据流，子组件不能直接修改 props）。
    -   子 → 父：子组件通过 this.\$emit('eventName', data) 触发事件，父组件通过 @eventName 监听。
-   $parent / $children：
    -   子组件通过 this.$parent 访问父组件实例，父组件通过 this.$children 访问子组件实例（不推荐，耦合度高）。
-   \$refs：
    -   父组件通过 ref 标识子组件（如 <Child ref="childRef" />），通过 this.\$refs.childRef 直接访问子组件实例（适合主动调用子组件方法）。

### 2. 跨层级组件通信

-   provide / inject：
    -   祖先组件通过 provide 提供数据（provide() { return { key: value } }），子孙组件通过 inject 注入数据（inject(['key'])）。
    -   场景：深层嵌套组件（如主题配置、权限信息），但不推荐用于频繁更新的数据（响应式需要额外处理）。
-   Vuex / Pinia：
    -   全局状态管理库，通过 store 集中管理数据，任何组件可通过 store.state 读取、store.commit/dispatch 修改（适合大型应用）。
    -   Vue 3 推荐用 Pinia（简化了 Vuex 的 API，支持 Composition API，无 Mutation 限制）。

### 3. 兄弟组件通信

-   事件总线（EventBus）：
    -   创建一个空 Vue 实例作为总线（const bus = new Vue()），组件 A 通过 bus.$emit 发送事件，组件 B 通过 bus.$on 监听事件（小型应用适用，大型应用易混乱）。

## 五、computed 与 watch

**面试题：**computed 和 watch 的区别？各自的使用场景？

### 1. computed（计算属性）

-   特性：
    -   缓存性：依赖的响应式数据不变时，多次访问会直接返回缓存结果，不重新计算。
    -   同步性：只能同步计算，不能包含异步逻辑。
    -   依赖追踪：自动追踪依赖的响应式数据，数据变化时自动更新。
-   场景：需要基于已有数据派生新数据（如格式化时间、计算列表筛选结果）。

### 2. watch（监听器）

-   特性：
    -   无缓存：每次监听的数据变化时，都会执行回调函数。
    -   支持异步：可在回调中执行异步操作（如接口请求）。
    -   细粒度控制：可通过 deep: true 监听对象深层变化，immediate: true 初始加载时立即执行。
-   场景：数据变化时需要执行副作用（如数据变化后请求接口、修改 DOM 等）。

## 六、v-if 与 v-show

面试题：v-if 和 v-show 的区别？如何选择？

-   v-if：
    -   原理：通过添加 / 移除 DOM 元素控制显示（条件为 false 时，元素从 DOM 中删除）。
    -   特点：初始渲染成本高（条件为 false 时不渲染），切换成本高（需增删 DOM）。
    -   场景：条件不常变化（如权限控制、一次性渲染）。
-   v-show：
    -   原理：通过 **CSS display: none** 控制显示（元素始终在 DOM 中，只是隐藏）。
    -   特点：初始渲染成本低（无论条件如何都渲染），切换成本低（仅修改样式）。
    -   场景：条件频繁变化（如标签页切换、开关按钮）。

## 七、Vue 路由（Vue Router）

面试题：Vue Router 实现 SPA 路由的原理？hash 模式和 history 模式的区别？

### 1. SPA 路由核心

单页应用（SPA）通过路由在同一个 HTML 页面中切换不同组件，无需重新加载页面，核心是监听 URL 变化并匹配对应组件。

### 2. 两种模式实现原理

-   hash 模式：

    -   URL 中带有 #（如 http://xxx.com/#/home），# 后的部分为 hash。
    -   原理：通过 window.onhashchange 事件监听 hash 变化，变化时匹配对应路由规则。
    -   优势：兼容性好（支持 IE8+），无需后端配置。

-   history 模式：
    -   URL 无 #（如 http://xxx.com/home），基于 HTML5 的 history API（pushState、replaceState）。
    -   原理：通过 history.pushState 修改 URL 且不触发页面刷新，监听 popstate 事件（前进 / 后退）匹配路由。
    -   注意：需要后端配合（所有路由请求都返回 index.html），否则刷新页面会报 404。

## 八、Vue 2 与 Vue 3 核心区别

| 维度       | Vue 2                       | Vue 3                       |
| ---------- | --------------------------- | --------------------------- |
| 响应式系统 | Object.defineProperty       | Proxy                       |
| 组合方式   | 选项式 API（data、methods） | 组合式 API（setup、ref 等） |
| 模板语法   | 无静态标记                  | 编译时静态标记（优化 Diff） |
| 生命周期   | 选项式钩子（mounted 等）    | 组合式钩子（onMounted 等）  |
| 性能       | 递归劫持属性，性能一般      | 懒代理，性能更优            |
