# Lerna

## 一、什么是 Lerna

**Lerna** 是一个用于管理**多包（monorepo）** JavaScript 项目的工具，通过统一管理多个相关包，简化版本发布和依赖管理。

## 二、核心功能

1. **统一版本管理**：支持固定模式（所有包同一版本）和独立模式（各包独立版本）
2. **依赖提升**：将公共依赖提升到根目录，减少重复安装
3. **批量操作**：支持在所有包中批量执行命令（如 `lerna run test`）
4. **变更检测**：只构建/发布发生变更的包，提升效率
5. **链接管理**：自动处理包之间的依赖链接关系

## 三、基本使用

### 初始化

```bash
# 安装
npm install -g lerna

# 初始化（固定模式）
lerna init

# 初始化（独立模式）
lerna init --independent
```

### 常用命令

```bash
# 创建新包
lerna create <package-name>

# 安装依赖（提升到根目录）
lerna bootstrap

# 运行所有包的脚本
lerna run <script>

# 执行命令（如测试）
lerna exec -- <command>

# 发布变更的包
lerna publish

# 查看变更的包
lerna changed

# 查看所有包
lerna list
```

## 四、工作模式

### 固定模式（Fixed Mode）

-   所有包共享同一版本号
-   适合紧密耦合的包
-   版本号在 `lerna.json` 的 `version` 字段统一管理

### 独立模式（Independent Mode）

-   每个包独立维护版本号
-   适合松散耦合的包
-   版本号在各包的 `package.json` 中管理

## 五、与 npm/yarn workspaces 对比

| 特性     | Lerna             | npm/yarn workspaces |
| -------- | ----------------- | ------------------- |
| 版本管理 | 支持统一/独立版本 | 不支持版本管理      |
| 发布流程 | 自动化发布流程    | 需手动发布          |
| 变更检测 | 内置变更检测      | 需配合工具          |
| 依赖管理 | 依赖提升 + 链接   | 依赖提升            |

**现代趋势**：Lerna 5.0+ 已重构，专注于版本管理和发布，依赖管理推荐使用 npm/yarn/pnpm workspaces。

## 总结

1. **核心价值**：Lerna 是 monorepo 的版本管理和发布工具，核心解决多包项目的**统一发布**和**变更检测**问题
2. **适用场景**：管理多个相关 npm 包的项目，需要统一版本或独立版本发布
3. **最佳实践**：Lerna 5.0+ 配合 npm/yarn workspaces 使用，Lerna 负责发布，workspaces 负责依赖管理
