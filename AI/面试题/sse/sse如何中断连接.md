## sse中断连接

1. 标准的 eventSource: SSE 的核心是EventSource对象，它内置了close()方法，这是关闭 SSE 连接的标准方式。
2. fetch 自定义：利用 abortController 提供中断信号，跟连接绑定 [参考](./sse自定义.md)
3. XHR 实现：核心是调用xhr.abort()终止请求

**如何确保中断通知到服务端？**

1. 服务端通过监听 TCP 连接的 close/error/timeout 事件区分 ——close（req.aborted=true/DisconnectEvent）为主动关闭，error/timeout 为网络异常；

2. 双保险方案：前端主动关闭时先发送应用层通知，服务端结合「事件 + 标记」双重判断，避免边缘场景误判；

**如何理解边缘场景误判**

真实场景

1. 客户端 A 主动关闭 SSE 连接（发 FIN 包给代理）→ 代理不会立即给服务端发 FIN 包（因为还要给客户端 B 复用），而是缓存这个关闭信号，以复用 TCP

2. 客户端网络正常，SSE 连接静默超过代理服务器超时阈值 → 代理会主动向服务端发送FIN包，然后断开和客户端的连接，这并非客户端的主动断开


