## hashRouter 和 historyRouter 的区别与原理

在 Vue Router 中，`hashRouter` 和 `historyRouter` 是两种不同的路由模式，它们在 URL 表现形式和实现原理上有所不同。以下是它们的区别和原理详解：

### 1. `hashRouter` 模式

#### 区别

-   **URL 表现形式：** 使用 `#` 符号来分隔路由路径。例如，`http://example.com/#/home`。
-   **浏览器支持：** 兼容性好，支持所有现代浏览器和一些老旧浏览器。
-   **服务器配置：** 不需要特殊的服务器配置，因为 `#` 后面的部分不会被发送到服务器。

#### 原理

`hashRouter` 模式利用了浏览器的 `hash`（即 URL 中的 `#` 及其后面的部分）来实现前端路由。浏览器的 `hash` 变化不会导致页面重新加载，因此可以用来实现单页面应用（SPA）的路由功能。

-   **监听 `hashchange` 事件：** 当 URL 的 `hash` 部分发生变化时，浏览器会触发 `hashchange` 事件。Vue Router 通过监听这个事件来更新视图。
-   **初始加载：** 在页面加载时，Vue Router 会读取当前 URL 的 `hash` 部分，并根据其值来渲染对应的组件。

#### 示例代码

```javascript
import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';

Vue.use(Router);

const router = new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
        },
        {
            path: '/about',
            name: 'About',
            component: About,
        },
    ],
});

export default router;
```

### 2. `historyRouter` 模式

#### 区别

-   **URL 表现形式：** 使用正常的 URL 路径。例如，`http://example.com/home`。
-   **浏览器支持：** 需要现代浏览器支持 HTML5 History API（如 `pushState` 和 `replaceState`）。
-   **服务器配置：** 需要服务器配置支持，将所有路由请求重定向到单一的入口文件（如 `index.html`），以避免 404 错误。

#### 原理

`historyRouter` 模式利用了 HTML5 History API 来实现前端路由。通过 `pushState` 和 `replaceState` 方法，可以改变浏览器的 URL 而不重新加载页面。

-   **监听 `popstate` 事件：** 当用户点击浏览器的前进或后退按钮时，浏览器会触发 `popstate` 事件。Vue Router 通过监听这个事件来更新视图。
-   **初始加载：** 在页面加载时，Vue Router 会读取当前 URL 的路径，并根据其值来渲染对应的组件。

#### 服务器配置

为了支持 `historyRouter` 模式，需要在服务器上进行配置，将所有路由请求重定向到单一的入口文件。例如，在使用 Nginx 时，可以添加以下配置：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### 示例代码

```javascript
import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
        },
        {
            path: '/about',
            name: 'About',
            component: About,
        },
    ],
});

export default router;
```

### 总结

当然，以下是 `hashRouter` 和 `historyRouter` 的简短总结，并说明它们调用的 API 方法：

#### `hashRouter` 模式

##### 原理

-   **URL 结构：** 使用 `#` 符号来分隔路由路径，例如 `http://example.com/#/home`。
-   **API 方法：** 依赖浏览器的 `hash` 部分和 `hashchange` 事件。
-   **工作机制：**
    1. **初始加载：** 读取 URL 的 `hash` 部分并渲染对应的组件。
    2. **路由切换：** 更新 URL 的 `hash` 部分。
    3. **事件监听：** 通过监听 `hashchange` 事件来检测路由变化并更新视图。

##### 示例代码

```javascript
window.location.hash = '#/home'; // 更新 URL 的 hash 部分
window.addEventListener('hashchange', () => {
    console.log('Hash changed:', window.location.hash);
});
```

#### `historyRouter` 模式

##### 原理

-   **URL 结构：** 使用正常的 URL 路径，例如 `http://example.com/home`。
-   **API 方法：** 依赖 HTML5 History API 的 `pushState`、`replaceState` 方法和 `popstate` 事件。
-   **工作机制：**
    1. **初始加载：** 读取 URL 的路径并渲染对应的组件。
    2. **路由切换：** 使用 `pushState` 或 `replaceState` 方法更新 URL。
    3. **事件监听：** 通过监听 `popstate` 事件来检测路由变化并更新视图。

##### 示例代码

```javascript
window.history.pushState({}, '', '/home'); // 更新 URL 的路径
window.addEventListener('popstate', event => {
    console.log('Location:', document.location, 'State:', event.state);
});
```
