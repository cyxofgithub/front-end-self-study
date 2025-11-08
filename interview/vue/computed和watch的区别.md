## computed 和 watch 的区别

`computed` 和 `watch` 是 Vue.js 中用于响应式编程的两个重要特性，它们都能对数据的变化做出反应，但适用于不同的场景。下面将详细介绍它们之间的不同点。

### 1. 主要区别

-   `computed`: 通常用于基于响应式数据的计算属性。它是基于依赖的数据缓存的，只有当依赖的数据发生变化时，`computed` 属性才会重新计算。
-   `watch`: 用于观察和响应数据的变化，可以执行异步操作或复杂逻辑。这对于需要在数据变化时执行某些动作（比如 API 调用）非常有用。

### 2. 性能和缓存

-   **计算属性 (`computed`)**:
    -   **缓存**: 计算属性是基于其依赖的缓存的。只要依赖的数据没有变化，计算属性就不会重新计算。
    -   **性能**: 因为计算属性是缓存的，性能通常比 `watch` 要好，特别是在依赖数据频繁变化的情况下。

```javascript
computed: {
  fullName() {
    console.log('computed fullName called');
    return `${this.firstName} ${this.lastName}`;
  }
}
```

在上面这个例子中，`fullName` 只有在 `firstName` 或 `lastName` 变化时才会重新计算，并且每次访问 `fullName` 时都是从缓存中读取，除非依赖的数据发生变化。

-   **侦听器 (`watch`)**:
    -   **缓存**: `watch` 没有缓存概念。每次所监控的数据变化时，定义的回调函数都会被执行。
    -   **用途**: `watch` 通常用于执行副作用或异步操作，比如在数据变化时执行一些逻辑或发起网络请求。

```javascript
watch: {
  firstName(newVal, oldVal) {
    console.log('First name changed from', oldVal, 'to', newVal);
  }
}
```

在上面这个例子中，每次 `firstName` 变化时，都会执行回调函数，并且新值和旧值都可以通过参数获取。

### 3. 使用场景

-   **计算属性 (`computed`)**:
    -   适用于需要基于其它数据进行计算，并且希望该计算结果能高效地被缓存的场景。
    -   通常对于模板 (template) 部分的表达式，使用计算属性能够保持模板的简洁和可读性。

```html
<template>
    <div>{{ fullName }}</div>
</template>

<script>
    export default {
        data() {
            return {
                firstName: 'John',
                lastName: 'Doe',
            };
        },
        computed: {
            fullName() {
                return `${this.firstName} ${this.lastName}`;
            },
        },
    };
</script>
```

-   **侦听器 (`watch`)**:
    -   适用于数据变化需要额外逻辑、异步操作、或必须与外部系统交互的情况。
    -   例如，当某个数据变化时，你想要发起 API 请求或者执行某个复杂的逻辑。

```html
<template>
    <div>{{ message }}</div>
</template>

<script>
    export default {
        data() {
            return {
                query: '',
                message: '',
            };
        },
        watch: {
            query(newVal) {
                this.fetchData(newVal);
            },
        },
        methods: {
            fetchData(query) {
                // 假设 fetch 是一个返回 Promise 的异步函数
                fetch(`https://api.example.com/search?q=${query}`)
                    .then(response => response.json())
                    .then(data => {
                        this.message = data.message;
                    });
            },
        },
    };
</script>
```

### 4. 进一步对比

| **特性**     | **computed**               | **watch**                      |
| ------------ | -------------------------- | ------------------------------ |
| **语法**     | 属性                       | 函数                           |
| **缓存**     | 是                         | 否                             |
| **参数**     | 无（自动侦测依赖）         | `newVal`, `oldVal`（可选）     |
| **适用场景** | 基于响应式数据的计算和缓存 | 数据变化时执行副作用或复杂逻辑 |
| **性能**     | 高效，因缓存存在           | 性能取决于回调函数内容         |

### 总结

-   使用 `computed` 来处理基于现有数据的派生数据，并且这些派生数据会被频繁读取。
-   使用 `watch` 来响应数据的变化，并执行异步操作或复杂逻辑，如表单验证、发起网络请求等。
