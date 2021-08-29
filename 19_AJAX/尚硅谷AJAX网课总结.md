# 第一章 原生AJAX

## 1.1 AJAX 简介

![image-20210726160102380](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726160102380.png)

## 1.2 XML 简介

![image-20210726160206630](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726160206630.png)

![image-20210726160222288](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726160222288.png)

tips：简单理解它就是传输和存储数据的一种格式

## 1.3 AJAX 的特点

![image-20210726160537784](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726160537784.png)

tips：SEO 不友好就是对爬虫不友好，因为AJAX请求的结果在源代码中是搜索不到的

## 1.4 AJAX 的使用

### 1.4.1 核心对象

![image-20210726172320676](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726172320676.png)

### 1.4.2 使用步骤

![image-20210726170331600](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726170331600.png)

![image-20210726170337273](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726170337273.png)

### 1.4.3 解决 IE 缓存问题

![image-20210726171000342](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726171000342.png)

tips：最新版本不会出现这个问题了

### 1.4.4 AJAX 请求状态

![image-20210726172416837](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726172416837.png)

![image-20210726172422139](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726172422139.png)

### 1.4.5 重复请求解决

```
    <script>
        //获取元素对象
        const btns = document.querySelectorAll('button');
        let x = null;
        //标识变量
        let isSending = false; // 是否正在发送AJAX请求

        btns[0].onclick = function(){
            //判断标识变量
            if(isSending) x.abort();// 如果正在发送, 则取消该请求, 创建一个新的请求
            x = new XMLHttpRequest();
            //修改 标识变量的值
            isSending = true;
            x.open("GET",'http://127.0.0.1:8000/delay');
            x.send();
            x.onreadystatechange = function(){
                if(x.readyState === 4){
                    //修改标识变量
                    isSending = false;
                }
            }
        }

        // abort
        btns[1].onclick = function(){
            x.abort();
        }
    </script>
```

tips：这里用到了节流方法，把 isSending 做为节流阀门，避免了重复发送请求这种无效率操作（这里的避免重复发送是指正在发送的过程中不要再发送一次）

### 1.4.6 JQuery 发送 AJAX 请求

看代码

### 1.4.7 Axios 发送 AJAX 请求

看代码

### 1.4.8 使用 fetch 发送 AJAX 请求

上面两个都是基于 xhr 的封装， 而 fetch 是在 window 上的内置的

# 第二章 跨域

## 2.1 同源策略

![image-20210726180902502](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726180902502.png)

![image-20210726180906657](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726180906657.png)

## 2.2 如何解决跨域

### 2.2.1 JSONP

![image-20210726183029309](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726183029309.png)

![image-20210726183148230](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726183148230.png)

总结：利用 script 标签（自带跨域属性）发送请求，服务端返回函数调用代码（将要传回来的数据作为参数），浏览器页面提前定义好回调函数，从而在浏览器对数据进行操作

### 2.2.2 CORS

![image-20210726184156719](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726184156719.png)

![image-20210726184201488](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726184201488.png)

### 2.2.3 自己补充

#### vue、React 常用的代理跨域

React 课程有脚手架配置代理的总结

