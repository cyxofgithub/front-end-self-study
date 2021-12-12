# 新手指南

## Egg.js 是什么

![image-20211113171827738](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20211113171827738.png)

egg.js 是一个**基于 Node 和 Koa** 的框架，它**为企业级框架和应用而生的**。

### Egg.js 设计原则

- 没有固定的技术选型，固定的技术选型会使框架的扩展性变差，无法满足各种定制需求。
- Egg 的插件机制有很高的可扩展性，**一个插件只做一件事**（比如 [Nunjucks](https://mozilla.github.io/nunjucks) 模板封装成了 [egg-view-nunjucks](https://github.com/eggjs/egg-view-nunjucks)、MySQL 数据库封装成了 [egg-mysql](https://github.com/eggjs/egg-mysql)）。
- Egg 奉行『**约定优于配置**』，按照[一套统一的约定](https://eggjs.org/zh-cn/advanced/loader.html)进行应用开发。
- 约定不等于扩展性差，相反 Egg 有很高的扩展性，可以按照团队的约定定制框架。使用 [Loader](https://eggjs.org/zh-cn/advanced/loader.html) 可以让框架根据不同环境定义默认配置，还可以覆盖 Egg 的默认约定。

### 与社区框架的差异

- Express
  - 简单且扩展性强，非常适合做个人项目。但框架本身缺少约定，标准的 MVC 模型会有各种千奇百怪的写法。**而Egg 按照约定进行开发，奉行『约定优于配置』，团队协作成本低。**
- Sails
  - [Sails](http://sailsjs.com/) 是和 Egg 一样奉行『约定优于配置』的框架，扩展性也非常好。但是相比 Egg，[Sails](http://sailsjs.com/) 支持 Blueprint REST API、[WaterLine](https://github.com/balderdashy/waterline) 这样可扩展的 ORM、前端集成、WebSocket 等，但这些功能都是由 [Sails](http://sailsjs.com/) 提供的。**而 Egg 不直接提供功能，只是集成各种功能插件，比如实现 egg-blueprint，egg-waterline 等这样的插件，再使用 sails-egg 框架整合这些插件就可以替代 [Sails](http://sailsjs.com/) 了。**

### Egg.js 特性

- 提供基于 Egg [定制上层框架](https://eggjs.org/zh-cn/advanced/framework.html)的能力
- 高度可扩展的[插件机制](https://eggjs.org/zh-cn/basics/plugin.html)
- 内置[多进程管理](https://eggjs.org/zh-cn/advanced/cluster-client.html)
- 基于 [Koa](http://koajs.com/) 开发，性能优异
- 框架稳定，测试覆盖率高
- [渐进式开发](https://eggjs.org/zh-cn/tutorials/progressive.html)

## Egg.js 与 Koa

### Koa

> [Koa](https://koajs.com/) 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。

#### Middleware

Koa 的中间件和 Express 不同，**Koa 选择了洋葱圈模型。**

- **中间件洋葱图**：

![img](https://camo.githubusercontent.com/d80cf3b511ef4898bcde9a464de491fa15a50d06/68747470733a2f2f7261772e6769746875622e636f6d2f66656e676d6b322f6b6f612d67756964652f6d61737465722f6f6e696f6e2e706e67)

- 中间件执行顺序图：

![img](https://raw.githubusercontent.com/koajs/koa/a7b6ed0529a58112bac4171e4729b8760a34ab8b/docs/middleware.gif)

所有的请求经过一个中间件的时候都会执行两次，对比 Express 形式的中间件，Koa 的模型可以非常方便的实现后置处理逻辑，对比 Koa 和 Express 的 Compress 中间件就可以明显的感受到 Koa 中间件模型的优势。

- [koa-compress](https://github.com/koajs/compress/blob/master/lib/index.js) for Koa.
- [compression](https://github.com/expressjs/compression/blob/master/index.js) for Express.

#### Context

和 Express 只有 Request 和 Response 两个对象不同，**Koa 增加了一个 Context 的对象，作为这次请求的上下文对象**（在 Koa 1 中为中间件的 `this`，在 Koa 2 中作为中间件的第一个参数传入）。我们可以将一次请求相关的上下文都挂载到这个对象上。

同时 **Context 上也挂载了 Request 和 Response 两个对象**。和 Express 类似，这两个对象都提供了大量的便捷方法辅助开发，例如

- `get request.query`
- `get request.hostname`
- `set response.body`
- `set response.status`

#### 异常处理

通过同步方式编写异步代码带来的另外一个非常大的好处就是异常处理非常自然，使用 `try catch` 就可以将按照规范编写的代码中的所有错误都捕获到。这样我们可以很便捷的编写一个自定义的错误处理中间件。

```js
async function onerror(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.app.emit('error', err);
    ctx.body = 'server error';
    ctx.status = err.status || 500;
  }
}
```

只需要将这个中间件放在其他中间件之前，就可以捕获它们所有的同步或者异步代码中抛出的异常了。（**从中间件执行顺序图就可以看出，第一个中间件的逻辑代码最后一个执行，我们可以利用这个特性在其余的中间件都执行完毕后去捕获错误**）

### Egg 继承于 Koa

如上述，Koa 是一个非常优秀的框架，然而对于企业级应用来说，它还比较基础。

而 Egg 选择了 Koa 作为其基础框架，在它的模型基础上，进一步对它进行了一些增强。

#### 扩展

在基于 Egg 的框架或者应用中，我们可以通过定义 `app/extend/{application,context,request,response}.js` 来扩展 Koa 中对应的四个对象的原型，通过这个功能，我们可以快速的增加更多的辅助方法，例如我们在 `app/extend/context.js` 中写入下列代码：

```js
// app/extend/context.js
module.exports = {
  get isIOS() {
    const iosReg = /iphone|ipad|ipod/i;
    return iosReg.test(this.get('user-agent'));
  },
};
```

在 Controller 中，我们就可以使用到刚才定义的这个便捷属性了：

```js
// app/controller/home.js
exports.handler = ctx => {
  ctx.body = ctx.isIOS
    ? 'Your operating system is iOS.'
    : 'Your operating system is not iOS.';
};
```

更多关于扩展的内容，请查看[扩展](https://eggjs.org/zh-cn/basics/extend.html)章节。

#### 插件

众所周知，在 Express 和 Koa 中，经常会引入许许多多的中间件来提供各种各样的功能，例如引入 [koa-session](https://github.com/koajs/session) 提供 Session 的支持，引入 [koa-bodyparser](https://github.com/koajs/bodyparser) 来解析请求 body。而 **Egg 提供了一个更加强大的插件机制，让这些独立领域的功能模块可以更加容易编写**。

一个插件可以包含

- extend：扩展基础对象的上下文，提供各种工具类、属性。
- middleware：增加一个或多个中间件，提供请求的前置、后置处理逻辑。
- config：配置各个环境下插件自身的默认配置项。

一个独立领域下的插件实现，可以在代码维护性非常高的情况下实现非常完善的功能，而插件也支持配置各个环境下的默认（最佳）配置，让我们使用插件的时候几乎可以不需要修改配置项。

[egg-security](https://github.com/eggjs/egg-security) 插件就是一个典型的例子。

更多关于插件的内容，请查看[插件](https://eggjs.org/zh-cn/basics/plugin.html)章节。

#### Egg 与 Koa 的版本关系

##### Egg 1.x

Egg 1.x 发布时，Node.js 的 LTS 版本尚不支持 async function，所以 Egg 1.x 仍然基于 Koa 1.x 开发，但是在此基础上，Egg 全面增加了 async function 的支持，再加上 Egg 对 Koa 2.x 的中间件也完全兼容，应用层代码可以完全基于 `async function` 来开发。

- 底层基于 Koa 1.x，异步解决方案基于 [co](https://github.com/tj/co) 封装的 generator function。
- 官方插件以及 Egg 核心使用 generator function 编写，保持对 Node.js LTS 版本的支持，在必要处通过 co 包装以兼容在 async function 中的使用。
- 应用开发者可以选择 async function（Node.js 8.x+） 或者 generator function（Node.js 6.x+）进行编写。

##### Egg 2.x

Node.js 8 正式进入 LTS 后，async function 可以在 Node.js 中使用并且没有任何性能问题了，Egg 2.x 基于 Koa 2.x，框架底层以及所有内置插件都使用 async function 编写，并保持了对 Egg 1.x 以及 generator function 的完全兼容，应用层只需要升级到 Node.js 8 即可从 Egg 1.x 迁移到 Egg 2.x。

- **底层基于 Koa 2.x，异步解决方案基于 async function。**
- **官方插件以及 Egg 核心使用 async function 编写。**
- **建议业务层迁移到 async function 方案**。
- **只支持 Node.js 8 及以上的版本。**

## 快速入门

### 环境准备

- 操作系统：支持 macOS，Linux，Windows
- 运行环境：建议选择 [LTS 版本](http://nodejs.org/)，最低要求 8.x。
- 注：LTS 版本指的是 node.js 稳定版，而不是最新版

### 快速初始化

我们推荐直接使用脚手架，只需几条简单指令，即可快速生成项目（`npm >=6.1.0`）:

```
$ mkdir egg-example && cd egg-example // 这一条是创建目录和进入目录和初始化没啥关系，自己创建个文件夹也行
$ npm init egg --type=simple
$ npm i
```

启动项目:

```
$ npm run dev
$ open http://localhost:7001
```

### 逐步搭建

通常你可以通过上一节的方式，使用 `npm init egg` 快速选择适合对应业务模型的脚手架，快速启动 Egg.js 项目的开发。

但为了让大家更好的了解 Egg.js，接下来，我们将跳过脚手架，手动一步步的搭建出一个 [Hacker News](https://github.com/eggjs/examples/tree/master/hackernews)。

**注意：实际项目中，我们推荐使用上一节的脚手架直接初始化。**

#### 初始化项目

先来初始化下目录结构：

```
$ mkdir egg-example
$ cd egg-example
$ npm init
$ npm i egg --save
$ npm i egg-bin --save-dev
```

添加 `npm scripts` 到 `package.json`：

```
{
  "name": "egg-example",
  "scripts": {
    "dev": "egg-bin dev"
  }
}
```

#### 编写 Controller

如果你熟悉 Web 开发或 MVC，肯定猜到我们第一步需要编写的是 [Controller](https://eggjs.org/zh-cn/basics/controller.html) 和 [Router](https://eggjs.org/zh-cn/basics/router.html)。

```js
// app/controller/home.js
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'Hello world';
  }
}

module.exports = HomeController;
```

配置路由映射：

```js
// app/router.js
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
};
```

加一个[配置文件](https://eggjs.org/zh-cn/basics/config.html)：

```js
// config/config.default.js
exports.keys = <此处改为你自己的 Cookie 安全字符串>;
```

此时目录结构如下：

```
egg-example
├── app
│   ├── controller
│   │   └── home.js
│   └── router.js
├── config
│   └── config.default.js
└── package.json
```

完整的目录结构规范参见[目录结构](https://eggjs.org/zh-cn/basics/structure.html)。

好，现在可以启动应用来体验下

```
$ npm run dev
$ open http://localhost:7001
```

> 注意：
>
> - Controller 有 `class` 和 `exports` 两种编写方式，本文示范的是前者，你可能需要参考 [Controller](https://eggjs.org/zh-cn/basics/controller.html) 文档。
> - Config 也有 `module.exports` 和 `exports` 的写法，具体参考 [Node.js modules 文档](https://nodejs.org/api/modules.html#modules_exports_shortcut)。

####  静态资源

Egg 内置了 [static](https://github.com/eggjs/egg-static) 插件，**线上环境建议部署到 CDN**，无需该插件。

static 插件默认映射 `/public/* -> app/public/*` 目录

此处，我们把静态资源都放到 `app/public` 目录即可：

```
app/public
├── css
│   └── news.css
└── js
    ├── lib.js
    └── news.js
```

####  模板渲染

绝大多数情况，我们都需要读取数据后渲染模板，然后呈现给用户。故我们需要引入对应的模板引擎。

框架并不强制你使用某种模板引擎，只是约定了 [View 插件开发规范](https://eggjs.org/zh-cn/advanced/view-plugin.html)，开发者可以引入不同的插件来实现差异化定制。

更多用法参见 [View](https://eggjs.org/zh-cn/core/view.html)。

在本例中，我们使用 [Nunjucks](https://mozilla.github.io/nunjucks/) 来渲染，先安装对应的插件 [egg-view-nunjucks](https://github.com/eggjs/egg-view-nunjucks) ：

```
$ npm i egg-view-nunjucks --save
```

开启插件：

```js
// config/plugin.js
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks'
};
// config/config.default.js
exports.keys = <此处改为你自己的 Cookie 安全字符串>;
// 添加 view 配置
exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.tpl': 'nunjucks',
  },
};
```

**注意：是 `config` 目录，不是 `app/config`!**

为列表页编写模板文件，一般放置在 `app/view` 目录下

```html
<!-- app/view/news/list.tpl -->
<html>
  <head>
    <title>Hacker News</title>
    <link rel="stylesheet" href="/public/css/news.css" />
  </head>
  <body>
    <ul class="news-view view">
      {% for item in list %}
        <li class="item">
          <a href="{{ item.url }}">{{ item.title }}</a>
        </li>
      {% endfor %}
    </ul>
  </body>
</html>
```

添加 Controller 和 Router

```js
// app/controller/news.js
const Controller = require('egg').Controller;

class NewsController extends Controller {
  async list() {
    const dataList = {
      list: [
        { id: 1, title: 'this is news 1', url: '/news/1' },
        { id: 2, title: 'this is news 2', url: '/news/2' }
      ]
    };
    await this.ctx.render('news/list.tpl', dataList);
  }
}

module.exports = NewsController;

// app/router.js
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/news', controller.news.list);
};
```

启动浏览器，访问 http://localhost:7001/news 即可看到渲染后的页面。

**提示：开发期默认开启了 [development](https://github.com/eggjs/egg-development) 插件，修改后端代码后，会自动重启 Worker 进程。**

#### 编写 service

在实际应用中，Controller 一般不会自己产出数据，也不会包含复杂的逻辑，复杂的过程应抽象为业务逻辑层 [Service](https://eggjs.org/zh-cn/basics/service.html)。

我们来添加一个 Service 抓取 [Hacker News](https://github.com/HackerNews/API) 的数据 ，如下：

```js
// app/service/news.js
const Service = require('egg').Service;

class NewsService extends Service {
  async list(page = 1) {
    // read config
    const { serverUrl, pageSize } = this.config.news;

    // use build-in http client to GET hacker-news api
    const { data: idList } = await this.ctx.curl(`${serverUrl}/topstories.json`, {
      data: {
        orderBy: '"$key"',
        startAt: `"${pageSize * (page - 1)}"`,
        endAt: `"${pageSize * page - 1}"`,
      },
      dataType: 'json',
    });

    // parallel GET detail
    const newsList = await Promise.all(
      Object.keys(idList).map(key => {
        const url = `${serverUrl}/item/${idList[key]}.json`;
        return this.ctx.curl(url, { dataType: 'json' });
      })
    );
    return newsList.map(res => res.data);
  }
}

module.exports = NewsService;
```

> 框架提供了内置的 [HttpClient](https://eggjs.org/zh-cn/core/httpclient.html) 来方便开发者使用 HTTP 请求。

然后稍微修改下之前的 Controller：

```js
// app/controller/news.js
const Controller = require('egg').Controller;

class NewsController extends Controller {
  async list() {
    const ctx = this.ctx;
    const page = ctx.query.page || 1;
    const newsList = await ctx.service.news.list(page);
    await ctx.render('news/list.tpl', { list: newsList });
  }
}

module.exports = NewsController;
```

还需增加 `app/service/news.js` 中读取到的配置：

```js
// config/config.default.js
// 添加 news 的配置项
exports.news = {
  pageSize: 5,
  serverUrl: 'https://hacker-news.firebaseio.com/v0',
};
```

####  编写扩展

遇到一个小问题，我们的资讯时间的数据是 UnixTime 格式的，我们希望显示为便于阅读的格式。

框架提供了一种快速扩展的方式，只需在 `app/extend` 目录下提供扩展脚本即可，具体参见[扩展](https://eggjs.org/zh-cn/basics/extend.html)。

在这里，我们可以使用 View 插件支持的 Helper 来实现：

```js
$ npm i moment --save
// app/extend/helper.js
const moment = require('moment');
exports.relativeTime = time => moment(new Date(time * 1000)).fromNow();
```

在模板里面使用：

```html
<!-- app/view/news/list.tpl -->
{{ helper.relativeTime(item.time) }}
```

#### 编写 Middleware

假设有个需求：我们的新闻站点，禁止百度爬虫访问。

聪明的同学们一定很快能想到可以通过 [Middleware](https://eggjs.org/zh-cn/basics/middleware.html) 判断 User-Agent，如下：

```js
// app/middleware/robot.js
// options === app.config.robot
module.exports = (options, app) => {
  return async function robotMiddleware(ctx, next) {
    const source = ctx.get('user-agent') || '';
    const match = options.ua.some(ua => ua.test(source));
    if (match) {
      ctx.status = 403;
      ctx.message = 'Go away, robot.';
    } else {
      await next();
    }
  }
};

// config/config.default.js
// add middleware robot
exports.middleware = [
  'robot'
];
// robot's configurations
exports.robot = {
  ua: [
    /Baiduspider/i,
  ]
};
```

现在可以使用 `curl http://localhost:7001/news -A "Baiduspider"` 看看效果。

更多参见[中间件](https://eggjs.org/zh-cn/basics/middleware.html)文档。

#### 配置文件

写业务的时候，不可避免的需要有配置文件，框架提供了强大的配置合并管理功能：

- 支持按环境变量加载不同的配置文件，如 `config.local.js`， `config.prod.js` 等等。
- 应用/插件/框架都可以配置自己的配置文件，框架将按顺序合并加载。
- 具体合并逻辑可参见[配置文件](https://eggjs.org/zh-cn/basics/config.html#配置加载顺序)。

```js
// config/config.default.js
exports.robot = {
  ua: [
    /curl/i,
    /Baiduspider/i,
  ],
};

// config/config.local.js
// only read at development mode, will override default
exports.robot = {
  ua: [
    /Baiduspider/i,
  ],
};

// app/service/some.js
const Service = require('egg').Service;

class SomeService extends Service {
  async list() {
    const rule = this.config.robot.ua;
  }
}

module.exports = SomeService;
```

#### 单元测试

单元测试非常重要，框架也提供了 [egg-bin](https://github.com/eggjs/egg-bin) 来帮开发者无痛的编写测试。

测试文件应该放在项目根目录下的 test 目录下，并以 `test.js` 为后缀名，即 `{app_root}/test/**/*.test.js`。

```js
// test/app/middleware/robot.test.js
const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/middleware/robot.test.js', () => {
  it('should block robot', () => {
    return app.httpRequest()
      .get('/')
      .set('User-Agent', "Baiduspider")
      .expect(403);
  });
});
```

然后配置依赖和 `npm scripts`：

```
{
  "scripts": {
    "test": "egg-bin test",
    "cov": "egg-bin cov"
  }
}
$ npm i egg-mock --save-dev
```

执行测试：

```
$ npm test
```

就这么简单，更多请参见 [单元测试](https://eggjs.org/zh-cn/core/unittest.html)。

#### 后记

短短几章内容，只能讲 Egg 的冰山一角，我们建议开发者继续阅读其他章节：

- 关于骨架类型，参见[骨架说明](https://eggjs.org/zh-cn/tutorials/index.html)
- 提供了强大的扩展机制，参见[插件](https://eggjs.org/zh-cn/basics/plugin.html)。
- 一个大规模的团队需要遵循一定的约束和约定，在 Egg 里我们建议封装适合自己团队的上层框架，参见 [框架开发](https://eggjs.org/zh-cn/advanced/framework.html)。
- 这是一个渐进式的框架，代码的共建，复用和下沉，竟然可以这么的无痛，建议阅读 [渐进式开发](https://eggjs.org/zh-cn/tutorials/progressive.html)。
- 写单元测试其实很简单的事，Egg 也提供了非常多的配套辅助，我们强烈建议大家测试驱动开发，具体参见 [单元测试](https://eggjs.org/zh-cn/core/unittest.html)。

## 渐进式开发（需要沉淀）

在 Egg 里面，有[插件](https://eggjs.org/zh-cn/basics/plugin.html)，也有[框架](https://eggjs.org/zh-cn/advanced/framework.html)，前者还包括了 `path` 和 `package` 两种加载模式，那我们应该如何选择呢？

本文将以实例的方式，一步步给大家演示下，如何渐进式地进行代码演进。

全部的示例代码可以参见 [eggjs/examples/progressive](https://github.com/eggjs/examples/tree/master/progressive)。

### 最初始的状态

假设我们有一段分析 UA 的代码，实现以下功能：

- `ctx.isAndroid`
- `ctx.isIOS`

通过之前的教程，大家一定可以很快地写出来，我们快速回顾下：

对应的代码参见 [step1](https://github.com/eggjs/examples/tree/master/progressive/step1)。

目录结构：

```
example-app
├── app
│   ├── extend
│   │   └── context.js
│   └── router.js
├── test
│   └── index.test.js
└── package.json
```

核心代码：

```
// app/extend/context.js
module.exports = {
  get isIOS() {
    const iosReg = /iphone|ipad|ipod/i;
    return iosReg.test(this.get('user-agent'));
  },
};
```

### 插件的雏形

我们很明显能感知到，这段逻辑是具备通用性的，可以写成插件。

但一开始的时候，功能还没完善，直接独立插件，维护起来比较麻烦。

此时，我们可以把代码写成插件的形式，但并不独立出去。

对应的代码参见 [step2](https://github.com/eggjs/examples/tree/master/progressive/step2)。

新的目录结构：

```
example-app
├── app
│   └── router.js
├── config
│   └── plugin.js
├── lib
│   └── plugin
│       └── egg-ua
│           ├── app
│           │   └── extend
│           │       └── context.js
│           └── package.json
├── test
│   └── index.test.js
└── package.json
```

核心代码：

- `app/extend/context.js` 移动到 `lib/plugin/egg-ua/app/extend/context.js`。
- `lib/plugin/egg-ua/package.json` 声明插件。

```
{
  "eggPlugin": {
    "name": "ua"
  }
}
```

- `config/plugin.js` 中通过 `path` 来挂载插件。

```
// config/plugin.js
const path = require('path');
exports.ua = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-ua'),
};
```

### 抽成独立插件

经过一段时间开发后，该模块的功能成熟，此时可以考虑抽出来成为独立的插件。

首先，我们抽出一个 egg-ua 插件，看过[插件文档](https://eggjs.org/zh-cn/advanced/plugin.html)的同学应该都比较熟悉，我们这里只简单过一下：

目录结构：

```
egg-ua
├── app
│   └── extend
│       └── context.js
├── test
│   ├── fixtures
│   │   └── test-app
│   │       ├── app
│   │       │   └── router.js
│   │       └── package.json
│   └── ua.test.js
└── package.json
```

对应的代码参见 [step3/egg-ua](https://github.com/eggjs/examples/tree/master/progressive/step3/egg-ua)。

然后改造原有的应用，对应的代码参见 [step3/example-app](https://github.com/eggjs/examples/tree/master/progressive/step3/example-app)。

- 移除 `lib/plugin/egg-ua` 目录。
- `package.json` 中声明对 `egg-ua` 的依赖。
- `config/plugin.js` 中修改依赖声明为 `package` 方式。

```
// config/plugin.js
exports.ua = {
  enable: true,
  package: 'egg-ua',
};
```

**注意：在插件还没发布前，可以通过 `npm link` 的方式进行本地测试，具体参见 [npm-link](https://docs.npmjs.com/cli/link)。**

```
$ cd example-app
$ npm link ../egg-ua
$ npm i
$ npm test
```

### 沉淀到框架

重复上述的过程，很快我们会积累了好几个插件和配置，并且我们会发现，在团队的大部分项目中，都会用到这些插件。

此时，就可以考虑抽象出一个适合团队业务场景的框架。

首先，抽象出 example-framework 框架，如上看过[框架文档](https://eggjs.org/zh-cn/advanced/framework.html)的同学应该都比较熟悉，我们这里只简单过一下：

目录结构：

```
example-framework
├── config
│   ├── config.default.js
│   └── plugin.js
├── lib
│   ├── agent.js
│   └── application.js
├── test
│   ├── fixtures
│   │   └── test-app
│   └── framework.test.js
├── README.md
├── index.js
└── package.json
```

- 对应的代码参见 [example-framework](https://github.com/eggjs/examples/tree/master/progressive/step4/example-framework)。
- 把原来的 `egg-ua` 等插件的依赖，从 example-app 中移除，配置到该框架的 `package.json` 和 `config/plugin.js` 中。

然后改造原有的应用，对应的代码参见 [step4/example-app](https://github.com/eggjs/examples/tree/master/progressive/step4/example-app)。

- 移除 `config/plugin.js` 中对 `egg-ua` 的依赖。
- `package.json` 中移除对 `egg-ua` 的依赖。
- `package.json` 中声明对 `example-framework` 的依赖，并配置 `egg.framework`。

```
{
  "name": "progressive",
  "version": "1.0.0",
  "private": true,
  "egg": {
    "framework": "example-framework"
  },
  "dependencies": {
    "example-framework": "*"
  }
}
```

**注意：在框架还没发布前，可以通过 `npm link` 的方式进行本地测试，具体参见 [npm-link](https://docs.npmjs.com/cli/link)。**

```
$ cd example-app
$ npm link ../egg-framework
$ npm i
$ npm test
```

### 写在最后

综上所述，大家可以看到我们是如何一步步渐进地去进行框架演进，这得益于 Egg 强大的插件机制、代码的共建，以及复用和下沉，这些步骤竟然可以这么地无痛来得以完成！

- 一般来说，当应用中有可能会复用到的代码时，直接放到 `lib/plugin` 目录去，如例子中的 `egg-ua`。
- 当该插件功能稳定后，即可独立出来作为一个 `node module` 。
- 如此以往，应用中相对复用性较强的代码都会逐渐独立为单独的插件。
- 当你的应用逐渐进化到针对某类业务场景的解决方案时，将其抽象为独立的 framework 进行发布。
- 当在新项目中抽象出的插件，下沉集成到框架后，其他项目只需要简单的重新 `npm install` 下就可以使用上，对整个团队的效率有极大的提升。
- **注意：不管是应用/插件/框架，都必须编写单元测试，并尽量实现 100% 覆盖率。**

# 基础功能

## 目录结构

在[快速入门](https://eggjs.org/zh-cn/intro/quickstart.html)中，大家对框架应该有了初步的印象，接下来我们简单了解下目录约定规范。

```
egg-project
├── package.json
├── app.js (可选)
├── agent.js (可选)
├── app
|   ├── router.js
│   ├── controller
│   |   └── home.js
│   ├── service (可选)
│   |   └── user.js
│   ├── middleware (可选)
│   |   └── response_time.js
│   ├── schedule (可选)
│   |   └── my_task.js
│   ├── public (可选)
│   |   └── reset.css
│   ├── view (可选)
│   |   └── home.tpl
│   └── extend (可选)
│       ├── helper.js (可选)
│       ├── request.js (可选)
│       ├── response.js (可选)
│       ├── context.js (可选)
│       ├── application.js (可选)
│       └── agent.js (可选)
├── config
|   ├── plugin.js
|   ├── config.default.js
│   ├── config.prod.js
|   ├── config.test.js (可选)
|   ├── config.local.js (可选)
|   └── config.unittest.js (可选)
└── test
    ├── middleware
    |   └── response_time.test.js
    └── controller
        └── home.test.js
```

如上，由框架约定的目录：

- `app/router.js` 用于配置 URL 路由规则，具体参见 [Router](https://eggjs.org/zh-cn/basics/router.html)。
- `app/controller/**` 用于解析用户的输入，处理后返回相应的结果，具体参见 [Controller](https://eggjs.org/zh-cn/basics/controller.html)。
- `app/service/**` 用于编写业务逻辑层，可选，建议使用，具体参见 [Service](https://eggjs.org/zh-cn/basics/service.html)。
- `app/middleware/**` 用于编写中间件，可选，具体参见 [Middleware](https://eggjs.org/zh-cn/basics/middleware.html)。
- `app/public/**` 用于放置静态资源，可选，具体参见内置插件 [egg-static](https://github.com/eggjs/egg-static)。
- `app/extend/**` 用于框架的扩展，可选，具体参见[框架扩展](https://eggjs.org/zh-cn/basics/extend.html)。
- `config/config.{env}.js` 用于编写配置文件，具体参见[配置](https://eggjs.org/zh-cn/basics/config.html)。
- `config/plugin.js` 用于配置需要加载的插件，具体参见[插件](https://eggjs.org/zh-cn/basics/plugin.html)。
- `test/**` 用于单元测试，具体参见[单元测试](https://eggjs.org/zh-cn/core/unittest.html)。
- `app.js` 和 `agent.js` 用于自定义启动时的初始化工作，可选，具体参见[启动自定义](https://eggjs.org/zh-cn/basics/app-start.html)。关于`agent.js`的作用参见[Agent机制](https://eggjs.org/zh-cn/core/cluster-and-ipc.html#agent-机制)。

由内置插件约定的目录：

- `app/public/**` 用于放置静态资源，可选，具体参见内置插件 [egg-static](https://github.com/eggjs/egg-static)。
- `app/schedule/**` 用于定时任务，可选，具体参见[定时任务](https://eggjs.org/zh-cn/basics/schedule.html)。

**若需自定义自己的目录规范，参见 [Loader API](https://eggjs.org/zh-cn/advanced/loader.html)**

- `app/view/**` 用于放置模板文件，可选，由模板插件约定，具体参见[模板渲染](https://eggjs.org/zh-cn/core/view.html)。
- `app/model/**` 用于放置领域模型，可选，由领域类相关插件约定，如 [egg-sequelize](https://github.com/eggjs/egg-sequelize)。

## 框架内置基础对象

在本章，我们会初步介绍一下框架中内置的一些基础对象，包括从 [Koa](http://koajs.com/) 继承而来的 4 个对象（Application, Context, Request, Response) 以及框架扩展的一些对象（Controller, Service, Helper, Config, Logger），在后续的文档阅读中我们会经常遇到它们。

### Application

Application 是全局应用对象，在一个应用中，只会实例化一个，它继承自 [Koa.Application](http://koajs.com/#application)，在它上面我们可以挂载一些全局的方法和对象。我们可以轻松的在插件或者应用中[扩展 Application 对象](https://eggjs.org/zh-cn/basics/extend.html#Application)。

#### 事件

在框架运行时，会在 Application 实例上触发一些事件，应用开发者或者插件开发者可以监听这些事件做一些操作。作为应用开发者，我们一般会在[启动自定义脚本](https://eggjs.org/zh-cn/basics/app-start.html)中进行监听。

- `server`: 该事件一个 worker 进程只会触发一次，在 HTTP 服务完成启动后，会将 HTTP server 通过这个事件暴露出来给开发者。
- `error`: 运行时有任何的异常被 onerror 插件捕获后，都会触发 `error` 事件，将错误对象和关联的上下文（如果有）暴露给开发者，可以进行自定义的日志记录上报等处理。
- `request` 和 `response`: 应用收到请求和响应请求时，分别会触发 `request` 和 `response` 事件，并将当前请求上下文暴露出来，开发者可以监听这两个事件来进行日志记录。

```js
// app.js

module.exports = app => {
  app.once('server', server => {
    // websocket
  });
  app.on('error', (err, ctx) => {
    // report error
  });
  app.on('request', ctx => {
    // log receive request
  });
  app.on('response', ctx => {
    // ctx.starttime is set by framework
    const used = Date.now() - ctx.starttime;
    // log total cost
  });
};
```

#### 获取方式

Application 对象几乎可以在编写应用时的任何一个地方获取到，下面介绍几个经常用到的获取方式：

几乎所有被框架 [Loader](https://eggjs.org/zh-cn/advanced/loader.html) 加载的文件（Controller，Service，Schedule 等），都可以 export 一个函数，这个函数会被 Loader 调用，并使用 app 作为参数：

- [启动自定义脚本](https://eggjs.org/zh-cn/basics/app-start.html)

  ```js
  // app.js
  module.exports = app => {
    app.cache = new Cache();
  };
  ```

- [Controller 文件](https://eggjs.org/zh-cn/basics/controller.html)

  ```js
  // app/controller/user.js
  class UserController extends Controller {
    async fetch() {
      this.ctx.body = this.app.cache.get(this.ctx.query.id);
    }
  }
  ```

和 [Koa](http://koajs.com/) 一样，在 Context 对象上，可以通过 `ctx.app` 访问到 Application 对象。以上面的 Controller 文件举例：

```js
// app/controller/user.js
class UserController extends Controller {
  async fetch() {
    this.ctx.body = this.ctx.app.cache.get(this.ctx.query.id);
  }
}
```

在继承于 Controller, Service 基类的实例中，可以通过 `this.app` 访问到 Application 对象。

```js
// app/controller/user.js
class UserController extends Controller {
  async fetch() {
    this.ctx.body = this.app.cache.get(this.ctx.query.id);
  }
};
```

### Context

Context 是一个**请求级别的对象**，继承自 [Koa.Context](http://koajs.com/#context)。**在每一次收到用户请求时，框架会实例化一个 Context 对象，这个对象封装了这次用户请求的信息，并提供了许多便捷的方法来获取请求参数或者设置响应信息。**框架会将所有的 [Service](https://eggjs.org/zh-cn/basics/service.html) 挂载到 Context 实例上，一些插件也会将一些其他的方法和对象挂载到它上面（[egg-sequelize](https://github.com/eggjs/egg-sequelize) 会将所有的 model 挂载在 Context 上）。

#### 获取方式

最常见的 Context 实例获取方式是在 [Middleware](https://eggjs.org/zh-cn/basics/middleware.html), [Controller](https://eggjs.org/zh-cn/basics/controller.html) 以及 [Service](https://eggjs.org/zh-cn/basics/service.html) 中。Controller 中的获取方式在上面的例子中已经展示过了，在 Service 中获取和 Controller 中获取的方式一样，在 Middleware 中获取 Context 实例则和 [Koa](http://koajs.com/) 框架在中间件中获取 Context 对象的方式一致。

框架的 [Middleware](https://eggjs.org/zh-cn/basics/middleware.html) 同时支持 Koa v1 和 Koa v2 两种不同的中间件写法，根据不同的写法，获取 Context 实例的方式也稍有不同：

```js
// Koa v1
function* middleware(next) {
  // this is instance of Context
  console.log(this.query);
  yield next;
}

// Koa v2
async function middleware(ctx, next) {
  // ctx is instance of Context
  console.log(ctx.query);
}
```

除了在请求时可以获取 Context 实例之外， **在有些非用户请求的场景下我们需要访问 service / model 等 Context 实例上的对象，我们可以通过 `Application.createAnonymousContext()` 方法创建一个匿名 Context 实例**：

```js
// app.js
module.exports = app => {
  app.beforeStart(async () => {
    const ctx = app.createAnonymousContext();
    // preload before app start
    await ctx.service.posts.load();
  });
}
```

在[定时任务](https://eggjs.org/zh-cn/basics/schedule.html)中的每一个 task 都接受一个 Context 实例作为参数，以便我们更方便的执行一些定时的业务逻辑：

```js
// app/schedule/refresh.js
exports.task = async ctx => {
  await ctx.service.posts.refresh();
};
```

### Request & Response

Request 是一个**请求级别的对象**，继承自 [Koa.Request](http://koajs.com/#request)。封装了 Node.js 原生的 HTTP Request 对象，提供了一系列辅助方法获取 HTTP 请求常用参数。

Response 是一个**请求级别的对象**，继承自 [Koa.Response](http://koajs.com/#response)。封装了 Node.js 原生的 HTTP Response 对象，提供了一系列辅助方法设置 HTTP 响应。

#### 获取方式

可以在 Context 的实例上获取到当前请求的 Request(`ctx.request`) 和 Response(`ctx.response`) 实例。

```js
// app/controller/user.js
class UserController extends Controller {
  async fetch() {
    const { app, ctx } = this;
    const id = ctx.request.query.id;
    ctx.response.body = app.cache.get(id);
  }
}
```

- [Koa](http://koajs.com/) 会在 Context 上代理一部分 Request 和 Response 上的方法和属性，参见 [Koa.Context](http://koajs.com/#context)。
- 如上面例子中的 `ctx.request.query.id` 和 `ctx.query.id` 是等价的，`ctx.response.body=` 和 `ctx.body=` 是等价的。
- 需要注意的是，获取 POST 的 body 应该使用 `ctx.request.body`，而不是 `ctx.body`。

### Controller

框架提供了一个 Controller 基类，并推荐所有的 [Controller](https://eggjs.org/zh-cn/basics/controller.html) 都继承于该基类实现。这个 Controller 基类有下列属性：

- `ctx` - 当前请求的 [Context](https://eggjs.org/zh-cn/basics/objects.html#context) 实例。
- `app` - 应用的 [Application](https://eggjs.org/zh-cn/basics/objects.html#application) 实例。
- `config` - 应用的[配置](https://eggjs.org/zh-cn/basics/config.html)。
- `service` - 应用所有的 [service](https://eggjs.org/zh-cn/basics/service.html)。
- `logger` - 为当前 controller 封装的 logger 对象。

在 Controller 文件中，可以通过两种方式来引用 Controller 基类：

```js
// app/controller/user.js

// 从 egg 上获取（推荐）
const Controller = require('egg').Controller;
class UserController extends Controller {
  // implement
}
module.exports = UserController;

// 从 app 实例上获取
module.exports = app => {
  return class UserController extends app.Controller {
    // implement
  };
};
```

### Service

框架提供了一个 Service 基类，并推荐所有的 [Service](https://eggjs.org/zh-cn/basics/service.html) 都继承于该基类实现。

Service 基类的属性和 [Controller](https://eggjs.org/zh-cn/basics/objects.html#controller) 基类属性一致，访问方式也类似：

```js
// app/service/user.js

// 从 egg 上获取（推荐）
const Service = require('egg').Service;
class UserService extends Service {
  // implement
}
module.exports = UserService;

// 从 app 实例上获取
module.exports = app => {
  return class UserService extends app.Service {
    // implement
  };
};
```

### Helper

Helper 用来提供一些实用的 utility 函数。它的作用在于我们可以将一些常用的动作抽离在 helper.js 里面成为一个独立的函数，这样可以用 JavaScript 来写复杂的逻辑，避免逻辑分散各处，同时可以更好的编写测试用例。

Helper 自身是一个类，有和 [Controller](https://eggjs.org/zh-cn/basics/objects.html#controller) 基类一样的属性，它也会在每次请求时进行实例化，因此 Helper 上的所有函数也能获取到当前请求相关的上下文信息。

#### 获取方式

可以在 Context 的实例上获取到当前请求的 Helper(`ctx.helper`) 实例。

```js
// app/controller/user.js
class UserController extends Controller {
  async fetch() {
    const { app, ctx } = this;
    const id = ctx.query.id;
    const user = app.cache.get(id);
    ctx.body = ctx.helper.formatUser(user);
  }
}
```

除此之外，Helper 的实例还可以在模板中获取到，例如可以在模板中获取到 [security](https://eggjs.org/zh-cn/core/security.html) 插件提供的 `shtml` 方法。

```js
// app/view/home.nj
{{ helper.shtml(value) }}
```

### Config

我们推荐应用开发遵循配置和代码分离的原则，将一些需要硬编码的业务配置都放到配置文件中，同时配置文件支持各个不同的运行环境使用不同的配置，使用起来也非常方便，所有框架、插件和应用级别的配置都可以通过 Config 对象获取到，关于框架的配置，可以详细阅读 [Config 配置](https://eggjs.org/zh-cn/basics/config.html)章节。

#### 获取方式

我们可以通过 `app.config` 从 Application 实例上获取到 config 对象，也可以在 Controller, Service, Helper 的实例上通过 `this.config` 获取到 config 对象。

### Logger

框架内置了功能强大的[日志功能](https://eggjs.org/zh-cn/core/logger.html)，可以非常方便的打印各种级别的日志到对应的日志文件中，每一个 logger 对象都提供了 4 个级别的方法：

- `logger.debug()`
- `logger.info()`
- `logger.warn()`
- `logger.error()`

在框架中提供了多个 Logger 对象，下面我们简单的介绍一下各个 Logger 对象的获取方式和使用场景。

#### App Logger

我们可以通过 `app.logger` 来获取到它，如果我们想做一些应用级别的日志记录，如记录启动阶段的一些数据信息，记录一些业务上与请求无关的信息，都可以通过 App Logger 来完成。

#### App CoreLogger

我们可以通过 `app.coreLogger` 来获取到它，一般我们在开发应用时都不应该通过 CoreLogger 打印日志，而框架和插件则需要通过它来打印应用级别的日志，这样可以更清晰的区分应用和框架打印的日志，通过 CoreLogger 打印的日志会放到和 Logger 不同的文件中。

#### Context Logger

我们可以通过 `ctx.logger` 从 Context 实例上获取到它，从访问方式上我们可以看出来，Context Logger 一定是与请求相关的，它打印的日志都会在前面带上一些当前请求相关的信息（如 `[$userId/$ip/$traceId/${cost}ms $method $url]`），通过这些信息，我们可以从日志快速定位请求，并串联一次请求中的所有的日志。

#### Context CoreLogger

我们可以通过 `ctx.coreLogger` 获取到它，和 Context Logger 的区别是一般只有插件和框架会通过它来记录日志。

#### Controller Logger & Service Logger

我们可以在 Controller 和 Service 实例上通过 `this.logger` 获取到它们，它们本质上就是一个 Context Logger，不过在打印日志的时候还会额外的加上文件路径，方便定位日志的打印位置。

###  Subscription

订阅模型是一种比较常见的开发模式，譬如消息中间件的消费者或调度任务。因此我们提供了 Subscription 基类来规范化这个模式。

可以通过以下方式来引用 Subscription 基类：

```js
const Subscription = require('egg').Subscription;

class Schedule extends Subscription {
  // 需要实现此方法
  // subscribe 可以为 async function 或 generator function
  async subscribe() {}
}
```

## 运行环境

一个 Web 应用本身应该是无状态的，并拥有根据运行环境设置自身的能力。

####  指定运行环境

框架有两种方式指定运行环境：

1. 通过 `config/env` 文件指定，该文件的内容就是运行环境，如 `prod`。一般通过构建工具来生成这个文件。

```
// config/env
prod
```

1. 通过 `EGG_SERVER_ENV` 环境变量指定运行环境更加方便，比如在生产环境启动应用：

```
EGG_SERVER_ENV=prod npm start
```

#### 应用内获取运行环境

框架提供了变量 `app.config.env` 来表示应用当前的运行环境。

#### 运行环境相关配置

不同的运行环境会对应不同的配置，具体请阅读 [Config 配置](https://eggjs.org/zh-cn/basics/config.html)。

#### 与 NODE_ENV 的区别

很多 Node.js 应用会使用 `NODE_ENV` 来区分运行环境，但 `EGG_SERVER_ENV` 区分得更加精细。一般的项目开发流程包括本地开发环境、测试环境、生产环境等，除了本地开发环境和测试环境外，其他环境可统称为**服务器环境**，服务器环境的 `NODE_ENV` 应该为 `production`。而且 npm 也会使用这个变量，在应用部署的时候一般不会安装 devDependencies，所以这个值也应该为 `production`。

框架默认支持的运行环境及映射关系（如果未指定 `EGG_SERVER_ENV` 会根据 `NODE_ENV` 来匹配）

| NODE_ENV   | EGG_SERVER_ENV | 说明         |
| ---------- | -------------- | ------------ |
|            | local          | 本地开发环境 |
| test       | unittest       | 单元测试     |
| production | prod           | 生产环境     |

**例如，当 `NODE_ENV` 为 `production` 而 `EGG_SERVER_ENV` 未指定时，框架会将 `EGG_SERVER_ENV` 设置成 `prod`。**

#### 自定义环境

常规开发流程可能不仅仅只有以上几种环境，Egg 支持自定义环境来适应自己的开发流程。

比如，要为开发流程增加集成测试环境 SIT。将 `EGG_SERVER_ENV` 设置成 `sit`（并建议设置 `NODE_ENV = production`），启动时会加载 `config/config.sit.js`，运行环境变量 `app.config.env` 会被设置成 `sit`。

#### 与 Koa 的区别

在 Koa 中我们通过 `app.env` 来进行环境判断，`app.env` 默认的值是 `process.env.NODE_ENV`。但是在 Egg（和基于 Egg 的框架）中，配置统一都放置在 `app.config` 上，所以我们需要通过 `app.config.env` 来区分环境，`app.env` 不再使用。

## 配置（跳过）

## 中间件（跳过）

## 路由（Router）

Router 主要用来描述请求 URL 和具体承担执行动作的 Controller 的对应关系， 框架约定了 `app/router.js` 文件用于统一所有路由规则。

通过统一的配置，我们可以避免路由规则逻辑散落在多个地方，从而出现未知的冲突，集中在一起我们可以更方便的来查看全局的路由规则。

### 如何定义 Router

- `app/router.js` 里面定义 URL 路由规则

```js
// app/router.js
module.exports = app => {
  const { router, controller } = app;
  router.get('/user/:id', controller.user.info);
};
```

- `app/controller` 目录下面实现 Controller

```js
// app/controller/user.js
class UserController extends Controller {
  async info() {
    const { ctx } = this;
    ctx.body = {
      name: `hello ${ctx.params.id}`,
    };
  }
}
```

这样就完成了一个最简单的 Router 定义，当用户执行 `GET /user/123`，`user.js` 这个里面的 info 方法就会执行。

### Router 详细定义说明

下面是路由的完整定义，参数可以根据场景的不同，自由选择：

```
router.verb('path-match', app.controller.action);
router.verb('router-name', 'path-match', app.controller.action);
router.verb('path-match', middleware1, ..., middlewareN, app.controller.action);
router.verb('router-name', 'path-match', middleware1, ..., middlewareN, app.controller.action);
```

路由完整定义主要包括5个主要部分:

- verb - 用户触发动作，支持 get，post 等所有 HTTP 方法，后面会通过示例详细说明。
  - router.head - HEAD
  - router.options - OPTIONS
  - router.get - GET
  - router.put - PUT
  - router.post - POST
  - router.patch - PATCH
  - router.delete - DELETE
  - router.del - 由于 delete 是一个保留字，所以提供了一个 delete 方法的别名。
  - router.redirect - 可以对 URL 进行重定向处理，比如我们最经常使用的可以把用户访问的根目录路由到某个主页。
- router-name 给路由设定一个别名，可以通过 Helper 提供的辅助函数 `pathFor` 和 `urlFor` 来生成 URL。(可选)
- path-match - 路由 URL 路径。
- middleware1 - 在 Router 里面可以配置多个 Middleware。(可选)
- controller - 指定路由映射到的具体的 controller 上，controller 可以有两种写法：
  - **`app.controller.user.fetch` - 直接指定一个具体的 controller**
  - **`'user.fetch'` - 可以简写为字符串形式**

### 注意事项

- 在 Router 定义中， 可以支持多个 Middleware 串联执行
- **Controller 必须定义在 `app/controller` 目录中。**
- 一个文件里面也可以包含多个 Controller 定义，在定义路由的时候，可以通过 `${fileName}.${functionName}` 的方式指定对应的 Controller。
- **Controller 支持子目录，在定义路由的时候，可以通过 `${directoryName}.${fileName}.${functionName}` 的方式指定对应的 Controller。**

下面是一些路由定义的方式：

```js
// app/router.js
module.exports = app => {
  const { router, controller } = app;
  router.get('/home', controller.home);
  router.get('/user/:id', controller.user.page);
  router.post('/admin', isAdmin, controller.admin);
  router.post('/user', isLoginUser, hasAdminPermission, controller.user.create);
  router.post('/api/v1/comments', controller.v1.comments.create); // app/controller/v1/comments.js
};
```

### RESTful 风格的 URL 定义

如果想通过 RESTful 的方式来定义路由， 我们提供了 `app.router.resources('routerName', 'pathMatch', controller)` 快速在一个路径上生成 [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) 路由结构。

```
// app/router.js
module.exports = app => {
  const { router, controller } = app;
  router.resources('posts', '/api/posts', controller.posts);
  router.resources('users', '/api/v1/users', controller.v1.users); // app/controller/v1/users.js
};
```

上面代码就在 `/posts` 路径上部署了一组 CRUD 路径结构，对应的 Controller 为 `app/controller/posts.js` 接下来， 你只需要在 `posts.js` 里面实现对应的函数就可以了。

| Method | Path            | Route Name | Controller.Action             |
| ------ | --------------- | ---------- | ----------------------------- |
| GET    | /posts          | posts      | app.controllers.posts.index   |
| GET    | /posts/new      | new_post   | app.controllers.posts.new     |
| GET    | /posts/:id      | post       | app.controllers.posts.show    |
| GET    | /posts/:id/edit | edit_post  | app.controllers.posts.edit    |
| POST   | /posts          | posts      | app.controllers.posts.create  |
| PUT    | /posts/:id      | post       | app.controllers.posts.update  |
| DELETE | /posts/:id      | post       | app.controllers.posts.destroy |

```js
// app/controller/posts.js
exports.index = async () => {};

exports.new = async () => {};

exports.create = async () => {};

exports.show = async () => {};

exports.edit = async () => {};

exports.update = async () => {};

exports.destroy = async () => {};
```

如果我们不需要其中的某几个方法，可以不用在 `posts.js` 里面实现，这样对应 URL 路径也不会注册到 Router。

###  router 实战

#### 参数获取

##### Query String 方式

```js
// app/router.js
module.exports = app => {
  app.router.get('/search', app.controller.search.index);
};

// app/controller/search.js
exports.index = async ctx => {
  ctx.body = `search: ${ctx.query.name}`;
};

// curl http://127.0.0.1:7001/search?name=egg
```

##### 参数命名方式

```js
// app/router.js
module.exports = app => {
  app.router.get('/user/:id/:name', app.controller.user.info);
};

// app/controller/user.js
exports.info = async ctx => {
  ctx.body = `user: ${ctx.params.id}, ${ctx.params.name}`;
};

// curl http://127.0.0.1:7001/user/123/xiaoming
```

##### 复杂参数的获取

路由里面也支持定义正则，可以更加灵活的获取参数：

```js
// app/router.js
module.exports = app => {
  app.router.get(/^\/package\/([\w-.]+\/[\w-.]+)$/, app.controller.package.detail);
};

// app/controller/package.js
exports.detail = async ctx => {
  // 如果请求 URL 被正则匹配， 可以按照捕获分组的顺序，从 ctx.params 中获取。
  // 按照下面的用户请求，`ctx.params[0]` 的 内容就是 `egg/1.0.0`
  ctx.body = `package:${ctx.params[0]}`;
};

// curl http://127.0.0.1:7001/package/egg/1.0.0
```

#### 表单内容的获取

```js
// app/router.js
module.exports = app => {
  app.router.post('/form', app.controller.form.post);
};

// app/controller/form.js
exports.post = async ctx => {
  ctx.body = `body: ${JSON.stringify(ctx.request.body)}`;
};

// 模拟发起 post 请求。
// curl -X POST http://127.0.0.1:7001/form --data '{"name":"controller"}' --header 'Content-Type:application/json'
```

> 附：

> 这里直接发起 POST 请求会**报错**：'secret is missing'。错误信息来自 [koa-csrf/index.js#L69](https://github.com/koajs/csrf/blob/2.5.0/index.js#L69) 。

> **原因**：框架内部针对表单 POST 请求均会验证 CSRF 的值，因此我们在表单提交时，请带上 CSRF key 进行提交，可参考[安全威胁csrf的防范](https://eggjs.org/zh-cn/core/security.html#安全威胁csrf的防范)

> **注意**：上面的校验是因为框架中内置了安全插件 [egg-security](https://github.com/eggjs/egg-security)，提供了一些默认的安全实践，并且框架的安全插件是默认开启的，如果需要关闭其中一些安全防范，直接设置该项的 enable 属性为 false 即可。

> 「除非清楚的确认后果，否则不建议擅自关闭安全插件提供的功能。」

> 这里在写例子的话可临时在 `config/config.default.js` 中设置

```js
exports.security = {
  csrf: false
};
```

#### 表单校验

```js
// app/router.js
module.exports = app => {
  app.router.post('/user', app.controller.user);
};

// app/controller/user.js
const createRule = {
  username: {
    type: 'email',
  },
  password: {
    type: 'password',
    compare: 're-password',
  },
};

exports.create = async ctx => {
  // 如果校验报错，会抛出异常
  ctx.validate(createRule);
  ctx.body = ctx.request.body;
};

// curl -X POST http://127.0.0.1:7001/user --data 'username=abc@abc.com&password=111111&re-password=111111'
```

#### 重定向

##### 内部重定向

```js
// app/router.js
module.exports = app => {
  app.router.get('index', '/home/index', app.controller.home.index);
  app.router.redirect('/', '/home/index', 302);
};

// app/controller/home.js
exports.index = async ctx => {
  ctx.body = 'hello controller';
};

// curl -L http://localhost:7001
```

##### 外部重定向

```js
// app/router.js
module.exports = app => {
  app.router.get('/search', app.controller.search.index);
};

// app/controller/search.js
exports.index = async ctx => {
  const type = ctx.query.type;
  const q = ctx.query.q || 'nodejs';

  if (type === 'bing') {
    ctx.redirect(`http://cn.bing.com/search?q=${q}`);
  } else {
    ctx.redirect(`https://www.google.co.kr/search?q=${q}`);
  }
};

// curl http://localhost:7001/search?type=bing&q=node.js
// curl http://localhost:7001/search?q=node.js
```

#### 中间件的使用

如果我们想把用户某一类请求的参数都大写，可以通过中间件来实现。 这里我们只是简单说明下如何使用中间件，更多请查看 [中间件](https://eggjs.org/zh-cn/basics/middleware.html)。

```js
// app/controller/search.js
exports.index = async ctx => {
  ctx.body = `search: ${ctx.query.name}`;
};

// app/middleware/uppercase.js
module.exports = () => {
  return async function uppercase(ctx, next) {
    ctx.query.name = ctx.query.name && ctx.query.name.toUpperCase();
    await next();
  };
};

// app/router.js
module.exports = app => {
  app.router.get('s', '/search', app.middleware.uppercase(), app.controller.search)
};

// curl http://localhost:7001/search?name=egg
```

#### 太多路由映射？

如上所述，我们并不建议把路由规则逻辑散落在多个地方，会给排查问题带来困扰。

若确实有需求，可以如下拆分：

```js
// app/router.js
module.exports = app => {
  require('./router/news')(app);
  require('./router/admin')(app);
};

// app/router/news.js
module.exports = app => {
  app.router.get('/news/list', app.controller.news.list);
  app.router.get('/news/detail', app.controller.news.detail);
};

// app/router/admin.js
module.exports = app => {
  app.router.get('/admin/user', app.controller.admin.user);
  app.router.get('/admin/log', app.controller.admin.log);
};
```

也可直接使用 [egg-router-plus](https://github.com/eggjs/egg-router-plus)。

## 控制器（Controller）

###  什么是 Controller

我们通过 Router 将用户的请求基于 method 和 URL 分发到了对应的 Controller 上，那 Controller 负责做什么？

简单的说 Controller 负责**解析用户的输入，处理后返回相应的结果**，例如

- 在 [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) 接口中，Controller 接受用户的参数，从数据库中查找内容返回给用户或者将用户的请求更新到数据库中。
- 在 HTML 页面请求中，Controller 根据用户访问不同的 URL，渲染不同的模板得到 HTML 返回给用户。
- 在代理服务器中，Controller 将用户的请求转发到其他服务器上，并将其他服务器的处理结果返回给用户。

框架推荐 Controller 层主要对用户的请求参数进行处理（校验、转换），然后调用对应的 [service](https://eggjs.org/zh-cn/basics/service.html) 方法处理业务，得到业务结果后封装并返回：

1. 获取用户通过 HTTP 传递过来的请求参数。
2. 校验、组装参数。
3. 调用 Service 进行业务处理，必要时处理转换 Service 的返回结果，让它适应用户的需求。
4. 通过 HTTP 将结果响应给用户。

### 如何编写 Controller

**所有的 Controller 文件都必须放在 `app/controller` 目录下**，可以支持多级目录，访问的时候可以通过目录名级联访问。Controller 支持多种形式进行编写，可以根据不同的项目场景和开发习惯来选择。

#### Controller 类（推荐）

我们可以通过定义 Controller 类的方式来编写代码：

```js
// app/controller/post.js
const Controller = require('egg').Controller;
class PostController extends Controller {
  async create() {
    const { ctx, service } = this;
    const createRule = {
      title: { type: 'string' },
      content: { type: 'string' },
    };
    // 校验参数
    ctx.validate(createRule);
    // 组装参数
    const author = ctx.session.userId;
    const req = Object.assign(ctx.request.body, { author });
    // 调用 Service 进行业务处理
    const res = await service.post.create(req);
    // 设置响应内容和响应状态码
    ctx.body = { id: res.id };
    ctx.status = 201;
  }
}
module.exports = PostController;
```

我们通过上面的代码定义了一个 `PostController` 的类，类里面的每一个方法都可以作为一个 Controller 在 Router 中引用到，我们可以从 `app.controller` 根据文件名和方法名定位到它。

```js
// app/router.js
module.exports = app => {
  const { router, controller } = app;
  router.post('createPost', '/api/posts', controller.post.create);
}
```

Controller 支持多级目录，例如如果我们将上面的 Controller 代码放到 `app/controller/sub/post.js` 中，则可以在 router 中这样使用：

```js
// app/router.js
module.exports = app => {
  app.router.post('createPost', '/api/posts', app.controller.sub.post.create);
}
```

定义的 Controller 类，会在每一个请求访问到 server 时实例化一个全新的对象，而项目中的 Controller 类继承于 `egg.Controller`，**会有下面几个属性挂在 `this` 上。**

- `this.ctx`: 当前请求的上下文 [Context](https://eggjs.org/zh-cn/basics/extend.html#context) 对象的实例，通过它我们可以拿到框架封装好的处理当前请求的各种便捷属性和方法。
- `this.app`: 当前应用 [Application](https://eggjs.org/zh-cn/basics/extend.html#application) 对象的实例，通过它我们可以拿到框架提供的全局对象和方法。
- `this.service`：应用定义的 [Service](https://eggjs.org/zh-cn/basics/service.html)，通过它我们可以访问到抽象出的业务层，**等价于 `this.ctx.service` 。**
- `this.config`：应用运行时的[配置项](https://eggjs.org/zh-cn/basics/config.html)。
- `this.logger`：logger 对象，上面有四个方法（`debug`，`info`，`warn`，`error`），分别代表打印四个不同级别的日志，使用方法和效果与 [context logger](https://eggjs.org/zh-cn/core/logger.html#context-logger) 中介绍的一样，但是通过这个 logger 对象记录的日志，在日志前面会加上打印该日志的文件路径，以便快速定位日志打印位置。

#### 自定义 Controller 基类

按照类的方式编写 Controller，不仅可以让我们更好的对 Controller 层代码进行抽象（例如将一些统一的处理抽象成一些私有方法），还可以通过自定义 Controller 基类的方式封装应用中常用的方法。

```js
// app/core/base_controller.js
const { Controller } = require('egg');
class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }

  success(data) {
    this.ctx.body = {
      success: true,
      data,
    };
  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
}
module.exports = BaseController;
```

**此时在编写应用的 Controller 时，可以继承 BaseController，直接使用基类上的方法：**

```js
//app/controller/post.js
const Controller = require('../core/base_controller');
class PostController extends Controller {
  async list() {
    const posts = await this.service.listByUser(this.user);
    this.success(posts);
  }
}
```

#### Controller 方法（不推荐使用，只是为了兼容）

每一个 Controller 都是一个 async function，它的入参为请求的上下文 [Context](https://eggjs.org/zh-cn/basics/extend.html#context) 对象的实例，通过它我们可以拿到框架封装好的各种便捷属性和方法。

例如我们写一个对应到 `POST /api/posts` 接口的 Controller，我们会在 `app/controller` 目录下创建一个 `post.js` 文件

```js
// app/controller/post.js
exports.create = async ctx => {
  const createRule = {
    title: { type: 'string' },
    content: { type: 'string' },
  };
  // 校验参数
  ctx.validate(createRule);
  // 组装参数
  const author = ctx.session.userId;
  const req = Object.assign(ctx.request.body, { author });
  // 调用 service 进行业务处理
  const res = await ctx.service.post.create(req);
  // 设置响应内容和响应状态码
  ctx.body = { id: res.id };
  ctx.status = 201;
};
```

在上面的例子中我们引入了许多新的概念，但还是比较直观，容易理解的，我们会在下面对它们进行更详细的介绍。

### HTTP 基础

#### 获取 HTTP 请求参数

##### query

我们可以通过 `ctx.query` 拿到解析过后的这个参数体

```js
class PostController extends Controller {
  async listPosts() {
    const query = this.ctx.query;
    // {
    //   category: 'egg',
    //   language: 'node',
    // }
  }
}
```

**当 Query String 中的 key 重复时，`ctx.query` 只取 key 第一次出现时的值，后面再出现的都会被忽略**。`GET /posts?category=egg&category=koa` 通过 `ctx.query` 拿到的值是 `{ category: 'egg' }`。

我们可以通过 `ctx.query` 拿到解析过后的这个参数体

```js
class PostController extends Controller {
  async listPosts() {
    const query = this.ctx.query;
    // {
    //   category: 'egg',
    //   language: 'node',
    // }
  }
}
```

当 Query String 中的 key 重复时，`ctx.query` 只取 key 第一次出现时的值，后面再出现的都会被忽略。`GET /posts?category=egg&category=koa` 通过 `ctx.query` 拿到的值是 `{ category: 'egg' }`。

##### queries

有时候我们的系统会设计成让用户传递相同的 key，例如 `GET /posts?category=egg&id=1&id=2&id=3`。针对此类情况，框架提供了 `ctx.queries` 对象，这个对象也解析了 Query String，但是**它不会丢弃任何一个重复的数据，而是将他们都放到一个数组中**：

```js
// GET /posts?category=egg&id=1&id=2&id=3
class PostController extends Controller {
  async listPosts() {
    console.log(this.ctx.queries);
    // {
    //   category: [ 'egg' ],
    //   id: [ '1', '2', '3' ],
    // }
  }
}
```

`ctx.queries` 上所有的 key 如果有值，也一定会是数组类型。

##### Router params

在 [Router](https://eggjs.org/zh-cn/basics/router.html) 中，我们介绍了 Router 上也可以申明参数，这些参数都可以通过 `ctx.params` 获取到。

```
// app.get('/projects/:projectId/app/:appId', 'app.listApp');
// GET /projects/1/app/2
class AppController extends Controller {
  async listApp() {
    assert.equal(this.ctx.params.projectId, '1');
    assert.equal(this.ctx.params.appId, '2');
  }
}
```

##### body

虽然我们可以通过 URL 传递参数，但是还是有诸多限制：

- [浏览器中会对 URL 的长度有所限制](http://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers)，如果需要传递的参数过多就会无法传递。
- 服务端经常会将访问的完整 URL 记录到日志文件中，有一些敏感数据通过 URL 传递会不安全。

在前面的 HTTP 请求报文示例中，我们看到在 header 之后还有一个 body 部分，我们通常会在这个部分传递 POST、PUT 和 DELETE 等方法的参数。一般请求中有 body 的时候，客户端（浏览器）会同时发送 `Content-Type` 告诉服务端这次请求的 body 是什么格式的。Web 开发中数据传递最常用的两类格式分别是 JSON 和 Form。

框架内置了 [bodyParser](https://github.com/koajs/bodyparser) 中间件来对这两类格式的请求 body 解析成 object 挂载到 `ctx.request.body` 上。HTTP 协议中并不建议在通过 GET、HEAD 方法访问时传递 body，所以我们无法在 GET、HEAD 方法中按照此方法获取到内容。

```js
// POST /api/posts HTTP/1.1
// Host: localhost:3000
// Content-Type: application/json; charset=UTF-8
//
// {"title": "controller", "content": "what is controller"}
class PostController extends Controller {
  async listPosts() {
    assert.equal(this.ctx.request.body.title, 'controller');
    assert.equal(this.ctx.request.body.content, 'what is controller');
  }
}
```

框架对 bodyParser 设置了一些默认参数，配置好之后拥有以下特性：

- 当请求的 Content-Type 为 `application/json`，`application/json-patch+json`，`application/vnd.api+json` 和 `application/csp-report` 时，会按照 json 格式对请求 body 进行解析，并限制 body 最大长度为 `100kb`。
- 当请求的 Content-Type 为 `application/x-www-form-urlencoded` 时，会按照 form 格式对请求 body 进行解析，并限制 body 最大长度为 `100kb`。
- 如果解析成功，body 一定会是一个 Object（可能是一个数组）。

一般来说我们最经常调整的配置项就是变更解析时允许的最大长度，可以在 **`config/config.default.js` 中覆盖框架的默认值。**

```js
module.exports = {
  bodyParser: {
    jsonLimit: '1mb',
    formLimit: '1mb',
  },
};
```

如果用户的请求 body 超过了我们配置的解析最大长度，会抛出一个状态码为 `413` 的异常，如果用户请求的 body 解析失败（错误的 JSON），会抛出一个状态码为 `400` 的异常。

**注意：在调整 bodyParser 支持的 body 长度时，如果我们应用前面还有一层反向代理（Nginx），可能也需要调整它的配置，确保反向代理也支持同样长度的请求 body。**

**一个常见的错误是把 `ctx.request.body` 和 `ctx.body` 混淆，后者其实是 `ctx.response.body` 的简写。**

####  获取上传的文件

除了从 URL 和请求 body 上获取参数之外，还有许多参数是通过请求 header 传递的。框架提供了一些辅助属性和方法来获取。

- `ctx.headers`，`ctx.header`，`ctx.request.headers`，`ctx.request.header`：这几个方法是等价的，都是获取整个 header 对象。
- `ctx.get(name)`，`ctx.request.get(name)`：获取请求 header 中的一个字段的值，如果这个字段不存在，会返回空字符串。
- **我们建议用 `ctx.get(name)` 而不是 `ctx.headers['name']`，因为前者会自动处理大小写。**

由于 header 比较特殊，有一些是 `HTTP` 协议规定了具体含义的（例如 `Content-Type`，`Accept`），有些是反向代理设置的，已经约定俗成（X-Forwarded-For），框架也会对他们增加一些便捷的 getter，详细的 getter 可以查看 [API](https://eggjs.org/api/) 文档。

特别是如果我们通过 `config.proxy = true` 设置了应用部署在反向代理（Nginx）之后，有一些 Getter 的内部处理会发生改变。

##### `ctx.host`

优先读通过 `config.hostHeaders` 中配置的 header 的值，读不到时再尝试获取 host 这个 header 的值，如果都获取不到，返回空字符串。

`config.hostHeaders` 默认配置为 `x-forwarded-host`。

##### `ctx.protocol`

通过这个 Getter 获取 protocol 时，首先会判断当前连接是否是加密连接，如果是加密连接，返回 https。

如果处于非加密连接时，优先读通过 `config.protocolHeaders` 中配置的 header 的值来判断是 HTTP 还是 https，如果读取不到，我们可以在配置中通过 `config.protocol` 来设置兜底值，默认为 HTTP。

`config.protocolHeaders` 默认配置为 `x-forwarded-proto`。

##### `ctx.ips`

通过 `ctx.ips` 获取请求经过所有的中间设备 IP 地址列表，只有在 `config.proxy = true` 时，才会通过读取 `config.ipHeaders` 中配置的 header 的值来获取，获取不到时为空数组。

`config.ipHeaders` 默认配置为 `x-forwarded-for`。

##### `ctx.ip`

通过 `ctx.ip` 获取请求发起方的 IP 地址，优先从 `ctx.ips` 中获取，`ctx.ips` 为空时使用连接上发起方的 IP 地址。

**注意：`ip` 和 `ips` 不同，`ip` 当 `config.proxy = false` 时会返回当前连接发起者的 `ip` 地址，`ips` 此时会为空数组。**

#### Cookie

**HTTP 请求都是无状态的，但是我们的 Web 应用通常都需要知道发起请求的人是谁**。为了解决这个问题，HTTP 协议设计了一个特殊的请求头：[Cookie](https://en.wikipedia.org/wiki/HTTP_cookie)。服务端可以通过响应头（set-cookie）将少量数据响应给客户端，浏览器会遵循协议将数据保存，并在下次请求同一个服务的时候带上（浏览器也会遵循协议，只在访问符合 Cookie 指定规则的网站时带上对应的 Cookie 来保证安全性）。

通过 `ctx.cookies`，我们可以在 Controller 中便捷、安全的设置和读取 Cookie。

```js
class CookieController extends Controller {
  async add() {
    const ctx = this.ctx;
    let count = ctx.cookies.get('count');
    count = count ? Number(count) : 0;
    ctx.cookies.set('count', ++count);
    ctx.body = count;
  }

  async remove() {
    const ctx = this.ctx;
    const count = ctx.cookies.set('count', null);
    ctx.status = 204;
  }
}
```

Cookie 虽然在 HTTP 中只是一个头，但是通过 `foo=bar;foo1=bar1;` 的格式可以设置多个键值对。

Cookie 在 Web 应用中经常承担了传递客户端身份信息的作用，因此有许多安全相关的配置，不可忽视，[Cookie](https://eggjs.org/zh-cn/core/cookie-and-session.html#cookie) 文档中详细介绍了 Cookie 的用法和安全相关的配置项，可以深入阅读了解。

##### 配置

对于 Cookie 来说，主要有下面几个属性可以在 `config.default.js` 中进行配置:

```js
module.exports = {
  cookies: {
    // httpOnly: true | false,
    // sameSite: 'none|lax|strict',
  },
};
```

举例: 配置应用级别的 Cookie [SameSite](https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html) 属性等于 `Lax`。

```js
module.exports = {
  cookies: {
    sameSite: 'lax',
  },
};
```

#### Session

通过 Cookie，我们可以给每一个用户设置一个 Session，用来存储用户身份相关的信息，这份信息会加密后存储在 Cookie 中，实现跨请求的用户身份保持。

框架内置了 [Session](https://github.com/eggjs/egg-session) 插件，给我们提供了 `ctx.session` 来访问或者修改当前用户 Session 。

```js
class PostController extends Controller {
  async fetchPosts() {
    const ctx = this.ctx;
    // 获取 Session 上的内容
    const userId = ctx.session.userId;
    const posts = await ctx.service.post.fetch(userId);
    // 修改 Session 的值
    ctx.session.visited = ctx.session.visited ? ++ctx.session.visited : 1;
    ctx.body = {
      success: true,
      posts,
    };
  }
}
```

Session 的使用方法非常直观，直接读取它或者修改它就可以了，如果要删除它，直接将它赋值为 `null`：

```js
class SessionController extends Controller {
  async deleteSession() {
    this.ctx.session = null;
  }
};
```

和 Cookie 一样，Session 也有许多安全等选项和功能，在使用之前也最好阅读 [Session](https://eggjs.org/zh-cn/core/cookie-and-session.html#session) 文档深入了解。

##### 配置

对于 Session 来说，主要有下面几个属性可以在 `config.default.js` 中进行配置:

```js
module.exports = {
  key: 'EGG_SESS', // 承载 Session 的 Cookie 键值对名字
  maxAge: 86400000, // Session 的最大有效时间
};
```

### 参数校验

在获取到用户请求的参数后，不可避免的要对参数进行一些校验。

借助 [Validate](https://github.com/eggjs/egg-validate) 插件提供便捷的参数校验机制，帮助我们完成各种复杂的参数校验。

```
// config/plugin.js
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
```

通过 `ctx.validate(rule, [body])` 直接对参数进行校验：

```js
class PostController extends Controller {
  async create() {
    // 校验参数
    // 如果不传第二个参数会自动校验 `ctx.request.body`
    this.ctx.validate({
      title: { type: 'string' },
      content: { type: 'string' },
    });
  }
}
```

当校验异常时，会直接抛出一个异常，异常的状态码为 422，errors 字段包含了详细的验证不通过信息。如果想要自己处理检查的异常，可以通过 `try catch` 来自行捕获。

```js
class PostController extends Controller {
  async create() {
    const ctx = this.ctx;
    try {
      ctx.validate(createRule);
    } catch (err) {
      ctx.logger.warn(err.errors);
      ctx.body = { success: false };
      return;
    }
  }
};
```

#### 校验规则

参数校验通过 [Parameter](https://github.com/node-modules/parameter#rule) 完成，支持的校验规则可以在该模块的文档中查阅到。

#### 自定义校验规则

除了上一节介绍的内置检验类型外，有时候我们希望自定义一些校验规则，让开发时更便捷，此时可以通过 `app.validator.addRule(type, check)` 的方式新增自定义规则。

```js
// app.js
app.validator.addRule('json', (rule, value) => {
  try {
    JSON.parse(value);
  } catch (err) {
    return 'must be json string';
  }
});
```

添加完自定义规则之后，就可以在 Controller 中直接使用这条规则来进行参数校验了

```js
class PostController extends Controller {
  async handler() {
    const ctx = this.ctx;
    // query.test 字段必须是 json 字符串
    const rule = { test: 'json' };
    ctx.validate(rule, ctx.query);
  }
};
```

### 调用 Service

我们并不想在 Controller 中实现太多业务逻辑，所以提供了一个 [Service](https://eggjs.org/zh-cn/basics/service.html) 层进行业务逻辑的封装，这不仅能提高代码的复用性，同时可以让我们的业务逻辑更好测试。

在 Controller 中可以调用任何一个 Service 上的任何方法，同时 Service 是懒加载的，只有当访问到它的时候框架才会去实例化它。

```js
class PostController extends Controller {
  async create() {
    const ctx = this.ctx;
    const author = ctx.session.userId;
    const req = Object.assign(ctx.request.body, { author });
    // 调用 service 进行业务处理
    const res = await ctx.service.post.create(req);
    ctx.body = { id: res.id };
    ctx.status = 201;
  }
}
```

Service 的具体写法，请查看 [Service](https://eggjs.org/zh-cn/basics/service.html) 章节。

### 发送 HTTP 响应

当业务逻辑完成之后，Controller 的最后一个职责就是将业务逻辑的处理结果通过 HTTP 响应发送给用户。

#### 设置 status

HTTP 设计了非常多的[状态码](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)，每一个状态码都代表了一个特定的含义，通过设置正确的状态码，可以让响应更符合语义。

框架提供了一个便捷的 Setter 来进行状态码的设置

```js
class PostController extends Controller {
  async create() {
    // 设置状态码为 201
    this.ctx.status = 201;
  }
};
```

具体什么场景设置什么样的状态码，可以参考 [List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) 中各个状态码的含义。

#### 设置 body

绝大多数的数据都是通过 body 发送给请求方的，和请求中的 body 一样，在响应中发送的 body，也需要有配套的 Content-Type 告知客户端如何对数据进行解析。

- 作为一个 RESTful 的 API 接口 controller，我们通常会返回 Content-Type 为 `application/json` 格式的 body，内容是一个 JSON 字符串。
- 作为一个 html 页面的 controller，我们通常会返回 Content-Type 为 `text/html` 格式的 body，内容是 html 代码段。

**注意：`ctx.body` 是 `ctx.response.body` 的简写，不要和 `ctx.request.body` 混淆了。**

```js
class ViewController extends Controller {
  async show() {
    this.ctx.body = {
      name: 'egg',
      category: 'framework',
      language: 'Node.js',
    };
  }

  async page() {
    this.ctx.body = '<html><h1>Hello</h1></html>';
  }
}
```

由于 Node.js 的流式特性，我们还有很多场景需要通过 Stream 返回响应，例如返回一个大文件，代理服务器直接返回上游的内容，框架也支持直接将 body 设置成一个 Stream，并会同时处理好这个 Stream 上的错误事件。

```js
class ProxyController extends Controller {
  async proxy() {
    const ctx = this.ctx;
    const result = await ctx.curl(url, {
      streaming: true,
    });
    ctx.set(result.header);
    // result.res 是一个 stream
    ctx.body = result.res;
  }
};
```

#### 渲染模板

通常来说，我们不会手写 HTML 页面，而是会通过模板引擎进行生成。 框架自身没有集成任何一个模板引擎，但是约定了 [View 插件的规范](https://eggjs.org/zh-cn/advanced/view-plugin.html)，通过接入的模板引擎，可以直接使用 `ctx.render(template)` 来渲染模板生成 html。

```
class HomeController extends Controller {
  async index() {
    const ctx = this.ctx;
    await ctx.render('home.tpl', { name: 'egg' });
    // ctx.body = await ctx.renderString('hi, {{ name }}', { name: 'egg' });
  }
};
```

具体示例可以查看[模板渲染](https://eggjs.org/zh-cn/core/view.html)。

#### JSONP

有时我们需要给非本域的页面提供接口服务，又由于一些历史原因无法通过 [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) 实现，可以通过 [JSONP](https://en.wikipedia.org/wiki/JSONP) 来进行响应。

由于 JSONP 如果使用不当会导致非常多的安全问题，所以框架中提供了便捷的响应 JSONP 格式数据的方法，封装了 [JSONP XSS 相关的安全防范](https://eggjs.org/zh-cn/core/security.html#jsonp-xss)，并支持进行 CSRF 校验和 referrer 校验。

- 通过 `app.jsonp()` 提供的中间件来让一个 controller 支持响应 JSONP 格式的数据。在路由中，我们给需要支持 jsonp 的路由加上这个中间件：

```
// app/router.js
module.exports = app => {
  const jsonp = app.jsonp();
  app.router.get('/api/posts/:id', jsonp, app.controller.posts.show);
  app.router.get('/api/posts', jsonp, app.controller.posts.list);
};
```

- 在 Controller 中，只需要正常编写即可：

```
// app/controller/posts.js
class PostController extends Controller {
  async show() {
    this.ctx.body = {
      name: 'egg',
      category: 'framework',
      language: 'Node.js',
    };
  }
}
```

用户请求对应的 URL 访问到这个 controller 的时候，如果 query 中有 `_callback=fn` 参数，将会返回 JSONP 格式的数据，否则返回 JSON 格式的数据。

##### JSONP 配置

框架默认通过 query 中的 `_callback` 参数作为识别是否返回 JSONP 格式数据的依据，并且 `_callback` 中设置的方法名长度最多只允许 50 个字符。应用可以在 `config/config.default.js` 全局覆盖默认的配置：

```
// config/config.default.js
exports.jsonp = {
  callback: 'callback', // 识别 query 中的 `callback` 参数
  limit: 100, // 函数名最长为 100 个字符
};
```

通过上面的方式配置之后，如果用户请求 `/api/posts/1?callback=fn`，响应为 JSONP 格式，如果用户请求 `/api/posts/1`，响应格式为 JSON。

我们同样可以在 `app.jsonp()` 创建中间件时覆盖默认的配置，以达到不同路由使用不同配置的目的：

```
// app/router.js
module.exports = app => {
  const { router, controller, jsonp } = app;
  router.get('/api/posts/:id', jsonp({ callback: 'callback' }), controller.posts.show);
  router.get('/api/posts', jsonp({ callback: 'cb' }), controller.posts.list);
};
```

##### 跨站防御配置

默认配置下，响应 JSONP 时不会进行任何跨站攻击的防范，在某些情况下，这是很危险的。我们初略将 JSONP 接口分为三种类型：

1. 查询非敏感数据，例如获取一个论坛的公开文章列表。
2. 查询敏感数据，例如获取一个用户的交易记录。
3. 提交数据并修改数据库，例如给某一个用户创建一笔订单。

如果我们的 JSONP 接口提供下面两类服务，在不做任何跨站防御的情况下，可能泄露用户敏感数据甚至导致用户被钓鱼。因此框架给 JSONP 默认提供了 CSRF 校验支持和 referrer 校验支持。

###### CSRF

**在 JSONP 配置中，我们只需要打开 `csrf: true`，即可对 JSONP 接口开启 CSRF 校验**。

```
// config/config.default.js
module.exports = {
  jsonp: {
    csrf: true,
  },
};
```

**注意，CSRF 校验依赖于 [security](https://eggjs.org/zh-cn/core/security.html) 插件提供的基于 Cookie 的 CSRF 校验。**

在开启 CSRF 校验时，客户端在发起 JSONP 请求时，也要带上 CSRF token，如果发起 JSONP 的请求方所在的页面和我们的服务在同一个主域名之下的话，可以读取到 Cookie 中的 CSRF token（在 CSRF token 缺失时也可以自行设置 CSRF token 到 Cookie 中），并在请求时带上该 token。

##### referrer 校验

如果在同一个主域之下，可以通过开启 CSRF 的方式来校验 JSONP 请求的来源，而如果想对其他域名的网页提供 JSONP 服务，我们可以通过配置 referrer 白名单的方式来限制 JSONP 的请求方在可控范围之内。

```js
//config/config.default.js
exports.jsonp = {
  whiteList: /^https?:\/\/test.com\//,
  // whiteList: '.test.com',
  // whiteList: 'sub.test.com',
  // whiteList: [ 'sub.test.com', 'sub2.test.com' ],
};
```

`whiteList` 可以配置为正则表达式、字符串或者数组：

- 正则表达式：此时只有请求的 Referrer 匹配该正则时才允许访问 JSONP 接口。在设置正则表达式的时候，注意开头的 `^` 以及结尾的 `\/`，保证匹配到完整的域名。

```
exports.jsonp = {
  whiteList: /^https?:\/\/test.com\//,
};
// matches referrer:
// https://test.com/hello
// http://test.com/
```

- 字符串：设置字符串形式的白名单时分为两种，当字符串以 `.` 开头，例如 `.test.com` 时，代表 referrer 白名单为 `test.com` 的所有子域名，包括 `test.com` 自身。当字符串不以 `.` 开头，例如 `sub.test.com`，代表 referrer 白名单为 `sub.test.com` 这一个域名。（同时支持 HTTP 和 HTTPS）。

```js
exports.jsonp = {
  whiteList: '.test.com',
};
// matches domain test.com:
// https://test.com/hello
// http://test.com/

// matches subdomain
// https://sub.test.com/hello
// http://sub.sub.test.com/

exports.jsonp = {
  whiteList: 'sub.test.com',
};
// only matches domain sub.test.com:
// https://sub.test.com/hello
// http://sub.test.com/
```

- 数组：当设置的白名单为数组时，代表只要满足数组中任意一个元素的条件即可通过 referrer 校验。

```js
exports.jsonp = {
  whiteList: [ 'sub.test.com', 'sub2.test.com' ],
};
// matches domain sub.test.com and sub2.test.com:
// https://sub.test.com/hello
// http://sub2.test.com/
```

**当 CSRF 和 referrer 校验同时开启时，请求发起方只需要满足任意一个条件即可通过 JSONP 的安全校验。**

#### 设置 Header

我们通过状态码标识请求成功与否、状态如何，在 body 中设置响应的内容。而通过响应的 Header，还可以设置一些扩展信息。

通过 `ctx.set(key, value)` 方法可以设置一个响应头，`ctx.set(headers)` 设置多个 Header。

```js
// app/controller/api.js
class ProxyController extends Controller {
  async show() {
    const ctx = this.ctx;
    const start = Date.now();
    ctx.body = await ctx.service.post.get();
    const used = Date.now() - start;
    // 设置一个响应头
    ctx.set('show-response-time', used.toString());
  }
};
```

#### 重定向

框架通过 security 插件覆盖了 koa 原生的 `ctx.redirect` 实现，以提供更加安全的重定向。

- `ctx.redirect(url)` 如果不在配置的白名单域名内，则禁止跳转。
- `ctx.unsafeRedirect(url)` 不判断域名，直接跳转，一般不建议使用，明确了解可能带来的风险后使用。

用户如果使用`ctx.redirect`方法，需要在应用的配置文件中做如下配置：

```js
// config/config.default.js
exports.security = {
  domainWhiteList:['.domain.com'],  // 安全白名单，以 . 开头
};
```

若用户没有配置 `domainWhiteList` 或者 `domainWhiteList`数组内为空，则默认会对所有跳转请求放行，即等同于`ctx.unsafeRedirect(url)`
