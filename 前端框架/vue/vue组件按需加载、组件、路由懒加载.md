# 极简总结+最简示例

## 1. 路由懒加载（切换页面才加载）

作用：拆分页面代码，首屏只加载首页

```js
// router.js
const routes = [
    {
        path: '/mine',
        // 懒加载写法
        component: () => import('@/views/Mine.vue'),
    },
];
```

解决：多页面项目首屏js包太大、白屏久。

## 2. 组件懒加载（页面内组件满足条件才加载）

Vue3示例：弹窗/图表等不用立刻展示的组件

```vue
<script setup>
import { defineAsyncComponent } from 'vue';
const HeavyChart = defineAsyncComponent(() => import('@/components/Chart.vue'));
const show = ref(false);
</script>
<template>
    <button @click="show = true">打开图表</button>
    <HeavyChart v-if="show" />
</template>
```

解决：页面重型组件阻塞初次渲染。

## 3. 第三方库按需加载（只引入用到的代码）

### UI库按需

```js
// 只引入Button，不引入整个ElementPlus
import { ElButton } from 'element-plus';
```

### 工具库按需

```js
// 只引入防抖方法，不引入全部lodash
import debounce from 'lodash/debounce';
```

解决：完整引入大型库产生大量冗余代码，包体积暴涨。

## 三者共同解决问题

1. 代码分割，减小首屏JS体积；
2. 减少JS下载、解析耗时，加快页面可交互；
3. 用户只加载当前需要资源，省流量；
4. 优化首屏白屏、LCP性能指标。
