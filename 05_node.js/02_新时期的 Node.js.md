# 新时期的 Node.js

# 第1章　基础知识

# 第2章 常用模块

## 2.1　Module

### 2.1.4	模块化与作用域

Node和JavaScript中的this指向有一些区别，其中Node控制台和脚本文件的策略也不一样。对于浏览器中的JavaScript来说，无论是在脚本或者是Chrome控制台中，其this的指向和行为都是一致的；而Node则不是这样。我们会分别进行介绍。

#### **1．控制台中的this**

首先是全局的this，分别在Node Repl和Chrome控制台中运行：

![image-20210419152144513](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419152144513.png)

可以看出，在Node Repl环境中，全局的this指向global对象。

继续运行下面的代码：

![image-20210419152203619](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419152203619.png)

在Node控制台中，全局变量会被挂载到global下。

#### 2．脚本中的this

我们新建一个名为this.js的文件，在文件中添加如下代码：

![image-20210419152230090](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419152230090.png)

运行node test.js，打印出的结果是一个空对象。然后是下面的代码：

![image-20210419152245560](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419152245560.png)

仍然全都是undefined，说明第一行代码定义的变量a并没有挂载在全局的this或者global对象。

然而如果声明变量时不使用var或者let关键字，例如下面的代码：

![image-20210419152429099](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419152429099.png)

却可以正常打印出结果。

**那么在Node脚本文件中定义的全局this又指向了什么呢？答案是module.exports。**

![image-20210419152452934](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419152452934.png)

**总结一下，在Node repl环境中控制台的全局this和global可以看作是同一对象，而在脚本文件中，二者并不等价。**

#### 3．Node中的作用域种类

看完了上面的内容，接下来对Node中的各种作用域做一个总结。以下讨论的作用域内容仅限于脚本文件。

##### （1）全局作用域

如果一个变量没有用var、 let或者const之类的关键字修饰，那么它就是属于全局作用域，定义在全局作用域上的变量可以通过global对象访问到。

例如前面的例子：

![image-20210419152607143](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419152607143.png)

**变量a位于全局作用域中，即使是在不同的文件中也能访问到变量a。**

##### （2）模块作用域

在代码文件顶层（不在任何方法，对象中）使用var、let或者const修饰的变量都位于模块作用域中，不同模块作用域之间的作用域是隔离的。

模块作用域中的this指向module.exports中，例如前面提到的：

![image-20210419152744138](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419152744138.png)

我们在前面提到Node Repl和脚本文件执行会有不同的结果，这是因为Node会将所有的脚本文件包装成下面的这种形式。

![image-20210419152814881](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419152814881.png)

##### （3）函数作用域

书中无详细介绍

##### （4）块级作用域

ES2015中引入的let关键字提供了块级作用域的支持

## 2.2　Buffer

**Buffer是Node特有（区别于浏览器JavaScript）的数据类型，主要用来处理二进制数据**，在前端JavaScript中，和二进制数据打交道的机会比较少（ES2015增加了ArrayBuffer类型，用来操作二进制数据流，Node也可以使用该类型，我们会在下一章介绍）。

而Node在进行Web开发时经常需要和前端进行数据通信，二进制数据流十分常见（例如传输一张gif图片），因此Node除了String外，还内置了Buffer这一数据类型，**它是Node作为运行时对JavaScript做的扩展**。

Buffer属于固有（built-in）类型，因此无须使用require进行引入。

在文件操作和网络操作中，如果不显式声明编码格式，其返回数据的默认类型就是Buffer。例如下面读取文件的例子，如果不指定编码格式，得到的结果就是Buffer字符串。

**代码2.2　读取一个文件并打印内容**

![image-20210419153217649](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419153217649.png)

上面的代码中，最后打印出的是十六进制的数据，由于纯二进制格式太长而且难以阅读，Buffer通常表现为十六进制的字符串。

### 2.2.1　Buffer的构建与转换

可以使用Buffer类直接初始化一个Buffer对象，参数可以是由二进制数据组成的数组。

![image-20210419153304133](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419153304133.png)

如果想由字符串来得到一个Buffer，同样可以调用构造函数来实现，例如：

![image-20210419153347006](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419153347006.png)

注意：在最新的Node API中，Buffer()方法被标记为Deprecated，表示已经不推荐使用，因为这个方法在某些情况下可能不安全（参考https://github.com/nodejs/node/issues/4660），并且会在将来的版本中将其移除。目前推荐的是使用Buffer.from方法来初始化一个Buffer对象，上面的代码可以改写为如下形式。

**代码2.3　使用Buffer.from来初始化一个Buffer**

![image-20210419153445865](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419153445865.png)

如果想把一个Buffer对象转成字符串形式，需要使用toString方法，调用格式为：

![image-20210419153500947](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419153500947.png)

**Buffer支持的编码类型种类**有限，只有以下6种：

1. ASCII
2. Base64
3. Binary
4. Hex
5. UTF-8
6. UTF-16LE/UCS-2

不过也已经覆盖了最常用的编码类型。Buffer还提供了**isEncoding方法**来判断是否支持转换为目标编码格式。

例如，如果我们想把上一节表示“Hello Node”的Buffer对象转换为字符串，那么可以调用：

![image-20210419153622566](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419153622566.png)

如果toString在调用时不包含任何参数，那么就会默认采用UTF-8编码，并转换整个Buffer对象。

### 2.2.2　Buffer的拼接

举个例子，我们先构造一个中文的字符串，并将其另存为test.txt。

![image-20210419154600887](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419154600887.png)

然后我们写一段代码来尝试一下：

![image-20210419154614078](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419154614078.png)

highWaterMark

正如其字面意思最高水位线，它表示内部缓冲区最多能容纳的字节数，如果超过这个大小，就停止读取资源文件，默认值是64KB。

假设文件大小为100KB，那么在默认情况下，系统就会每次从文件里读取64KB大小的数据，随后触发data事件；chunk的大小即为highWaterMark的大小；然后接着读取36KB大小的文件，再次触发data事件；随后文件读取结束，触发end事件。

如果highWaterMark设置得很小，那么就会发生多次系统调用，这会对性能造成影响。

由于我们要读取的目标文件很短，因此只设置了10个字节位highWaterMark。

试着运行上面的代码，得到下面的输出：

![image-20210419154715657](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419154715657.png)

可以看到输出中产生了乱码，我们知道utf-8中一个汉字占三个字节，那么我们将highwatermark设置为10后，每三个字之后都会有一个字被截断，因此在调用toString方法的时候出现了乱码。

**目前上面的代码已经被舍弃，官方的推荐做法是使用push方法来拼接Buffer，上面的代码可改写成下面形式**：

**代码2.5　使用数组来拼接Buffer**

![image-20210419154759179](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419154759179.png)

上面的代码在拼接过程中不会有隐式的编码转换，首先将Buffer放到数组里面，等待传输完成后再进行转换，这样就不会出现乱码了。

## 2.3　File System

File System是Node中使用最为频繁的模块之一，该模块提供了读写文件的能力，是借助于底层的linuv的C++ API来实现的。

我们知道，浏览器中的JavaScript没有读写本地文件系统的能力（忽略IE中的ActiveX），而Node作为服务器编程语言，文件系统API是必需的，File System模块包含了数十个用于文件操作的API，大多提供同步和异步两种版本。

关于File System本身并没有什么特别值得关注的地方，本节也仅仅是罗列了一些常用的API，**虽然开发者可以随时随地查阅在线API文档，但有些内容还是需要牢记在心。**

1. ```
   1. fs.access(path[, mode], callback)
   2. fs.appendFile(file,data[,options], callback)
   3. fs.chmod(path, mode, callback)
   4. fs.chown(path, uid, gid, callback)
   5. fs.close(fd, callback)
   6. fs.fchmod(fd, mode, callback)
   7. fs.fchown(fd, uid, gid, callback)
   8. fs.fdatasync(fd, callback)
   9. fs.fstat(fd, callback)
   10. fs.fsync(fd, callback)
   11. fs.ftruncate(fd, len, callback)
   12. fs.futimes(fd, atime, mtime, callback)
   13. fs.link(existingPath, newPath, callback)
   14. fs.lstat(path, callback)
   15. fs.mkdir(path[, mode], callback)
   16. fs.open(path, flags[, mode], callback)
   17. fs.read(fd, buffer, offset, length, position, callback)
   18. fs.readdir(path[, options], callback)
   19. fs.readFile(file[, options], callback)
   20. fs.readlink(path[, options], callback)
   21. fs.rename(oldPath,newPath,callback)
   22. fs.rmdir(path, callback)
   23. fs.stat(path, callback)
   24. fs.symlink(target,path[, type], callback)
   25. fs.truncate(path, len, callback)
   26. fs.unlink(path, callback)
   27. fs.unwatchFile(filename[, listener])
   28. fs.utimes(path, atime, mtime, callback)
   29. fs.watch(filename[, options][, listener])
   30. fs.watchFile(filename[,options], listener)
   31. fs.write(fd, buffer, offset, length[, position], callback)
   32. fs.write(fd, data[, position[, encoding]], callback)
   33. fs.writeFile(file,data[,options], callback)
   ```

下面介绍几个常用的API。

### 1．readFile

该方法的声明如下：

![image-20210419155448842](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419155448842.png)

readFile方法用来异步读取文本文件中的内容，例如：

![image-20210419155517124](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419155517124.png)

readFile会将一个文件的全部内容都读到内存中，**适用于体积较小的文本文件**；**如果你有一个数百MB大小的文件需要读取，建议不要使用readFile而是选择stream**。**readFile读出的数据需要在回调方法中获取，而readFileSync直接返回文本数据内容。**

![image-20210419155610062](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419155610062.png)

如果不指定readFile的encoding配置，readFile会直接返回类似下面的Buffer格式；如果希望得到的是字符串形式，还需要调用toString方法进行转换：

![image-20210419155631859](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419155631859.png)

### 2．writeFile

该方法的声明如下：

![image-20210419155653232](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419155653232.png)

在WriteFile的第一个参数为文件名，如果不存在，则会尝试创建它（默认的flag为w）。

![image-20210419155729344](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419155729344.png)

### 3．fs.stat(path, callback)

stat方法通常用来获取文件的状态。通常开发者可以在调用open()、read()，或者write方法之前调用fs.stat方法，用来判断该文件是否存在。

**代码2.6　使用stat获取文件状态**

![image-20210419160008747](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419160008747.png)

如果文件存在，result就会返回文件的状态信息，例如下面的输出结果：

![image-20210419160134575](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419160134575.png)

如果文件不存在，则会出现Error: ENOENT: no such file or directory的错误。

#### 和fs.fstat的区别

如果阅读Nodejs文档，发现File System模块还有一个fstat方法，其声明格式为：

![image-20210419160416748](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419160416748.png)

这两个方法在功能上是等价的，唯一的区别是fstat方法第一个参数是文件描述符，格式为Integer，因此fstat方法通常搭配open方法使用，因为open方法返回的结果就是一个文件描述符。

![image-20210419160456603](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419160456603.png)

这段代码和fs.stat所示例代码在功能上等价。

下面是一个例子——获取目录下的所有文件名，这是一个常见的需求，实现这个功能只需要fs.readdir以及fs.stat两个API，readdir用于获取目录下的所有文件或者子目录，stat用来判断具体每条记录是文件还是子目录，如果是子目录，则递归调用整个方法。

**代码2.7　获取目录下所有的文件名**

![image-20210419160806429](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419160806429.png)

目标文件目录结构如图2-2所示。

![image-20210419160942194](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419160942194.png)

在循环获取文件信息的时候，为了避免嵌套层数过多而使用了fs.statSync而不是fs.stat，如果使用fs.stat，需要将后续的代码放到回调函数中。

## 2.4　HTTP服务

**HTTP模块是Node的核心模块**，主要提供了一系列用于网络传输的API，这些API大都位于比较底层的位置，可以让开发者自由地控制整个HTTP传输过程。

在HTTP模块中，Node定义了一些顶级的类、属性以及方法，如下所示：

![image-20210419161130304](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419161130304.png)

每个类下面又定义了一些方法和事件，接下来我们会就其中常用的部分加以说明。

### 2.4.1　创建HTTP服务器

通常使用createServer方法创建HTTP服务器，下面是一个最简单的例子。

![image-20210419161248095](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419161248095.png)

上面的代码中，使用createServer方法创建了一个简单的HTTP服务器，该方法返回一个http.server类的实例，createServer方法包含了一个匿名的回调函数，该函数有两个参数req和res，它们是InComingMessage和ServerResponse的实例。

分别表示HTTP的request和response对象，服务器创建完成后，Node进程开始循环监听3000端口（由listen方法实现）。

当浏览器访问localhost:3000时，Node返回“Hello Node”字符串。

http.server类定义了一系列的事件，**在上面的代码中，HTTP请求会触发connection和request事件**，将上面的代码稍微改造。

#### 代码2.9　监听来自客户端的事件

![image-20210419161744229](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419161744229.png)

当访问http://localhost:3000/时，控制台输出如下：

![image-20210419161839471](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419161839471.png)

程序打印出两个request，代表触发了两次request事件（其中一个是favicon.ico的请求）。

下面的代码是一个简单的静态文件服务器，只支持文本文件，可以通过浏览器来查看服务器端的文件内容。

#### 代码2.10　一个简单的静态文件服务器

![image-20210419161945051](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419161945051.png)

### 2.4.2　处理HTTP请求

如图2-3所示，这是一个标准的HTTP报文格式。

![image-20210419162319159](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419162319159.png)

#### 1．method，URL和header

当处理HTTP请求时，最先做的事就是获取请求的URL、method等信息。

Node将相关的信息都封装在一个对象（前面代码中的req）中，该对象是IncomingMessage的实例。

以获取method和URL为例：

![image-20210419162438617](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419162438617.png)

对于HTTP请求来说，method的值通常是get、post、put、delete、update 5个关键字之一，以get和post最为常见，URL的值为除去网站服务器地址之外的完整值。

例如请求：

![image-20210419162526833](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419162526833.png)

那么URL的值即为index.html?name=Lear。

#### 2．header

http header通常为以下的形式：

![image-20210419162708088](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419162708088.png)

可以使用Chrome控制台来查看具体信息，以localhost:3000的请求为例，HTTPheader形式如下：

![image-20210419162849321](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419162849321.png)

Node获取HTTP header信息也很简单，header是一个JSON对象，可以对属性名进行单独索引：

![image-20210419162913393](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419162913393.png)

#### 3．request body

Node使用stream来处理HTTP的请求体，这个stream注册了data和end两个事件。

**下面的这段代码通常获取完整的HTTP内容体**，在Buffer的一节我们已经提到过了。

![image-20210419163156339](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419163156339.png)

目前我们还没有提到response对象，该对象是ServerResponse的一个实例，并且实现了一个writableStream，我们接下来会对其进行介绍。

### 2.4.3　Response对象

#### 1．设置statusCode

状态码的设置在Web开发中常常被忽略，在Node中如果开发者不手动设置，那么状态码的值会默认为200。

但200并不适用所有场景，另一个常用的状态码是404，表示服务器没有对应的资源。

Web开发中如果遇到非法的路径访问，通常会返回一个404 not found的页面，但实际上，即使开发者返回一个200的状态码，也能将对应的页面返回，因此状态码的设置通常是一种最佳实践，而非强制的编码规范。

#### 2．设置response header

通过**setHeader**方法可以设置response的头部信息。

代码2.11　设置响应头

![image-20210421090736461](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421090736461.png)

**setHeader方法只能设置response header单个属性的内容，如果想要一次性设置所有的响应头和状态码，可以使用writeHead方法。**

**response.writeHead**

writeHead方法用于定义HTTP相应头，包括状态码等一系列属性，下面的例子我们会同时设置状态码和多个header字段。

![image-20210421090916584](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421090916584.png)

调用该方法后，服务器向客户端发送HTTP响应头，后面通常会跟着调用res.write等方法，响应头不可重复发送。

有时开发者并不会显式调用该方法，当调用end方法时也会调用writeHead方法，此时statusCode会自动设置成200。

#### 3．response body

response对象是一个writableStream实例，可以直接调用write方法进行写入，写入完成后，再调用end方法将该stream发送到客户端。

![image-20210421091228219](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421091228219.png)

不过这样会显得有些烦琐，也可以直接将response body作为end方法的参数进行返回。

![image-20210421091323630](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421091323630.png)

#### 4．response.end

**end方法在每个HTTP请求的最后都会被调用，当客户端的请求完成之后，开发者应该调用该方法来结束HTTP请求。**通常情况下，如果不调用end方法，用户最直观的感受通常是浏览器（以Chrome为例）位于地址栏左边的叉号[插图]会一直存在，表示该请求尚未完成。

**同样的，end方法支持一个字符串或者buffer作为参数，可以指定在HTTP请求的最后返回的数据，该数据会在浏览器页面上显示出来**；**如果定义了回调方法，那么会在end返回后调用**。

![image-20210421091524024](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421091524024.png)

### 2.4.4　上传数据

在上面的代码中我们只处理了头部信息，**头部信息之外的内容（body部分）需要开发者自行解析，否则**这部分内容就会被Node程序丢弃。

对于Node而言，可以通过req.method属性来判断请求方法的类型。

![image-20210421091845843](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421091845843.png)

#### 1．提交表单

表单的提交是post请求最常用的情景之一。

![image-20210421091911849](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421091911849.png)

上面的HTML代码定义了一个简单的form表单，单击submit按钮后会将整个表单提交到“/login”路径下。

下面是Node的服务端代码：

**代码2.12　server端的代码**

![image-20210421091956317](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421091956317.png)

如果不使用Express之类的Web框架，Node实现的服务器代码通常都是上面这种结构，获取请求的URL之后，再针对不同的HTTP method进行处理，缺点就是要写很多条件控制语句。

当用户在浏览器输入用户名、密码并提交后，浏览器向localhost:3000/login发起post请求，我们可以将头部信息打印出来：

![image-20210421092330906](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421092330906.png)

**可以看出，如果是以表单形式提交数据，请求头中的content-type为application/x-www(-?)form-urlencoded。**

报文主体中的内容是通过数据流的形式来传输的，可以通过监听流事件的方式来获取数据，这一点在buffer一节已经介绍过了，读者可以参考代码2.4。

将表单中的body内容打印出来如下所示：

![image-20210421092603120](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421092603120.png)

#### 2．使用post上传文件

首先要构造一个用于上传文件的表单。

![image-20210421092714100](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421092714100.png)

**和只有字段值的表单不同的是，上传文件的表单要设置enctype="multipart/form-data"属性，同样地，文件上传时的header信息也有所不同：**

![image-20210421092734177](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421092734177.png)

服务器处理上传文件通常基于stream来实现，**这里使用的是比较流行的第三方库formidable。formidable模块已经有些年头了，由于社区喜新厌旧的天性，模块版本更新可能不够及时，我们在第5章会进行进一步介绍。**

下面是封装的一个处理上传文件的方法。

**代码2.13　服务器处理上传文件**

![image-20210421092900126](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421092900126.png)

在回调方法中的files字段，将其打印出来：

![image-20210421093149566](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421093149566.png)


如果想要获取files对象中一些属性，例如name，type的值，可以通过：

![image-20210421093226512](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421093226512.png)

来获取，上面表达式的file字段即为form表单的name属性。

可以看出formidable是调用writeStream进行文件写入的，同样的，该模块还支持多个文件同时上传，读者可以自行实现。

### 2.4.5　HTTP客户端服务

HTTP模块除了能在服务端处理客户端请求之外，还可以作为客户端向服务器发起请求，例如通过http.get发起get请求，通过post方法上传文件等。这也是Node也能做出像electron那样的桌面软件的基础。

**http.get的声明如下**：

![image-20210421093629045](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421093629045.png)

**代码2.14　发起一个get请求**

![image-20210421093654900](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421093654900.png)

上面这段代码向http://blockchain.info/ticker发起了一个get请求。用来获得比特币当前的价格信息，该请求返回的结果如下：

![image-20210421093924280](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421093924280.png)

### 2.4.6　创建代理服务器

**代理服务器相当于在客户端和目标服务器之间建立了一个中转，所有的访问和流量都经过这个服务器进行中转**，代理服务器在实际中运用十分广泛，**例如，如果本地机器不能直接访问目标服务器，那么就在可以连通两端的机器上搭建一个代理服务器，就能通过间接的方式访问目标服务器了**。在本节中，我们会在本地搭建一个简单的代理服务器。

在本节中，我们会在本地搭建一个简单的代理服务器。

#### 代码2.15　代理服务器的例子

![image-20210421094713169](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421094713169.png)

在上面的例子中，我们在本地创建了一个HTTP服务器，请求经由localhost:8080进行转发，请求的URL也要改成形如localhost:8080/google.com的格式，也可以用一些其他配置省略掉开头的localhost:8080。**(不太懂)**

代理服务器可以有很多应用领域，例如使用它来缓存文件或者，很多企业都会使用代理服务器来过滤掉一些广告和垃圾网站的URL，或者限制员工使用公司网络访问社交网站。有的企业访问npm下载第三方模块也需要配置代理。

一些常用的屏蔽广告的浏览器插件大都也是依靠本地启动代理服务器来实现广告过滤的。

#### 关于反向代理

如果一个代理服务器可以代理外部的访问来访问内部网络时，这种代理方式就被称为反向代理。

CDN就是一个反向代理的例子，如果一个网站购买了CDN服务，那么当有来自外部（客户端）的请求时，并没有直接访问服务器的内容，而是访问距离用户最近的CDN节点。对于服务器来说，CDN就起到了反向代理的功能。

## 2.5　TCP服务

如果开发者大多数时间都在进行Web站点的开发，那么TCP服务和HTTP服务相比出场率并不高，但HTTP仅仅是应用层协议的一种，除了HTTP之外，应用层还有一些比较常用的协议，例如FTP、SMTCP、Telnet等。

TCP服务不是我们介绍的重点，这一节会简单介绍使用Node创建TCP服务的方法，以及一个应用的例子。

### 2.5.1　TCP和Socket

大多数开发者都知道网络服务需要Socket编程，也都清楚TCP协议是用来传输数据的，TCP协议和Socket又有哪些区别呢？

**Socket是对TCP协议的一种封装方式**，Socket本身并不是协议，而是一个编程接口，在这个接口上定义了一些基础的方法，例如accept、listen、write等，如果一种编程语言实现了socket接口，那么它就可以通过socket接口预定义的方法来解析使用TCP协议传输的数据流。（socket并不是专门为TCP协议设计的，在设计之初就期望能兼容多种传输层协议。）

### 2.5.2　创建TCP服务器

在Node中有三种Socket，分别对应实现TCP、UDP以及UNIX Socket，**与这些相关的代码都位于Net模块中**（UNIX Socket即UNIX Domain Socket，和面向网络的TCP、UDP不同，主要用于本地系统的进程间通信）。**Net模块和HTTP模块的结构很相似，包含了Server类、Socket类以及一些预定义的方法，下面的代码会创建一个TCP Server。**

**代码2.16　创建一个TCP服务器**

![image-20210421100635700](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421100635700.png)

上面的代码中，如果服务器收到了一个连接请求，就会返回一个Hello字符串，虽然该server监听了8124端口，但如果在浏览器里打开localhost:8124的方式来访问，就会出现GET http://localhost:8124/ net::ERR_INVALID_HTTP_RESPONSE的错误。原因也很简单，一个TCP服务器不会返回符合HTTP协议标准的响应，为了验证这个服务器，可以使用telnet命令，打开控制台输入：

![image-20210421100816443](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421100816443.png)

![image-20210421100824511](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421100824511.png)

这表明TCP服务正常启动了。

如果不想使用命令行，也可以在代码中使用connect或者createConnection方法来连接到一个TCP服务器，二者没有任何区别。

**代码2.17　TCP客户端**

![image-20210421100944315](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421100944315.png)

## 2.6　更安全的传输方式——SSL

如果读者只是想开发个人使用的小网站，那么这一节的内容就显得有些无关紧要。然而对于企业网站，使用更加安全的数据传输是必要的，使用单纯的HTTP连接，所有的内容都以明文传输，这种方式是极不安全，就连通常被认为安全的“Post”操作，其安全性也无法保证。

因此我们才需要更安全的HTTPS（HTTP+SSL），下面的图片（如图2-4所示）描述了SSL在网络通信中的位置。

![image-20210421101513445](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421101513445.png)

### 2.6.1　什么是SSL

SSL（Secure Sockets Layer，安全套接层）协议及其继任者TLS（TransportLayer Security，传输层安全）协议是为网络通信提供安全及数据完整性的一种安全协议。TLS与SSL在传输层对网络连接进行加密。 **SSL的一大优势在于它独立于上层协议，和HTTP结合即为HTTPS，和WebSocket结合即为WSS。**

SSL协议是由网景公司于1994年推出，其目的是为网络通信提供可靠的加密方式，这一协议于1999年被IETF（Internet Engineering Task Force）标准化，标准名称为TLS。

**通常认为SSL和TLS指代同一个标准，两者之间的差异极小。**

### 2.6.2　SSL原理

不同的SSL握手过程存在差异，分为以下三种：

1. 只验证服务器
2. 验证服务器和客户端
3. 恢复原有会话

我们在这里只介绍第一种，下面是其建立连接的过程。

（1）客户端发送Client Hello消息，该消息包括SSL版本信息、一个随机数（假设它是random1）、一个session id（用来避免后续请求的握手）和浏览器支持的密码套件（cipher suite）。

cipher suite（密码套件）的内容和它的含义一样，它是一个由加密算法名称组成的字符串，包括了以下4种用途的加密算法：

1. 密钥交换算法：常用的有RSA、PSK等。
2. 数据加密算法：常用的例如AES 256、RC4等。
3. 报文认证信息码（MAC）算法：常用的例如MD5、SHA等。
4. 伪随机数(PRF)算法。

例如下面这个字符串就是一个cipher suite：

![image-20210421104121668](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421104121668.png)

其中各项的含义如下：

- ECDHE_RSA：密钥交换算法。
- AES_128_GCM：数据加密算法。
- SHA256：MAC算法。

伪随机数则是借助MAC算法实现的。

（2）服务器确定本次通信使用的SSL版本和其他信息，发送Server Hello给客户端，里面的内容包括服务器支持的SSL版本、一个伪随机数（random2）以及服务器的cipher suite等信息。

（3）服务器发送CA证书给客户端。

（4）服务器发送Server Hello done。

（5）客户端验证服务器证书的合法性后（Certificate Verify），利用证书中的公钥加密premaster secret（一个在对称加密密钥生成中的46字节的随机数字和消息认证代码）作为Client Key Exchange的消息发送给服务器。

（6）SSL客户端发送Change Cipher Spec消息，该消息属于SSL密码变化协议。

（7）客户端计算历史消息的hash值，然后使用服务器公钥加密后发送给服务器，服务器进行同样的操作，然后两个值结果相同表示密钥交换成功。

（8）服务器发送Change Cipher Spec消息。

（9）服务器计算历史消息的hash值，通过交换后的密钥加密，将其作为finished消息发送给客户端，客户端利用交换后的密钥解密，如果和本地历史消息相同就证明服务器身份。握手结束。

**密钥交换的步骤**

不管加密数据使用的是对称亦或是非对称算法，客户端和服务器都需要交换密钥，在对称加密的情况下，客户端需要将解密的密钥发送给服务器；非对称加密的情况下，则是要把自己的私钥发送给对方。

密钥交换有很多不同的算法，比较常见的是RSA算法，它是一种非对称式加密算法。

（1）Certificate Verify(证书核实)

客户端收到服务端传来的证书后，先验证该证书的合法性，验证通过后取出证书中的服务端公钥，再生成一个随机数Random3，再用服务端公钥加密Random3生成PreMaster Key。

（2）Client Key Exchange

上面客户端根据服务器传来的公钥生成了PreMaster Key，Client Key Exchange就将这个Key传给服务端，服务端再用自己的私钥解出这个PreMaster Key，得到客户端生成的Random3。再加上前面生成的Random1和Random2，至此，客户端和服务端都拥有Random1+ Random2 + Random3。

两边再根据同样的算法就可以生成一份密钥，握手结束后的应用层数据都是使用这个密钥进行对称加密。

使用三个随机数的原因是因为使用多个随机数来生成密钥不容易被暴力破解出来。

### 2.6.3　对称加密与非对称加密

**对称密钥加密**，又称私钥加密或会话密钥加密算法，即信息的发送方和接收方使用同一个密钥去加密和解密数据。它的最大优势是加/解密速度快，适合于对大数据量进行加密，但密钥管理困难。

**非对称密钥加密系统**，又称公钥密钥加密。它需要使用不同的密钥来分别完成加密和解密操作，一个公开发布，即公开密钥，另一个由用户自己保存，即私用密钥。信息发送者用公开密钥去加密，而信息接收者则用私用密钥去解密。公钥机制灵活，但加密和解密速度却比对称密钥加密慢得多。

### 2.6.4　关于CA（Certification Authority，证书授权）（有举例方便理解）

**假设两个同学在课堂上传纸条，由于纸条的传递要经过好几个同学，他们不希望纸条的内容被其他同学知晓，于是他们打算采用非对称加密的方法，他们互相定义了一种加密和解密的方法，各自的加密内容只有自己的解密密码（私钥）才能解开。那么在传输信息之前，双方需要交换自己的加密方法（公钥）。**

**然而在第一次交换加密方法的纸条传递时，中间一名负责传递的同学看穿了他们的套路，把双方交换的公钥都换成了自己伪造的公钥，那么就可以轻松地使用自己的私钥读取他们之间的通信内容，这种做法就属于中间人攻击。**

CA（Certification Authority，证书授权），通常表示一个第三方组织，专门用来验证服务器证书的准确性的。打个比方，也就是在上面交换公钥的时候，如果传纸条的双方约定好，要另一个他们都信得过的人（例如班主任）来验证双方的公钥无误，那么就可以放心地传纸条了。

一个CA文件包含的内容包括用户信息、CA签发机构信息、用户公钥、有效日期、CA签发机构签名（CA签发机构用私钥签名，用于将用户信息+用户公钥等信息进行签名确保内容的真实性）、CA签发机构的公钥（用于让用户验证签发证书是否是CA签发机构签发的）

CA证书需要CA机构来颁发，通常申请这么一个证书往往要花不少时间和精力，那么一些小企业通常会自己担任CA机构，即自己给自己网站的公钥签名，这是一种既当裁判又当运动员的方法，也是我们接下来的做法。

### 2.6.5　创建HTTPS服务

HTTPS即HTTP + SSL，目前国内的主流网站都在进行或者已经完成了HTTPS升级。

在使用前，我们需要创建公钥、私钥以及证书，这一切都可以通过openSSL这一工具来完成。Mac OSX自带了OpenSSL，在Windows和一些Linux发行版上需要自行下载安装。

为了得到签名证书，服务器需要先生成一个后缀为CSR（Certificate SigningRequest）的文件。

下面的命令展示了服务器创建公钥、私钥以及证书的流程：

![image-20210421105632248](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421105632248.png)

客户端的创建同理。

值得一提的是，在创建CSR文件的过程中，OpenSSL会提示用户输入一些配置信息**，唯一需要注意的是common Name选项，如果开发者是在本地工作，那么就直接输入localhost即可，其他的选项都可以留空**。

下面是一个配置的例子，如图2-5所示。

![image-20210421105905773](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421105905773.png)

创建好公钥和私钥之后，就可以开始创建使用SSL加密的服务器了。

#### **代码2.18　创建HTTPS服务器**

![image-20210421110036135](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421110036135.png)

打开浏览器访问https://locahost:3001，注意一定要是HTTPS，因为我们只启动了HTTPS服务器，如果读者此时在使用最新的Chrome浏览器，那么浏览器会首先展示一个警告页面。如图2-6所示。

![image-20210421110147033](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421110147033.png)

如果我们选择继续访问，仍然能正常地看到服务器的返回信息，区别是在地址栏的最左边出现不安全的提醒，如图2-7所示。

![image-20210421110157273](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421110157273.png)

这是我们的证书没有经过正规的CA机构颁发的原因。

此外，服务器的控制台会打印unauthorized。

如果使用request方法请求这个服务器，同样要带上客户端的私钥。

![image-20210421110347551](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421110347551.png)

加载了客户端证书之后，服务器会打印出authorized。

如果开发者想要获得由第三方组织颁发的证书，那么可以考虑使用letsencrypt.org这一网站提供的免费服务，步骤十分简单，它是由ISRG（Internet SecurityResearch Group，互联网安全研究小组）提供的服务，得到了国外很多知名IT公司和机构的支持，读者可自行探索。

#### HTTPS的缺点

HTTPS的缺点在于比普通的HTTP连接要慢，普通的HTTP只需要三次握手就能建立TCP连接，而HTTPS还要加上额外的SSL验证过程，在一定时间上拖慢了打开页面的速度，这也是为什么HTTPS在早期没有普及开来的原因。

随着带宽的增加，SSL带来的时间损失相对没那么大了，尤其是国内，为了加强安全性和避免运营商流量劫持，各大网站都开始了HTTPS的升级。

## 2.7　WebSocket

WebSocket可以看作是HTTP协议的升级版，它同样是基于TCP协议的应用层协议，主要是为了弥补HTTP协议的无持久化和无状态等缺陷而诞生的。**WebSocket提供了客户端和服务器之间全双工的通信机制。**

### 2.7.1　保持通话

当客户端发起一个请求时，客户端和服务器之间首先需要建立TCP连接，然后才能使用更高层的HTTP协议来解析数据。

HTTP是非持久化的，当用户发起一个request，服务器会随之返回一个response，那么这个HTTP连接就结束了，TCP连接也随之关闭。如果客户端想要继续访问服务器的内容，还需要重新建立TCP连接。对于连续的请求来说，这样会在TCP握手上浪费不少时间。

**为了改进这一问题，浏览器在请求头里增加了Connection: Keep-Alive这一字段，当服务器收到带有这一头部的请求时会保持TCP连接不断开，同时也会在response中增加这一字段，这样浏览器和服务器之间只要建立一次TCP连接就可以进行多次HTTP通信。**

在HTTP 1.1版本中，Connection: Keep-Alive被加入到标准之中，同时所有的连接都会被默认保持，除非手动指定Connection: Close。此外，为了避免无限制的长连接，服务器也会设置一个timeout属性，用来指定该连接最长可以保持时间。

keep-alive的最大优点在于其避免了多次的TCP握手带来的性能浪费；但还是有一些缺陷，其本质上还是使用HTTP进行通信，对于协议本身没有什么改进。

### 2.7.2　为什么要有WebSocket

假设我们要开发一个新闻类网站，该网站会一直将最新的新闻推送到页面上而不需要用户进行刷新操作，在WebSocket之前的HTTP协议中，服务器无法主动向客户端推送数据，对于这种情况有两种解决方案。

（1）客户端每隔几秒就发起Ajax请求，如果返回不为空，就将内容展示在页面上。

（2）使用长轮询，服务器收到客户端的请求后，如没有新的内容，就保持阻塞，当新内容产生后再发送response给客户端。

这两种做法的缺点都很明显。第一种可能客户端发送了很多请求才能得到一个新内容，第二种则是在服务器获得新内容前都无法关闭socket，会占用很多系统资源。

**WebSocket可以实现浏览器与服务器的全双工通信，它和传统的jsonp、comet等解决方案不同，不必浏览器发送请求后再由服务器返回消息，而是可以由服务器主动发起向浏览器的数据传输。**

WebSocket的请求头和HTTP很相似，下面是一个WebSocket header和服务器的response。

![image-20210421111131943](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421111131943.png)

服务器返回以下消息：

![image-20210421111146834](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421111146834.png)

1. **在请求头中，Connection字段必须设置成Upgrade，表示客户端希望连接升级。**
2. **Upgrade字段必须设置WebSocket，表示希望升级到WebSocket协议。**
3. Sec-WebSocket-Key是随机的字符串，服务器端会用这些数据来构造出一个SHA-1的信息摘要。服务器会给这个随机的字符串再加上一个特殊字符串“ 258EAFA5-E 914-47DA-95CA-C5AB0DC85B11”，然后计算SHA-1摘要，之后进行BASE-64编码，将结果作为Sec-WebSocket-Accept头的值返回给客户端。
4. “258EAFA5-E914-47DA-95CA-C5AB0DC85B11”这一字符串是一个GUID，其本身并没有特别的含义，选择这个字符串的原因只是这个字符串不大可能被WebSocket之外的协议用到（协议本身描述如下：which is unlikely to be usedby network endpoints that do not understand the WebSocket Protocol）。Sec-WebSocket-Version表示支持的WebSocket版本。RFC6455要求使用的版本是13，之前草案的版本均应当被弃用。
5. Origin字段是可选的，通常用来表示在浏览器中发起此WebSocket连接所在的页面，类似于Referer。但是，与Referer不同的是，Origin只包含了协议和主机名称。
6. 其他一些定义在HTTP协议中的字段，如Cookie等，也可以在WebSocket中使用。

### 2.7.3　WebSocket与Node

在NPM中有很多支持WebSocket的第三方模块，这里使用WS这一第三方模块。下面是一个简单的例子。

#### **代码2.19　JavaScript连接WebScoket**

![image-20210421111740495](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421111740495.png)

#### **代码2.20　Node实现的WebSocket服务器**

![image-20210421111810012](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421111810012.png)

在Node里，比较出名的WebSocket模块还有Socket.IO，常被拿来做在线的聊天或者推送服务。读者有兴趣可以自行了解。

## 2.8　Stream

Stream模块为Node操作流式数据提供了支持。Stream的思想最早见于早期的UNIX，在UNIX中使用“|”符号会创建一个匿名管道，其本质上也是一个Stream，用于两个程序（或者是设备）之间的数据传输。

### 2.8.1　Stream的种类

要使用Node的stream模块，需要增加引用：

![image-20210421112502385](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421112502385.png)

在Nodejs中，一共有四种基础的stream类型：

1. Readable：可读流(for example fs.createReadStream())。
2. Writable：可写流(for example fs.createWriteStream())。
3. Duplex：既可读，又可写(for example net.Socket)。
4. Transform：操作写入的数据，然后读取结果，通常用于输入数据和输出数据不要求匹配的场景，例如zlib.createDeflate()。

我们重点介绍Readable和Writable这两种stream。

#### 1．Readable Stream

Readable Stream定义的方法和事件如下所示：

Event: 'close'Event: 'data'

Event: 'end'Event: 'error'

Event: 'readable'

readable.isPaused()

readable.pause()

readable.pipe(destination[, options])

readable.read([size])

readable.resume()

readable.setEncoding(encoding)

readable.unpipe([destination])

readable.unshift(chunk)

readable.wrap(stream)

**代码2.21　Readable stream的例子**

![image-20210421113109154](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421113109154.png)

#### 2．Writeable Stream

Writeable Stream主要使用write方法来写入数据，API列表如下文所示：

![image-20210421113147559](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421113147559.png)

**write方法同样是异步的**，假设我们创建一个可读流读取一个较大的文件，再调用pipe方法将数据通过一个可写流写入另一个位置。如果读取的速度大于写入的速度，那么Node将会在内存中缓存这些数据。

当然缓冲区也是有大小限制的（state.highWatermark），当达到阈值后，write方法会返回false，可读流也进入暂停状态，当writeable stream将缓冲区清空之后，会触发drain事件，上游的readable重新开始读取数据。

另一个比较重要的是pipe方法，其声明如下：

![image-20210421113359123](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421113359123.png)

pipe方法相当于在可读流和可写流之间架起了桥梁，使得数据可以通过管道由可读流进入可写流。下面是使用pipe方法改写的静态文件服务器。

**代码2.22　使用pipe改写的静态文件服务器**

![image-20210421113450775](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210421113450775.png)

pipe方法接收一个writable对象，当readable对象调用pipe方法时，会在内部调用writable对象的write方法进行写入。