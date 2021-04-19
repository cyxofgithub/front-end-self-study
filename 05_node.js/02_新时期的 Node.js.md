# 新时期的 Node.js

# 第1章　基础知识

# 第2章 常用模块

## 2.1	Module

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

下面的这段代码通常获取完整的HTTP内容体，在Buffer的一节我们已经提到过了。

![image-20210419163156339](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210419163156339.png)

目前我们还没有提到response对象，该对象是ServerResponse的一个实例，并且实现了一个writableStream，我们接下来会对其进行介绍。