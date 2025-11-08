## vue 中的通讯方式

在 Vue 2 和 Vue 3 中，组件之间的通讯是一个常见的需求。两者在组件通讯方式上有许多相似之处，但 Vue 3 引入了一些新的特性和改进。以下是详细的组件通讯方式及其在 Vue 2 和 Vue 3 中的实现：

### 1. 父子组件通讯

#### Vue 2 和 Vue 3

**父组件传递数据给子组件（Props）**

父组件通过 `props` 向子组件传递数据：

```vue
<!-- ParentComponent.vue -->
<template>
    <ChildComponent :message="parentMessage" />
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
    components: { ChildComponent },
    data() {
        return {
            parentMessage: 'Hello from Parent',
        };
    },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
    <div>{{ message }}</div>
</template>

<script>
export default {
    props: {
        message: String,
    },
};
</script>
```

**子组件向父组件发送消息（事件）**

子组件通过 `$emit` 触发事件，父组件监听事件：

```vue
<!-- ParentComponent.vue -->
<template>
    <ChildComponent @childEvent="handleChildEvent" />
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
    components: { ChildComponent },
    methods: {
        handleChildEvent(payload) {
            console.log('Received from child:', payload);
        },
    },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
    <button @click="sendMessage">Send Message to Parent</button>
</template>

<script>
export default {
    methods: {
        sendMessage() {
            this.$emit('childEvent', 'Hello from Child');
        },
    },
};
</script>
```

### 2. 兄弟组件通讯

#### Vue 2 和 Vue 3

**通过父组件中转**

兄弟组件之间的通讯可以通过父组件作为中转站：

```vue
<!-- ParentComponent.vue -->
<template>
    <SiblingOne @messageToSibling="handleMessage" />
    <SiblingTwo :message="siblingMessage" />
</template>

<script>
import SiblingOne from './SiblingOne.vue';
import SiblingTwo from './SiblingTwo.vue';

export default {
    components: { SiblingOne, SiblingTwo },
    data() {
        return {
            siblingMessage: '',
        };
    },
    methods: {
        handleMessage(message) {
            this.siblingMessage = message;
        },
    },
};
</script>
```

```vue
<!-- SiblingOne.vue -->
<template>
    <button @click="sendMessage">Send Message to Sibling</button>
</template>

<script>
export default {
    methods: {
        sendMessage() {
            this.$emit('messageToSibling', 'Hello from Sibling One');
        },
    },
};
</script>
```

```vue
<!-- SiblingTwo.vue -->
<template>
    <div>{{ message }}</div>
</template>

<script>
export default {
    props: {
        message: String,
    },
};
</script>
```

### 3. 跨层级组件通讯

#### Vue 2

**事件总线**

在 Vue 2 中，可以使用事件总线（Event Bus）来实现跨层级组件通讯：

```javascript
// eventBus.js
import Vue from 'vue';
export const EventBus = new Vue();
```

```vue
<!-- ComponentA.vue -->
<template>
    <button @click="sendMessage">Send Message</button>
</template>

<script>
import { EventBus } from './eventBus';

export default {
    methods: {
        sendMessage() {
            EventBus.$emit('messageEvent', 'Hello from Component A');
        },
    },
};
</script>
```

```vue
<!-- ComponentB.vue -->
<template>
    <div>{{ message }}</div>
</template>

<script>
import { EventBus } from './eventBus';

export default {
    data() {
        return {
            message: '',
        };
    },
    created() {
        EventBus.$on('messageEvent', msg => {
            this.message = msg;
        });
    },
};
</script>
```

#### Vue 3

**提供/注入（Provide/Inject）**

Vue 3 提供了 `provide` 和 `inject` API 来实现跨层级组件通讯：

```vue
<!-- ParentComponent.vue -->
<template>
    <ChildComponent />
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
    components: { ChildComponent },
    setup() {
        provide('sharedData', 'Hello from Parent');
    },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
    <div>{{ sharedData }}</div>
</template>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const sharedData = inject('sharedData');
        return { sharedData };
    },
};
</script>
```

单向数据流：
provide 和 inject 实现的是单向数据流，即父组件提供数据，子组件注入数据。子组件不能直接修改父组件提供的数据。
如果需要在子组件中修改数据，通常需要通过事件或其他方式通知父组件进行修改。

### 4. 全局状态管理

#### Vue 2 和 Vue 3

**Vuex**

Vuex 是 Vue 的官方状态管理库，适用于大型应用的全局状态管理：

```javascript
// store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        message: 'Hello from Vuex',
    },
    mutations: {
        setMessage(state, payload) {
            state.message = payload;
        },
    },
    actions: {
        updateMessage({ commit }, message) {
            commit('setMessage', message);
        },
    },
});
```

```vue
<!-- ComponentA.vue -->
<template>
    <button @click="updateMessage">Update Message</button>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions(['updateMessage']),
        updateMessage() {
            this.updateMessage('Hello from Component A');
        },
    },
};
</script>
```

```vue
<!-- ComponentB.vue -->
<template>
    <div>{{ message }}</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['message']),
    },
};
</script>
```

### 总结

Vue 2 和 Vue 3 都提供了多种组件通讯方式，包括父子组件通讯、兄弟组件通讯、跨层级组件通讯和全局状态管理。Vue 3 引入了一些新的特性，如 `provide` 和 `inject`，使得跨层级组件通讯更加简洁和高效。根据具体需求选择合适的通讯方式，可以提高代码的可维护性和可读性。
