## vue3 为什么改用 proxy

### vue2 使用 Object.defineProperty 的局限性

-   **无法监听数组的变化：**Object.defineProperty 只能劫持对象的属性，无法直接监听数组的变化。Vue 2 通过重写数组的方法（如 push、pop 等）来解决这个问题，但这并不是一个优雅的解决方案。
-   **无法劫持新增属性：**Object.defineProperty 只能劫持对象已有的属性，无法监听新增属性的变化。Vue 2 通过 Vue.set 方法来手动添加响应式属性，但这增加了使用的复杂性。
-   **性能问题：**Object.defineProperty 在初始化时需要遍历对象的每个属性并进行劫持，对于深层嵌套的对象，性能开销较大。

### proxy 的优点

-   **全面劫持：**Proxy 可以劫持包括属性读取、设置、删除、函数调用等在内的多种操作，提供了更全面的劫持能力。
-   **数组支持：**Proxy 可以直接劫持数组的操作，无需像 Vue 2 那样重写数组方法。
-   **动态属性：**Proxy 可以劫持对象的动态属性添加和删除，解决了 Object.defineProperty 无法监听新增属性的问题。
-   **性能提升：**Proxy 在处理深层嵌套对象时性能更好，因为它不需要在初始化时遍历所有属性,Proxy 的拦截是懒执行的（访问属性时才追踪依赖）

### proxy 赖加载原理

访问时才触发代理
```javascript
// 标记是否为响应式对象（简化版）
const reactiveMap = new WeakMap()

// 核心：创建响应式代理（模拟 Vue3 的 reactive 核心逻辑）
function reactive(target) {
  // 如果已经是响应式对象，直接返回（避免重复代理）
  if (reactiveMap.has(target)) {
    return reactiveMap.get(target)
  }

  // 创建 Proxy 代理（只代理外层，不递归）
  const proxy = new Proxy(target, {
    // 访问属性时触发（懒代理的核心）
    get(target, key, receiver) {
      console.log(`访问属性：${key}`)
      // 获取原始值
      const res = Reflect.get(target, key, receiver)

      // 关键：只有访问到嵌套对象时，才动态为其创建代理（惰性）
      if (typeof res === 'object' && res !== null && !reactiveMap.has(res)) {
        console.log(`懒代理：为嵌套对象的 ${key} 属性创建响应式`)
        // 递归为嵌套对象创建代理（但只在访问时执行）
        const nestedProxy = reactive(res)
        // 把代理后的对象“缓存”回原对象（下次访问直接取代理）
        Reflect.set(target, key, nestedProxy, receiver)
        return nestedProxy
      }

      return res
    },
    // 设置属性时触发（简化版）
    set(target, key, value, receiver) {
      console.log(`设置属性：${key} = ${value}`)
      return Reflect.set(target, key, value, receiver)
    }
  })

  // 缓存代理对象，避免重复创建
  reactiveMap.set(target, proxy)
  return proxy
}

// 测试：验证懒代理效果
const obj = reactive({
  a: 1,
  b: { // 初始化时不会被代理
    c: 2,
    d: { // 更内层，初始化也不代理
      e: 3
    }
  }
})

console.log('===== 第一次访问 obj.b =====')
console.log(obj.b) // 访问 b 时，才为 {c:2, d:{e:3}} 创建代理
console.log('===== 第一次访问 obj.b.d =====')
console.log(obj.b.d) // 访问 d 时，才为 {e:3} 创建代理
console.log('===== 再次访问 obj.b =====')
console.log(obj.b) // 直接取缓存的代理对象，不再重复创建
```