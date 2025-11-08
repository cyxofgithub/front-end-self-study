## vue 双向绑定原理

### 代码实现

```javascript
class Observer {
    constructor(data) {
        this.data = data;
        this.walk(data);
    }

    walk(obj) {
        Object.keys(obj).forEach(key => {
            this.defineReactive(obj, key, obj[key]);
        });
    }

    defineReactive(obj, key, val) {
        const dep = new Dep();

        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return val;
            },
            set(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                dep.notify();
            },
        });
    }
}

class Dep {
    constructor() {
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    notify() {
        this.subs.forEach(sub => {
            sub.update();
        });
    }
}

class Watcher {
    constructor(vm, exp, cb) {
        this.vm = vm;
        this.exp = exp;
        this.cb = cb;
        this.value = this.get();
    }

    update() {
        const value = this.vm.data[this.exp];
        const oldValue = this.value;
        if (value !== oldValue) {
            this.value = value;
            this.cb.call(this.vm, value, oldValue);
        }
    }

    get() {
        Dep.target = this;
        const value = this.vm.data[this.exp];
        Dep.target = null;
        return value;
    }
}

class Vue {
    constructor(options) {
        this.data = options.data;
        new Observer(this.data);
        this.mount();
    }

    mount() {
        Object.keys(this.data).forEach(key => {
            this.proxyKeys(key);
        });
        new Watcher(this, 'message', (value, oldValue) => {
            console.log('更新消息：', value);
        });
    }

    proxyKeys(key) {
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get() {
                return this.data[key];
            },
            set(newVal) {
                this.data[key] = newVal;
            },
        });
    }
}

// 使用示例
const vm = new Vue({
    data: {
        message: 'Hello Vue!',
    },
});

console.log(vm.message); // 输出：Hello Vue!
vm.message = 'Hello World!'; // 输出：更新消息：Hello World!
```

### 总结

Vue.js 的双向绑定原理是通过使用 Object.defineProperty 方法来实现的。Vue.js 会将数据对象中的每个属性转换为 getter 和 setter，以便在属性被访问或修改时触发相应的更新。

当 Vue 实例创建时，它会遍历数据对象中的每个属性，并使用 Object.defineProperty 定义属性的 getter 和 setter。这样一来，当属性被读取时，Vue 会追踪依赖关系，并将观察者添加到依赖列表中。当属性被修改时，Vue 会通知相关的观察者，触发相应的更新。
