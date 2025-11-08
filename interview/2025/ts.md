## typescript

### 1、基础概念题

#### TypeScript 和 JavaScript 的区别？

-   静态类型检查：TypeScript 在编译时检查类型，JavaScript 在运行时检查
-   面向对象特性：TypeScript 支持接口、泛型、枚举等
-   编译过程：TypeScript 需要编译成 JavaScript
-   开发体验：更好的 IDE 支持和错误提示

#### TypeScript 的优势？

-   类型安全，减少运行时错误
-   更好的代码提示和重构支持
-   更好的团队协作和代码维护

### 2、类型系统题

#### TypeScript 类型有哪些？

7 种基础类型：

-   undefined、null：默认情况下，它们是所有类型的子类型，可赋值给其他类型。
    若开启 strictNullChecks 编译选项，则只能赋值给 any、unknown 和自身。
-   boolean
-   number
-   string
-   symbol
-   bigint：

```typescript
// bigint后面的n就是标识作用，理解起来是跟bigint一样
// 注意不能和 number 类型混合计算
let largeNum: bigint = 9007199254740991n;
```

4 种特殊类型：

-   any：任意类型不推荐滥用，可绕过类型检查
-   unknown：表示未知类型，必须先断言或缩小类型范围才能使用（比 any 安全）

```typescript
let value: unknown = 'hello';
if (typeof value === 'string') {
    value.toUpperCase(); // 合法
}
```

-   void: 表示没有返回值的函数，或变量只能赋值为 undefined 或 null（在 strictNullChecks 下只能是 undefined）
-   never: 表示永远不会出现的值，常用于抛出异常或死循环函数

1 种引用类型：
与 JavaScript 类似，但 TypeScript 提供了更精确的类型定义：

-   object
-   数组类型
-   元组（Tuple）

```typescript
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ['a', 'b'];
```

-   函数类型
-   类
-   接口（Interface）
-   枚举（Enum）

```typescript
function throwError(message: string): never {
    throw new Error(message);
}
```

### 3、接口和类型题

#### interface 和 type 的区别？

```typescript
// interface：只能定义对象类型，可以合并声明、继承
interface User {
    name: string;
    age: number;
}

interface User {
    email: string; // 合并声明
}

// type：可以定义任何类型，不能合并声明
type UserType = {
    name: string;
    age: number;
};

// 联合类型
type Status = 'loading' | 'success' | 'error';

// 函数类型
type Handler = (event: string) => void;
```

#### 如何实现接口的继承和实现？

```typescript
// 接口继承
interface Animal {
    name: string;
}

interface Dog extends Animal {
    bark(): void;
}

// 类实现接口
class Labrador implements Dog {
    constructor(public name: string) {}

    bark(): void {
        console.log('Woof!');
    }
}
```

### 4、泛型题

#### 什么是泛型？如何使用？

可以理解成接口参数化、类型可以当作参数传入

```typescript
// 泛型函数
function identity<T>(arg: T): T {
    return arg;
}

// 泛型接口
interface Container<T> {
    value: T;
    getValue(): T;
}

// 泛型类
class Queue<T> {
    private data: T[] = [];

    push(item: T): void {
        this.data.push(item);
    }

    pop(): T | undefined {
        return this.data.shift();
    }
}
```

#### 泛型约束是什么？

可以限制传入的类型

```typescript
// 泛型约束
interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

// 使用
logLength('hello'); // OK
logLength([1, 2, 3]); // OK
// logLength(123); // Error!
```

### 5、高级类型题

#### 什么是联合类型和交叉类型？

```typescript
// 联合类型：或
type Status = 'loading' | 'success' | 'error';
type NumberOrString = number | string;

// 交叉类型：且
interface Person {
    name: string;
}

interface Employee {
    id: number;
}

type EmployeePerson = Person & Employee;
// 等价于 { name: string; id: number; }
```

#### 什么是映射类型？

```typescript
// 映射类型
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type Partial<T> = {
    [P in keyof T]?: T[P];
};

// 使用
interface User {
    name: string;
    age: number;
}

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number; }

type PartialUser = Partial<User>;
// { name?: string; age?: number; }
```

#### 条件类型是什么？

可以根据类型关系进行条件判断，实现类型推导、转换和过滤。通过结合 infer 关键字、分布式特性和内置条件类型，可以构建出高度灵活和强大的类型系统。

```typescript
// 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;

type T0 = NonNullable<string | number | null>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]

// 分布式条件类型
// 当条件类型作用于泛型类型参数时，如果传入的是联合类型，则会自动分发到每个成员。例如：
type ToArray<T> = T extends any ? T[] : never;
type T2 = ToArray<string | number>; // string[] | number[]

// 条件类型中的类型推导
// 使用infer关键字可以在条件类型中提取类型信息并绑定到新的类型变量：
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type D = GetReturnType<() => string>; // string
type E = GetReturnType<(x: number) => boolean>; // boolean
```

### 6、装饰器题

#### 什么是装饰器？如何使用？

可以在不改变原有类、方法或属性逻辑的基础上，对其进行功能扩展或修改，有类装饰器、方法装饰器、属性装饰器

##### 介绍

类装饰器：

```typescript
function sealed(constructor: Function) {
    // object.seal可以密封类
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class Example {
    public message = 'Hello';
}

// 尝试扩展 Example 类会报错，因为类已经被密封
class SubExample extends Example {}
```

方法装饰器：

```typescript
function readonly(target: any, key: string, descriptor: PropertyDescriptor) {
    descriptor.writable = false;
    return descriptor;
}

class Person {
    @readonly
    public name = 'Bob';
}

const person = new Person();
person.name = 'Tom';
// 这行代码在运行时不会报错，但实际上无法修改 name 属性的值，因为它已经被装饰器设置为只读
```

属性装饰器：

```typescript
function logProperty(target: any, key: string) {
    let _val = target[key];

    const getter = function() {
        console.log(`Getting value of ${key}:`, _val);
        return _val;
    };

    const setter = function(newVal) {
        console.log(`Setting value of ${key} to:`, newVal);
        _val = newVal;
    };

    if (delete target[key]) {
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    }
}

class Product {
    @logProperty
    public price: number;

    constructor(price: number) {
        this.price = price;
    }
}

const product = new Product(100);
product.price = 120;
```

##### 使用场景

日志装饰器：

```typescript
// 日志记录装饰器
function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
        // 调用前记录参数
        console.log(`[LOG] 调用方法: ${propertyKey}, 参数:`, args);

        try {
            // 执行原方法
            const result = originalMethod.apply(this, args);

            // 调用后记录返回值
            console.log(`[LOG] 方法 ${propertyKey} 返回:`, result);
            return result;
        } catch (error) {
            // 异常处理
            console.error(`[ERROR] 方法 ${propertyKey} 抛出异常:`, error);
            throw error;
        }
    };

    return descriptor;
}

// 使用示例
class UserService {
    @LogMethod
    getUserById(id: number) {
        console.log(`正在获取用户 ID: ${id}`);
        return { id, name: 'John', role: 'admin' };
    }

    @LogMethod
    deleteUser(id: number) {
        if (id <= 0) {
            throw new Error('无效的用户 ID');
        }
        console.log(`删除用户 ID: ${id}`);
    }
}

// 测试
const service = new UserService();
service.getUserById(123);
// 输出:
// [LOG] 调用方法: getUserById, 参数: [123]
// 正在获取用户 ID: 123
// [LOG] 方法 getUserById 返回: { id: 123, name: 'John', role: 'admin' }

service.deleteUser(-1);
// 输出:
// [LOG] 调用方法: deleteUser, 参数: [-1]
// [ERROR] 方法 deleteUser 抛出异常: Error: 无效的用户 ID
```

### 7、模块和命名空间题

#### 模块和命名空间的区别？

**模块是** TypeScript 中组织代码的主要方式，使用 import 和 export 语法。特点：

-   使用 ES6 模块语法
-   每个文件都是一个模块
-   支持树摇优化 (tree shaking)
-   更好的代码分割和懒加载

**命名空间**是 TypeScript 特有的概念，使用 namespace 关键字。特点：

-   使用 namespace 关键字
-   可以嵌套定义
-   编译后是 IIFE (立即执行函数)
-   主要用于组织代码，避免全局污染

| 特性     | 模块             | 命名空间                     |
| -------- | ---------------- | ---------------------------- |
| 语法     | import/export    | namespace                    |
| 文件组织 | 每个文件一个模块 | 可在同一文件定义多个命名空间 |
| 编译结果 | ES6 模块         | IIFE                         |
| 树摇优化 | 支持             | 不支持                       |
| 代码分割 | 支持             | 不支持                       |
| 现代标准 | 是               | 否                           |

### 8、配置和编译题

#### tsconfig.json 的重要配置项？

```json
{
    "compilerOptions": {
        // ===== 面试常考配置 =====
        "target": "ES2020", // 编译目标版本
        "module": "ESNext", // 模块系统
        "moduleResolution": "node", // 模块解析策略
        "strict": true, // 严格模式
        "esModuleInterop": true, // ES模块互操作
        "skipLibCheck": true, // 跳过库检查
        "declaration": true, // 生成声明文件
        "sourceMap": true, // 生成源码映射
        "baseUrl": "./src", // 基础路径
        "paths": {
            // 路径映射
            "@/*": ["*"]
        },
        "outDir": "./dist", // 输出目录
        "rootDir": "./src" // 根目录
    },
    "include": ["src/**/*"], // 包含文件
    "exclude": ["node_modules", "dist"] // 排除文件
}
```

### 9、实际应用题

#### 如何处理第三方库的类型？

-   安装官方 @types 包（推荐）
-   创建自定义类型定义文件，如：

```typescript
// 扩展 React 的类型
declare module 'react' {
    interface ReactElement {
        customProperty?: string;
    }
}

// 使用扩展的类型
import React from 'react';
const element = React.createElement('div') as React.ReactElement & {
    customProperty: string;
};
```

-   使用类型断言（临时方案）
-   使用 any 类型（最后选择）

#### 如何处理动态引入

```typescript
// 动态导入
const module = await import('./dynamic-module');
```

#### 什么是模块增强

```typescript
// 扩展现有模块
declare module 'express' {
    interface Request {
        user?: User;
    }
}
```

#### 如何实现类型安全的 API 调用？

约束入参和响应

### 10、性能优化题

#### 如何优化 TypeScript 编译性能？

| 优化策略                           | 效果     | 适用场景   |
| ---------------------------------- | -------- | ---------- |
| 增量编译（incremental）            | 大幅提升 | 大型项目   |
| 跳过库检查（skipLibCheck）         | 中等提升 | 所有项目   |
| 项目引用                           | 显著提升 | 多包项目   |
| 具体导入                           | 小幅提升 | 使用大型库 |
| SWC 编译 （swcMinify: true）       | 大幅提升 | 现代项目   |
| 并行编译（tsc --build --parallel） | 中等提升 | 多核环境   |

**什么是项目引用**

拆分项目为独立模块：将代码库拆分为多个相互依赖的子项目（每个子项目有独立的 tsconfig.json）。

```json
my-project/
├── packages/
│   ├── utils/
│   │   ├── src/
│   │   ├── tsconfig.json  # 子项目1
│   ├── api/
│   │   ├── src/
│   │   ├── tsconfig.json  # 子项目2，依赖 utils
├── tsconfig.base.json     # 共享配置
└── tsconfig.json          # 根配置
```

这样隔离构建上下文每个子项目的编译上下文独立，好处：

-   缓存机制（增量编译）减少重复工作。
-   可以并行编译利用多核 CPU。
-   隔离构建上下文降低内存占用。

**什么是具体导入**

```typescript
// 具体导入减少内存占用
import { debounce } from 'lodash';
// 内存中只加载 debounce 相关的类型定义

// 对比：导入整个库
import _ from 'lodash';
// 内存中需要加载整个 lodash 的类型定义
```

**swc 为什么块？**

| 维度   | TypeScript    | SWC        | 提升        |
| ------ | ------------- | ---------- | ----------- |
| 语言   | JavaScript    | Rust       | 10-70x 更快 |
| 并发   | 单线程        | 多线程     | 并行编译    |
| 内存   | 垃圾回收      | 零成本抽象 | 减少 60-80% |
| 专注点 | 类型检查+编译 | 纯编译     | 速度优先    |

#### 如何处理大型项目的类型定义？

-   分层架构：全局核心类型、业务私有类型、API 类型分离
-   模块化组织：按功能模块组织类型文件
-   命名规范：使用清晰的命名约定
-   类型推导：尽可能利用 TypeScript 的类型推导能力，不要重复写
-   文档注释：为复杂类型添加详细注释
-   统一导出：工具库可以统一入口统一导出@types 包（有的项目是 js 不需要 types），（应用就按照业务结构组织即可不必要统一导出）
