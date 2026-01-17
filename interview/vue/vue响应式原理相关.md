
## vue3如何解决vue2响应式缺陷的

vue2缺陷：无法监听数组下标修改、对象新增属性；必须通过 Vue.set/this.$set 手动触发响应式。

Vue3 改进：用 Proxy 代理整个对象而非单个属性，天然支持数组、新增属性的监听

## vue2删除对象属性触发更新

Vue2 删除对象属性，需要使用 `Vue.delete(target, key)` 或 `this.$delete(target, key)`，这样才能触发响应式更新。如果直接用 `delete obj.prop`，Vue2 无法检测到属性的删除并更新视图。

示例：

```js
// 错误做法：不会触发视图更新
delete obj.foo;

// 正确做法：会触发视图更新
Vue.delete(obj, 'foo');
// 或
this.$delete(obj, 'foo');
```

原因：Vue2 的响应式原理基于 Object.defineProperty，只能追踪已经存在的属性。删除或新增属性时，需要用 `Vue.delete`/`this.$delete` 来确保响应式系统能监听到变化。


## vue2 数组支持监听那几个方法的修改

在 Vue2 中，响应式系统主要通过拦截数组的以下 7 个可变方法来实现对数组内容变更的监听：

- `push`
- `pop`
- `shift`
- `unshift`
- `splice`
- `sort`
- `reverse`

这些方法会改变数组本身，Vue2 会对这几个方法做包裹增强处理，使它们能触发视图更新。