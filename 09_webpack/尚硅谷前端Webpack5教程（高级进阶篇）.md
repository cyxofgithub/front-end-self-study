## 一、补充知识

![image-20210904103049980](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210904103049980.png)

- inspect 表示调试模式
- brk 表示在首行打上断点
- 配置好后在自己需要查看代码的地方前一行打上 debuger 

![image-20210904103526193](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210904103526193.png)

- 然后在网页开发者工具点击 node 图标即可打开调试工具

![image-20210904103700208](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210904103700208.png)

- 这时打包的代码是停在第一行的，点击继续执行会跳到 debugger 的地方

![image-20210904103750914](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210904103750914.png)

- 在 watch 里添加你要查看的变量即可

![image-20210904103853628](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210904103853628.png)

## 二、vue create vue-project



![image-20210903101025874](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210903101025874.png)

- vue inspect --mode=development > webpack.dev.js
- vue inspect --mode=production > webpack.prod.js

## 三、自定义 Loader

### 3.1 预备知识

#### loader 简介

![image-20210903102654957](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210903102654957.png)

![image-20210903102805648](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210903102805648.png)

![image-20210903102530002](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210903102530002.png)

#### **同步 loader**

```
// 方式一
module.exports = function (content, map, meta) {
  console.log(111);

  return content;
}
// 方式二
module.exports = function (content, map, meta) {
  console.log(111);

  this.callback(null, content, map, meta);
}

module.exports.pitch = function () {
  console.log('pitch 111');
}
```

#### **异步 loader**

```
// 异步loader（推荐使用，loader在异步加载的过程中可以执行其余的步骤）
module.exports = function (content, map, meta) {
  console.log(222);

  const callback = this.async();

  setTimeout(() => {
    callback(null, content);
  }, 1000)
}

module.exports.pitch = function () {
  console.log('pitch 222');
}
```

#### 获取options库

- 安装loader-utils：`cnpm install loader-utils` 在loader中引入并使用 

#### 校验options

- 在loader中从schema-utils引入validate并使用 创建schema.json文件校验规则并引入使用

获取和检验 options 示例

```
// 1.1 获取options 引入

// 专门用于获取 options 的一个库，需下载，webpack 没有自带
const { getOptions } = require('loader-utils');

// 检验 options 数据是否合法的工具包
const { validate } = require('schema-utils');

// 校验规则
const schema = require('./schema');

module.exports = function (content, map, meta) {
  // 获取options
  const options = getOptions(this);

  console.log(333, options);

  // 校验options是否合法
  validate(schema, options, {
    name: 'loader3'
  })

  return content;
}

module.exports.pitch = function () {
  console.log('pitch 333');
}
```

schema.json中代码

```
{
	"type": "object",
	"properties": {
		"name": {
			"type": "string",
			"description": "名称～"
		}
	},
	"additionalProperties": false // 如果设置为true表示除了校验前面写的string类型还可以  接着  校验其余类型，如果为false表示校验了string类型之后不可以再校验其余类型
}
```

webpack.config.js中代码

```
const path = require('path');

module.exports = {
    module: {
      rules: [{
        test: /\.js$/,
        use: [
          {
            loader: 'loader3',
            // options部分
            options: {
              name: 'jack',
              age: 18
            }
          }
        ]
      }]
    },
    // 配置loader解析规则：我们的loader去哪个文件夹下面寻找（这里表示的是同级目录的loaders文件夹下面寻找）
    resolveLoader: {
      modules: [
        'node_modules',
        path.resolve(__dirname, 'loaders')
      ]
    }
  }
```

### 3.2 自定义babel-loader

- 创建校验规则：babelSchema.json

```
{
  "type": "object",
  "properties": {
    "presets": {
      "type": "array"
    }
  },
  "addtionalProperties": true
}
```

- 创建loader：babelLoader.js

```
const { getOptions } = require('loader-utils');
const { validate } = require('schema-utils');
const babel = require('@babel/core');
const util = require('util');

const babelSchema = require('./babelSchema.json');

// babel.transform用来编译代码的方法
// 是一个普通异步方法
// util.promisify将普通异步方法转化成基于promise的异步方法
const transform = util.promisify(babel.transform);

module.exports = function (content, map, meta) {

  // 获取loader的options配置
  const options = getOptions(this) || {};
  
  // 校验babel的options的配置
  validate(babelSchema, options, {
    name: 'Babel Loader'
  });

  // 创建异步
  const callback = this.async();

  // 使用babel编译代码
  transform(content, options)
    .then(({code, map}) => callback(null, code, map, meta))
    .catch((e) => callback(e))

}
```

- babelLoader使用：webpack.config.js

```
const path = require('path');

module.exports = {
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babelLoader',
        options: {
          presets: [
            '@babel/preset-env'
          ]
        }
      }]
    },
    // 配置loader解析规则：我们的loader去哪个文件夹下面寻找（这里表示的是同级目录的loaders文件夹下面寻找）
    resolveLoader: {
      modules: [
        'node_modules',
        path.resolve(__dirname, 'loaders')
      ]
    }
  }
```

## 四、自定义plugin

### 4.1 预备知识-compiler钩子

tips：complier的钩子说白了就是 webpack 在执行的时候会依次执行的一些函数（可以理解为生命周期）

#### 4.1.1 tapable

tips：The tapable package expose many Hook classes, which can be used to create hooks for plugins.（tapable 这个包暴露了很多钩子类，可以用它来为插件创建钩子）

1. 安装tapable：npm install tapable -D
2. 初始化hooks容器 
   - 2.1 同步hooks，任务会依次执行:SyncHook、SyncBailHook 
   - 2.2 异步hooks，异步并行：AsyncParallelHook，异步串行：AsyncSeriesHook
3. 往hooks容器中注册事件/添加回调函数
4. 触发hooks
5. 启动文件：node tapable.test.js
6. 文件tapable.test.js

```
const { SyncHook, SyncBailHook, AsyncParallelHook, AsyncSeriesHook } = require('tapable');

class Lesson {
  constructor() {
  
    // 初始化hooks容器
    this.hooks = {
      // 同步hooks，任务回依次执行
      // go: new SyncHook(['address'])
      // SyncBailHook：一旦有返回值就会退出～
      go: new SyncBailHook(['address']),

      // 异步hooks
      // AsyncParallelHook：异步并行
      // leave: new AsyncParallelHook(['name', 'age']),
      // AsyncSeriesHook: 异步串行
      leave: new AsyncSeriesHook(['name', 'age'])
    }
  }
  
  tap() {
    // 往hooks容器中注册事件/添加回调函数
    // 个人理解：当编译到 go 阶段时会执行以下的同步回调方法
    this.hooks.go.tap('class0318', (address) => {
      console.log('class0318', address);
      return 111;
    })
    this.hooks.go.tap('class0410', (address) => {
      console.log('class0410', address);
    })

	// 个人理解：当编译到 leave 阶段时会执行以下的异步回调方法
    this.hooks.leave.tapAsync('class0510', (name, age, cb) => {
      setTimeout(() => {
        console.log('class0510', name, age);
        cb();
      }, 2000)
    })

	// tapAsync 和 tapPromise 都可以用来写异步的回调方法
    this.hooks.leave.tapPromise('class0610', (name, age) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('class0610', name, age);
          resolve();
        }, 1000)
      })
    })
  }

  start() {
    // 触发hooks
    this.hooks.go.call('c318');
    this.hooks.leave.callAsync('jack', 18, function () {
      // 代表所有leave容器中的函数触发完了，才触发
      console.log('end~~~');
    });
  }
}

const l = new Lesson();
l.tap();
l.start();

```

#### 4.1.2 手撕Plugin1(演示compiler钩子）

这边只简单介绍了几个complier钩子,具体开发的过程中可以根据文档介绍编写（很方便的）

```
class Plugin1 {

  // 使用插件时会调用 apply 方法
  apply(complier) {

    // 生成资源到 output 目录之前。
    complier.hooks.emit.tap('Plugin1', (compilation) => {
      console.log('emit.tap 111');
    })

    // 异步串行钩子
    complier.hooks.emit.tapAsync('Plugin1', (compilation, cb) => {
      setTimeout(() => {
        console.log('emit.tapAsync 111');
        cb();
      }, 1000)
    })

    // 异步串行钩子
    complier.hooks.emit.tapPromise('Plugin1', (compilation) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('emit.tapPromise 111');
          resolve();
        }, 1000)
      })
    })


    // 生成资源到 output 目录之后。
    complier.hooks.afterEmit.tap('Plugin1', (compilation) => {
      console.log('afterEmit.tap 111');
    })

    // 编译(compilation)完成执行。
    complier.hooks.done.tap('Plugin1', (stats) => {
      console.log('done.tap 111');
    })

  }
}

module.exports = Plugin1;
```

tips：手撕 plugin1 示例

### 4.2 预备知识-compilation钩子

- **在每个 complier 钩子触发的时候它还会创建一个 compilation 对象，它里面也有许多钩子（可以理解成生命周期里的生命周期，钩子里的钩子）**
- 初始化compilation钩子
- 往要输出资源中，添加一个a.txt文件
- 读取b.txt中的内容，将b.txt中的内容添加到输出资源中的b.txt文件中 
  - 3.1 读取b.txt中的内容需要使用node的readFile模块
  -  3.2  将b.txt中的内容添加到输出资源中的b.txt文件中除了使用 2 中的方法外，还有两种形式可以使用 
    - 3.2.1 借助RawSource
    -  3.2.2 借助RawSource和emitAsset
- 手撕 plugin2 演示 compilation

```
const fs = require('fs');
const util = require('util');
const path = require('path');

const webpack = require('webpack');
const { RawSource } = webpack.sources;

// 将fs.readFile异步方法变成基于promise风格的异步方法
const readFile = util.promisify(fs.readFile);

class Plugin2 {

  apply(compiler) {
    // 初始化compilation钩子
    compiler.hooks.thisCompilation.tap('Plugin2', (compilation) => {
      // debugger
      // console.log(compilation);
      // additionalAssets 这个钩子可以在输出资源上再添加资源
      compilation.hooks.additionalAssets.tapAsync('Plugin2', async (cb) => {
        // debugger
        // console.log(compilation);

        const content = 'hello plugin2';

        // 往要输出资源中，添加一个a.txt
        compilation.assets['a.txt'] = {
          // 文件大小
          size() {
            return content.length;
          },
          // 文件内容
          source() {
            return content;
          }
        }

        const data = await readFile(path.resolve(__dirname, 'b.txt'));

        // 利用 Rawsource 可以帮我们自动将数据自动处理成上面 a.txt 写的那样的配置，assets，emitAsset 两种方法是等价的
        // compilation.assets['b.txt'] = new RawSource(data);
        compilation.emitAsset('b.txt', new RawSource(data));

        // 注意要调用 callback 标志这个钩子结束
        cb();

      })
    })

  }

}

module.exports = Plugin2;
```

