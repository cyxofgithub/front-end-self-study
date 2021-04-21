# Node中的模块系统

## 使用Node编写应用程序主要就是在使用：

- ### EcmaScript语言

  - 和浏览器一样，在Node中没有Bom和Dom

- ### 模块（在Node中，模块有三种）

  - ##### 1.node自带具名的核心模块：

  - 对文件进行操作的fs模块

  - 对http服务操作的http模块

  - url路径操作模块

  - path路径处理模块

  - os操作系统信息等等

  - 引用具名模块举例：

  - var fs = require ( 'fs' )

  - ##### require是一个方法它有两个作用

    - 1.加载文件模块并执行里面的代码（上面就是起此作用）
    - 2.拿到被加载文件模块导出的接口对象export

  - ##### 2.通过第三方获取模块：

  - art-template

  - 必须通过npm来下载才可以使用

  - ##### 3.自己写的模块：

  - 自己创建的文件

  - 引用方法

    - require( '文件路径' )

## 什么是模块化（Common.js模块系统规范）

- 文件作用域(模块是独立的，在不同的文件使用必须要重新引用)【在node中没有全局作用域，它是文件模块作用域】

  - 比如在文件A和B中定义同名变量和方法是互不影响的，不会层叠覆盖的！ 

- **模块间的通信规则**

  - 加载require

  - ```
    var aExports = require( 'b.js' )
    console.log( aExports.add( 1, 2 ))
    // 结果为3
    ```

  - 导出exports

  - 该文件相对路径为：b.js
  
  - ```
    exports.add = function(x,y) {
    	return x + y
  }
    ```
  
    - 在每个文件模块中都提供了一个对象：export
    - export默认是一个空对象
    - 你要做的就是把需要被外部访问的成员变量获方法挂在到对象export中

