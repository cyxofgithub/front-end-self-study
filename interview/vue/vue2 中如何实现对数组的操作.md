## vue2 中如何实现对数组的操作

### 1. 数组操作方法

-   能响应式(vue 会拦截这几个方法)：`push`、`pop`、`shift`、`unshift`、`splice`、`sort`、`reverse`
-   无法响应式：直接通过索引赋值、直接修改 length

**示例：**

```js
// 能响应式：视图会更新
this.list.push(4);
this.list.splice(1, 1, 10); // 用10替换第2个元素
this.list.pop();
this.list.reverse();
```

**不能响应式：**

```js
this.list[1] = 123; // 不会触发视图更新
this.list.length = 0; // 也无法更新
```

### 2. 如何让索引赋值变得响应式？

必须用 Vue2 提供的 API：`Vue.set` 或 `this.$set`

```js
// 假设 list = [1, 2, 3]
this.$set(this.list, 1, 100); // 把第2个元素改成100，视图会更新

// 静态方法也可以
Vue.set(this.list, 1, 100);
```

### 3. 修改数组长度后如何通知视图？

可以用 `splice` 替代：

```js
this.list.splice(0, this.list.length); // 清空数组，并能通知视图
```

### 4. 总结

-   修改数组内容推荐用 push/pop/shift/unshift/splice/sort/reverse 等方法
-   如果希望通过**索引赋值**让视图响应，必须用 `Vue.set` 或 `this.$set`
-   不建议直接写 `arr[i] = val` 或 `arr.length = n`，这些 Vue2 检测不到
