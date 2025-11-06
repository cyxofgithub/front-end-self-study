# Axios知识

## Axios起步

什么是Axios？



Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。





### 特性



- 从浏览器中创建 XMLHttpRequests
- 从 node.js 创建 http 请求
- 支持 Promise API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 XSRF



### 安装

使用 npm：

```
$ npm install axios
```

使用 bower：

```
$ bower install axios
```

使用 CDN：

```
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```



### 案例

- 执行 `GET` 请求

```
// 为给定 ID 的 user 创建请求
axios.get('/user?ID=12345')
    .then(function (response) {
        console.log(response):
    })
    .catch(function (error) {
        console.log(error);
    });


// 上面的请求也可以这样做
axios.get('/user', {
        params: {
            ID: 12345
        }
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
```

- 执行 `POST` 请求

```
axios.post('/user', {
        firstname: 'Fred',
        lastName: 'Flintstone'
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
```

- 执行多个并发请求

```
function getUserAccount () {
    return axios.get('/user/12345');
}


function getUserPermissions () {
    return axios.get('/user/12345/permissions');
}


axios.all([getUserAccount(), getUserPermission()])
    .then(axios.spread(function (acct, perms) {
        // 两个请求都执行完成
    }));
```

# 框架整合

## vue-axios

>  基于 vuejs 的轻度封装。

安装

### npm

```
npm install --save axios vue-axios
```

将下面代码加入入口文件：

```
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);
```

### Script

按照这个顺序分别引入这三个文件： `vue`, `axios` and `vue-axios`



### 使用

`vue-axios` 包装器将绑定`axios` 到`Vue`或`this`对象上。

你可以按照以下方式使用：

```
Vue.axios.get(api).then(response => {
    console.log(response.data);
});

this.axios.get(api).then(response => {
    console.log(response.api);
});
```