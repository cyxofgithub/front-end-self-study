# Vuex 与 Pinia

## 区别

| 对比项        | Vuex（Vue 2/3）                    | Pinia（Vue 3 官方推荐）          |
| ------------- | ---------------------------------- | -------------------------------- |
| 适配版本      | Vue 2、Vue 3 均可用                | 主要适配 Vue 3                   |
| API 风格      | 选项式（modules、mutations 等）    | 更简洁组合式（Setup 支持好）     |
| Module        | 支持，写法繁琐                     | 本质即模块，无嵌套概念，轻量     |
| State 定义    | 对象，需返回函数                   | 可用函数，支持 TS 类型推断       |
| Getters       | 支持                               | 支持，语法更简洁                 |
| **Mutations** | 强制，必须通过 mutation 修改 state | 不强制，直接修改 state 或 action |
| Actions       | 支持，区分同步/异步                | 支持，均可处理同步/异步          |
| Devtools 支持 | 支持                               | 支持，且更好（时间旅行等）       |
| 类型推断      | 较弱，TS 支持一般                  | 原生支持 TS，类型自动推断        |
| 使用方式      | this.$store 或 mapXxx 工具         | 直接 useXxxStore 获取，响应式    |
| 文件体积      | 略大                               | 更小，依赖更少                   |

## 为什么 Vuex 需要通过 commit，Pinia 不用？

原因分两层：**技术层**（`defineProperty` vs `Proxy` 的拦截能力差异）和**架构层**（Flux 模式的取舍）。

### 技术层：defineProperty 的三大短板

`console.trace()` 在 defineProperty setter 里其实**也能用**，调用栈照样能打印。真正的问题是 defineProperty **根本拦截不到某些操作**，不是拦到了却不知道谁触发的。

```javascript
const obj = {};

// 只为 count 属性设置拦截
Object.defineProperty(obj, 'count', {
    set(newVal) {
        console.log('count 被改成', newVal);
        this._count = newVal;
    },
    get() {
        return this._count;
    },
});

obj.count = 1;  // ✅ 拦截成功

// 短板 1：新增属性 —— 完全绕过了拦截
obj.newProp = 666;  // ❌ defineProperty 感知不到

// 短板 2：删除属性 —— 也感知不到
delete obj.count;   // ❌ defineProperty 感知不到

// 短板 3：数组索引赋值 —— 必须重写数组方法才能拦截
const arr = [1, 2, 3];
// defineProperty 无法高效拦截 arr[0] = 99 这种操作
```

Vue 2 为了弥补短板 1，提供了 `Vue.set(obj, 'newProp', value)`；为了弥补短板 3，重写了 `push/pop/splice/shift/unshift/sort/reverse` 七个数组方法。这些”补丁”就是 Vuex 强制 mutation 的技术根源——**如果允许直接改 state，开发者可能用 `obj.newProp = x` 或 `arr[2] = y` 这种 defineProperty 拦截不了的方式修改，Vue 2 就无法感知变化，视图不会更新。** 所以 Vuex 用 mutation 把修改集中起来，确保所有修改走的都是预先声明好的路径。

### Proxy 的完整拦截能力

```javascript
const state = { count: 0 };
const p = new Proxy(state, {
    set(target, key, value, receiver) {
        console.log(`${String(key)} 被修改为 ${value}`);
        target[key] = value;
        return true;
    },
    deleteProperty(target, key) {
        console.log(`${String(key)} 被删除`);
        return Reflect.deleteProperty(target, key);
    },
});

p.count = 1;       // ✅ 拦截
p.newProp = 666;   // ✅ 拦截（defineProperty 做不到）
delete p.count;    // ✅ 拦截（defineProperty 做不到）
```

Proxy 能拦截包括新增、删除、`in`、`for...in` 在内的 13 种操作，这就意味着**任何对 state 的修改都能被感知到**。Pinia 不再需要 mutation 这一层约束，直接改 state 也不会出现”改了但视图没更新”的问题。

### 架构层：Flux 模式的历史选择

| | Vuex | Pinia |
| -- | -- | -- |
| 架构理念 | Flux（单向数据流 + 显式 mutation） | 简化 Flux（去 mutation 层） |
| 状态追踪 | 靠 `commit(type)` 的 type 字段记录变更 | Proxy 自动拦截 + devtools 插件记录 |
| 时间旅行 | 基于 mutation 快照 | 基于 Proxy 拦截的时间线 |
| TypeScript | 需要手动声明类型 | 自动推断 |

Vuex 选择 Flux 模式有两个原因：
1. defineProperty 的拦截能力有限，需要人为约束修改入口
2. Flux 的设计哲学本身就是”让状态变更有迹可循”

到了 Vue 3 + Proxy 时代，所有修改都能被自动拦截，mutation 层就成了纯粹的冗余——这就是 Pinia 可以去掉它的根本原因。

## 核心源码原理：状态更新如何驱动视图更新

### 一、Vue 响应式基础回顾

无论是 Vuex 还是 Pinia，最终都是依赖 Vue 自身的响应式系统来驱动视图更新。理解这套机制需要先认清两个角色：

| 角色                    | 说明                                                                     |
| ----------------------- | ------------------------------------------------------------------------ |
| **依赖收集（track）**   | 组件渲染时读取 state → 当前组件的 render effect 被记录为"依赖"           |
| **派发更新（trigger）** | state 被修改 → 通知所有依赖该 state 的 render effect 重新执行 → 视图更新 |

**Vue 2** 用 `Object.defineProperty` + 发布订阅模式（Dep/Watcher）实现。  
**Vue 3** 用 `Proxy` + `effect` 系统（ReactiveEffect）实现。

下面分别剖析 Vuex 和 Pinia 是如何"接入"这套响应式系统的。

### 二、Vuex 核心原理

#### Vuex 3（Vue 2 版本）

Vuex 3 内部 new 了一个 Vue 实例，把 state 放进 data，借用 Vue 2 的响应式能力。

```javascript
// Vuex 3 源码核心（简化）
class Store {
    constructor(options = {}) {
        // 关键：resetStoreVM —— 借用一个 Vue 实例来做响应式
        this._vm = new Vue({
            data: {
                $$state: options.state, // state 被放入 Vue 实例的 data
            },
        });
        // ...
    }

    // 读取 store.state 时，实际读的是 this._vm._data.$$state
    get state() {
        return this._vm._data.$$state;
    }

    // 禁止直接设置 store.state
    set state(v) {
        throw new Error('[vuex] Use store.replaceState() to replace state.');
    }

    // 注册 mutation
    commit(type, payload) {
        const mutation = this._mutations[type];
        mutation.forEach((handler) => handler(this.state, payload));
        // mutation 内部执行 state.xxx = yyy
        // → 触发 defineProperty 的 set
        // → set 内部调用 dep.notify()
        // → 通知所有依赖该 state 的组件 watcher 重新渲染
    }
}
```

**状态→视图更新链路（Vuex 3）：**

```
组件渲染读取 this.$store.state.count
  → Vue 2 defineProperty get 拦截
  → dep.depend() 将当前组件的 render Watcher 收集为依赖

commit('increment')
  → mutation: state.count++
  → defineProperty set 拦截
  → dep.notify()
  → 组件 render Watcher 收到通知
  → 组件重新渲染 → 视图更新
```

#### Vuex 4（Vue 3 版本）

Vuex 4 改用 Vue 3 的 `reactive()`，但整体思路一致。

```javascript
// Vuex 4 源码核心（简化）
import { reactive } from 'vue';

class Store {
    constructor(options = {}) {
        // 用 reactive 包裹 state
        this._state = reactive(options.state());

        // 同理注册 mutations / actions
        // ...
    }

    get state() {
        return this._state;
    }

    commit(type, payload) {
        const mutation = this._mutations[type];
        mutation.forEach((handler) => handler(this.state, payload));
        // mutation 内部修改 this.state.xxx
        // → Proxy set 拦截
        // → trigger() 通知所有依赖的 effect
        // → 组件 effect 重新执行 → 视图更新
    }
}
```

**状态→视图更新链路（Vuex 4）：**

```
组件渲染读取 store.state.count
  → Proxy get 拦截
  → track(target, key) 将当前组件的 render effect 收集为依赖

commit('increment')
  → mutation: state.count++
  → Proxy set 拦截
  → trigger(target, key)
  → 组件 render effect 重新执行
  → 视图更新
```

### 三、Pinia 核心原理

Pinia 直接用 Vue 3 的 `reactive()`，不需要 new Vue 实例，也不需要 commit / mutation 层。**state 本身就是 reactive 对象，修改即触发。**

```javascript
// Pinia 源码核心（简化）
import { reactive, computed, effectScope } from 'vue';

function defineStore(id, options) {
    function useStore() {
        // 1. 用 reactive 包裹 state —— 这就是一切的基础
        const state = reactive(options.state());

        // 2. getters → 包装为 computed
        const getters = {};
        Object.keys(options.getters).forEach((key) => {
            getters[key] = computed(() => options.getters[key].call(store));
        });

        // 3. actions 就是普通函数，直接操作 state
        const actions = {};
        Object.keys(options.actions).forEach((key) => {
            actions[key] = (...args) => options.actions[key].apply(store, args);
        });

        const store = { ...state, ...getters, ...actions };
        return store;
    }

    return useStore;
}
```

> **关键点**：Pinia 里没有 commit、没有 mutation 这一层。`state` 被 `reactive()` 包裹后，无论在哪里修改它（action 内、组件内直接赋值），Proxy 都会自动拦截并触发 trigger，进而驱动视图更新。

**状态→视图更新链路（Pinia）：**

```
组件渲染读取 store.count
  → Proxy get 拦截
  → track(target, 'count') 将当前组件的 render effect 收集为依赖

store.count++ 或 调用 action 内部 state.count++
  → Proxy set 拦截
  → trigger(target, 'count')
  → 组件 render effect 重新执行
  → 视图更新
```

### 四、一句话总结差异

|              | Vuex                                                      | Pinia                                                      |
| ------------ | --------------------------------------------------------- | ---------------------------------------------------------- |
| 响应式手段   | Vuex 3: `new Vue({ data })`，Vuex 4: `reactive()`         | `reactive()`                                               |
| 修改入口     | 必须通过 `commit(mutation)`                               | 直接改，或通过 action                                      |
| 视图更新触发 | mutation 内 `state.xxx = yyy` → Dep/Watcher 通知 → 重渲染 | 任意位置 `state.xxx = yyy` → Proxy trigger → effect 重渲染 |
| 本质区别     | 多一层 mutation 作为中间层，约束修改路径                  | 零中间层，reactive 对象天然支持任意位置修改并触发更新      |

**核心结论**：Vuex 和 Pinia 驱动视图更新的底层机制完全相同——都是 Vue 的响应式系统在起作用。区别在于 Vuex 在响应式之上加了一层 mutation 约束（历史原因：Vue 2 的 defineProperty 无法追踪调用栈），而 Pinia 利用 Proxy 的能力去掉了这一层，让状态管理更轻更直接。
