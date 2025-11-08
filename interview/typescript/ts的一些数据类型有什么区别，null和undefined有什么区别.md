## 关于 null 和 undefined 的区别如下：

-   null：表示一个空的或不存在的值。它是一个特殊的关键字，表示变量被明确赋值为空。可以将 null 赋值给任何类型的变量。
-   undefined：表示一个未定义的值。当变量声明但未初始化时，默认为 undefined。也可以将 undefined 赋值给任何类型的变量。

## ts 基本类型区别：

在 TypeScript 中，以下是一些常见的数据类型及其区别：

-   number：表示数字类型，包括整数和浮点数。

-   string：表示字符串类型，用于表示文本数据。

-   boolean：表示布尔类型，只能取 true 或 false。

-   symbol: 符号类型，用于创建唯一的对象属性键。

写法:

```javascript
const key = Symbol('a');
```

-   object：表示对象类型，可以包含多个属性和方法。

-   array：表示数组类型，用于存储多个相同类型的元素。

-   tuple：表示元组类型，用于表示固定长度和类型的数组。

```typescript
const a = [string, number, boolean];
```

-   enum：表示枚举类型，用于定义一组命名常量。

-   any：表示任意类型，可以赋予任何类型的值。

-   void：表示没有返回值的类型，常用于函数没有返回值的情况。

-   never：表示永远不会有返回值的类型，常用于抛出异常或无限循环的函数。

```typescript
function error(message: string): never {
    throw new Error(message);
}
```

```typescript
function loop(): never {
    while (true) {
        // do something
    }
}
```
