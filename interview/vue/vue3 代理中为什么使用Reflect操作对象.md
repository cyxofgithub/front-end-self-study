## 直接操作和 Reflect 对比

| 场景           | 直接操作对象（如 target[key]）        | Reflect 操作（如 Reflect.get(target, key, receiver)） |
| -------------- | ------------------------------------- | ----------------------------------------------------- |
| this 绑定      | 指向原对象 target                     | 可通过 receiver 绑定到代理对象或操作上下文            |
| 原生行为一致性 | 可能忽略属性特性（如 getter、继承链） | 严格遵循原生对象操作逻辑                              |
| 错误处理       | 失败时可能抛出错误（需 try/catch）    | 返回布尔值表示成功与否，便于处理                      |
| 兼容性与扩展性 | 难以适配未来语言特性                  | 与 Proxy 设计绑定，天然支持扩展                       |

## this 绑定错误例子

假设 parent 的 a 是一个访问器属性（getter），其值依赖 this 指向的对象：

```javascript
const parent = {
    get a() {
        // 依赖 this 指向的对象的 b 属性
        return this.b;
    },
};
const child = Object.create(parent);
child.b = 200; // child 自身有 b 属性

// 直接访问 child.a：this 指向 child，返回 child.b → 200（正确）
console.log(child.a); // 200
```

现在用代理包裹 child，并在陷阱中用 target[key] 直接操作：

```javascript
const proxy = new Proxy(child, {
    get(target, key) {
        // target 是 child，target[key] 中 this 指向 target（child）
        return target[key];
    },
});

// 给 proxy 自身添加 b 属性（注意：proxy 和 child 是两个对象）
proxy.b = 300;

// 访问 proxy.a 时，预期应该返回 proxy.b（300），但实际结果是 200
console.log(proxy.a); // 200（不符合预期）
```
