// ES6+ 语法示例文件
// 包含各种现代 JavaScript 特性

// 1. 箭头函数
const arrowFunction = () => {
    console.log('箭头函数');
};

// 2. const/let
const PI = 3.14159;
let count = 0;

// 3. 模板字符串
const name = 'Babel';
const message = `Hello, ${name}!`;

// 4. 解构赋值
const obj = { a: 1, b: 2, c: 3 };
const { a, b } = obj;
const arr = [1, 2, 3, 4, 5];
const [first, second] = arr;

// 5. 扩展运算符
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
const obj1 = { x: 1, y: 2 };
const obj2 = { ...obj1, z: 3 };

// 6. 默认参数
function greet(name = 'Guest') {
    return `Hello, ${name}!`;
}

// 7. 类（Class）
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        return `${this.name} makes a sound`;
    }
}

class Dog extends Animal {
    speak() {
        return `${this.name} barks`;
    }
}

// 8. Promise
const fetchData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Data fetched');
        }, 1000);
    });
};

// 9. async/await
async function getData() {
    try {
        const data = await fetchData();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

// 10. Array 方法（需要 polyfill）
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);
const filtered = numbers.filter((n) => n > 2);
const sum = numbers.reduce((acc, n) => acc + n, 0);

// 11. Object 方法（需要 polyfill）
const entries = Object.entries(obj);
const values = Object.values(obj);
const keys = Object.keys(obj);

// 12. String 方法（需要 polyfill）
const str = 'hello';
const includes = str.includes('he');
const startsWith = str.startsWith('h');
const endsWith = str.endsWith('o');

// 13. Array.from（需要 polyfill）
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
const newArray = Array.from(arrayLike);

// 14. 可选链和空值合并（ES2020）
const user = {
    profile: {
        name: 'John',
        address: {
            city: 'Beijing',
        },
    },
};
const city = user?.profile?.address?.city ?? 'Unknown';

// 15. 使用 Promise.all
Promise.all([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]).then(
    (results) => {
        console.log('All promises resolved:', results);
    }
);

// 导出
export { arrowFunction, Animal, Dog, getData };
export default {
    PI,
    count,
    message,
};
