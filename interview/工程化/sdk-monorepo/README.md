# SDK Monorepo 项目

这是一个使用 pnpm workspace + Rollup 构建的 SDK monorepo 项目示例。

## 项目结构

```
sdk-monorepo/
├── packages/
│   ├── sdk-a/          # SDK A - 支持 ESM、CJS、UMD 格式
│   └── sdk-b/          # SDK B - 仅支持 UMD 格式
└── apps/
    └── demo/           # Vue3 Demo 应用
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 构建 SDK

```bash
# 构建所有 SDK
pnpm build

# 构建特定 SDK
pnpm build:a  # 构建 SDK A
pnpm build:b  # 构建 SDK B
```

### 3. 启动 Demo 应用

```bash
pnpm dev
```

Demo 应用会在 `http://localhost:3000` 启动。

## SDK 说明

### SDK A

- **格式支持**: ESM、CJS、UMD
- **导出内容**:
  - 类型: `SDKAType`
  - 方法: `sdkA(options?: SDKAType): void`

### SDK B

- **格式支持**: UMD（仅）
- **导出内容**:
  - 类型: `SDKBType`
  - 方法: `sdKB(options?: SDKBType): void`

## 使用示例

### 在 Vue3 项目中使用

```typescript
import { sdkA, type SDKAType } from 'sdk-a'
import { sdkB, type SDKBType } from 'sdk-b'

// 使用 SDK A
sdkA({ name: 'test', version: '1.0.0' })

// 使用 SDK B
sdKB({ id: 1, message: 'Hello' })
```

### 在浏览器中使用（UMD）

```html
<script src="./dist/index.umd.js"></script>
<script>
  // SDK A
  SDKA.sdkA({ name: 'test', version: '1.0.0' })
  
  // SDK B
  SDKB.sdkB({ id: 1, message: 'Hello' })
</script>
```

## 开发命令

```bash
# 类型检查
pnpm type-check

# 清理构建产物
pnpm clean

# 启动开发模式（监听文件变化）
cd packages/sdk-a && pnpm dev
```

## 技术栈

- **包管理**: pnpm workspace
- **构建工具**: Rollup
- **类型系统**: TypeScript
- **Demo 框架**: Vue3 + Vite
