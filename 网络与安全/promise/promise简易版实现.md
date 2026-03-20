## 1. 定义状态和回调存储

```javascript
class MyPromise {
    // 定义三种状态
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';

    constructor(executor) {
        this.status = MyPromise.PENDING; // 初始状态为pending
        this.value = undefined; // 成功的结果
        this.reason = undefined; // 失败的原因
        this.onFulfilledCallbacks = []; // 存储fulfilled状态的回调
        this.onRejectedCallbacks = []; // 存储rejected状态的回调

        // 定义resolve方法：将状态改为fulfilled，执行所有成功回调
        const resolve = (value) => {
            if (this.status === MyPromise.PENDING) {
                this.status = MyPromise.FULFILLED;
                this.value = value;
                // 异步执行回调（模拟微任务）
                queueMicrotask(() => {
                    this.onFulfilledCallbacks.forEach((cb) => cb(this.value));
                });
            }
        };

        // 定义reject方法：将状态改为rejected，执行所有失败回调
        const reject = (reason) => {
            if (this.status === MyPromise.PENDING) {
                this.status = MyPromise.REJECTED;
                this.reason = reason;
                // 异步执行回调
                queueMicrotask(() => {
                    this.onRejectedCallbacks.forEach((cb) => cb(this.reason));
                });
            }
        };

        // 执行 executor，捕获同步错误
        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }
}
```

## 2. 实现 then 方法（支持链式调用）

```javascript
then(onFulfilled, onRejected) {
  // 处理回调未传入的情况（透传值/错误）
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };

  // 返回新Promise，实现链式调用
  return new MyPromise((resolve, reject) => {
    // 1. 若当前状态为fulfilled，直接执行onFulfilled
    if (this.status === MyPromise.FULFILLED) {
      queueMicrotask(() => {
        try {
          const result = onFulfilled(this.value);
          // 若回调返回Promise，新Promise跟随其状态
          if (result instanceof MyPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result); // 否则直接resolve结果
          }
        } catch (err) {
          reject(err); // 回调执行出错，新Promise变为rejected
        }
      });
    }

    // 2. 若当前状态为rejected，直接执行onRejected
    if (this.status === MyPromise.REJECTED) {
      queueMicrotask(() => {
        try {
          const result = onRejected(this.reason);
          if (result instanceof MyPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result); // 注意：即使onRejected执行成功，新Promise也会fulfilled
          }
        } catch (err) {
          reject(err);
        }
      });
    }

    // 3. 若当前状态为pending，存储回调（等待resolve/reject触发）
    if (this.status === MyPromise.PENDING) {
      this.onFulfilledCallbacks.push(() => {
        try {
          const result = onFulfilled(this.value);
          if (result instanceof MyPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (err) {
          reject(err);
        }
      });

      this.onRejectedCallbacks.push(() => {
        try {
          const result = onRejected(this.reason);
          if (result instanceof MyPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (err) {
          reject(err);
        }
      });
    }
  });
}
```

## 3.实现 catch 和 finally

```javascript
// catch本质是then(null, onRejected)
catch(onRejected) {
  return this.then(null, onRejected);
}

// finally无论状态如何都执行，且透传原状态
finally(onFinally) {
  return this.then(
    value => MyPromise.resolve(onFinally()).then(() => value),
    reason => MyPromise.resolve(onFinally()).then(() => { throw reason; })
  );
}
```

## 总结

Promise 的核心：通过状态管理（pending→fulfilled/rejected）和回调队列，规范异步操作的执行逻辑。
API 设计：then 链式调用解决回调嵌套，catch 统一错误处理，静态方法（all/race 等）简化多异步协同。
实现关键：状态不可逆、回调异步执行（微任务）、then 返回新 Promise 以支持链式调用。
Promise 是 JavaScript 异步编程的基础，后续的 async/await 语法也是基于 Promise 实现的，理解其原理对掌握异步逻辑至关重要。
