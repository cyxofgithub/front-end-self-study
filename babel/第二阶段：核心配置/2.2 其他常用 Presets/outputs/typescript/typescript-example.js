"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.add = exports.Status = exports.Dog = exports.Color = exports.Animal = void 0;
exports.greet = greet;
exports.identity = identity;
exports.process = process;
// TypeScript 示例
// 演示 TypeScript 语法特性

// 1. 基本类型注解
const name = 'Babel';
const age = 25;
const isActive = true;
const items = ['a', 'b', 'c'];

// 2. 接口定义

// 3. 类型别名

// 4. 函数类型注解
function greet(user) {
  return "Hello, ".concat(user.name, "!");
}
const add = (a, b) => {
  return a + b;
};

// 5. 泛型
exports.add = add;
function identity(arg) {
  return arg;
}
// 6. 类定义
class Animal {
  constructor(name, age, species) {
    this.name = name;
    this.age = age;
    this.species = species;
  }
  getName() {
    return this.name;
  }
}
exports.Animal = Animal;
class Dog extends Animal {
  constructor(name, age) {
    super(name, age, 'Canine');
  }
  bark() {
    console.log('Woof!');
  }
}

// 7. 枚举
exports.Dog = Dog;
var Color = exports.Color = /*#__PURE__*/function (Color) {
  Color["Red"] = "red";
  Color["Green"] = "green";
  Color["Blue"] = "blue";
  return Color;
}(Color || {});
var Status = exports.Status = /*#__PURE__*/function (Status) {
  Status[Status["Pending"] = 0] = "Pending";
  Status[Status["Approved"] = 1] = "Approved";
  Status[Status["Rejected"] = 2] = "Rejected";
  return Status;
}(Status || {}); // 8. 类型断言
const someValue = 'this is a string';
const strLength = someValue.length;

// 9. 联合类型和交叉类型

// 10. 工具类型

// 11. 函数重载

function process(value) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value * 2;
}

// 12. 装饰器（需要额外配置）
// @decorator
// class MyClass {}

// 使用示例
const user = {
  id: 1,
  name: 'John',
  createdAt: new Date()
};
const result = greet(user);
const sum = add(5, 3);
const dog = new Dog('Buddy', 3);

// 导出
var _default = exports.default = user;