## vue3 性能优化做了哪些

### 编译层面
1. 静态标记提升（避免重复创建节点，降低cpu开销、gc压力）
    - [参考](./vue3静态标记提升)
2. PatchFlags（补丁标记）精准标识节点动态部分（减少无意义比对）
    - [参考](./vue3%20PatchFlags原理.md)
3. 缓存事件处理函数，避免每次渲染重新创建（降低cpu开销、gc压力）
  - 对 @click="handleClick" 这类静态事件，编译时缓存函数引用，避免每次渲染重新创建：
```javascript
// Vue3 编译结果
const _hoisted_2 = { onClick: handleClick } // 缓存事件对象
createVNode('button', _hoisted_2, '点击')
```

### 响应式层
1. 赖代理，访问时才代理（初始化时间、内存占用减少）

### 编译优化：Tree-shaking 支持
**优化点**
Vue2 的核心功能是整体导出的，即使只用到部分功能，打包时也会包含全部代码，体积大。
**实现方式**
Vue3 采用 模块化设计，将核心功能拆分为独立的函数 / 模块，配合 ES Module 实现 Tree-shaking



