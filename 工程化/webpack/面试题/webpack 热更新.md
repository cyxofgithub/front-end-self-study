## 是什么

HMR 全称 Hot Module Replacement，可以理解为模块热替换，指在应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个应用

在 webpack 中配置开启热模块也非常的简单，如下代码：

## 工作原理

下面是 HMR 的基本工作原理：

1、Webpack DevServer 通过 WebSocket 与浏览器建立持久连接，以实现服务器向浏览器发送更新通知的能力。

2、当代码发生变化时，Webpack 并重新编译相关模块，通过 WebSocket 通知浏览器。

3、浏览器接收到热模块替换事件后 HMR 机制会更新模块，并通知引用当前修改模块的模块更新（这些模块有个 module.hot.accpet 的监听事件）

4、如果模块无法成功替换，浏览器会进行完整的页面刷新，以确保应用的正确性。

需要注意的是，HMR 的实现依赖于开发者编写的模块代码是否支持热更新。开发者需要通过在模块代码中添加特定的接口调用，以告知 HMR 运行时如何处理模块的更新。

下面是一个简单的示例，演示了如何使用 HMR 更新一个简单的 JavaScript 模块：

```javascript
// index.js - 入口模块

import { sayHello } from "./module";

// 监听模块热替换事件
if (module.hot) {
    module.hot.accept("./module", () => {
        console.log("模块发生变化，正在更新...");
        sayHello(); // 这个 sayHello 如果改成 react 的 render 就是重新 render 组件状态了
    });
}

sayHello();

// module.js - 模块

export function sayHello() {
    console.log("Hello, World!");
}
```

我们实际开发中无需自己添加这些监听主要是现在有很多成熟的插件，如 react-refresh
