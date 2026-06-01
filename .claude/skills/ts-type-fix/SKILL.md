---
name: ts-type-fix
description: 生成或修改 TypeScript 文件后，自动检查类型报错并修复。在编辑 .ts/.tsx 文件时触发。
---

# TypeScript 类型报错自动修复

## 触发条件

- 生成新的 `.ts` / `.tsx` 文件时。
- 编辑已有 `.ts` / `.tsx` 文件时。

## 执行步骤

1. 对修改涉及的 TypeScript 文件执行类型检查（优先使用项目 `pnpm exec tsc --noEmit`，需 `tsconfig.json` 存在）。
2. 若存在类型报错，**立即在当轮对话中自动修复**，不得仅列出错误或交给用户手动改。
3. 修复后再次执行类型检查，确保无新增报错。

## 修复优先级

1. 补全类型注解、修正泛型或重载。
2. 调整实现以满足类型约束。
3. 使用类型断言（`as T`）时在旁注释原因。
4. 避免 `// @ts-ignore`，确需使用时须注释说明理由。

## 示例

```typescript
// ❌ 不推荐：留类型错误不修
const data = fetchSomething(); // 类型为 unknown 或 any，未标注
data.id; // 可能报错

// ✅ 推荐：补全类型或断言并验证通过
interface Result {
    id: string;
}
const data = fetchSomething() as Result;
data.id;
```
