## 京东一面（2 年）

### webpack 打包优化

参考 [讲讲 webpack 优化](../webpack//讲讲webpack优化.md)

话术：webpack 打包优化一般来说主要是优化两个方面的内容：

-   1、构建速度的优化
-   2、优化打包体积

构建速度优化一般来说有以下几种方式：

-   开启多进程打包
-   通过 includes、exclude 来减少 loader 处理的范围
-   通过 dllplugin 来可以将稳定的第三方库单独打包，下次构建只需要引用而不是重复处理从而加快主项目的构建速度
-   webpack5 持久化缓存 缓存文件不变的转换结果

像优化打包体积的话一般可以通过：

-   treeshaking
-   代码分割
-   代码压缩
-   通过 external 将一些库通过 cdn 引入
-   通过设置 babel presetEnv “按需转译”减少 profill 代码

### webpack 压缩到底压缩了什么内容

Webpack 的文件压缩本质是 **“保留功能，剔除冗余”**：

-   对 JS/CSS：主要通过移除空白、注释、死代码，简化命名和语法，合并重复内容来减小体积；
-   对图片 / 字体：通过优化存储方式、剔除无效数据、降低非必要质量来压缩；
-   最终目的是在不影响运行效果的前提下，减少文件传输大小，提升页面加载速度。

### 大文件上传是如何设计的

参考 [断点续传](../前端常见问题/断点续传怎么做.md)
总结来说就是： 拆分传输 + 断点续传 + 可靠合并

常见问题：

-   网络波动导致分片上传失败： 实现错误重试机制，结合断点续传跳过已传分片
-   服务端内存溢出：用文件流合并分片，避免一次性读取大文件到内存
-   客户端计算 MD5 耗时过长： 用 Web Worker 后台计算 MD5，或采用 “文件名 + 大小 + 最后修改时间” 生成临时 fileId
-   分片合并后文件损坏：客户端和服务端分别计算原文件 / 合并后文件的 MD5，进行一致性校验

### 如何区分消息来源？

比如 iframe 和 web worker：发送消息时增加来源标识

如何区分不同脚本 web worker 的消息，为创建的 web worker 分配一个唯一 id：

```javascript
// 主线程
let workerId = 0; // 用于生成唯一标识

// 创建 Worker 并分配 ID
function createWorker(scriptPath) {
    const id = `worker_${workerId++}`; // 唯一标识（如 worker_0, worker_1）
    const worker = new Worker(scriptPath);

    // 存储 Worker 实例与 ID 的映射（可选，用于反向操作）
    worker._id = id;
    worker._scriptPath = scriptPath; // 也可使用脚本路径作为标识

    return worker;
}

// 创建两个不同脚本的 Worker
const workerA = createWorker('worker-a.js');
const workerB = createWorker('worker-b.js');
```

### 如何限制 git 提交信息

有 husky 工具配置提交前的钩子

### jwt 如何使用 如何在 axios 进行二次封装

#### jwt 介绍

JWT（JSON Web Token）是一种基于 JSON 的轻量级身份认证令牌，用于在客户端与服务端之间安全传递用户身份信息。它由三部分组成，通过 . 连接：

-   Header（头部）：指定令牌类型（JWT）和加密算法（如 HS256）；
-   Payload（载荷）：存储用户标识（如 userId）、过期时间（exp）等非敏感信息；
-   Signature（签名）：通过头部指定的算法，结合密钥对 Header 和 Payload 加密生成，用于验证令牌完整性和真实性。
    特点：
-   无状态：服务端无需存储令牌，通过签名即可验证有效性；
-   自包含：载荷中包含用户信息，减少服务端查询数据库的次数；
-   适用于分布式系统：可在多个服务间共享认证信息。

#### 使用流程

JWT Token 的使用流程

-   用户登录：客户端提交用户名 / 密码到服务端；
-   生成令牌：服务端验证通过后，生成 JWT 令牌并返回给客户端；
-   客户端存储：客户端将令牌存储在 localStorage、sessionStorage 或 Cookie 中；
-   携带令牌请求：后续请求时，客户端在 HTTP 头（如 Authorization）中携带令牌；
-   服务端验证：服务端解析令牌，验证签名和过期时间，通过则允许访问，否则拒绝。
-

### 在 axios 二次封装

#### 请求拦截器（自动携带令牌）

```javascript
// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 从存储中获取令牌，存在则添加到请求头
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // 规范格式：Bearer + 空格 + token
        }
        return config;
    },
    (error) => {
        // 请求错误（如网络错误）
        return Promise.reject(error);
    }
);
```

#### 3. 响应拦截器（处理令牌过期、错误统一处理）

```javascript
// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // 成功响应：直接返回数据（根据后端格式调整）
        const { data } = response;
        return data;
    },
    async (error) => {
        // 错误处理
        const { response } = error;

        // 处理 401 未授权（令牌过期或无效）
        if (response && response.status === 401) {
            // 尝试刷新令牌（需后端提供刷新接口）
            const newToken = await refreshToken();
            if (newToken) {
                // 刷新成功：重新设置令牌，并重试原请求
                const originalRequest = error.config;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return service(originalRequest); // 重试
            } else {
                // 刷新失败：清除令牌，跳转登录页
                removeToken();
                window.location.href = '/login'; // 跳转到登录页
                return Promise.reject('令牌已过期，请重新登录');
            }
        }

        // 其他错误（如 403 权限不足、500 服务器错误）
        const errorMsg = response?.data?.message || '请求失败';
        console.error('请求错误：', errorMsg);
        return Promise.reject(errorMsg);
    }
);
```

### 网络请求 301 和 302 的意思

参考[HTTP 状态码的分类与含义](./计算机网络.md/)

### 数组乱序，为什么从后往前

做法[乱序的数组](./code/社招面筋/乱序的数组.js)

总结：从后往前时，每轮从 [0, i] 中选一个索引与 i 交换，之后 i 不再参与，从而避免重复选择已处理位置。这是 Fisher-Yates 洗牌算法的标准实现方式

### 如何实现垂直居中

参考[垂直居中方式](./面经总结)

translate 和 margin 有什么不同

前者需要配合定位会脱离文档流
后者只能对块级元素生效

### 如何实现加载中效果

```css
/* 旋转圆环容器 */
.loader-circle {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3; /* 浅色边框 */
    border-top: 4px solid #3498db; /* 高亮边框（旋转时形成动态效果） */
    border-radius: 50%; /* 圆形 */
    animation: spin 1s linear infinite; /* 旋转动画 */
    margin: 40px auto;
    display: block;
}
/* 定义旋转关键帧 */
@keyframes spin {
    0% {
        transform: rotate(0deg);
    } /* 起始角度 */
    100% {
        transform: rotate(360deg);
    } /* 结束角度（一圈） */
}
```

## 百度一面（2 年）

### 谈谈你对闭包的理解

允许函数访问其词法作用域（Lexical Scope）中的变量，即使这个函数在其词法作用域之外被调用。闭包的核心在于函数和其词法环境的结合，总结：闭包的核心价值在于状态保留与作用域隔离

闭包的实际场景有哪些？

私有变量、工程函数、事件处理与回调函数、 防抖与节流、模块化（隔离作用域）、柯里化（Currying）

参考 [闭包](../js/闭包.md)

### 说说防抖和节流

防抖：搜索框最后一次输入才发起请求

节流：抢票你点得多快都只在一定频率发一次请求

代码：
参考[防抖与节流函数](./code/八、前端工程化相关/1、防抖与节流函数.js)

### 说说原型和原型链

每个对象都有个隐藏属性[prototype]即这个对象的原型，在代码用[__proto__]读取，原型向上查找的终点是 null

当我们查询一个节点属性时我们会先从对象自身查找，查询不到会沿着原型链查找，如果还没找到返回 undefined

参考：[原型链](./js核心原理.md)

### 说说继承的几种方式

核心分类与关键特点

-   ES6 之前的继承（基于构造函数和原型）
    -   原型链继承：子类原型指向父类实例，继承原型方法，但引用类型属性会被所有实例共享，且无法向父类传参。
    -   构造函数继承：用 call/apply 在子类中调用父类构造函数，解决引用类型共享问题，支持传参，但无法继承父类原型方法。
    -   组合继承：结合前两者（原型链继承方法 + 构造函数继承属性），但父类构造函数会被调用两次，产生冗余属性。
    -   **寄生组合式继承**（最佳实践）：优化组合继承，通过 Object.create 让子类原型直接继承父类原型（而非父类实例），仅调用一次父类构造函数，避免冗余，是 ES6 前的最优解。
    -   原型式 / 寄生式继承：基于对象创建新对象（类似浅拷贝），适合简单场景，但方法无法复用，引用类型仍共享。
-   ES6 类继承（class + extends）
    -   语法层面简化继承，底层仍是原型链，但自动处理原型关联和构造函数指向。
        用 extends 声明继承，super() 调用父类构造函数，清晰直观，是现代 JS 推荐的方式。

参考: [继承的方法和优缺点](../js/继承的方法和优缺点.md)

**ES6 继承是否等同于寄生组合式继承？**

不是完全等同，但核心思想一致：
两者的核心逻辑相同：通过 “构造函数继承实例属性”+“原型链继承原型方法” 实现继承，且都避免了父类构造函数被重复调用（无冗余属性）。
差异在于：

-   ES6 继承是语法层面的封装，底层做了更多优化和扩展（比如处理静态方法继承、super 的灵活使用、更严格的语法约束等）
-   寄生组合式继承是 ES6 之前通过原生 JS 手动实现的 “最佳实践”。

简单说：ES6 的 class + extends 是基于寄生组合式继承的思想，但提供了更简洁、更健壮的语法糖，解决了手动实现时的细节繁琐问题。主要记住寄生组合继承

### es6 class 继承调用 super 的原因

super() 的核心作用是完成父类对子类实例的初始化，是 ES6 为了规范继承逻辑而设置的强制步骤。它**确保了父类的属性和方法能正确绑定到子类实例上**，同时避免了因 this 未初始化而导致的错误。

简单说：没有 super()，子类的 this 就 “不存在”，继承关系无法建立。

### 说说事件循环

事件循环（Event Loop）是专门处理异步任务的机制

浏览器循环流程：同步代码(本质第一个宏任务)->清空微任务->宏任务

node：同步代码(本质第一个宏任务)->清楚所有 process.nextTrick->所有微任务->6 个阶段(每个阶段执行完后会执行重复 2、3 步骤)->宏任务

参考[事件循环](./js核心原理.md)

### vue2、vue3 的区别

参考 [这里](../vue/vue2与vue3的区别.md)

| 维度             | Vue2                       | Vue3                      |
| :--------------- | :------------------------- | :------------------------ |
| 响应式原理       | Object.defineProperty      | Proxy                     |
| 响应式缺陷       | 新增/删除属性无响应        | 完全响应式                |
| 性能             | 普通                       | 更快更优                  |
| API 组织方式     | Options API                | Options + Composition API |
| 生命周期部分钩子 | beforeDestroy/destroyed    | beforeUnmount/unmounted   |
| TypeScript 支持  | 基本（有 Typex/vue-class） | 原生高适配                |
| 多根节点         | 不支持                     | Fragment 支持             |
| 新特性           | 无                         | Teleport、Suspense 等     |
| 体积             | 相对偏大                   | 可 tree-shaking，更小     |

### 箭头函数与普通函数的区别

参考[箭头函数与普通函数的区别](../js/箭头函数与普通函数区别.md)

-   没有 argument（可以用剩余参数来获取参数...args）、protatype（所以也不能作为构造器）
-   语言简洁，this 根据外部作用域

### vue2 中如何实现对数组的操作

参考 [vue2 中如何实现对数组的操作](../vue/vue2%20中如何实现对数组的操作.md)

-   修改数组内容推荐用 push/pop/shift/unshift/splice/sort/reverse 等方法，vue 重写了这几个方法发生变化会触发响应
-   如果希望通过**索引赋值**让视图响应，必须用 `Vue.set` 或 `this.$set`
-   不建议直接写 `arr[i] = val` 或 `arr.length = n`，这些 Vue2 检测不到

## 数字马力一面(2 年)

### taiwindcss 的优势在哪里

[twindcss 的优势在哪里](../css/twindcss的优势.md)

-   开发效率：告别 “写样式”，专注 “拼样式”
-   样式一致性：基于主题的 “标准化”，避免 “样式碎片化”
-   消除命名困扰与冲突：原子化类名天然 “防污染”
-   极致精简：按需生成样式，告别 “冗余 CSS 垃圾
-   零构建门槛：即开即用，适配多场景

### less 和 scss 区别

[less 和 scss 的区别](../css/less%20和%20scss%20区别.md)

1. SCSS 功能更丰富，支持更复杂的变量、嵌套、继承、条件、循环等高级用法，组件化和可维护性更强，生态活跃，主流 UI 框架多选用 SCSS。
2. Less 语法更简单、学习曲线平缓，适合小型或简单项目，工具链支持较全，但在灵活性和社区活跃度上不及 SCSS。
3. 建议：团队化开发、复杂大型项目优先选 SCSS；个人或小型项目可考虑 Less，上手快但可扩展性弱。

### 对函数式编程的理解，你还理解其他编程范式吗？面向对象编程范式

|          | 函数式编程                       | 面向对象编程                       |
| -------- | -------------------------------- | ---------------------------------- |
| 组成单元 | 函数                             | 对象                               |
| 数据管理 | 不可变，数据只读，变化生成新数据 | 可变，状态保存在对象内部           |
| 副作用   | 不鼓励副作用，尽量纯函数         | 可以有副作用，如方法内修改成员变量 |
| 抽象方式 | 用高阶函数、函数组合抽象操作     | 用类、对象、继承实现抽象           |
| 复用手段 | 函数组合、高阶函数               | 继承、接口、多态、组合             |
| 并发安全 | 更易实现（无共享状态）           | 要注意并发时的状态一致性           |
| 代码风格 | 声明式、表达式驱动               | 命令式、语句驱动                   |

如何理解并发安全？

并发调用同一个函数时可能改变对象的状态，而函数不会

### 数组去重，将 id 重复的对象去重

```javascript
function filterRepeatObj(arr) {
    const ids = [];

    const res = arr.reduce((pre, cur) => {
        if (!ids.includes(cur.id)) {
            pre.push(cur);
        }
        ids.push(cur.id);

        return pre;
    }, []);

    return res;
}

console.log(filterRepeatObj([{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }]));
```

更优解法：

```javascript
function filterRepeatObj(arr) {
    const idMap = new Map();
    // 遍历数组，仅保留首次出现的id对应的对象
    for (const item of arr) {
        if (!idMap.has(item.id)) {
            // Map的has方法查找复杂度为O(1)
            idMap.set(item.id, item);
        }
    }
    // 将Map的值转为数组返回
    return Array.from(idMap.values());
}

console.log(filterRepeatObj([{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }]));
// 输出：[{ id: 1 }, { id: 2 }, { id: 3 }]
```
