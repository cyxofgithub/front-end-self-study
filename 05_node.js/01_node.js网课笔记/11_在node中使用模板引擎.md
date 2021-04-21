### 在node中使用模板引擎

- art-template不仅可以在浏览器使用，也可以在node中使用

#### 安装：

- npm install art-template
- 该命令在哪执行就会把包下载到哪里。默认会下载到node_modules目录中
- node_modules不要改，也不支持改

#### 在浏览器中使用模板引擎：

```
// 注意：在浏览器中需要应用lib/template-web.js文件
// 强调：模板引擎不关心你的字符串内容，只关心自己能认识的模板标记语法，例如 {{}}	{{}} 语法被称之为 mustache 语法，八字胡啊。
<script src="node_modules/art-template/lib/template-web.js"></script>
  <script type="text/template" id="tpl">
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Document</title>
    </head>
    <body>
      <p>大家好，我叫：{{ name }}</p>
      <p>我今年 {{ age }} 岁了</p>
      <h1>我来自 {{ province }}</h1>
      <p>我喜欢：{{each hobbies}} {{ $value }} {{/each}}</p>
    </body>
    </html>
  </script>
  <script>
    var ret = template('tpl', {
      name: 'Jack',
      age: 18,
      province: '北京市',
      hobbies: [
        '写代码',
        '唱歌',
        '打游戏'
      ]
    })

    console.log(ret)
  </script>
```

#### 在node中使用art-template模板引擎

// 模板引擎最早就是诞生于服务器领域，后来才发展到了前端。

// 1. 安装 npm install art-template

// 2. 在需要使用的文件模块中加载 art-template

//  只需要使用 require 方法加载就可以了：require('art-template')

//  参数中的 art-template 就是你下载的包的名字

//  也就是说你 isntall 的名字是什么，则你 require 中的就是什么

// 3. 查文档，使用模板引擎的 API

```
var template = require('art-template')

var fs = require('fs')
fs.readFile('./tpl.html', function (err, data) {
	if (err) {
	  return console.log('读取文件失败了')
	}
	// 默认读取到的 data 是二进制数据
	// 而模板引擎的 render 方法需要接收的是字符串
	// 所以我们在这里需要把 data 二进制数据转为字符串才可以给模板引使用
	var ret = template.render(data.toString(), {
	  name: 'Jack',
	  age: 18,
	  province: '北京市',
	  hobbies: [
	    '写代码',
	    '唱歌',
	    '打游戏'
	  ],
	  title: '个人信息'
	})
  	console.log(ret)
})
```

