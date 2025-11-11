```javascript
function reactive(target) {
    return new Proxy(target, {
        get(target, key, receiver) {
            track(target, key); // 追踪依赖
            return Reflect.get(target, key, receiver);
        },
        set(target, key, value, receiver) {
            const oldValue = Reflect.get(target, key, receiver);
            if (oldValue !== value) {
                // 值变化时才触发更新
                Reflect.set(target, key, value, receiver);
                trigger(target, key); // 触发响应
            }
            return true;
        },
        deleteProperty(target, key) {
            const hasKey = Reflect.has(target, key);
            const result = Reflect.deleteProperty(target, key);
            if (hasKey && result) {
                // 属性存在且删除成功时触发更新
                trigger(target, key);
            }
            return result;
        },
    });
}
```
