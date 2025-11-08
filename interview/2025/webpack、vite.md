## webpack

### 基础概念类

#### Webpack 是什么？它的作用是什么？

Webpack 是一个模块打包工具

主要作用：

-   模块打包：将多个文件打包成单个文件
-   资源处理：处理图片、字体、CSS 等资源
-   代码转换：将 ES6+ 转换为 ES5，Sass 转换为 CSS
-   开发优化：热重载、代码分割、懒加载

#### Webpack 的核心概念有哪些？

-   Entry（入口）：指定打包的入口文件
-   Output（输出）：指定打包后的文件输出位置
-   Loader（加载器）：处理非 JavaScript 文件
-   Plugin（插件）：执行范围更广的任务
-   Mode（模式）：development、production、none
-   Module（模块）：在 Webpack 中一切皆模块

### 配置相关

#### 如何配置多入口和多输出？

```javascript
module.exports = {
    entry: {
        app: './src/app.js',
        admin: './src/admin.js',
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
};
```

#### 常用的 Loader 有哪些？

-   babel-loader：转换 ES6+ 代码
-   css-loader：处理 CSS 文件
-   style-loader：将 CSS 注入到 DOM
-   file-loader：处理文件资源
-   url-loader：处理小文件，转为 base64
-   sass-loader：处理 Sass/SCSS 文件
-   vue-loader：处理 Vue 单文件组件

#### 常用的 Plugin 有哪些？

-   HtmlWebpackPlugin：生成 HTML 文件
-   MiniCssExtractPlugin：提取 CSS 到单独文件
-   CleanWebpackPlugin：清理构建目录
-   DefinePlugin：定义环境变量
-   HotModuleReplacementPlugin：热模块替换
-   BundleAnalyzerPlugin：分析打包结果

### 性能优化类

#### Webpack 性能优化的方法有哪些？

1. 减少打包时间：

```javascript
// 使用 cache-loader
{
  test: /\.js$/,
  use: [
    'cache-loader',
    'babel-loader'
  ]
}

// 使用 thread-loader 多线程打包
{
  test: /\.js$/,
  use: [
    'thread-loader',
    'babel-loader'
  ]
}
```

**cache-loader 原理：**

-   首次构建：
    正常执行所有 Loader 处理流程。
    cache-loader 在 Loader 处理完成后，将结果（包括处理后的代码和元数据）写入缓存目录。
-   后续构建：
    cache-loader 首先检查文件的哈希值（基于文件内容和 Loader 配置）。
    若哈希值与缓存一致，直接返回缓存结果，跳过后续 Loader 处理。
    若文件变化（哈希值改变），则重新执行完整的 Loader 流程，并更新缓存。

2. 减少打包体积：

```javascript
// 代码分割
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      }
    }
  }
}

// 压缩代码
optimization: {
  minimize: true,
  minimizer: [
    new TerserPlugin(),
    new CssMinimizerPlugin()
  ]
}
```

3. 优化加载速度：

```javascript
// 懒加载
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// 预加载
import(/* webpackPrefetch: true */ './prefetch-module');
```

#### 什么是 Tree Shaking？如何配置？

```javascript
// package.json
{
  "sideEffects": false  // 或指定有副作用的文件
}

// webpack.config.js
module.exports = {
  mode: 'production',  // 自动启用 Tree Shaking
  optimization: {
    usedExports: true,
    sideEffects: false
  }
};
```

package.json 中的 sideEffects：声明哪些文件有副作用。
optimization.usedExports：标记未使用的导出。
optimization.sideEffects：根据 pkg 文件中副作用配置，安全删除无副作用的模块。

Tree Shaking 的完整流程：

-   静态分析：Webpack 通过 usedExports 分析出哪些导出未被使用。
-   副作用判断：根据 sideEffects 配置，决定是否可以安全删除未使用的模块。
-   代码压缩：Terser 等工具根据前面的标记，删除未使用的代码。

#### 如何实现代码分割？

1、入口分割：

```javascript
entry: {
  app: './src/app.js',
  vendor: './src/vendor.js'
}
```

2、动态导入：

```javascript
// 使用 import() 语法
const loadModule = () => import('./module');

// 使用 React.lazy
const LazyComponent = React.lazy(() => import('./Component'));
```

3、SplitChunks 配置：

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      },
      common: {
        name: 'common',
        minChunks: 2,
        chunks: 'all'
      }
    }
  }
}
```

### 开发调试类

#### 如何配置开发环境的 Source Map？

```javascript
module.exports = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map', // 开发环境推荐
    // 或使用 'source-map' 用于调试
};
```

#### 如何配置热重载（HMR）？

```javascript
// webpack.config.js
const webpack = require('webpack');

module.exports = {
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devServer: {
        hot: true,
    },
};
```

### 高级概念类

#### Webpack 的构建流程是什么？

-   初始化阶段：读取配置，创建 Compiler 对象
-   构建阶段：从入口开始，递归解析模块依赖
-   编译阶段：对每个模块进行编译
-   输出阶段：将编译结果输出到文件系统

#### Loader 和 Plugin 的区别？

Loader：

-   文件级别的处理器
-   在模块加载时执行
-   将文件转换为模块
-   配置在 module.rules 中

Plugin：

-   项目级别的处理器
-   在 Webpack 运行的生命周期中执行
-   可以访问 Webpack 的内部数据
-   配置在 plugins 数组中

#### 如何编写自定义 Loader？

```javascript
// custom-loader.js
module.exports = function(source) {
    // source 是文件内容
    const result = source.replace(/console\.log\(/g, 'console.error(');

    // 返回处理后的代码
    return result;
};

// 异步 Loader
module.exports = function(source) {
    const callback = this.async();

    setTimeout(() => {
        callback(null, source);
    }, 100);
};
```

#### 如何编写自定义 Plugin？

```javascript
class MyPlugin {
    apply(compiler) {
        compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
            // 在 emit 阶段执行
            console.log('构建完成');
            callback();
        });
    }
}

module.exports = MyPlugin;
```

### 实际应用类

#### 如何处理图片和字体文件？

```javascript
module: {
    rules: [
        {
            test: /\.(png|jpg|gif|svg)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192, // 8KB 以下转为 base64
                        fallback: 'file-loader',
                    },
                },
            ],
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: ['file-loader'],
        },
    ];
}
```

#### 如何配置代理解决跨域问题？

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
```

#### 如何优化 webpack 构建速度

-   使用 cache-loader
    将 Loader 的处理结果缓存到磁盘（或内存），下次构建时直接复用缓存，跳过重复处理。

```javascript
{
  test: /\.js$/,
  use: [
    'cache-loader', // 先读取缓存
    'babel-loader'  // 再处理代码
  ]
}
```

-   使用 thread-loader 多线程
    将 Loader 处理逻辑分配给多个 Worker 线程并行执行，利用多核 CPU 加速。

```javascript
{
  test: /\.js$/,
  use: [
    'thread-loader', // 开启多线程
    'babel-loader'
  ]
}
```

-   减少 loader 处理范围，尤其项目依赖大量第三方库时

```javascript
{
  test: /\.js$/,
  include: path.resolve(__dirname, 'src'), // 只处理 src 目录
  exclude: /node_modules/,                // 排除第三方库
  use: ['babel-loader']
}
```

通过 include/exclude 精准控制 Loader 的处理文件范围，避免处理无关文件。

-   使用 DllPlugin 预编译
    将不频繁变更的第三方库（如 React、Vue、lodash）预先编译为独立文件（DLL 文件），主构建时直接引用，无需重复处理。

```javascript
// webpack.dll.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        vendor: ['react', 'react-dom'], // 要预编译的库
    },
    output: {
        path: path.resolve(__dirname, 'dist/dll'),
        filename: '[name].dll.js',
        library: '[name]_[hash]',
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_[hash]',
            path: path.resolve(__dirname, 'dist/dll/[name]-manifest.json'),
        }),
    ],
};
```

-   合理配置 resolve 选项
    优化模块路径解析规则，减少 Webpack 查找文件的耗时。

```javascript
resolve: {
  extensions: ['.js', '.jsx'], // 优先尝试 .js 和 .jsx
  alias: {
    '@': path.resolve(__dirname, 'src'), // 用 @ 替代 src/
    'components': path.resolve(__dirname, 'src/components')
  },
  modules: [path.resolve(__dirname, 'node_modules')], // 优先本地模块
  symlinks: false // 不解析符号链接
}
```

## vite

### 基础概念类

#### vite 是什么？它的优势是什么？

Vite 是一个基于 ESM（ES Modules）的前端构建工具, 主要优势：

-   开发速度快：基于原生 ES 模块，无需打包
-   热更新快：只重新编译改动的文件
-   构建优化：基于 Rollup 的生产构建
-   插件生态：兼容 Rollup 插件
-   开箱即用：内置 TypeScript、JSX、CSS 等支持

#### Vite 和 Webpack 的区别？

| 特性       | Vite          | Webpack        |
| ---------- | ------------- | -------------- |
| 开发模式   | ESM + esbuild | Bundle + babel |
| 启动速度   | 快（秒级）    | 慢（分钟级）   |
| 热更新     | 快            | 相对慢         |
| 构建工具   | Rollup        | 自身           |
| 配置复杂度 | 简单          | 复杂           |
| 生态成熟度 | 新兴          | 成熟           |

#### vite 工作原理

-   开发环境：
    使用原生 ES 模块，浏览器直接请求模块
    用 esbuild 预构建依赖
    实时编译源码
-   生成环境：
    使用 Rollup 进行打包
    代码分割和优化

esbuild（基于 go 性能更好） 做 “依赖预构建”：

-   把 CommonJS 格式的第三方依赖转换为 ESM 格式（让浏览器能解析）；
-   把零散的嵌套依赖 “合并” 成少数几个文件（减少浏览器请求次数）。

### 配置相关

##### Vite 的配置文件怎么写？

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    plugins: [vue()],

    // 开发服务器配置
    server: {
        port: 3000,
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
            },
        },
    },

    // 构建配置
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                admin: resolve(__dirname, 'admin.html'),
            },
        },
    },

    // 路径别名
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            components: resolve(__dirname, 'src/components'),
        },
    },

    // 环境变量
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
});
```

##### 如何配置多页面应用？

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                admin: resolve(__dirname, 'admin.html'),
                mobile: resolve(__dirname, 'mobile.html'),
            },
        },
    },
});
```

##### 如何处理环境变量？

```javascript
// .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

// .env.development
VITE_API_URL=http://localhost:3000

// .env.production
VITE_API_URL=https://prod-api.example.com

// 在代码中使用
console.log(import.meta.env.VITE_API_URL)
console.log(import.meta.env.MODE) // development | production
console.log(import.meta.env.DEV)  // boolean
console.log(import.meta.env.PROD) // boolean
```

### 插件系统

#### 常用的 Vite 插件有哪些？

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import legacy from '@vitejs/plugin-legacy';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
    plugins: [
        // 这是用于支持 Vue 单文件组件（.vue 文件）的插件。@vitejs/plugin-vue 可以让 Vite 正确解析和热更新 Vue 组件，是开发 Vue 项目的必备插件。
        vue(),

        // 兼容旧浏览器
        legacy({
            targets: ['defaults', 'not IE 11'],
        }),

        // HTML 处理
        // 这是用于处理 HTML 文件的插件。createHtmlPlugin 可以让你在打包时动态注入数据（如 title），并对 HTML 文件进行自定义处理。
        createHtmlPlugin({
            inject: {
                data: {
                    title: 'My App',
                },
            },
        }),

        // PWA
        // 这是用于实现 PWA（渐进式网页应用）的插件。VitePWA 插件可以让你的应用支持离线访问、自动缓存、添加到主屏幕等特性，提升用户体验。
        VitePWA({
            registerType: 'autoUpdate',
        }),
    ],
});
```

#### 如何编写自定义 vite 插件

```javascript
// plugins/my-plugin.js
function myPlugin(options = {}) {
    return {
        name: 'my-plugin',

        // 开发服务器启动时
        configureServer(server) {
            server.middlewares.use('/api/custom', (req, res, next) => {
                res.end('Custom API response');
            });
        },

        // 转换代码
        // 这里的 id 是指当前被处理的模块的路径（通常是文件的绝对路径或相对路径）。
        // 在 Vite 插件的 transform 钩子中，Vite 会为每个被处理的文件传递 code（文件内容）和 id（文件路径）。
        // 你可以通过判断 id 来决定是否对某些特定文件进行处理，比如判断文件扩展名、查询参数等。
        // 例如：id 可能是 '/src/main.js' 或 '/src/main.js?custom'
        transform(code, id) {
            if (id.includes('?custom')) {
                return `export default ${JSON.stringify(options)}`;
            }
        },

        // 生成文件
        // bundle 是本次打包生成的所有资源对象，key 是文件名，value 是对应的文件信息（如类型、源码、依赖等），可以遍历 bundle 查看所有输出文件及其内容。
        // options 是输出相关的配置信息，包含输出目录、文件名模板等，通常与 vite.config.js 里的 build.rollupOptions.output 配置相关。
        // 例如：
        // for (const [fileName, fileInfo] of Object.entries(bundle)) {
        //     console.log(fileName, fileInfo);
        // }
        generateBundle(options, bundle) {
            this.emitFile({
                type: 'asset',
                fileName: 'custom.txt',
                source: 'Custom file content',
            });
        },
    };
}

// 使用插件
export default defineConfig({
    plugins: [myPlugin({ key: 'value' })],
});
```

### 性能优化

#### Vite 的性能优化策略？

##### 构建优化

1. 依赖预构建优化：

```javascript
export default defineConfig({
    // 这段配置是 Vite 的依赖预构建优化选项
    // 依赖预构建（optimizeDeps）发生在 Vite 启动开发服务器（dev server）时的初始化阶段。
    // 具体来说，Vite 会扫描你的依赖（如 node_modules 下的包），将 include 指定的依赖提前用 esbuild 进行一次打包、转为 ESM 格式，并缓存到 node_modules/.vite 目录下。
    // 这样做的表现是：首次启动项目或依赖发生变化时，Vite 会有一个“预构建依赖”的过程，控制台会有相关日志提示。
    // 预构建完成后，后续开发过程中这些依赖就可以直接以 ESM 形式被浏览器高效加载，无需每次都重新打包，极大提升了冷启动和热更新速度。
    // 所以，预构建只在首次或依赖变动时发生，后续只要依赖没变，Vite 会直接复用缓存结果，无需再次预构建。
    // include: 指定要强制预构建的依赖（如 lodash、axios），加快开发启动速度
    // exclude: 指定不参与预构建的依赖（如 my-local-package），避免本地包被错误处理
    optimizeDeps: {
        include: ['lodash', 'axios'],
        exclude: ['my-local-package'],
    },
});
```

2. 如何处理大型项目的构建性能？

```javascript
export default defineConfig({
    // 开启多线程
    esbuild: {
        target: 'es2015',
    },

    // 优化依赖预构建
    optimizeDeps: {
        include: ['vue', 'vue-router', 'pinia', 'axios'],
    },

    // 构建优化
    build: {
        // 使用 terser 压缩（更好的压缩率）
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },

        // 分包策略
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                    if (id.includes('src/components')) {
                        return 'components';
                    }
                },
            },
        },
    },
});
```

##### 包体优化

1. 代码分割：

```javascript
// 这是对 Vite 进行“代码分割”优化。通过配置 manualChunks，可以将第三方依赖（如 vue、vue-router、lodash、axios 等）单独打包成独立的 chunk（如 vendor.js、utils.js），这样做有以下好处：
// 1. 提高缓存利用率：第三方库更新频率低，单独打包后，用户浏览器可以长期缓存这些文件，减少后续访问时的加载量。
// 2. 加快首屏加载：业务代码和依赖分离后，首屏只需加载必要的业务代码，提升页面加载速度。
// 3. 降低重复加载：多个页面或入口共享依赖时，避免重复打包和加载相同的库。

export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['vue', 'vue-router'],
                    utils: ['lodash', 'axios'],
                },
            },
        },
    },
});
```

2. 资源处理：

```javascript
export default defineConfig({
    // 为什么要内联资源和进行 CSS 代码分割？
    // 1. 资源内联（assetsInlineLimit）：
    //    - 小体积资源（如小图片、字体等）通过 base64 格式直接内联到 JS/CSS 文件中，减少 HTTP 请求次数，提高页面加载速度。
    //    - 但过大的资源不适合内联，否则会导致主文件体积过大，反而影响加载效率。
    // 2. CSS 代码分割（cssCodeSplit）：
    //    - 将不同入口或异步模块的 CSS 拆分成独立文件，避免所有页面都加载全部样式，提升首屏加载速度。
    //    - 支持懒加载和异步加载场景，按需加载对应的 CSS，优化性能和用户体验。
    build: {
        assetsInlineLimit: 4096, // 4kb 以下内联
        cssCodeSplit: true, // CSS 代码分割
        sourcemap: false, // 生产环境关闭 sourcemap
    },
});
```

### 框架集成

#### 如何在 Vue 3 项目中使用 Vite？

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(), // 支持 JSX
    ],

    // Vue 特定配置
    vue: {
        include: [/\.vue$/, /\.md$/],
    },
});
```

#### 如何在 React 项目中使用 Vite？

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],

    // React 刷新配置
    server: {
        hmr: {
            overlay: false,
        },
    },
});
```

#### 如何配置 TypeScript？

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  // TypeScript 配置
  esbuild: {
    target: 'es2020'
  },

  // 类型检查（开发环境）
  server: {
    hmr: {
      overlay: true
    }
  }
})

// tsconfig.json
{
  "compilerOptions": {
    "types": ["vite/client"],
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  }
}
```

### 开发体验

#### 如何配置代理和跨域？

```javascript
export default defineConfig({
    server: {
        proxy: {
            // 字符串简写
            '/foo': 'http://localhost:4567',

            // 带选项

            '/api': {
                target: 'http://jsonplaceholder.typicode.com',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
            },

            // 正则表达式
            '^/fallback/.*': {
                target: 'http://jsonplaceholder.typicode.com',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/fallback/, ''),
            },

            // 使用代理实例
            '/socket.io': {
                target: 'ws://localhost:5174',
                ws: true,
            },
        },
    },
});
```

#### 如何实现条件编译？

```javascript
// vite.config.js
export default defineConfig({
    define: {
        __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
        __FEATURE_A__: JSON.stringify(true),
    },
});

// 在代码中使用
if (__DEV__) {
    console.log('开发环境');
}

if (__FEATURE_A__) {
    // 功能 A 的代码
}
```

#### 如何处理 css

```javascript
export default defineConfig({
    css: {
        // CSS 预处理器选项
        // preprocessorOptions 用于配置 CSS 预处理器（如 scss、less）的相关参数。
        // 例如：
        // - scss 的 additionalData 可以在每个 scss 文件前自动注入全局变量或 mixin，这样每个文件都能直接使用这些变量，无需手动 import。
        // - less 的 javascriptEnabled: true 允许在 less 文件中使用 JS 表达式，适配一些高级用法。
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/styles/variables.scss";`, // 自动引入全局 scss 变量
            },
            less: {
                javascriptEnabled: true, // 允许 less 中使用 JS
            },
        },

        // PostCSS 配置
        // postcss 字段用于配置 PostCSS 插件链。
        // 例如：
        // - autoprefixer：自动为 CSS 添加浏览器前缀，提升兼容性
        // - tailwindcss：集成 Tailwind CSS 原子化工具类
        postcss: {
            plugins: [require('autoprefixer'), require('tailwindcss')],
        },

        // CSS Modules
        // modules 用于配置 CSS Modules 的行为。
        // 例如：
        // - localsConvention: 'camelCase' 表示生成的类名导出为 camelCase 格式，便于在 JS/TS 中按驼峰方式访问
        modules: {
            localsConvention: 'camelCase',
        },
    },
});
```

### 部署和构建

#### 如何配置构建输出？

```javascript
//  这份配置适用于将项目打包为一个可复用的 JS 库（如组件库），并支持外部依赖（如 vue）不被打包进最终产物，适合发布到 npm 或 CDN 场景。
export default defineConfig({
    // base: 设置项目的基础公共路径，部署到子目录时需指定（如 GitHub Pages、nginx 子路径等）。
    base: '/my-app/',

    build: {
        outDir: 'dist',

        // assetsDir: 静态资源（如图片、字体、js、css）输出的子目录，默认为 'assets'。
        assetsDir: 'assets',

        // rollupOptions: 传递给底层 Rollup 的构建选项。
        rollupOptions: {
            // external: 指定外部依赖，不会被打包进产物（如 vue 由外部 CDN 提供）。
            external: ['vue'],
            output: {
                // globals: 配置外部依赖的全局变量名（如 UMD/IIFE 构建时，vue 对应全局变量 Vue）。
                globals: {
                    vue: 'Vue',
                },
            },
        },

        // lib: 启用库模式构建，适合开发组件库/工具库。
        // 库模式构建（Library Mode Build）是 Vite 提供的一种专门用于打包 JS/TS 组件库、工具库等可复用模块的构建方式。
        // 与普通应用打包不同，库模式不会生成 HTML 文件，而是只输出 JS（以及相关的 CSS、类型声明等）文件，方便发布到 npm 或 CDN，被其他项目引用。
        // 主要特点如下：
        // 1. 支持多种输出格式：如 ESModule（esm）、CommonJS（cjs）、UMD 等，适配不同的使用场景。
        // 2. 支持 external 配置：可以将如 vue、react 等外部依赖排除在打包产物之外，减小包体积，避免重复打包。
        // 3. 支持自定义入口、全局变量名、输出文件名等，灵活适配各种库发布需求。
        // 4. 适合开发 UI 组件库、工具函数库、SDK 等场景。
        // 配置方式如上方 lib 字段所示，常见参数有 entry（入口文件）、name（全局变量名）、fileName（输出文件名格式）等。
        lib: {
            // entry: 库入口文件路径。
            entry: resolve(__dirname, 'lib/main.js'),
            // name: 库的全局变量名（UMD/IIFE 格式下）。
            name: 'MyLib',
            // fileName: 输出文件名格式，format 为打包格式（如 esm、cjs、umd）。
            fileName: format => `my-lib.${format}.js`,
        },
    },
});
```

**什么是 umd？**

UMD（Universal Module Definition，通用模块定义）是一种兼容多种 JavaScript 模块加载方式的规范。它的主要作用是让同一个 JS 库/模块可以在不同的环境下被正确加载和使用，包括：

-   CommonJS（如 Node.js 环境）
-   AMD（如 RequireJS）
-   直接通过 `<script>` 标签在浏览器中全局引入

UMD 格式的打包产物会自动检测当前运行环境，并以合适的方式导出模块。例如，在 Node.js 环境下用 `module.exports`，在 AMD 环境下用 `define`，在浏览器环境下挂载到全局变量（如 `window.MyLib`）。

优点：

-   兼容性强，适合发布 npm 包、CDN 脚本等多种场景
-   方便第三方项目无论用哪种模块系统都能直接引用

举例：
如果你用 Vite 的库模式打包并指定 `format: 'umd'`，最终生成的 JS 文件就会采用 UMD 规范，可以被各种环境直接使用。

简单理解：
UMD 就是“通用打包格式”，让你的库“一次打包，到处可用”。

### 常见问题

#### Vite 热更新失效怎么办？

1、检查文件路径大小写  
原因：在某些操作系统（如 Linux）中，文件路径是区分大小写的。如果导入路径与实际文件名大小写不一致，Vite 可能无法正确监听文件变动，导致热更新失效。

2、确认 HMR 边界  
原因：Vite 的热模块替换（HMR）只会在模块的“边界”内生效。如果修改的内容超出了 HMR 能感知的范围（比如全局状态、单例对象等），热更新可能不会触发或无法正确应用，需要手动刷新页面。

3、检查防火墙和代理设置  
原因：Vite 的 HMR 依赖 WebSocket 进行通信。如果本地防火墙、网络代理或安全软件阻断了 WebSocket 连接，HMR 功能就会失效。因此需要确保相关端口和协议畅通。

4、使用 import.meta.hot API

```javascript
// HMR API 使用
if (import.meta.hot) {
    import.meta.hot.accept('./component.vue', newModule => {
        // 在这里可以将新的模块内容应用到页面上，比如替换组件实例、刷新视图等
        // 例如：可以通过重新渲染组件或更新相关状态来实现热更新效果
        // 具体处理方式取决于你的应用架构和需求
        // 常见做法：销毁旧组件实例，挂载新组件，或调用框架的热更新 API
        // 例如：appInstance.component = newModule.default
        // 这样可以让页面无刷新地反映最新的模块内容
    });

    import.meta.hot.dispose(() => {
        // 清理副作用
    });
}
```

**为什么代理会阻断 WebSocket 链接？**

WebSocket 是一种基于 HTTP 协议升级（Upgrade）的持久化双向通信协议。它在建立连接时会先发起一次 HTTP 请求（带有 `Upgrade: websocket` 头），然后升级为 WebSocket 通道。

**代理阻断 WebSocket 的常见原因：**

1. **不支持协议升级**  
   许多传统的 HTTP 代理（如部分 Nginx、老旧的反向代理、公司内网代理等）只支持普通的 HTTP/HTTPS 流量，不支持 HTTP 协议的 Upgrade 机制。当 WebSocket 客户端发起带有 `Upgrade: websocket` 的请求时，代理服务器无法正确处理，导致连接被拒绝或中断。

2. **端口未开放或被拦截**  
   WebSocket 默认使用 80（ws）或 443（wss）端口，但实际开发中可能会用自定义端口。如果代理或防火墙未开放对应端口，WebSocket 连接会被直接阻断。

3. **安全策略或流量审查**  
   某些公司或校园网络的代理会主动拦截或过滤 WebSocket 流量，出于安全或合规考虑，直接阻止协议升级或中断长连接。

4. **代理未正确转发头部**  
   WebSocket 握手依赖特定的 HTTP 头（如 `Upgrade`、`Connection`、`Sec-WebSocket-Key` 等）。如果代理未正确转发这些头部，后端服务器无法完成协议升级，连接失败。

**解决方法：**

-   检查并配置代理服务器，确保支持 WebSocket 协议（如 Nginx 需配置 `proxy_set_header Upgrade $http_upgrade;` 等）。
-   确认端口已开放，且未被防火墙或代理拦截。
-   如有条件，尝试绕过代理或使用支持 WebSocket 的代理服务器。

**总结：**  
代理阻断 WebSocket 主要是因为协议升级机制与普通 HTTP 不同，代理若未支持或配置不当，就会导致连接失败。
