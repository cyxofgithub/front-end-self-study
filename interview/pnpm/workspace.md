# pnpm workspace 如何使用

## 什么是 workspace

**pnpm workspace** 是 pnpm 内置的 **Monorepo** 解决方案，允许在单个仓库中管理多个项目/包，共享依赖并相互引用。

## 配置步骤

### 1. 创建根目录配置文件

**pnpm-workspace.yaml**（根目录）：

```yaml
packages:
    - 'packages/*'
    - 'apps/*'
    - 'tools/*'
```

### 2. 项目结构示例

```
monorepo/
├── pnpm-workspace.yaml
├── package.json
├── pnpm-lock.yaml
├── packages/
│   ├── ui/              # 共享 UI 组件库
│   │   └── package.json
│   └── utils/           # 工具函数库
│       └── package.json
└── apps/
    ├── web/             # Web 应用
    │   └── package.json
    └── mobile/          # 移动端应用
        └── package.json
```

### 3. 根目录 package.json

```json
{
    "name": "monorepo",
    "private": true,
    "scripts": {
        "dev": "pnpm --filter './apps/*' dev",
        "build": "pnpm --filter './packages/*' build"
    }
}
```

## 常用命令

### 安装依赖

```bash
# 为所有 workspace 安装依赖
pnpm install

# 为特定 workspace 安装依赖
pnpm --filter <package-name> add <dependency>

# 为所有 workspace 添加依赖
pnpm -w add <dependency>

# 为特定 workspace 添加开发依赖
pnpm --filter web add -D typescript
```

### 运行脚本

```bash
# 运行特定 workspace 的脚本
pnpm --filter web dev

# 运行多个 workspace 的脚本
pnpm --filter web --filter mobile dev

# 运行所有 workspace 的脚本
pnpm --filter './apps/*' dev

# 并行运行（使用 -r）
pnpm -r --parallel dev
```

### 本地包引用

在 workspace 中引用本地包：

```json
// apps/web/package.json
{
    "dependencies": {
        "@monorepo/ui": "workspace:*",
        "@monorepo/utils": "workspace:^1.0.0"
    }
}
```

**版本协议：**

-   `workspace:*` - 使用 workspace 中的任意版本
-   `workspace:^` - 使用兼容版本
-   `workspace:~` - 使用近似版本

## 实际使用示例

### 示例 1：创建共享包

```bash
# 1. 创建 packages/ui 目录
mkdir -p packages/ui
cd packages/ui

# 2. 初始化 package.json
pnpm init

# 3. 编辑 package.json
```

```json
// packages/ui/package.json
{
    "name": "@monorepo/ui",
    "version": "1.0.0",
    "main": "index.js"
}
```

### 示例 2：在应用中使用共享包

```json
// apps/web/package.json
{
    "name": "web",
    "dependencies": {
        "@monorepo/ui": "workspace:*"
    }
}
```

```javascript
// apps/web/src/App.js
import { Button } from '@monorepo/ui';
```

### 示例 3：过滤命令

```bash
# 只构建 packages 下的所有包
pnpm --filter './packages/*' build

# 排除某个包
pnpm --filter '!web' build

# 运行依赖关系中的包
pnpm --filter '...web' build  # web 及其所有依赖
pnpm --filter 'web...' build  # web 及其所有依赖者
```

## 高级特性

### 1. 依赖提升控制

**根目录 .npmrc：**

```
# 提升所有依赖到根目录
shamefully-hoist=true

# 只提升部分依赖
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
```

### 2. 并行执行

```bash
# 并行运行所有 workspace 的 build
pnpm -r --parallel build

# 限制并发数
pnpm -r --parallel --workspace-concurrency=2 build
```

### 3. 递归执行

```bash
# -r 表示递归执行所有 workspace
pnpm -r exec -- echo "Hello from workspace"

# 执行特定命令
pnpm -r exec -- pnpm test
```

## 优势

1. **统一依赖管理**：所有 workspace 共享依赖，减少重复
2. **本地包引用**：无需发布即可使用本地包
3. **原子性操作**：安装、更新等操作对所有 workspace 生效
4. **高效过滤**：灵活的命令过滤机制
5. **配置简单**：只需一个 `pnpm-workspace.yaml` 文件

## 劣势

1. **学习成本**：相较 npm/yarn workspace，pnpm 的依赖隔离和符号链接机制更复杂，上手需要一定学习成本
2. **生态兼容性问题**：部分依赖包或工具对文件路径有假设，可能与 pnpm 的 node_modules 结构不兼容，偶尔需要额外配置
3. **调试不便**：依赖被严格隔离后，调试“幽灵依赖”相关问题更直接但也可能暴露原有隐藏问题，初期迁移时容易踩坑
4. **部分插件/脚本兼容问题**：某些低层脚本、打包工具或 IDE 插件不能很好识别 pnpm 的节点结构，需关注适配情况

## 注意事项

1. **根目录必须是 private**：避免意外发布
2. **版本管理**：本地包使用 `workspace:*` 协议
3. **依赖提升**：根据项目需求配置 `.npmrc`
4. **性能考虑**：大型 monorepo 注意过滤命令范围

## 总结

pnpm workspace 通过简单的配置和强大的过滤机制，提供了高效的 Monorepo 管理方案，特别适合多包项目和大型前端工程。
