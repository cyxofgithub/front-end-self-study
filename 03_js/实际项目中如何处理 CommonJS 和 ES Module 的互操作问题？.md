# CommonJS 和 ES Module 互操作

## 核心限制

| 场景      | 是否支持  | 说明                              |
| --------- | --------- | --------------------------------- |
| ESM → CJS | ✅ 支持   | 可导入，但只能使用默认导出        |
| CJS → ESM | ❌ 不支持 | `require()` 无法加载 ESM 模块     |
| 动态导入  | ✅ 支持   | 使用 `import()` 在 CJS 中加载 ESM |

---

## Node.js 环境互操作

### 1. 文件扩展名区分

```javascript
// .mjs 文件 - 强制 ESM
export const name = 'ESM';

// .cjs 文件 - 强制 CJS
module.exports = { name: 'CJS' };
```

### 2. package.json 配置

```json
{
    "type": "module" // 所有 .js 文件视为 ESM
}
```

**规则**：

-   `"type": "module"` → `.js` 为 ESM，`.cjs` 为 CJS
-   `"type": "commonjs"`（默认）→ `.js` 为 CJS，`.mjs` 为 ESM
-   `.mjs` 和 `.cjs` 扩展名优先级最高

### 3. ESM 导入 CJS

```javascript
// ESM 文件
import cjsModule from './cjs-module.cjs';
import { default as cjsDefault } from './cjs-module.cjs';

// CJS 的 module.exports 会作为默认导出
// 命名导出需要通过 default 访问
```

**注意**：CJS 的 `module.exports = { a, b }` 在 ESM 中只能作为默认导出，无法直接解构

### 4. CJS 导入 ESM（动态导入）

```javascript
// CJS 文件
(async () => {
    const esmModule = await import('./esm-module.mjs');
    console.log(esmModule.default);
})();
```

**限制**：`require()` 无法同步加载 ESM，必须使用异步 `import()`

---

## 打包工具处理

### Webpack

自动处理互操作，无需特殊配置：

```javascript
// webpack.config.js
module.exports = {
    // 自动识别并转换
};
```

**原理**：

1. **模块识别**：通过 AST 解析识别 `import/export`（ESM）和 `require/module.exports`（CJS）
2. **统一转换**：将所有模块转换为统一的模块格式（CommonJS 或 ESM）
3. **包装处理**：
    - CJS → ESM：将 `module.exports` 包装为 `export default`
    - ESM → CJS：将 `import/export` 转换为 `require/module.exports`
4. **运行时支持**：提供 `__webpack_require__` 函数模拟模块系统

**转换示例**：

```javascript
// 原始 CJS
module.exports = { a: 1 };

// Webpack 转换后
__webpack_require__.d(__webpack_exports__, {
    a: () => a,
});
const a = 1;
```

### Vite

默认支持，但需要注意：

```javascript
// vite.config.js
export default {
    optimizeDeps: {
        include: ['cjs-package'], // 预构建 CJS 包
    },
};
```

**原理**：

1. **预构建阶段**（开发环境）：

    - 使用 `esbuild` 将 CJS 依赖转换为 ESM
    - 缓存到 `node_modules/.vite` 目录
    - 解决依赖关系，统一模块格式

2. **转换流程**：

    ```
    CJS 包 → esbuild 解析 → 转换为 ESM → 缓存
    ```

3. **运行时处理**：

    - 开发：使用预构建的 ESM 版本
    - 生产：Rollup 打包时统一处理

4. **互操作处理**：
    - CJS 的 `module.exports` → 转换为 `export default`
    - 支持命名导出：通过 `export { ... }` 重新导出

**预构建示例**：

```javascript
// 原始 CJS (lodash)
module.exports = { chunk: ... };

// Vite 预构建后
export default { chunk: ... };
export { chunk };
```

### Rollup

需要插件支持：

```javascript
// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';

export default {
    plugins: [commonjs()],
};
```

**原理**：

1. **插件处理**：`@rollup/plugin-commonjs` 负责转换
2. **转换步骤**：
    - 解析 CJS 语法（`require`、`module.exports`、`exports`）
    - 构建依赖图
    - 转换为 ESM 格式
3. **命名导出处理**：
    - 检测 `module.exports = { ... }` 中的键
    - 自动生成命名导出：`export { a, b, c }`
4. **动态 require**：转换为静态 `import` 或保留为动态导入

**转换示例**：

```javascript
// 原始 CJS
module.exports = {
    a: 1,
    b: 2,
};

// Rollup 转换后
const a = 1;
const b = 2;
export { a, b };
export default { a, b };
```

---

## 打包工具原理总结

| 工具    | 转换时机      | 转换工具 | 核心机制                   |
| ------- | ------------- | -------- | -------------------------- |
| Webpack | 打包时        | 内置     | AST 解析 + 统一模块格式    |
| Vite    | 预构建 + 打包 | esbuild  | 预构建 CJS → ESM，统一格式 |
| Rollup  | 打包时        | 插件     | 插件解析 CJS，转换为 ESM   |

**共同点**：

-   都通过 AST 解析识别模块格式
-   统一转换为目标格式（通常是 ESM）
-   处理 `module.exports` → `export default` 映射
-   支持命名导出转换（通过静态分析）

---

## 实际项目解决方案

### 方案 1：统一使用 ESM（推荐）

```json
// package.json
{
    "type": "module",
    "exports": {
        ".": {
            "import": "./dist/index.mjs",
            "require": "./dist/index.cjs"
        }
    }
}
```

**优势**：现代标准，支持 Tree Shaking

### 方案 2：双格式发布（库开发）

```json
// package.json
{
    "main": "./dist/index.cjs",
    "module": "./dist/index.mjs",
    "exports": {
        ".": {
            "import": "./dist/index.mjs",
            "require": "./dist/index.cjs"
        }
    }
}
```

**工具**：使用 `tsup` 或 `rollup` 同时生成两种格式

### 方案 3：渐进式迁移

1. **保持 CJS 为主**：新文件使用 `.mjs` 或配置 `"type": "module"` 后使用 `.cjs`
2. **使用动态导入**：CJS 中通过 `import()` 加载 ESM
3. **逐步迁移**：按模块逐步转换为 ESM

---

## 常见问题

### 1. CJS 模块在 ESM 中无法解构

```javascript
// ❌ 错误
import { a, b } from './cjs-module.cjs';

// ✅ 正确
import cjsModule from './cjs-module.cjs';
const { a, b } = cjsModule;
```

### 2. `__dirname` 和 `__filename` 在 ESM 中不可用

```javascript
// ESM 替代方案
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### 3. 条件导入

```javascript
// 根据环境选择模块
const module =
    process.env.NODE_ENV === 'production'
        ? await import('./prod.mjs')
        : await import('./dev.mjs');
```

---

## 最佳实践

1. **新项目**：直接使用 ESM（`"type": "module"`）
2. **库开发**：同时提供 ESM 和 CJS 双格式
3. **旧项目迁移**：使用 `.mjs`/`.cjs` 扩展名渐进式迁移
4. **避免混用**：同一项目尽量统一模块系统
5. **使用构建工具**：让工具处理互操作，减少手动配置

---

## 核心总结

-   **ESM 可导入 CJS**：但只能使用默认导出
-   **CJS 无法直接导入 ESM**：必须使用动态 `import()`
-   **文件扩展名优先级最高**：`.mjs` 和 `.cjs` 明确指定格式
-   **打包工具自动处理**：Webpack/Vite 等会自动转换
-   **推荐统一使用 ESM**：现代标准，更好的性能和 Tree Shaking 支持
