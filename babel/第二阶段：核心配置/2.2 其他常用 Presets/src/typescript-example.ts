// TypeScript 示例
// 演示 TypeScript 语法特性

// 1. 基本类型注解
const name: string = 'Babel';
const age: number = 25;
const isActive: boolean = true;
const items: string[] = ['a', 'b', 'c'];

// 2. 接口定义
interface User {
    id: number;
    name: string;
    email?: string; // 可选属性
    readonly createdAt: Date; // 只读属性
}

// 3. 类型别名
type StatusType = 'pending' | 'approved' | 'rejected';
type ID = number | string;

// 4. 函数类型注解
function greet(user: User): string {
    return `Hello, ${user.name}!`;
}

const add = (a: number, b: number): number => {
    return a + b;
};

// 5. 泛型
function identity<T>(arg: T): T {
    return arg;
}

interface Container<T> {
    value: T;
}

// 6. 类定义
class Animal {
    private name: string;
    protected age: number;
    public species: string;

    constructor(name: string, age: number, species: string) {
        this.name = name;
        this.age = age;
        this.species = species;
    }

    public getName(): string {
        return this.name;
    }
}

class Dog extends Animal {
    constructor(name: string, age: number) {
        super(name, age, 'Canine');
    }

    public bark(): void {
        console.log('Woof!');
    }
}

// 7. 枚举
enum Color {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
}

enum Status {
    Pending,
    Approved,
    Rejected,
}

// 8. 类型断言
const someValue: unknown = 'this is a string';
const strLength: number = (someValue as string).length;

// 9. 联合类型和交叉类型
type StringOrNumber = string | number;
type Person = { name: string } & { age: number };

// 10. 工具类型
type PartialUser = Partial<User>;
type RequiredUser = Required<User>;
type UserName = Pick<User, 'name' | 'email'>;
type UserWithoutId = Omit<User, 'id'>;

// 11. 函数重载
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number {
    if (typeof value === 'string') {
        return value.toUpperCase();
    }
    return value * 2;
}

// 12. 装饰器（需要额外配置）
// @decorator
// class MyClass {}

// 使用示例
const user: User = {
    id: 1,
    name: 'John',
    createdAt: new Date(),
};

const result = greet(user);
const sum = add(5, 3);
const dog = new Dog('Buddy', 3);

// 导出
export { User, Animal, Dog, Color, Status, greet, add, identity, process };

export default user;
