## vue2

v-for 高于 v-if

缺陷：数组长度为 5，最后可能只需要渲染 4 个点。就需要多经历一次节点的插入和删除

```javascript
：<li v-for="user in users" v-if="user.show">
```

但是可以支持这种写法，不然 v-if 读不到每一项的 user.show

避免：在 computed 中先计算好

## vue3

v-if 的优先级比 v-for 高
所以如果同时使用的话，对于场景 1，这个时候 user 还没有，v-if="user.show"就会报错， 但是可以在设计上避免开发者使用上述语法，使用 computed 计算

vue3 到 vue2 迁移指南：https://v3-migration.vuejs.org/zh/breaking-changes/v-if-v-for
