## web服务器

### ip地址和端口号的概念

- ip地址用来定位计算机
- 端口号用来定位具体的应用程序
- 所有需要互联网通信的应用程序都会占用一个端口号
- 端口号范围：0-65536之间
- 在计算机中有一些默认端口号，最好不要去使用
  - 例如http服务的80
- 我们在开发过程中使用一些简单好记的就可以了，例如3000，5000没什么含义
- 可以同时开启多个服务，但一定要确保不同服务占用端口号不一致才可以
- 简单滴说就是在一天计算机中，同一个端口号同一时间只能被一个程序占用

### 响应内容形式Content-type

```
// require
// 端口号

var http = require('http')

var server = http.createServer()

server.on('request', function (req, res) {
  // 在服务端默认发送的数据，其实是 utf8 编码的内容
  // 但是浏览器不知道你是 utf8 编码的内容
  // 浏览器在不知道服务器响应内容的编码的情况下会按照当前操作系统的默认编码去解析
  // 中文操作系统默认是 gbk
  // 解决方法就是正确的告诉浏览器我给你发送的内容是什么编码的
  // 在 http 协议中，Content-Type 就是用来告知对方我给你发送的数据内容是什么类型
  var url = req.url

  if (url === '/plain') {
    // text/plain 就是普通文本
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('hello 世界')
  } else if (url === '/html') {
    // 如果你发送的是 html 格式的字符串，则也要告诉浏览器我给你发送是 text/html 格式的内容
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('<p>hello html <a href="">点我</a></p>')
  }
})

server.listen(3000, function () {
  console.log('Server is running...')
})

```

