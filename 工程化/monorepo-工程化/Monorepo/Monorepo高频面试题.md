# Monorepo 高频面试题

> 3-5 年企业微信难度

---

## 一、原理理解类

### 1.1 pnpm workspace 软硬链接原理

**问题**：pnpm workspace 是如何解决幽灵依赖问题的？与 yarn/npm workspaces 有什么区别？

**参考答案**：

- pnpm 用硬链接复用全局 store，用软连接构建 node_modules 目录结构，只有显式声明的依赖才会被软链到根目录，未声明的子依赖无法被访问，从根源上避免幽灵依赖。
- yarn/npm 用扁平化将子依赖提升到顶层，虽然方便但允许访问未声明的依赖。

```plaintext
# pnpm：只有显式依赖在根 node_modules
node_modules/
└── react → .pnpm/react@18.2.0/node_modules/react  # 软链

# yarn：子依赖被提升，可以访问
node_modules/
├── react/
└── loose-envify/  # 幽灵依赖，可以直接 import
```

---

### 1.2 Turbo Build 缓存机制

**问题**：Turbo 是如何实现增量构建的？hash 计算规则是什么？

**参考答案**：

- Turbo 根据任务的「所有输入」计算内容哈希，包括：源码文件、依赖版本、环境变量、任务配置等。只要输入没变，输出就直接从缓存复用。
- 缓存命中流程：计算 hash → 查询本地/远程缓存 → 命中则跳过执行 → 未命中则执行后上传缓存。

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],  // 依赖上游包的 build
      "outputs": ["dist/**"]   // 输出目录，用于缓存
    }
  }
}
```

---

### 1.3 依赖循环检测与解决

**问题**：Monorepo 中如何检测和解决包之间的循环依赖？

**参考答案**：

- **检测**：运行 `pnpm ls --cycle` 或 Turbo 的 `turbo run --dry-run=json` 分析任务图，Nx 内置循环检测。
- **解决**：
  1. 提取公共逻辑到新包
  2. 用 DI/插件机制解耦
  3. 调整架构边界

```bash
# pnpm 检测循环依赖
pnpm ls --cycle
```

---

### 1.4 workspace 协议行为

**问题**：`workspace:*`、`workspace:^1.0.0`、`workspace:~1.0.0` 有什么区别？

**参考答案**：

| 协议 | 语义 | 示例 |
|------|------|------|
| `workspace:*` | 始终指向当前 workspace 最新版本 | `utils: "workspace:*"` |
| `workspace:^1.0.0` | 匹配大版本相同 | `^1.2.3` 匹配 `1.x.x` |
| `workspace:~1.0.0` | 匹配小版本相同 | `~1.2.3` 匹配 `1.2.x` |

发布时会自动替换为具体版本号。

> 补充说明：`workspace:^` / `workspace:~` 会先校验本地 workspace 包版本是否满足 semver 范围。  
> - 满足：使用本地 workspace 包（通常以 link 方式解析）。  
> - 不满足或本地不存在：安装会失败（`workspace:` 是“仅使用本地包”的强约束，不会回退到远程 registry 下载）。

---

## 二、实践场景类

### 2.1 Monorepo 架构选型

**问题**：什么场景适合使用 Monorepo？什么场景不适合？

**参考答案**：

- **适合**：多应用共享底层包（BFF + Web + Mobile）、组件库、工具库、需要统一规范的中大型团队。
- **不适合**：项目少且独立、团队分散在不同组织、仓库体积已达 Git 性能瓶颈。

| 考量点 | 说明 |
|--------|------|
| 项目规模 | 5+ 包才值得引入 |
| 团队协作 | 跨项目代码共享频繁度 |
| CI/CD 复杂度 | 能否接受统一构建时间 |
| Git 性能 | 仓库超过 5GB 需慎用 |

---

### 2.2 TypeScript 配置差异

**问题**：Monorepo 中不同包有不同的 TypeScript 配置需求，如何处理？

**参考答案**：

- **基础配置**：根目录 `tsconfig.base.json`，统一 compilerOptions。
- **包级配置**：各包独立 `tsconfig.json`，继承 base + 覆盖特殊配置。

```json
// packages/pkg-a/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

---

### 2.3 CI/CD 增量构建

**问题**：Monorepo 项目在 CI/CD 中如何实现只构建变更的包？

**参考答案**：

- **方案一**：Turbo `turbo run build --filter=...affected`
- **方案二**：lerna `lerna changed` 检测变更包
- **方案三**：Nx `nx affected:build`

```bash
# Turbo：只构建受影响的包
turbo run build --filter=...HEAD

# lerna：查看哪些包有变更
lerna changed
```

---

### 2.4 跨包调试

**问题**：在 Monorepo 中，如何在开发时调试其他包的代码？

**参考答案**：

一句话：**跨包调试的关键是“应用读源码 + 依赖包持续 watch”**，这样改 `packages/*` 能立刻在 `apps/*` 生效。

```mermaid
flowchart LR
  A[修改 packages/utils/src] --> B[utils watch 增量编译]
  B --> C[apps/web dev server 感知变更]
  C --> D[HMR/刷新看到结果]
```

1. **推荐做法（源码联调）**
   - 应用侧把依赖包 alias 到 `src`，而不是 `dist`。
   - 依赖包开启 `watch`（tsup/tsc/vite 任一都可以），持续产出 sourcemap。
   - 这样断点可直接打在依赖包源码，定位问题最快。

2. **最小启动方式**

```bash
# 方式一：在仓库根目录并行启动（推荐）
turbo run dev --parallel

# 方式二：分别启动
pnpm --filter @my-org/utils dev
pnpm --filter web dev
```

3. **最小配置示例（Vite + TS）**

```ts
// apps/web/vite.config.ts
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      // 开发期直接指向源码，跨包改动可即时调试
      '@my-org/utils': path.resolve(__dirname, '../../packages/utils/src'),
    },
  },
  server: {
    // 某些场景下 monorepo 跨目录监听需要显式放开
    fs: { allow: ['../..'] },
  },
})
```

```json
// apps/web/tsconfig.json（示意）
{
  "compilerOptions": {
    "paths": {
      "@my-org/utils": ["../../packages/utils/src/index.ts"]
    }
  }
}
```

4. **为什么有时“改了不生效”**
   - alias 还指向 `dist`：你改的是 `src`，应用读的是旧产物。
   - 依赖包没开 watch：应用拿不到最新构建结果。
   - 没开 sourcemap：断点会飘到编译产物，调试体验差。
   - Vite/webpack 没放开 monorepo 外层目录监听：文件变更事件没被捕获。

5. **面试表达模板（30 秒）**
   - “我会让应用在开发期直接消费依赖包源码，并把依赖包跑在 watch 模式；再用 turbo 并行启动所有 dev 任务。这样跨包修改能 HMR，断点也能命中源码。若不生效，我优先检查 alias 是否指向 src、watch 是否启动、sourcemap 和文件监听范围是否正确。”

---

## 三、优化策略类

### 3.1 构建性能优化

**问题**：Monorepo 构建太慢，如何优化？

**参考答案**：

1. **远程缓存**：配置 Turbo Remote Cache 或 Nx Cloud
2. **并行任务**：Turbo 默认并行，依赖 `dependsOn` 自动拓扑排序
3. **增量构建**：确保 `outputs` 配置正确，避免全量重跑
4. **依赖优化**：减少跨包依赖层级，避免循环

```json
// turbo.json 优化示例
{
  "globalDependencies": [".env"],  // 环境变量加入 hash
  "pipeline": {
    "build": {
      "outputs": ["dist/**", "!.tsbuildinfo"],
      "cache": true
    }
  }
}
```

---

### 3.2 类型共享

**问题**：Monorepo 中如何实现类型共享，避免重复定义？

**参考答案**：

- **方案一**：抽取公共 types 包，各包依赖它
- **方案二**：TypeScript Project References，实现跨包类型检查

```json
// packages/pkg-a/tsconfig.json
{
  "references": [
    { "path": "../types" }
  ]
}
```

---

### 3.3 包体积优化

**问题**：Monorepo 中如何控制各包的体积，避免无用代码打入？

**参考答案**：

- **Tree-shaking**：确保包是 ESM 格式，配置 sideEffects
- **按需导入**：UI 组件库用按需导入（unplugin-vue-components）
- **外部化依赖**：在构建时将公共依赖（react、lodash）external

```json
// packages/ui/package.json
{
  "sideEffects": false,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs"
}
```

---

### 3.4 开发体验优化

**问题**：如何优化 Monorepo 项目的开发体验？

**参考答案**：

| 优化点 | 方案 |
|--------|------|
| **Hot Reload** | 各包独立 watch 模式，Vite HMR |
| **跨包类型检查** | `pnpm -r typecheck` 或 `nx run-many -t typecheck` |
| **Lint 统一** | `turbo run lint`，统一 ESLint/Prettier |
| **VSCode 支持** | 根目录 `pnpm install` 生成 workspace symlink |

---

## 四、架构设计类

### 4.1 包划分策略

**问题**：Monorepo 中如何合理划分包的边界？

**参考答案**：

- **按业务域**：订单、用户、支付等独立包
- **按角色**：components、hooks、utils、api 等通用包
- **按应用**：web、mobile、admin 等入口包
- **原则**：高内聚、低耦合，单一职责，避免跨包循环依赖

---

### 4.2 版本管理策略

**问题**：Monorepo 中多个包如何管理版本号？

**参考答案**：

- **固定版本**：所有包同步发版，适合强耦合项目
- **独立版本**：各包独立版本，适合松耦合
- **混杂模式**：核心包固定版本，业务包独立

```bash
# lerna 独立模式
lerna version --conventional-commits --no-private

# lerna 固定模式
lerna version minor
```

---

## 五、参考答案汇总

| 类别 | 核心考点 |
|------|----------|
| **原理** | pnpm 软硬链接、Turbo 缓存、依赖循环 |
| **实践** | 选型决策、TS 配置、CI/CD 增量 |
| **优化** | 构建性能、类型共享、包体积 |
| **架构** | 包划分、版本管理 |
