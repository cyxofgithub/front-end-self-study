# Vue Router

> 当前文档基于 **Vue Router 4**（适配 Vue 3），Vue Router 3（Vue 2）的核心概念相同，API 为 `new Router()` / `new VueRouter()`。

## 一、路由懒加载

### 1.1 使用方式

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/home',
            name: 'Home',
            // 👇 动态 import 即懒加载
            component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
        },
        {
            path: '/about',
            name: 'About',
            component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
        },
    ],
});

export default router;
```

`/* webpackChunkName: "home" */` 是 webpack 的魔法注释，给生成的 chunk 命名；在 Vite 中不需要，Vite 会自动以文件名命名 chunk。

### 1.2 懒加载原理

懒加载由两层配合完成：**构建工具的代码分割** + **Vue 的异步组件机制**。

**第一层：构建工具（Webpack / Vite）**

`import()` 是 ES 标准的动态导入语法。构建工具遇到 `import()` 时会将被导入的模块拆成独立的 chunk（而不是打进主 bundle），返回一个 Promise。

```
// 构建产物（简化示意）
dist/
  js/
    index.abc123.js      ← 主 bundle（包含 router、公共代码）
    home.def456.js       ← 独立 chunk（Home.vue 及其依赖）
    about.ghi789.js      ← 独立 chunk（About.vue 及其依赖）
```

路由没有访问时，对应的 chunk 只是服务器上的一个文件，浏览器不会请求它。只有代码执行到 `import()` 时，才会通过 `<script>` 标签或 `fetch` 动态加载这个 chunk。

**第二层：Vue 的异步组件解析**

vue-router 注册路由时，如果 `component` 字段是一个返回 Promise 的函数（即 `() => import(...)`），vue-router 内部会把它交给 Vue 的异步组件机制处理：

```
路由匹配到 /home
  → vue-router 发现 component 是异步函数
  → 调用 component()，即 import('@/views/Home.vue')
  → webpack/Vite 通过 JSONP 或 fetch 请求 home chunk
  → 模块加载完成，Promise resolve，拿到 Home.vue 的组件定义
  → Vue 用该组件渲染 <router-view>
```

**整个链路**：

```
用户访问 /home
  → vue-router URL 匹配
  → 命中 { path: '/home', component: () => import('@/views/Home.vue') }
  → 调用 import() → 网络请求 home.js chunk
  → chunk 下载完成 → Vue 渲染组件 → 页面呈现
```

这也是为什么首屏只加载当前路由对应的代码，其他页面的代码不会出现在首屏网络请求中。


## 二、路由守卫

路由守卫是在路由跳转前后插入的拦截逻辑，用于权限校验、页面埋点、标题设置等场景。vue-router 提供了三种粒度的守卫。

### 2.1 全局守卫

```javascript
import { createRouter } from 'vue-router';

const router = createRouter({ /* ... */ });

// 前置守卫 —— 最常用，权限校验就写在这里
router.beforeEach((to, from, next) => {
    // to: 目标路由
    // from: 来源路由
    // next: 放行函数（Vue Router 4 可选，不调用则默认放行）

    const isLogin = !!localStorage.getItem('token');

    if (to.meta.requiresAuth && !isLogin) {
        next({ name: 'Login' }); // 重定向到登录
    } else {
        next(); // 放行
    }
});

// 解析守卫 —— 在 beforeEach 之后、组件内守卫之前调用
router.beforeResolve((to, from, next) => {
    // 适合在异步组件加载完成后、导航确认前执行逻辑
    next();
});

// 后置守卫 —— 导航已确认，无法阻止跳转，纯副作用
router.afterEach((to, from) => {
    document.title = to.meta.title || '默认标题';
    // 页面埋点也可以放这里
});
```

### 2.2 路由独享守卫

```javascript
const routes = [
    {
        path: '/admin',
        component: () => import('@/views/Admin.vue'),
        beforeEnter: (to, from, next) => {
            // 仅对 /admin 路由生效
            if (!localStorage.getItem('adminToken')) {
                next({ name: 'Forbidden' });
            } else {
                next();
            }
        },
    },
];
```

### 2.3 组件内守卫

```javascript
// 在组件内直接定义
export default {
    // 进入组件前 —— 此时组件还未创建，拿不到 this
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            // vm 就是当前组件实例，通过回调拿到
        });
    },

    // 路由变化但复用同一组件时（如 /user/1 → /user/2）
    beforeRouteUpdate(to, from, next) {
        // 适合在此重新请求数据
        next();
    },

    // 离开组件前 —— 常用于表单未保存提示
    beforeRouteLeave(to, from, next) {
        if (this.hasUnsavedChanges) {
            const answer = confirm('有未保存的修改，确定离开？');
            if (answer) next();
            else next(false);
        } else {
            next();
        }
    },
};
```

### 2.4 完整的导航解析流程

理解守卫的执行顺序对于排查问题很重要：

```
1. 导航触发
2. 在失活的组件里调用 beforeRouteLeave
3. 调用全局 beforeEach
4. 在重用的组件里调用 beforeRouteUpdate（如有）
5. 调用路由配置的 beforeEnter
6. 解析异步路由组件（懒加载的 chunk 在这里下载）
7. 在被激活的组件里调用 beforeRouteEnter
8. 调用全局 beforeResolve
9. 导航被确认（afterEach 在此后触发，但属于无阻塞回调）
10. DOM 更新完毕
11. 调用 beforeRouteEnter 中传给 next 的回调函数（vm 已可用）
```

> 核心记忆：**组件离场 → 全局前置 → 路由独享 → 组件入场 → 全局解析 → 导航确认**

### 2.5 Vue Router 3 和 4 在守卫上的差异

| | Vue Router 3 | Vue Router 4 |
| -- | -- | -- |
| `next` 参数 | 必须调用，否则导航挂起 | 可选，不调用默认放行 |
| `next('/login')` | 重定向 | 同样支持，但推荐 `return '/login'` |
| Composition API | 不支持 | `onBeforeRouteLeave` / `onBeforeRouteUpdate` 在 setup 中使用 |


## 三、嵌套路由的实现逻辑

### 3.1 配置方式

```javascript
const routes = [
    {
        path: '/user/:id',
        component: () => import('@/views/User.vue'),
        children: [
            {
                // 👇 path 不以 / 开头，会拼接父路径 → /user/:id/profile
                path: 'profile',
                component: () => import('@/views/UserProfile.vue'),
            },
            {
                path: 'posts',
                component: () => import('@/views/UserPosts.vue'),
            },
        ],
    },
];
```

```vue
<!-- User.vue —— 父级组件必须有自己的 <router-view> -->
<template>
    <div class="user">
        <h2>User {{ $route.params.id }}</h2>
        <nav>
            <router-link to="profile">资料</router-link>
            <router-link to="posts">帖子</router-link>
        </nav>
        <!-- 👇 子路由的组件渲染在这里 -->
        <router-view />
    </div>
</template>
```

### 3.2 源码级实现逻辑

vue-router 内部不维护一个平铺的路由列表，而是构建一棵**路由记录树（route record tree）**。

**Step 1：构建 matcher**

创建 router 时，`createRouterMatcher` 遍历 `routes` 数组，递归处理 `children`，为每个路由节点生成一个标准化记录（`RouteRecordNormalized`），并建立父子关联：

```javascript
// vue-router 内部简化逻辑
function normalizeRouteRecord(route, parentPath = '') {
    // 拼接完整路径
    route.path = parentPath + '/' + route.path;

    const record = {
        path: route.path,
        component: route.component,     // () => import(...) 或同步组件
        children: [],
        parent: parentRecord,            // 指向父级 record
    };

    // 递归处理 children
    if (route.children) {
        route.children.forEach((child) => {
            record.children.push(
                normalizeRouteRecord(child, route.path),
            );
        });
    }

    return record;
}
```

处理完成后形成的数据结构：

```
/user/:id  (record)
  ├── children[0]: /user/:id/profile (record, parent → /user/:id)
  └── children[1]: /user/:id/posts   (record, parent → /user/:id)
```

**Step 2：URL 匹配**

当 URL 变为 `/user/42/profile` 时，matcher 会逐层匹配：

```
1. 从根路由表找到 path 为 /user/:id 的 record → 匹配 + 参数 { id: '42' }
2. 进入该 record 的 children，找到 path 为 /user/:id/profile 的 record → 匹配
3. 最终 matched = [UserRecord, UserProfileRecord]
```

`matched` 数组就是当前 URL 对应的一条"记录链"，从父到子。

**Step 3：router-view 渲染**

每个 `<router-view>` 根据**嵌套深度**来消费 `matched` 数组：

```javascript
// router-view 内部简化逻辑
const RouterView = {
    setup() {
        // 当前 router-view 的深度，根级是 0
        const depth = inject('routerViewDepth', 0);

        // matched[depth] 即当前深度对应的路由记录
        const matchedRouteRef = computed(() => {
            const currentRoute = router.currentRoute.value;
            return currentRoute.matched[depth];
        });

        // 向下 provide 深度 + 1，嵌套的子 <router-view> 会收到 depth + 1
        provide('routerViewDepth', depth + 1);

        return () => {
            const record = matchedRouteRef.value;
            if (!record) return null;
            // 渲染 record.components.default
            return h(record.components.default);
        };
    },
};
```

**完整渲染链路（以 `/user/42/profile` 为例）：**

```
App.vue 的 <router-view>
  → depth = 0 → matched[0] = UserRecord → 渲染 User.vue

User.vue 内部的 <router-view>
  → depth = 1 → matched[1] = UserProfileRecord → 渲染 UserProfile.vue
```

这就是为什么：
1. 访问 `/user/42` 时只渲染 `User.vue`，子路由不匹配则子 `<router-view>` 为空
2. 访问 `/user/42/profile` 时，`User.vue` 和 `UserProfile.vue` 同时渲染，各自在不同的 `<router-view>` 中
3. 同一组件实例在路由参数变化时默认复用（`/user/1` → `/user/2` 不会销毁重建 `User.vue`）


## 四、总结

| 特性 | 机制 |
| -- | -- |
| 懒加载 | 构建工具 `import()` 代码分割 + Vue 异步组件解析 |
| 路由守卫 | 完整守卫链：离场 → 全局前置 → 路由独享 → 入场 → 全局解析 → 确认 |
| 嵌套路由 | 路由记录树 + `matched` 数组 + `<router-view>` 深度层级匹配 |
