## Vuex 与 Pinia 的区别

| 对比项          | Vuex（Vue 2/3）                   | Pinia（Vue 3 官方推荐）         |
| --------------- | ---------------------------------- | ------------------------------ |
| 适配版本        | Vue 2、Vue 3 均可用                | 主要适配 Vue 3                 |
| API 风格        | 选项式（modules、mutations 等）    | 更简洁组合式（Setup 支持好）    |
| Module          | 支持，写法繁琐                    | 本质即模块，无嵌套概念，轻量    |
| State 定义      | 对象，需返回函数                   | 可用函数，支持 TS 类型推断       |
| Getters         | 支持                               | 支持，语法更简洁                |
| **Mutations**       | 强制，必须通过 mutation 修改 state | 不强制，直接修改 state 或 action|
| Actions         | 支持，区分同步/异步                | 支持，均可处理同步/异步          |
| Devtools 支持   | 支持                               | 支持，且更好（时间旅行等）       |
| 类型推断        | 较弱，TS 支持一般                  | 原生支持 TS，类型自动推断        |
| 使用方式        | this.$store 或 mapXxx 工具        | 直接 useXxxStore 获取，响应式    |
| 文件体积        | 略大                               | 更小，依赖更少                   |


## 为什么 vuex 需要通过 commit，pinia 不用？

vuex 底层是用 definePropety 实现，状态变化时无法获得调用栈，无法感知是谁实现的，所以只能强制要求要通过 commit 来记录状态变化

```javascript
const obj = {};
// 只为count属性设置拦截
Object.defineProperty(obj, 'count', {
  set(newVal) {
    console.log('count被改成了', newVal);
    // ❌ 这里只能知道count被改了，但完全不知道：
    // - 是哪个函数/哪个Action触发的修改？
    // - 是同步改的还是异步改的？
    this._count = newVal;
  },
  get() {
    return this._count;
  }
});

// 场景1：直接修改
obj.count = 1; // 日志：count被改成了 1 → 不知道是“直接修改”触发的

// 场景2：函数A修改
function A() { obj.count = 2; }
A(); // 日志：count被改成了 2 → 不知道是函数A触发的

// 场景3：Action里修改
const action = () => { setTimeout(() => obj.count = 3, 1000); };
action(); // 日志：count被改成了 3 → 不知道是异步Action触发的
```


pinia 底层是用 proxy 可以获得调用栈

```javascript
const obj = {};
// 只为count属性设置拦截
Object.defineProperty(obj, 'count', {
  set(newVal) {
    console.log('count被改成了', newVal);
    // ❌ 这里只能知道count被改了，但完全不知道：
    // - 是哪个函数/哪个Action触发的修改？
    // - 是同步改的还是异步改的？
    this._count = newVal;
  },
  get() {
    return this._count;
  }
});

// 场景1：直接修改
obj.count = 1; // 日志：count被改成了 1 → 不知道是“直接修改”触发的

// 场景2：函数A修改
function A() { obj.count = 2; }
A(); // 日志：count被改成了 2 → 不知道是函数A触发的

// 场景3：Action里修改
const action = () => { setTimeout(() => obj.count = 3, 1000); };
action(); // 日志：count被改成了 3 → 不知道是异步Action触发的
```

