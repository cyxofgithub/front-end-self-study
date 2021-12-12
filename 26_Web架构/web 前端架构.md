# 第二周

## 2-6 脚手架开发流程

### 开发流程

![image-20211121220400790](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20211121220400790.png)

### 使用流程

![image-20211121220420583](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20211121220420583.png)

### 开发难点解析

![image-20211121220539092](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20211121220539092.png)

![image-20211121220829636](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20211121220829636.png)

## 2-7 快速入门第一个脚手架

**npm init -y 初始化一个工程**

**建一个文件夹 bin 里面有一 js 文件**

![image-20211121223920400](web 前端架构.assets/image-20211121223920400.png)

tips：注释的那句话表示到全局变量里找到 node 这个变量，然后在它指向的环境下运行（即 node 环境），声明了这句话后执行 index.js == node index.js

**配置 package.json 文件**

![image-20211121223829143](web 前端架构.assets/image-20211121223829143.png)

tips：第一个是包名，第二个是执行命令，我们全局安装这个包后执行 imooc-test 就会执行 bin 文件下的 index.js 文件

## 2-8 脚手架本地调试方法

在 imooc-test-lib 包下执行 npm link，这个包就可以被链接到本地

![image-20211121232812200](web 前端架构.assets/image-20211121232812200.png)

在 imooc-test 下执行 npm link imooc-test-lib 即可直接使用这个包

![image-20211121232947117](web 前端架构.assets/image-20211121232947117.png)

## 2-9 脚手架本地调试标准流程

![image-20211124145939483](web 前端架构.assets/image-20211124145939483.png)

**链接本地脚手架**

![image-20211124194053184](web 前端架构.assets/image-20211124194053184.png)

链接了本地脚手架即可根据脚手架的 bin 下的脚手架名直接在命令行输入执行，相当于为它配置了一个环境变量，我们全局变量的配置里有 node_global, 在文件下执行 npm link 就是在 node_global 文件夹下面生成一个软链接

![image-20211124193906998](web 前端架构.assets/image-20211124193906998.png)

执行 imooc-test 相当于执行了 ./bin/index.js

**链接本地库文件**

![image-20211124194116891](web 前端架构.assets/image-20211124194116891.png)

库文件执行 npm link 之后，在脚手架里执行 npm link 库文件，脚手架文件的 node_modules 下面就会有一个软连接指向它

**取消链接本地库文件、link、unlink 理解**

![	](web 前端架构.assets/image-20211124145923563.png)

## 2-10 脚手架命令注册和参数解析

```js
const argv = require('process').argv

const command = argv[2]
if ( command ) {
    if( lib[command] ) {
        lib[command]()
    } else {
        console.log("无效命令");
    }
} else {
    console.log("请输入命令");
}
```

内置模块 process 的 argv 参数可以获取到我们从终端输入的命令，我们根据命令的不同到对应的库里调用函数即可实现命令行的操作

## 2-11 脚手架项目发布

![image-20211127184854792](web 前端架构.assets/image-20211127184854792.png)

tips：发布新的包的时候注意修改版本号（npm publish）

## 3-3 本章重点：lerna简介及脚手架开发流程

### Lerna简介

#### **为什么需要 Lerna？**

![image-20211127185741205](web 前端架构.assets/image-20211127185741205.png)

tips：Lerna 能解决以上痛点

#### **简介**

![image-20211127190508129](web 前端架构.assets/image-20211127190508129.png)

![image-20211127190744896](web 前端架构.assets/image-20211127190744896.png)

### **Lerna 开发脚手架流程（重点）**

![image-20211127190853588](web 前端架构.assets/image-20211127190853588.png)

![image-20211127190921280](web 前端架构.assets/image-20211127190921280.png)

![image-20211127191300524](web 前端架构.assets/image-20211127191300524.png)

## 3-4 基于lerna搭建脚手架框架

**初始化脚手架项目**

- npm init 初始化脚手架
- 安装 lerna：npm install lerna -D
- 初始化 lerna：lerna init
- 创建 .gitnore 文件

**创建 packages**

lerna create 包名

**core**

![image-20211127194326709](web 前端架构.assets/image-20211127194326709.png)

**utils**

![image-20211127194344232](web 前端架构.assets/image-20211127194344232.png)

**到 npm 上创建分组**

![image-20211127194425377](web 前端架构.assets/image-20211127194425377.png)

![image-20211127194440553](web 前端架构.assets/image-20211127194440553.png)

tips：这种分组的命名形式可以避免包名冲突，如果你单单 utils ，npm 上面一大堆有关 utils的包名，这时你就可以创建自己的 organizations 相当于有了自己的命名空间

## 3-5 Lerna核心操作

### lerna add

![image-20211127194849365](web 前端架构.assets/image-20211127194849365.png)

tips：为指定的包添加依赖,可以指定包名添加也可以全部包都添加

![image-20211127195353773](web 前端架构.assets/image-20211127195353773.png)

tips：为所有的包添加 @imooc-cli/utils 这个依赖

![image-20211127200046634](web 前端架构.assets/image-20211127200046634.png)

tips：向指定的包添加依赖

### lerna clean

tips：删除所有依赖

### lerna bootstrap

tips：为包去安装依赖（根据包的package）

### lerna link

tips：对于存在相互依赖的包它自动为其建立起软连接，比如说 core 包引用了 utils 包，当我们使用了 npm link 的时候 core 的 node_modules 就会有一个软连接指向我们本地开发的 utils 包；**如果没有这个命令，我们需要到每个包下面自己去 npm link 对应的包**

![image-20211127201112413](web 前端架构.assets/image-20211127201112413.png)

### 看到这里

![image-20211127201243375](web 前端架构.assets/image-20211127201243375.png)
