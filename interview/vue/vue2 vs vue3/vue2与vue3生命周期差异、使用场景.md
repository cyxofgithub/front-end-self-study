## vue2与vue3生命周期差异、使用场景

| Vue2 选项式 API      | Vue3 选项式 API   | Vue3 组合式 API（setup 中） | 核心阶段          | 主要使用场景                                                                                   |
|----------------------|-------------------|----------------------------|-------------------|---------------------------------------------------------------------------------------------|
| beforeCreate         | beforeCreate      | 无（setup 替代）           | 实例创建前        | 几乎无实用场景；极少用于全局配置前置如原型扩展                                                    |
| created              | created           | 无（setup 替代）           | 实例创建完成      | 非 DOM 相关初始化：如数据赋值、发起异步请求、全局事件绑定、初始化与 DOM 无关的逻辑               |
| beforeMount          | beforeMount       | onBeforeMount              | DOM 挂载前        | 一般很少用；极个别场景下需提前获取虚拟 DOM                                                      |
| mounted              | mounted           | onMounted                  | DOM 挂载完成      | DOM 操作入口：如三方库初始化、获取 DOM 尺寸/位置信息、根据异步请求渲染 DOM                        |
| beforeUpdate         | beforeUpdate      | onBeforeUpdate             | DOM 更新前        | 获取更新前 DOM 状态（如记录滚动、尺寸）；作                                 |
| updated              | updated           | onUpdated                  | DOM 更新完成      | 数据更新后操作 DOM（如刷新插件内容）。⚠️禁止此处再 set data 防止死循环                             |
| beforeDestroy        | beforeUnmount     | onBeforeUnmount            | 实例卸载前        | 副作用清理：如清除定时器/事件监听、销毁三方库、终止未完成异步请求                                 |
| destroyed            | unmounted         | onUnmounted                | 实例卸载完成      | 通常只用于确认卸载完毕（如日志打点），几乎无主流实用场景                                            |
| activated            | activated         | onActivated                | 缓存组件激活      |  <keep-alive> 标签 专用恢复缓存组件状态：如定时器重启、恢复滚动/视频、重新拉取数据                                        |
| deactivated          | deactivated       | onDeactivated              | 缓存组件失活      |  <keep-alive> 标签专用暂停缓存组件状态：如定时器暂停、暂停视频播放、清除临时数据、终止未完成异步                          |