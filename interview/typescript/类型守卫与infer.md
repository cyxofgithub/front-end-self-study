# 类型守卫与 infer

本文档说明 **类型守卫**（运行时条件 + 类型收窄）与 **`infer` 关键字**在条件类型中的常见应用。工具类型 ReturnType、Parameters、UnionToIntersection 等详见 [类型体操](./类型体操.md)。

---

## 一、类型守卫

**结论**：在运行时做条件判断，让 TypeScript 在对应分支内收窄类型，保证类型安全。

```mermaid
flowchart LR
  wide[宽类型 Union/unknown] --> guard[类型守卫判断]
  guard --> narrow1[分支内窄类型 A]
  guard --> narrow2[分支内窄类型 B]
```

### 1. typeof

收窄基本类型：`string`、`number`、`boolean`、`undefined`、`symbol`、`bigint`、`function`、`object`（注意 `typeof null === 'object'`，需单独处理）。

```typescript
function pad(s: string | number): string {
  if (typeof s === 'number') return String(s).padStart(2, '0');
  return s.padStart(2, '0'); // s 被收窄为 string
}
```

### 2. instanceof

收窄类或构造函数实例。

```typescript
class Cat { meow() {} }
class Dog { bark() {} }

function act(animal: Cat | Dog) {
  if (animal instanceof Cat) animal.meow();
  else animal.bark(); // animal 被收窄为 Dog
}
```

### 3. in

通过属性是否存在收窄对象类型。

```typescript
type Bird = { fly: () => void };
type Fish = { swim: () => void };

function move(animal: Bird | Fish) {
  if ('fly' in animal) animal.fly();
  else animal.swim(); // animal 被收窄为 Fish
}
```

### 4. 自定义类型谓词（`arg is T`）

函数返回 `arg is T`，在调用处收窄类型；适用于复杂逻辑或无法用 typeof/instanceof/in 表达的情况。

```typescript
function isString(x: unknown): x is string {
  return typeof x === 'string';
}

function handle(x: unknown) {
  if (isString(x)) {
    console.log(x.toUpperCase()); // x 被收窄为 string
  }
}
```

### 5. 可辨识联合（Discriminated Union）

用公共字面量字段（如 `kind`）区分联合成员，在分支里自然收窄。

```typescript
type Success = { kind: 'success'; data: string };
type Error = { kind: 'error'; message: string };
type Result = Success | Error;

function show(r: Result) {
  if (r.kind === 'success') {
    console.log(r.data);   // r 收窄为 Success
  } else {
    console.log(r.message); // r 收窄为 Error
  }
}
```

---

## 二、infer 关键字应用

**结论**：在条件类型的 `extends` 右侧声明「待推断类型变量」，从匹配到的位置拆出类型；仅能在条件类型中使用。

```mermaid
flowchart LR
  T[类型 T] --> match[匹配模式]
  match --> infer[infer 位置]
  infer --> out[拆出的类型]
```

### 语法与约束

- 写法：`T extends SomePattern<infer X> ? X : never`。
- 若 `T` 能匹配 `SomePattern<...>`，就从该位置推断出类型赋给 `X`；否则走 `never` 分支。
- `infer` 只能出现在条件类型的 `extends` 右侧，不能单独使用。

### 常见推断位置

| 位置 | 模式示例 | 典型用途 |
|------|----------|----------|
| 函数返回值 | `T extends (...args: any[]) => infer R ? R : never` | ReturnType |
| 函数参数 | `T extends (...args: infer P) => any ? P : never` | Parameters |
| 构造函数参数/实例 | `new (...args: infer P) => any` / `=> infer R` | ConstructorParameters、InstanceType |
| Promise 泛参 | `T extends Promise<infer U> ? U : T` | 解包 Promise |
| 数组元素 | `T extends (infer E)[] ? E : never` | 元组/数组元素类型 |

```typescript
// 函数返回类型
type GetReturn<T> = T extends (...args: any[]) => infer R ? R : never;

// Promise 解包
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type A = UnwrapPromise<Promise<number>>; // number

// 数组元素类型
type ArrayItem<T> = T extends (infer E)[] ? E : never;
type B = ArrayItem<string[]>; // string
```

内置工具类型 **ReturnType、Parameters、ConstructorParameters、InstanceType** 以及 **UnionToIntersection**（参数位 infer + 逆变）的完整实现与推导见 [类型体操](./类型体操.md)。参数位置的 `infer` 与逆变的关系见 [协变逆变与父子类型](./协变逆变与父子类型.md)。

---

## 小结

| 能力 | 作用层面 | 典型用法 |
|------|----------|----------|
| 类型守卫 | 运行时判断 + 类型收窄 | typeof、instanceof、in、`is T`、可辨识联合 |
| infer | 类型层从结构中拆类型 | 条件类型中推断返回值、参数、Promise 泛参、数组元素等 |

扩展阅读：[类型体操](./类型体操.md)（DeepPartial、UnionToIntersection、ReturnType 等）、[协变逆变与父子类型](./协变逆变与父子类型.md)（参数 infer 与逆变）。
