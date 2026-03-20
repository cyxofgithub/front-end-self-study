## axios 如何取消请求、配置

Axios 是一个流行的用于 HTTP 请求的 JavaScript 库，支持取消请求和配置选项。下面详细说明如何实现这两部分功能：

### 一、取消请求

取消请求在处理网络请求时非常重要，可以用来防止资源浪费和避免不必要的操作。你可以借助 CancelToken 取消 Axios 的请求。

#### 示例代码

```bash
npm install axios
```

```javascript
import axios from 'axios';

const CancelToken = axios.CancelToken;
let cancel;

function fetchData() {
    if (cancel) {
        cancel(); // 取消之前的请求
    }

    axios
        .get('https://api.example.com/data', {
            cancelToken: new CancelToken(c => {
                cancel = c;
            }),
        })
        .then(response => {
            console.log('Data fetched:', response.data);
        })
        .catch(thrown => {
            if (axios.isCancel(thrown)) {
                console.log('Request canceled:', thrown.message);
            } else {
                console.log('Error:', thrown);
            }
        });
}

// 调用 fetchData 会取消之前未完成的请求
fetchData();
fetchData(); // 第二次调用会取消第一次的请求
```

#### 原理

```js
let cancel = null;
let cancelToken = new CancelToken(function(c) {
    cancel = c;
});
cancel();
```

-   创建 cancel token 的过程中会创建一个 promise 对象，我们传进去的回调其实是为了拿它 resolve 的引用，也就是上面的 c

-   而 axios 请求创建的最后的一步会有一个判断

-   ```js
    if (config.cancelToken) {
        //对 cancelToken 对象身上的 promise 对象指定成功的回调
        config.cancelToken.promise.then(value => {
            xhr.abort();
            //将整体结果设置为失败
            reject(new Error('请求已经被取消'));
        });
    }
    ```

-   就是成功的 promise 触发 xhr.abort() 所以说我们只要调用 cancel() 方法就相当于让 promise 变成成功状态，它的 then 就会执行

### 二、Axios 配置

Axios 配置可以是全局配置，也可以是单独请求的局部配置。

#### 全局配置

可以配置 Axios 实例来创建特定的请求配置：

```javascript
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 5000,
    headers: { 'X-Custom-Header': 'foobar' },
});

// 使用配置的实例进行请求
axiosInstance
    .get('/users')
    .then(response => {
        console.log('Data:', response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

#### 局部配置

你也可以在每个请求中指定配置选项：

```javascript
import axios from 'axios';

axios
    .get('https://api.example.com/users', {
        params: {
            id: 123,
        },
        timeout: 1000, // 单独设置请求超时时间
        headers: { Authorization: 'Bearer YOUR_TOKEN_HERE' },
    })
    .then(response => {
        console.log('Data:', response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

### 三、完整示例：结合取消请求和配置

此示例展示如何结合取消请求和配置来发送请求：

```javascript
import axios from 'axios';

const CancelToken = axios.CancelToken;
let cancel; // 用于存储取消函数

// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 5000,
    headers: { 'X-Custom-Header': 'foobar' },
});

function fetchData() {
    if (cancel) {
        cancel('Operation canceled by the user.');
    }

    axiosInstance
        .get('/data', {
            cancelToken: new CancelToken(c => {
                cancel = c;
            }),
            params: {
                q: 'search_term',
            },
        })
        .then(response => {
            console.log('Fetched data:', response.data);
        })
        .catch(thrown => {
            if (axios.isCancel(thrown)) {
                console.log('Request canceled:', thrown.message);
            } else {
                console.error('Error:', thrown);
            }
        });
}

// 调用 fetchData 将取消前一个未完成的请求
fetchData();
fetchData(); // 第二次调用会取消第一次的请求
```

### 四、响应拦截器和请求拦截器

拦截器可以拦截请求或响应，对其进行处理。

#### 请求拦截器

可以在请求发送之前进行一些处理：

```javascript
axiosInstance.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        config.headers.Authorization = 'Bearer YOUR_TOKEN_HERE';
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);
```

#### 响应拦截器

可以在响应到达之前进行一些处理：

```javascript
axiosInstance.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        return response;
    },
    error => {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);
```

上述所有这些技术可以帮助你更有效地管理 Axios 请求，既能保持代码的可维护性，又能实现更复杂的功能。
