# 12.Promise

- 异步和同步
  - 异步，操作之间没有关系，同时执行多个操作， 代码复杂
  - 同步，同时只能做一件事，代码简单
- Promise 对象
  - 用同步的方式来书写异步代码
  - Promise 让异步操作写起来，像在写同步操作的流程，不必一层层地嵌套回调函数
  - 改善了可读性，对于多层嵌套的回调函数很方便
  - 充当异步操作与回调函数之间的中介，使得异步操作具备同步操作的接口
- Promise 也是一个构造函数
  - 接受一个回调函数f1作为参数，f1里面是异步操作的代码
  - 返回的p1就是一个 Promise 实例
  - 所有异步任务都返回一个 Promise 实例
  - Promise 实例有一个then方法，用来指定下一步的回调函数

```
function f1(resolve, reject) {
  // 异步代码...
}
var p1 = new Promise(f1);
p1.then(f2); // f1的异步操作执行完成，就会执行f2。
```

- Promise 使得异步流程可以写成同步流程

```
// 传统写法
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // ...
      });
    });
  });
});

// Promise 的写法
(new Promise(step1))
  .then(step2)
  .then(step3)
  .then(step4);
```

- Promise.all(promiseArray)方法
  - 将多个Promise对象实例包装，生成并返回一个新的Promise实例
  - promise数组中所有的promise实例都变为resolve的时候，该方法才会返回
  - 并将所有结果传递results数组中
  - promise数组中任何一个promise为reject的话，则整个Promise.all调用会立即终止，并返回一个reject的新的promise对象

```
var p1 = Promise.resolve(1),
    p2 = Promise.resolve(2),
    p3 = Promise.resolve(3);
// 用.then接受返回结果 可以有两个参数分别是reslove和reject
Promise.all([p1, p2, p3]).then(function (results) {
    console.log(results);  // [1, 2, 3]
});
```

- Promise.race([p1, p2, p3])
  - Promse.race就是赛跑的意思
  - 哪个结果获得的快，就返回那个结果
  - 不管结果本身是成功状态还是失败状态



# 详细拓展

## 1. Promise 的含义

`Promise` 是`异步编程`的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了 Promise 对象。

所谓 `Promise` ，简单说就是一个`容器`，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

Promise 对象有以下两个特点。

（1）对象的状态不受外界影响。 Promise 对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是 Promise 这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。 Promise 对象的状态改变，只有两种可能：从 pending 变为 fulfilled 和从 pending 变为 rejected 。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对 Promise 对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

注意，为了行文方便，本章后面的 resolved 统一只指 fulfilled 状态，不包含 rejected 状态。

有了 Promise 对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外， Promise 对象提供统一的接口，使得控制异步操作更加容易。

Promise 也有一些缺点。首先，无法取消 Promise ，一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数， Promise 内部抛出的错误，不会反应到外部。第三，当处于 pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

如果某些事件不断地反复发生，一般来说，使用 [Stream](https://nodejs.org/api/stream.html) 模式是比部署 Promise 更好的选择。



## 2. 基本用法

ES6 规定，`Promise` 对象是一个`构造函数`，用来生成`Promise` 实例。

下面代码创造了一个 Promise 实例。



```javascript
const promise = new Promise(function(resolve, reject) {
  // ... some code


  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是`resolve` 和`reject` 。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

`resolve` 函数的作用是，将 `Promise`对象的状态从`“未完成”`变为`“成功”`（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；`reject`函数的作用是，将 `Promise`对象的状态从`“未完成”`变为`“失败”`（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise 实例生成以后，可以用 `then`方法分别指定`resolved`状态和 `rejected`状态的回调函数。



```javascript
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

then 方法可以接受两个回调函数作为参数。第一个回调函数是`Promise`对象的状态变为 `resolved`时调用，第二个回调函数是 `Promise`对象的状态变为`rejected`时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受 Promise 对象传出的值作为参数。

下面是一个 Promise 对象的简单例子。



```javascript
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  });
}


timeout(100).then((value) => {
  console.log(value);
});
```

上面代码中， timeout 方法返回一个 Promise 实例，表示一段时间以后才会发生的结果。过了指定的时间（ ms 参数）以后， Promise 实例的状态变为 resolved ，就会触发 then 方法绑定的回调函数。

Promise 新建后就会立即执行。



```javascript
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});


promise.then(function() {
  console.log('resolved.');
});


console.log('Hi!');


// Promise
// Hi!
// resolved
```

上面代码中，Promise 新建后立即执行，所以首先输出的是 Promise 。然后， then 方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以 resolved 最后输出。

下面是异步加载图片的例子。



```javascript
function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image();


    image.onload = function() {
      resolve(image);
    };


    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };


    image.src = url;
  });
}
```

上面代码中，使用 Promise 包装了一个图片加载的异步操作。如果加载成功，就调用 resolve 方法，否则就调用 reject 方法。

下面是一个用 Promise 对象实现的 Ajax 操作的例子。



```javascript
const getJSON = function(url) {
  const promise = new Promise(function(resolve, reject){
    const handler = function() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    const client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();


  });


  return promise;
};


getJSON("/posts.json").then(function(json) {
  console.log('Contents: ' + json);
}, function(error) {
  console.error('出错了', error);
});
```

上面代码中， getJSON 是对 XMLHttpRequest 对象的封装，用于发出一个针对 JSON 数据的 HTTP 请求，并且返回一个 Promise 对象。需要注意的是，在 getJSON 内部， resolve 函数和 reject 函数调用时，都带有参数。

如果调用 `resolve` 函数和`reject`函数时带有参数，那么它们的参数会被传递给`回调函数`。 `reject` 函数的参数通常是`Error`对象的实例，表示抛出的错误；`resolve`函数的参数除了正常的值以外，还可能是另一个`Promise`实例，比如像下面这样。



```javascript
const p1 = new Promise(function (resolve, reject) {
  // ...
});


const p2 = new Promise(function (resolve, reject) {
  // ...
  resolve(p1);
})
```

上面代码中， p1 和 p2 都是 Promise 的实例，但是 p2 的 resolve 方法将 p1 作为参数，即一个异步操作的结果是返回另一个异步操作。

注意，这时 p1 的状态就会传递给 p2 ，也就是说， p1 的状态决定了 p2 的状态。如果 p1 的状态是 pending ，那么 p2 的回调函数就会等待 p1 的状态改变；如果 p1 的状态已经是 resolved 或者 rejected ，那么 p2 的回调函数将会立刻执行。



```javascript
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})


const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})


p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```

上面代码中， p1 是一个 Promise，3 秒之后变为 rejected 。 p2 的状态在 1 秒之后改变， resolve 方法返回的是 p1 。由于 p2 返回的是另一个 Promise，导致 p2 自己的状态无效了，由 p1 的状态决定 p2 的状态。所以，后面的 then 语句都变成针对后者（ p1 ）。又过了 2 秒， p1 变为 rejected ，导致触发 catch 方法指定的回调函数。

注意，调用 resolve 或 reject 并不会终结 Promise 的参数函数的执行。



```javascript
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```

上面代码中，调用 resolve(1) 以后，后面的 console.log(2) 还是会执行，并且会首先打印出来。这是因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。

一般来说，调用 resolve 或 reject 以后，Promise 的使命就完成了，后继操作应该放到 then 方法里面，而不应该直接写在 resolve 或 reject 的后面。所以，最好在它们前面加上 return 语句，这样就不会有意外。



```javascript
new Promise((resolve, reject) => {
  return resolve(1);
  // 后面的语句不会执行
  console.log(2);
})
```



## 3.Promise.prototype.then()

`Promise` 实例具有`then`方法，也就是说， then 方法是定义在原型对象 `Promise.prototype` 上的。它的作用是为 Promise 实例添加状态改变时的回调函数。前面说过， then 方法的第一个参数是 resolved 状态的回调函数，第二个参数（可选）是 rejected 状态的回调函数。

then 方法返回的是一个`新的` Promise 实例（注意，不是原来那个 Promise 实例）。因此可以采用`链式`写法，即 then 方法后面再调用另一个 then 方法。



```javascript
getJSON("/posts.json").then(function(json) {
  return json.post;
}).then(function(post) {
  // ...
});
```

上面的代码使用 `then` 方法，依次指定了两个回调函数。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。

采用链式的 then ，可以指定一组按照次序调用的回调函数。这时，前一个回调函数，有可能返回的还是一个 Promise 对象（即有异步操作），这时后一个回调函数，就会等待该 Promise 对象的状态发生变化，才会被调用。



```javascript
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function (comments) {
  console.log("resolved: ", comments);
}, function (err){
  console.log("rejected: ", err);
});
```

上面代码中，第一个 then 方法指定的回调函数，返回的是另一个 Promise 对象。这时，第二个 then 方法指定的回调函数，就会等待这个新的 Promise 对象状态发生变化。如果变为 resolved ，就调用第一个回调函数，如果状态变为 rejected ，就调用第二个回调函数。

如果采用箭头函数，上面的代码可以写得更简洁。



```javascript
getJSON("/post/1.json").then(
  post => getJSON(post.commentURL)
).then(
  comments => console.log("resolved: ", comments),
  err => console.log("rejected: ", err)
);
```

## 在w3c上后面还有很多点没去详细看