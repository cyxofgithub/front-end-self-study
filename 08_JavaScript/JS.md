# 关于函数

## 1.定义函数的方式

- 有两种方法：一种是函数声明，另一种就是函数表达式(也是匿名函数的创建方法）9

  - 使用函数声明：

  - ```
    function funciontName(arg0,arg1,arg2) {
    	// 函数体  
    }
    ```

  - ##### 关于函数声明有一个重要的特征就是函数声明提升，意思就是在执行代码之前会先读取函数声明。它就意味着可以把函数声明放在调用它的语句后面。

  - ```
    sayHi();
    function sayHi(){
    	alert("Hi!");
    }
    ```

  - 这个例子不会抛出错误，因为在代码执行之前会先读取函数声明

  - 使用函数表达式

  - ```
    var functionNmae = function(arg0,arg1,arg2) {
    	// 函数体  
    }
    ```

  - ##### 创建一个函数并将它赋值给变量，这种情况下创建的函数叫匿名函数(匿名函数有时候也叫拉姆达函数）

  - ###### 函数表达式与其他表达式一样，在使用前必须先赋值。以下代码会导致错误：

  - ```
    sayHi();	// 错误：函数还不存在
    var sayHi = function() {
    	alert("Hi!");
    }
    ```

    

## 2.闭包

- 闭包是指有权访问另一个函数作用域中的变量的函数

## 3.私有变量

### 	概念

- 任何在函数中定义的变量都可以认为是私有变量，因为不能在函数外部访问这些变量，私有变量包括函数参数、局部变量和在函数内部定义的其他函数，来看下面的例子

- ```
  function add(num1,num2) {
  	var sum = num1 + num2;
  	return sum;
  }
  ```

  - 在着函数内部，有3个私有变量：num1，num2和sum。
  - 在函数内部可以访问这几个变量，但在函数外部则不能访问他们。
  - 如果在这个函数内部创建一个闭包，那么闭包通过自己的作用域链也可以访问这些变量。
  - 而利用这一点，就可以创建用于访问私有变量的公有方法。



# BOM

- ES是js的核心，但如果要在web中使用js，那么BOM（浏览器对象模型）无疑才是真正的核心。
- BOM提供了很多对象，用于访问浏览器的功能，这些功能与任何网页内容无关。
- w3c为了把浏览器中js最基本的部分标准化，已经将BOM的主要方面纳入了HTML5的规范中。
- BOM与[DOM](https://zh.wikipedia.org/wiki/文档对象模型)不同，其既没有标准的实现，也没有严格的定义, 所以浏览器厂商可以自由地实现BOM。
- **简单地说就是浏览器对象的集合**

### window对象

- BOM的核心对象是window，它表示浏览器的一个实例。

- 在浏览器中，window对象有双重角色，它既是通过JavaScript访问浏览器窗口的一个接口，又是ECMAScript规定的Global对象。

- 这意味着在网页中定义的任何一个对象、变量和函数，都以window作为其Global对象，因此有权访问parseInt()等方法。

- ```
  var age = 29；
  function sayAge(){
  	alert(this.age);
  // 由于sayAge()存在全局作用域中，因此this.age被映射到windOW.age，最终显示的人人是正确的结果。
  }
  alert(window.age);	// 29
  sayAge();			// 29
  window.sayAge();	// 29
  // 我们在全局作用域中定义了一个变量age和一个函数 sayAge(),它们被自动归在了window对象名下。
  ```

#### 间歇调用和超时调用

- JavaScript 是单线程语言，但它允许通过设置超时值和间歇时间来调度代码在特定的时刻执行。

- ###### 超时调用需要使用window对象的setTimeout()方法

- 使用方式有两种

- ```
  // 不建议传递字符串，可能导致性能损失
  setTimeout("alert('Hello world!')", 1000);
  
  // 推荐使用方式
  setTimeout(function() {
  	alert("Hello world!")
  },1000);
  ```

- ###### 取消调用

- 该方法会返回一个数值ID，表示超时调用。这个超时调用ID是计划执行代码的唯一标识符，可以通过它来取消超时调用。

  - 要取消尚未执行的超时调用计划，可以调用clearTimeout()方法，并将相应的超时调用ID作为参数传递给它，如下所示。

  - ```
    // 设置超时调用
    var timeoutId = setTimeout(function() {
    	alert("Hello world!")
    },1000);
    
    // 取消它
    claerTimeout(timeoutId);
    ```

- 间歇调用方法与超时调用类似

  - ```
    // 设置间歇调用
    var timeoutId = setInterval(function() {
    	alert("Hello world!")
    },1000);
    
    // 取消它
    claerInterval(intervalId);
    ```

- 实际上在使用超时调用时，没有必要跟踪超时调用ID，因为每次执行代码之后，如果不再设置另一次超时调用，调用就会自动停止。

- ###### 在开发环节下，很多使用真正的间歇调用，原因是后一个间歇调用可能会在前一个间歇调用结束之前启动。0



### location对象

- location是最有用的BOM对象之一，提供了当前窗口中加载文档的信息，以及通常的导航功能。
- 这个对象独特的地方在于，它既是window的属性，也是document的属性。
- 也就是说window.location和document.location指向同一个对象

#### 关于location对象属性

- ![image-20201120202602196](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20201120202602196.png)

#### 查询字符串

- location的多数信息都可以通过上面的属性获取。但是URL中的查询字符串并不容易使用。

- 虽然location.search返回了从问好直到URL末尾的所有内容，但是没有办法逐个访问每个查询参数。

- 下面函数解析了查询字符串，并返回一个以每个查询参数为属性的对象

- ```
  let getQueryStringArgs = function() {
  	// 取得没有开头问号的查询字符串
  	let qs = ( location.search.length > 0 ? location.search.substring(1) : " "),
  	// 保存数据对象
  	args = {};
  	
  	// 把每个参数添加到args对象
  	for ( let item of qs.split("&").map( kv => kv.split("=") ) {
  		let name = decodeURIComponent( item[0] ),
  			value = decodeURIComponent( item[1] );
  		if (name.length) {
  			args[name] = value;
  		}
  	}
  	return agrs;
  }
  //	先把字符串按照&分割成数组，每个元素的形式为 name = value。
  //	for循环迭代着数组，将每一个元素按照 = 分割成数组，着数组第一项是参数名，第二项是参数值
  //	参数名和参数值使用 decodeURIComponent()解码后(这是因为查询字符串常是被编码后的格式)分别保存在
  name和value变量中。
  //	最后，name作为属性而value作为该属性的值被添加到args对象。
  ```

##### URLSearchParams

- URLSearchParams 提供了一组标准API方法，通过它们可以检查和修改查询字符串。

- ###### 给URLSearchParams 构造函数传入一个查询字符串，就可以创建一个实例

- 这个实例上暴露了get() set() 和 delete() 等方法，可以对查询字符串执行相应操作。下面看一个例子：

  ```
  let qs = "?q=javascript&num=10";
  
  let searchParams = new URLSearchParams(qs);	// 创建实例
  
  alert (searchParams.toString());	// "q=javascript$num=10" 
  searchParams.has("num");	// true( 调用has方法 )
  searchParams.get("num");	// 10( 调用get方法 )
  
  searchParams.set("page", "3");	// (调用set方法)
  alert(searchParams.toString());	// " q=javascript&num=10&page=3"
  
  大多数支持URLSearchParams的浏览器也支持将 URLSearchParams 的实例用作可迭代对象;
  let qs = ”?q=javascript&num=10“；
  
  let searchParams = new URLSearchParams(qs);
  
  for( let param of searchParams ) {
  	console.log(param);
  }
  //	["q", "javascript"]
  //	["num", "10"]
  ```

#### 操作地址

- 可以通过修改location对象修改浏览器的地址。首先，最常见的是使用assign()方法并传入一个URL，如下所示：

- ###### location.assign("http: // www.wrox.com") ;

- 这行代码会立即启动导航到新 URL 的操作，同时在浏览器历史记录中添加一条记录。

- 如果给loacation.href 或 window.location 设置一个 URL，也会以同一个URL值调用assign()方法.

  - 如：
  - window.location =  "http: // www.wrox.com";
  - location.href = "http: // www.wrox.com";

- 在这3种修改浏览器地址的方法中，设置 location.href 是最常见的。

- ###### 修改 location 对象的属性也会修改当前加载的页面。其中，hash、search、hostname、pathname 和 port 属性被设置为新值之后都会修改当前URL，如下面的例子所示：

- ![image-20201120205508301](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20201120205508301.png)

- ###### 除了hash之外，只要修改 location 的一个属性，就会导致页面重新加载新 URL。

##### replace()方法

- 这个方法接收一个 URL 参数，但重新加载后不会增加历史记录。调用 replace()之后，用户不能回到前一页。
- 简单的说就是”后退“按钮是禁用状态，既不能返回前一个页面，除非手动输入完整的URL

##### reload()方法

- 它能重新加载当前显示的页面。调用 reload() 而不传参数，页面会以最有效的方式重新加载。
- 也就是说，如果页面自上次请求以来没有修改过，浏览器可能会从缓存中加载页面。
- 如果想强制从服务器重新加载，可以像下面这样给reload()传个true；
  - location.reload(); // 重新加载，可能是从缓存加载
  - location.reload(true); // 重新加载，从服务器加载
- 脚本中位于reload()调用之后的代码可能执行也可能不执行，这取决于网络延迟和系统资源等因素，
- 为此，最好把reload()作为最后一行代码。

### navigator对象

- 通常用于确定浏览器类型
- ![微信图片_20201125213715](C:\Users\hp\Desktop\微信图片_20201125213715.jpg)
- ![微信图片_20201125213722](C:\Users\hp\Desktop\微信图片_20201125213722.jpg)

#### 检测插件

#### 注册程序

### screen对象

- 这个对象中保存的纯粹是客户端能力信息，也就是浏览器窗口外面的客户端显示器信息
- ![image-20201125214112640](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20201125214112640.png)

### history对象

- history对象表示当前窗口首次使用以来用户的导航历史记录

#### 导航

#### 历史状态管理

### 小结

![image-20201125214610162](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20201125214610162.png)

# js一些方法

### indexOf

- ###### 定义和用法

  indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。

- ###### 语法

  ```
  stringObject.indexOf(searchvalue,fromindex)
  ```

- | 参数        | 描述                                                         |
  | :---------- | :----------------------------------------------------------- |
  | searchvalue | 必需。规定需检索的字符串值。                                 |
  | fromindex   | 可选的整数参数。规定在字符串中开始检索的位置。它的合法取值是 0 到 stringObject.length - 1。如省略该参数，则将从字符串的首字符开始检索。 |

- 该方法将从头到尾地检索字符串 stringObject，看它是否含有子串 searchvalue。开始检索的位置在字符串的 fromindex 处或字符串的开头（没有指定 fromindex 时）。如果找到一个 searchvalue，则返回 searchvalue 的第一次出现的位置。stringObject 中的字符位置是从 0 开始的。

- 举例：

- ```
  var a = 'abc'
  var b = a.indexOf('abc')
  // b = 0
  ```




# 正则表达式

```
5.正则表达式
	- 正则用来定义一些字符串的规则，程序可以根据这些规则来判断一个字符串是否符合规则，
		也可以将一个字符串中符合规则的内容提取出来。
	- 创建正则表达式
		- var reg = new RegExp("正则","匹配模式");
		- var reg = /正则表达式/匹配模式
		
	- 语法：
		匹配模式：
			i:忽略大小写
			g:全局匹配模式
			- 设置匹配模式时，可以都不设置，也可以设置1个，也可以全设置，设置时没有顺序要求
			
		正则语法		
			| 或 
			[] 或 // 可表示多个字符的或关系 [a,b,c] = a|b|c
			[^ ] 除了
			[a-z] 小写字母
			[A-Z] 大写字母
			[A-z] 任意字母
			[0-9] 任意数字
			
	- 方法：
		test()
			- 可以用来检查一个字符串是否符合正则表达式
			- 如果符合返回true，否则返回false
```

```
正则表达式
	- 语法：
		- 量词
			{n} 正好n次
			{m,n} m到n次
			{m,} 至少m次
			+	至少1次 {1,}
			?   0次或1次 {0,1}
			*   0次或多次 {0,}
			
		- 转义字符
			\ 在正则表达式中使用\作为转义字符
			\. 表示.
			\\ 表示\
			. 表示任意字符
			\w
				- 相当于[A-z0-9_]
			\W
				- 相当于[^A-z0-9_]
			\d
				- 任意数字
			\D
				- 除了数字
			\s
				- 空格
			\S
				- 除了空格
			\b
				- 单词边界
			\B
				- 除了单词边界
		^ 表示开始
		$ 表示结束
```

正则表达式
	- 语法：
		- 量词
			{n} 正好n次
			{m,n} m到n次
			{m,} 至少m次
			+	至少1次 {1,}
			?   0次或1次 {0,1}
			*   0次或多次 {0,}
			

		- 转义字符
			\ 在正则表达式中使用\作为转义字符
			\. 表示.
			\\ 表示\
			. 表示任意字符
			\w
				- 相当于[A-z0-9_]
			\W
				- 相当于[^A-z0-9_]
			\d
				- 任意数字
			\D
				- 除了数字
			\s
				- 空格
			\S
				- 除了空格
			\b
				- 单词边界
			\B
				- 除了单词边界
		^ 表示开始
		$ 表示结束
# JS window

## JavaScript Cookies

------

Cookies 用于存储 web 页面的用户信息。

由于 JavaScript 是运行在客户端的脚本，所以可以使用JavaScript来设置运行在客户端的Cookies。

------

### 什么是 Cookies？

Cookies 是一些数据, 存储于你电脑上的文本文件中。

当 web 服务器向浏览器发送 web 页面时，在连接关闭后，服务端不会记录用户的信息。

Cookies 的作用就是用于解决 "如何记录客户端的用户信息":

- 当用户访问 web 页面时，他的名字可以记录在 cookie 中。
- 在用户下一次访问该页面时，可以在 cookie 中读取用户访问记录。

Cookies 以名/值对形式存储，如下所示:   

username=John Doe

当浏览器从服务器上请求 web 页面时， 属于该页面的 cookies 会被添加到该请求中。服务端通过这种方式来获取用户的信息。

------

### Cookie基础知识

- cookie是有大小限制的，每个cookie所存放的数据不能超过4kb，如果cookie字符串的长度超过4kb，则该属性将返回空字符串。
- 由于cookie最终都是以文件形式存放在客户端计算机中，所以查看和修改 cookie 都是很方便的，这就是为什么常说cookie不能存放重要信息的原因。
- `alert(typeof document.cookie)`结果是`String`。
- cookie有域和路径这个概念。**域就是domain的概念**，因为浏览器是个注意安全的环境，所以不同的域之间是不能互相访问 cookie的(当然可以通过特殊设置的达到cookie跨域访问)。**路径就是routing的概念**，一个网页所创建的cookie只能被与这个网页在同一目录或子目录下得所有网页访问，而不能被其他目录下得网页访问。

### Cookie常见问题

- cookie 存在两种类型：
  - 你浏览的当前网站本身设置的cookie。
  - 来自在网页上嵌入广告或图片等其他域来源的第三方cookie(网站可通过使用这些cookie跟踪你的使用信息)。
- 刚刚基础知识里面有说到cookie生命周期的问题，其实cookie大致可分为两种状态：
  - 临时性质的cookie。当前使用的过程中网站会储存一些你的个人信息，当浏览器关闭后这些信息也会从计算机中删除。
  - 设置失效时间的cookie。就算浏览器关闭了，这些信息业依然会在计算机中。如登录名称和密码，这样无须在每次到特定站点时都进行登录。这种cookie可在计算机中保留几天、几个月甚至几年。
- cookie 有两种清除方式：
  - 通过浏览器工具清除cookie(有第三方的工具，浏览器自身也有这种功能)。
  - 通过设置cookie的有效期来清除 cookie。
  - 注：**删除cookie有时可能导致某些网页无法正常运行**
- 浏览器可以通过设置来接受和拒绝访问cookie。
- 出于功能和性能的原因考虑，建议尽量降低cookie的使用数量，并且要尽量使用小cookie。
- 假如是本地磁盘中的页面，chrome的控制台是无法用JavaScript读写操作cookie的，解决办法…换一个浏览器^_^。

### 使用 JavaScript 创建Cookie

JavaScript 可以使用 **document.cookie** 属性来创建 、读取、及删除 cookies。

JavaScript 中，创建 cookie 如下所示：    

```
document.cookie="username=John Doe";
```

您还可以为 cookie 添加一个过期时间（以 UTC 或 GMT 时间）。默认情况下，cookie 在浏览器关闭时删除：    

```
document.cookie="username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 GMT";
```

您可以使用 path 参数告诉浏览器 cookie 的路径。默认情况下，cookie 属于当前页面。    

```
document.cookie="username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 GMT; path=/";
```



------

### 使用 JavaScript 读取 Cookie

在 JavaScript 中, 可以使用以下代码来读取 cookies：    

```
var x = document.cookie;
```



| ![Note](https://7n.w3cschool.cn/statics/images/course/lamp.jpg) | document.cookie 将以字符串的方式返回所有的 cookies，类型格式： cookie1=value; cookie2=value; cookie3=value; |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |



------

### 使用 JavaScript 修改 Cookie

在 JavaScript 中，修改 cookies 类似于创建 cookies，如下所示：   

document.cookie="username=John Smith; expires=Thu, 18 Dec 2013 12:00:00 GMT; path=/";

旧的 cookie 将被覆盖。

------

### 使用 JavaScript 删除 Cookie

删除 cookie 非常简单。您只需要设置 expires 参数为以前的时间即可，如下所示，设置为 Thu, 01 Jan 1970 00:00:00 GMT:    

```
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
```

注意，当您删除时不必指定 cookie 的值。

------

### Cookie 字符串

document.cookie 属性看起来像一个普通的文本字符串，其实它不是。

即使您在 document.cookie 中写入一个完整的 cookie 字符串, 当您重新读取该 cookie 信息时，cookie 信息是以名/值对的形式展示的。

如果您设置了新的 cookie，旧的 cookie 不会被覆盖。 新 cookie 将添加到 document.cookie 中，所以如果您重新读取document.cookie，您将获得如下所示的数据：

cookie1=value; cookie2=value;

如果您需要查找一个指定 cookie 值，您必须创建一个JavaScript 函数在 cookie 字符串中查找 cookie 值。

------

### JavaScript Cookie 实例

在以下实例中，我们将创建 cookie 来存储访问者名称。

首先，访问者访问 web 页面, 他将被要求填写自己的名字。该名字会存储在 cookie 中。

访问者下一次访问页面时，他会看到一个欢迎的消息。

在这个实例中我们会创建 3 个 JavaScript 函数:

1. 设置 cookie 值的函数
2. 获取 cookie 值的函数
3. 检测 cookie 值的函数

------

### 设置 cookie 值的函数

首先，我们创建一个函数用于存储访问者的名字：    

```
function setCookie(cname,cvalue,exdays)     // cookie 名/值/存放天数   
{        
var d = new Date();        
d.setTime(d.getTime()+(exdays*24*60*60*1000));        
var expires = "expires="+d.toGMTString();        
document.cookie = cname + "=" + cvalue + "; " + expires;        
}
```

**函数解析：**

以上的函数参数中，cookie 的名称为 cname，cookie 的值为 cvalue，并设置了 cookie 的过期时间 expires。

该函数设置了 cookie 名、cookie 值、cookie过期时间。

------

### 获取 cookie 值的函数

然后，我们创建一个函数用户返回指定 cookie 的值：    

```
function getCookie(cname)        
{        
var name = cname + "=";        
var ca = document.cookie.split(';');        
for(var i=0; i<ca.length; i++)        
 {        
 var c = ca[i].trim();        
 if (c.indexOf(name)==0) return c.substring(name.length,c.length);        
 }        
return "";        
}
```

**函数解析：**

cookie 名的参数为 cname。

创建一个文本变量用于检索指定 cookie :cname + "="。

使用分号来分割 document.cookie 字符串，并将分割后的字符串数组赋值给 ca (ca = document.cookie.split(';'))。

循环 ca 数组 (i=0;i<ca.length;i++)，然后读取数组中的每个值，并去除前后空格 (c=ca[i].trim())。

如果找到 cookie(c.indexOf(name) == 0)，返回 cookie 的值 (c.substring(name.length,c.length)。

如果没有找到 cookie, 返回 ""。

------

### 检测 cookie 值的函数

最后，我们可以创建一个检测 cookie 是否创建的函数。

如果设置了 cookie，将显示一个问候信息。

如果没有设置 cookie，将会显示一个弹窗用于询问访问者的名字，并调用 setCookie 函数将访问者的名字存储 365 天：    

```
function checkCookie()        
{        
var username=getCookie("username");        
if (username!="")        
 {        
 alert("Welcome again " + username);        
 }        
else        
 {        
 username = prompt("Please enter your name:","");        
 if (username!="" && username!=null)        
  {        
  setCookie("username",username,365);        
  }        
 }        
}
```



------

### 完整实例

### 实例

```
function setCookie(cname,cvalue,exdays)
{
var d = new Date();
d.setTime(d.getTime()+(exdays*24*60*60*1000));
var expires = "expires="+d.toGMTString();
document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname)
{
var name = cname + "=";
var ca = document.cookie.split(';');
for(var i=0; i<ca.length; i++)
 {
 var c = ca[i].trim();
 if (c.indexOf(name)==0) return c.substring(name.length,c.length);
}
return "";
}

function checkCookie()
{
var user=getCookie("username");
if (user!="")
 {
 alert("Welcome again " + user);
 }
else
 {
 user = prompt("Please enter your name:","");
 if (user!="" && user!=null)
  {
  setCookie("username",user,365);
  }
 }
}
```



### Cookie高级篇

#### cookie路径概念

在基础知识中有提到cookie有域和路径的概念，现在来介绍路径在cookie中的作用。

cookie一般都是由于用户访问页面而被创建的，可是并不是只有在创建cookie的页面才可以访问这个cookie。

默认情况下，只有与创建cookie的页面在同一个目录或子目录下的网页才可以访问，这个是因为安全方面的考虑，造成不是所有页面都可以随意访问其他页面创建的cookie。举个例子，

> 在”http://www.cnblogs.com/Darren_code/"这个页面创建一个cookie，那么在"/Darren_code/"这个路径下的页面如："http://www.cnblogs.com/Darren_code/archive/2011/11/07/Cookie.html"这个页面默认就能取到cookie信息。

可在默认情况下，”[http://www.cnblogs.com"或者"http://www.cnblogs.com/xxxx/"就不可以访问这个cookie（光看没用，实践出真理^_^）。](http://www.cnblogs.xn--com""http-8r9zf893a//www.cnblogs.com/xxxx/"就不可以访问这个cookie（光看没用，实践出真理^_^）。)

那么如何让这个cookie能被其他目录或者父级的目录访问类，通过设置cookie的路径就可以实现。例子如下，

```
document.cookie = "name=value;path=path";
document.cookie = "name=value;expires=date;path=path";
```

path就是cookie的路径。

最常用的例子就是让cookie在跟目录下，这样不管是哪个子页面创建的cookie，所有的页面都可以访问到了，

```
`document.cookie = "name=Darren;path=/"; `
```

#### cookie域概念

路径能解决在同一个域下访问 cookie 的问题，咱们接着说 cookie 实现同域之间访问的问题。语法如下，

```
document.cookie = "name=value;path=path;domain=domain";
```

domain就是设置的cookie域的值。

例如”www.qq.com”与”sports.qq.com”公用一个关联的域名”qq.com”，我们如果想让 “sports.qq.com”下的cookie被 “www.qq.com” 访问，我们就需要用到cookie的domain属性，并且需要把path属性设置为 “/“。

```
document.cookie = "username=Darren;path=/;domain=qq.com"
```

**注：一定的是同域之间的访问，不能把domain的值设置成非主域的域名。**

#### cookie安全性

通常cookie信息都是使用HTTP连接传递数据，这种传递方式很容易被查看，所以cookie存储的信息容易被窃取。假如cookie中所传递的内容比较重要，那么就要求使用加密的数据传输。所以cookie的这个属性的名称是`secure`，默认的值为空。如果一个cookie的属性为secure，那么它与服务器之间就通过HTTPS或者其它安全协议传递数据。语法如下：

```
document.cookie = "username=Darren;secure";
```

把cookie设置为secure，**只保证cookie与服务器之间的数据传输过程加密**，而保存在本地的cookie文件并不加密。如果想让本地cookie也加密，得自己加密数据。注：就算设置了`secure`属性也并不代表他人不能看到你机器本地保存的cookie信息，所以说到底，别把重要信息放cookie就对了。

#### cookie编码细节

原本来想在常见问题那段介绍cookie编码的知识，因为如果对这个不了解的话编码问题确实是一个坑，所以还是详细说说。在输入cookie信息时不能包含空格，分号，逗号等特殊符号，而在一般情况下，cookie信息的存储都是采用未编码的方式。所以，在设置cookie信息以前要先使用`escape()`函数将cookie值信息进行编码，在获取到 cookie值得时候再使用`unescape()`函数把值进行转换回来。如设置cookie时：

```
document.cookie = name + "=" + escape (value);
```

再看看基础用法时提到过的getCookie()内的一句：

```
return unescape(document.cookie.substring(c_start,c_end));
```

这样就不用担心因为在cookie值中出现了特殊符号而导致cookie信息出错了。