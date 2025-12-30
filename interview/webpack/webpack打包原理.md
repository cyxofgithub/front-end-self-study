### 一、Webpack 打包核心认知

首先要明确：webpack 本质是一个**模块打包器**，它会把项目中所有依赖的模块（JS、CSS、图片等），从指定的**入口文件**开始，构建一个**依赖图 (Dependency Graph)**，然后将所有模块按照规则处理后，打包成一个或多个**输出文件 (bundle)**。

webpack 对模块的处理不局限于 ES Module（`import/export`），也支持 CommonJS（`require/module.exports`）等模块化规范，核心是“统一模块处理规则”。

### 二、从入口文件出发的完整打包流程

下面以最基础的单入口配置为例，拆解从入口文件到最终输出的每一步：

#### 1. 初始化阶段：准备工作

-   读取 `webpack.config.js` 配置（或默认配置），确定核心参数：
    -   `entry`：入口文件路径（如 `./src/index.js`）
    -   `output`：输出文件的路径和名称（如 `./dist/main.js`）
    -   `module/rules`：模块解析规则（如处理 CSS、图片的 loader）
    -   `plugins`：插件配置（如清理输出目录、生成 HTML 的插件）
-   初始化 Compiler 编译对象（webpack 的核心编译控制器），并创建 Compilation 对象（单次编译的上下文）。

#### 2. 编译阶段：构建依赖图（核心）

这是从入口文件开始的核心步骤，分为 3 个子阶段：

##### 步骤 1：解析入口文件

-   webpack 首先找到配置中指定的入口文件（如 `index.js`），通过 `fs` 模块读取文件内容。
-   调用 **解析器 (Parser)** 分析文件内容，识别其中的模块依赖语句（如 `import './utils.js'`、`require('./style.css')`）。
-   对入口文件进行**抽象语法树 (AST)** 转换：把代码字符串转换成 AST 结构，方便后续分析和修改（比如替换 `import` 为 webpack 能识别的内部模块引用）。

##### 步骤 2：递归解析所有依赖模块

-   对于入口文件中识别出的每个依赖模块（如 `utils.js`、`style.css`），webpack 会重复“读取文件 → 解析 AST → 识别依赖”的过程，直到遍历完所有间接依赖（比如 `utils.js` 又依赖 `api.js`）。
-   这个过程中，webpack 会为每个模块分配一个**唯一的模块 ID**（默认是数字，也可配置为路径），并把所有模块的路径、内容、依赖关系记录下来，最终形成**依赖图**。
-   关键：不同类型的文件（如 CSS、图片）会通过对应的 `loader` 处理：
    -   比如 CSS 文件会先经过 `css-loader` 解析 `@import` 和 `url()`，再经过 `style-loader` 转换成 JS 模块（将 CSS 插入到 DOM 中）；
    -   图片文件会经过 `file-loader` 处理为文件路径，或 `url-loader` 转换成 base64 字符串嵌入 JS。

##### 步骤 3：模块转换

-   所有模块解析完成后，webpack 会将每个模块的代码转换成**兼容 webpack 运行时的格式**：
    -   比如 ES Module 会被转换成 webpack 内部的 `__webpack_require__` 调用（模拟模块化）；
    -   示例：原代码 `import { add } from './utils.js'` 会被转换成 `__webpack_require__("./src/utils.js")`。

#### 3. 输出阶段：生成打包文件

-   webpack 根据依赖图，将所有模块的代码整合到一起，生成**运行时 (runtime)** 和 **chunk**：
    -   **runtime**：webpack 的核心运行代码，包含 `__webpack_require__`（模块加载函数）、模块缓存、模块 ID 映射等，负责在浏览器中加载和执行模块；
    -   **chunk**：一组模块的集合，单入口默认生成一个 chunk，多入口/代码分割会生成多个 chunk。
-   最终将 runtime + 所有模块代码拼接成一个或多个 bundle 文件（如 `main.js`），输出到 `output` 指定的目录。

### 三、核心示例：从入口文件到打包结果

为了更直观，我们用一个极简示例展示过程：

#### 1. 项目结构

```
src/
  index.js (入口文件)
  utils.js
webpack.config.js
```

#### 2. 源码

```js
// src/utils.js
export const add = (a, b) => a + b;

// src/index.js
import { add } from './utils.js';
console.log(add(1, 2));
```

#### 3. webpack 打包后的核心输出（简化版）

```js
// dist/main.js (webpack 打包后的文件)
(function (modules) {
    // 模块缓存
    var installedModules = {};

    // webpack 核心加载函数（runtime）
    function __webpack_require__(moduleId) {
        // 检查缓存
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        // 创建新模块并缓存
        var module = (installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {},
        });
        // 执行模块代码
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }

    // __webpack_require__.s = './src/index.js' 是一个赋值表达式
    // 赋值表达式会返回被赋的值，所以 (__webpack_require__.s = './src/index.js') 的结果就是 './src/index.js'
    // 因此这行等价于：
    // __webpack_require__.s = './src/index.js';
    // return __webpack_require__('./src/index.js');
    // 这种写法只是为了更简洁，同时记录入口模块 ID
    return __webpack_require__((__webpack_require__.s = './src/index.js'));
})({
    // 模块 1：./src/index.js
    './src/index.js': function (module, exports, __webpack_require__) {
        // 转换后的 import 语句
        var _utils_js = __webpack_require__('./src/utils.js');
        console.log((0, _utils_js.add)(1, 2));
    },

    // 模块 2：./src/utils.js
    './src/utils.js': function (module, exports) {
        // 转换后的 export 语句
        exports.add = function (a, b) {
            return a + b;
        };
    },
});
```

可以看到：

-   所有模块被包裹在一个自执行函数中，以对象形式存储（key 是模块 ID，value 是模块代码）；
-   入口文件通过 `__webpack_require__` 加载，依赖的模块也通过这个函数递归加载；
-   整个过程完全基于“依赖图”，从入口文件出发，把所有依赖模块整合到一个文件中。

### 四、关键补充

1. **插件的作用**：loader 负责“转换模块内容”，插件负责“扩展打包流程”（如 `HtmlWebpackPlugin` 生成引用 bundle 的 HTML、`CleanWebpackPlugin` 清理输出目录、`MiniCssExtractPlugin` 抽离 CSS 为单独文件）；
2. **代码分割**：如果配置了 `splitChunks`，webpack 会将公共依赖（如第三方库）拆分成单独的 chunk（如 `vendors.js`），避免重复打包；
3. **热更新**：开发环境下，webpack-dev-server 会监听文件变化，只重新编译变化的模块，并用热更新 runtime 替换旧模块，无需刷新页面。

### 总结

1. webpack 打包的核心起点是**入口文件**，核心产物是**依赖图**，最终输出包含 runtime 的 bundle 文件；
2. 完整流程：初始化配置 → 从入口解析文件并递归构建依赖图（loader 处理不同模块）→ 转换模块代码 → 生成 runtime + 模块代码的 bundle；
3. runtime 是 webpack 的“运行核心”，负责在浏览器中加载和执行所有模块，这也是为什么打包后的代码能在浏览器中实现模块化。
