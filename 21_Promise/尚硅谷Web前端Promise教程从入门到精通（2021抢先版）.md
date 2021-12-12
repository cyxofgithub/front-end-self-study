# 第 1 章：Promise 的理解和使用

## 1.1. Promise 是什么?

### 1.1.1. 理解

- 抽象表达: 
  - Promise 是一门新的技术(ES6 规范) 
  - Promise 是 JS 中进行异步编程的新解决方案 
    - 备注：旧方案是单纯使用回调函数
- 具体表达: 
  - 从语法上来说: Promise 是一个构造函数
  - 从功能上来说: promise 对象用来封装一个异步操作并可以获取其成功/ 失败的结果值

## 1.2 Promise 的执行流程

![image-20210908110841864](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210908110841864.png)

## 1.3 Promise 状态和对象的值

![image-20210908110741177](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210908110741177.png)

**Promise 的状态**

实例对象中的一个属性 『PromiseState』

* pending  未决定的
* resolved / fullfilled  成功
* rejected  失败
* 状态改变
  * pending 变为 resolved
  * pending 变为 rejected

![image-20210908110255015](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210908110255015.png)

**Promise 对象的值**

- 实例对象中的另一个属性 『PromiseResult』
- 保存着异步任务『成功/失败』的结果，结果只能通过 resolve 或 reject 去修改

## 1.4 Promise 的基本使用

### 2-Promise实践练习-fs模块

```js
const fs = require('fs');

// 回调函数形式
// fs.readFile('./resource/content.txt', (err, data) => {
//     // 如果出错 则抛出错误
//     if(err)  throw err;
//     //输出文件内容
//     console.log(data.toString());
// });

// Promise 形式
let p = new Promise((resolve , reject) => {
    fs.readFile('./resource/content.txt', (err, data) => {
        //如果出错
        if(err) reject(err);
        //如果成功
        resolve(data);
    });
});

//调用 then 
p.then(value=>{
    console.log(value.toString());
}, reason=>{
    console.log(reason);
});
```

### 3-Promise实践练习-AJAX请求

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise 封装 AJAX</title>
    <link crossorigin='anonymous' href="https://cdn.bootcss.com/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <h2 class="page-header">Promise 封装 AJAX 操作</h2>
        <button class="btn btn-primary" id="btn">点击发送 AJAX</button>
    </div>
    <script>
        //接口地址 https://api.apiopen.top/getJoke
        //获取元素对象
        const btn = document.querySelector('#btn');

        btn.addEventListener('click', function(){
            //创建 Promise
            const p = new Promise((resolve, reject) => {
                //1.创建对象
                const xhr = new XMLHttpRequest();
                //2. 初始化
                xhr.open('GET', 'https://api.apiopen.top/getJoke');
                //3. 发送
                xhr.send();
                //4. 处理响应结果
                xhr.onreadystatechange = function(){
                    if(xhr.readyState === 4){
                        //判断响应状态码 2xx   
                        if(xhr.status >= 200 && xhr.status < 300){
                            //控制台输出响应体
                            resolve(xhr.response);
                        }else{
                            //控制台输出响应状态码
                            reject(xhr.status);
                        }
                    }
                }
            });
            //调用then方法
            p.then(value=>{
                console.log(value);
            }, reason=>{
                console.warn(reason);
            });
        });
    </script>
</body>
</html>
```

### 4-Promise封装练习-fs模块

```javascript
/**
 * 封装一个函数 mineReadFile 读取文件内容
 * 参数:  path  文件路径
 * 返回:  promise 对象
 */
function mineReadFile(path){
    return new Promise((resolve, reject) => {
        //读取文件
        require('fs').readFile(path, (err, data) =>{
            //判断
            if(err) reject(err);
            //成功
            resolve(data);
        });
    });
}

mineReadFile('./resource/content.txt')
.then(value=>{
    //输出文件内容
    console.log(value.toString());
}, reason=>{
    console.log(reason);
});
```

### 5-util.promisify方法（记住）

```js
/**
 * util.promisify 方法
 * 可以将异步方法转化为 promise 形式的异步函数
 */
//引入 util 模块
const util = require('util');
//引入 fs 模块
const fs = require('fs');
//返回一个新的函数
let mineReadFile = util.promisify(fs.readFile);

mineReadFile('./resource/content.txt').then(value=>{
    console.log(value.toString());
});
```

### 6-Promise封装AJAX操作

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise封装AJAX操作</title>
</head>
<body>
    <script>
        /**
         * 封装一个函数 sendAJAX 发送 GET AJAX 请求
         * 参数   URL
         * 返回结果 Promise 对象
         */
        function sendAJAX(url){
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'json';
                xhr.open("GET", url);
                xhr.send();
                //处理结果
                xhr.onreadystatechange = function(){
                    if(xhr.readyState === 4){
                        //判断成功
                        if(xhr.status >= 200 && xhr.status < 300){
                            //成功的结果
                            resolve(xhr.response);
                        }else{
                            reject(xhr.status);
                        }
                    }
                }
            });
        }
    
        sendAJAX('http://120.77.156.205:9804/breed/dovecoteOutBill/findBillByDovecoteAndType?baseId=12&dovecoteNumber=A01&type=肉鸽&pageNum=1&pageSize=10')
        .then(value => {
            console.log(value);
        }, reason => {
            console.warn(reason);
        });
    </script>
</body>
</html>
```

## 1.5 Promise API

### 1-Promise的API-then和catch

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise API</title>
</head>
<body>
    <script>
        let p = new Promise((resolve, reject) => {
            reject('error');
        });

        //执行 catch 方法, catch 方法其实就 then 的 onRejected 回调做了一个独立的封装
        p.catch(reason => {
            console.log(reason);
        });
    </script>
</body>
</html>
```

### 2-Promise的API-resolve

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise API - resolve</title>
</head>
<body>
    <script>
        //如果传入的参数为非 Promise 类型的对象, 则返回的结果为成功 promise 对象，值为传入的值
        let p1 = Promise.resolve(521);
        
        //如果传入的参数为 Promise 对象, 则参数的结果决定了 resolve 的结果，失败就是失败，成功就是成功
        let p2 = Promise.resolve(new Promise((resolve, reject) => {
            // resolve('OK');
            reject('Error');
        }));
        console.log(p2);
        p2.catch(reason => {
            console.log(reason);
        })
    </script>
</body>
</html>
```

### 3-Promise的API-reject

- 状态永远是失败

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise API - reject</title>
</head>
<body>
    <script>
        // let p = Promise.reject(521);
        // let p2 = Promise.reject('iloveyou');

        // 就算传入成功的结果，它也不会返回一个成功的 promise 对象，而是将这个成功的 promise 对象作为结果返回
        // 状态依然是失败
        let p3 = Promise.reject(new Promise((resolve, reject) => {
            resolve('OK');
        }));
        
        console.log(p3);
    </script>
</body>
</html>
```

### 4-Promise的API-all

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise API - all</title>
</head>
<body>
    <script>
        let p1 = new Promise((resolve, reject) => {
            reject('OK');
        })
        // let p2 = Promise.resolve('Success');
        let p2 = Promise.reject('Error');
        let p3 = Promise.reject('Error3');
        // let p3 = Promise.resolve('Oh Yeah');
        
        // 如果所有都成功就会返回存有三个成功的结果值的数组，如果有失败的结果返回第一个失败的结果值
        const result = Promise.all([p1, p2, p3]);

        console.log(result);
    </script>
</body>
</html>
```

### 5-Promise的API-race

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise API - race</title>
</head>
<body>
    <script>
        let p1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('OK');
            }, 1000);
        })
        let p2 = Promise.resolve('Success');
        let p3 = Promise.resolve('Oh Yeah');

        // 谁先返回结果就以谁的结果和状态为返回值
        const result = Promise.race([p1, p2, p3]);

        console.log(result);
    </script>
</body>

</html>
```

## 1.6 Promise 关键问题

### 1-如何修改promise对象状态

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise关键问题 - Promise 对象状态改变的方式</title>
</head>
<body>
    <script>
        let p = new Promise((resolve, reject) => {
            //1. 通过 resolve 回调函数
            // resolve('ok'); // pending   => fulfilled (resolved)
            //2. 通过 reject 回调函数
            // reject("error");// pending  =>  rejected 
            //3. 抛出错误
            // throw '出问题了';
        });

        console.log(p);
    </script>
</body>
</html>
```

### 2-能否执行多个回调

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise关键问题 - Promise 指定多个回调</title>
</head>
<body>
    <script>

        // 一个 promise 指定多个成功/失败回调函数, 都会调用吗?
        // 当 promise 改变为对应状态时都会调用
        let p = new Promise((resolve, reject) => {
            // resolve('OK');
        });

        // 指定回调 - 1
        p.then(value => {
            console.log(value);
        });

        // 指定回调 - 2
        p.then(value => {
            alert(value);
        });

        // 既有输出也有弹窗可见指定多可回调也都可被调用
    </script>
</body>
</html>
```

### 3-改变状态与指定回调顺序问题

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise关键问题 - Promise 改变状态与指定回调的顺序问题</title>
</head>
<body>
    <script>
        
        // 如果封装在 promise 对象里的代码是异步操作那么将先指定回调，后改变状态，再执行回调
        // 如果是同步代码，那么将先改变状态，后指定回调，再执行回调
        let p = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('OK');
            }, 1000);
        });

        p.then(value => {
            console.log(value);
        },reason=>{
            
        })
    </script>
</body>
</html>
```

### 4-then方法的返回结果由什么决定

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise关键问题 - Promise then方法的返回结果特点</title>
</head>
<body>
    <script>
        let p = new Promise((resolve, reject) => {
            resolve('ok');
        });
        //执行 then 方法
        let result = p.then(value => {
            // console.log(value);
            //1. 抛出错误  新的 promise 变为 rejected, reason 为抛出的异常
            // throw '出了问题';
            //2. 如果返回的是非 promise 的任意值, 新 promise 变为 resolved, value 为返回的值
            // return 521;
            //3.如果返回的是另一个新 promise, 此 promise 的结果就会成为返回的 promise 的结果
            // return new Promise((resolve, reject) => {
            //     // resolve('success');
            //     reject('error');
            // });
        }, reason => {
            console.warn(reason);
        });

        console.log(result);
    </script>
</body>
</html>
```

### 5-promise如何串联多个任务

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise关键问题 - 如何串联多个任务</title>
</head>
<body>
    <script>
         // (1) promise 的 then() 能返回一个新的 promise, 可以利用 then() 的链式调用
		// (2) 通过 then 的链式调用串连多个同步/异步任务
        let p = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('OK');
            }, 1000);
        });

        p.then(value => {
            return new Promise((resolve, reject) => {
                resolve("success");
            });
        }).then(value => {
            console.log(value); // 这里没有返回值，那么默认就是返回一个值为 undefined，结果为成功的 promise 对象
        }).then(value => {
            console.log(value); // 所以这里会输出 undefined
        })
    </script>
</body>
</html>
```

### 6-异常穿透现象是怎么回事

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise关键问题 - 异常穿透</title>
</head>
<body>
    <script>

        // (1) 当使用 promise 的 then 链式调用时, 可以在最后指定失败的回调, 
        // (2) 前面任何操作出了异常, 都会传到最后失败的回调中处理
        // (3) 不过要注意演示的时候丢出错误地方前面的 promise 都要返回成功回调，因为这样才会执行到抛出错误的哪一步
        let p = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('OK');
                // reject('Err');
            }, 1000);
        });

        p.then(value => {
            // console.log(111);
            throw '失败啦!';
        }).then(value => {
            console.log(222);
        }).then(value => {
            console.log(333);
        }).catch(reason => {
            console.warn(reason);
        });
    </script>
</body>
</html>
```

### 7-如何中断Promise链条

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise关键问题 - 中断 Promise 链条</title>
</head>
<body>
    <script>
        let p = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('OK');
            }, 1000);
        });

        p.then(value => {
            console.log(111);
            // 若想中断链条 有且只有一个方式那就是返回一个 pedding 状态的 promise对象
            // 因为 promise 状态不改变就不会调用 then 方法中指定的回调，链条也就中断了
            return new Promise(() => {});
        }).then(value => {
            console.log(222);
        }).then(value => {
            console.log(333);
        }).catch(reason => {
            console.warn(reason);
        });
    </script>
</body>
</html>
```

## 1.7 Promise 自定义封装

### 1-初始结构搭建

```javascript
function Promise(executor){

}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){

}
```

### 2-resolve与reject结构搭建

```js
//声明构造函数
function Promise(executor){
    //resolve 函数
    function resolve(data){

    }
    //reject 函数
    function reject(data){

    }

    //同步调用『执行器函数』
    executor(resolve, reject);
}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){

}
```

### 3-resolve与reject函数实现

```js
//声明构造函数
function Promise(executor){
    
    //添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    
    //保存实例对象的 this 的值,
    const self = this;// self _this that
    
    //resolve 函数，注意这里直接使用 this 是默认绑定，会指向全局对象，要么使用箭头函数，要么就取到外层 this 指向
    function resolve(data){
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'fulfilled';// resolved
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
    }
    
    //reject 函数
    function reject(data){
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'rejected';// 
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
    }

    //同步调用『执行器函数』
    executor(resolve, reject);
}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){

}
```

### 4-throw抛出错误改变状态

```js
//声明构造函数
function Promise(executor){
    
    //添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    
    //保存实例对象的 this 的值
    const self = this;// self _this that
    
    //resolve 函数
    function resolve(data){
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'fulfilled';// resolved
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
    }
    
    //reject 函数
    function reject(data){
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'rejected';// 
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
    }
    
    // 通过 try catch 可以实现 throw 功能
    try{
        //同步调用『执行器函数』
        executor(resolve, reject);
    }catch(e){
        //修改 promise 对象状态为『失败』
        reject(e);
    }
}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){

}
```

### 5-状态只能修改一次

```js
//声明构造函数
function Promise(executor){
    
    //添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    
    //保存实例对象的 this 的值
    const self = this;// self _this that
    
    //resolve 函数
    function resolve(data){
        
        // 通过判断状态，让 promise 对象的状态只能转换一次
        if(self.PromiseState !== 'pending') return;
        
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'fulfilled';// resolved
        
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
    }
    
    //reject 函数
    function reject(data){
        //判断状态
        if(self.PromiseState !== 'pending') return;
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'rejected';// 
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
    }

    try{
        //同步调用『执行器函数』
        executor(resolve, reject);
    }catch(e){
        //修改 promise 对象状态为『失败』
        reject(e);
    }
}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){

}
```

### 6-then方法执行回调（自己封装到这里）

```js
/声明构造函数
function Promise(executor){
    //添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    //保存实例对象的 this 的值
    const self = this;// self _this that
    //resolve 函数
    function resolve(data){
        //判断状态
        if(self.PromiseState !== 'pending') return;
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'fulfilled';// resolved
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
    }
    //reject 函数
    function reject(data){
        //判断状态
        if(self.PromiseState !== 'pending') return;
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'rejected';// 
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
    }
    try{
        //同步调用『执行器函数』
        executor(resolve, reject);
    }catch(e){
        //修改 promise 对象状态为『失败』
        reject(e);
    }
}

//添加 then 方法， onResolved, onRejected 是两个回调函数，由使用者传入
Promise.prototype.then = function(onResolved, onRejected){
    //调用回调函数  PromiseState  注意因为 then 是由实例对象调用，所有这里是 this 是隐式绑定
    if(this.PromiseState === 'fulfilled'){
        onResolved(this.PromiseResult);
    }
    if(this.PromiseState === 'rejected'){
        onRejected(this.PromiseResult);
    }
}
```

### 7-异步任务then方法执行回调

```js
//声明构造函数
function Promise(executor){
    //添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    //声明属性
    this.callback = {};
    //保存实例对象的 this 的值
    const self = this;// self _this that
    //resolve 函数
    function resolve(data){
        //判断状态
        if(self.PromiseState !== 'pending') return;
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'fulfilled';// resolved
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
        //调用成功的回调函数
        if(self.callback.onResolved){
            self.callback.onResolved(data);
        }
    }
    //reject 函数
    function reject(data){
        //判断状态
        if(self.PromiseState !== 'pending') return;
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'rejected';// 
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
        //执行回调
        if(self.callback.onResolved){
            self.callback.onResolved(data);
        }
    }
    try{
        //同步调用『执行器函数』
        executor(resolve, reject);
    }catch(e){
        //修改 promise 对象状态为『失败』
        reject(e);
    }
}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){
    //调用回调函数  PromiseState  
    if(this.PromiseState === 'fulfilled'){
        onResolved(this.PromiseResult);
    }
    if(this.PromiseState === 'rejected'){
        onRejected(this.PromiseResult);
    }
    // 当执行 then 方法时为 pending 状态（执行器为异步任务），将回调函数保留在当前 promise 对象身上
    // 等到异步任务执行 resolve() 或 reject() 时再去执行回调
    if(this.PromiseState === 'pending'){
        //保存回调函数
        this.callback = {
            onResolved: onResolved,
            onRejected: onRejected
        }
    }
}
```

### 8-指定多个回调

```js
//声明构造函数
function Promise(executor){
    //添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    //声明属性
    this.callbacks = [];
    //保存实例对象的 this 的值
    const self = this;// self _this that
    //resolve 函数
    function resolve(data){
        //判断状态
        if(self.PromiseState !== 'pending') return;
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'fulfilled';// resolved
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
        //调用成功的回调函数
        self.callbacks.forEach(item => {
            item.onResolved(data);
        });
    }
    //reject 函数
    function reject(data){
        //判断状态
        if(self.PromiseState !== 'pending') return;
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'rejected';// 
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
        //执行失败的回调
        self.callbacks.forEach(item => {
            item.onRejected(data);
        });
    }
    try{
        //同步调用『执行器函数』
        executor(resolve, reject);
    }catch(e){
        //修改 promise 对象状态为『失败』
        reject(e);
    }
}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){
    //调用回调函数  PromiseState
    if(this.PromiseState === 'fulfilled'){
        onResolved(this.PromiseResult);
    }
    if(this.PromiseState === 'rejected'){
        onRejected(this.PromiseResult);
    }
    //判断 pending 状态
    if(this.PromiseState === 'pending'){
        // 以这样的方式保存回调函数可以保证当指定多个回调时，前面的回调不会被后面的回调覆盖
        // 然后在异步执行器调用 resolve 或者 rejected 时做一个遍历即可
        this.callbacks.push({
            onResolved: onResolved,
            onRejected: onRejected
        });
    }
}
```

### 9-同步修改状态then方法返回Promise

```js
//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){

    // 我们知道 then 方法是会放回一个 promise 对象的
    return new Promise((resolve, reject) => {
        if(this.PromiseState === 'fulfilled'){
            try{

                // 获取使用者使用 then 方法传入时的回调函数的执行结果
                let result = onResolved(this.PromiseResult);

                if(result instanceof Promise){

                    // 如果返回结果是 Promise 类型的对象,竟然你是 promise 那肯定就可以调用 then 方法
                    // 而我返回的是一个新的 promise 对象，我们知道返回新的 promise 对象时，该对象的结果和状态
                    // 和 then 方法调用后获取到的 promise 对象的结果和状态是一样的
                    // 返回的是 promise 对象时就跟我们初始化一个 promise 对象一样，用 then 方法指定和执行回调去获取结果
                    result.then(v => {
                        resolve(v);
                    }, r=>{
                        reject(r);
                    })
                }else{

                    // 如果返回结果不是 Promise 类型的对象,如果不是则将当前 promise 对象状态为变为『成功』
                    // 并将使用 then 方法传入时的回调函数的执行结果，作为当前返回的 promise 对象的结果
                    resolve(result);
                }
            }catch(e){
                reject(e);
            }
        }
        if(this.PromiseState === 'rejected'){
            onRejected(this.PromiseResult);
        }
        //判断 pending 状态
        if(this.PromiseState === 'pending'){
            //保存回调函数
            this.callbacks.push({
                onResolved: onResolved,
                onRejected: onRejected
            });
        }
    })
}
```

### 10-1异步修改状态then方法返回结果（自己封装到这里）

```js
//声明构造函数
function Promise(executor){
    //添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    //声明属性
    this.callbacks = [];
    //保存实例对象的 this 的值
    const self = this;// self _this that
    //resolve 函数
    function resolve(data){
        //判断状态
        if(self.PromiseState !== 'pending') return;
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'fulfilled';// resolved
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
        //调用成功的回调函数
        self.callbacks.forEach(item => {
            item.onResolved(data);
        });
    }
    //reject 函数
    function reject(data){
        //判断状态
        if(self.PromiseState !== 'pending') return;
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'rejected';// 
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
        //执行失败的回调
        self.callbacks.forEach(item => {
            item.onRejected(data);
        });
    }
    try{
        //同步调用『执行器函数』
        executor(resolve, reject);
    }catch(e){
        //修改 promise 对象状态为『失败』
        reject(e);
    }
}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){
    const self = this;
    return new Promise((resolve, reject) => {
        //调用回调函数  PromiseState
        if(this.PromiseState === 'fulfilled'){
            try{
                //获取回调函数的执行结果
                let result = onResolved(this.PromiseResult);
                //判断
                if(result instanceof Promise){
                    //如果是 Promise 类型的对象
                    result.then(v => {
                        resolve(v);
                    }, r=>{
                        reject(r);
                    })
                }else{
                    //结果的对象状态为『成功』
                    resolve(result);
                }
            }catch(e){
                reject(e);
            }
        }
        if(this.PromiseState === 'rejected'){
            onRejected(this.PromiseResult);
        }
        //判断 pending 状态
        if(this.PromiseState === 'pending'){
            //保存回调函数
            this.callbacks.push({

                // 异步时其实就是将上面 resolve 和 rejected 操作放到这里来,然后要注意 this 的指向问题
                // 因为直接使用 this 它是指向 push 进数组里的对象的，它是通过这个对象调用的，是隐式绑定
                onResolved: function(){
                    try{
                        //执行成功回调函数
                        let result = onResolved(self.PromiseResult);
                        //判断
                        if(result instanceof Promise){
                            result.then(v => {
                                resolve(v);
                            }, r=>{
                                reject(r);
                            })
                        }else{
                            resolve(result);
                        }
                    }catch(e){
                        reject(e);
                    }
                },
                onRejected: function(){
                    try{
                        //执行成功回调函数
                        let result = onRejected(self.PromiseResult);
                        //判断
                        if(result instanceof Promise){
                            result.then(v => {
                                resolve(v);
                            }, r=>{
                                reject(r);
                            })
                        }else{
                            resolve(result);
                        }
                    }catch(e){
                        reject(e);
                    }
                }
            });
        }
    })
}
```

### 10-2-then方法代码优化

tips：这里的优化无非就是对上面重复的代码做了封装处理

```js
//声明构造函数
function Promise(executor){
    //添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    //声明属性
    this.callbacks = [];
    //保存实例对象的 this 的值
    const self = this;// self _this that
    //resolve 函数
    function resolve(data){
        //判断状态
        if(self.PromiseState !== 'pending') return;
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'fulfilled';// resolved
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
        //调用成功的回调函数
        self.callbacks.forEach(item => {
            item.onResolved(data);
        });
    }
    //reject 函数
    function reject(data){
        //判断状态
        if(self.PromiseState !== 'pending') return;
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'rejected';// 
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
        //执行失败的回调
        self.callbacks.forEach(item => {
            item.onRejected(data);
        });
    }
    try{
        //同步调用『执行器函数』
        executor(resolve, reject);
    }catch(e){
        //修改 promise 对象状态为『失败』
        reject(e);
    }
}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){
    const self = this;
    return new Promise((resolve, reject) => {
        //封装函数
        function callback(type){
            try{
                // 获取回调函数的执行结果,这里直接用 this 的话 this 是默认绑定指向 window
                // 因为 callback 没有通过谁调用，是自身调用
                let result = type(self.PromiseResult);
                //判断
                if(result instanceof Promise){
                    //如果是 Promise 类型的对象
                    result.then(v => {
                        resolve(v);
                    }, r=>{
                        reject(r);
                    })
                }else{
                    //结果的对象状态为『成功』
                    resolve(result);
                }
            }catch(e){
                reject(e);
            }
        }
        //调用回调函数  PromiseState
        if(this.PromiseState === 'fulfilled'){
            callback(onResolved);
        }
        if(this.PromiseState === 'rejected'){
            callback(onRejected);
        }
        //判断 pending 状态
        if(this.PromiseState === 'pending'){
            //保存回调函数
            this.callbacks.push({
                onResolved: function(){
                    callback(onResolved);
                },
                onRejected: function(){
                    callback(onRejected);
                }
            });
        }
    })
}
```

### 11-catch方法与异常穿透

```js
//声明构造函数
function Promise(executor){
    //添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    //声明属性
    this.callbacks = [];
    //保存实例对象的 this 的值
    const self = this;// self _this that
    //resolve 函数
    function resolve(data){
        //判断状态
        if(self.PromiseState !== 'pending') return;
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'fulfilled';// resolved
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
        //调用成功的回调函数
        self.callbacks.forEach(item => {
            item.onResolved(data);
        });
    }
    //reject 函数
    function reject(data){
        //判断状态
        if(self.PromiseState !== 'pending') return;
        //1. 修改对象的状态 (promiseState)
        self.PromiseState = 'rejected';// 
        //2. 设置对象结果值 (promiseResult)
        self.PromiseResult = data;
        //执行失败的回调
        self.callbacks.forEach(item => {
            item.onRejected(data);
        });
    }
    try{
        //同步调用『执行器函数』
        executor(resolve, reject);
    }catch(e){
        //修改 promise 对象状态为『失败』
        reject(e);
    }
}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){
    const self = this;

    // 判断回调函数参数是否有 onRejected，如果没有就默认给它指定一个
    // 为什么能实现异常穿透？
    // 当其中一个链抛出错误时，返回的 promise 对象会变成 reject 状态，结果为抛出的错误
    // 后面的链会调用这个默认的回调，错误就一层层的往下抛直至被 catch 接收
    if(typeof onRejected !== 'function'){
        onRejected = reason => {
            throw reason;
        }
    }

    // 这可以解决调用 then 方法时不指定回调的情况
    if(typeof onResolved !== 'function'){
        onResolved = value => value;
        //value => { return value};
    }
    return new Promise((resolve, reject) => {
        //封装函数
        function callback(type){
            try{
                //获取回调函数的执行结果，注意这句一定要包含在 try 里面，若 type 是 onRejectd
                //它很可能传入了默认值，因此会抛出错误，需进行捕获，后续代码继续才会进行
                let result = type(self.PromiseResult);
                //判断
                if(result instanceof Promise){
                    //如果是 Promise 类型的对象
                    result.then(v => {
                        resolve(v);
                    }, r=>{
                        reject(r);
                    })
                }else{
                    //结果的对象状态为『成功』
                    resolve(result);
                }
            }catch(e){
                reject(e);
            }
        }
        //调用回调函数  PromiseState
        if(this.PromiseState === 'fulfilled'){
            callback(onResolved);
        }
        if(this.PromiseState === 'rejected'){
            callback(onRejected);
        }
        //判断 pending 状态
        if(this.PromiseState === 'pending'){
            //保存回调函数
            this.callbacks.push({
                onResolved: function(){
                    callback(onResolved);
                },
                onRejected: function(){
                    callback(onRejected);
                }
            });
        }
    })
}

//添加 catch 方法
Promise.prototype.catch = function(onRejected){
    return this.then(undefined, onRejected);
}
```

### 12-Promise.resolve

```js
//添加 resolve 方法
Promise.resolve = function(value){
    //返回promise对象
    return new Promise((resolve, reject) => {

        // 如果传进来的是一个 promise 对象，那么这个对象就结果和状态就是要返回的 promise 对象的结果和状态
        // 因此在 then 中执行 resolve 或 reject 并传递传进来的对象的结果值
        if(value instanceof Promise){
            value.then(v=>{
                resolve(v);
            }, r=>{
                reject(r);
            })
        }else{
            //状态设置为成功
            resolve(value);
        }
    });
}
```

### 13-Promise.reject（还没封装）

```js
// reject 方法不管传入什么都会返回一个失败的 promise 对象
// 就算传入的是一个成功的 promise 它也会返回失败的 p 对象，然后将传入的 p 对象作为返回对象的结果值
Promise.reject = function(reason){
    return new Promise((resolve, reject)=>{
        reject(reason);
    });
}
```

### 14-Promise.all方法实现（封装到这里）

- 如果传入的所有 p 对象都是成功状态，那么返回一个成功的 p 对象，结果值为一个数组，里面存着所有 p 对象的结果值
- 如果有一个 p 对象是失败的状态，那么返回第一个失败的对象的状态和结果值

```js
Promise.all = function(promises){
    //返回结果为 promise 对象
    return new Promise((resolve, reject) => {
        //记录回调被执行次数
        let count = 0;
        //存放传入的 p 对象结果
        let arr = [];
        //遍历
        for(let i=0;i<promises.length;i++){
            promises[i].then(v => {
                count++;
                //将当前promise对象成功的结果存入到数组中
                //注意：这里之所以不用 push 是因为有可能有的 p 对象封装了异步代码
                //用push结果的顺序就乱了
                arr[i] = v;
                //如果两者相等，说明回调都执行了,所以调用 resolve 并将遍历的结果值返回给新的 p 对象
                if(count === promises.length){
                    //修改状态
                    resolve(arr);
                }
            }, r => {
                //我们知道 p 对象的状态只能转变一次，reject后即便循环还在继续，但是 p 对象的结果和状态是不会再改变了
                reject(r);
            });
        }
    });
}
```

### 15-Promise.race方法实现

- race 方法：谁先返回结果就以谁的结果和状态作为返回的 p 对象的状态和结果

```js
//你可能会想着在 resolve 或 reject 后面加个 break
//但实际上你写的 break 是被传进 then 的回调方法里的,并无法控制到 for 循环
Promise.race = function(promises){
    return new Promise((resolve, reject) => {
        for(let i=0;i<promises.length;i++){
            promises[i].then(v => {
                //修改返回对象的状态为 『成功』
                resolve(v);
            },r=>{
                //修改返回对象的状态为 『失败』
                reject(r);
            })
        }
    });
}
```

### 16-then回调函数异步执行的实现

```js

//添加 then 方法,异步实现很简单就是加个 settimeout 就可以了
Promise.prototype.then = function(onResolved, onRejected){
    const self = this;
    //判断回调函数参数
    if(typeof onRejected !== 'function'){
        onRejected = reason => {
            throw reason;
        }
    }
    if(typeof onResolved !== 'function'){
        onResolved = value => value;
        //value => { return value};
    }
    return new Promise((resolve, reject) => {
        //封装函数
        function callback(type){
            try{
                //获取回调函数的执行结果
                let result = type(self.PromiseResult);
                //判断
                if(result instanceof Promise){
                    //如果是 Promise 类型的对象
                    result.then(v => {
                        resolve(v);
                    }, r=>{
                        reject(r);
                    })
                }else{
                    //结果的对象状态为『成功』
                    resolve(result);
                }
            }catch(e){
                reject(e);
            }
        }
        //调用回调函数  PromiseState
        if(this.PromiseState === 'fulfilled'){
            setTimeout(() => {
                callback(onResolved);
            });
        }
        if(this.PromiseState === 'rejected'){
            setTimeout(() => {
                callback(onRejected);
            });
        }
        //判断 pending 状态
        if(this.PromiseState === 'pending'){
            //保存回调函数
            this.callbacks.push({
                onResolved: function(){
                    callback(onResolved);
                },
                onRejected: function(){
                    callback(onRejected);
                }
            });
        }
    })
}
```

### 17-class版本封装

- 构造器的里的属性是在实例对象身上的， static 的方法在原型上
- static 定义方法本质就是 函数名.方法 的形式
- 而没有 static 的本质是 函数名.protatye.方法的形式
- 其实构造器就是构造方法的一个语法糖，当 new 这个类时，会调用 constructor 方法 

```js
class Promise{
    //构造方法
    constructor(executor){
        //添加属性
        this.PromiseState = 'pending';
        this.PromiseResult = null;
        //声明属性
        this.callbacks = [];
        //保存实例对象的 this 的值
        const self = this;// self _this that
        //resolve 函数
        function resolve(data){
            //判断状态
            if(self.PromiseState !== 'pending') return;
            //1. 修改对象的状态 (promiseState)
            self.PromiseState = 'fulfilled';// resolved
            //2. 设置对象结果值 (promiseResult)
            self.PromiseResult = data;
            //调用成功的回调函数
            setTimeout(() => {
                self.callbacks.forEach(item => {
                    item.onResolved(data);
                });
            });
        }
        //reject 函数
        function reject(data){
            //判断状态
            if(self.PromiseState !== 'pending') return;
            //1. 修改对象的状态 (promiseState)
            self.PromiseState = 'rejected';// 
            //2. 设置对象结果值 (promiseResult)
            self.PromiseResult = data;
            //执行失败的回调
            setTimeout(() => {
                self.callbacks.forEach(item => {
                    item.onRejected(data);
                });
            });
        }
        try{
            //同步调用『执行器函数』
            executor(resolve, reject);
        }catch(e){
            //修改 promise 对象状态为『失败』
            reject(e);
        }
    }

    //then 方法封装
    then(onResolved,onRejected){
        const self = this;
        //判断回调函数参数
        if(typeof onRejected !== 'function'){
            onRejected = reason => {
                throw reason;
            }
        }
        if(typeof onResolved !== 'function'){
            onResolved = value => value;
            //value => { return value};
        }
        return new Promise((resolve, reject) => {
            //封装函数
            function callback(type){
                try{
                    //获取回调函数的执行结果
                    let result = type(self.PromiseResult);
                    //判断
                    if(result instanceof Promise){
                        //如果是 Promise 类型的对象
                        result.then(v => {
                            resolve(v);
                        }, r=>{
                            reject(r);
                        })
                    }else{
                        //结果的对象状态为『成功』
                        resolve(result);
                    }
                }catch(e){
                    reject(e);
                }
            }
            //调用回调函数  PromiseState
            if(this.PromiseState === 'fulfilled'){
                setTimeout(() => {
                    callback(onResolved);
                });
            }
            if(this.PromiseState === 'rejected'){
                setTimeout(() => {
                    callback(onRejected);
                });
            }
            //判断 pending 状态
            if(this.PromiseState === 'pending'){
                //保存回调函数
                this.callbacks.push({
                    onResolved: function(){
                        callback(onResolved);
                    },
                    onRejected: function(){
                        callback(onRejected);
                    }
                });
            }
        })
    }

    //catch 方法
    catch(onRejected){
        return this.then(undefined, onRejected);
    }

    //static 表明它是一个静态方法属于类而不属于实例对象
    //添加 resolve 方法
    static resolve(value){
        //返回promise对象
        return new Promise((resolve, reject) => {
            if(value instanceof Promise){
                value.then(v=>{
                    resolve(v);
                }, r=>{
                    reject(r);
                })
            }else{
                //状态设置为成功
                resolve(value);
            }
        });
    }

    //添加 reject 方法
    static reject(reason){
        return new Promise((resolve, reject)=>{
            reject(reason);
        });
    }

    //添加 all 方法
    static all(promises){
        //返回结果为promise对象
        return new Promise((resolve, reject) => {
            //声明变量
            let count = 0;
            let arr = [];
            //遍历
            for(let i=0;i<promises.length;i++){
                //
                promises[i].then(v => {
                    //得知对象的状态是成功
                    //每个promise对象 都成功
                    count++;
                    //将当前promise对象成功的结果 存入到数组中
                    arr[i] = v;
                    //判断
                    if(count === promises.length){
                        //修改状态
                        resolve(arr);
                    }
                }, r => {
                    reject(r);
                });
            }
        });
    }

    //添加 race 方法
    static race (promises){
        return new Promise((resolve, reject) => {
            for(let i=0;i<promises.length;i++){
                promises[i].then(v => {
                    //修改返回对象的状态为 『成功』
                    resolve(v);
                },r=>{
                    //修改返回对象的状态为 『失败』
                    reject(r);
                })
            }
        });
    }
}   
```

# 第 2 章：async 和 await

## 1-async

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>async函数</title>
</head>
<body>
    <script>
        //then
        async function main(){
            //1. 如果返回值是一个非 Promise 类型的数据
            // 返回成功的 p 对象，值为 521
            // return 521;
            //2. 如果返回的是一个Promise对象
            // 返回的就是这个返回的 p 对象
            // return new Promise((resolve, reject) => {
            //     // resolve('OK');
            //     reject('Error');
            // });
            //3. 抛出异常
            // 返回的 p 对象是结果是失败，值是抛出的内容
            throw "Oh NO";
        }

        let result = main();

        console.log(result);
    </script>
</body>
</html>
```

## 2-await

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>await</title>
</head>
<body>
    <script>
        async function main(){
            let p = new Promise((resolve, reject) => {
                // resolve('OK');
                reject('Error');
            })
            //1. 右侧为成功的 promise 的情况, await 会对 promise 对象的结果进行一个获取
            // let res = await p;
            //2. 右侧为其他类型的数据,直接拿去到这个数据
            // let res2 = await 20;
            // console.log(res2);
            //3. 如果promise是失败的状态,通过 try catch 去获取 p 对象失败的结果，基本没 await 事了
            try{
                let res3 = await p;
            }catch(e){
                console.log(e);
            }
        }

        main();
    </script>
</body>
</html>
```

## 3-async与await结合

```js
/**
 * resource  1.html  2.html 3.html 文件内容
 */

const fs = require('fs');
const util = require('util');
const mineReadFile = util.promisify(fs.readFile);

//恶魔使用的回调函数的方式
// fs.readFile('./resource/1.html', (err, data1) => {
//     if(err) throw err;
//     fs.readFile('./resource/2.html', (err, data2) => {
//         if(err) throw err;
//         fs.readFile('./resource/3.html', (err, data3) => {
//             if(err) throw err;
//             console.log(data1 + data2 + data3);
//         });
//     });
// });

//优美的 async 与 await
async function main(){
    try{
        //读取第一个文件的内容
        let data1 = await mineReadFile('./resource/1.html');
        let data2 = await mineReadFile('./resource/2.html');
        let data3 = await mineReadFile('./resource/3.html');
        console.log(data1 + data2 + data3);
    }catch(e){
        console.log(e.code);
    }
}

main();
```

## 4-async与await结合发送AJAX

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>async与await结合发送AJAX</title>
</head>
<body>
    <button id="btn">点击获取段子</button>
    <script>
        //axios其实就是将 原生的 ajax 封装成 promise 形式
        function sendAJAX(url){
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'json';
                xhr.open("GET", url);
                xhr.send();
                //处理结果
                xhr.onreadystatechange = function(){
                    if(xhr.readyState === 4){
                        //判断成功
                        if(xhr.status >= 200 && xhr.status < 300){
                            //成功的结果
                            resolve(xhr.response);
                        }else{
                            reject(xhr.status);
                        }
                    }
                }
            });
        }

        //段子接口地址 https://api.apiopen.top/getJoke
        let btn = document.querySelector('#btn');

        btn.addEventListener('click',async function(){
            //获取段子信息
            let duanzi = await sendAJAX('https://api.apiopen.top/getJoke');
            console.log(duanzi);
        });
    </script>
</body>
</html>
```

# 利用 promise 实现异步循环顺序执行

```js
        let arr = [1,2,3,8,6,5,7]
        let resolveArr = [];
        ( async function( arr ) {
            for ( let i = 0; i < arr.length; i++ ) {
                let promise = new Promise( (resolve, reject) => {
                    setTimeout( function() {
                        let res = arr[i] * arr[i]

                        resolveArr[i] =  {
                                            resolve,
                                            res
                                         }

                        if ( resolveArr.length === arr.length ) {

                            // 数组是否有 undefined 标记
                            let mark = false
                            for ( item of resolveArr ) {
                                if ( !item ) {
                                    mark = true
                                    break
                                }
                            }

                            // 如果没有遍历执行 resolve
                            if ( !mark ) {
                                for( item of resolveArr ) {
                                    item.resolve( item.res )
                                }
                            }
                        } 
                    }, Math.random() * 1000 )
                } )
                promise.then( res => {
                    console.log(res);
                } )
            }
        } )( arr )
```

# 并发处理 n 个请求，其余挂起

```js
        let sendArr = [];
        let ans = []; // 用于存放有响应的
        let n = 2 // 发送请求数

        function f1() {
            return new Promise( ( resolve, reject ) => {
                setTimeout( function() {
                    resolve( 111 )
                }, 1000)
            } )
        }
        function f2() {
            return new Promise( ( resolve, reject ) => {
                setTimeout( function() {
                    resolve( 222 )
                }, 2000)
            } )
        }
        function f3() {
            return new Promise( ( resolve, reject ) => {
                setTimeout( function() {
                    resolve( 333 )
                }, 1000)
            } )
        }
        function f4() {
            return new Promise( ( resolve, reject ) => {
                setTimeout( function() {
                    resolve( 444 )
                }, 500)
            } )
        }

        sendArr.push( f1 )
        sendArr.push( f2 )
        sendArr.push( f3 )
        sendArr.push( f4 )

        // n 为发送的数量
        function sendRequest( n ) {

            // 每次发 n 个请求
            let curRequest = sendArr.splice( 0, n )
            
            for ( let i = 0; i < n; i++ ) {
                
                // 执行 send 方法
                curRequest[i]().then( res => {
                    console.log(res);
                    ans.push( res )

                    // 当响应的结果为 n 个时，说明 n 个请求发送完了，继续发送 n 个请求
                    if ( ans.length === n ) {

                        // 清空响应结果
                        ans = []

                        // 如果请求已经发送完毕就不用再继续发请求了
                        if( !sendArr.length ) return;
                        sendRequest( n )
                    }
                } )
            }
        }
        
        sendRequest(n)
```

