## cjs 原理

```javascript
const fs = require('fs');
const path = require('path');

const Module = {
    _cache: {},

    _resolveFilename: function(filename) {
        // 简化的路径解析逻辑
        if (filename.startsWith('./') || filename.startsWith('../')) {
            return path.resolve(__dirname, filename);
        }
        throw new Error('Module not found');
    },

    require: function(filename) {
        const resolvedFilename = this._resolveFilename(filename);

        // 检查缓存
        if (this._cache[resolvedFilename]) {
            return this._cache[resolvedFilename].exports;
        }

        // 创建模块实例
        const module = {
            exports: {},
            filename: resolvedFilename,
        };
        this._cache[resolvedFilename] = module;

        // 读取文件内容
        const content = fs.readFileSync(resolvedFilename, 'utf8');

        // 包装模块代码
        const wrapper = `(function (exports, require, module, __filename, __dirname) {
      ${content}
    })`;

        // 执行模块代码
        const compiledWrapper = eval(wrapper);
        compiledWrapper(
            module.exports,
            this.require.bind(this),
            module,
            resolvedFilename,
            path.dirname(resolvedFilename)
        );

        return module.exports;
    },
};

// 使用自定义的 require 函数加载模块
const myModule = Module.require('./myModule.js');
console.log(myModule);
```

## cjs 循环依赖处理

在 CommonJS 中，模块是同步加载的，循环引用会导致部分模块加载不完全。如果在加载过程中遇到循环引用，CommonJS 会返回一个未完全加载的模块对象。这意味着你可以访问已经定义的部分，但未定义的部分会是 undefined。

**示例**
假设有两个模块 a.js 和 b.js，它们相互依赖：

**a.js**

```javascript
const b = require('./b');
console.log('🚀 ~ b:', b);
module.exports = {
    name: 'Module A',
    getBName: () => b.name,
};
```

执行 a.js 此时 先进入 b 模块打印因为还没加载完返回空对象，加载完 b 模块后返回 a 模块，此时打印 b 为预期值
**b.js**

```javascript
const a = require('./a');
console.log('🚀 ~ a:', a);
module.exports = {
    name: 'Module B',
    getAName: () => a.name,
};
```

执行 b.js 同理

## this 指向

this 指向当前模块: 从源码中我们其实也能看出, 代码中通过包装函数 compiledWrapper 来运行模块主代码, 但是在执行包装函数时通过 call 等方式修改了函数的 this 执行, 这样的话在模块内部 this 指向就被相应的调整了

```javascript
function require(id) {
  ...
  compiledWrapper.call(module.exports, content, module.exports, require, module)
  ...
}
```
