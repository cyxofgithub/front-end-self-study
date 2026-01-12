# @babel/preset-env 详解

本案例演示 `@babel/preset-env` 的核心配置选项和使用方法。

## 📦 依赖说明

> **注意**：依赖在外层统一管理，确保已安装 `@babel/core`、`@babel/cli`、`@babel/preset-env` 和 `core-js@3`

## 📚 核心配置

### 1. targets

指定目标浏览器或 Node.js 版本，Babel 会根据目标环境自动决定需要转换哪些语法。

```js
// 方式一：指定具体版本
targets: {
  chrome: '58',
  firefox: '60',
  safari: '11',
  edge: '16',
  ie: '11'
}

// 方式二：使用 browserslist（推荐）
targets: '> 0.25%, not dead'

// 方式三：使用 package.json 中的 browserslist 字段
// 无需在 babel.config.js 中配置 targets
```

### 2. useBuiltIns

控制 polyfill 的处理方式：

-   `false`（默认）：不处理 polyfill
-   `'entry'`：在入口文件引入 `import 'core-js/stable'`，引入所有可能的 polyfill
-   `'usage'`（推荐）：按需自动引入，只引入代码中实际使用的 polyfill

### 3. corejs

指定 core-js 的版本（需要配合 useBuiltIns 使用），推荐使用 `corejs: 3`

## 📊 配置对比

| 配置                        | 语法转换               | polyfill     | 体积 | 适用场景           |
| --------------------------- | ---------------------- | ------------ | ---- | ------------------ |
| **默认配置**                | 转换所有 ES6+          | 不处理       | 中等 | 快速测试           |
| **targets 配置**            | 根据目标浏览器智能转换 | 不处理       | 较小 | 需要支持特定浏览器 |
| **useBuiltIns: 'entry'**    | 转换语法               | 手动引入所有 | 较大 | 需要完整 polyfill  |
| **useBuiltIns: 'usage'** ⭐ | 转换语法               | 自动按需引入 | 最小 | 生产环境（推荐）   |

## 🚀 使用方法

> **注意**：需要先进入案例目录，`--config-file` 参数需要使用绝对路径

```bash
# 进入案例目录
cd "第二阶段：核心配置/2.1 @babel-preset-env 详解"

# 默认配置
npx babel src/index.js --out-dir outputs/default --config-file "$(pwd)/configs/config-default.js"

# targets 配置
npx babel src/index.js --out-dir outputs/targets --config-file "$(pwd)/configs/config-targets.js"

# entry 配置（需要手动在入口文件引入 import 'core-js/stable'）
npx babel src/index-entry.js --out-dir outputs/entry --config-file "$(pwd)/configs/config-entry.js"

# usage 配置（推荐）
npx babel src/index.js --out-dir outputs/usage --config-file "$(pwd)/configs/config-usage.js"
```

## 💡 最佳实践

### 生产环境推荐配置

```js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
                targets: {
                    chrome: '58',
                    firefox: '60',
                    safari: '11',
                    edge: '16',
                },
            },
        ],
    ],
};
```

### 库开发推荐配置

```js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false, // 保留 ES 模块
                targets: {
                    node: '14',
                },
            },
        ],
    ],
    plugins: [
        [
            '@babel/plugin-transform-runtime',
            {
                corejs: false,
                helpers: true,
                regenerator: true,
            },
        ],
    ],
};
```

### 支持 IE11 的配置

```js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
                targets: {
                    ie: '11',
                },
            },
        ],
    ],
};
```

## 📁 目录结构

```
2.1 @babel-preset-env 详解/
├── README.md                    # 本文件
├── src/                         # 源代码目录
│   ├── index.js                 # 包含 ES6+ 语法的源代码
│   └── index-entry.js           # entry 配置的入口文件
├── configs/                     # 不同配置示例
│   ├── config-default.js        # 默认配置
│   ├── config-targets.js        # targets 配置示例
│   ├── config-entry.js          # useBuiltIns: 'entry' 示例
│   └── config-usage.js          # useBuiltIns: 'usage' 示例（推荐）
└── outputs/                     # 编译输出目录
    ├── default/                 # 默认配置的输出
    ├── targets/                 # targets 配置的输出
    ├── entry/                   # entry 配置的输出
    └── usage/                   # usage 配置的输出
```

## 🔍 查看编译结果

编译后可以对比不同配置的输出：

-   **语法转换差异**：查看不同配置下语法的转换程度
-   **polyfill 引入**：使用 `grep -r "core-js" outputs/` 查找引入的 polyfill
-   **代码体积**：使用 `ls -lh outputs/*/index.js` 对比文件大小

## ❓ 常见问题

**Q: useBuiltIns: 'usage' 和 'entry' 的区别？**  
A: `'entry'` 需要手动引入，引入所有可能的 polyfill；`'usage'` 自动按需引入，只引入实际使用的（推荐）

**Q: 如何知道需要哪些 polyfill？**  
A: 使用 `useBuiltIns: 'usage'`，Babel 会自动检测并引入

**Q: targets 配置在哪里？**  
A: 可以在 `babel.config.js` 中配置，也可以使用 `package.json` 中的 `browserslist` 字段

**Q: 为什么推荐 core-js@3？**  
A: core-js@3 更新、更完整，支持更多特性

## 🛠️ 调试技巧

-   使用 Babel REPL (https://babeljs.io/repl) 在线测试配置
-   对比不同配置的输出文件查看差异
-   搜索输出文件中的 `core-js` 引用检查 polyfill
