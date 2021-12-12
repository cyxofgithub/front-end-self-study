# Axios知识

## Axios 起步

### 什么是Axios？

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

#### 执行 `GET` 请求

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

#### 执行 `POST` 请求

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

#### 执行多个并发请求（目前还没怎么用上）

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

## Axios API（常用）

可以通过向 `axios` 传递相关配置来创建请求：

### **axios(config)**

```
// 发送 POST 请求
axios({
    method: 'post',
    url: '/user/12345',
    data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
    }
})
```



```
// 获取远端图片
axios({
    method: 'get',
    url: 'http://bit.ly/2mTM3nY',
    responseType: 'stream'
})
    .then(function(response){
        response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'));
    })
```



### **axios(url [, config])**

```
// 发送 GET 请求（默认的方法）
axios('/user/12345');
```



### 请求方法的别名（常用）

为方便起见，为所有支持的请求方法提供了别名

##### axios.request(config)

##### axios.get(url [, config])

##### axios.delete(url [, config])

##### axios.head(url [, config])

##### axios.options(url [, config])

##### axios.post(url [, data[, config]])

##### axios.put(url [, data[, config]])

##### axios.patch(url [, data[, config]])

**注意：**在使用别名方法时， `url`、`method`、`data` 这些属性都不必在配置中指定。

## 请求配置（重要）

```
axios({
	method:'post',
        url:'http://119.23.218.131:9502/authority/user/add',
        data:this.addData,
        headers:{
          'Authorization': this.token
        }
        ......还可以配置其他东西
})
```

```js
{
    // url 是用于请求的服务器 URL
    url: '/user'

    // method 是创建请求时使用的方法
    method: 'get',    // default

    // baseURL 将自动加在 url 前面，除非 url 是一个绝对 URL
    // 它可以通过设置一个 baseURL 便于为 axios 实例的方法传递相对 URL
    baseURL: 'https://some-domain.com/api/',

    // transformRequest 允许在向服务器发送前，修改请求数据
    // 只能用在 PUT、POST 和 PATCH 这几个请求方法
    // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
    transformRequest: [function (data, headers) {
        // 对 data 进行任意转换处理
        return data;
    }],

    // transformResponse 在传递给 then/catch 前，允许修改响应数据
    transformResponse: [function (data) {
        // 对 data 进行任意转换处理
        return data;
    }],

    // headers 是即将被发送的自定义请求头
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    
    // params 是即将与请求一起发送的 URL 参数
    // 必须是一个无格式对象 (plain object) 或 URLSearchParams 对象
    params: {
        ID: 12345
    },

    // paramsSerializer 是一个负责 params 序列化的函数
    // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
    paramsSerializer: function (params) {
        return QS.stringify(params, {arrayFormat: 'brackets'})
    },
    
    // data 是作为请求主体被发送的数据
    // 只适用于这些请求方法 PUT、POST 和 PATCH
    // 在没有设置 transformRequest 时，必须是以下类型之一：
    // - string，plain object，ArrayBuffer，ArrayBufferView，URLSearchParams
    // - 浏览器专属：FormData，File，Blob
    // - Node专属：Stream
    data: {
        firstName: 'Fred'
    },

    // timeout 指定请求超时的毫秒数(0 表示无超时时间)    // 如果请求花费了超过 timeout 的时间，请求将被中断
    timeout: 1000,

    // withCredentials 表示跨域请求时是否需要使用凭证
    withCredentials: false,    // default
    
    // adapter 允许自定义处理请求，以使测试更轻松
    // 返回一个 promise 并应用一个有效的响应(查阅 [response docs](#response-api))    adapter: function (config) {
        /* ... */
    },

    // auth 表示应该使用 HTTP 基础验证，并提供凭据
    // 这将设置一个 Authorization 头，覆写掉现有的任意使用 headers 设置的自定义 Authorization 头
    auth: {
        username: 'janedoe',
        password: 's00pers3cret'
    },

    // responseType 表示服务器响应的数据类型，可以是 arraybuffer、blob、document、json、text、stream
    responseType: 'json',    // default

    // responseEncoding 表示对响应的编码
    // Note：对于 responseType 为 stream 或 客户端请求会忽略
    responseEncoding: 'utf-8',

    // xsrfCookieName 是用作 xsrf token 值的 cookie 名称
    xsrfCookieName: 'XSRF-TOKEN',    // default

    // xsrfHeaderName 是 xsrf token 值的 http 头名称
    xsrfHeaderName: 'X-XSRF-TOKEN',    // default
        
    // onUploadProgress 允许为上传处理进度事件
    onUploadProgress: function (progressEvent) {
        // ... ...
    },
    
    // onDownloadProgress 允许为下载处理进度事件
    onDownloadProgress: function (progressEvent) {
        // ... ...
    },

    // maxContentLength 定义允许的响应内容的最大尺寸
    maxContentLength: 2000,
    
    // validateStatus 定义对于给定的 HTTP 响应状态码是 resolve 或 reject promise。
    // 如果 validateStatus 返回 true (或者设置为 null 或 undefined)，promise 将被 resolve，否则 promise 将被 reject
    validateStatus: function (status) {
        return status >= 200 && status < 300;    // default
    },

    // maxRedirects 定义在 node.js 中 follow 的最大重定向数目
    // 如果设置为 0，将不会 follow 任何重定向
    maxRedirects: 5,

    // socketPath 用于在 node.js 中定义 UNIX Socket
    // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
    // 只能指定 socketPath 或 proxy，如果两者同时指定，将使用 socketPath
    socketPath: null,

    // httpAgent 和 httpsAgent 分别在 node.js 中用于定义在执行 http 和 https 时使用的自定义代理。
    // 允许像这样配置选项。keepAlive 默认没有启用
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),

    // proxy 定义代理服务器的主体名称和端口
    // auth 表示 HTTP 基础验证应当用于连接代理，并提供凭据
    // 这将会设置一个 Proxy-Authorization 头，覆写掉已有的通过使用 header 设置的自定义 Proxy-Authorization 头
    proxy: {
        host: '127.0.0.1',
        port: 9000,
        auth: {
            username: 'mikeymike',
            password: 'rapunz31'
        }
    },

    // cancelToken 指定用于取消请求的 cancel token
    cancelToken: new CancelToken(function (cancel) {
        // ... ...
    })
}
```

## 响应结构（重要）

某个请求的响应包含以下信息

```
{
    // data 由服务器提供的响应
    data: {},
    
    // status 来自服务器响应的 HTTP 状态码
    status: 200,

    // statusText 来自服务器响应的 HTTP 状态信息
    statusText: 'OK',

    // headers 服务器响应的头
    headers: {},

    // config 是为请求提供的配置信息
    config: {},

    // request 是生成当前响应的请求
    // 在 node.js 中是最后一个 ClientRequest 实例 (在重定向中)
    // 在浏览器中是 XMLHttpRequest 实例
    request: {}
```

使用 `then` 时，你将接收下面这样的响应 :

```
axios.get('/user/12345')
    .then(function (response) {
        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
    })
```

**在使用 `catch` 、或传递 `rejection callback` 作为 `then` 的第二个参数时，响应可以通过 `error` 对象被使用，可参考后面的篇章 —— 错误处理。**

## 配置默认值（十分重要）

你可以指定将被用在各个请求的配置默认值

### 全局的 axios 默认值

```
axios.defaults.baseURL = 'http://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```

### 自定义实例默认值

```
// 创建实例时设置配置默认值
const instance = axios.create({
    baseURL: 'https://api.example.com'
});

// 实例创建之后可修改默认配置
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
```

### 配置的优先顺序

配置会以一个优先顺序进行合并。这个顺序是：在 `lib/defaults.js` 找到的库的默认值，然后是实例的 `defaults` 属性，最后是请求的 `config` 参数。后者将优先于前者。这里是一个例子：

```
// 使用由库提供的配置默认值来创建实例
// 此时超时配置的默认值是 0
const instance = axios.create();

// 覆写库的超时默认值
// 现在，在超时前，所有请求都会等待 2.5 秒
instance.defaults.timeout = 2500;

// 为已知需要花费很长时间的请求覆写超时设置
instance.get('/longRequest', {
    timeout: 5000
});
```

## 拦截器（重要）

在请求或响应被 `then` 或 `catch` 处理前拦截它们。

```
// 添加请求拦截器
axios.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        return config;
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axios.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response;
    },
    function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);
```

如果你想在稍后移除拦截器，可以这样：

```
const myInterceptor = axios.interceptors.request.use(function () { /* ... */ });
axios.interceptors.request.eject(myInterceptor);
```

**可以为自定义 axios 实例添加拦截器：**

```
const instance = axios.create();
instance.interceptors.request.use(function () { /* ... */ });
```

## 错误处理

```
axios.get('/user/12345')
    .catch(function (error) {
        if (error.response) {
            // 请求已发出，且服务器的响应状态码超出了 2xx 范围
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // 请求已发出，但没有接收到任何响应
            // 在浏览器中，error.request 是 XMLHttpRequest 实例
            // 在 node.js 中，error.request 是 http.ClientRequest 实例
            console.log(error.request);
        } else {
            // 引发请求错误的错误信息
            console.log('Error', error.message);
        }
        console.log(error.config);
    });
```

你可以使用 `validateStatus` 配置选项定义一个自定义 HTTP 状态码的错误范围：

```
axios.get('/user/12345', {
    validateStatus: function (status) {
        // 当且仅当 status 大于等于 500 时 Promise 才被 reject
        return status < 500;
    }
});
```

## 取消请求

使用 `cancel token` 取消请求。

 *Axios 的* `cancel token` *API 基于* [cancelable promises proposal](https://github.com/tc39/proposal-cancelable-promises)*，它还处于第一阶段。*

 可以使用 `CancelToken.source` 工厂方法创建 `cancel token` 像这样：

```
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
    cancelToken: source.token
}).catch(function (thrown) {
    if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
    } else { /* 处理错误 */ }
});

axios.post('/user/12345', {
    name: 'new name'
}, {
    cancelToken: source.token
});

// 取消请求 (message 参数是可选的)
source.cancel('Operation canceled by the user.');
```

还可以通过传递一个 executor 函数到 CancelToken 的构造函数来创建 `cancel token` ：

```
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
    cancelToken: new CancelToken(function executor(c) {
        // executor 函数接收一个 cancel 函数作为参数
        cancel = c;
    })
});

// 取消请求
cancel();
```

*注意：可以使用同一个 cancel token 取消多个请求。*

## 使用 application/x-www-form-urlencoded 格式

默认情况下，axios 将 JavaScript 对象序列化为 JSON。要以 `application/x-www-form-urlencoded` 格式发送数据，你可以使用以下选项之一。

### 浏览器

- 方式一：使用 URLSearchParams API，如下所示：

```
const params = new URLSearchParams();
params.append('param1', 'value1');params.append('param2', 'value2');
axios.post('/foo', params);
```

>  请注意，不是所有浏览器都支持 URLSearchParams（请参阅 [caniuse.com](https://caniuse.com/)），但可以使用 polyfill（确保填充全局环境）。

- 方式二：使用 qs 库编码数据

```
const qs = require('qs');
axios.post('/foo', qs.stringify({ 'bar': 123 }));
```

### Node.js

在 node.js 中，你可以使用 `querystring` 模块，如下所示：

```
const querystring = require('querystring');
axios.post('http://something.com/', querystring.stringify({ foo: 'bar' }));
```

你也可以使用 qs 库。

## Axios 尾篇

### Promise

axios 依赖原生的 ES6 Promise 实现而被支持，如果你的环境不支持 ES6 Promise，可以使用 [polyfill](https://github.com/jakearchibald/es6-promise)。

### TypeScript

axios 包括 TypeScript 定义：

```
import axios from 'axios';
axios.get('/user?ID=12345');
```

### Credits

axios 深受 Angular 提供的 $http 服务启发，最终，axios 是为了在 Angular 之外使用而提供独立的类似 $http 服务。

### 协议

MIT

# 框架整合

## vue-axios

 *基于 vuejs 的轻度封装。*

### 安装

#### npm

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

#### Script

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

## react-axios

## nuxtjs-axios

# 插件

## axios-retry

*Axios 插件：重试失败的请求。*

### 安装

```
npm install axios-retry
```



### 使用 

```
// CommonJS
// const axiosRetry = require('axios-retry');

// ES6
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 });

// 第一次请求失败，第二次返回 'ok'
axios.get('http://example.com/test') 
    .then(result => {
        result.data; // 'ok'
    });

// 请求之间用指数后退形式的重试延迟
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay});

// 自定义重试延迟
axiosRetry(axios, { retryDelay: (retryCount) => {
    return retryCount * 1000;
}});
// 自定义 axios 实例
const client = axios.create({ baseURL: 'http://example.com' });
axiosRetry(client, { retries: 3 });

// 第一次请求失败，第二次成功
client.get('/test')
    .then(result => {
        result.data; // 'ok'
    });

// 允许 request-specific 配置
client
    .get('/test', {
        'axios-retry': {
            retries: 0
        }
    })
    .catch(error => {    // 第一次请求失败
        error !== undefined
    });
```

**备注:** 除非 `shouldResetTimeout`被设置, 这个插件将请求超时解释为全局值, 不是针对每一个请求，而是全局的设置。

### 配置

| Name               | Type       | Default                             | Description                                                  |
| ------------------ | ---------- | ----------------------------------- | ------------------------------------------------------------ |
| retries            | `Number`   | `3`                                 | 失败前重试的次数。                                           |
| retryCondition     | `Function` | `isNetworkOrIdempotentRequestError` | 如果应该重试请求，则进一步控制的回调。默认情况下，如果是幂等请求的网络错误或5xx错误，它会重试(GET, HEAD, OPTIONS, PUT or DELETE). |
| shouldResetTimeout | `Boolean`  | false                               | 定义是否应在重试之间重置超时。                               |
| retryDelay         | `Function` | `function noDelay() { return 0; }`  | 控制重试请求之间的延迟。默认情况下，重试之间没有延迟。另一个选项是exponentialDelay ([Exponential Backoff](https://developers.google.com/analytics/devguides/reporting/core/v3/errors#backoff)). 这个函数传递`retryCount` 和`error`. |

## vue-axios-plugin

> Vuejs 项目的 axios 插件。

### 如何使用

#### 通过 Script 标签

```
<!-- 在 vue.js 之后引入 -->
<script src="https://unpkg.com/vue"></script><script src="https://unpkg.com/vue-axios-plugin"></script>
```

#### npm

首先通过 npm 安装

```
npm install --save vue-axios-plugin
```

然后在入口文件配置如下：

```
import Vue from 'Vue';
import VueAxiosPlugin from 'vue-axios-plugin';

Vue.use(VueAxiosPlugin, {
    // 请求拦截处理
    reqHandleFunc: config => config,
    reqErrorFunc: error => Promise.reject(error),

    // 响应拦截处理
    resHandleFunc: response => response,
    resErrorFunc: error => Promise.reject(error)
});
```

#### 配置参数

除了 axios 提供的默认[请求配置](https://github.com/axios/axios#request-config), vue-axios-plugin 也提供了 request/response 拦截器配置，如下：

| 参数名              | 类型         | 默认值                           | 描述                     |
| ------------------- | ------------ | -------------------------------- | ------------------------ |
| **`reqHandleFunc`** | `{Function}` | `config => config`               | 请求发起前的拦截处理函数 |
| **`reqErrorFunc`**  | `{Function}` | `error => Promise.reject(error)` | 处理请求错误的函数       |
| **`resHandleFunc`** | `{Function}` | `response => response`           | 响应数据处理函数         |
| **`resErrorFunc`**  | `{Function}` | `error => Promise.reject(error)` | 响应错误处理函数         |

#### 示例

在 Vue 组件上添加了`$http` 属性，它默认提供 `get` 和 `post` 方法，使用如下：

```
this.$http.get(url, data, options).then(response => {
    console.log(response)
})
this.$http.post(url, data, options).then((response) => {
    console.log(response)
})
```

你也可以通过 `this.$axios` 来使用 `axios` 所有的 api 方法，如下：

```
this.$axios.get(url, data, options).then(response => {
    console.log(response);
})
this.$axios.post(url, data, options).then(response => {
    console.log(response);
})
```