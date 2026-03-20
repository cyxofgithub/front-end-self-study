## [keep-alived](https://github.com/vuejs/vue/blob/main/src/core/components/keep-alive.ts)

`<keep-alive>` 是 Vue 提供的一个内置组件，用于缓存动态组件，避免不必要的重新渲染和初始化操作。它通常用于在组件切换时保留组件的状态或避免重新渲染。

### 使用场景

`<keep-alive>` 组件通常用于以下场景：

1. **路由组件缓存：** 在单页应用中，切换路由时保留组件的状态。
2. **动态组件缓存：** 在动态组件切换时保留组件的状态。

### 基本用法

以下是一个简单的示例，展示了如何使用 `<keep-alive>` 组件：

```html
<template>
    <div id="app">
        <button @click="currentView = 'A'">Show A</button>
        <button @click="currentView = 'B'">Show B</button>
        <keep-alive>
            <component :is="currentView"></component>
        </keep-alive>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                currentView: 'A',
            };
        },
        components: {
            A: {
                template: '<div>Component A</div>',
                created() {
                    console.log('Component A created');
                },
            },
            B: {
                template: '<div>Component B</div>',
                created() {
                    console.log('Component B created');
                },
            },
        },
    };
</script>
```

在这个示例中，切换组件时，`<keep-alive>` 会缓存已经渲染过的组件，避免重新创建和销毁组件。

### 属性

`<keep-alive>` 组件提供了一些属性，用于控制缓存行为：

1. **include**：字符串或正则表达式，只有名称匹配的组件会被缓存。
2. **exclude**：字符串或正则表达式，名称匹配的组件不会被缓存。
3. **max**：数字，最多可以缓存多少组件实例。

#### 示例

```html
<keep-alive include="A,B">
    <component :is="currentView"></component>
</keep-alive>

<keep-alive :include="/A|B/">
    <component :is="currentView"></component>
</keep-alive>

<keep-alive exclude="C">
    <component :is="currentView"></component>
</keep-alive>

<keep-alive :max="10">
    <component :is="currentView"></component>
</keep-alive>
```

### 生命周期钩子

当组件被 `<keep-alive>` 缓存时，会触发一些特定的生命周期钩子：

1. **activated**：当组件被激活时调用。
2. **deactivated**：当组件被停用时调用。

#### 示例

```javascript
export default {
    activated() {
        console.log('Component activated');
    },
    deactivated() {
        console.log('Component deactivated');
    },
};
```

### 实际应用

#### 路由组件缓存

在 Vue Router 中，可以使用 `<keep-alive>` 缓存路由组件：

```html
<template>
    <div id="app">
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component"></component>
            </keep-alive>
        </router-view>
    </div>
</template>
```

#### 动态组件缓存

在动态组件切换时，可以使用 `<keep-alive>` 缓存组件：

```html
<template>
    <div id="app">
        <button @click="currentView = 'A'">Show A</button>
        <button @click="currentView = 'B'">Show B</button>
        <keep-alive>
            <component :is="currentView"></component>
        </keep-alive>
    </div>
</template>
```

### 原理概述

`<keep-alive>` 组件通过缓存已经渲染过的组件实例，并在组件切换时复用这些实例，从而避免组件的重新创建和销毁。它主要通过以下几个步骤实现：

1. **缓存组件实例：** 当组件第一次被渲染时，`<keep-alive>` 会将组件实例缓存起来。
2. **复用组件实例：** 当组件被切换回来时，`<keep-alive>` 会从缓存中取出组件实例，复用之前的实例，而不是重新创建一个新的实例。
3. **管理组件生命周期：** `keep-alive` 会触发特定的生命周期钩子（如 `activated` 和 `deactivated`），以便开发者可以在组件被激活或停用时执行特定的逻辑。

#### 实现细节

##### 1. 缓存机制

`<keep-alive>` 组件内部维护了一个缓存对象，用于存储已经渲染过的组件实例。这个缓存对象的键是组件的唯一标识符（通常是组件的 `key` 或 `name`），值是组件的实例。

```javascript
const cache = Object.create(null);
```

##### 2. 渲染逻辑

在渲染过程中，`<keep-alive>` 会检查当前组件是否已经在缓存中。如果在缓存中，则直接复用缓存中的实例；如果不在缓存中，则创建新的实例并将其添加到缓存中。

```javascript
const vnode = this.$slots.default[0];
const key = vnode.key == null ? vnode.tag : vnode.key;

if (cache[key]) {
    vnode.componentInstance = cache[key].componentInstance;
} else {
    cache[key] = vnode;
}
```

##### 3. 生命周期管理

`<keep-alive>` 组件会在组件实例被激活和停用时，分别触发 `activated` 和 `deactivated` 生命周期钩子。这些钩子允许开发者在组件被缓存和复用时执行特定的逻辑。

```javascript
insert(vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance)
      } else {
        activateChildComponent(componentInstance, true /* direct */)
      }
    }
  },

  destroy(vnode: MountedComponentVNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy()
      } else {
        deactivateChildComponent(componentInstance, true /* direct */)
      }
    }
  }
```

##### 4. 属性控制

`<keep-alive>` 提供了 `include`、`exclude` 和 `max` 属性，用于控制哪些组件应该被缓存，哪些组件不应该被缓存，以及最多缓存多少个组件实例。

-   **include/exclude：** 通过字符串、正则表达式或数组来匹配组件的名称，决定是否缓存。
-   **max：** 设置缓存的最大数量，超过这个数量时，会移除最早缓存的组件实例。

```javascript
const { include, exclude, max } = this;

if (include && (!name || !matches(include, name))) {
    return vnode;
}
if (exclude && name && matches(exclude, name)) {
    return vnode;
}
if (max && keys.length > parseInt(max)) {
    pruneCacheEntry(cache, keys[0], keys, this._vnode);
}
```

### 总结

-   **缓存机制：** `<keep-alive>` 通过缓存已经渲染过的组件实例，避免不必要的重新渲染和初始化操作。
-   **复用组件实例：** 在组件切换时，复用缓存中的组件实例，而不是重新创建新的实例。
-   **生命周期管理：** 通过 `activated` 和 `deactivated` 生命周期钩子，管理组件的激活和停用状态。
-   **属性控制：** 提供 `include`、`exclude` 和 `max` 属性，控制缓存行为。

希望这些信息对你理解 `<keep-alive>` 的原理有所帮助！如果有更多问题，欢迎继续提问。
