## js 核心原理

资源库：https://juejin.cn/post/6946136940164939813#heading-0

### this

#### this 指向

[点击这里](./js/this指向.md)

#### call、apply、bind 原理

[点击这里](./js/call、apply、bind原理.md)

### 原型链

每个对象都有个隐藏属性[prototype]即这个对象的原型，在代码用[__proto__]读取，原型向上查找的终点是 null

当我们查询一个节点属性时我们会先从对象自身查找，查询不到会沿着原型链查找，如果还没找到返回 undefined

一些使用场景：

模拟继承

```javascript
// 创建一个「动物」原型
const animal = {
    eat() {
        console.log('正在吃东西');
    },
};

// 创建一个「猫」原型，继承自 animal
const cat = {
    meow() {
        console.log('喵喵叫');
    },
};
cat.__proto__ = animal; // cat 的原型是 animal

// 创建一个具体的猫
const myCat = {
    name: '小花',
};
myCat.__proto__ = cat; // myCat 的原型是 cat

// myCat 可以使用所有层级的方法！
myCat.eat(); // 输出：正在吃东西（来自 animal）
myCat.meow(); // 输出：喵喵叫（来自 cat）
console.log(myCat.name); // 输出：小花（自己的属性）
```

### 闭包

#### 概念

闭包的本质是「函数对外部词法环境的持久引用」。它让 JavaScript 函数突破了「执行完就销毁」的限制

#### 形成条件

当一个函数 A 在另一个函数 B 内部定义，并且 A 引用了 B 中的变量，同时 A 被 B 外部的代码引用时，形成闭包

底层原理：本质是保持引用，躲避了 js 垃圾回收机制的标记清除

应用场景：

-   数据私有化：控制变量访问权限，避免全局污染；
-   状态持久化：让函数能「记住」一些信息（如防抖中的定时器、计数器的计数）
-   模块化基础：早期实现代码隔离的核心方式。
-

#### 常见风险：内存泄漏

```javascript
function createHandler() {
    const dom = document.querySelector('#box'); // 引用DOM
    return function() {
        console.log(dom.innerHTML); // 闭包持有dom的引用
    };
}

const handler = createHandler();
// 即使#box被从页面移除，由于handler（闭包）还引用着dom，dom也不会被回收
```

解决方式：不再需要闭包时，手动解除引用（赋值为 null），让 GC 能回收资源：

```javascript
handler = null; // 解除闭包引用，dom 和外部执行上下文可被回收
```

#### 循环中的闭包陷阱

```javascript
// 问题代码：想让每个按钮点击后输出对应的索引
for (var i = 0; i < 3; i++) {
    document.createElement('button').onclick = function() {
        console.log(i); // 点击任何按钮都输出3（因为var声明的i是全局的，循环结束后i=3）
    };
}
```

原因：var 声明的 i 在全局作用域，三个闭包（点击事件函数）都引用同一个 i，循环结束后 i=3。

解决方式：

-   用 let（块级作用域，每次循环创建新的 i）；
-   用闭包「固化」每次的 i 值

```javascript
for (var i = 0; i < 3; i++) {
    (function(j) {
        // 立即执行函数，每次传入当前i作为j（j是函数参数，每次循环是新的）
        document.createElement('button').onclick = function() {
            console.log(j); // 正常输出0、1、2
        };
    })(i);
}
```

### 垃圾回收机制

js 的垃圾回收机制是自动回收，不像 c++那样需要手动释放内存，其回收的机制主要是通过分代回收（Generational GC） + 标记清楚来实现

v8 引擎会将内存分成两个部分，新生代（Young Generation）/老生代（Old Generation）

#### 新生代（Young Generation）比较简单主要用于：

-   存放短期对象（如函数局部变量）。
-   机制是使用复制算法：内存分为两个区域（From 和 To），每次只使用一个。当 From 区满时，将存活对象复制到 To 区，清空 From 区。
-   特点：回收速度快，适合频繁创建和销毁的对象。
-

#### 老生代（Old Generation）：

-   存放长期存活的对象（如全局变量、闭包）。
-   使用标记清除 + 标记整理：定期扫描老生代，回收不可达对象，并整理内存碎片。
-   特点：回收频率低，但耗时较长。

**标记阶段：**
从根对象（如全局变量）出发，遍历所有可达对象（通过引用链能访问到的对象），标记为 “存活”。根对象包括：

-   全局变量（如 window 对象）；
-   闭包；
-   浏览器中的 DOM 节点等。

**清除阶段：**

-   遍历整个内存空间，回收未被标记的对象（即不可达对象）。

**优化：标记整理（Mark-Compact**

-   部分现代引擎（如 V8）在清除后会进行内存整理，将存活对象移动到连续内存区域，减少碎片化。

### 作用域

#### 类型

-   全局作用域
-   局部作用域（函数）
-   块级作用域：let 和 const 声明的变量拥有块级作用域，也就是说它们只能在当前代码块（如 if、for、while 等）内被访问。

#### 变量提升

#### var 和 let const 区别

1、作用域规则：

-   var：具有函数作用域，在函数内部声明的变量可以在整个函数内访问，而在函数外部声明的变量则是全局变量。
-   let 和 const：具有块级作用域，只能在声明它们的代码块（如 if, for, while 等）内被访问。

```javascript
var a = 1;
if (true) {
    var a = 2;
    console.log(a);
}
console.log(a);
// 输出2、2，因为var没有块级作用域
```

2、变量提升：

-   var：存在变量提升，变量会被提升到函数或全局作用域的顶部，但初始值为 undefined。
-   let 和 const：虽然也会被提升，但在声明之前访问会导致 TDZ（暂时性死区） 错误。

```javascript
console.log(a); // ✅ 输出 undefined（var 提升）
var a = 1;

console.log(b); // ❌ 报错：Cannot access 'b' before initialization（TDZ）
let b = 2;
```

题目：

```javascript
let a = 1;

if (true) {
    console.log(a); // 报错暂时性死区
    let a = 2;
}
```

3、重新赋值与修改：const 只能在初始化时赋值

4、重复声明

-   var：在同一作用域内可以重复声明同名变量。
-   let 和 const：在同一作用域内重复声明会报错。

```javascript
var a = 1;
var a = 2; // ✅ 允许重复声明

let b = 3;
let b = 4; // ❌ 报错：Identifier 'b' has already been declared
```

5. 全局作用域行为
   var：在全局作用域中声明的变量会成为 window 对象的属性。
   let 和 const：在全局作用域中声明的变量不会成为 window 对象的属性。

```javascript
var globalVar = 'global';
console.log(window.globalVar); // ✅ 输出 'global'

let globalLet = 'block';
console.log(window.globalLet); // ❌ 输出 undefined
```

### 事件循环

#### 定义

事件循环（Event Loop）是专门处理异步任务的机制，同步代码在事件循环开始之前就已经执行完了。

#### 完整流程

浏览器（2 个阶段）： 宏任务 -> 微任务

```typescript
while (true) {
    // 1. 执行同步代码(本质是第一个宏任务、通常是 script 标签，script 标签本身就是宏任务)
    // 2. 执行所有微任务
    // 3. 执行一个宏任务
    // 4. 渲染（如果需要）
}
```

Node.js：6 个阶段 timers → pending → idle → poll → check → close（每个阶段结束后都会执行微任务）

```typescript
while (true) {
    // 1. 执行同步代码(本质是第一个宏任务、当 Node.js 执行主文件时，这就是第一个宏任务)
    // 2、procee.nextTrick
    // 3. 执行所有微任务
    // 4、开始6个阶段
    // 阶段1: timers
    // 执行到期的 setTimeout/setInterval 回调
    // 检查 nextTick 队列 → 执行所有 nextTick
    // 检查微任务队列 → 执行所有微任务
    // 阶段2: pending callbacks
    // 执行延迟的 I/O 回调
    // 检查 nextTick 队列 → 执行所有 nextTick
    // 检查微任务队列 → 执行所有微任务
    // 阶段3: idle, prepare
    // 内部使用
    // 检查 nextTick 队列 → 执行所有 nextTick
    // 检查微任务队列 → 执行所有微任务
    // 阶段4: poll
    // 获取新的 I/O 事件，执行 I/O 回调
    // 检查 nextTick 队列 → 执行所有 nextTick
    // 检查微任务队列 → 执行所有微任务
    // 阶段5: check
    // 执行 setImmediate 回调
    // 检查 nextTick 队列 → 执行所有 nextTick
    // 检查微任务队列 → 执行所有微任务
    // 阶段6: close callbacks
    // 执行关闭事件回调
    // 检查 nextTick 队列 → 执行所有 nextTick
    // 检查微任务队列 → 执行所有微任务
}
```

#### 任务优先级分类

浏览器：

```typescript（3种）
// 优先级从高到低
1. 同步代码
2. 微任务 (Micro Task)
   - Promise.then/catch/finally
   - queueMicrotask
   - MutationObserver
3. 宏任务 (Macro Task)
   - setTimeout/setInterval
   - requestAnimationFrame
   - I/O 操作
   - UI 渲染
```

node(4 种)：

```javascript
// 优先级从高到低
1. 同步代码
2. process.nextTick (Node.js 特有)
3. 微任务 (Micro Task)
   - Promise.then/catch/finally
   - queueMicrotask
4. 宏任务 (Macro Task)
   - setImmediate (Node.js 特有)
   - setTimeout/setInterval
   - I/O 操作
```

#### 特殊 API

##### requestIdleCallback

```javascript
// requestIdleCallback 在浏览器空闲时执行
// 具体时机：渲染完成后，下一个事件循环开始前

console.log('1. 同步代码');

setTimeout(() => {
    console.log('2. 宏任务');
}, 0);

Promise.resolve().then(() => {
    console.log('3. 微任务');
});

requestIdleCallback(() => {
    console.log('4. requestIdleCallback');
});

console.log('5. 同步代码结束');

// 输出：1 5 3 2 4
// 解释：
// 1. 同步代码：1, 5
// 2. 微任务：3
// 3. 宏任务：2
// 4. requestIdleCallback：4 (空闲时间)
```

##### requestAnimationFrame

````javascript
// requestAnimationFrame 在渲染阶段执行
// 具体时机：微任务执行完毕后，浏览器渲染之前

console.log('1. 同步代码');

setTimeout(() => {
    console.log('2. 宏任务');
}, 0);

Promise.resolve().then(() => {
    console.log('3. 微任务');
});

requestAnimationFrame(() => {
    console.log('4. requestAnimationFrame');
});

console.log('5. 同步代码结束');

// 输出：1 5 3 4 2
// 解释：
// 1. 同步代码：1, 5
// 2. 微任务：3
// 3. requestAnimationFrame：4 (渲染阶段)
// 4. 宏任务：2
```

### 手写 promise.all/promise.race

```javascript
class CustomPromise {
    /**
     * 实现 Promise.all
     * @template T 泛型参数，用于保持每个 Promise 的返回类型
     * @param promises Promise 数组
     * @returns 返回一个新的 Promise，resolve 所有结果，或 reject 第一个错误
     */
    public static all<T>(promises: Promise<T>[]): Promise<T[]> {
        return new Promise((resolve, reject) => {
            // 处理空数组的情况
            if (promises.length === 0) {
                resolve([]);
                return;
            }

            const results: T[] = new Array(promises.length);
            let completedCount = 0;
            let hasRejected = false;

            // 使用 for...of 替代 forEach，性能更好
            for (let i = 0; i < promises.length; i++) {
                // 包装非 Promise 值
                Promise.resolve(promises[i])
                    .then((result) => {
                        if (hasRejected) return;

                        results[i] = result;
                        completedCount++;

                        if (completedCount === promises.length) {
                            resolve(results);
                        }
                    })
                    .catch((error) => {
                        if (hasRejected) return;
                        hasRejected = true;
                        reject(error);
                    });
            }
        });
    }

    /**
     * 实现 Promise.race
     * @template T 泛型参数，用于保持每个 Promise 的返回类型
     * @param promises Promise 数组
     * @returns 返回一个新的 Promise，resolve 或 reject 最快的结果
     */
    public static race<T>(promises: Promise<T>[]): Promise<T> {
        return new Promise((resolve, reject) => {
            // 处理空数组的情况
            if (promises.length === 0) {
                return;
            }

            let settled = false;

            // 使用 for...of 替代 forEach，性能更好
            for (const promise of promises) {
                // 包装非 Promise 值
                Promise.resolve(promise)
                    .then((result) => {
                        if (settled) return;
                        settled = true;
                        resolve(result);
                    })
                    .catch((error) => {
                        if (settled) return;
                        settled = true;
                        reject(error);
                    });
            }
        });
    }
}

const promise1 = new Promise((res) => setTimeout(() => res("asd"), 1000));
const promise2 = new Promise((res) => setTimeout(() => res(2), 2000));
const promise3 = new Promise((res) => setTimeout(() => res(3), 1000));
const promise4 = new Promise((res, rej) => setTimeout(() => rej(4), 500));

const case1 = [promise1, promise2, promise3];
const case2 = [promise1, promise2, promise3, promise4];

// promise.all test case
Promise.all(case1)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

CustomPromise.all(case1)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

Promise.all(case2)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

CustomPromise.all(case2)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

// promise.race test case
Promise.race(case1)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

CustomPromise.race(case1)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

Promise.race(case2)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

CustomPromise.race(case2)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

```

### 深拷贝

```javascript
function deepCopy(obj: any): any {
    const map = new WeakMap();

    const process = (_obj: any): any => {
        // 处理基本类型
        if (_obj === null || typeof _obj !== 'object') {
            return _obj;
        }

        // 处理循环引用
        if (map.has(_obj)) {
            return map.get(_obj);
        }

        // 处理数组
        if (Array.isArray(_obj)) {
            const result: any[] = [];
            map.set(_obj, result);

            for (let i = 0; i < _obj.length; i++) {
                result[i] = process(_obj[i]);
            }

            return result;
        }

        // 处理对象
        const result: Record<string, any> = {};
        map.set(_obj, result);

        const keys = Object.keys(_obj);
        keys.forEach(key => {
            result[key] = process(_obj[key]);
        });

        return result;
    };

    return process(obj);
}

// 创建一个包含循环引用的对象示例
const a: any = {
    value: 123,
};
const b: any = { parent: a };
a.child = b;

// {
//     value: 123,
//     child: {
//         parent:a
//     }
// }
const copyValue = deepCopy(a);
console.log('🚀 ~ copyValue:', copyValue);
```

#### 深浅拷贝的区别

[看这里](./2021前端面试秋招.md) 搜：浅拷贝和深拷贝区别

### 防抖/节流

#### 防抖（Debounce）

核心思想：等待用户停止操作后再执行

使用场景：

-   搜索框实时搜索：用户停止输入 300ms 后才发送请求
-   表单自动保存： 用户停止编辑 1 秒后自动保存
-   按钮防重复点击：点击后 1 秒内无法再次提交
-   窗口 resize 事件：用户停止拖拽窗口后重新计算布局

#### 节流（Throttle）

核心思想：固定时间间隔内只执行一次

使用场景：

-   滚动事件处理：每 100ms 最多执行一次滚动处理
-   鼠标移动事件：每 16ms（约 60fps）更新一次鼠标位置
-   API 请求限流：每秒最多调用一次 API
-   游戏中的技能冷却：技能每 2 秒只能使用一次

#### 示例

```javascript
class Util {
    public static debounce(fn: (...args: any[]) => any, wait: number) {
        let timer;
        let lastArgs;
        let lastThis;

        return function (this: any, ...args: any) {
            lastArgs = args;
            lastThis = this;

            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                fn.apply(lastThis || {}, lastArgs);
                timer = lastArgs = lastThis = null;
            }, wait);
        };
    }

    public static throttle(fn: (...args: any[]) => any, wait: number) {
        let timer;
        let lastArgs;
        let lastThis;

        return function (this: any, ...args: any) {
            if (!timer) {
                // 开始的时候立即执行一次
                fn.apply(this || {}, args);

                timer = setTimeout(() => {
                    // 等待期间再一次调用则执行
                    if (lastArgs) {
                        fn.apply(lastThis || {}, lastArgs);
                        lastArgs = lastThis = null;
                    }
                    timer = null;
                }, wait);
            } else {
                lastThis = this;
                lastArgs = args;
            }
        };
    }
}

const obj: Record<string, any> = {
    value: "value",
};
const debouncedFn = Util.debounce(function (text: string) {
    console.log(this.value);
    console.log("Debounced:", text, Date.now());
    return text.length;
}, 1000);

obj.fn = debouncedFn;

debouncedFn("test1");
debouncedFn("test2");
obj.fn("test3");

// 节流函数测试例子
const throttledFn = Util.throttle(function (text: string) {
    console.log(this.value);
    console.log("Throttled:", text, Date.now());
    return text.length;
}, 1000);

obj.throttleFn = throttledFn;

throttledFn("throttle1");
throttledFn("throttle2");
obj.throttleFn("throttle3");
throttledFn("throttle4");

obj.throttleFn("throttle5");

```

使用时间戳+定时器的方式实现节流：

```javascript
function advancedThrottle<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let lastExecTime = 0;

    return function(this: any, ...args: Parameters<T>) {
        const now = Date.now();

        // 第一次立即执行
        if (now - lastExecTime >= delay) {
            fn.apply(this, args);
            lastExecTime = now;
        } else if (!timerId) {
            timerId = setTimeout(() => {
                fn.apply(this, args);
                lastExecTime = Date.now();
                timerId = null;
            }, delay - (now - lastExecTime)); // 每delay ms执行一次
        }
    };
}
```

### 科里化函数

概念：科里化是一种将接受多个参数的函数转换成一系列使用一个参数的函数的技术。

自动科里化函数：

```typescript
function curry(fn: (...args: any[]) => any): (...args: any[]) => any {
    const curried = (...args: any[]) => {
        if (args.length >= fn.length) {
            return fn(...args);
        }

        return function(...moreArgs: any[]) {
            return curried(...args, ...moreArgs);
        };
    };

    return curried;
}

function case1(a: number, b: number, c: number) {
    console.log(a + b + c);
}

// test case
const curried = curry(case1);

curried(1)(2)(3); // 6
curried(2, 2, 3); // 7
curried(8, 2)(3); // 13
```

优势：
1、参数复用 - 可以创建特定用途的函数
2、代码复用 - 减少重复代码
3、函数组合/管道函数 - 更容易组合函数

```typescript
function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
    return function(x: T): T {
        return fns.reduceRight((acc, fn) => fn(acc), x);
    };
}

const addOne = (x: number) => x + 1;
const multiplyByTwo = (x: number) => x * 2;
const square = (x: number) => x * x;

const complexOperation = compose(square, multiplyByTwo, addOne);
console.log(complexOperation(3)); // 64 ((3 + 1) * 2)^2
```

4、部分应用 - 可以预设部分参数
````

### 如何处理循环依赖？
