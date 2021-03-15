# 深入浅出 Webpack

## 第一章	入门

### 1.1 前端发展

### 1.2 常见的构建工具及对比

#### 	1.2.5 Webpack	

- 概念：Webpack是一个打包模块化JavaScript的工具，在webpack里一切文件皆模块，通过Loader转换文件，通过plugin注入钩子，最后输出由多个模块组合成的文件。webpack专注于构建模块化项目。

- **使用方法大致如下：**

- ```
  module.export = {
  	// 所有模块的入口，webpack从入口开始递归解析出所有依赖的模块
  	entry: './app.js',
  	output: {
  	// 将入口所有依赖的所有模块打包成一个文件bundle.js 输出
  		filename: 'bundle.js'
  	}
  }
  ```

- webpack优点：

  - 专注于处理模块化的项目，能做到开箱即用，一步到位。
  - 可通过plugin扩展，完整好用又不失灵活
  - 使用场景不局限于web开发
  - 社区庞大活跃，经常引入紧跟时代发展的新特性，能为大多数场景找到已有的开源扩展
  - 良好的开发体验

### 1.3 安装 Webpack

- 前提：已经安装了5.0.0及以上版本的Node.js

#### 	1.3.1	安装 Webpack 到本项目

- npm i -D 是 npm install --save-dev 的简写，是指安装模块并保存到 package.json 的 devDependencies、
- 安装最新的稳定版
- npm i  -D webpack 
- 安装指定版本
- npm i - D webpack@<version>
- 安装最新的体验版本
- npm i -D webpack@beta
- 安装完后你可以通过这些途径运行安装到本项目的 Webpack：
  - 在项目根目录下对应的命令行里通过 `node_modules/.bin/webpack` 运行 Webpack 可执行文件。

#### 	1.3.2	安装Webpack到全局

- npm i -g webpack
- 注意：虽然有两种安装方式，但还是还是建议安装到本项目，原因是可防止不同的项目因依赖不同版本的 webpack 而导致冲突**

#### 	1.3.3	使用Webpack

- 下面通过 Webpack 构建一个采用 CommonJS 模块化编写的项目，该项目有个网页会通过 JavaScript 在网页中显示 `Hello,Webpack`。

- 运行构建前，先把要完成该功能的最基础的 JavaScript 文件和 HTML 建立好，需要如下文件：

- 页面入口文件 `index.html`

- ```html
  <html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body>
  <div id="app"></div>
  <!--导入 Webpack 输出的 JavaScript 文件-->
  <script src="./dist/bundle.js"></script>
  </body>
  </html>
  ```

- JS 工具函数文件 `show.js`

- ```js
  // 操作 DOM 元素，把 content 显示到网页上
  function show(content) {
    window.document.getElementById('app').innerText = 'Hello,' + content;
  }
  
  // 通过 CommonJS 规范导出 show 函数
  module.exports = show;
  ```

- JS 执行入口文件 `main.js`

- ```js
  // 通过 CommonJS 规范导入 show 函数
  const show = require('./show.js');
  // 执行 show 函数
  show('Webpack');
  ```

- Webpack 在执行构建时默认会从项目根目录下的 `webpack.config.js` 文件读取配置，所以你还需要新建它，其内容如下：

- ```js
  const path = require('path');
  
  module.exports = {
    // JavaScript 执行入口文件
    entry: './main.js',
    output: {
      // 把所有依赖的模块合并输出到一个 bundle.js 文件
      filename: 'bundle.js',
      // 输出文件都放到 dist 目录下
      path: path.resolve(__dirname, './dist'),
    }
  };
  ```

- 由于 Webpack 构建运行在 Node.js 环境下，所以该文件最后需要通过 CommonJS 规范导出一个描述如何构建的 `Object` 对象。

- 此时项目目录如下：

- ```
  |-- index.html
  |-- main.js
  |-- show.js
  |-- webpack.config.js
  ```

- 一切文件就绪，在项目根目录下执行 `webpack` 命令运行 Webpack 构建，你会发现目录下多出一个 `dist` 目录，里面有个 `bundle.js` 文件， `bundle.js` 文件是一个可执行的 JavaScript 文件，它包含页面所依赖的两个模块 `main.js` 和 `show.js` 及内置的 `webpackBootstrap` 启动函数。 这时你用浏览器打开 `index.html` 网页将会看到 `Hello,Webpack`。

- Webpack 是一个打包模块化 JavaScript 的工具，它会从 `main.js` 出发，识别出源码中的模块化导入语句， 递归的寻找出入口文件的所有依赖，把入口和其所有依赖打包到一个单独的文件中。

-  从 Webpack2 开始，已经内置了对 ES6、CommonJS、AMD 模块化语句的支持。

### 1.4 使用Loader

在上一节中使用 Webpack 构建了一个采用 CommonJS 规范的模块化项目，本节将继续优化这个网页的 UI，为项目引入 CSS 代码让文字居中显示，`main.css` 的内容如下：

```css
#app{
  text-align: center;
}
```

Webpack 把一切文件看作模块，CSS 文件也不例外，要引入 `main.css` 需要像引入 JavaScript 文件那样，修改入口文件 `main.js` 如下：

```js
// 通过 CommonJS 规范导入 CSS 模块
require('./main.css');
// 通过 CommonJS 规范导入 show 函数
const show = require('./show.js');
// 执行 show 函数
show('Webpack');
```

但是这样修改后去执行 Webpack 构建是会报错的，因为 Webpack 不原生支持解析 CSS 文件。要支持非 JavaScript 类型的文件，需要使用 Webpack 的 Loader 机制。Webpack的配置修改使用如下：

```js
const path = require('path');

module.exports = {
  // JavaScript 执行入口文件
  entry: './main.js',
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        // 用正则去匹配要用该 loader 转换的 CSS 文件
        test: /\.css$/,
        use: ['style-loader', 'css-loader?minimize'],
      }
    ]
  }
};
```

**Loader 可以看作具有文件转换功能的翻译员，配置里的 `module.rules` 数组配置了一组规则，告诉 Webpack 在遇到哪些文件时使用哪些 Loader 去加载和转换。 如上配置告诉 Webpack 在遇到以 `.css` 结尾的文件时先使用 `css-loader` 读取 CSS 文件，再交给 `style-loader` 把 CSS 内容注入到 JavaScript 里。** 在配置 Loader 时需要注意的是：

- `use` 属性的值需要是一个由 Loader 名称组成的数组，**Loader 的执行顺序是由后到前的；**
- 每一个 Loader 都可以通过 URL querystring 的方式传入参数，例如 `css-loader?minimize` 中的 `minimize` 告诉 `css-loader` 要开启 CSS 压缩。

想知道 Loader 具体支持哪些属性，则需要我们查阅文档，例如 `css-loader` 还有很多用法，我们可以在 [css-loader 主页](https://github.com/webpack-contrib/css-loader) 上查到。

**在重新执行 Webpack 构建前要先安装新引入的 Loader：**

```bash
npm i -D style-loader css-loader
```

安装成功后重新执行构建时，你会发现 `bundle.js` 文件被更新了，里面注入了在 `main.css` 中写的 CSS，而不是会额外生成一个 CSS 文件。 但是重新刷新 `index.html` 网页时将会发现 `Hello,Webpack` 居中了，样式生效了！ 也许你会对此感到奇怪，第一次看到 CSS 被写在了 JavaScript 里！这其实都是 `style-loader` 的功劳，**它的工作原理大概是把 CSS 内容用 JavaScript 里的字符串存储起来， 在网页执行 JavaScript 时通过 DOM 操作动态地往 `HTML head` 标签里插入 `HTML style` 标签。** 也许你认为这样做会导致 JavaScript 文件变大并导致加载网页时间变长，想让 Webpack 单独输出 CSS 文件。下一节 [1-5 使用Plugin](http://webpack.wuhaolin.cn/1入门/1-5使用Plugin.html) 将教你如何通过 Webpack Plugin 机制来实现。

> 本实例 [提供项目完整代码](http://webpack.wuhaolin.cn/1-4使用Loader.zip)

给 Loader 传入属性的方式除了有 querystring 外，还可以通过 Object 传入，以上的 Loader 配置可以修改为如下：

```js
use: [
  'style-loader', 
  {
    loader:'css-loader',
    options:{
      minimize:true,
    }
  }
]
```

除了在 `webpack.config.js` 配置文件中配置 Loader 外，还可以在源码中指定用什么 Loader 去处理文件。 以加载 CSS 文件为例，修改上面例子中的 `main.js` 如下：

```js
require('style-loader!css-loader?minimize!./main.css');
```

这样就能指定对 `./main.css` 这个文件先采用 css-loader 再采用 style-loader 转换。

### 1.5 使用Plugin

概念：Plugin 是用来扩展 Webpack 功能的，通过在构建流程里注入钩子实现，它给 Webpack 带来了很大的灵活性。

通过plugin将css提取到单独的文件而不是一起打包到bundle.js

```
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // JavaScript 执行入口文件
  entry: './main.js',
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js',
    // 把输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        // 用正则去匹配要用该 loader 转换的 CSS 文件
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          // 转换 .css 文件需要使用的 Loader
          use: ['css-loader'],
        }),
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      // 从 .js 文件中提取出来的 .css 文件的名称
      filename: `[name]_[contenthash:8].css`,
    }),
  ]
};
```

要让以上代码运行起来，需要先安装新引入的插件：

```bash
npm i -D extract-text-webpack-plugin
```

安装成功后重新执行构建，你会发现 dist 目录下多出一个 `main_1a87a56a.css` 文件，`bundle.js` 里也没有 CSS 代码了，再把该 CSS 文件引入到 `index.html` 里就完成了。

**从以上代码可以看出， Webpack 是通过 `plugins` 属性来配置需要使用的插件列表的。 `plugins` 属性是一个数组，里面的每一项都是插件的一个实例，在实例化一个组件时可以通过构造函数传入这个组件支持的配置属性。**



### 1.6 使用DevServer

前面的几节只是让 Webpack 正常运行起来了，但在实际开发中你可能会需要：

1. 提供 HTTP 服务而不是使用本地文件预览；
2. 监听文件的变化并自动刷新网页，做到实时预览；
3. 支持 Source Map，以方便调试。

对于这些， Webpack 都为你考虑好了。Webpack 原生支持上述第2、3点内容，再结合官方提供的开发工具 [DevServer](https://webpack.js.org/configuration/dev-server/) 也可以很方便地做到第1点。 DevServer 会启动一个 HTTP 服务器用于服务网页请求，同时会帮助启动 Webpack ，并接收 Webpack 发出的文件更变信号，通过 WebSocket 协议自动刷新网页做到实时预览。

下面为之前的小项目 `Hello,Webpack` 继续集成 DevServer。 首先需要安装 DevServer：

```bash
npm i -D webpack-dev-server
```

安装成功后执行 `webpack-dev-server` 命令， DevServer 就启动了，这时你会看到控制台有一串日志输出：

```
Project is running at http://localhost:8080/
webpack output is served from /
```

这意味着 DevServer 启动的 HTTP 服务器监听在 `http://localhost:8080/` ，DevServer 启动后会一直驻留在后台保持运行，访问这个网址你就能获取项目根目录下的 `index.html`。 用浏览器打开这个地址你会发现页面空白错误原因是 `./dist/bundle.js` 加载404了。 同时你会发现并没有文件输出到 `dist` 目录，原因是 DevServer 会把 Webpack 构建出的文件保存在内存中，在要访问输出的文件时，必须通过 HTTP 服务访问。 由于 DevServer 不会理会 `webpack.config.js` 里配置的 `output.path` 属性，所以要获取 `bundle.js` 的正确 URL 是 `http://localhost:8080/bundle.js`，对应的 `index.html` 应该修改为：

```html
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
<div id="app"></div>
<!--导入 DevServer 输出的 JavaScript 文件-->
<script src="bundle.js"></script>
</body>
</html>
```

#### 1.6.1 实时预览

接着上面的步骤，你可以试试修改 `main.js main.css show.js` 中的任何一个文件，保存后你会发现浏览器会被自动刷新，运行出修改后的效果。

Webpack 在启动时可以开启监听模式，开启监听模式后 Webpack 会监听本地文件系统的变化，发生变化时重新构建出新的结果。Webpack 默认是关闭监听模式的，你可以在启动 Webpack 时通过 `webpack --watch` 来开启监听模式。

通过 DevServer 启动的 Webpack 会开启监听模式，当发生变化时重新执行完构建后通知 DevServer。 DevServer 会让 Webpack 在构建出的 JavaScript 代码里注入一个代理客户端用于控制网页，网页和 DevServer 之间通过 WebSocket 协议通信， 以方便 DevServer 主动向客户端发送命令。 DevServer 在收到来自 Webpack 的文件变化通知时通过注入的客户端控制网页刷新。

**如果尝试修改 `index.html` 文件并保存，你会发现这并不会触发以上机制，导致这个问题的原因是 Webpack 在启动时会以配置里的 `entry` 为入口去递归解析出 `entry` 所依赖的文件，只有 `entry` 本身和依赖的文件才会被 Webpack 添加到监听列表里。 而 `index.html` 文件是脱离了 JavaScript 模块化系统的，所以 Webpack 不知道它的存在。**

#### 1.6.2 模块热替换

除了通过重新刷新整个网页来实现实时预览，DevServer 还有一种被称作模块热替换的刷新技术。 模块热替换能做到在不重新加载整个网页的情况下，通过将被更新过的模块替换老的模块，再重新执行一次来实现实时预览。 模块热替换相对于默认的刷新机制能提供更快的响应和更好的开发体验。 模块热替换默认是关闭的，要开启模块热替换，你只需在启动 DevServer 时带上 `--hot` 参数，重启 DevServer 后再去更新文件就能体验到模块热替换的神奇了。

#### 1.6.3 支持 Source Map

```
Source Map`字面意思就是**原始地图**，当开发环境中的源代码经过压缩，去空格，babel编译转化后，最终可以得到适用于生产环境的项目代码，这样处理后的项目代码和源代码之间差异性很大，当打包出现问题需要我们debug的时候，我们往往都感到很头疼，因为打包后的文件都是压缩到一起的，我们很难找到问题所在，这样严重影响调试效率。为了我们开发过程中debug更方便快捷，我们就要用到Source Maps来定位到开发中的源代码。
 **Source map**就是一个信息文件，里面储存着位置信息，也就是说，转换后的代码的每一个位置，所对应的转换前的位置。当我们在开发中出错的时候，出错工具将直接显示原始代码，而不是转换后的代码，这样使得编译后的代码可读性更高，也更方便快捷调试。
```

Webpack 支持生成 Source Map，只需在启动时带上 `--devtool source-map` 参数。 加上参数重启 DevServer 后刷新页面，再打开 Chrome 浏览器的开发者工具，就可在 Sources 栏中看到可调试的源代码了。

![图1.6.1 在开发者工具中调试 Source Map](http://webpack.wuhaolin.cn/1%E5%85%A5%E9%97%A8/img/1-6source-map.png)

### 1.7 核心概念(重点)

通过之前几节的学习，相信你已经对 Webpack 有了一个初步的认识。虽然Webpack 功能强大且配置项多，但只要你理解了其中的几个核心概念，就能随心应手地使用它。 Webpack 有以下几个核心概念。

- **Entry**：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
- **Module**：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- **Chunk**：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- **Loader**：模块转换器，用于把模块原内容按照需求转换成新内容。
- **Plugin**：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
- **Output**：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。

**Webpack 启动后会从 Entry 里配置的 Module 开始递归解析 Entry 依赖的所有 Module。 每找到一个 Module， 就会根据配置的 Loader 去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。 这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 Chunk。最后 Webpack 会把所有 Chunk 转换成文件输出。 在整个流程中 Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。**

在实际应用中你可能会遇到各种奇怪复杂的场景，不知道从哪开始。 根据以上总结，你会对 Webpack 有一个整体的认识，这能让你在以后使用 Webpack 的过程中快速知道应该通过配置什么去完成你想要的功能，而不是无从下手。

