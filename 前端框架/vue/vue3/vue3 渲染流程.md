## vue3 渲染流程

入口执行：

```javascript
createApp(App).mount(document.querySelector("#app") as Element);
```

mount 底层调用：

setupComponnet -> 创建组件实例
setRenderEffect -> 将组件 render 包在 effect 并主动执行一次 update 完成依赖收集
