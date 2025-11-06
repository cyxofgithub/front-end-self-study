Zod 是一个 **TypeScript 优先的模式验证库**，主要用于在 JavaScript/TypeScript 项目中对数据进行类型检查和验证。它的核心特点是通过定义「模式（schema）」来描述数据的结构和约束，并基于模式在**运行时**验证数据合法性，同时还能自动生成**TypeScript 类型**，实现「一次定义，类型与验证双保障」。

### 核心优势

1. **TypeScript 深度集成**：定义的模式会自动推导为 TypeScript 类型，无需手动编写重复的类型定义，减少冗余代码。
2. **运行时验证**：在代码运行时（如处理 API 输入、表单提交、配置文件等场景）校验数据是否符合预期，避免因数据格式错误导致的运行时异常。
3. **简洁的 API**：语法直观，易于上手，支持链式调用定义复杂规则。
4. **灵活性**：支持基本类型、对象、数组、联合类型、交叉类型等，还可自定义验证逻辑。

### 基本用法

#### 1. 安装

```bash
npm install zod
# 或
yarn add zod
```

#### 2. 定义模式并验证

通过 `zod` 提供的方法（如 `z.string()`、`z.number()` 等）定义模式，再用 `parse` 或 `safeParse` 方法验证数据。

```typescript
import { z } from 'zod';

// 定义一个用户模式：name 是字符串，age 是大于 18 的数字
const UserSchema = z.object({
    name: z.string(),
    age: z.number().min(18, '年龄必须大于 18'), // 附加约束
});

// 自动生成 TypeScript 类型（无需手动定义 interface）
type User = z.infer<typeof UserSchema>;
// type User = { name: string; age: number }

// 验证数据
const validData = { name: 'Alice', age: 20 };
const result1 = UserSchema.safeParse(validData);
if (result1.success) {
    console.log('验证通过：', result1.data); // { name: "Alice", age: 20 }
}

const invalidData = { name: 'Bob', age: 16 };
const result2 = UserSchema.safeParse(invalidData);
if (!result2.success) {
    console.log('验证失败：', result2.error.issues);
    // 输出：[{ code: 'too_small', message: '年龄必须大于 18', path: ['age'] }]
}
```

-   `parse(data)`：直接验证数据，若失败会**抛出异常**。
-   `safeParse(data)`：安全验证，返回一个包含 `success` 字段的对象，成功时 `data` 为验证后的数据，失败时 `error` 包含错误信息（推荐使用，避免异常中断流程）。

### 常用特性

1. **基本类型验证**：支持字符串、数字、布尔值、null、undefined 等，可附加约束（如字符串长度、数字范围）。

    ```typescript
    const NameSchema = z.string().min(2).max(10); // 字符串长度 2-10
    const ScoreSchema = z.number().int().positive(); // 正整数
    ```

2. **对象与嵌套结构**：定义复杂对象，支持可选字段、默认值。

    ```typescript
    const PostSchema = z.object({
        title: z.string(),
        content: z.string().optional(), // 可选字段
        author: UserSchema, // 嵌套其他模式
        tags: z.array(z.string()).default([]), // 默认值为空数组
    });
    ```

3. **联合类型**：支持数据为多种类型中的一种（如「字符串或数字」）。

    ```typescript
    const IdSchema = z.string().or(z.number()); // id 可以是字符串或数字
    ```

4. **自定义验证**：通过 `refine` 定义复杂业务规则。

    ```typescript
    const EmailSchema = z
        .string()
        .refine((val) => val.includes('@'), {
            message: '必须是有效的邮箱地址',
        });
    ```

5. **数组验证**：约束数组长度、元素类型等。
    ```typescript
    const NumberListSchema = z.array(z.number()).min(1).max(5); // 数组长度 1-5，元素为数字
    ```

### 典型应用场景

-   **API 数据验证**：前后端交互时，验证请求参数或响应数据是否符合预期（如前端请求后端前校验，或后端接收请求后校验）。
-   **表单验证**：替代传统表单校验逻辑，结合框架（如 React、Vue）实现类型安全的表单处理。
-   **配置文件校验**：验证 JSON 配置文件的格式和约束，确保应用启动时配置合法。
-   **数据转换**：通过 `transform` 方法在验证时同步转换数据（如字符串转数字）。

### 与其他库的对比

相比 Yup、Joi 等传统验证库，Zod 的最大优势是**TypeScript 原生支持**：模式定义与类型推导无缝衔接，无需额外维护类型和验证规则的一致性。对于 TypeScript 项目，Zod 是更自然的选择。

总之，Zod 是一个兼顾「类型安全」和「运行时验证」的工具，能显著提升代码的健壮性，尤其适合需要严格数据校验的场景（如 API 开发、表单处理等）。
