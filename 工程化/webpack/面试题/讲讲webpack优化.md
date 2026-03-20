## 讲讲 webpack 优化

Webpack 是一个强大的模块打包工具，但在大型项目中，构建速度和打包后的性能可能会成为瓶颈。通过一些优化策略，可以显著提升 Webpack 的构建速度和打包后的性能。以下是一些常见的 Webpack 优化方法：

### 1. 优化构建速度

#### 1.1 使用持久化缓存

Webpack 5 引入了持久化缓存，可以显著提升二次构建速度。

```javascript
module.exports = {
    cache: {
        type: 'filesystem',
    },
};
```

#### 1.2 多线程/多进程构建

使用 `thread-loader` 或 `parallel-webpack` 可以利用多线程/多进程来加速构建。

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['thread-loader', 'babel-loader'],
            },
        ],
    },
};
```

#### 1.3 缩小构建范围

通过 `include` 和 `exclude` 选项缩小 `loader` 的处理范围。

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
};
```

#### 1.4 使用 `DllPlugin`

`DllPlugin` 可以将第三方库单独打包，从而加快主项目的构建速度。

```javascript
// webpack.dll.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        vendor: ['react', 'react-dom'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].dll.js',
        library: '[name]_dll',
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_dll',
            path: path.resolve(__dirname, 'dist', '[name].manifest.json'),
        }),
    ],
};
```

### 2. 优化打包体积

#### 2.1 Tree Shaking

Tree Shaking 是一种通过消除未使用代码来减小打包体积的技术。确保使用 ES6 模块语法，并在生产环境中启用 `mode: 'production'`。

```javascript
module.exports = {
    mode: 'production',
    // 确保使用 ES6 模块语法
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use: 'babel-loader',
            },
        ],
    },
};
```

#### 2.2 代码分割

通过代码分割，可以将代码拆分成更小的块，从而实现按需加载。

```javascript
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};
```

#### 2.3 压缩代码

使用 `TerserPlugin` 压缩 JavaScript 代码，使用 `css-minimizer-webpack-plugin` 压缩 CSS 代码。

```javascript
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
            }),
            new CssMinimizerPlugin(),
        ],
    },
};
```

#### 2.4 使用 `Babel` 的 `preset-env`

通过配置 `Babel` 的 `preset-env`，可以只编译目标环境所需的代码。

```javascript
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: '> 0.25%, not dead',
            },
        ],
    ],
};
```

#### 2.5 使用 `externals`

将某些库（如 `React`、`ReactDOM`）通过 CDN 引入，而不是打包到项目中。

```javascript
module.exports = {
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
};
```

### 3. 优化开发体验

#### 3.1 使用 `webpack-dev-server`

`webpack-dev-server` 提供了一个开发服务器，支持热模块替换（HMR），可以显著提升开发体验。

```javascript
module.exports = {
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        hot: true,
    },
};
```

#### 3.2 使用 `source-map`

在开发环境中使用 `source-map`，可以更方便地调试代码。

```javascript
module.exports = {
    devtool: 'source-map',
};
```

### 4. 分析工具

#### 4.1 使用 `Bundle Analyzer`

使用 `webpack-bundle-analyzer` 可以可视化分析打包后的文件大小，帮助找出体积较大的模块进行优化。

```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    plugins: [new BundleAnalyzerPlugin()],
};
```

### 总结

-   优化构建速度：持久化缓存（cache）、多进程打包（thread-loader、parallel-webpack）、include/exclude 缩小构建范围、dll 第三方库单独打包
-   优化打包体积：treeShaking、代码分割（spllitChuck）、压缩代码（js：TerserPlugin、css： css-minimizer-webpack-plugin）、externals 第三方库通过 cdn 引入、Babel 的 preset-env 配置编译目标环境所需的代码
-   优化开发体验：webpack-dev-server、source-map
