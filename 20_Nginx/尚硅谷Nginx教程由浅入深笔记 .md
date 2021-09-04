## 补充命令

- 查看进程

![image-20210902111403505](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210902111403505.png)

- 杀死进程

![image-20210902111421732](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210902111421732.png)

## Nginx 课程介绍

![image-20210831091008568](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210831091008568.png)

## Nginx 简介

### 1、什么是 Nginx

![image-20210901095250644](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210901095250644.png)

### 2、反向代理

- 正向代理：

![image-20210901095543948](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210901095543948.png)

tips：客户访问 google.com 不是直接访问，而是先访问代理服务器（需要在客户端先配置），代理服务器去访问谷歌，这就是所谓的正向代理

- 反向代理：

![image-20210901100211427](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210901100211427.png)

![image-20210901100253479](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210901100253479.png)

tips：个人理解，Nginx 就是一个反向代理的服务器，比如我们的项目部署在5001端口上面，当发送接口请求的时候因为在服务器端配置了反向代理，我们表面好像是向 5001 端口发送了请求（因此不会有跨域问题），实际上经过反向代理处理是向 5000 端口发送了请求

![image-20210901103953292](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210901103953292.png)

### 3、负载均衡

![image-20210901101622505](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210901101622505.png)

![image-20210901101629290](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210901101629290.png)

### 4、动静分离

![image-20210901103158969](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210901103158969.png)

![image-20210901103218921](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210901103218921.png)

tips：jsp、sevelet 能动态生成 HTML

## Nginx 安装

![image-20210901113515519](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210901113515519.png)

![image-20210901113524268](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210901113524268.png)

![image-20210901113533977](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210901113533977.png)

## Nginx 常用命令

![image-20210902100934254](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210902100934254.png)

## Nginx 配置文件

![image-20210902101947142](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210902101947142.png)

## Nginx配置实例-反向代理

### 实例

tips：这里有开启端口的操作说明

![image-20210902112746339](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210902112746339.png)



![image-20210902112845388](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210902112845388.png)

![image-20210902112852008](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210902112852008.png)