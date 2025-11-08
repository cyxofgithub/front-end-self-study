## vue2

```javascript
<template>
  <div ref="myElement">Hello Vue!</div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$refs.myElement); // 获取元素节点
  }
};
</script>

```

## vue3

```javascript
<template>
  <div ref="myElement">Hello Vue!</div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const myElement = ref(null);

    onMounted(() => {
      console.log(myElement.value); // 获取元素节点
    });

    return {
      myElement
    };
  }
};
</script>

```

## 获取多个元素节点

使用 js 选择器
