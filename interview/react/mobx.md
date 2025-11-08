## 是什么

MobX 是一个简单、可扩展且高性能的状态管理库，用于构建 React、Angular、Vue 等前端应用。它提供了一种简洁的方式来管理应用的状态，并使状态的变化能够自动地驱动 UI 的更新。

## 核心概念

MobX 的核心概念是可观察对象（Observable）、计算属性（Computed）和动作（Action）：

可观察对象（Observable）：可观察对象是状态的容器，它们可以是 JavaScript 对象、数组、Map 等。通过使用 observable 函数将对象转换为可观察对象，MobX 可以追踪对象的变化并自动更新相关的 UI。

计算属性（Computed）：计算属性是从可观察对象派生出的值，它们根据可观察对象的变化自动更新。计算属性可以通过使用 computed 函数来定义，它们可以依赖于其他可观察对象和计算属性。

动作（Action）：动作是修改状态的函数，它们通过使用 action 函数来定义。在 MobX 中，所有的状态修改都必须通过动作来进行，这样 MobX 可以追踪状态的修改并触发相关的更新。

## 怎么用

在 react 中的使用示例

```javascript
import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';

// 创建一个可观察的状态管理类
class CounterStore {
    @observable count = 0;

    @computed get doubledCount() {
        return this.count * 2;
    }

    @action increment() {
        this.count++;
    }

    @action decrement() {
        this.count--;
    }
}

// 创建一个可观察对象
const counterStore = new CounterStore();

// 创建一个观察者组件
const Counter = observer(() => {
    return (
        <div>
            <p>Count: {counterStore.count}</p>
            <p>Doubled Count: {counterStore.doubledCount}</p>
            <button onClick={counterStore.increment}>Increment</button>
            <button onClick={counterStore.decrement}>Decrement</button>
        </div>
    );
});

// 创建一个根组件
function App() {
    return (
        <div>
            <h1>Counter App</h1>
            <Counter />
        </div>
    );
}

export default App;
```

## 原理

类似于 vue2 响应式原理，观察者模式的一种应用：
1、将 forceupdate 作为依赖
2、状态对象为可观察到对象，在读取值的时候收集依赖，在设置值的时候触发依赖，即可实现状态更新

```javascript
let currentObserver = null;

function observe(callback) {
    currentObserver = callback;
    callback();
    currentObserver = null;
}

function observable(value) {
    const observers = new Set();

    function get() {
        if (currentObserver) {
            observers.add(currentObserver);
        }
        return value;
    }

    function set(newValue) {
        if (value !== newValue) {
            value = newValue;
            observers.forEach(observer => observer());
        }
    }

    return { get, set };
}

function autorun(callback) {
    observe(callback);

    return function dispose() {
        // 将收集的依赖清除
        observer.delete(callback);
    };
}

function observer(component) {
    return function ObserverComponent(props) {
        const [_, forceUpdate] = React.useReducer(x => x + 1, 0);

        React.useEffect(() => {
            const dispose = autorun(() => {
                forceUpdate();
            });

            return () => {
                dispose();
            };
        }, []);

        return React.createElement(component, props);
    };
}
```
