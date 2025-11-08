## v-if 和 v-show 的区别

在 Vue.js 中，`v-if` 和 `v-show` 是两个常用的指令，用来条件性地渲染或显示 DOM 元素。虽然它们表面上看起来很相似，都可以根据条件来控制元素的显示与隐藏，但它们的实现方式和用途有显著不同。

### `v-if` 与 `v-show` 的主要区别

1. **渲染方式**：

    - `v-if` 是 "真正的" 条件渲染。根据条件的真假，元素会被动态地创建或销毁。
    - `v-show` 只是切换元素的 CSS `display` 属性，在条件为真时，元素的 `display` 属性为 `block`（或其它适当值），在条件为假时，`display` 属性为 `none`。

2. **性能**：

    - `v-if` 有较高地切换开销，因为每次条件变化时，元素都会被重新创建和销毁。如果切换操作频繁，性能较低。
    - `v-show` 有较高地初始渲染开销，但在条件变化时，仅仅是修改 `display` 属性，开销较小。适合频繁切换的场景。

3. **使用场景**：
    - `v-if` 适合在条件很少改变的情况下使用，因为其在条件变化时会重新渲染。
    - `v-show` 适合条件频繁变化的情况下，因为其不会移除元素，只是简单地显示或隐藏。

### 代码示例

#### 使用 `v-if`

```html
<template>
    <div>
        <button @click="toggle">Toggle v-if</button>
        <div v-if="isShown">This is rendered with v-if</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isShown: true,
            };
        },
        methods: {
            toggle() {
                this.isShown = !this.isShown;
            },
        },
    };
</script>
```

在这个例子中，当 `isShown` 为 `true` 时，`div` 元素会被渲染到 DOM 中；当 `isShown` 为 `false` 时，`div` 元素会被移除。

#### 使用 `v-show`

```html
<template>
    <div>
        <button @click="toggle">Toggle v-show</button>
        <div v-show="isShown">This is rendered with v-show</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isShown: true,
            };
        },
        methods: {
            toggle() {
                this.isShown = !this.isShown;
            },
        },
    };
</script>
```

在这个例子中，当 `isShown` 为 `true` 时，`div` 元素的 `display` 属性为 `block`（或其它适当值）；当 `isShown` 为 `false` 时，`div` 元素的 `display` 属性为 `none`。但无论怎样，`div` 元素始终存在于 DOM 中。

### 详细比较

| 特性         | `v-if`                               | `v-show`                      |
| ------------ | ------------------------------------ | ----------------------------- |
| 渲染方式     | 动态添加和删除 DOM 元素              | 切换元素的 CSS `display` 属性 |
| 初始渲染开销 | 较高，条件为真时才渲染               | 较低，初始时就渲染元素        |
| 条件变化开销 | 较高，每次条件变化时都会重新渲染元素 | 较低，仅修改 CSS 属性         |
| 使用场景     | 条件不常变化                         | 条件频繁变化                  |
| 保持状态     | 否，元素被移除后状态丢失             | 是，元素隐藏时仍保留在 DOM 中 |

### 总结

-   使用 `v-if`：当需要在条件变化时进行真正的增删 DOM 操作，或者条件很少改变时。
-   使用 `v-show`：当条件变化频繁且不希望频繁进行 DOM 增删操作时。

通过选择合适的指令，能够在保证性能和用户体验的基础上，提高代码的可维护性。
