# 新时期的 Node.js

# 第1章　基础知识

# 第2章　常用模块

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

### 2.8.2　ReadLine

ReadLine是一个Node原生模块，该模块比较不起眼，提供了按行读取Stream中数据的功能。

下面是ReadLine模块的监听事件及方法：

Event : 'close'

Event : 'line'

Event : 'pause'

Event : 'resume'

Event : 'SIGCONT'

Event : 'SIGINT'

Event : 'SIGTSTP'

rl.close()

rl.pause()

rl.prompt([preserveCursor])

rl.question(query, callback)

rl.resume()

rl.setPrompt(prompt)

rl.write(data[, key])

该模块通常用来和stream搭配使用，但因为在实际项目中通常会定制自己的stream或者自定义读取方法，导致该模块的地位有些尴尬。下面是readLine的一个例子。

#### 代码2.23　使用readLine模块读取文件

![image-20210426195204584](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426195204584.png)

readLine并没有提供形如new readline()形式的构造方法，而是使用createInterface方法初始化了一个rl对象。

想象下有如下场景，一个可读流中包含了很多条独立的信息需要逐条处理，这可能是一个消息队列，这时使用readline模块就比较方便。

### 2.8.3　自定义Stream

在实际开发中，如果想要使用流式API，而原生的Stream又不能满足需求时，可以考虑实现自己的Stream类，常用的方法是继承原生的Stream类，然后做一些扩展。

下面我们拿Readable Stream为例来说明如何实现一个自定义的Stream。

![image-20210426195557484](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426195557484.png)

上面的代码实现了名为MyReadable的类，它继承自Readable类，并且接受一个数组作为参数。

想要继承Readable类，就要在自定义的类内部实现_read方法，该方法内部使用push方法往可读流添加数据。

当我们给可读流对象注册data事件后，可读流会在nextTick中调用_read方法，并触发第一次data事件（读者可能会认为可读流开始读取是在调用构造函数之后，但此时data事件还未注册，可能会捕获不到最初的事件，因此可读流开始产生数据的操作是放在nextTick中的）。

当有消费者从readable中取数据时会自动调用该方法。在上面的例子里我们在_read方法里调用了push方法，该方法用来向可读流中填充数据，下面是一个消费者的例子：

![image-20210426200153588](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426200153588.png)

每次触发data事件时都会得到相应的数组元素，当数组为空时，_read方法会被调用。即：

![image-20210426200207576](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426200207576.png)

如果end事件被触发，则代表读取完毕。

## 2.9　Events（重要）

Node的Events模块只定义了一个类，就是EventEmitter（以下简称Event），这个类在很多Node本身以及第三方模块中大量使用，通常是用作基类被继承。

### 2.9.1　事件和监听器

Node程序中的对象会产生一系列的事件，它们被称为事件触发器（eventemitter），例如一个HTTP Server会在每次有新连接时触发一个事件，一个Readable Stream会在文件打开时触发一个事件等。

**所有能触发事件的对象都是EventEmitter类的实例。**EventEmitter定义了on方法，该方法的声明如下：

![image-20210426200503848](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426200503848.png)

下面是一个事件注册和触发事件的例子

#### 代码2.24　注册一个事件并触发它

![image-20210426200525460](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426200525460.png)

上面的代码中，首先初始化了一个EventEmitter实例，然后注册了一个名为begin的事件，之后调用emit方法触发了这一事件。

用户可以注册多个同名的事件，在上面的例子中，如果注册两个名为begin的事件，那么它们都会被触发。

**如果想获取当前的emitter一共注册了哪些事件，可以使用eventNames方法。**

![image-20210426200704207](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426200704207.png)

该方法会输出包括全部事件名称的数组。

**就算注册了两个同名的event，输出结果也只有一个，说明该方法的结果集并不包含重复结果。**

注意：在Node v6.x及之前的版本中，event模块可以通过：

![image-20210426200813221](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426200813221.png)

引入，在新的版本中这种写法已经被废弃并会抛出一个异常，只能统一由require进行引入，有时能在一些旧版本的第三方模块中还能看到。

### 2.9.2　处理error事件

由于Node代码运行在单线程环境中，那么运行时出现的任何错误都有可能导致整个进程退出。利用事件机制可以实现简单的错误处理功能。

当Node程序出现错误的时候，通常会触发一个错误事件，如果代码中没有注册相应的处理方法，会导致Node进程崩溃退出。例如：

![image-20210426200919733](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426200919733.png)

上面的代码主动抛出了一个error，相当于：

![image-20210426200958412](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426200958412.png)

Node程序会打印出整个错误栈：

![image-20210426201045682](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426201045682.png)

如果我们不想因为抛出一个error而使进程退出，那么可以让uncaughtException事件作为最后一道防线来捕获异常。

#### 代码2.25　使用uncaughtException事件捕获异常

![image-20210426201123718](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426201123718.png)

这种错误处理的方式虽然可以捕获异常，避免了进程的退出，但不值得提倡，我们会在错误处理一章详细介绍相关的内容。

Event模块还有一些其他的API，这里不再一一介绍。

### 2.9.3　继承Events模块

在实际的开发中，通常不会直接使用Event模块来进行事件处理，而是选择将其作为基类进行继承的方式来使用Event，在Node的内部实现中，凡是提供了事件机制的模块，都会在内部继承Event模块。

以fs模块为例，下面是其源码中的一部分：

![image-20210426201233112](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426201233112.png)

可以看出fs模块通过util.inherit方法继承了Event模块。

假设我们要用Node来开发一个网页上的音乐播放器应用，关于播放和暂停的处理，就可以考虑通过继承events模块来实现。

![image-20210426201258499](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426201258499.png)

另一种场景，假设我们想要利用原生的数组来模拟一个消息队列，该队列会在新增消息和弹出消息时触发对应的事件，也可以考虑继承Events模块。

详细的内容可以参考第6章。

## 2.10　多进程服务

### 2.10.1　child_process模块

我们现在已经知道了Node是单线程运行的，这表示潜在的错误有可能导致线程崩溃，然后进程也会随着退出，无法做到企业追求的稳定性；另一方面，单进程也无法充分多核CPU，这是对硬件本身的浪费。Node社区本身也意识到了这一问题，于是从0.1版本就提供了**child_process模块，用来提供多进程的支持**。

child_process模块中包括了很多创建子进程的方法，包括fork、spawn、exec、execFile等等。它们的定义如下：

```
child_process.exec(command[, options][, callback])
child_process.spawn(command[, args][, options])
child_process.fork(modulePath[, args][, options])
child_process.execFile(file[, args][, options][,callback])
```

在这4个API中以spawn最为基础，因为其他三个API或多或少都是借助spawn实现的。

### 2.10.2　spawn

spawn方法的声明格式如下：

![image-20210426201559747](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426201559747.png)

spawn方法会使用指定的command来生成一个新进程，执行完对应的command后子进程会自动退出。

**该命令返回一个child_process对象，这代表开发者可以通过监听事件来获得命令执行的结果。**

#### 代码2.26　使用spwan来执行ls命令

![image-20210426202128532](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426202128532.png)

其中spawn的第一个参数虽然是command，但实际接收的却是一个file，代码2.25可以在Linux或者Mac OSX上运行，这是由于ls命令也是以可执行文件形式存在的。

类似的，在Windows系统下我们可以试着使用dir命令来实现功能类似的代码：

![image-20210426202258100](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426202258100.png)

然而在Windows下执行上面代码会出现形如Error: spawn dir ENOENT的错误。

原因就在于spawn实际接收的是一个文件名而非命令，正确的代码如下：

![image-20210426202322846](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426202322846.png)

这个问题的原因与操作系统本身有关，在Linux中，一般都是文件，命令行的命令也不例外，例如ls命令是一个名为ls的可执行文件；而在Windows中并没有名为dir的可执行文件，需要通过cmd或者powershell之类的工具提供执行环境。

### 2.10.3　fork

在Linux环境下，创建一个新进程的本质是复制一个当前的进程，当用户调用fork后，操作系统会先为这个新进程分配空间，然后将父进程的数据原样复制一份过去，父进程和子进程只有少数值不同，例如进程标识符（PID）。

对于Node来说，父进程和子进程都有独立的内存空间和独立的V8实例，**它们和父进程唯一的联系是用来进程间通信的IPC Channel。**

此外，Node中fork和POSIX系统调用的不同之处在于**Node中的fork并不会复制父进程**。

Node中的fork是上面提到的spawn的一种特例，前面也提到了Node中的fork并不会复制当前进程。多数情况下，fork接收的第一个参数是一个文件名，使用fork("xx.js")相当于在命令行下调用node xx.js，并且父进程和子进程之间可以通过process.send方法来进行通信。示例代码如下：

#### 代码2.27　master.js——调用fork来创建一个子进程

![image-20210426202800273](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426202800273.png)

代码2.28　worker.js代码

![image-20210426202848107](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426202848107.png)

fork内部会通过spawn调用process.executePath，即Node的可执行文件地址（例如/Users/likai/.nvm/versions/node/v6.9.4/bin/node）来生成一个Node实例，然后再用这个实例来执行fork方法的modulePath参数。

### 2.10.4　exec和execFile（不懂）

如果我们开发一种系统，那么对于不同的模块可能会用到不同的技术来实现，例如Web服务器使用Node，然后再使用Java的消息队列提供发布订阅服务，这种情况下通常使用进程间通信的方式来实现。

但有时开发者不希望使用这么复杂的方式，或者要调用的干脆是一个黑盒系统，即无法通过修改源码来进行来实现进程间通信，这时候往往采用折中的方式，例如通过shell来调用目标服务，然后再拿到对应的输出。

笔者曾经做过一个项目，后台用一个Spark集群来进行数据的分析，然后将结果绘成图表展示给用户，当时一种备选方案就是采用B/S架构并使用Node来做Web服务器，当用户单击页面上的元素时，Node将其转换为Spark集群中的命令，这个过程就是使用Node调用Shell来完成的。

#### 1．Shell简介

Shell其实很简单，在控制台输入cd ~/desktop，然后回车，这就是最简单的shell命令，把这行命令写在文本里就是一个shell脚本。

例如：

![image-20210426203206553](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426203206553.png)

在Linux或者Mac OSX下可以使用命令：

![image-20210426203217485](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426203217485.png)

来执行这个脚本，效果跟直接输入命令：

![image-20210426203237082](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426203237082.png)

是一样的。

#### 2．execFile方法

child_process提供了一个execFile方法，它的声明如下：

![image-20210426203323645](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426203323645.png)

![image-20210426203408614](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426203408614.png)

可以看出，execfile和spawn在形式上的主要区别在于execfile提供了一个回调函数，通过这个回调函数可以获得子进程的标准输出/错误流。

使用shell进行跨进程调用长久以来被认为是不稳定的，这大概源于人们对控制台不友好的交互体验的恐惧（输入命令后，很可能长时间看不到一个输出，尽管后台可能在一直运算，但在用户看来和死机无异）。

在Linux下执行exec命令后，原有进程会被替换成新的进程，进而失去对新进程的控制，这代表着新进程的状态也没办法获取了，此外还有shell本身运行出现错误，或者因为各种原因出现长时间卡顿甚至失去响应等情况。

Node.js提供了比较好的解决方案，timeout解决了长时间卡顿的问题，stdout和stderr则提供了标准输出和错误输出，使得子进程的状态可以被获取。



### 2.10.5　各方法之间的比较

#### 1．spawn和execfile

为了更好地说明，我们先写一段简单的C语言代码，并将其命名为example.c：

![image-20210426203509446](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426203509446.png)

使用gcc编译该文件：

![image-20210426203529415](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426203529415.png)

生成名为example的可执行文件，然后将这个可执行文件放到系统环境变量中（编辑~/.bash_profile），然后打开控制台，输入example，看到最后输出"HelloWorld"。

确保这个可执行文件在任意路径下都能访问。

我们分别用spawn和execfile来调用example文件。

首先是spawn。

##### 代码2.29　使用spwan来调用

![image-20210426203639501](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426203639501.png)

程序输出：

![image-20210426203721440](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426203721440.png)

程序正确打印出了Hello World，此外还可以看到example最后的return 5会被作为子进程结束的code被返回。

然后是execfile。

##### 码2.30　使用execFile来调用

![image-20210426203843453](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426203843453.png)

同样打印出Hello World，可见除了调用形式不同，二者相差不大。

#### 2．execFile和spawn

在子进程的信息交互方面，spawn使用了流式处理的方式，当子进程产生数据时，主进程可以通过监听事件来获取消息；而exec是将所有返回的信息放在stdout里面一次性返回的，也就是该方法的maxBuffer参数，当子进程的输出超过这个大小时，会产生一个错误。

此外，spawn有一个名为shell的参数，下面是该参数在文档中的定义：

![image-20210426204101236](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426204101236.png)

其类型为一个布尔值或者字符串，如果这个值被设置为true，就会启动一个shell来执行命令，这个shell在UNIX上是bin/sh，在Windows上则是cmd.exe。

#### 3．exec和execfile

exec 在内部也是通过调用 execFile 来实现的，我们可以从源码中验证这一点，在早期的Node源码中，exec 命令会根据当前环境来初始化一个shell，例如cmd.exe或者/bin/sh，然后在shell中调用作为参数的命令。

##### 代码2.31　Node V0.10.0源码/lib/child_process.js

![image-20210426204242548](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426204242548.png)

通常execFile的效率要高于exec，这是因为execFile没有启动一个shell，而是直接调用spawn来实现的。

### 2.10.6　进程间通信

前面介绍的几个用于创建进程的方法，都是属于child_process的类方法，此外childProcess类继承了EventEmitter，在childProcess中引入事件给进程间通信带来很大的便利。

childProcess中定义了如下事件。

![image-20210426204415727](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426204415727.png)

Event: 'error'事件无法保证一定会被触发，因为可能会遇到一些极端情况，例如服务器断电等。

上面也提到，childProcess模块定义了send方法，用于进程间通信，该方法的声明如下：

![image-20210426204456811](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426204456811.png)

通过send方法发送的消息，可以通过监听message事件来获取。

#### 代码2.32　父进程向子进程发送消息

![image-20210426204523693](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426204523693.png)

#### 代码2.33　子进程接收父进程消息

![image-20210426204607171](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426204607171.png)

send方法的第一个参数类型通常为一个json对象或者原始类型，第二个参数是一个句柄，该句柄可以是一个net.Socket或者net.Server对象。下面是一个例子：

#### 代码2.34　父进程发送一个Socket对象

![image-20210426204649749](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426204649749.png)

#### 代码2.35　子进程接收socket对象

![image-20210426205220489](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426205220489.png)

### 2.10.7　Cluster

前面已经介绍了child process的使用，child_process的一个重要使用场景是创建多进程服务来保证服务稳定运行。

为了统一Node创建多进程服务的方式，Node在0.6之后的版本中增加了Cluster模块，**Cluster可以看作是做了封装的child_Process模块。**

Cluster模块的一个显著优点是可以共享同一个socket连接，这代表可以使用Cluster模块实现简单的负载均衡。

#### 代码2.36　Cluster的简单例子

![image-20210426211149349](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426211149349.png)

上面是使用Cluster模块的一个简单的例子，为了充分利用多核CPU，先调用OS模块的cpus()方法来获得CPU的核心数，假设主机装有两个CPU，每个CPU有4个核，那么总核数就是8。

在上面的代码中，Cluster模块调用fork方法来创建子进程，该方法和child_process中的fork是同一个方法。

Cluster模块采用的是经典的主从模型，由master进程来管理所有的子进程，可以使用cluster.isMaster属性判断当前进程是master还是worker，其中主进程不负责具体的任务处理，其主要工作是负责调度和管理，上面的代码中，所有的子进程都监听8000端口。

通常情况下，如果多个Node进程监听同一个端口时会出现Error: listenEADDRINUS的错误，而Cluster模块能够让多个子进程监听同一个端口的原因是master进程内部启动了一个TCP服务器，而真正监听端口的只有这个服务器，当来自前端的请求触发服务器的connection事件后，master会将对应的socket句柄发送给子进程。

## 2.11　Process对象

Process是一个全局对象，无须声明即可访问，每个Node进程都有独立的process对象。该对象中存储了当前进程的环境变量，也定义了一些事件。下面是一些例子：

![image-20210426211458322](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426211458322.png)

### 2.11.1　环境变量

直接在Node repl环境中执行：

![image-20210426211604425](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426211604425.png)

会得到一大串和当前进程相关的环境变量或者全局变量，你可以在其中查看你当前使用的Node版本号等一些信息。

输出结果：

![image-20210426211624951](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426211624951.png)

例如开发者可以在代码中判断当前正在运行的Node属于哪个版本，并根据结果来决定是否运行含有一些最新特性的代码：

![image-20210426211706655](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426211706655.png)

### 2.11.2　方法和事件

![image-20210426211740116](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426211740116.png)

Message、disconnect我们已经介绍过了，unhandledRejection和uncaughtException通常用做错误处理的最后一层保险，下面代码可以保证进程不会因为出错而退出：

![image-20210426211855525](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426211855525.png)

但不代表开发者可以省略具体错误处理的代码，我们会在第8章中详细介绍。

**beforeExit比较有意思，它仅仅会在进程准备退出时触发，准备退出是指目前的事件循环没有要执行的任务了，如果我们手动捕获这一事件并在回调中增加一些额外动作，进程就不会退出。**

![image-20210426212046259](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426212046259.png)

**而exit事件不同，当进程触发exit事件后，无论如何都会退出。**

![image-20210426212130526](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426212130526.png)

### 2.11.3　一个例子：修改所在的时区

假设开发者要向某台服务器提交数据，但没有和该服务器处在同一个时区内（在国内通常采用标准北京时间，所以不是很常见），这就导致开发者的时间和服务器的时间可能会相差几个小时，有的服务器会拒绝这样的请求。JavaScript获得当前的时间通常使用Date对象来实现，在stackoverflow上搜索相关的问题可以找到类似如下的代码。

#### 代码2.37　旧版本Node中设置时区的方法

![image-20210426212300424](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426212300424.png)

上面的一段代码将当前的时区置于零时区，试着在本地运行，输出的结果为：

![image-20210426212327414](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426212327414.png)

上面的这段代码已经有些年头了，在早期版本的Node中这样的设置确实有效，笔者初次看到这段代码时还在使用V0.12版本。经过测试，上面的代码在v5.3.0中还可以正常发挥作用，但在比较新的版本，例如6.9.4及以上的版本中，即使TZ设置成Asia/Shanghai，返回的也始终是伦敦时间。

在旧的版本中，打印一个date对象返回的是当前时区的时间，但在新版本中直接返回的就是世界时，即greenwich时间，相比东八区要早8个小时，格式也不再是GMT格式，这代表就算要获取当前时间都要做一下额外转换。

通常可以使用Date对象提供的全局方法来进行转换。

![image-20210426212428446](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426212428446.png)

此外date对象还有一个名为getTimezoneOffset的方法可用，用这个方法可以得到当前的时区。

![image-20210426212505600](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426212505600.png)

在上面的代码中，虽然直接打印date对象显示的是greenwich时间，但执行getTimezoneOffset()方法返回的却是-480，表示偏移的分钟数。这代表Node其实知道我们位于哪个时区，但返回的都是Greenwich时间。

对于修改时区的问题，我们可以使用Date提供的API来进行修改，但如果不想修改之前使用TZ这一环境变量留下的代码，完全可以自己实现相关的配置。

#### 实现timezone的修改

经过试验，虽然设置process.env.TZ的方法不能用了，但我们完全可以自己实现一套可用代码出来。

为此，我们首先在Date对象的prototype上声明一个map结构作为属性，用于存储时区名称和偏移量的关系，然后对Date类的Date方法进行修改，如果没有声明process.env.TZ变量，就默认返回原来的date对象；如果声明了该属性，就先到对应的数组中进行搜索，然后返回修改后的date对象。

##### 代码2.38　自己实现的修改时区的方法

![image-20210426212632013](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426212632013.png)

开发者可能会担心d.getHours()+item[1]这句代码会出现大于24的情况，所幸setHours方法已经内置了对这种情况的处理，如果小时的范围小于0或者大于24，会对日期进行相应的加减。

## 2.12　Timer

定时器相关的API在JavaScript中已经存在了很长时间，Node中的定时器都是全局方法，无须通过require来引入。

### 2.12.1　常用API

JavaScript中常用的timer方法有两个，分别是setTimeout和setInterval，在Node中，setTimeout和setInterval属于Timeout类，调用对应的方法后都会返回相应的对象。

除了这两个方法之外，Node还提出了新的setImmediate方法，该方法已经在第1章详细介绍过了，这里省略相关的内容。

#### 1．setTimeout

一个使用setTimeout方法最简单的例子是延迟一个函数的执行时间，下面的例子中，将会在1秒后打印出Hello。

![image-20210426212819799](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426212819799.png)

如果想要在回调执行前清除定时器，可以使用clearTimeout方法：

![image-20210426212839440](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426212839440.png)

#### 2．setInterval

如果想要以一个固定的时间间隔运行回调函数，可以使用setInterval方法，使用方式和setTimeout相同，对上面的代码进行修改：

![image-20210426212914421](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426212914421.png)

运行后会以1秒为间隔输出Hello，同样的，可以用clearInterval方法来清除定时器：

![image-20210426212931798](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426212931798.png)

#### 3．回调函数的参数

在前面定义的定时器中，第一个参数是回调方法，第二个参数是定时器的超时时间，其后面还可以定义更多的参数，多余的参数会被作为回调函数的参数。

![image-20210426213046156](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426213046156.png)

### 2.12.2　定时器中的this

在JavaScript中，setTimeout和setInterval中的this均指向Windows。原因也很简单，定时器方法的第一个参数是一个匿名函数，而JavaScript中所有匿名函数的this都指向Windows。

#### 代码2.39　前端JavaScript定时器中的this

![image-20210426213224477](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426213224477.png)

在Node中，setTimeout和setInterval的this会指向timeout类，前面也曾提到，该类在setTimeout和setInterval内部创建并返回，开发者通常不会直接用到两个类，但是可以将其打印出来。

#### 代码2.40　Node定时器中的this

![image-20210426213328012](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426213328012.png)

如果在setTimeout方法内部涉及了this的指向问题，通常会使用bind或者call方法来重新绑定this，我们在第3章还会讨论这个问题。

![image-20210426213343170](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426213343170.png)

## 2.13　小结

在本章我们主要介绍了Node的常用模块与使用方法，如果之前没有Node的经验，那么和第一章比起来，本章才是真正的入门章节。关注的重点是模块如何使用，内容比较浅显。

**最为常用的模块是FS和HTTP，Stream和Event通常作为“背后的女人”默默地发挥作用。尽管可以随时参考文档，但还是希望读者能对常用的API熟记于心。**

## 2.14　引用资源

http://www.commonjs.org/ commonjs

https://github.com/amdjs/amdjs-apihttps://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

https://en.wikipedia.org/wiki/Secure_Sockets_Layer

https://tools.ietf.org/html/rfc6455

# 第3章　用ES6来书写Node

## 3.1　新时代的EMCAScript

JavaScript是EMCAScript标准的一种实现，事实上，是JavaScript发明在先，随后被作为EMCA的一种标准确定下来，称为ECMAScript（简称ES）。

在ES2015推出之前，JavaScript的发展分化出了两股趋势（现在也未停止），第一种是不断开发出新的框架或者类库来适应大型应用开发，例如backbone，angular和react；另一种就是直接在语言层面下手，例如coffeescript和TypeScript。

2015年，ES6（ES2015）正式发布，并且计划每年发布一个新版本，均以ES201X来命名。这是一个重大的版本更新，它从社区中吸收了不少经验和意见，ES2015的一个目标就是让JavaScript在语言层面有支撑大型应用的能力。

本章及之后的内容中出现的ES6均指代ES2015，至于更新的标准，我们直接使用ES2016或者ES2017来称呼。

本章的标题虽然是使用ES6来书写Node，但也会包含一些ES2016或者ES2017的内容。此外关于Promise、Generator、async函数的内容，将会在异步流程控制一章中进行描述，为了避免重复，本章不会覆盖这几部分的内容。

### 3.1.1　JavaScript的缺陷

JavaScript长期以来都被视为一种玩具语言不是没有原因的，它在被发明的时候就没有被寄予厚望——仅仅在浏览器中做一些简单操作的脚本语言，连发明者Brendan Eich本人都不喜欢它。

在Web发展的初级阶段，JavaScript主要做一些dom操作，然后又出现了jQuery、Underscore等一系列类库对其做了扩展（你也可以认为是语法糖）。

Ajax出现后，开发者们意识到可以用JavaScript做更多的事情，随后出现了更多复杂的Web应用，JavaScript渐渐地被重视起来。

但这并不能掩盖其先天不足，随便找个人出来跟他谈JavaScript（ES5）的语法缺陷，都能滔滔不绝地跟你讲上半天，下面列出了一些可能出现的内容：

- 几乎无法支持模块化。
- 没有很好的面向对象支持。
- 没有局部作用域。
- 各种让人“惊喜”的语法细节，例如0.1+0.2或者[] == []等。

在十年前，这些看起来都不成问题，因为人们没有期待JavaScript能做到这些，就像你从来不期望shell脚本能够实现面向对象编程那样，但随着Web应用变得复杂化，这些问题显得越来越突兀。

这些问题还没有经过广泛的讨论和改进就被定义成了标准（也有当时时代的原因），倒逼着后来的Node也要跟着实现同样的“缺陷”。不过ES2015落地之后，这种情况已经大有改善。

### 3.1.2　Node对新标准的支持

Node.js在6.0版本及之后实现了对ES6的全面支持，如果你想使用ES6乃至更新的特性，建议直接将Node版本更新至最新版本，笔者目前常用的版本是v7.6.0。

如果想知道当前使用的Node版本支持哪些新特性，可以参考http://node.green/，这个网站对每个阶段性的Node版本具体支持哪些ES201X的新特性做了详细的列表，如图3-1所示。

![image-20210426220119456](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426220119456.png)

本章将会对ES6的特性进行介绍，重点覆盖了函数、类的部分，关于没有涉及的其他特性，读者可以参照官方文档。如果不希望看冗长的ECMA标准文档，可以试试下面这些在线资料：

https://babeljs.io/learn-es2015/，GitHub上维护的一个ES2015入门文档。

http://es6.ruanyifeng.com/，如果想看中文，那么这本书是最佳推荐。

http://exploringjs.com/，有很详细的关于ES2016/2017的内容介绍。

### 3.1.3　使用nvm管理Node版本

nvm是目前流行的Node版本管理工具，可以在当前的系统中安装多个不同版本的Node，并且可以自由切换，nvm同样可以使用npm进行安装。

具体的安装步骤请参照https://github.com/creationix/nvm。值得注意的是，nvm并没有官方的Windows版本，请使用别的工具来代替。

nvm常用命令如下。

- nvm install <version>：安装某个版本的Node。
- nvm use <version>：切换到某个版本的Node。
- nvm ls：列出当前安装的所有Node版本，并且显示当前使用的Node版本。

笔者系统的版本状态如图3-2所示。

![image-20210426220305096](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426220305096.png)

## 3.5　Set和Map

### 3.5.1　Set和WeakSet

ES6提出了两种新的数据结构，Set和Map，Set的实现类似于数组，和普通数组的不同之处在于Set中不能包含重复数据，例如：

#### 代码3.7　Set的使用

![image-20210426220421699](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426220421699.png)

#### 1．Set的遍历

除了使用for循环遍历外，Set本身也提供几种方法来进行遍历其中的元素。

##### 代码3.8　Set的遍历

![image-20210426220523065](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426220523065.png)

在这三种方法中，只有entries方法返回的类型为键值对。

#### 2．WeakSet

WeakSet和Set的主要区别在于WeakSet的成员只能是对象，我们可以试着将一些基本类型的值加入到WeakSet中：

![image-20210426220630342](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426220630342.png)

**此外，WeakSet中的“weak”一词指的是弱引用的意思，它表示WeakSet中存储的是对象的弱引用，这是一个垃圾回收中的概念，在垃圾回收器的扫描过程中，一旦发现了只有弱引用的对象，就会在回收阶段将其内存回收。**

这也就表示WeakSet中存储的对象如果没有被其他的对象所引用，其内存空间就会被回收。由于开发者通常无法控制垃圾回收器的运行，因此WeakSet中的值是无法预测的。 WeakSet不支持遍历，也不能用size属性来得到其大小。

WeakSet的优点在于对垃圾回收有利，假设在一个局部作用域中产生了一个中间值的对象，如果作用域之外没有引用这个对象，那么就可以使用WeakSet来存储它，在离开局部作用域之后，该对象就会在下一轮垃圾回收时被销毁。

### 3.5.2　Map和WeakMap

#### 1．Map

Map表示由键值对组成的有序集合，有序表现在Map的遍历顺序即为插入顺序，在ES5中，虽然也有类似的结构，但ES5中键值对的键值只能为字符串类型，ES6新增的Map则支持多种类型作为键值，包括对象和布尔值。

和Set相似，Map提供了一系列方法来访问或操作其中的数据。

![image-20210426220839654](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426220839654.png)

#### 2．WeakMap

WeakMap的用法和WeakSet相似，作为key的变量必须是个对象，关于弱引用的特性和WeakSet相同，这里不再叙述。

## 3.6　Iterator

### 3.6.1　Java中的Iterator

如果读者有Java基础，那么一定会了解Java中的各种数据结构，Map、List、HashMap、ArrayList等，笔者在初学Java时就被这些概念搞得晕头转向。在下面的内容里我们统一用集合来指代上面的数据结构。关于这些数据结构一个重要的概念就是如何进行遍历。

在Java中，一种便利的方法就是使用Iterator接口。

例如我们想要遍历一个Map，那么就会写出下面的代码：

![image-20210426221056414](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426221056414.png)

上面的代码定义了一个Iterator，使用hasNext来判断是否到了集合的末尾，并且用next方法来取出下一个元素。

### 3.6.2　ES6中的Iterator

ES6中的 Iterator 接口通过 Symbol.iterator 属性来实现，如果一个对象设置了Symbol.iterator属性，就表示该对象是可以被遍历的，我们就可以用next方法来遍历它。

#### 代码3.9　给对象加上Iterator接口

![image-20210426221157455](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426221157455.png)

在上面的代码中，我们给Iter对象加上了[Symbol.iterator]接口，这个方法的特点是每次调用 next 方法，返回值就会增加1，由于我们没有设置边界条件，就算一直调用next也不会出错。

**在ES6中Iterator广泛存在于各种数据结构中，array、Map、Set，以及字符串，都实现了该接口。**

![image-20210426221256695](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426221256695.png)

### 3.6.3　Iterator的遍历

在ES6中，所有内部实现了Symbol.iterator接口的对象都可以使用for/of循环进行遍历，在数组一节，我们在最后提到了entries、keys和values三个方法，这三个方法都会返回一个iterator对象，因此我们可以使用for of循环来进行遍历。

代码3.9 中我们自定义了一个 Iter 对象，它虽然可以可以使用next方法来获得下一个元素，但没办法使用for/of遍历，下面我们实现一个更加复杂一些的例子：

![image-20210426221506169](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426221506169.png)

我们定义了一个方法myIter，该方法接收一个数组作为参数，然后在它的原型方法上部署了Symbol.iterator，这样我们就可以用for/of来遍历myIter的实例。

![image-20210426221627160](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426221627160.png)

## 3.7　对象

### 3.7.1　新的方法

#### 1．object.assign()

该方法将一个对象的属性复制到另一个对象上，很多开发者看到这个方法第一时间想到的就是确认该方法是深复制或者是浅复制，我们可以写段测试代码来测试一下。

![image-20210426221830562](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426221830562.png)

**很明显，该方法实现的是一种浅拷贝。**

#### 2. object.setPrototypeOf()

Object.setPrototypeOf方法用来设置一个对象的prototype对象，返回参数对象本身，它的作用和直接设置__proto__属性相同。

在ES6之前，__proto__属性只是一种事实的标准，不是ECMAScript标准中的内容，ES6将__proto__写入了附录中，但仍然不推荐直接使用该属性。

#### 3．Object.getPrototypeOf()

**该方法与Object.setPrototypeOf方法配套，用于获得一个对象的原型对象。**

下面是一个例子，我们首先定义两个方法，Person和Student，并且将Stuent的prototype设置为Person。

##### 代码3.10　getPrototypeOf方法

![image-20210426222203185](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426222203185.png)

### 3.7.2　对象的遍历

在ES5中，遍历对象的方式有如下几种，我们以一个简单的对象为例来辅助说明。

![image-20210426222327640](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426222327640.png)

#### （1）使用for/in遍历

![image-20210426222352327](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426222352327.png)

#### （2）使用Object.keys()遍历

该方法会返回包含所有键值的数组，不包含不可枚举的属性。

![image-20210426222424952](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426222424952.png)

#### （3）使用Object.getOwnPropertyNames()遍历

该方法的作用和Object.keys相同，区别是返回全部的属性，无论是否可枚举。

#### 1．枚举属性

**在ES5中，可以将一个对象的属性设置为不可枚举的，不可枚举的属性可以正常地通过a.b的形式访问，但无法通过for/in循环和Object.keys方法遍历到。**以上面的代码为例，可以通过Object.defineProperty来设置一个属性是否可以被枚举

![image-20210426222616326](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210426222616326.png)

将sex的enumerable属性设置为false后，只有getOwnPropertyNames可以遍历到该属性。

#### 2．ES6中的遍历方法

ES6在此基础上增加了Object.getOwnPropertySymbols()和Reflect.ownKeys()两个方法，它们都接受一个对象作为参数，前者会返回参数对象的全部Symbol属性，后者会返回全部属性。

**注意：Symbol属性也是ES2015规范的一部分，这里不再讲述，读者可以认为Symbol属性是一种不会和其他属性重名的属性。**

## 3.8　类（讲的挺好）

——Java的类没有缺陷，如果有，就新增一种设计模式。

Class这一特性的引入，标志着在ECMAScript语言层面提供了对“经典类”的原生支持。提到“经典类”，我们脑海里通常会联想到Java中的类。如果读者之前有过Java或C++的编程经验，比起使用prototype实现的类，会更容易接受一些。

对ES6来说，这种支持更多地是在语法层面上，其底层的实现并未发生变化。

至于JavaScript为什么一定要像Java那样声明一个类，这个就见仁见智了。支持者认为这种写法更“友好”，更接近于传统语言的写法，可以减少程序员的学习成本。

反对者则认为这样的语法糖毫无意义，JavaScript和Java类底层的实现本来就不同，强行统一写法只怕会造成更深的误解。

**我们先来看看在ES5时期JavasScript对class这一概念的实现**。

在JavaScript中，类的所有实例对象都从同一个原型对象上继承属性。

### 3.8.0　ES5定义类（重点）

![image-20210427193922480](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427193922480.png)

**ES6提供了更接近传统语言的class定义，这种新特性更多地是语法糖，在ES6中定义的类可以转换为等价ES5代码。**

**总而言之，ES6 类的本质就是这种方式定义出来的，不过是提供了语法糖**

### 代码3.11　ES6中定义一个类

![image-20210427194008298](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427194008298.png)

### 3.8.1　属性和构造函数

Class中的属性定义在constructor函数（构造函数）中。构造函数负责类的初始化，包括初始化属性和调用其他类方法等，构造函数同样支持默认值参数。

如果声明一个类的时候没有声明构造函数，那么会默认添加一个空的构造函数。

构造函数只有在使用关键字new实例化一个对象的时候才会被调用。

![image-20210427194104849](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427194104849.png)

### 3.8.2　类方法

类方法的定义无须使用function关键字，方法内部使用this来访问类属性，方法之间也不需要逗号间隔。

![image-20210427194134840](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427194134840.png)

类方法也可以作为属性定义在构造函数中，这时的写法略有不同。

![image-20210427194239435](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427194239435.png)

### 3.8.3　__proto__

在ES5中，类的实例通过__proto__属性来指向构造函数的prototype对象。以上面的Student类为例：

![image-20210427194316257](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427194316257.png)

__proto__**属性本身不是ECMAScript规范的内容，只是各大浏览器都对该属性进行了支持，才成为了事实上的标准，既然该属性指向类的prototype属性，那么表示我们可以用该属性来修改prototype，但这也代表任何一个类的实例都可以修改原型对象，在实际开发中应该禁用这种做法。**

![image-20210427194416841](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427194416841.png)

**即使开发者完全不关注proto这个属性，也不会对开发工作带来消极的影响，ES6也建议在实际开发过程中认为这个属性不存在。**

**在上一节的代码中，getInfo方法和constructor方法虽然看似是定义在类的内部，但实际上还是定义在prototype上，这也从侧面证明了ES6对class的实现依旧基于prototype。**

我们可以使用代码来证实这一点：

![image-20210427194547645](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427194547645.png)

对象的__proto__属性指向类的原型，这点对ES5和ES6均适用。

![image-20210427194607193](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427194607193.png)

类名本质上就是构造函数，ES6的写法仅仅是做了一层包装：

![image-20210427194628373](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427194628373.png)

### 3.8.4　静态方法（易忘）

在定义类时如果定义了方法，那么该类的每个实例在初始化时都会有一份该方法的备份。有时我们不希望一些方法被继承，而是希望作为父类的属性来使用，例如常用的Math类，它有一些直接通过类名来调用的方法，即静态方法。

**ES6中使用static关键字来声明一个静态方法，该方法只能通过类名来直接调用，而不能通过类的实例调用。**

![image-20210427195042531](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427195042531.png)

**如果一个类继承了一个包含静态方法的类，那么它可以通过super关键字来调用父类的静态方法，同样的，包含super关键字的子类方法也必须是静态方法，例如：**

![image-20210427195115562](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427195115562.png)

## 3.9　类的继承

### 3.9.1　ES5中的继承（易忘）

在ES5中，类的继承可以有多种方式，然而过多的选择有时反而会成为障碍，ES6统一了类继承的写法，避免开发者在不同写法的细节之中过多纠缠，但在介绍新方法之前，还是有必要先回顾下ES5中类的继承方式。

首先假设我们有一个父类Person，并且在类的内部和原型链上各定义了一个方法：

#### 代码3.12　用于继承的基类Person

![image-20210427195559805](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427195559805.png)

#### 1．修改原型链

这是最普遍的继承做法，通过将子类的prototype指向父类的实例来实现：

![image-20210427195751865](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427195751865.png)

在这种继承方式中，stud对象既是子类的实例，也是父类的实例。然而也有**缺点**，在子类的构造函数中无法通过传递参数对父类继承的属性值进行修改，只能通过修改prototype的方式进行修改。

#### 2．调用父类的构造函数

##### 代码3.14　通过调用父类构造函数的继承

![image-20210427195947299](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427195947299.png)

这种方式避免了原型链继承的缺点，直接在子类中调用父类的构造函数，在这种情况下，stud对象只是子类的实例，不是父类的实例，而且只能调用父类实例中定义的方法，不能调用父类原型上定义的方法。

#### 3．组合继承（重点）

这种继承方式是前面两种继承方式的结合体。

##### 代码3.15　组合继承

![image-20210427200226875](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427200226875.png)

**这种方式结合上面两种继承方式的优点，也是Node源码中标准的继承方式。**

**唯一的问题是**调用了父类的构造函数两次，分别是在设置子类的prototype和实例化子类新对象时调用的，这造成了一定的内存浪费。

### 3.9.2　ES6中的继承（知识点多）

在ES6中可以直接使用extends关键字来实现继承，形式上更加简洁。我们前面也提到了，ES6对Class的改进就是为了避免开发者过多地在语法细节中纠缠。

我们设计一个student类来继承代码3.15定义的person类。

#### 代码3.16　继承Person类

![image-20210427200856922](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427200856922.png)

在代码3.16中我们定义了Student类，在它的构造方法中调用了super方法，该方法调用了父类的构造函数，并将父类中的属性绑定到子类上。

super方法可以带参数，表示哪些父类的属性会被继承，在代码3.16中，子类使用super继承了Person类的name以及age属性，同时又声明了一个sex属性。

**在子类中，super方法是必须要调用的，原因在于子类本身没有自身的this对象，必须通过super方法拿到父类的this对象，可以在super函数调用前尝试打印子类的this，代码会出现未定义的错误。**（为什么？）

**如果子类没有定义constructor方法，那么在默认的构造方法内部自动调用super方法，并继承父类的全部属性。**

**除了用在子类的构造函数中，super还可以用在类方法中来引用父类的方法。**

![image-20210427201314959](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427201314959.png)

**值得注意的是，super只能调用父类方法，而不能调用父类的属性，因为方法是定义在原型链上的，属性则是定义在类的内部（就像代码3.15实例的组合继承那样，属性定义在类的内部）。**

![image-20210427201435434](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427201435434.png)

**此外，当子类的函数被调用时，使用的均为子类的this（修改父类的this得来），即使使用super来调用父类的方法，使用的仍然是子类的this。**

![image-20210427201535229](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427201535229.png)

在上面的例子中，super调用了父类的方法，输出的内容却是子类的属性，说明super绑定了子类的this。

**同样的，我们还可以对super的属性赋值，例如super.name =“Thea”，这个赋值修改的是子类的属性，如果尝试打印super.name，还是会输出undefined。**（属性是定义在类的内部不能通过this获取，而方法是定义在原型链上的）

### 3.9.3　Node中的类继承

在Node的源码中同样大量使用了继承，我们可以观察在源码中对继承的实现，从而找到最优的继承方式。即使extends已经是官方推荐的继承方方式，但在底层实现中依然保留了之前的做法。

#### Node 官方推荐形式

例如下面的代码就是源码中fs模块继承events模块的实现。

![image-20210427201955578](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427201955578.png)

上面这种形式是Node官方推荐的继承方式，可见使用了util.inherits方法，我们到源码中查找对应的实现。

![image-20210427202113841](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427202113841.png)

抛开错误处理，可以发现inherits方法其实是通过调用setPrototypeOf来实现继承的。

在ES5中，还有一个方法被经常用在类的继承中，那就是Object.create方法，事实上在Node比较老的版本，例如v0.10中，inherits内部是通过调用该方法实现的。

![image-20210427203120697](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427203120697.png)

## 3.10　ES6的模块化标准

## 3.11　使用babel来转换代码

## 3.12　小结

本章我们主要介绍了ES2015中定义的一些新的规范和特性，这些新特性大都是原有写法的一些语法糖。

ES2015比较重要的更新有两个，一个是对类与继承的改进，长久以来JavaScript缺少一种统一的编写类以及类继承的方式，这毫无疑问地浪费了开发者的时间，ES2015的改进有利于让开发者从语法细节中摆脱出来（就像我一点都不想知道子类调用了几次父类的构造函数）。

另一个比较重要的更新是Promise（对Node来说或许是最重要的），我们会在下一章介绍。

## 3.13　引用资源

```
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/it eratorhttp://es6.ruanyifeng.com/
https://github.com/hanzichi/underscore-analysis/issues/14https://github.com/jashkenas/underscore/blob/master/underscore.js
http://kangax.github.io/compat-table/es6/https://bugzilla.mozilla.org/show_bug.cgi?id=1299593
```

# 第4章　书写异步代码

## 4.0　概述

如何用最简洁的方式组织异步代码？这个问题曾经困扰了社区很长时间，甚至被认为是Node的最大弊端，不过问题现在已经基本得到解决。

### 嵌套回调

我们已经很熟悉回调函数的写法了，下面我们将读取文件的readFile方法封装成一个单独的read方法，它接受一个path参数。

#### 代码4.1　封装了readFile的read方法

![image-20210427203837769](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427203837769.png)

如果我们需要调用read方法来读取多个文件，则无法保证哪个先完成。

![image-20210427203852916](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427203852916.png)

但有时需要依赖上一个异步操作的结果，假设foo.txt是一个配置文件，里面有一个用来解密的key，我们需要拿到里面的内容才能解密bar.txt里面的文本，那么这个时候我们就不能像上面那样使用read方法了。

一般我们会写成下面这种方式（暂且不考虑readFileSync）。

#### 代码4.2　嵌套的回调函数

![image-20210427204029222](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427204029222.png)

将下一个异步操作放到上一个异步操作的回调方法中，这样虽然能保证执行是串行的，但当代码嵌套的层数增加，代码的层次结构就会变得不清晰并且难以维护。

**回调地狱（callback hell）**这个词就被用来描述这种写法。它本身没有任何问题，只是因为不利于开发者阅读和维护才会遭到摒弃。

本章会重点讲述Node社区是如何一步步（经过好几年的摸索和实践）地解决这个问题的。

为了便于说明，我们先来假设一种应用场景，即有三个文件需要顺序地进行读取，以后的内容都围绕这个场景展开。

## 4.1　异步操作的返回值

假设一个方法封装了一个异步操作，那么我们如何能拿到返回值呢？

在代码4.1中，如果我们能通过最简单的函数调用拿到read方法中异步操作的返回值就好了，就像下面这样：

**代码4.3　美好的愿望——直接拿到异步方法的返回值**

![image-20210427204339920](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427204339920.png)

**然而直接像代码4.3这样调用read方法不会得到任何返回值，data打印出来也是undefined。原因是read方法会先于内部的回调函数返回，即回调函数内部的return关键字不会将值返回到外部。**

让人沮丧的是我们基本上没法用通常的办法得到一个异步调用的返回值，如果代码下一步的操作依赖于data的值，只能将下一步的逻辑放到回调函数的内部，就像代码4.2那样。

但社区的开发者们明显不会放弃，他们仍然向着代码4.3的方向努力，在介绍最后的解决方案之前，我们先说点别的。

## 4.2　组织回调方法

### 4.2.1　回调与CPS（了解即可）

当开发者刚开始接触回调时，通常都会写成下面的样式：

![image-20210427204523908](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427204523908.png)

如果对于多个功能相同的异步操作，它们的回调函数都是相同的，这样的写法会产生很多功能重复的代码。

另一种做法是将回调函数作为参数传递，这种书写方式通常被称为**ContinuationPassing Style（CPS）**，它的本质仍然是一个高阶函数。

**代码4.4　CPS风格的回调**

![image-20210427204659465](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427204659465.png)

如果需要调用readFile方法多次，并且它们的回调方法都相同的情况下，CPS可以省去一些重复代码。

关于CPS的应用，比较常见的是各大语言对于排序这一方法的实现，假设a是一个长度为1000的数组，下面的代码调用qsort函数进行排序：

![image-20210427204750204](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427204750204.png)

用户可以自定义comp函数来决定升序或者是降序，下面是一个升序的例子（使用C语言实现）：

![image-20210427204822355](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427204822355.png)

CPS可以在一定程度上解决回调嵌套的问题。

**代码4.5　使用CPS来处理多个回调**

![image-20210427204911141](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427204911141.png)

上面的代码是代码4.2嵌套回调的另一种写法，其本质上仍然是在回调中调用下一个异步方法，只是避免了多个回调函数在形式上嵌套在一起。虽然比嵌套调用看起来美观了一些，但仍然显得冗长，而且业务逻辑分散在不同的callback中，初次接触代码的开发者也不容易理清它们之间的关系。

### 4.2.2　使用async模块简化回调

async（**为了区别下面内容的async/await方法，用async模块表示第三方模块，async方法表示ES2017的新特性**）是一个著名的第三方模块，它的初衷也是为了解决多个异步调用嵌套的问题。根据业务场景提供了一系列常用的方法，例如series、map、parallel等，下面是一些实际的例子。

#### 1．async.series

**代码4.6　使用series方法处理多个回调**

![image-20210427205116369](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427205116369.png)

series方法接收一个数组和一个回调函数，回调函数的第二个参数是一个数组，包含了全部异步操作的返回结果，结果集中的顺序和series参数数组的顺序是对应的。

该方法实际上是嵌套回调的语法糖，所有的异步调用都是顺序执行的，即执行完一个操作再进行下一个操作。以代码4.6为例，最后的打印结果为[ 'foo.txt', 'bar.txt','baz.txt' ]。

#### 2．async.parallel

调用方式和参数都与series相同，也会顺序返回所有的调用结果，区别在于所有的方法是并行执行，执行时间由耗时最长的调用决定。

parallel方法在数组中的某个异步调用结束之后并没有立刻返回，而是将结果暂存起来，等所有的异步操作完成之后，再根据调用顺序将结果组装成顺序的结果集返回。

#### 3．async.waterfall

同样是顺序执行异步操作，和前两个方法的区别是每一个异步操作都会把结果传递给下一个调用。

**代码4.7　使用waterfall处理多个回调**

![image-20210427212653448](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427212653448.png)

#### 4．async.map

map和上面的几个方法稍有不同，map接收一个数组作为参数，数组的元素不是方法名而是方法的参数，数组里的值会依次传递给定义的异步方法。

map的第二个参数就是异步的方法，不需要再做额外封装。

![image-20210427212845950](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427212845950.png)

然而map方法有一个缺点，就是它只能接受三个参数，分别是一个数组、对应的异步方法和回调函数。以readFile为例，我们会发现没有多余的参数来定义编码格式，这种情况下还是需要对readFile做一层封装。

![image-20210427212918198](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427212918198.png)

async模块一度是管理异步调用的首选，然而它并不适用所有的场合。

从上面的介绍中我们可以看出，async通常使用一个数组来包含所有的异步方法或者调用的参数，然而有时我们无法在调用前就决定哪些异步方法会被调用。例如使用上一个异步过程的结果来决定下一个调用的异步方法，这时候使用async模块就不是特别方便。

## 4.3　使用Promise

在Node中率先得到广泛应用的是async这样的第三方模块，它可以将多个回调函数组合在一起，async模块中没有应用什么新概念，只是做了形式上的简化。

社区自然不会满足止步于此，开发者们把目光投向了别处，希望有一种新的方式来解决问题，在这种环境下，Promise进入视野似乎是自然而然的事情。

### 4.3.1　Promise的历史（对了解Pm很有帮助）

Promise的概念最早可以追溯到1976年，future、promise、delay、deferred这几个词经常放在一块讨论，它们都用来指代一个开始时状态未知的对象，读者可以自行搜索相关文献，这里不再介绍。

jQuery在1.5及之后的版本（2011年1月及以后）中增加了deferred方法，该方法是Promise的一种实现，并且随着jQuery本身流行起来，以一个Ajax操作为例，传统的写法是这样的。

**代码4.8　普通的Ajax操作**

![image-20210427213216645](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427213216645.png)

success和fail方法都是作为参数的一部分传递给$.ajax()方法，它们是Ajax执行完成后的回调函数。

使用deferred改写Ajax底层实现之后，代码4.8变成了下面这种样子。

**代码4.9　使用deferred来书写Ajax**

![image-20210427213259468](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427213259468.png)

代码4.9和代码4.8在结构上最大的区别是使用deferred改写的Ajax方法，将success和error两个回调函数从$.ajax()方法中剥离，而且链式调用也表明了$.ajax("test.html")这个异步方法产生了返回值，这是一个很大的进步。

使用了Promise之后，我们可以从封装的异步方法里拿到一个返回值，虽然它并不是最终的结果，但比起不产生任何返回值的代码4.1，我们终于开始向代码4.3的目标迈进了。

后面Promise概念得到推广并出现了一些规范，以Promise/A+最为出名，社区也出现了一些支持Promise的第三方库，例如q.js和bluebird，它们都实现了Promise/A+标准，开发者开始用Promise来书写异步。

后来Promise/A+标准被社区接受，ES2015中的Promise就是按照它来实现的。

### 4.3.2　Promise是什么

![image-20210427213557100](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427213557100.png)

Promise表示一个异步操作的最终结果。

**直译过来的结果不太容易理解，可以将Promise理解为一个状态机，它存在下面三种不同的状态，并在某一时刻只能有一种状态。**

- Pending：表示还在执行。
- Fulfilled（或者resolved）：执行成功。
- Rejected：执行失败。

一个Promise是对一个操作（通常是一个异步操作）的封装，异步操作有等待完成、成功、失败三种可能结果，对应了Promise的三种状态。

**Promise的状态只能由Pending转换为Resolved或者由Pending转换为Rejected，一旦状态转换完成就无法再改变。**

假设我们用Promise封了一个异步操作，那么当它被创建的时候就处于Pending状态，当异步操作成功完成时，我们将状态转换为Fulfilled；如果执行中出现错误，将状态转换为Rejected（如果开发者希望，也可以将这两者对调过来，但通常没什么意义）。

### 4.3.3　ES2015中的Promise（重要）

Promise和Class堪称ES2015的两个最重要的特性，在如何组织异步代码这个问题上，ES2015中的Generator或者ES2017的async方法，都是以Promise作为基础的，后面内容介绍的种种方案，也都是围绕Promise进行展开的。

#### 1．将异步方法封装成Promise

![image-20210427214022553](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427214022553.png)

以读取文件内容的fs.readFile为例，使用Promise封装后的方法如下所示：

**代码4.11　使用Promise封装的readFile**

![image-20210427214053040](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427214053040.png)

**将一个异步方法封装成Promise其实很简单，只要在回调函数中针对不同的返回结果调用resolve或者reject方法即可。**

**resolve和reject同样是两个函数，在代码4.11中，resolve函数会在异步操作成功完成时被调用，并将异步操作的返回值作为参数传递到外部。**

**reject则是在异步操作出现异常时被调用，会将错误信息作为参数传递出去。**

刚刚接触Promise概念的开发者可能会对这两个方法感到困惑，简单地说，一个封装了异步操作的Promise对象实际上并没有做任何事情，它仅仅针对回调函数的不同结果定义了不同的状态。

resolve方法和reject方法也没有做多余的操作，仅仅是把异步的结果传递出去而已，对于异步结果的处理，是交给then方法来完成的。

#### 2．使用then方法获取结果

在封装好Promise对象后，就可以调用then方法来获取异步操作的值了，一个then方法通常是如下这种形式：

![image-20210427214529017](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427214529017.png)

**then方法接收两个匿名函数作为参数，它们代表onResolved和onRejected函数。**

**value和error参数代表回调的结果，以readFile为例，value就是执行成功时文本内容，error则是执行出错时的错误信息，两者中必有一个不为空。**

通常来说，如果onRejected的回调方法被调用就表示异步过程中出现错误，这时可以使用catch方法而不是回调函数来处理异常。

![image-20210427214734853](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427214734853.png)

#### 3．then方法的返回值

then方法总是返回一个新的Promise对象，这也就表示对于一个Promise，可以多次调用它的then方法，但由于默认返回的Promise是一个空的对象，除非做一些额外的操作，否则这一操作通常得不到有意义的值。

以代码4.11为例，调用两次then方法的结果：

![image-20210427215001871](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427215001871.png)

开发者可以在回调函数定义一个新的Promise，然后使用return来返回。例如我们可以在readFile的onResolved回调函数中再次调用readFile_promise。

**代码4.12　在then方法中返回一个新的Promise**

![image-20210427215153055](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427215153055.png)

**在上面第一个then方法中，再次调用了read_ promise，其返回的新的Promise覆盖了默认返回的Promise，我们因此可以在下一个then方法中获取另一个异步操作的执行结果。**

如果将代码4.12第3行的return关键字去掉，第5行打印的value就为undefined。

#### 4．Promise的执行

虽然我们会通过then方法来获取Promise的结果，但Promise是当then方法调用之后才会执行吗？举个例子，下面的代码会如何输出？

**代码4.13　Promise的执行**

![image-20210427215350975](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427215350975.png)

实际运行下就会发现，程序立刻打印出begin，然后等待5秒，随后再打印出end。

**Promise从被创建的那一刻起就开始执行，then方法只是提供了访问Promise状态的接口，与Promise的执行无关。**

### 4.3.4　Promise的常用API

#### 1．Promise.resolve

Promise提供了resolve方法用来将一个非Promise对象转化为Promise对象。

**在通常情况下，主动调用resolve方法的场景并不多，因为该方法能转换的通常只有thenable对象和一些原始类型的对象。**

就像第3章提到的array-like object一样，thenable对象是指有then方法的对象，一个常见的例子就是jQuery中的deferred对象，或者你可以自己定义一个简单的对象，例如下面这样，然后再把它转换成一个Promise，转换后的Promise会自动执行其then方法。

![image-20210427215531879](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427215531879.png)

如果转换的对象是一个常量或者不具备状态的语句，转换后的对象自动处于resolve状态，转换的对象作为resolved的结果原封不动地保留。

![image-20210427215738771](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427215738771.png)

或许读者想着可以使用resolve来转换一个异步方法，例如readFile之类的，很遗憾resolve方法做不到这一点。例如下面的代码就不会起作用：

![image-20210427215833204](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427215833204.png)

要转换异步方法，要么手动封装一个Promise，要么就使用一些现成的方法或者模块来操作，例如util.promisify或者bluebird，我们会在后面介绍。

#### 2．promise.reject()

#### 3．promise.all

#### 4．promise.race

#### 5．promise.catch

### 4.3.5　使用Promise组织异步代码

## 4.4　Generator，一种过渡方案

### 4.4.0　概述

在使用Generator前，首先知道Generator是什么

Generator本质上是一个函数，**它最大的特点就是可以被中断，然后恢复执行。**

**通常来说，当开发者调用一个函数之后，这个函数的执行就脱离了开发者的控制，只有函数执行完毕之后，控制权才能重新回到调用者手中，因此程序员在编写方法代码时，唯一能够影响方法执行的只有预先定义的return关键字。**

Promise也是如此，我们也无法控制Promise的执行，新建一个Promise后，其状态自动转换为pending，同时开始执行，直到状态改变后我们才能进行下一步操作。

**而Generator函数不同，Generator函数可以由用户执行中断或者恢复执行的操作，Generator中断后可以转去执行别的操作，然后再回过头从中断的地方恢复执行。**

**这其实是一种协程的概念**，关于协程，读者可以阅读附录A以及附录B的内容。

### 4.4.1　Generator的使用

Generator函数和普通函数在外表上最大的区别有两个：

- 在function关键字和方法名中间有个星号（*）。
- 方法体中使用“yield”关键字。

**代码4.21　一个简单的Generator函数**

![image-20210427220614929](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427220614929.png)

和普通方法一样，Generator可以定义成多种形式：

![image-20210427220637618](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427220637618.png)

**Generator函数的状态**

Yield关键字用来定义函数执行的状态，在代码4.21中，如果Generator中定义了x个yield关键字，那么就有x+1种状态（+1是因为最后的return语句）。

### 4.4.2　Generator函数的执行

跟普通函数相比，Generator函数更像是一个类或者一种数据类型，以下面的代码为例，直接执行一个Generator会得到一个Generator对象，而不是执行方法体中的内容。

![image-20210427220955859](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427220955859.png)

按照通常的思路，gen应该是Generator()函数的返回值，上面也提到Generator函数可能有多种状态，读者可能会因此联想到Promise，一个Promise也可能有三种状态。**不同的是Promise只能有一个确定的状态，而Generator对象会逐个经历所有的状态，直到Generator函数执行完毕。**

**当调用Generator函数之后，该函数并没有立刻执行，函数的返回结果也不是字符串，而是一个对象，可以将该对象理解为一个指针，指向Generator函数当前的状态。（为了便于说明，我们下面采用指针的说法）。**

**当Generator被调用后，指针指向方法体的开始行，当next方法调用后，该指针向下移动，方法也跟着向下执行，最后会停在第一个遇到的yield关键字前面，当再次调用next方法时，指针会继续移动到下一个yield关键字，直到运行到方法的最后一行，以代码4.21为例，完整的执行代码如下：**

![image-20210427221533185](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427221533185.png)

上面的代码一共调用了三次next方法，每次都返回一个包含执行信息的对象，包含一个表达式的值和一个标记执行状态的flag。

第一次调用next方法，遇到一个yield语句后停止，返回对象的value的值就是yield语句的值，done属性用来标志Generator方法是否执行完毕。

第二次调用next方法，程序执行到return语句的位置，返回对象的value值即为return语句的值，如果没有return语句，则会一直执行到函数结束，value值为undefined，done属性值为true

第三次调用next方法时，Generator已经执行完毕，因此value的值为undefined。

#### 1．yield关键字

yield本意为“生产”，在Python、Java以及C#中都有yield关键字，但只有Python中yield的语义和Node相似（理由前面也说了）。

当next方法被调用时，Generator函数开始向下执行，遇到yield关键字时，会暂停当前操作，并且对yield后的表达式进行求值，无论yield后面表达式返回的是何种类型的值，yield操作最后返回的都是一个对象，该对象有value和done两个属性。

value很好理解，如果后面是一个基本类型，那么value的值就是对应的值，更为常见的是yield后面跟的是Promise对象。

done属性表示当前Generator对象的状态，刚开始执行时done属性的值为false，当Generator执行到最后一个yield或者return语句时，done的值会变成true，表示Generator执行结束。

值得注意的是，yield关键字本身不产生返回值。例如下面的代码：

**代码4.22　yield不产生返回值**

![image-20210427221932183](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427221932183.png)

这可能让人有些费解，为什么第二个next方法执行后，y的值却是undefined。

实际上，我们可以做如下理解： next方法的返回值是yield关键字后面表达式的值，而yield关键字本身可以视为一个不产生返回值的函数，因此y并没有被赋值。上面的例子中如果要计算y的值，可以将代码改成：

![image-20210427222122796](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427222122796.png)

Next方法还可以接受一个数值作为参数，代表上一个yield求值的结果。

**代码4.23　next方法可以接收一个参数**

![image-20210427222224880](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427222224880.png)

上面的代码等价于：

![image-20210427222242216](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210427222242216.png)

next可以接收参数代表可以从外部传一个值到Generator函数内部，乍一看没有什么用处，实际上正是这个特性使得Generator可以用来组织异步方法，我们会在后面介绍。

#### 2．next方法与Iterator接口（Iterator？）

在上一章曾经提到过ES2015中的Iterator，一个Iterator同样使用next方法来遍历元素。

由于Generator函数会返回一个对象，而该对象实现了一个Iterator接口，因此所有能够遍历Iterator接口的方法都可以用来执行Generator，例如for/of、array.from()等。

可以使用for/of循环的方式来执行Generator函数内的步骤，由于for/of本身就会调用next方法，因此不需要手动调用。

值得注意的是，循环会在done属性为true时停止，以下面的代码为例，最后的“end”并不会被打印出来，如果希望被打印，需要将最后的return改为yield。

**代码4.24　使用for/of循环执行Generator**

![image-20210428090712727](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428090712727.png)

前面提到过，直接打印Generator函数的示例没有结果，但既然Generator函数返回了一个遍历器，那么就应该具有Symbol.iterator属性。

![image-20210428090812424](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428090812424.png)

### 4.4.3　Generator中的错误处理

Generator函数的原型中定义了**throw方法**，用于抛出异常。

##### **代码4.25　使用throw方法抛出异常**

![image-20210428090922583](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428090922583.png)

上面代码中，执行完第一个yield操作后，Generator对象抛出了异常，然后被函数体中try/catch捕获。**值得注意的是，当异常被捕获后，Generator函数会继续向下执行，直到遇到下一个yield操作并输出yield表达式的值。**

##### **代码4.26　使用try/catch捕获异常**

![image-20210428091133436](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428091133436.png)

如果Generator函数在执行的过程中出错，也可以在外部进行捕获。

![image-20210428091150453](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428091150453.png)

Generator的原型对象还定义了return()方法，用来结束一个Generator函数的执行，这和函数内部的return关键字不是一个概念。

![image-20210428091210226](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428091210226.png)

### 4.4.4　用Generator组织异步方法

我们之所以可以使用Generator函数来处理异步任务，原因有二：

- Generator函数可以中断和恢复执行，这个特性由yield关键字来实现。
- Generator函数内外可以交换数据，这个特性由next函数来实现。

**概括一下Generator函数处理异步操作的核心思想**：先将函数暂停在某处，然后拿到异步操作的结果，然后再把这个结果传到方法体内。

yield关键字后面除了通常的函数表达式外，比较常见的是后面跟的是一个Promise，由于yield关键字会对其后的表达式进行求值并返回，那么调用next方法时就会返回一个Promise对象，我们可以调用其then方法，并在回调中使用next方法将结果传回Generator。

#### 代码4.27　使用Generator处理异步

![image-20210428092031301](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428092031301.png)

上面的代码中，Generator函数封装了readFile_promise方法，该方法返回一个Promise，Generator函数对readFile_promise的调用方式和同步操作基本相同，除了yield关键字之外。上面的Generator函数中只有一个异步操作，当有多个异步操作时，就会变成下面的形式。

#### 代码4.28　使用Generator进行异步流程控制

![image-20210428092139291](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428092139291.png)

慢着，怎么看起来还是嵌套的回调？难道使用Generator的初衷不是优化嵌套写法吗？

说的没错，虽然在调用时保持了同步形式，但我们需要手动执行Generator函数，于是在执行时又回到了嵌套调用。这是Generator的缺点。

### 4.4.5　Generator的自动执行

开发者肯定不希望调用个函数还要一步步地写代码，我们想要的就是和代码4.3一样的调用形式。

对Generator函数来说，我们也看到了要顺序地读取多个文件，就要像代码4.29那样写很多用来执行的代码。

无论是Promise还是Generator，就算在编写异步代码时能获得便利，但执行阶段却要写更多的代码，Promise需要手动调用then方法，Generator中则是手动调用next方法。

当需要顺序执行异步操作的个数比较少的情况下，开发者还可以接受手动执行，但如果面对多个异步操作就有些难办了，我们避免了回调地狱，却又陷到了执行地狱里面。

我们不会是第一个遇到自动执行问题的人，社区已经有了很多解决方案，但为了更深入地了解Promise和Generator，我们不妨先试着独立地解决这个问题，如何能够让一个Generator函数自动执行？

#### 1．自动执行器的实现

既然Generator函数是依靠next方法来执行的，那么我们只要实现一个函数自动执行next方法不就可以了吗，针对这种思路，我们先试着写出这样的代码：

##### 代码4.29　自动执行的初次尝试

![image-20210428093009047](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428093009047.png)

思路虽然没错，但这种写法并不正确，首先这种方法只能用在最简单的Generator函数上，例如下面这种：

![image-20210428093056446](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428093056446.png)

另一方面，由于Generator没有hasNext方法，在while循环中作为条件的：

![image-20210428093118211](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428093118211.png)

在第一次条件判断时就开始执行了，这表示我们拿不到第一次执行的结果。因此这种写法行不通。

那么换一种思路，我们前面介绍了for/of循环，那么也可以用它来执行Generator。

![image-20210428093244217](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428093244217.png)

看起来没什么问题了，但同样地也只能拿来执行最简单的Generator函数，然而我们的主要目的还是管理异步操作。

#### 2．基于Promise的执行器

前面实现的执行器都是针对“普通”的Generator函数，即里面没有包含异步操作，在实际应用中，yield后面跟的大都是Promise，这时候for/of实现的执行器就不起作用了。

通过观察，我们发现Generator的嵌套执行是一种递归调用，每一次的嵌套的返回结果都是一个Promise对象。

![image-20210428093541627](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428093541627.png)

那么好了，我们可以据此写出新的执行函数。

##### 代码4.30　升级后的执行函数

![image-20210428093644576](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428093644576.png)

这个执行器因为调用了then方法，因此只适用于yield后面跟一个Promise的方法。

#### 3．使用co模块来自动执行

为了解决generator执行的问题，TJ于2013年6月发布了著名co模块，这是一个用来自动执行Generator函数的小工具，和Generator配合可以实现接近同步的调用方式，co方法仍然会返回一个Promise。

##### 代码4.31　使用co模块执行Generator

![image-20210428093905738](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428093905738.png)

只要将Generator函数作为参数传给co方法就能将内部的异步任务顺序执行，**要使用co模块，yield后面的语句只能是promsie对象。**

co模块的源码这里不再介绍，它和代码4.31的主要区别是co模块仍会返回一个Promise。

到此为止，我们对异步的处理有了一个比较妥当的方式，利用generator+co，我们基本可以用同步的方式来书写异步操作了。

**但co模块仍有不足之处，由于它仍然返回一个Promise，这代表如果想要获得异步方法的返回值，还要写成下面这种形式：**

![image-20210428094029675](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428094029675.png)

另外，当面对多个异步操作时，除非将所有的异步操作都放在一个Generator函数中，否则如果需要对co的返回值进行进一步操作，**仍然要将代码写到Promise的回调中去。**

注意，阅读源码就能发现yield后面还可以是一个thunk函数，它是一种求值策略，这里不再做具体讲述，读者可以自行搜索相关内容。

## 4.5　回调的终点——async/await

### 4.5.1　async函数的概念

**ES2017标准引入了async函数，作为最后的补刀终结了回调处理的问题**，该特性在Node v7.6.0之后的版本中已经获得原生支持。

async函数可以看作是自带执行器的Generator函数，我们之前有形如下面的Generator方法：

![image-20210428094456075](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428094456075.png)

如果用async函数改写的话，会变成如下的形式：

**代码4.32　async函数示意**

![image-20210428094619851](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428094619851.png)

形式看起来没有什么大的变化，yield关键字换成了await，方法名前的*号变成了async关键字。

在使用上的一个区别是await关键字，await关键后面往往是一个Promise，如果不是就隐式调用promise.resolve来转换成一个Promise。Await的动作和它的名字含义相同——等待后面的Promise执行完成后再进行下一步操作。

另一个重要区别在于调用形式，调用一个async方法完全可以直接通过方法名来调用，以代码4.32为例，该函数可以直接使用：

![image-20210428094843589](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428094843589.png)

的方式来进行调用。

在这个过程中，完全没有了回调的影子，也没有引入任何第三方模块，困扰了Node社区多年的回调问题在这里终结。

#### 1．声明一个async方法

async方法的声明和普通方法并无二致。

![image-20210428094927502](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428094927502.png)

#### 2．async的返回值

**async函数总是会返回一个Promise对象，如果return关键字后面不是一个Promise，那么默认调用promise.resolve方法进行转换。**

下面是一个async函数返回Promise的例子。

![image-20210428095148497](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428095148497.png)

上面的asyncFunc()方法虽然看似返回了一个字符串，却能使用then方法来获得最终值，这是内部将字符串转换成了Promise的缘故。

#### 3．async函数的执行过程（重要，有疑惑）

（1）在async函数开始执行的时候，会自动生成一个Promise对象。

（2）当方法体开始执行后，如果遇到return关键字或者throw关键字，执行会立刻退出，如果遇到await关键字则会暂停执行（await后面的异步操作结束后会恢复执行）。

（3）执行完毕，返回一个Promise。

我们用下面的例子来看看async函数是怎么工作的。

![image-20210428095742832](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428095742832.png)

**先 end 后 Hello 的原因：执行了asyncFunc()函数后就去执行下一步了，**（自己说的有点勉强还要深究）

async函数返回的Promise，既可以是resolved状态，也可以是reject状态，不过通常使用throw Error的方式来代替reject。

![image-20210428095955946](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428095955946.png)

### 4.5.2　await关键字（重点）

对于async函数来说，await关键字不是必需的，我们从上面也看出了，由于async本质上是对Promise的封装，那么可以使用执行Promise的方法来执行一个async方法。

而await关键字则是对这一情况的语法糖，它可以“自动执行”一个Promise（其实是等待后面的Promise完成后再进行下一步动作），当async函数内有多个Promise需要串行执行的时候，这种特性带来的好处是十分明显的，因为我们也看到了前面为了执行Promise和Generator写的一大堆代码。

**await操作符的结果是由其后面Promise对象的操作结果来决定的，如果后面Promise对象变为resolved，await操作符返回的值就是resolve的值；如果Promise对象的状态变成rejected，那么await也会抛出reject的值。**

我们还以读文件的代码为例，来观察await函数的特性。

#### 代码4.33　异步读取一个文件

![image-20210428100636139](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428100636139.png)

由于await可以看作是一个Promise的执行器，那么上面第二行的代码：

![image-20210428100657319](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428100657319.png)

也可以写成下面这种形式：

#### **代码4.34　await的另一种写法**

![image-20210428100909441](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428100909441.png)

这种写法和原先Promise的调用区别在于在前面加了一个await关键字，由于then方法总是会返回一个Promise，那么上面的代码相当于：

![image-20210428101101173](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428101101173.png)

因此形如代码4.34形式的代码也是没问题的，在需要对promise结果进行进一步操作后再返回时有一些作用。

在使用了await关键字之后，无论是代码还是执行，都变得和同步操作没什么两样，这就是await的威力所在。

#### 1．await与并行（重要）

**await会等待后面的Promise完成后再采取下一步动作，这意味着当有多个await操作时，程序会变成完全的串行操作。**

**为了发挥Node的异步优势，当异步操作之间不存在结果的依赖关系时，可以使用promise.all来实现并行。**

**代码4.35　await与promise.all**

![image-20210428102151896](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428102151896.png)

#### 2．错误处理

当async函数中有多个await关键字时，如果有一个await的状态变成了rejected，那么后面的操作就不会继续执行。

![image-20210428103948292](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428103948292.png)

执行上面的代码，控制台就会打印出如下消息：

![image-20210428104049977](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428104049977.png)

这个信息我们也介绍过了，这表明了代码中有一个没有被处理的处于rejected状态的Promise。因此使用await时为了避免潜在的错误，最好用try/catch将所有的await包裹起来。

![image-20210428104209178](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210428104209178.png)

### 4.5.3　在循环中使用 async 方法

到ES2017为止，Node中一共提供了下面的几种循环：

- while循环。
- 普通的for循环，例如for(var i = 0; i<10 ; i++)，这是最常用的循环。
- forEach循环。
- ES2015新增的for of循环。

通常遇到多个异步任务时，如果我们希望它们能串行执行，可以使用循环的方式来进行调用。

#### 1．for/while循环

![image-20210429160543210](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429160543210.png)

会按顺序输出4个文本文件的内容。

#### 2．forEach循环

![image-20210429160627248](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429160627248.png)

值得注意的是，即使是在匿名函数中使用await关键字，也要在匿名函数前加上async关键字。

**此外，上面的代码不能保证顺序执行。**

#### 3．for of循环

![image-20210429160836820](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429160836820.png)

另一方面，如果异步方法的执行全都变成串行的话，就不能发挥出**Node非阻塞IO的优势**了，如果想要使用并行来提高执行效率，那么需要使用promise.all()，前面已经介绍过了。

![image-20210429161012231](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429161012231.png)

### 4.5.4　async和await小结（懵）

**这里有点懵** begin

async函数是用async/await关键字来标识的，**async函数返回一个Promise对象，当在方法体中遇到异步操作时，会立刻返回**，随后不断轮询直到异步操作完成，随后再继续执行方法体内剩下的代码。

![image-20210429161317037](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429161317037.png)

上面的代码，每间隔一秒依次输出0、1、2、3、4，到了这一步，终于可以在for循环内部顺序执行多个异步操作了。

读者可能注意到了，即使将timeout写成了async/await的形式，但在asyncPrint方法中依然需要使用await关键字来调用，同时也让asyncPrint函数也带上了async关键字。

**通常在希望顺序处理的过程中，只要函数体中调用了async操作，该函数就不得不带上async关键字。这有可能导致所有的函数都变成async函数，就像采用同步事件处理的语言一样，还是以上面的代码为例，如果我们想要顺序调用多个asyncPrint方法，还是要使用async方法。**

![image-20210429161708126](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429161708126.png)

await关键字后面的代码需要是Promise对象才能使用，如果要将现有的异步流程改造成async方法，通常要先将异步操作改造成Promise。

**end**

#### await关键字小结

- 对于await关键字使用的一些关键点如下：
- await关键字必须位于async函数内部。
- await关键字后面需要是一个Promise对象（不是的话就调用resolve转换它）。
- await关键字的返回结果就是其后面Promise执行的结果，可能是resolved或者rejected的值。
- 不能在普通箭头函数中使用await关键字，需要在箭头函数前面增加async关键字。await用来串行地执行异步操作，想实现并行可以考虑promise.all。

### 4.5.5　async函数的缺点（感觉这里说得怪怪的）

async函数和Generator函数比起来，有着不少的优点，例如可以实现自动执行，无须借助第三方模块等，也免去了Generator函数中一些复杂的概念，async函数的声明和执行与普通同步函数几乎一模一样（除了async和await关键字外）。

乍一看async方法十分完美，可以用最简洁的方式解决异步处理，但**仍然有一些不足**。

假设我们有很多层的方法调用，最底层的异步操作被封装成了async方法，那么该函数的所有上层方法可能都要变成async方法。

下面就用一个例子来说明这一点：假设我们有一个get方法，用来从数据库中找出一条id最大值的记录，然后调用set方法将这个值增加1后存入数据库，然后再返回修改后的值。

我们将两个操作封装在一个方法里，叫做update，显然，get应该在set之前调用，为此我们将update函数声明为async方法。

![image-20210429162217447](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429162217447.png)

假设update是由一个对象触发update事件时执行的回调函数，通常情况下上一级的调用会是如下形式。

![image-20210429162316795](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429162316795.png)

**对于async函数update来说，这种调用得不到正确的value值，因为async方法返回的永远是一个Promise，即使开发者返回的是一个常量，也会被自动调用的promise.resolve方法转换为一个Promise。**

因此，上层的调用方法也要是一个async函数，如下所示。

![image-20210429162435523](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429162435523.png)

如果还存在更高层次的方法调用，那么从最底层的异步操作开始，到最顶层一个不需要返回值的函数为止，全部的方法都变成了async方法。

**注意：then方法中回调函数的参数是 async 函数内部 return 语句返回的值**

## 4.6　总结（有疑惑）

本章按照时间顺序介绍了曾在回调处理中流行的方法和第三方模块，从原始的嵌套回调到现在的async方法

目前我们推荐统一使用Promise作为处理异步的方式，虽然async/await看起来更加简洁，但在大型项目中开发者不一定非要使用async方法来处理异步，因为相比之下Promise更加灵活，而作为中间过渡的Generator函数，现在已经并不推荐使用了。**（现在呢？）**

## 4.7　引用资源

```
http://es6.ruanyifeng.com/#docs/promise#Promise-all
https://github.com/tj/co
http://exploringjs.com/es2016-es2017/ch_async-functions.html
https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
http://www.ruanyifeng.com/blog/2015/05/thunk.html
```

# 第5章　使用Koa2构建Web站点

## 5.0　概述

在这一章，我们会试着从零开始实现一个完整的Web应用，它是一个简单的BLOG系统，具有发布、归类、展示等功能，对于入门的开发者来说这是一个合适的例子。如果读者已经有了使用其他语言开发Web应用的经验，那么对于本章的大多数概念应该都不会陌生。

本章演示使用框架为Koa 2.0，它由Express的核心团队开发，目的是使用ECMAScript的最新特性来开发下一代的Web应用，要使用这些新特性，Node版本要求在7.6.0以上，建议读者安装Node的最新版本。

虽然本章的重点是围绕Koa框架来展开的，但也会有一些原生的Node或者使用Express框架书写的代码，它们通常是为了便于读者更好地理解各种概念而存在的。

## 5.1　Node Web框架的发展历程

我们首先梳理一下Node Web框架的发展历程，从2009年到现在，最为出名的Web框架有三个。

### 5.1.1　Connect

Connect诞生于2010年，这个时间相当早（Node项目始于2009年），其官方描述如下：

![image-20210429170323784](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429170323784.png)

可以将Connect理解成一个Node中间件的脚手架，只提供了基本的调用逻辑，没有具体的处理逻辑。

Connect的源码结构十分简单，只有一个文件，去掉注释后的代码不超过两百行。

之所以首先提到Connect，是因为它首先在Node服务器编程中引入了**中间件（middleware）**的概念。

中间件的概念并不新鲜，早就广泛存在于其他语言的开发中，例如Java Web的各种中间件，但对于当时还是一片荒芜的Node来说，中间件概念的引入有很重要的意义，因为之后产生的大多数框架都开始采用这一思路，为后面Express的诞生与繁荣打下了基础。

中间件的引入将Web开发变成了不同模块之间的层级调用，有助于开发者将业务逻辑进行拆分。

此外，**Connect的实现已经成了某种事实的规范，例如使用use方法加载中间件并且通过next方法调用中间件等**，这在Express和Koa中得以延续（这很大程度上也和三个项目的贡献者之一的TJ本人有关）。

### 5.1.2　Express

Express框架开发的时间也很早（2010年），它继承了Connect的大部分思想（连源码都继承了），其发展分为两个阶段，Express3.x与Express4.x。

在3.x及之前的版本中，Express直接依赖Connect的源码，并且内置了不少中间件，这种做法的缺点是如果内置的中间件更新了，那么开发者就不得不更新整个Express。

在4.x中，Express摆脱了对Connect的依赖，并且摒弃了除了静态文件模块之外的所有中间件，只保留了核心的路由处理逻辑以及一些其他的代码。

在过去的几年中，Express取得了巨大的成功，无论是开发者的数量还是社区的活跃程度都是现象级的，MEAN架构（MongoDB+Express+Angular+Node）成为了不少初创网站的开发首选，至今依旧非常流行。

### 5.1.3　Koa

#### express 存在问题

但是Express依旧存在不少问题，面对异步中间件的层级调用，往往还要借助第4章的那一套东西去解决（这种情况已经在ES2015及Node v7.6.0之后有所改善）。

在某些需要同步调用的场景下处理异步让人窝火，开发者往往会在这上面耗费大量的时间，而不是把主要精力放在业务逻辑上。



因此在2013年底，Express的原班开发人马使用ES2015中的新特性（主要是Generator）重新打造了新的Web框架——Koa，Koa的初衷就是彻底解决在Node Web开发中的异步问题，在ES2015还没有被Node完全支持的时候，运行Koa项目需要在启动Node时加上--harmony参数。

Koa的理念与Connect更加相似，内部没有提供任何中间件，Express中保留的静态文件和路由也被剔除，仅仅作为中间件的调用的脚手架。

Koa的发展同样存在Koa1.x和Koa2两个阶段，两者之间的区别在于Koa2使用了ES2017中async方法来处理中间件的调用（Koa1.x使用的是generator），该特性已经在v7.6.0之后的Node版本中提供原生支持。

Connect、 Express、 Koa这三个框架可谓一脉相承，Connect目前已经少有人问津，Express和Koa占据了绝大部分的市场。

## 5.2　内容规划

### 5.2.1　需求分析

#### 1．上传文章

文章实现的博客系统里，采用本地编写文章，然后上传到网站上的方式实现，这能让我们更关注路由和数据库存储方面的内容。每一篇博客都有ID以及kind两个属性，ID可以是自增的，也可以是一串随机的字符串。

#### 2．路由设计

初步设计的路由如表5-1所示，我们会随时对其进行补充。

![image-20210429171128938](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429171128938.png)

### 5.2.2　技术选型

传统的Web开发分为前后端，前端使用HTML/JS/CSS配套进行页面设计，后端使用Java、Python等来进行数据处理，对于本书来说，唯一的区别在于后端语言换成了Node。

为了实现这个目标网站，我们需要解决下面几个问题：

- 静态文件服务
- 路由设计
- 数据存储
- 页面渲染（使用页面模板还是框架）

本章使用的技术栈为Node+Koa+Mongo+Redis+Ejs，它们分别扮演的角色如下所示：

- Node：开发语言。
- Koa：Web开发框架。
- MongoDB：基础的数据存储服务。
- Redis：主要用来存储Session。
- Ejs：页面模板引擎。

对于本章的实现来说，Redis不是必需的，但因为其在Web领域应用十分广泛，因此花了一些篇幅进行介绍。

**为什么不是Express**

相比Express，Koa足够“新”，不仅体现在诞生时间，还有使用的最新特性，更能贴合本书的理念。

## 5.3　Koa入门

### 5.3.1　Koa1.x与Koa2

前面已经提到，Koa1.x和Koa2的主要区别在于前者使用Generator，后者使用async方法来进行中间件的管理。

在Web开发中，尽管Node本身是异步的，但我们还是希望能够顺序执行某些操作，而且代码实现要尽可能简洁。例如在收到HTTP请求时，我们希望先将请求信息写入日志，接着进行数据库相关的操作，最后返回对应的结果。

**在实际开发中，这些操作会抽象为一个个中间件，通常都是异步进行调用的，我们的问题就回到了如何控制中间件的调用顺序上。**

在Koa1.x的版本中，由于当时ES2017还没有影子（2013年底），因此使用了ES2015提案中的Generator函数来作为异步处理的主要方式。为了实现Generator的自动执行，还使用了上一章介绍的co模块作为底层的执行器——它们都是出自同一作者之手。

**下面是一个Koa1.x的例子。**

**代码5.1　Koa 1.x示意**

![image-20210429171938549](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429171938549.png)

当用户访问localhost:3000时，首先打印出hello world，再输出log信息。

Koa1.x对中间件的处理基于co模块，这仍然是一种比较hack（陈旧的）的方法。

ES2017的草案里增加了async函数，Koa为此发布了2.0版本，这个版本舍弃了Genrator函数和co模块，完全是使用async函数来实现的，async函数在Nodev7.6.0之后才得到了完整的支持，**因此要使用Koa2进行开发，本地的Node环境最好大于7.6.0。**

除此之外，**Koa和Express最大的不同之处在于Koa剥离了各种中间件，这种做法的优点是可以让框架变得更加轻量，缺点就是Koa发展时间还较短，各种中间件质量参差不齐，1.x和2.x的中间件也存在一些兼容性问题，但对于多数常用的中间件来说，都已经实现了对Koa2.0的支持。**

在Koa项目的GitHub主页https://github.com/Koajs中，列出了Koa项目本身和被一些官方整理的中间件列表，开发者也可以在GitHub中搜索，查找比较活跃的中间件。

在本章中，我们主要介绍Koa2的使用，在后面内容里提到的Koa均代表Koa2.0。

### 5.3.2　context对象

**代码5.2　使用Koa2.0创建http服务器**

![image-20210429172344960](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429172344960.png)

**Node提供了request(IncomingMessage)和response(ServerReponse)两个对象，Koa把两者封装到了同一个对象中，即context，缩写为ctx。**

context中封装了许多方法和属性，大部分是从request和response对象中使用委托方式得来的，下面列出了ctx对象封装的一些属性以及它们的来源：

#### 1．From request

![image-20210429172510919](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429172510919.png)

#### 2．From response

![image-20210429172525142](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429172525142.png)

**除了自行封装的属性外，ctx也提供了直接访问原生对象的手段，ctx.req和ctx.res即代表原生的request和response对象，例如ctx.req.url和ctx.url就是同一个对象。**

除了上面列出的属性之外，ctx对象还自行封装了一些对象，例如ctx.request和ctx.response，它们和原生对象之间的区别在于里面只有一部分常用的属性，我们可以试着将原生对象和ctx封装后的对象分别打印出来进行比较：

![image-20210429172644130](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429172644130.png)

访问localhost:3001，打印ctx.request的内容如下：

![image-20210429172656515](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429172656515.png)

ctx.response的内容如下：

![image-20210429172714538](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429172714538.png)

可以看出，二者的结构和原生对象还是有很大区别的，**ctx.response只有最基本的几个属性，上面没有注册任何事件或方法**，这表示下面的使用方法是错误的：

![image-20210429172748787](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429172748787.png)

代码要改成：

![image-20210429172916053](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429172916053.png)

#### 3．ctx.state

state属性是官方推荐的命名空间，如有开发者从后端的消息想要传递到前端，可以将属性挂在ctx.state下面，这和react中的概念有些相似，例如我们从数据库中查找一个用户id：

![image-20210429173025270](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429173025270.png)

#### 4．其他的一些属性和方法

![image-20210429173039522](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429173039522.png)

#### 5．处理http请求

上面的内容也提到，Koa在ctx对象中封装了request以及response对象，那么在处理http请求的时候，使用ctx就可以完成所有的处理。

在上面的代码中，我们使用：

![image-20210429173233110](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429173233110.png)

相当于：

![image-20210429173243751](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429173243751.png)

ctx相当于ctx.request或者ctx.response的别名，判断http请求类型可以通过ctx.method来进行判断，get请求的参数可以通过ctx.query获取。

例如，当用户访问localhost:3000?kindName=Node时，可以设置如下的路由。

##### 代码5.3　获取get请求参数

![image-20210429173504011](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429173504011.png)

Koa处理get请求比较简单，直接通过ctx.req.<param>就能拿到get参数的值，**post请求的处理稍微麻烦一些，通常使用bodyParser这一中间件进行处理，但也仅限于普通表单，获取格式为ctx.request.body.<param>（文件上传在后面介绍）。·**

例如我们构造一个简单的form用来输入用户名和密码：

![image-20210429173609715](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429173609715.png)

服务端相应路由的代码就可以写成：

![image-20210429173623057](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429173623057.png)

## 5.4　middleware

### 5.4.1　中间件的概念

在介绍Koa中间件之前，我们暂时先把目光投向Express，因为Koa中间件的设计思想大部分来自Connect，而Express又是基于Connect扩展而来的。

Express本身是由路由和中间件构成的，**从本质上来说，Express的运行就是在不断调用各种中间件**。

**中间件本质上是接收请求并且做出相应动作的函数**，该函数通常接收req和res作为参数，以便对request和response对象进行操作，在Web应用中，客户端发起的每一个请求，首先要经过中间件的处理才能继续向下。

**中间件的第三个参数一般写作next，它代表一个方法，即下一个中间件。如果我们在中间件的方法体中调用了next方法，即表示请求会经过下一个中间件处理。**

**例如下面的函数就可以拿来做一个中间件。**

![image-20210429174205423](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429174205423.png)

#### 1．中间件的功能

由于中间件仍然是一个函数，那么它就可以做到Node代码能做到的任何事情，除此之外还包括了修改request和response对象、终结请求-响应循环，以及调用下一个中间件等功能，这通常是通过在内部调用next方法来实现的。**如果在某个中间件中没有调用next方法，则表示对请求的处理到此为止，下一个中间件不会被执行。**

#### 2．中间件的加载

中间件的加载使用use方法来实现，该方法定义在Express或者Koa对象的实例上，例如加载上面定义的中间件md：

![image-20210429174737963](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429174737963.png)

#### 3．Express中的中间件

Express应用可使用如下几种中间件：

- 应用级中间件
- 路由级中间件错误处理中间件？
- 内置中间件
- 第三方中间件

上面是官网的分类，实际上这几个概念有一些重合之处。

##### （1）应用级中间件

使用app.use方法或者app.METHOD()（Method表示http方法，即get/post等）绑定在app对象上的中间件。

**代码5.4　Express中间件示例**

![image-20210429175039077](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429175039077.png)

在第一个中间件中调用了next方法，因此会转到第二个中间件，第二个由于没有调用next方法，其后的中间件都不会执行。

##### （2）路由级中间件

和Koa不同，路由处理是Express的一部分，通常通过router.use方法来绑定到router对象上：

![image-20210429175137171](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429175137171.png)

##### （3）错误处理中间件

错误处理中间件有4个参数，即使不需要通过next方法来调用下一个中间件，也必须在参数列表中声明它，否则中间件会被识别为一个常规中间件，不能处理错误。

![image-20210429175453369](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210429175453369.png)

##### （4）内置中间件

从4.x版本开始，Express已经不再依赖Connect了。除了负责管理静态资源的static模块外，Express以前内置的中间件现在已经全部单独作为模块安装使用。

##### （5）第三方中间件

第三方中间件可以为 Express 应用增加更多功能，通常通过npm来安装，例如获取Cookie信息常用的cookie-parser模块，或者解析表单用的 bodyParser 等。

Koa没有任何内置的中间件，连路由处理都没有包括在内，所有中间件都要通过第三方模块来实现，比起Express来，其实更像是Connect。

### 5.4.2　next方法

无论是 Express 还是 Koa，中间件的调用都是通过 next 方法来执行的，该方法最早在 Connect 中提出，并被 Express 和Koa 沿用。

**当我们调用 app.use 方法时，在内部形成了一个中间件数组，在框架内部会将执行下一个中间件的操作放在 next 方法内部，当我们执行next方法时，就会执行下一个中间件。如果在一个中间件中没有调用next方法，那么中间件的调用会中断，后续的中间件都不会被执行。**

对于整个应用来说，next方法实现的无非就是嵌套调用，也可以理解成一个递归操作，执行完next对应的中间件后，还会返回原来的方法内部，继续向下执行后面的方法。具体的实现会在Koa源码分析一节介绍。

如图5-1所示，下面这张“洋葱图”很形象地解释了Koa中间件的工作原理，对于request对象，首先从最外围的中间件开始一层层向下，到达最底层的中间件后，再由内到外一层层返回给客户端。每个中间件都可能对request或者response对象进行修改。

![image-20210504102101182](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504102101182.png)

### 5.4.3　中间件的串行调用

接下来讲述的是 Koa 设计的核心部分，在 Web 开发中，我们通常希望一些操作能够串行执行，例如等待写入日志完成后再进行数据库操作，最后再进行路由处理。在技术层面，上面的业务场景表现为串行调用某些异步中间件。

比较容易想到的一种做法是把next方法放到回调里面，但如果异步操作一多，就又回到了第4章的问题。

下面的代码定义了两个Express中间件，和之前不同之处在于第二个中间件中调用了process.nextTrick()，表示这是一个异步操作。

**代码5.5　Express的异步中间件**

![image-20210504102306865](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504102306865.png)

按照上面的原理，next方法在执行完毕后返回上层的中间件，那么应该先执行middleware2，然后再执行middleware1；但由于第二个中间件内的process.nextTick是一个异步调用，因此马上返回到第一个中间件，继续输出I ammiddleware1，然后中间件二的回调函数执行，输出I am middleware2。

我们前面也已经提到了，在有些情况下，**我们可能希望等待middleware2执行结束之后再输出结果。而在Koa中，借助async/await方法，事情变得简单了。**

**代码5.6　Koa中使用async组织的异步中间件**

![image-20210504102524873](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504102524873.png)

使用await关键字后，直到next内部的异步方法完成之前，midddlware1都不会向下执行。

下面我们来看一个具体例子的分析，这个例子反映了一种常见的需求，即**设置整个app的响应时间**。

### 5.4.4　一个例子——如何实现超时响应

#### 1．Express中的超时响应

下面我们来介绍一个更贴近具体业务的例子。在Web开发中，我们希望能给长时间得不到响应的请求返回特定的错误信息。

如果是在Express中，可以使用**connect-timeout**这一第三方中间件来处理响应超时，该中间件实现很简单，读者可以自行在GitHub上参阅其源码，下面是一段使用connect-timeout进行超时响应的示意代码。

**代码5.7　Express中的超时响应**

![image-20210504102740439](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504102740439.png)

该中间件的实现很简单，timeout内部定义了一个定时器方法，如果超过定时器规定的时间限制，就会触发错误事件并返回一个503状态码，并且haltOnTimedout后面的中间件不再执行。

如果在定时器触发前完成响应，就会取消定时器。

这种做法虽然看起来能解决超时问题，但仔细想一想缺点也很明显，在timeout方法中只定义了一个简单的定时器，如果中间件中包含了一个异步操作，那么容易在调用回调方法时出现问题。

假设timeout加载后又引入了一个名为queryDB的中间件，该中间件封装了一个异步的数据库操作，并且将查询的结果作为响应消息返回。

queryDB在大多数状态下很快（1秒内）就能完成，但有时会因为某些原因（例如被其他操作阻塞）导致执行时间变成了10秒，这时timeout中间件已经将超时信息返回给了客户端，如果queryDB内部包含了一个res.send方法，就会出现Can't setheaders after they are sent的错误。

要解决这个问题，比较妥当的方式是通过事件监听的方式，如果超时之后触发该事件，那么取消之后的全部操作，或者直接修改res.end方法，在其中设置一个flag用来判断是否已经调用过。

**上面问题的根本原因是connect-time，或者是Express没办法对异步中间件的执行进行很好的控制。**

#### 2．Koa中的超时响应(还不太懂)

借助async方法中间件会按照顺序来执行，这时进行timeout管理就比较方便了，目前社区也有koa-timeout等一些中间件，读者可以自行去探索使用，也可以考虑自己实现，毕竟这样的中间件实现难度并不大。

下面是笔者自己实现的一个例子，核心思想是使用promise.race方法来比较setTimeout和之后的中间件哪个会更快完成。

**代码5.8　Koa的timeout中间件**

![image-20210504103606886](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504103606886.png)

如果我们想用上面的代码管理超时，queryDB需要返回一个Promise对象或者是async方法。

## 5.5　常用服务的实现

### 5.5.1　静态文件服务

第2章已经介绍了使用原生http和fs模块实现的静态文件服务，在Web开发中通常不会使用自己封装的方法，这里选择 **koa-static** 作为处理静态文件的中间件。

**代码5.9 koa-static**

![image-20210504103756098](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504103756098.png)

static模块的使用比较简单，规划好静态文件存放的路径，使用app.use挂载在应用上即可。上面的代码中，__dirname+ "/static/html"表示静态文件存放的路径，当接收到请求后，会在该路径下进行查找。

Serve方法还可以接收一个对象作为第三个参数，表示将查找文件的范围限定在指定后缀名范围内。例如，我们在代码5.9中设置了**{extensions: ['html']}**，那么在访问文件时就可以**省略文件后缀名**。

例如，我们要访问根目录下的login.html，就可以使用：

![image-20210504103900563](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504103900563.png)

### 5.5.2　路由服务

Express的路由中间件是集成在框架内部的，因此可以直接使用如下的代码：

![image-20210504103942872](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504103942872.png)

Koa中的路由处理要借助第三方模块来实现，这里使用**Koa-router**，和Express中注册路由的写法相同，**router对象分别使用get和post方法来处理get和post请求**。

下面是一个使用Koa-router的例子：

![image-20210504104045081](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504104045081.png)

上面的代码中，我们定义了两个路由，接收到get请求后向前端渲染一个form表单用于登录，当用户单击submit提交后，router接收到post请求后使用ctx.request.body对象来解析表单中的字段，该对象是router中间件提供的访问接口。

因为router也是中间件，因此要使用app.use()来挂在app对象中。此外，**bodyPaser要在router之前加载才能生效**。Koa-router同样支持定义多种形式的路由，下面是一些例子。

![image-20210504104343499](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504104343499.png)

上面代码里:category和:title实际上起到了get参数的作用，这种REStful风格的地址传递相比使用？category=XX &title=XX的形式更加简洁，要获取这种形式的参数，可以使用ctx.params对象，例如：

![image-20210504104452402](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504104452402.png)

### 5.5.3　数据存储

在网站的规划中，我们使用 id 这一唯一属性来定位一篇博客，而博客是以 HTML 文件形式存储在 static 文件夹下的，文件名是博客的标题。

为了管理id和文件名以及文件分类之间的映射关系，我们引入了MongoDB来作为数据存储的介质，关于MongoDB相关的介绍可以参考附录。

在介绍具体实现bloglist这一集合之前，我们先来看看MongoDB相关的内容。

#### 1．使用Mongoose访问MongoDB

**Hibernate** 是一种 ORM（Object Relational Mapper），它提供了Java 对象与关系型数据库表的映射关系，使得开发者能编写更高效率的代码而不是直接使用JDBC来连接数据库。

在这一点上，Mongoose 和 Hibernate 相似，它同样为 Node 提供了访问 MongoDB 的接口，它将 MongoDB 中的collection 映射到了Node的代码中。

**Mongoose 和 Hibernate 的不同之处在于** Mongoose 是一种 ODM（Object Document Mapper），提供的是对象和文档数据库（Document Database）之间的映射关系，有兴趣的读者可以自行探索二者的区别，这里不做介绍。

#### 2．Mongoose的使用

在项目目录下运行下面命令：

![image-20210504104957875](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504104957875.png)

安装成功后，准备连接数据库，确保 MongoDB 的本地实例已经开始运行后，就可以准备用代码连接 MongoDB 了。

新建文件db.js，开头增加如下代码：

![image-20210504105042667](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504105042667.png)

连接到数据库后，需要检测连接状态，用来应付可能出现的错误或异常，在 db.js 中增加如下代码：

**代码5.10　检测连接状态**

![image-20210504105254893](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504105254893.png)

上文提到，Mongoose 自身定义了一些数据结构来实现 Node 代码与 MongoDB 的映射要使用 Monggose，首先要明确schema、model 的概念：

- schema：一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力。
- model：由 schema 发布生成的模型，具有抽象属性和行为的数据库操作对。

如果使用关系型数据库来类比的话，schema 大致相当于关系型数据库中的一张表，每个 schema 中定义了若干字段。

而 model 则可以看作是 SQL 语句的抽象，只能定义在一个schema上，MongoDB 的增删改查操作都是通过model来进行的。

为了更好地理解，我们来实际操作一番，首先在数据库中定义一个名为 login 的 collection，它包含两个字段：username、password。

然后在db.js中增加下面的代码，关于数据库相关的操作都会放在这个文件中。

##### **代码5.11　定义一个schema**

![image-20210504105837797](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504105837797.png)

上面的代码里，我们首先声明了一个schema，schema内有username和password两个字段，schema相当于collection的骨架，schema中声明的字段必须包含在想要关联的collection中，如果collection中的字段非常多，也可以只关联部分字段，在数据更新的时候，未关联的字段的值默认为空。

随后在第4行，在这个schema上调用Model的构造方法初始化了一个model，该构造方法的定义如图5-2所示。

![image-20210504105953367](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504105953367.png)

之所以在这里介绍这个方法的定义，原因是该方法的第三个参数才是MongoDB中对应collection的名字，如果漏掉了第三个参数，形如：

![image-20210504110023222](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504110023222.png)

Mongoose会自动创建一个名为logins的collection，相当于model名称的复数形式，那么之后在使用collection的时候就会发现一个预期之外的collection，Mongoose文档中也指出了这一点。

![image-20210504110048896](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504110048896.png)

关于Mongoose为什么这样做，其本意应该是希望开发者可以使用统一的Mongoose API作为访问接口来操作MongoDB，实践也证明了只要使用model接口就完全不需要直接调用底层的collection。

定义好model之后，调用model的save方法将数据存储在对应的collection中。接下来如果想要查询已经存储的数据，代码如下：

##### **代码5.12　使用Mongoose查询**

![image-20210504110146433](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504110146433.png)

doc 对象是一个包含所有结果集的数组，如果数据库中只有一条对应的记录，可以使用doc[0]来取出。

此外，Mongoose是默认支持Promise规范的，这就代表我们可以用ES201X的一些新语法来编写数据库代码。

#### 3．博客系统的数据库准备

在编写代码之前，首先要明确有哪些数据需要存储。

除了存储通常的登录信息外，我们需要维护一个关于博客信息的collection，该collection有如下字段：

- title：文章标题。
- kind：文章分类。
- id：文章id。

如读者所见，在本节定义的collection中，我们只维护了一张信息表，至于博客文章的内容本身，暂且将它们视为静态文件放在static/blogs文件夹下。

#### 4．Schema的定义

在目前的实现中，一共定义了两个schema，分别是 login 和 blogList，login 只负责登录，blogList 则被用作博客相关的操作。

![image-20210504110544588](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504110544588.png)

#### **5．数据查询的实现**

数据查询分为两个阶段，第一阶段是数据库查询并返回结果，第二阶段是前端页面根据返回的json字符串渲染出对应的页面元素。

当访问我们的博客网站时，首先会被默认导航至首页——博客列表。这里以文章的分类作为条件进行查询，如果用户没有选择任何分类，则返回全部文章。

下面是查询部分的代码。

**代码5.13　查询某个分类下的全部文章**

![image-20210504110740155](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504110740155.png)

该方法返回一个包含着若干对象的数组，可以直接用来被前端解析。

### 5.5.4　文件上传

处理文件的上传，大致分为下面的两步：

- （1）路由收到前端的post请求，将文件存储在static目录下。
- （2）将form中的文件名、类别信息写入数据库，并赋给这篇博客一个用于访问的id。

文件的上传我们使用**formidable**来实现，formidable是一个著名的用来处理文件上传的第三方模块，被广泛地用在Node Web应用中（不过也因为历时过长导致开发者没什么热情继续维护了，我们会在接下来提到这一点）。

负责处理文件上传的模块**upload.js**如下，dealUpload是被对应的路由调用的方法，如果读者愿意，也可以将其实现成一个中间件。

**代码5.14　upload.js**

![image-20210504111256513](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504111256513.png)

下一步是将博客信息写入数据库，我们计划给每一篇博客增加id，这一属性是从1开始自增的，因此在插入新的数据前，要获取数据库中最大的id。

**代码5.15　查找ID的最大值**

![image-20210504111358921](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504111358921.png)

在上面的代码中使用了两个async方法，queryMaxID方法使用了一条链式查询：

![image-20210504111418021](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504111418021.png)

在mongodb中没有其他数据库里的max或者min方法来取最大值和最小值，惯用的做法是先按照id进行排序，然后取第一条。

#### 1．对文章的修改

下面要实现的功能是文章的删除和修改，由于我们没有实现一个线上的文本编辑器，因此只能删除一篇文章或者修改文章的分类。

对应的路由代码以及相关的数据库操作：

![image-20210504111553781](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504111553781.png)

**代码5.16　删除和修改blog的分类**

![image-20210504111648544](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504111648544.png)

#### 2．使用MongoDB存储文件内容

在目前的系统中，我们将文章以静态文件的形式存放在目录下，在实践中通常是不安全的，通常需要将其存在数据库中，博客文章存储在数据库中通常还要经过加密，我们这里省略了这一步。

本章的网站采取用户本地上传的做法，那么在用户上传成功后，就要将文件内容写入数据库中。

**代码5.17　在文件上传成功后写入数据库**

![image-20210504111929364](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504111929364.png)

此外，还要修改upload.js。

![image-20210504112107714](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504112107714.png)

当成功上传一个文件后，在MongoDB中查询如图5-3所示。

![image-20210504112131148](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504112131148.png)

#### 3．文章内容的读取

当用户单击页面元素试图打开文章时，我们需要用id作为参数在数据库中进行查询。

![image-20210504112157789](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504112157789.png)

我们已经看到文章的存储形式，整片文章都是使用字符串的形式来存储的，对于Koa而言，直接使用：

![image-20210504112215693](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504112215693.png)

就能在前端返回文章内容，目前我们的文章访问是交给静态文件来处理的，需要新增相应的路由。

**代码5.18　打开博客内容的路由设计**

![image-20210504112338199](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504112338199.png)

### 5.5.5　页面渲染

## 5.6　构建健壮的Web应用

### 5.6.1　上传文件验证

允许用户上传文件其实是很危险的操作，因为你无法期望所有用户都能上传有效合法的文件，因此有必要对上传文件进行验证。

#### 1．限制文件类型

对于我们的博客网站，文件类型通常只有js/html/css三种类型的后缀名，再加上一些图片后缀或者pdf，系统应当对上传文件的后缀名进行检查，如果不是上述类型的文件名后缀，应该拒绝服务并返回错误码。对文件类型的验证通常在客户端完成，读者可以根据自己的需求来设定。

#### **2．限制文件大小**

对于网站来说，通常在任何情况下都应该避免大文件的上传，如果服务器对上传的文件没有进行正确的处理，很容易就会出现内存不足的情况，过大的文件也会浪费服务器磁盘空间。

验证文件的大小可以通过两个方面来进行：

- 第一是在客户端上传之前就对文件大小进行判断。
- 第二是在服务器端进行处理时进行验证。

**代码5.20　前端验证文件类型和大小**

![image-20210504113008415](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504113008415.png)

上面的JavaScript代码很简单，在提交表单前先计算文件大小，符合要求再进行下一步操作。

**下面是服务器针对文件大小的验证。**

**代码5.21　服务器端验证上传文件大小**

![image-20210504113119430](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504113119430.png)

如果上传的字节超过一定大小就拒绝接收并返回错误码，乍一看和上面的前端处理有些重复，但恶意访问者有可能篡改前端代码，因此后端的验证也是必需的。

Formidable模块可以做到这一点，该模块使用流来处理上传的文件，我们可以定义一个maxFileSize属性。在处理文件流的过程中可以获得已上传的文件大小，如果超过了预设的maxFileSize值就会触发error事件并停止接收文件，此时可以返回客户端一个错误消息。

**笔者在写上面的代码时，formidable在npm上的最新版本是1.1.1，在这个版本中设置maxFileSize不会生效，即使检测到了文件大小超出限制也不能取消上传。**

笔者注意到GitHub上master分支的代码要比1.1.1版本要新，于是直接使用了GitHub上的代码，发现设置可以生效（这就很尴尬了）。通过比较发现，应该是GitHub上的最新代码没有即使发布到npm上面。

这是一个典型的缺少社区维护者的例子，因为即使是GitHub上的代码也已经是两个月之前提交的了。

### 5.6.2　使用Cookie进行身份验证

我们至今开发出来的站点是无状态的，在这一节会增加权限控制相关的内容。就笔者的观察，大型项目中的权限系统总是问题最多并且最难管理，即使是像本章这样的个人站点，想实现完善的权限控制也不是容易的事。

#### 1．关于Cookie

Cookie是在RFC2109（已废弃，被RFC2965取代）里初次被描述的，是为了辨别用户信息而存储在客户端的数据。

每个客户端最多保持三百个Cookie，每个域名下最多20个Cookie（实际上一般浏览器都支持更多的数量，如Firefox是50个），而每个Cookie的大小为最多4KB，不过不同的浏览器都有各自的实现。对于Cookie的使用，最重要的就是要控制Cookie的大小，不要放入无用的信息或者过多信息。

**无论使用何种服务端技术，只要发送的HTTP响应中包含如下形式的字段，则视为服务器要求客户端设置一个Cookie：**

![image-20210504113518266](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504113518266.png)

支持Cookie的浏览器都会对此做出反应，即创建Cookie文件并保存（也可能是放在内存中），用户以后在每次发出请求时，浏览器都要判断当前所有的Cookie中有没有处于有效期（根据expires属性判断）并且匹配了path属性的Cookie信息，如果有的话，会以下面的形式加入到请求头中发回服务端：

![image-20210504113552196](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504113552196.png)

#### 2．Node中的Cookie

Node设置Cookie很简单，response对象提供了原生的Cookie方法，其声明如下：

![image-20210504113632342](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504113632342.png)

#### 3．Koa中的Cookie

Koa 中对 Cookie 的操作本质上还是对 Node 原生方法的封装，在之前的小节里我们列出了 ctx 对象中包含的方法，里面已经包括了 Cookie 相关的操作。

![image-20210504115335660](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504115335660.png)

这表示我们不用再引入 Cookie 解析的中间件进行处理，在博客系统中，我们主要针对用户登录进行 Cookie 设置。

##### **代码5.22　修改route.js的代码**

![image-20210504115545363](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504115545363.png)

在上面的代码中，我们设置了名为LoginStatus的Cookie，之后要做的就通过Cookie来验证登录状态。

##### **代码5.23　验证登录状态**

![image-20210504115614434](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504115614434.png)

如果按照通常的思路，validateStatus 这一方法应该放在 route.js 中，在收到路由请求后调用，例如：

![image-20210504115637034](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504115637034.png)

但这样做的缺点很明显，那就是在每一个路由方法中都要调用该函数，这样会带来很多重复代码。更好的做法是将其用中间件的方式来加载，这样每个路由请求都会经过该中间件。

##### **代码5.24　将登录验证作为中间件来实现**

![image-20210504115921149](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504115921149.png)

上面的这个中间件首先会尝试获取名为loginStatus的Cookie，如果没有设置，就将请求重定向到/login路径，注意在判断的时候需要加上ctx.url!="/login"的判断，否则当用户第一次访问/login的时候，由于没有还设置cookie，就会造成循环重定向，最后在浏览器中显示一个重定向次数过多的错误。

然后在root.js中挂载该中间件，注意应该在路由中间件之前加载，这样每个路由请求在处理前都要进行登录验证。

![image-20210504120100098](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504120100098.png)

该中间件的最终运行效果如图5-5所示。当访问localhost:3000时，浏览器页面跳转到localhost:3000/login。

![image-20210504120136208](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504120136208.png)

在输入正确的用户名和密码后，页面跳转至localhost:3000/blogList，如图5-6所示。

![image-20210504120147530](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504120147530.png)

### 5.6.3　使用Session记录会话状态

关于Session，不应混淆的是 Session 规范和 Session 的实现。

Session 与其说是一种规范，不如说是一种概念，**表示用户从进入到离开网络应用的这段时间内产生的动作以及上下文**。

Session 并不是 HTTP 的独创，而是广泛地体现在各种网络应用和数据库操作中，例如使用 FTP 协议传输文件，那么从登录到下载文件完成然后离开的这段时间就可以称为一个 Session 。更普遍的例子，从拿起电话到拨号然后打完电话离开也是一个Session，而且更接近其语义上的概念（会话）。

#### **1．HTTP 中的 Session**

还是以打电话为例，HTTP 服务器就像和多数的用户同时打电话那样，然而每次说完一句话，服务器就会忘记电话那端是谁，这样的话和多个用户的通话就会带来混乱。

早期的 HTTP 应用是不可交互的，用户只能浏览静态页面，用户状态的问题还没有暴露出来，随着互联网的发展，出现了更复杂的交互式应用，最好的例子就是电商网站，这时 HTTP 协议已经获得广泛的应用，想推翻重来也是不现实的。因此，对于 HTTP 协议来说，折中的方法就是利用Cookie来实现Session。

**既然 Cookie 每次都要随着 HTTP 请求发给服务器，那么只要给每个 Cookie 一个唯一的 id，就能知道请求来自哪一个用户了，就像前面打电话的例子，只要每个用户在最后说一下自己的名字，服务器就能知道电话那端是谁了。**

#### 2．创建Session

一般来说，创建一个Session可以分为以下几步：

（1）生成一个Sessionid，这个标识符是唯一的。

（2）将 Sessionid 存储在内存里，这是一句废话，调用代码生成 Sessionid 后，其自然是位于内存中的，不过如果服务器一旦断电或重启，Session 的信息就会丢失，因此通常使用一些其他的技术来进行持久化，例如 Redis 来持久化。

（3）将带有Sessionid的Cookie发送给客户端。

#### 3．在 Koa 中使用 Session

在 Koa 中使用 Session 可以考虑使用 koa-session 这一中间件，其使用方式也很简单：

![image-20210504154753180](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504154753180.png)

其中app.keys代表加密用的密钥，我们可以不去设置它。

下面看一个简单的例子。

**代码5.25　koa-seesion 的例子**

![image-20210504154901187](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504154901187.png)

**使用 koa-session 有一些注意点**，由于 Cookie 的设置是跟在 HTTP 响应之后，也就是说，要设置一个用作 Session 的Cookie，生成 Cookie 的操作是在：

![image-20210504155015622](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504155015622.png)

这一行代码中进行的，之后设置了 Ctx.body 的内容，Cookie 就会随着 HTTPresponse 发送到客户端了。

打开控制台，**生成的 Cookie 如图5-7所示**。

![image-20210504155157787](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504155157787.png)

可以看到value字段的值是一个看似随机的字符串，这就是我们之后要使用的sessionid，我们可以设置一个其他的路由，检测一下服务器端的Session是否在正常工作：

![image-20210504155221817](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504155221817.png)

得到的输出如图5-8所示。

![image-20210504155300100](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504155300100.png)

这证明设置的Session已经在正常工作了。

要在我们的网站中使用该中间件，将root.js代码修改为如下：

![image-20210504155319068](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504155319068.png)

## 5.7　使用Redis进行持久化

Redis是一个知名的key-value数据库，它由C语言实现，和MongoDB以及其他数据库不同的是Redis是一个内存数据库，关于Redis的数据类型和常用命令请参考附录D，这里不再介绍。

### 5.7.1　Node和Redis的交互

npm上有很多用于连接到Redis的第三方模块，我们使用最为流行的node-redis模块，使用**npm install redis**来安装。

安装完成之后，我们尝试使用node来连接Redis：

![image-20210504155530729](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504155530729.png)

运行结果如图5-9所示。

![image-20210504155747711](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504155747711.png)

在上面的代码里，我们连接Redis成功之后，设置了一个key为name，value为lear的键值对，我们可以在命令行中查询，如图5-10所示。

![image-20210504155816247](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504155816247.png)

### 5.7.2　CURD操作

#### 1．get

node-redis 模块提供的 API 都是对应 Redis 命令的映射，除了最后的回调函数，模块方法的参数就是对应命令的参数。

此外，所有的API操作都是异步的，在上面的操作中redis.print就是一个回调函数，用于打印命令的执行结果。

如果我们想在代码中获取刚才设置的值，可以使用get方法。

![image-20210504160142936](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504160142936.png)

如果想要更新数据值，也只需要再做一次set操作，原有的值就会被覆盖。

#### 2．SET

SET命令完整的定义如下：

![image-20210504160318373](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504160318373.png)

例如下面的这行代码只会对一个已经存在的key进行设置，并且设置了10s的过期时间，如果Redis中还没有对应的key，回调函数会返回null。

![image-20210504160341640](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504160341640.png)


可以写一段代码来验证过期时间是否有效：

**代码5.26　验证set方法的过期时间**

![image-20210504160426355](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504160426355.png)

**输出如图5-11所示。**

![image-20210504160443630](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504160443630.png)

从输出来看，经过11s后，我们设置的key已经过期了，它已经被Redis从列表中删除。

#### 3．DEL

删除数据可以使用del方法：

![image-20210504160621073](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504160621073.png)

如果试图删除一条不存在的数据，会返回一个0值。

#### 4．使用Promise实现同步调用

和MongoDB相同，Node对Redis的操作也都是异步进行的，这在某些情境下会变得不方便，于是我们又回到了第4章的问题上。

**对于node-redis模块来说，官方推荐的是使用bluebird来进行方法的Promise化，首先通过npm安装bluebird，然后使用bluebird.promisifyAll来将全部的方法转换为Promise，这个过程十分方便。**

![image-20210504160713450](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504160713450.png)

例如set方法的Promise版本：

![image-20210504160754221](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504160754221.png)

将所有方法转换成Promise之后，使用async方法就成了自然而然的选择。

**代码5.27　使用async方法调用Redis API**

![image-20210504160836975](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504160836975.png)

### 5.7.3　使用Redis持久化session

现在我们开始尝试将Redis用在我们的网站中，这个过程中，由于相关的文档缺乏，有时不得不通过阅读源码的方式来得到正确的用法。

要使用Redis来存储Session，仍然可以使用koa-session模块来完成；但需要做一些额外的配置。

我们需要给config增加一个store属性，这是一种类似于Java中接口的设计，只要config对象声明了该属性，就必须实现set、get和destory方法。

我们首先将程序的框架搭建出来，下面是修改后的config对象：

![image-20210504161022578](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504161022578.png)

三个方法的含义正如其字面意思。

#### 1．get

每次当服务器收到请求时，都会触发该方法。作为参数的key值就是客户端的sessionid，get方法的作用和下面这句：

![image-20210504161101182](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504161101182.png)

的作用是相同的。

#### 2．set

set方法则会在设置session时触发。该方法有三个参数：key、sess以及maxage。以之前的代码为例，当执行：

![image-20210504161138465](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504161138465.png)

会触发 set 方法，koa-session 模块会自动生成一个 key 值，sess 即是一个完整的 session 对象，maxage 是上面 config设置的过期时间。

#### 3．destroy

destroy方法则是在主动调用时才会触发，用于删除一条Session记录。

我们可以修改一下代码来观察koa-session在Redis配置下是如何工作的：

**代码5.28　koa-seesion和Redis**

![image-20210504161333068](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504161333068.png)

我们首先在Chrome控制台中清除所有的Cookie，再使用浏览器访问localhost:3000。

可以观察到程序首先调用set方法设置了一个Cookie，如图5-12所示，id的值为KBeXlWkSbPPlh9M6F9XBVYzwn7RELCfX，值的来源是http header的useragent属性，这个key-value键值对随后被写入到Redis。

![image-20210504161503328](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504161503328.png)

继续刷新页面，如图5-13所示。

![image-20210504161516425](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504161516425.png)

get方法被调用，打印出key值和value的值。

此时我们注意到服务器又设置了一个新的sessionid值，经过试验，发现每一次的请求都会分配一个新的sessionid。

这样做会产生一些问题，在set方法中，我们会不断将新的seesionid写入到Redis中，但每次请求都会产生新的id，显然会浪费Redis的空间，例如请求10次后Redis中存储的key值会变成下面这样，如图5-14所示。

![image-20210504161721025](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504161721025.png)

这10个值里面只有一个是有用的，我们希望针对一个客户连接只需要存储一个有用的sessionid就行了。

这个时候destroy方法的作用就显示出来了，那么可以在get方法后面调用destroy方法删除没用的id。

![image-20210504161814192](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504161814192.png)

服务器控制台输出如图5-15所示。

![image-20210504161845890](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504161845890.png)

再使用key *命令查看存储的key值，发现只剩了一个，如图5-16所示。

![image-20210504161901242](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504161901242.png)

在Redis中对于一个连接始终保持一个seesionid，为了验证这一点，我们可以使用别的浏览器来访问服务器地址，例如safari，再次查看Redis中存储的id，会发现多了一个，如图5-17所示。

![image-20210504161933475](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504161933475.png)

### 5.7.4　Redis在Node中的应用

#### 消息队列

一般来说，消息队列有两种场景，一种是发布者/订阅者模式，一种是生产/消费者模式。利用Redis，这两种场景的消息队列都能够实现。

**生产/消费者模式**：生产者生产消息放到队列里，消费者同时监听队列，如果队列里有了新的消息就将其取走，对于单条消息，只能由一个消费者消费。

**发布者订阅者模式**：发布者向某个频道（channel）发布一条消息后，多个订阅者都会收到同一份消息，这和发微博或者朋友圈的效果类似，每个订阅者收到的消息应该都是一样的。

下面是一个发布/订阅的例子，关于生产/消费模型我们会在第6章进行介绍。

**代码5.29　发布、订阅者模式**

![image-20210504162122793](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504162122793.png)

下面是订阅者的代码：

![image-20210504162150250](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504162150250.png)

## 5.8　Koa源码剖析

本节主要从源码的角度来讲述Koa，尤其是其中间件系统是如何实现的。

跟Express相比，Koa的源码异常简洁，Express因为把路由相关的代码嵌入到了主要逻辑中，因此读Express的源码可能长时间不得要领，而直接读Koa的源码几乎没有什么障碍。

Koa的主要代码位于根目录下的lib文件夹中，只有4个文件，去掉注释后的源码不到1000行，下面列出了这4个文件的主要功能。

- Request.js：对http request对象的封装。
- Response.js：对http response对象的封装。
- Context.js：将上面两个文件的封装整合到context对象中。
- Application.js：项目的启动及中间件的加载。

### 5.8.1　Koa的启动过程

首先回忆一下一个Koa应用的结构是什么样子的。

![image-20210504162616888](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504162616888.png)

Koa的启动过程大致分为以下三个步骤：

- 引入Koa模块，调用构造方法新建一个app对象。
- 加载中间件。
- 调用listen方法监听端口。

我们逐步来看上面三个步骤在源码中的实现。

首先是类和构造函数的定义，这部分代码位于Application.js中。

**代码5.30　Application.js类定义**

![image-20210504162706924](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504162706924.png)

首先我们注意到该类继承于Events模块，然后当我们调用Koa的构造函数时，会初始化一些属性和方法，例如以context/response/request为原型创建的新的对象，还有管理中间件的middleware数组等。

### 5.8.2　中间件的加载

上节我们也提到过，中间件的本质是一个函数。**在Koa中，该函数通常具有ctx和next两个参数，分别表示封装好的res/req对象以及下一个要执行的中间件**，当有多个中间件的时候，本质上是一种嵌套调用，就像前面的洋葱图一样。

Koa和Express在调用上都是通过调用app.use()的方式来加载一个中间件，但内部的实现却大不相同，我们先来看Application.js中相关方法的定义。

##### **代码5.31　use方法的定义**

![image-20210504162911083](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504162911083.png)

Koa在application.js中维持了一个middleware的数组，如果有新的中间件被加载，就push到这个数组中，除此之外没有任何多余的操作，相比之下，Express的use方法就麻烦得多，读者可以自行参阅其源码。

此外，该方法中还增加了isGeneratorFunction判断，这是为了兼容Koa1.x的中间件而加上去的，在Koa1.x中，中间件都是Generator函数，Koa2使用的async函数是无法兼容之前的代码的，因此Koa2提供了convert函数来进行转换，关于这个函数我们不再介绍。

##### **代码5.32　Application.js对中间件的调用**

![image-20210504163017887](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504163017887.png)

可以看出关于中间件的核心逻辑应该位于compose方法中，该方法是一个名为Koa-compose的第三方模块https://github.com/Koajs/compose，我们可以看看其内部是如何实现的。

**该模块只有一个方法compose，调用方式为compose([a, b, c, ...]) ，该方法接受一个中间件的数组作为参数，返回的仍然是一个中间件（函数），可以将这个函数看作是之前加载的全部中间件的功能集合。**

##### 代码5.33　核心方法——compose

![image-20210504163129928](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504163129928.png)

该方法的核心是一个递归调用的dispatch函数，为了更好地说明这个函数的工作原理，这里使用一个简单的自定义中间件作为例子来配合说明。

![image-20210504163209956](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504163209956.png)

可以看出这个中间件除了打印一条消息，然后调用next方法之外，没有进行任何操作，我们以该中间件为例，在Koa的app.js中使用app.use方法加载该中间件两次。

![image-20210504163250528](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504163250528.png)

上面我们也提到，**app真正实例化是在调用listen方法之后，那么中间件的加载同样位于listen方法之后。**

那么compose方法的实际调用为compose[myMiddleware,myMiddleware]，在执行dispatch(0)时，该方法实际可以简化为：

##### 代码5.34　简化后的compose方法

![image-20210504163409215](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504163409215.png)

可以看出compose的本质仍是嵌套的中间件。

### 5.8.3　listen()方法

这是app启动过程中的最后一步，读者会疑惑：为什么这么一行也要算作单独的步骤，事实上，上面的两步都是为了app的启动做准备，**整个Koa应用的启动是通过listen方法来完成的**。下面是application.js中listen方法的定义。

![image-20210504163506075](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504163506075.png)

上面的代码就是listen方法的内容，可以看出第3行才真正调用了http.createServer方法建立了http服务器，参数为上节callback方法返回的handleRequest方法，源码如下所示，该方法做了两件事：

- 封装request和response对象。
- 调用中间件对ctx对象进行处理。

![image-20210504163738964](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504163738964.png)

### 5.8.4　next()与return next()

在上节自定义的中间件validateCookie中，最后调用了return next方法来调用下一个中间件（router），如果将return去掉，再访问localhost:3000/login就会显示not found，同时控制台打印出提示：

![image-20210504163846138](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504163846138.png)

现在我们就接着这个话题来进行深入研究。

我们前面也提到过，Koa对中间件调用的实现本质上是嵌套的promise.resolve方法，我们可以写一个简单的例子。

**代码5.35　简单的中间件示例**

![image-20210504164007615](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504164007615.png)

代码5.35在第一行定义的变量ctx，我们可以将其看作Koa中的ctx对象，经过中间件的处理后，ctx的值会发生相应的变化。

我们定义了md1和md2两个中间件，md1没有做任何操作，只调用了next方法，md2则是对ctx执行加一的操作，那么在最后的then方法中，我们期望ctx的值为2。

**我们可以尝试运行上面的代码，最后的结果却是undefined，在md1的next方法前加上return关键字后，就能得到正常的结果了。**

在Koa的源码application.js中，callback方法的最后一行：

![image-20210504164135126](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504164135126.png)

中的fn(ctx)相当于代码5.35中第8行声明的Promise对象p，被中间件方法修改后的ctx对象被then方法传给handleResponse方法返回给客户端。

每个中间件方法都会返回一个Promise对象，里面包含的是对ctx的修改，通过调用next方法来调用下一个中间件。

![image-20210504164359391](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504164359391.png)

再通过return关键字将修改后的ctx对象作为resolve的参数返回。

如果多个中间件同时操作了ctx对象，那么就有必要使用return关键字将操作的结果返回到上一级调用的中间件里。

经过上面的介绍，现在再回到validateCookie方法，读者现在应该明白了为什么需要使用return next()而不是next()。事实上，如果读者去读Koa-router或者Koa-static的源码，也会发现它们都是使用return next方法。

### 5.8.5　关于Can't set headers after they are sent.

### 5.8.6　Context对象的实现

**关于ctx对象是如何得到request/response对象中的属性和方法的**，可以阅读context.js的源码，其核心代码如下所示。此外，delegate模块还广泛运用在了Koa的各种中间件中，后面的内容里会介绍这一点。

**代码5.36　ctx对象通过委托获得原生方法和属性**

![image-20210504165516111](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504165516111.png)

**delegate是一个Node第三方模块，作用是把一个对象中的属性和方法委托到另一个对象上。**

读者可以访问该模块的项目地址https://github.com/tj/node-delegates ，然后就会发现该模块的主要贡献者还是TJ Holowaychuk。

在上面的代码中，我们使用了如下三个方法：

- method：用于委托方法到目标对象上。
- access：综合getter和setter，可以对目标进行读写。
- getter：为目标属性生成一个访问器，可以理解成复制了一个只读属性到目标对象上。

getter和setter这两个方法是用来控制对象的读写属性的，**下面是method方法与access方法的实现**。

![image-20210504165700414](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504165700414.png)

method方法中使用apply方法将原目标的方法绑定到目标对象上。

**下面是access方法的定义，综合了getter方法和setter方法。**

![image-20210504165817940](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504165817940.png)

最后是delegate的构造函数，该函数接收两个参数，分别是源对象和目标对象。

**代码5.37　delegate的构造函数**

![image-20210504165905870](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504165905870.png)

可以看出deletgate对象在内部维持了一些数组，分别表示委托得到的目标对象和方法。

**关于动态加载中间件**

在某些应用场景中，开发者可能希望能够动态加载中间件，例如当路由接收到某个请求后再去加载对应的中间件，但在Koa中这是无法做到的。原因其实已经包含在前面的内容了，Koa应用唯一一次加载所有中间件是在调用listen方法的时候，即使后面再调用app.use方法，也不会生效了。

### 5.8.7　Koa的优缺点

**优点：**

- 通过上面的内容，相信读者已经对Koa有了大概的认识，和Express相比，Koa的优势在于精简，它剥离了所有的中间件，并且对中间件的执行做了很大的优化。
- 一个经验丰富的Express开发者想要转到Koa上并不需要很大的成本，唯一需要注意的就是中间件执行的策略会有差异，这可能会带来一段时间的不适应。

**缺点：**

- 现在我们来说说Koa的缺点，剥离中间件虽然是个优点，但也让不同中间件的组合变得麻烦起来，Express经过数年的沉淀，各种用途的中间件已经很成熟；而Koa不同，Koa2.0推出的时间还很短，适配的中间件也不完善，有时单独使用各种中间件还好，但一旦组合起来，可能出现不能正常工作的情况。
- 举个例子，如果想同时使用router和views两个中间件，就要在render方法前加上return关键字（和return next()一个道理），对于刚接触Koa的开发者可能要花很长时间才能定位问题所在。再例如前面的koa-session和Koa-router，笔者初次接触这两个中间件时也着实花了一些功夫来将他们正确地组合在一块。虽然中间件概念的引入让Node开发变得像搭积木一样，但积木之间如果不能很顺利地拼接在一块的话，也会增加开发成本。

## 5.9　网站部署

目前博客系统运行在本地主机上，通过http://localhost:3000/来访问，如果局域网有其他机器，也可以通过本地ip:3000的URL来访问我们的网站，但仅限于局域网内部，位于其他局域网中的计算机无法访问到这个网站。

目前有几种解决方式：

- 一种是通过购买云主机和域名的方法来部署在公网上；
- 另一种是将网站部署在本地，然后通过一些第三方工具来实现类似nat的功能；
- 再有就是部署在GitHub上，但仅限于静态资源。

### 5.9.1　本地部署

将网站发布到公网上通常要走一些复杂的流程，使用国内的云服务商和域名提供商，还要提供身份信息和备案信息等，对于个人开发者来说，如果嫌这些步骤麻烦，那么建议选择本地部署的方式。

#### 1．使用Localtunnel实现本地部署

localtunnel是一个有名的npm第三方模块，它可以很容易地将你的本地服务器映射到公网上，而且不用修改DNS或者防火墙设置。

#### 2．安装

localtunnel需要全局安装。

![image-20210504170610696](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504170610696.png)

#### 3．使用

首先我们要先把博客系统在本地运行起来，假设本地端口为3000，然后打开命令行，输入：

![image-20210504170644720](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504170644720.png)

该命令会生成一个随机的域名，开发者可以通过该域名来访问自己的网站，如图5-18所示。

![image-20210504170705852](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504170705852.png)

可以看出，localtunnel生成URL的格式为：随机字符串+localtunnel.me。

如果开发者不想使用随机字符串作为二级域名，可以使用–subdomain参数，用来指定一个二级域名，如图5-19所示。

![image-20210504170748901](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504170748901.png)

现在就可以使用该域名来访问我们的网站了，不需要任何额外的操作，唯一的缺点可能就是访问比较慢。

通过这种方式部署的网站基本上无法进行SEO优化，也没办法支撑高并发，这不仅由开发者的本地机器决定，更是由localtunnel这种模式本身的特点决定的。

#### 4．localtunnel原理

实际上，所有外网的访问，都要先经过localtunnel.me这个网站中转之后，才能到达我们的本地主机上，也就是说localhost.me起到了转发作用，可以将localtunnel看作是一个反向代理服务器。

Localtunnel.me会在内部维护一张映射表，记录着每个二级域名和开发者本地主机的信息，当收到某个子域名下的请求时，会先在映射表中进行查找，然后将对应的请求或者响应信息转发出去。

从本质上说，所有的内网到外网的“穿透”，都是借助已经部署在公网上的服务器进行中转的，例如一些VPN服务提供商，往往也是通过某台服务器的中转再到达目标网站的。

如果localtunnel.me这个网站本身停止了服务，那么开发者本地的localtunnel模块也会变得不可用。

这也是为什么这种部署方式很难优化的原因，因为流量不是直接来自用户，而是经过了localtunnel服务器的中转，最直观的感受就是网页打开速度非常慢，这让所有的本地优化都失去了意义。但如果是访问量比较小的个人网站，这是比较推荐的方式。

### 5.9.2　部署在云服务主机上

#### 1．前提条件

需要一台Linux环境的网络主机或者VPS，这主要是因为我们用到了Redis，因此不能使用Windows；如果读者不适应纯命令行的Linux环境，使用一些带有图形界面的发行版，例如Ubuntu也是不错的选择。

需要一个域名（不是必备）。

首先，要将编写完毕的代码上传到云主机上，使用FTP是比较方便的选择，可以自行配置，如果想省事的话直接用网盘甚至邮箱传输也可以。但为了方便版本的管理，还是推荐自行搭建git server，笔者使用的是gitblit，读者可以自行安装和配置。

假设云主机的ip地址为123.45.6.7，那么当我们的程序在云主机上开始运行时，本机通过localhost:3000来访问应用程序，对于外部请求，访问http://123.45.6.7:3000即可看到结果。

事实上，上面已经完成了整个网站的部署，在任何有网络连接的地方，都可以通过上面的地址来访问我们的博客。如果不追求访问的便利性，网站的部署在这一步就可以结束了，但实际上，往往需要一个域名来便于记忆和传播。

Node本身并没有提供域名相关的API，需要借助一些第三方技术来实现。

#### 2．Nginx实现域名的绑定

读者可能不熟悉Nginx，但没关系，笔者也不熟，因为只需要Nginx的部分功能，做好配置之后只需要开启Nginx服务就可以了。

**Nginx是一个高性能的HTTP及反向代理服务器，主要使用它的反向代理功能。**

假设我们的域名是example.com，并且已经在域名服务商哪里将解析ip指向了123.45.6.7这个ip。

那么当有用户访问example.com时，域名提供商就会将请求转向123.45.6.7的80端口，而我们的系统运行在3000端口下，并且Linux下非roo用户无法监听1024以下的端口，这时就要Nginx登场了。

下载好Nginx的Linux版本之后，打开conf文件夹下面的nginx.conf，在http域里面，第一个server域下面添加如下内容：

![image-20210504171535753](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504171535753.png)

**Nginx的大概思路就是将来自外部对80端口的请求转到3000端口，从而实现域名和Node应用的绑定。配置完成之后，启动Nginx进程，或者将其配置成守护进程。**

之后在域名提供商那里将域名绑定到云主机的ip上，就能用域名来访问我们的网站了。

### 5.9.3　通过GitHub pages来部署

这项功能一经推出就受到了开发者的热烈欢迎，毕竟不是谁都需要一个带数据库操作，并且支持高并发的网站，大多数的个人项目还是以静态的资源展示为主。

GitHub的这项功能可以将仓库中的静态文件映射到GitHub的一个二级域名下，我们实际操作一下试试看。

首先需要建立一个新的GitHub仓库，名字为用户名+github.io，以笔者为例，仓库的名字为Yuki-Minakami.github.io，在初始化项目时，最好勾选readme选项。

仓库建好之后，打开settings选项卡，到GitHub Pages这一栏，如图5-20所示。

![image-20210504171806875](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504171806875.png)

会发现GitHub已经帮我们建立了一个二级域名，试着打开这个链接，会发现页面上出现的是readme的内容，如图5-21所示。

![image-20210504171844560](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504171844560.png)

我们的二级域名默认会打开仓库根目录下的index.html，在通常意义上为项目的首页地址。

对于一个要求不高的博客网站，部署在GitHub上算得上是最优解，我们完全可以使用Git来实现文件的上传和删改，想要更改分类的索引，也可以通过手动更改index.html的内容来实现，不过当文章数量增加的时候可能就不是那么方便了

## 5.10　总结

在这一章，我们使用Koa框架来初步搭建了一个博客系统，并且实现了文章的上传、浏览、分类等基础功能。

除此之外，还对Koa本身的实现做了深入的探究，Koa充分使用了ES2015至今的新特性，无论是架构还是代码比起前身的Express都有了很大的改进。

笔者认为，Koa会逐步地取代Express的市场，对于Koa本身推广的最大障碍不是其本身，而是大多数开发者还不够了解这一框架这个事实，笔者期望越来越多的开发者开始尝试Koa，充分享受ES6新特性带来的开发效率。

## 5.11　引用资源

- https://github.com/Koajs
- https://cnodejs.org/topic/56936889c2289f51658f0926
- https://cnodejs.org/topic/573076d5f0bc93db581a6c54
- https://redis.io/commands
- http://www.redis.cn/topics/data-types.html
- https://github.com/koajs/session
- http://mongoosejs.com/docs/guide.html
- https://github.com/localtunnel/localtunnel
- https://docs.mongodb.com/manual/reference/mongo-shell/

# 第6章　爬虫系统的开发

对于想要批量搜集互联网上某一领域的信息，爬虫是一种很便利的技术。在大数据时代，不少人脑门一拍就准备做大数据，然而没有数据怎么办呢？很多人的目光就投向了爬虫。

据称互联网一半的流量都是爬虫带来的，最常见的爬虫属于搜索引擎，谷歌和百度的爬虫每时每刻都在采集互联网上的信息，网站如果想要提升自己在搜索结果中的排名，SEO也是一项不可缺少的技术。

对于不想让爬虫获取的内容，可以在网站根目录下定义robot.txt来限制爬虫的访问。以GitHub为例，其robots.txt的部分内容如图6-1所示。

![image-20210504172401716](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504172401716.png)

robots.txt并没有任何技术上的限制，而是默认爬虫会遵循的一种道德协议，但网站开发者通常无法保证所有用户都是带着善意访问网站的，除了搜索引擎外，还有一些以其他目的访问站点的人在，例如商业竞争对手之间互相爬取对方的价格信息（例如电商网站和在线旅游服务总是爬虫泛滥的重灾区）。

本章会实现一个相对简单的爬虫系统，但和搜索引擎爬虫有很大区别，页面元素解析和后续操作都不是重点，**本章更多的将重点放在异步流程的处理和消息队列上，完整的代码实现可以参考笔者的GitHub下名为PHelper的项目，它最初是为了爬取某个特定网站被开发出来的，但目前已经剥离了特定网站的逻辑，变成了一个比较通用的爬虫框架。**

在吴军的《数学之美》一书中，曾经提到了开发爬虫系统的几个要点：

（1）采用DFS还是BFS。

（2）页面信息的提取，我们用cheerio实现。

（3）将已经访问过的地址记录下来。

针对这些要点，我们会在下面的章节中介绍。

## 6.1　爬虫技术概述

## 6.2　技术栈简介

## 6.3　构建脚手架

## 6.4　进行批量爬取

## 6.5　爬虫架构的改进

## 6.6　进程架构的改进

## 6.7　反爬虫处理

## 6.8　总结

## 6.9　引用资源

# 第7章　测试与调试

## 7.0　概述

### **1．为什么需要强调测试**

有一点需要承认，那就是Node本身的容错性并不是很强。作为动态语言，无法在静态编译阶段提前发现错误。如果有代码抛出异常而没有相应的处理方法，那么整个Node进程都会崩溃。

另一方面，即使在代码编写中没有问题，也难以发现回调中潜在的异常。Node的早期版本中，曾经提供Domain模块（现在也依然保留）来处理这个问题，但遗憾的是似乎并没有达到预想的目标，而且至今社区也没能给出一个更好的方案。

上面之所以提到Node错误处理的不完善之处，就是要提醒读者意识到编写良好测试，尤其是单元测试对Node应用的重要性。

### 2．常见的概念

经过数十年的实践，业界目前流行的测试方法只有黑盒和白盒两种，至于测试手段则分为下面几种：

- 单元测试
- 基准测试
- 集成测试
- 压力测试

这些测试方法都是基于不同的维度对代码进行考量。

### 3．代码覆盖率

代码覆盖率是单元测试的一个重要指标，我们通常从下面几个维度来考察代码覆盖率：

- 行覆盖率：考察是否每一行代码都被执行。
- 函数覆盖率：确保覆盖每个函数调用。
- 分支覆盖率：确保覆盖每个条件分支代码都被覆盖。
- 语句覆盖率：考察是否每个语句都被执行了。

### 4．测试驱动开发（TDD）

测试驱动开发（Test-driven development，缩写为TDD）是一种软件开发过程中的应用方法，由其倡导先写测试程序，然后编码实现其功能得名。测试驱动开发始于20世纪90年代。测试驱动开发的目的是取得快速反馈并使用“illustrate themain line”方法来构建程序。

测试驱动开发的优点很明显，首先是开发阶段，编写了测试用例之后，能够确保之后编写的功能代码可用。

其次是在重构阶段，很多时候重构过程会十分痛苦，原因就在于程序经常会在修改代码后变得不可用，如果一次性改了太多地方，一步步定位错误代码将是一场噩梦，如果有了测试用例的辅助，这个过程会轻松很多。

本章会为我们前面实现的应用编写测试用例，主要是第5章的博客系统和第6章的爬虫系统。

## 7.1　单元测试

## 7.2　测试现有代码

## 7.3　更高维度的测试

## 7.4　调试Node应用

## 7.5　总结

## 7.6　引用资源

# 第8章　Node中的错误处理

## 8.0　概述

为什么错误处理需要单独地拿出一整章的篇幅来叙述？

因为在Node之前，大多数开发者可能还没有机会接触到异步过程中的错误处理。

前端JavaScript开发者可能有过一些经验，随便打开一个网站，然后查看控制台的输出，都可能会发现一堆红色的error。但浏览器是“宽容”的，一方面它的代码只运行在客户端，另一方面就算JavaScript代码中出现了错误，整个应用程序也不会退出，甚至有时根本就不影响页面的访问，最多是某些页面元素失去了响应而已。

而Node则是需要“严肃”错误处理的语言，Node服务器为成千上万的客户端提供服务，再加上它是单线程的，而且还是一门动态语言，这意味着任何微小的错误都可能会导致Node进程退出，这也是**Node长时间被人诟病的缺点之一**。

此外，除了开发者自己写的代码之外，Node程序通常还会引入一些第三方模块，打开node_modules查看，里面可能有几千个文件、上万行代码，关于代码行数和bug数量有一个CMMI衡量标准。

能达到CMM5的企业屈指可数，对于水平良莠不齐的开源社区来说，如果认为其处于CMM3和CMM4之间，粗略地估算一下，那些第三方模块中也至少存在着数10个bug。

**为了应付潜在的错误，比较常用的做法是在全局的范围内监听error事件，使用类似下面代码的方式来防止进程退出，还会使用forever/pm2等可以重启进程的工具来加上双重保险。**

**代码8.1　最简单的错误处理**

![image-20210504174053921](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504174053921.png)

但使用代码8.1的处理方式要慎重，很多人将其当成万能的处理方式而忽略了其他地方的错误处理。此外，假设是在Web服务中出现了错误，**使用uncaughtException（未捕获异常）捕获异常就会丢失错误发生时的上下文，不利于定位错误代码。**

因此在实践中，监听uncaughtException事件是错误处理的最后防线而不是唯一的制胜法宝，社区也有提议将该事件从Node中直接移除。

## 8.1　Error模块

Error类定义了Node常见的错误类型，其同样属于固有类型，**不需要require引入**。

**Class:Error**

一个error对象包含一个堆栈轨迹来描述Error是在哪里产生的，并且有时会包含一些具体的描述信息，一般会定位到某一行代码中。

Node程序产生的所有Error都是Error类的示例或继承自Error类，我们可以通过Error的构造方法来自定义一个Error对象，并使用throw关键字将其抛出，例如：

![image-20210504174335788](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504174335788.png)

下面是Node定义的几种错误类型：

![image-20210504174520373](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504174520373.png)

## 8.2　错误处理的几种方式

**比较常见的错误处理方式有三种，分别是try/catch、callback和EventEmitter（下面仍简称event）。**

try/catch的思想很简单，只适用于同步调用的情况，callback则是通过定义回调的参数来解决，如果参数err的值不为空就表示出现错误。

event的情况比较特殊一些，还记得stream吗？我们在第2章花了一些篇幅来介绍它，其中createReadStream方法虽然是一个同步操作，但我们却没办法用try/catch来捕获异常，而且同步操作也没有callback可以用，这是因为该方法返回了event对象，只能用事件处理的方式来处理异常。下面我们分别来介绍这几种方式。

### 1．try/catch

在其他编程语言，例如Java、C#通常使用try/catch方法，再配合throw语句来抛出及捕获异常，在Node中也是如此，但**仅限于同步调用的情境下。**

**代码8.2　使用try/catch捕获异常**

![image-20210504174718109](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504174718109.png)

**但是try/catch无法捕获异步回调函数中出现的异常，原因是异步调用返回时，代码的上下文已经切换，回调函数已经脱离了try/catch的范围。**

![image-20210504174827467](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504174827467.png)

同步过程中的回调则不受影响，例如：

![image-20210504174843542](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504174843542.png)

### 2．callback

为了处理异步过程的错误，Node 回调函数通常接受两个参数：err 和 result，这两个值必然有一个非空。

**代码8.3　在回调中处理错误**

![image-20210504175036190](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504175036190.png)

上面的代码中，如果foo.txt不存在，就会出现下面类似的错误，该错误作为回调函数的第一个参数返回。**这种风格被称为error-first callback，最早就是在Node中被应用的，然后随着Node的流行变成了一种约定的标准。**

![image-20210504175137448](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504175137448.png)

### 3．基于Event的错误处理

Event的情况比较特殊一些，例如fs.createReadStream方法虽然是一个同步操作，但我们却没办法用try/catch来捕获异常，例如下面的例子，在foo.txt不存在的时候，try/catch依旧无法捕获到异常。

![image-20210504175214062](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504175214062.png)

对于stream来说，需要通过监听error事件的方式来处理错误

![image-20210504175226401](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504175226401.png)

## 8.3　被抛弃的Domain（跳过了）

Domain和上节提到的几种方法不在一个层次，它试图在一个更高的维度将三种错误处理的方法合而为一，但以现在的目光来观察Domain，就会发现这种努力实际上失败了。

## 8.4　ES6中的错误处理

在ES6落地之后，错误处理确实变得比原来轻松一些了，一个重要原因就是异步处理的重心从回调转移到了Promise上。

### 8.4.1　Promise

ES6的一个重要趋势就是使用Promise来取代回调，Promise提供了catch方法来捕获异常，我们在之前的章节中也已经提到了，例如：

![image-20210504175420491](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504175420491.png)

如果Promise执行过程中出现了错误，就可以被catch方法捕获。

### 8.4.2　Generator

可以直接使用try/catch语句来捕获yield语句中的异常。

![image-20210504175516232](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504175516232.png)

上面的代码中，如果yield后面的异步操作出现错误，可以被try语句捕获。

### 8.4.3　async函数

async相当于加了执行器的Generator，同样可以使用try/catch进行处理，在async方法内部如果有await操作出错，那么后续的代码将不会被执行，比较妥当的做法是将所有的await操作都用try/catch包裹起来。

![image-20210504175614503](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504175614503.png)

## 8.5　Web服务中的错误处理

### 8.5.1　针对每个请求的错误处理

在Node作为Web服务器的场景中，我们希望能够对每一个用户的请求都有类似的错误处理机制，当用户的访问出现错误时进行对应的处理，例如返回一个500的状态码。

如果通过监听process对象的uncaughtException事件来实现，开发者就无法知道是哪一个HTTP请求出现了错误，出现错误的请求会失去响应，等待超时后再由浏览器提示错误，这样对用户不够友好。

下面给出了一个简单的例子。

**代码8.8　针对每个请求的错误处理**

![image-20210504203127167](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504203127167.png)

上面的代码里，如果用户访问了不存在的文件，就会立刻返回一个500的状态码，然后显示请求失败。

### 8.5.2　Express中的错误处理

我们之前已经介绍过了Express的错误处理中间件。

![image-20210504203222203](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504203222203.png)

错误中间件常常作为最后一个中间件被加载，意在捕获之前的所有中间件可能出现的错误。

### 8.5.3　Koa中的错误处理

回到最初的问题上，如果一个HTTP请求在处理的过程中出了错误，如何能最快地返回一个错误响应？

由于Koa2使用了async方法，那么只要使用try/catch就可以捕获异常（是的，绕了一大圈最后回到try/catch上），至于进一步的处理，例如返回一个错误消息，可以通过中间件的方式来实现。

![image-20210504203419492](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504203419492.png)

上面的代码定义了一个中间件，如果try语句块中的代码，例如next方法出现了错误，那么通过后面的catch就可以捕获这个错误，并且立刻返回错误消息。**由于中间件的调用是嵌套的，所以上面的代码实际上可以捕获后面所有中间件中出现的错误，前提是它们都是async方法。**

## 8.6　防御式编程与Let it crash

当我们进行程序设计时，不能期望用户总是按照我们的设想使用程序，尤其是针对一些边界条件和错误输入。有个很出名的关于QA的笑话：

![image-20210504203542858](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504203542858.png)

这个笑话很形象地向我们表明了为什么我们需要防御式编程，测试工程师模拟的就是用户的行为。



在实际操作中，用户的输入和操作是不可预测的，程序员有必要对其进行约束，保证用户的行为不会对程序功能造成负面影响。

防御式编程不仅仅对外，对于内部可能有多重结果的操作，例如一个IO操作，也要做好相应的处理。

举个简单的例子，Java中为了避免代码执行出现错误，例如新建一个thread，通常使用try/catch将相关代码包裹起来，或者在调用该操作的方法上抛出一个exception。

下面我们给出一段Java代码，这是一个发起HTTP请求并解析结果的例子：

![image-20210504203654559](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504203654559.png)

代码8.9只做了一件事，向http://localhost:3000发起一个get请求，然后将响应头和内容体打印出来。在代码8.9中，我们不得不为各种各样潜在的异常做准备，通常情况下，开发者需要为每一处可能出现异常的地方增加try/catch语句。

然而大多数程序员都会在编写try/catch时偷懒，就像代码8.9一样，使用try语句将整个执行过程包裹起来，这就注定了外层的Exception只能是最顶层的Exception类，当代码块中包含了多层函数调用时，这种写法对确认异常的来源和种类几乎毫无帮助。

当项目的规模增加到上万行代码时，代码中可能已经潜伏了一些bug，我们有时没办法在运行之前找到它们，如果采取防御式编程，最有可能的是exception在经过传递后，变得更加难以定位和调试。

#### Let it crash

这是另一种错误处理的思想，一个知名的实现就是Erlang，Erlang是一门专门为开发并行程序而被设计编程语言，也就是说即使一个Erlang进程崩溃了，也不会影响其他进程的运行。

Let it crash的核心思想是：

![image-20210504204247517](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504204247517.png)

当你遇到一个预期之外而不知道如何处理的异常时，Let it crash是一种稳妥的做法。

这当然不是指来自用户的外部输入，我们只需要舍弃不合规则的输入即可，let itcrash主要针对程序的内部状态。

开发者应当知晓他们程序中可能会出现的所有异常，但这通常难以做到。对于未知的异常要如何处理，开发者有两种选择：要么使用顶层的exception将其捕获，接着返回一个错误消息或者什么也不做，程序得以继续运行下去；要么就直接让其崩溃，随后重启进程。

比起小心翼翼地到处提防可能出现的错误，倒不如直接让它暴露出来。就算开发者手动捕获了某个严重的错误使得程序能够苟延残喘地运行下去，但很可能已经得不到预期的结果了。

**使用Let it crash有两个前提条件需要满足：**

- 重启需要的时间短，或者不会频繁重启。
- 进程退出前的代码上下文可以恢复，或者至少关键的上下文可以恢复。

通过重启就能解决问题，这听起来很蠢，但无数成功的实践已经证明了这确实是一种行之有效的做法。

举个实际的例子，我现在任职的花旗集团使用VDI（Virtual DesktopInfrastructure，即虚拟桌面基础架构，可以认为是一种远程桌面，本地电脑只相当于一个连接用的客户端）来进行日常办公。由于使用人数众多，经常会遇到各种各样的问题，例如单击启动图标没有响应，或者干脆因为未知的原因无法启动，我们最常用的方法是打电话给support，support的操作通常就是重启VDI，并且在绝大多数情况下都能解决问题（除了每次都要等15分钟之外）。

假设VDI进程在运行过程中出现了错误，就算它仍然继续运行，也不能得到用户期望的结果了，即使用户多次请求，也只会得到重复的错误信息，那么不如最开始处理用户请求出现错误的时候就Let it crash，如果自动重启能够解决问题，用户也省去了每次打电话给support的步骤。

重启之后，它运行的上下文丢失了一些（之前打开的应用程序和未保存的代码都被重置），但这种丢失也在容忍范围内，因为最重要的数据仍存储在磁盘上。

Let it crash的标准做法是通过快速重启来解决预料外的错误，这和Erlang本身的设计是分不开的。在Erlang中，重启所需要的时间非常短（1毫秒左右），因此即使重启也不会有明显延时。但如果这个错误频繁发生导致多次重启，那么就要对代码本身进行排查了。

Node启动一个进程需要至少需要数10毫秒，频繁重启会造成明显的延迟。

**哪些需要防御式编程，哪些需要Let it crash需要加以区分，我们不希望程序以错误的状态继续运行下去，也不希望程序因为用户的简单错误输入而退出。**

**一般来说如果我们能够预知错误类型，都可以使用防御性编程来实现；如果程序运行的上下文难以恢复，也要慎重使用Let it crash。**

## 8.7　总结

本章主要介绍一些常见的错误处理方式，Node中进行错误处理大致有几种思路：

（1）在回调中进行处理。

（2）使用事件来处理。

（3）通过try/catch进行处理。

try/catch是符合大多数程序员思维的方式，但在Node中由于异步回调的原因，很长一段时间内得不到全面的应用，好在现在ES6以及更新的标准已经落地，可以预见后面多数的错误处理还是要回到try/catch上来。

此外还介绍了防御式编程和Let it crash的思想。希望读者通过本章能对Node中的错误处理有一个整体上的认识。

## 8.8　引用资源

![image-20210504205422394](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504205422394.png)

# 附录A　进程、线程、协程

## A.1　从操作系统说起

计算机诞生的初期，CPU的功能十分弱，但是当时的任务也很简单，通常是一个任务跑完了之后再跑另一个任务，程序员使用打孔纸带进行编程，一个任务就是一盘纸带，只能等放进去的纸带跑完了，再放进去一盘新的纸带。

后来计算机CPU速度提升，内存也比当初大了许多，但要处理的任务也明显变多了，计算机资源还是不够用，那么这时要怎么办呢，当时的程序员就想让计算机能够同时处理多个任务，但CPU只有一个，那么就先执行任务一一段时间，然后切换到任务二执行，这样在程序员看来，两个任务就能几乎同时完成了。

但这样也带来了问题，CPU可以切换任务，内存却不能在不同任务间切换，一旦内存被任务一使用了，如果任务二再使用相同的内存地址，要么读到错误的数据，要么任务一的内存被任务二覆盖。

为了解决这个问题，程序员们又想了一个办法，对每个任务增加标记（刚开始主要是内存地址），有了这些标记，CPU（其实是操作系统）就知道哪些内存正在被其他任务使用，就会使用其他的内存地址，这样就算切换任务也不会有影响。

读者可能注意到了，这其实就是**进程原始的形态**。

### 1．操作系统的执行策略

当操作系统发现一个正在运行的进程正在进行某项耗时操作时，通常会将CPU的执行权交给另一个进程，虽然现代操作系统通常采用时间分片的策略，但仍然存在这种切换，总之，进程的调度不是由用户而是由操作系统进行管理的。

对于同一个进程，可能会有多种操作，例如读取磁盘文件、发起网络请求等，在这段空闲时间里，操作系统通常会把CPU使用权交给别的进程，但这样会造成大量的时间都花在进程间切换上了。

为了解决这个问题，开发者们又想出一个新方法，就是在进程的基础上再抽象出一层（**线程的雏形**）不就可以了嘛。线程跟进程的关系与进程和操作系统的关系类似。

一个进程可以派生多个线程，它们共享进程的逻辑资源。

线程的执行需要开发者自行进行控制，如果执行不当，线程的执行也可能造成混乱（这种混乱仅限于进程内部），例如对线程同步不当造成了计算错误。

### 2．协程

协程，或者被称为协同程序，提供了一种协作式的多线程，每个协程都可以看作一个线程，区别是协程是彼此交错运行的，这表示一个时间点只能有一个协程在运行。

协程也可以理解为当前执行代码+上下文，上下文可以是寄存器的值、当前使用的内存地址等。从这个角度看，协程也不过是一种逻辑概念，大到操作系统切换进程（需要保存进程当前状态），小到块级作用域的切换，本质上都是协程的一种体现。

协程的作用也是在不同任务间进行切换，这和操作系统的调度很相似。对于CPU来说，一个CPU在一个时刻只能运行一个进程，协程也是同理，一个时间点只能运行一个协程，这和线程有显著区别，因为一个时间点可以有多个线程在同时运行。

协程和操作系统调度的一个区别在于现代操作系统的执行策略大都是抢占式的，并且受到操作系统的调度控制，而协程的任务的调度交给其自身来完成。

## A.2　Node中的协程

Node中能够体现协程概念的是Generator，但由于Node代码运行在单线程环境中，因此和真正的协程还是有些区别。

在多线程环境下，一个协程执行到中途中断（通常是发起一个耗时的系统调用之后），然后将控制权交给另一个协程，等待系统调用返回之后，再由另一个协程将控制权返还。这个过程在本质上是异步的，但可以用同步的方式来书写代码。

Node因为是单线程的，因此协程中断后只能在原地等待，等到系统调用返回后再继续向下，当面对多个异步操作时，就变成了完全的同步调用了。这虽然解决了长期以来的回调管理问题，但也有可能变成新的历史包袱。

例如TJ就认为Node中最终会引入像Go语言中那样的协程，而async/await会在未来变成新的负担。

# 附录B　Lua语言简介

Lua是一门小巧的脚本语言，由巴西里约热内卢天主教大学的RobertoIerusalimschy、Waldemar Celes和Luiz Henrique de Figueiredo于1993年开发。在开发之初Lua只是作为一种内部语言为两个特定的项目提供服务，虽然他们没有详细说明这两个项目是什么，但我们可以大致猜测到Lua在这中间发挥了怎样的作用。

在现代企业开发中，Lua通常被作为胶水语言，在游戏领域的应用尤为频繁。 **没看完**

# 附录C　从零开发一个Node Web框架

关于接下来要开发的Web框架，虽然读者可能已经有了Express或者Koa的经验，但笔者希望读者能够抛开脑海中的固定观念，因为并没有规定Web框架一定是某个样子的。

下面的内容就是一个简单的例子，实现了一个简单的Web框架，它保留了一些从Connect以来的约定做法，也增加一些新的特性，例如：

（1）使用use方法加载中间件。

（2）中间件的执行顺序为use加载的顺序。

（3）仍然使用req和res对象，不会像koa那样封装在一个ctx对象里。

（4）没有使用next方法来调用下一个中间件，而是通过res.end()来结束调用链。

定下上面的目标后，我们现在就准备动手，首先给它起个名字，就叫Loa了。 **还没看完**

# 附录D　MongoDB和Redis简介

## D.1　NoSQL

NoSQL（NoSQL = Not Only SQL )，意即“不仅仅是SQL”，是一项全新的数据库革命性运动，发展至2009年趋势越发高涨。NoSQL的拥护者们提倡运用非关系型的数据存储，相对于铺天盖地的关系型数据库运用，这一概念无疑是一种全新的思维的注入。

**NoSQL数据库在以下几种情况下比较适用：**

（1）数据模型比较简单。

（2）需要灵活性更强的IT系统。

（3）对数据库性能要求较高。

（4）不需要高度的数据一致性。

（5）对于给定key，比较容易映射复杂值的环境。

## D.2　MongoDB简介

MongoDB是由C++语言编写的，是一个基于分布式文件存储的开源数据库系统。在高负载的情况下，添加更多的节点，可以保证服务器性能。

**MongoDB旨在为Web应用提供可扩展的高性能数据存储解决方案。**MongoDB将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB文档类似于JSON对象。字段值可以包含其他文档、数组及文档数组。

MongoDB天生就和Node有很好的相似性，在本书需要使用数据库的地方，大都是用它实现的。

### 1．安装与启动

首先从官网下载MongoDB安装程序，解压出来通常是一个文件夹。

使用命令：

![image-20210504210221737](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504210221737.png)

来启动mongod。

mongod启动成功之后会有如图D-1所示的输出。

![image-20210504210240866](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504210240866.png)

mongod启动成功之后，再打开一个命令行窗口，输入mongo，就可以进入MongoDB的命令行界面了。如图D-2所示。

![image-20210504210257846](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504210257846.png)

### 2．常用命令

下面列出了一些常用的MongoDB命令。

#### （1）数据库相关操作

- use [DBName]：切换数据库，如果是一个不存在的数据库，那么将会创建一个新的DB。
- show dbs：显示所有的数据库。
- db / db.getName()：显示当前使用的数据库。
- db.dropDatabase()：删除当前数据库。

#### （2）Collection相关操作

collection可以理解为相似数据的集合，和关系型数据库中table的概念相似。

- show collections显示当前数据库中的所有collection。
- db.createCollection(name)创建新的collection。

#### （3）查询

db.[collectionName].find(option)显示collection中的所有数据。

option表示筛选条件，例如对于一个名为login的collection：

- db.login.find(“username”)：选出所有的username一列的数据。
- db.login.find({“username”: “Tom”})：选出username为Tom的记录。

find方法和SQL中的select语句功能类似，更多的用法请参照官网文档。

#### （4）curd操作

- db.[collection].insert(option)：向collection插入新数据。
- db.[collection].save(option)：向collection插入新数据。
- db.[collection].update(option)：更新collection中的数据。
- db.[collection].remove(option)：删除collection中的数据。

Insert和save都用来向指定集合插入数据，它们之间的主要区别在于如果试图插入一条主键相同的记录，那么save会更新原有的记录，insert则会直接忽略，并打印一条主键已经存在的错误提示。

## D.3　Redis简介

Redis是一个开源（BSD许可）的，内存中的数据结构存储系统，它可以用作数据库、缓存和消息中间件。它支持多种类型的数据结构，比如字符串（strings）、散列（hashes）、列表（lists）、集合（sets）、有序集合（sorted sets）、范围查询、bitmaps、hyperloglogs和地理空间（geospatial）索引半径查询。 Redis内置了复制（replication）、LUA脚本（Lua scripting）、 LRU驱动事件（LRUeviction）、事务（transactions）和不同级别的磁盘持久化（persistence），并通过Redis哨兵（Sentinel）和自动分区（Cluster）提供高可用性（highavailability）。

Redis有如下特点：

- 和mongodb相同，属于非关系型数据库。
- 和大多数将数据存储在磁盘的数据库不同，Redis属于内存数据库。
- 常用于缓存和中间件。

**还没看完**

# 附录E　使用Docker来实现虚拟化

我们使用了一个Ubuntu的发行版镜像作为开发环境，初次接触这个项目的我首先要配置开发环境，然后把现有的代码在本地运行起来。

然而这个项目的依赖比较复杂，我花了好长时间仍然不能把依赖正确地配置好，不是这里提示少安装了一个包，就是那边的服务启动不了，最后没有办法，组长只好将他正在使用的Ubuntu环境直接导出成镜像文件，然后再发给了我（一共4GB），我又花了一个小时，终于完成了安装。

**在开发团队中保持开发环境的统一是很重要的，在上面的例子里，我们采用了相当原始的方法来完成这一工作。**

**下面我们会介绍如何通过Docker来快速配置运行环境。**

Docker是一个开源的应用容器引擎，开发者可以打包项目的依赖到一个可移植的容器中，Docker最初只支持Linux，后面增加了对Mac OS X和Windows 10的支持。

还是用上面的例子，假设我们的Node项目依赖于一个本地的数据库环境，端口为3306，那么我们完全可以将数据库服务抽象成一台新的机器，并且开放了3306端口，这是一种“端口即服务”的思想。

## E.1　Docker的一些常用命令

![image-20210504212311851](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504212311851.png)

对于PHelper这个项目，我们需要两个镜像，一个用于运行Node服务，另一个用来运行Redis服务，**要使用Docker，首要需要一个名为DockerFile的配置文件。**

Node服务的Dockerfile：

![image-20210504212405720](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504212405720.png)

然后使用下面的命令打包镜像：

![image-20210504212419277](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504212419277.png)

最后会产生一个名为phelperimg的镜像。

运行：

![image-20210504212438215](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504212438215.png)

## E.2　Redis服务

Redis的运行是独立于Node的，因此可以直接使用现成的版本，可以直接从Docker Hub上pull一个下来。

![image-20210504212536848](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504212536848.png)

为了使用持久化配置，需要在当前目录下建一个data文件夹。

使用命令：

![image-20210504212552714](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504212552714.png)

两个Docker服务都运行起来后，就可以使用docker logs命令来查看Node进程的输出，和直接在控制台运行的结果相同。

通过观察，发现无论是Redis生产者写入的速度还是消费者爬取链接的速度都不如直接部署在机器上的速度，这也是Docker的缺点之一。

# 附录F　npm与包管理

## F.1　package.json常用字段

package.json常用字段：

- Name：项目的名字。
- Version：项目的版本号。
- scripts：项目不同阶段的命令。

例如：

![image-20210504211012609](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504211012609.png)

如果运行npm test，相当于运行node test.js，start命令同理。也可以将多个命令组合到一起例如npm test && npm start。

**dependencies项目依赖的第三方模块，格式为name:version。**

例如：

![image-20210504211057475](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504211057475.png)

下面是关于version字段的说明：

![image-20210504211309287](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504211309287.png)

Install命令默认会从npmjs.com上下载模块，如果出现了formidable非最新版的模块，也可以指定从GitHub上下载，例如可以通过如下的命令直接下载GitHub上的最新代码：

![image-20210504211346456](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504211346456.png)

## F.2　依赖版本的管理

在实际应用中，我们通常会指定依赖包的版本，例如

![image-20210504211416798](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504211416798.png)

这主要是为了避免包升级引入新的bug或者兼容性问题，此外，如果bluebird还引用了别的第三方模块，那么只限制bluebird的版本号是没用的。

使用package.json管理的包每次都要从npm.js下载，虽然概率很小，但也要考虑npm不可用的情况（例如被黑客攻陷），我们要考虑更好的方式来安装依赖。

**最简单的方法就是将node_modules文件夹提交到代码库。**

但一方面该文件夹的体积可能非常大，此外，将陌生的代码加到版本控制中也不妥当，如果新增加了模块依赖，就要提交很多代码上去。

**还有一种解决方案，就是使用npm shrinkwrap命令来打包依赖。**

npm提供了shrinkwrap命令，用来解决第三方模块的版本依赖问题。

在当前目录下运行npm shrinkwrap，会生成名为npm-shrinkwrap.json的文件，其格式如下：

![image-20210504211650899](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504211650899.png)

此时如果使用npm install命令，就会默认从npm-shrinkwrap.json文件配置中的resolve字段定义的地址下载，目前的地址是npm.js中的路径，而可以将其换成一个本地的文件路径，将所有的压缩包先下载到本地，然后再修改对应的文件路径，可以自己编写代码来实现，也可以使用shrinkpack模块来完成这项工作。

**安装npm install -g shrinkpack。**

使用shrinkpack的前提是当前目录下已经生成了npm-shrinkwrap.json。

在项目根目录下运行shrinkpack。

控制台输出：

![image-20210504211817705](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210504211817705.png)

所有的模块都会以压缩包的形式下载到根目录中名为node_shrinkpack的目录下，如果此时再使用npm install来安装依赖，就会直接从node_shrinkpack中解压而不是通过HTTP下载。

