Vue2 和 Vue3 的核心区别，可以从以下几个主要方面理解：

### 1. 响应式原理

-   **Vue2**：采用 Object.defineProperty 对数据对象属性进行劫持，只能劫持已存在的属性，数组采用重写原型方法的方式，对新增属性和删除属性需通过 `Vue.set` / `Vue.delete`。
-   **Vue3**：采用 Proxy 全面代理对象，能直接监听对象的新增、删除、嵌套属性和数组索引修改，响应式能力更强，代码更简单。

### 2. 性能优化

// todo:学习是如何优化的

-   **Vue3** 更快更省内存：初始化快，内存占用小，diff 算法和编译优化；Tree-shaking 支持按需引入，减小包体积。
-   **虚拟 DOM**：Vue3 重写 virtual dom，更高效。
-   **静态提升**：模板编译期间能静态标记节点，减少渲染时的比较压力。

### 3. 组合式 API (Composition API)

-   **Vue2**：只有 Options API，即通过 data, methods, computed, lifecycle 等分块写法，复杂组件容易产生“跨逻辑分散、难复用”问题。
-   **Vue3**：新增 Composition API（`setup`、ref、reactive、watch、computed 等），可将相关逻辑高内聚组织，方便代码复用和类型推导，更适合 TypeScript 支持。

### 4. TypeScript 支持

-   **Vue2**：TS 支持较弱，类型推导/补全不够完善，需要第三方工具增强。
-   **Vue3**：从架构层面原生支持 TypeScript，类型推导和开发体验大幅提升。

### 5. 生命周期命名及变化

-   destroy、destroyed 在 Vue3 中分别被更名为 beforeUnmount、unmounted，其余大致一致。
-   Composition API 采用 `onXXX` 形式（如 onMounted, onUnmounted）。

### 6. Fragment / Teleport / Suspense

-   **Fragment**：Vue2 组件根节点必须唯一，Vue3 可返回多个根节点（Fragment）。
-   **Teleport**：支持内容传送到任意 DOM 节点，常用于弹窗等。
-   **Suspense**：支持异步组件等场景的优雅 Loading/等待。

### 7. 其它差异

-   **自定义指令 & 插件 API**：Vue3 有较多优化和变化。
-   **移除/更改 API**：如 `$on/$off/$once` 移除，事件总线需手动实现；`filters` 过滤器被移除。

---

**总结表**：

| 维度             | Vue2                       | Vue3                      |
| :--------------- | :------------------------- | :------------------------ |
| 响应式原理       | Object.defineProperty      | Proxy                     |
| 响应式缺陷       | 新增/删除属性无响应        | 完全响应式                |
| 性能             | 普通                       | 更快更优                  |
| API 组织方式     | Options API                | Options + Composition API |
| 生命周期部分钩子 | beforeDestroy/destroyed    | beforeUnmount/unmounted   |
| TypeScript 支持  | 基本（有 Typex/vue-class） | 原生高适配                |
| 多根节点         | 不支持                     | Fragment 支持             |
| 新特性           | 无                         | Teleport、Suspense 等     |
| 体积             | 相对偏大                   | 可 tree-shaking，更小     |
