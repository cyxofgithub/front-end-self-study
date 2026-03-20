## constructor 方法

在 JavaScript 中，prototype.constructor 是原型对象上的一个属性，它的核心作用是指向创建该原型对应实例的构造函数本身。
**具体作用解析：**

1. 标识对象的 “创造者”（构造函数）每个通过构造函数创建的实例对象，其原型链上都会继承 constructor 属性，该属性指向最初创建它的构造函数。通过这个属性，可以判断一个实例对象是由哪个构造函数生成的。

```javascript
// 定义构造函数
function Person(name) {
    this.name = name;
}
// 创建实例
const p = new Person('Alice');

// p的原型链上的constructor指向Person
console.log(p.constructor === Person); // true
```

2. 用于创建新实例

```javascript
const p1 = new Person('Bob');
// 通过p1的constructor获取构造函数，创建新实例
const p2 = new p1.constructor('Charlie');
console.log(p2 instanceof Person); // true（p2是Person的实例）
```

3. 维护原型链的完整性

```javascript
function Person() {}
// 重写原型
Person.prototype = {
    sayHi: function () {
        console.log('hi');
    },
};
const p = new Person();
console.log(p.constructor === Person); // false（此时指向Object）
```

修复方式：

```javascript
function Person() {}
Person.prototype = {
    constructor: Person, // 手动指定constructor指向原构造函数
    sayHi: function () {
        console.log('hi');
    },
};
const p = new Person();
console.log(p.constructor === Person); // true（修复后正确）
```

注意点：

-   constructor 是原型对象的属性，实例对象本身不直接拥有该属性，而是通过原型链继承而来。
-   constructor 是可写的（可以被修改），但通常不建议随意修改，否则可能破坏类型判断的逻辑。

总结：prototype.constructor 的核心价值是建立实例与构造函数之间的关联，确保原型链的逻辑完整性，方便类型判断和实例创建。
