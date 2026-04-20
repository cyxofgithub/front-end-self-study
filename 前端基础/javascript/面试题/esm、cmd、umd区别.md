# ESM、CJS、UMD 区别

## 快速对比

| 特性             | ESM                 | CJS                      | UMD                         |
| ---------------- | ------------------- | ------------------------ | --------------------------- |
| **全称**         | ES Module           | CommonJS                 | Universal Module Definition |
| **环境**         | 浏览器/Node.js      | Node.js（浏览器需打包）  | 浏览器/Node.js              |
| **加载时机**     | 编译时静态分析      | 运行时同步加载           | 运行时动态判断              |
| **语法**         | `import/export`     | `require/module.exports` | 兼容多种格式                |
| **Tree Shaking** | ✅ 支持             | ❌ 不支持                | ❌ 不支持                   |
| **循环依赖**     | ✅ 支持（返回引用） | ⚠️ 返回未完全加载对象    | 取决于底层实现              |
| **this 指向**    | `undefined`         | `module.exports`         | 取决于底层实现              |

---

## ESM (ES Module)

**特点**：静态分析、严格模式、不可变绑定、原生支持

```javascript
// 导出
export const name = 'ESM';
export default class MyClass {}

// 导入
import { name } from './module.js';
import MyClass from './module.js';
```

**工作流程**：静态解析 → 模块解析 → 缓存 → 实例化 → 执行

---

## CJS (CommonJS)

**特点**：同步加载、运行时加载、Node.js 原生支持、动态 require

```javascript
// 导出
module.exports = { name: 'CJS' };
exports.foo = function () {}; // exports 是 module.exports 的引用

// 导入
const module = require('./module.js');
const fs = require('fs'); // 核心模块
```

**循环依赖**：返回未完全加载的模块对象，已定义部分可访问，未定义部分为 `undefined`

**this 指向**：`this` 指向 `module.exports`

---

## UMD (Universal Module Definition)

**特点**：通用兼容（AMD/CJS/全局变量）、库打包专用、**不直接兼容 ESM**

```javascript
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['dep'], factory); // AMD
    } else if (typeof exports === 'object') {
        module.exports = factory(require('dep')); // CJS
    } else {
        root.MyLib = factory(root.Dep); // 全局变量
    }
})(this, function (dep) {
    return {};
});
```

**原理**：

1. **IIFE 包装**：使用立即执行函数创建独立作用域，避免污染全局变量
2. **环境检测**：运行时动态检测当前环境
    - `typeof define === 'function' && define.amd`：检测 AMD（RequireJS）
    - `typeof exports === 'object'`：检测 CommonJS（Node.js）
    - 否则：使用全局变量（浏览器 `<script>` 标签）
3. **统一导出**：通过 `factory` 函数执行模块代码，根据环境选择导出方式
    - AMD：`define(['dep'], factory)`
    - CJS：`module.exports = factory(require('dep'))`
    - 全局：`root.MyLib = factory(root.Dep)`

**为什么不兼容 ESM**：

-   ESM 是**静态分析**，编译时确定依赖关系
-   UMD 是**运行时动态检测**，无法在编译时被 ESM 识别
-   ESM 无法直接 `import` UMD 格式的包（需要通过打包工具转换）

**使用场景**：第三方库开发（Vue2、jQuery）

**注意**：现代打包工具（Webpack、Rollup）可以将 UMD 包转换为 ESM，但 UMD 本身不直接支持 ESM 导入

---

## 选择建议

| 场景             | 推荐方案                         |
| ---------------- | -------------------------------- |
| **现代前端项目** | ESM（Vite、Webpack 5+）          |
| **库开发**       | UMD（兼容性）或 ESM + CJS 双格式 |
| **Node.js 项目** | CJS（传统）或 ESM（Node 14+）    |
| **旧浏览器兼容** | UMD                              |

---

## 核心总结

-   **ESM**：标准化的未来，静态分析，支持 Tree Shaking，浏览器和 Node.js 原生支持
-   **CJS**：Node.js 传统模块系统，同步加载，运行时解析
-   **UMD**：兼容性包装器，让库跨环境运行
