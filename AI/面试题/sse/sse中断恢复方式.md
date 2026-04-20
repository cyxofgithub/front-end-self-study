## sse中断恢复方式

前端：标准规范是通过 lastEventId 处理，给每个数据块带一个 eventId，重连时携带最后一个块的 eventId 作为 lastEventId
后端：redis 缓存每一个块，恢复时从 lastEventId 的块开始传输，每个块可以有 eventId、index 的标识，存 redis 的key 用 sessionid-eventId 的方式