# 其他常用 Presets

本案例演示 `@babel/preset-react`、`@babel/preset-typescript` 以及多个 preset 的组合使用方法。

## 📦 安装依赖

```bash
# 在 babel 根目录下运行
pnpm install
# 或
npm install
```

需要安装的依赖：

-   `@babel/core`
-   `@babel/cli`
-   `@babel/preset-env`
-   `@babel/preset-react` ⭐ 新增
-   `@babel/preset-typescript` ⭐ 新增

## 🚀 快速开始

### 方式一：使用测试脚本（推荐）

```bash
cd "第二阶段：核心配置/2.2 其他常用 Presets"
./test.sh
```

### 方式二：手动运行

```bash
cd "第二阶段：核心配置/2.2 其他常用 Presets"

# React preset (旧 JSX 转换)
npx babel src/react-component.jsx \
  --out-dir outputs/react \
  --config-file "$(pwd)/configs/config-react.js"

# React preset (新 JSX 转换)
npx babel src/react-component.jsx \
  --out-dir outputs/react-automatic \
  --config-file "$(pwd)/configs/config-react-automatic.js"

# TypeScript preset
npx babel src/typescript-example.ts \
  --out-dir outputs/typescript \
  --config-file "$(pwd)/configs/config-typescript.js" \
  --extensions ".ts"

# 组合 preset (React + TypeScript)
npx babel src/react-typescript.tsx \
  --out-dir outputs/combined \
  --config-file "$(pwd)/configs/config-combined.js" \
  --extensions ".tsx"
```

## 📚 核心 Presets

### 1. @babel/preset-react

用于转换 JSX 语法，支持 React 项目开发。

**主要功能：**

-   转换 JSX 语法为 `React.createElement()` 调用
-   支持新的 JSX 转换（React 17+，无需引入 React）

**配置选项：**

-   `runtime: 'automatic'` - 使用新的 JSX 转换（推荐，React 17+）
-   `runtime: 'classic'` - 使用旧的 JSX 转换（需要引入 React）
-   `development: true/false` - 是否启用开发模式（添加调试信息）

### 2. @babel/preset-typescript

用于处理 TypeScript 语法，移除类型注解，但不进行类型检查。

**主要功能：**

-   移除 TypeScript 类型注解
-   支持 TypeScript 语法特性（如装饰器、枚举等）
-   **注意**：不进行类型检查，类型检查需要 TypeScript 编译器

**配置选项：**

-   `isTSX: true` - 是否处理 TSX 文件
-   `allExtensions: true` - 处理所有扩展名

### 3. 多个 Preset 的组合使用

多个 preset 的执行顺序是**从后往前**（从右往左），所以通常将更通用的 preset 放在后面。

**推荐顺序：**

```js
presets: [
    '@babel/preset-env', // 最后执行：转换 ES6+ 语法
    '@babel/preset-react', // 中间执行：转换 JSX
    '@babel/preset-typescript', // 最先执行：移除类型注解
];
```

## 💡 推荐配置

### React 项目

```js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
            },
        ],
        [
            '@babel/preset-react',
            {
                runtime: 'automatic', // 新 JSX 转换（React 17+）
                development: process.env.NODE_ENV === 'development',
            },
        ],
    ],
};
```

### TypeScript 项目

```js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
            },
        ],
        [
            '@babel/preset-typescript',
            {
                isTSX: true,
                allExtensions: true,
            },
        ],
    ],
};
```

### React + TypeScript 项目

```js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
            },
        ],
        [
            '@babel/preset-react',
            {
                runtime: 'automatic',
            },
        ],
        '@babel/preset-typescript',
    ],
};
```

## 🔍 查看编译结果

编译后可以对比不同配置的输出：

```bash
# 查看 React 旧 JSX 转换输出
cat outputs/react/react-component.js

# 查看 React 新 JSX 转换输出
cat outputs/react-automatic/react-component.js

# 对比差异
diff outputs/react/react-component.js outputs/react-automatic/react-component.js
```

### 关键对比点

1. **旧 JSX 转换 vs 新 JSX 转换**

    - 旧：`React.createElement(Component, props, children)`
    - 新：`import { jsx } from 'react/jsx-runtime'` + `jsx(Component, props)`

2. **TypeScript 类型处理**

    - 类型注解被完全移除
    - 接口、类型别名等类型定义被移除
    - 保留运行时逻辑

3. **组合使用效果**
    - 类型注解先被移除
    - 然后 JSX 被转换
    - 最后 ES6+ 语法被转换

## ❓ 常见问题

**Q: preset-react 和 preset-typescript 的执行顺序重要吗？**  
A: 重要！preset 的执行顺序是从后往前。通常 `preset-typescript` 应该在最前面（最后执行），因为它需要先移除类型注解，然后其他 preset 才能处理。

**Q: 使用 preset-typescript 还需要 TypeScript 编译器吗？**  
A: 需要！`preset-typescript` 只负责移除类型注解，不进行类型检查。类型检查仍然需要 `tsc` 或 IDE 的类型检查功能。

**Q: 新 JSX 转换（runtime: 'automatic'）有什么优势？**  
A: 不需要在每个文件顶部引入 `React`，编译后的代码更简洁，支持 React 17+ 的新特性。

**Q: 可以在一个项目中同时使用 React 和 TypeScript 吗？**  
A: 可以！只需要同时配置 `preset-react` 和 `preset-typescript`，注意执行顺序。

## 📁 目录结构

```
2.2 其他常用 Presets/
├── README.md                    # 本文件
├── test.sh                      # 一键测试脚本
├── src/                         # 源代码目录
│   ├── react-component.jsx     # React 组件示例
│   ├── typescript-example.ts    # TypeScript 示例
│   └── react-typescript.tsx     # React + TypeScript 示例
├── configs/                     # 不同配置示例
│   ├── config-react.js          # React preset 配置（旧 JSX 转换）
│   ├── config-react-automatic.js # React preset 配置（新 JSX 转换）
│   ├── config-typescript.js     # TypeScript preset 配置
│   └── config-combined.js       # 多个 preset 组合配置
└── outputs/                     # 编译输出目录
    ├── react/                   # React 配置的输出
    ├── react-automatic/         # React 新 JSX 转换的输出
    ├── typescript/              # TypeScript 配置的输出
    └── combined/                # 组合配置的输出
```
