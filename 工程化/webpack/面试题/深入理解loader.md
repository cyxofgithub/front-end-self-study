## 深入理解 loader

比如文件 style.css

```css
.button {
    color: 123;
}
```

在 main.js 在中引入

```javascript
import style from 'style.css';

console.log(style);
```

经过 my-loader 处理

```javascript
function myCssLoader(source) {
    // source = ".button { color: 123; }"

    // 真实的 css-loader 会解析 CSS 并返回类似这样的代码：
    return `
        const style = document.createElement('style');
        style.textContent = ${JSON.stringify(source)};
        document.head.appendChild(style);
        module.exports = {};
    `;
}
```

打包后的 main.js（简化版）：

```javascript
const modules = {
    // style.css 模块（已被 loader 转换）
    './style.css': function (module, exports) {
        // ↓ loader 返回的代码被内联在这里
        const style = document.createElement('style');
        style.textContent = '.button { color: 123; }';
        document.head.appendChild(style);
        module.exports = {};
    },

    // main.js 模块
    './main.js': function (module, exports, require) {
        const style = require('./style.css');
        console.log(style); // 输出: {}
        // 但 CSS 已经被注入到页面的 <head> 中了！
    },
};

modules['./main.js']();
```
