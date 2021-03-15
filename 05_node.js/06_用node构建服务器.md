## 用node构建服务器

服务器：

```
// 1.加载http核心模块
var http = require('http');

// 2.使用http.createServer()创建一个web服务器
var server = http.createServer();

// 3.服务器要做的事儿
// 提供服务：对数据服务
// 发请求
//	接收请求
//	处理请求
//	反馈（发送响应）
//	当客户端请求过来，就会自动触发服务器的request请求事件，然后执行第二个参数：回调处理函数
server.on('request',function(){
    console.log('收到客户的请求了')
})

// 4.绑定端口号，启动服务 
// http://localhost:3000/
server.listen(3000,function(){
    console.log('runing...')
})
```