## react-router 原理

### 基于 hash 的路由：通过监听 hashchange 事件，感知 hash 的变化

改变 hash 可以直接通过 location.hash=xxx

```javascript
// hash
window.addEventListener("hashchange", function(e) {
    /* 监听改变 */
});
```

### 基于 HTML 5 history 路由：

改变 url 可以通过 history.pushState 和 resplaceState 等，会将 URL 压入堆栈，同时能够应用 history.go() 等 API
监听 url 的变化可以通过自定义事件触发实现

```javascript
// history
window.addEventListener("popstate", function(e) {
    /* 监听改变 */
});

// 注意⚠️的是：用 history.pushState() 或者 history.replaceState() 不会触发 popstate 事件。 popstate 事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮或者调用 history.back()、history.forward()、history.go()方法。
```
