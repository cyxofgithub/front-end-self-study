## webpack、vite

### 基础题

-   webpack 的核心概念有哪些？（入口、出口、loader、plugin、chunk、bundle、模式）请分别解释。
-   loader 和 plugin 的核心区别是什么？各自的作用场景是什么？
-   **vite 和 webpack 的核心差异是什么？（构建原理、启动速度、热更新、适用场景）**

| 特性       | Vite          | Webpack        |
| ---------- | ------------- | -------------- |
| 开发模式   | ESM + esbuild | Bundle + babel |
| 启动速度   | 快（秒级）    | 慢（分钟级）   |
| 热更新     | 快            | 相对慢         |
| 构建工具   | Rollup        | 自身           |
| 配置复杂度 | 简单          | 复杂           |
| 生态成熟度 | 新兴          | 成熟           |

vite 原理： 开发 esbuild 预构建依赖，直接启动服务器，对请求的 esm 资源实时编译（基于浏览器<script type="module">）的支持

webpack 原理:

我们从入口讲起

-   在配置 webpack 的时候我们配置 entry、output、plugin、module/rules
-   执行 webpack 后会先根据配置找到入口文件读取文件内容 利用 babel 转换成 ast 识别依赖
-   如果依赖是 module rules 的文件会根据对应的 loader 转换然后继续重复这个读取 -> ast -> 识别依赖这个过程构建出依赖图
-   依赖图构建完成后会根据依赖关系输出 chunk （中间涉及到模块转换，比如 es import 语句转换成 webpack 可识别的模块语句**webpack_require**）(chunk)
-   n 个入口就有 n 个 chunk 如果有配置 split chunk 会有更多

-   如何开发一个简单的 webpack loader？（比如实现一个替换代码中特定字符串的 loader）

### 进阶原理题

1. webpack 的完整构建流程是怎样的？（初始化参数 → 编译（构建模块依赖图）→ 构建 chunk→ 输出 bundle）

2. vite 的预构建（Pre-Bundling）是做什么的？为什么能大幅提升启动速度？预构建的产物存在哪里？

3. webpack 的代码分割（Code Splitting）有哪些方式？（entry 手动分割、动态 import ()、splitChunks 自动分割）各自的适用场景？

4. vite 的热更新（HMR）原理和 webpack 的 HMR 有什么本质区别？为什么 vite 的 HMR 更快？

[详细](./vite%20的热更新（HMR）原理和%20webpack%20的%20HMR%20有什么本质区别？为什么%20vite%20的%20HMR%20更快？.md)

5. webpack5 的核心新特性有哪些？（持久化缓存、模块联邦、更好的 Tree Shaking、Node.js 模块兼容优化）你在项目中用过哪些？

6 . 解释一下 webpack 中 chunk 和 bundle 的区别？
