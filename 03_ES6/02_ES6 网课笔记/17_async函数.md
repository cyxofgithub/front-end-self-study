# async函数

# ES6 async 函数

## 1. 含义

`ES2017` 标准引入了`async` 函数，使得异步操作变得更加方便。

async 函数是什么？一句话，它就是 `Generator` 函数的`语法糖`。

前文有一个 Generator 函数，依次读取两个文件。



```javascript
const fs = require('fs');


const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};


const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

上面代码的函数 `gen` 可以写成 `async` 函数，就是下面这样。



```javascript
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

一比较就会发现， async 函数就是将 Generator 函数的星号（ * ）替换成 async ，将 yield 替换成 await ，仅此而已。

async 函数对 Generator 函数的改进，体现在以下四点。

（1）内置执行器。

Generator 函数的执行必须靠执行器，所以才有了 co 模块，而 async 函数自带执行器。也就是说， async 函数的执行，与普通函数一模一样，只要一行。



```javascript
asyncReadFile();
```

上面的代码调用了 asyncReadFile 函数，然后它就会自动执行，输出最后结果。这完全不像 Generator 函数，需要调用 next 方法，或者用 co 模块，才能真正执行，得到最后结果。

（2）更好的语义。

async 和 await ，比起星号和 yield ，语义更清楚了。 async 表示函数里有异步操作， await 表示紧跟在后面的表达式需要等待结果。

（3）更广的适用性。

co 模块约定， yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。

（4）返回值是 Promise。

async 函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用 then 方法指定下一步的操作。

进一步说， async 函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而 await 命令就是内部 then 命令的语法糖。

## 2. 基本用法（主要看这里）

`async` 函数返回一个 `Promise`对象，可以使用 `then`方法添加回调函数。当函数执行的时候，一旦遇到 await 就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

下面是一个例子。



```javascript
async function getStockPriceByName(name) {
  const symbol = await getStockSymbol(name);
  const stockPrice = await getStockPrice(symbol);
  return stockPrice;
}


getStockPriceByName('goog').then(function (result) {
  console.log(result);
});
```

上面代码是一个获取股票报价的函数，函数前面的 async 关键字，表明该函数内部有异步操作。调用该函数时，会立即返回一个 Promise 对象。

下面是另一个例子，指定多少毫秒后输出一个值。



```javascript
function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}


asyncPrint('hello world', 50);
```

上面代码指定 50 毫秒以后，输出 hello world 。

由于 async 函数返回的是 Promise 对象，可以作为 await 命令的参数。所以，上面的例子也可以写成下面的形式。



```javascript
async function timeout(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}


asyncPrint('hello world', 50);
```

async 函数有多种使用形式。



```javascript
// 函数声明
async function foo() {}


// 函数表达式
const foo = async function () {};


// 对象的方法
let obj = { async foo() {} };
obj.foo().then(...)


// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }


  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}


const storage = new Storage();
storage.getAvatar('jake').then(…);


// 箭头函数
const foo = async () => {};
```



## 3. 语法（还有这里）

async 函数的语法规则总体上比较简单，难点是错误处理机制。



### 返回 Promise 对象

`async` 函数返回一个`Promise`对象。

`async` 函数内部`return` 语句返回的值，会成为`then` 方法回调函数的参数。



```javascript
async function f() {
  return 'hello world';
}


f().then(v => console.log(v))
// "hello world"
```

上面代码中，函数 f 内部 return 命令返回的值，会被 then 方法回调函数接收到。

`async` 函数内部抛出错误，会导致返回的 `Promise` 对象变为`reject`状态。抛出的错误对象会被 `catch`方法回调函数接收到。



```javascript
async function f() {
  throw new Error('出错了');
}


f().then(
  v => console.log(v),
  e => console.log(e)
)
// Error: 出错了
```



### Promise 对象的状态变化

`async`函数返回的 Promise 对象，必须等到内部所有 await 命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到 return 语句或者抛出错误。也就是说，只有 async 函数内部的异步操作执行完，才会执行 then 方法指定的回调函数。

下面是一个例子。



```javascript
async function getTitle(url) {
  let response = await fetch(url);
  let html = await response.text();
  return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}
getTitle('https://tc39.github.io/ecma262/').then(console.log)
// "ECMAScript 2017 Language Specification"
```

上面代码中，函数 `getTitle` 内部有三个操作：`抓取网页`、`取出文本`、`匹配页面标题`。只有这三个操作全部完成，才会执行 then 方法里面的 console.log 。



### await 命令

正常情况下， `await` 命令后面是一个`Promise`对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。



```javascript
async function f() {
  // 等同于
  // return 123;
  return await 123;
}


f().then(v => console.log(v))
// 123
```

上面代码中， await 命令的参数是数值 123 ，这时等同于 return 123 。

另一种情况是， await 命令后面是一个 thenable 对象（即定义了 then 方法的对象），那么 await 会将其等同于 Promise 对象。



```javascript
class Sleep {
  constructor(timeout) {
    this.timeout = timeout;
  }
  then(resolve, reject) {
    const startTime = Date.now();
    setTimeout(
      () => resolve(Date.now() - startTime),
      this.timeout
    );
  }
}


(async () => {
  const sleepTime = await new Sleep(1000);
  console.log(sleepTime);
})();
// 1000
```

上面代码中， await 命令后面是一个 Sleep 对象的实例。这个实例不是 Promise 对象，但是因为定义了 then 方法， await 会将其视为 Promise 处理。

这个例子还演示了如何实现休眠效果。JavaScript 一直没有休眠的语法，但是借助 await 命令就可以让程序停顿指定的时间。下面给出了一个简化的 sleep 实现。



```javascript
function sleep(interval) {
  return new Promise(resolve => {
    setTimeout(resolve, interval);
  })
}


// 用法
async function one2FiveInAsync() {
  for(let i = 1; i <= 5; i++) {
    console.log(i);
    await sleep(1000);
  }
}


one2FiveInAsync();
```

await 命令后面的 Promise 对象如果变为 reject 状态，则 reject 的参数会被 catch 方法的回调函数接收到。



```javascript
async function f() {
  await Promise.reject('出错了');
}


f()
.then(v => console.log(v))
.catch(e => console.log(e))
// 出错了
```

注意，上面代码中， await 语句前面没有 return ，但是 reject 方法的参数依然传入了 catch 方法的回调函数。这里如果在 await 前面加上 return ，效果是一样的。

任何一个 await 语句后面的 Promise 对象变为 reject 状态，那么整个 async 函数都会中断执行。



```javascript
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}
```

上面代码中，第二个 await 语句是不会执行的，因为第一个 await 语句状态变成了 reject 。

有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个 await 放在 try...catch 结构里面，这样不管这个异步操作是否成功，第二个 await 都会执行。



```javascript
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}


f()
.then(v => console.log(v))
// hello world
```

另一种方法是 await 后面的 Promise 对象再跟一个 catch 方法，处理前面可能出现的错误。



```javascript
async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}


f()
.then(v => console.log(v))
// 出错了
// hello world
```

w3c还有很多详细的没看

![image-20210727172449557](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210727172449557.png)

