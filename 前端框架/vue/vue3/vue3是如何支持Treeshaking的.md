要理解 Vue3 支持 Tree Shaking 而 Vue2 不支持，核心在于**两者的模块设计、API 导出方式和代码结构存在本质差异**——而 Tree Shaking 的生效依赖于**ES 模块（ESM）的静态分析能力**（即编译时可确定“哪些代码未被使用”）。

### 关键差异：Vue2 为何不支持 Tree Shaking？

Vue2 的设计架构从根源上不满足 Tree Shaking 的前提，核心问题有三点：

#### 1. 模块格式：依赖 CommonJS/UMD，而非 ESM

Vue2 的主要发布格式是 **CommonJS（CJS）** 和 **UMD**（兼容浏览器全局变量和 CJS），而非 ESM：

-   CJS 格式：`require('vue')`会加载整个 Vue 模块，得到一个完整的`Vue`构造函数对象，工具无法拆分这个对象内部的属性/方法。
-   UMD 格式：本质是“兼容 CJS 和全局变量”的包装器，同样会将所有 API 打包成一个全局`Vue`对象（如`window.Vue`），无法静态分析。

例如，Vue2 中你即使只用到`new Vue({ el: '#app' })`，打包后依然会包含`Vue.component`、`Vue.directive`、`Vue.mixin`等未使用的 API——因为它们都挂载在`Vue`构造函数上，是“不可拆分的整体”。

#### 2. API 导出：全局构造函数挂载，而非按需导出

Vue2 的核心是**全局构造函数`Vue`**，所有 API 都通过两种方式集成：

-   实例 API：挂载在`Vue.prototype`上（如`this.$watch`、`this.$emit`），只要创建 Vue 实例，这些 API 就会被包含。
-   静态 API：挂载在`Vue`构造函数上（如`Vue.component`、`Vue.use`、`Vue.filter`），即使未使用，也会随`Vue`对象一起打包。

这种“集成式”API 设计，导致工具无法判断“某一个 API 是否被使用”——因为它们都是`Vue`对象的一部分，要么全要，要么全不要。

#### 3. 代码结构：高耦合，无法模块拆分

Vue2 的内部代码耦合度较高，例如“响应式系统”“实例系统”“编译系统”是紧密绑定的，无法单独拆分。即使你只需要响应式能力，也必须加载整个 Vue 核心库，自然无法通过 Tree Shaking 剔除冗余模块。

### Vue3：如何针对性设计以支持 Tree Shaking？

Vue3 从底层重构了模块架构，完全满足 Tree Shaking 的前提，核心优化有三点：

#### 1. 模块格式：默认采用 ES 模块（ESM）

Vue3 的官方发布包优先提供**ESM 格式**（同时兼容 CJS/UMD 用于旧项目），直接支持`import`/`export`静态语法。构建工具（如 Webpack 5、Rollup）可直接对 ESM 进行静态分析，确定哪些代码未被引用。

#### 2. API 导出：按需拆分，独立导出

Vue3 彻底抛弃了“全局构造函数`Vue`”的设计，改为**API 独立导出**——每个核心功能（如创建应用、响应式、计算属性）都是单独的导出项，而非挂载在某个大对象上。

例如：

```javascript
// Vue3：只导入需要的API
import { createApp, ref, computed } from 'vue';

// 未导入的API（如watch、reactive）会被Tree Shaking剔除
```

这种设计下，工具可清晰判断：“如果代码中没导入`watch`，则`watch`相关的代码无需打包”。

#### 3. 内部结构：模块化解耦，功能拆分

Vue3 将内部核心拆分为多个独立模块（如`@vue/runtime-core`、`@vue/reactivity`、`@vue/compiler-core`），模块间解耦：

-   响应式模块（`@vue/reactivity`）可独立使用（甚至在非 Vue 项目中）；
-   运行时模块（`@vue/runtime-dom`）负责 DOM 渲染，与编译器模块（`@vue/compiler-sfc`）分离；
-   内置组件（如`KeepAlive`、`Transition`）也改为按需导入（需显式`import { KeepAlive } from 'vue'`）。

这种“模块化解耦”让未使用的模块（如编译器、某内置组件）可被轻松摇掉。

### 总结

Vue3 支持 Tree Shaking 的本质，是**从“全局集成式架构”转向“ESM 模块化架构”**：

-   Vue2：基于 CJS/UMD，API 挂载在全局`Vue`对象上，无法静态拆分 → 不支持 Tree Shaking；
-   Vue3：基于 ESM，API 独立导出、内部模块解耦，可被工具静态分析 → 支持 Tree Shaking。

这一设计不仅减少了打包体积，也让 Vue3 的功能更灵活（如单独使用响应式模块），是 Vue3 性能优化的重要基础。
