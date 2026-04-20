## 是什么

webpack proxy，即 webpack 提供的代理服务

基本行为就是接收客户端发送的请求后转发给其他服务器

其目的是为了便于开发者在开发模式下解决跨域问题（浏览器安全策略限制）

## 如何使用

在 webpack 配置对象属性中通过 devServer 属性提供，如下：

```javascript
// ./webpack.config.js
const path = require("path");

module.exports = {
    // ...
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        proxy: {
            "/api": {
                target: "https://api.github.com",
            },
        },
        // ...
    },
};
```

-   target：表示的是代理到的目标地址
-   pathRewrite：默认情况下，我们的 /api-hy 也会被写入到 URL 中，如果希望删除，可以使用 pathRewrite
-   secure：默认情况下不接收转发到 https 的服务器上，如果希望支持，可以设置为 false
-   changeOrigin：它表示是否更新代理后请求的 headers 中 host 地址

## 工作原理

webpack 的 dev-server 本质是个 node express 服务，proxy 工作原理实质上是在这个服务上加入了 http-proxy-middleware 这个 http 代理中间件，实现请求转发给其他服务器,大致实现如下：

```javascript
const express = require("express");
const proxy = require("http-proxy-middleware");

const app = express();

app.use(
    "/api",
    proxy({ target: "http://www.example.org", changeOrigin: true })
);
app.listen(3000);
```

## 为什么能解决跨域

-   客户端请求请求的是同源的本地服务，不会有跨域问题
-   而本地服务向后台服务发送请求没有浏览器限制不会有跨域问题
