我们来深入探讨一下 Node.js SSR（服务器端渲染）中常见的堵塞（Blocking）原因。

Node.js SSR 的堵塞主要源于其 **单线程事件循环** 模型。如果事件循环的某个阶段执行了耗时操作，就会导致后续请求无法被及时处理，表现为服务端响应缓慢、CPU 占用率高、甚至请求超时。以下是具体原因分类及示例：

### 一、同步阻塞操作（最常见）

Node.js 主线程是单线程的，**同步代码会直接阻塞事件循环**，导致后续请求无法处理。SSR 中常见的同步阻塞场景：

#### 1. 同步 I/O 操作

-   **问题代码**：使用 `fs.readFileSync`、`fs.writeFileSync` 等同步文件读取/写入 API，尤其是读取大文件或网络文件时。
    ```javascript
    // 错误示例：同步读取模板文件，阻塞事件循环
    function renderPage() {
        const template = fs.readFileSync('./large-template.html', 'utf8'); // 同步操作，阻塞线程
        return template.replace('{{data}}', JSON.stringify(largeData));
    }
    ```
-   **后果**：如果多个请求同时触发该操作，主线程会被连续阻塞，所有后续请求必须等待前一个同步操作完成，导致服务吞吐量骤降。

#### 2. 复杂同步计算

-   **问题场景**：SSR 渲染时需要进行大量数据处理（如大数据量数组排序、复杂正则匹配、加密解密计算等）。
    ```javascript
    // 错误示例：复杂数据排序阻塞线程
    function renderProductList(products) {
        // 对 10 万条数据进行排序（同步操作，耗时可能达数百毫秒）
        const sortedProducts = products.sort((a, b) => {
            // 复杂排序逻辑
            return a.price - b.price + a.sales * 0.1;
        });
        return `...${sortedProducts.map((p) => `<div>${p.name}</div>`).join('')}...`;
    }
    ```
-   **后果**：单条请求的复杂计算会占据主线程，导致其他请求的响应延迟（例如，原本 10ms 响应的请求被拖到 500ms+）。

### 二、异步操作不当导致的“伪阻塞”

Node.js 的异步 API（如 `fs.readFile`、数据库查询）本身不会阻塞事件循环，但如果使用不当，会导致 **资源耗尽或回调堆积**，间接引发堵塞。

#### 1. 无限制并发异步请求

-   **问题场景**：SSR 渲染时，为了获取页面数据，同时发起大量数据库查询、API 调用（如获取用户信息、商品列表、评论等），且未做并发控制。
    ```javascript
    // 错误示例：无限制并发数据库查询
    async function renderProductPage(productId) {
      // 同时发起 10+ 个数据库查询（假设每个查询耗时 100ms）
      const [product, comments, relatedProducts, userInfo, ...] = await Promise.all([
        db.query('SELECT * FROM products WHERE id = ?', [productId]),
        db.query('SELECT * FROM comments WHERE product_id = ?', [productId]),
        db.query('SELECT * FROM products WHERE category = ? LIMIT 10', [categoryId]),
        // 更多查询...
      ]);
      return renderTemplate({ product, comments, relatedProducts, userInfo });
    }
    ```
-   **后果**：
    -   数据库连接池耗尽：如果数据库连接池最大连接数为 10，而同时有 20 个请求发起 10 个查询，会导致连接等待，进而阻塞请求。
    -   回调堆积：大量异步操作的回调会在事件循环的“回调队列”中堆积，虽然主线程未被阻塞，但后续请求的回调需要等待前一批回调执行完成，导致响应延迟。

#### 2. 异步操作未处理错误

-   **问题场景**：异步请求（如 API 调用、数据库查询）未捕获错误，导致 Promise 拒绝（Unhandled Rejection），进而导致进程崩溃或请求卡死。
    ```javascript
    // 错误示例：未处理异步错误
    async function renderUserPage(userId) {
        const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]); // 如果查询失败（如 userId 不存在），会抛出错误
        return renderTemplate({ user });
    }
    ```
-   **后果**：单个请求的异步错误如果未被捕获，会导致整个 Node.js 进程崩溃（尤其是在未使用 `domain` 或进程管理工具时），所有后续请求直接失败。

#### 3. 回调地狱导致的执行顺序混乱

-   **问题场景**：过度嵌套的异步回调（如回调地狱），导致代码执行顺序混乱，且中间某个回调耗时过长时，后续逻辑无法推进。
    ```javascript
    // 错误示例：回调地狱
    function renderPage(productId, callback) {
        fs.readFile('./template.html', 'utf8', (err, template) => {
            if (err) return callback(err);
            db.query('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
                if (err) return callback(err);
                db.query('SELECT * FROM comments WHERE product_id = ?', [productId], (err, comments) => {
                    if (err) return callback(err);
                    // 更多嵌套回调...
                    callback(null, template.replace('{{product}}', JSON.stringify(product)));
                });
            });
        });
    }
    ```
-   **后果**：嵌套回调会导致事件循环的回调队列中堆积大量任务，且每个回调的执行依赖前一个回调完成，一旦某个回调耗时过长（如数据库查询慢），整个链条都会阻塞。

### 三、内存泄漏导致的长期堵塞

内存泄漏不会直接导致“即时堵塞”，但会随着时间推移导致 **内存占用持续升高**，进而引发 GC 频繁执行、CPU 占用率飙升，最终导致服务响应缓慢甚至崩溃。

### 补充：GC（垃圾回收）机制简要介绍

**GC（Garbage Collection，垃圾回收）** 是 Node.js（以及绝大多数现代高级编程语言，如 JavaScript、Java、Python 等）自动管理内存的一种机制。它的核心目的是**自动检测哪些对象已经不再被引用，然后释放这些对象占用的内存，以防止内存泄漏**。

注：GC 就是垃圾回收

#### 1. 未释放的闭包引用

-   **问题场景**：SSR 渲染函数中存在闭包，意外引用了大量数据（如请求对象、大数组），导致这些数据无法被垃圾回收（GC）。

    ```javascript
    // 错误示例：闭包导致内存泄漏
    function createRenderer() {
        const largeData = getLargeData(); // 假设这是一个 10MB 的大对象
        return function render() {
            // 闭包引用了 largeData，导致 largeData 无法被 GC
            return `<div>${JSON.stringify(largeData)}</div>`;
        };
    }

    // 每次请求都会创建新的渲染器，但 largeData 被闭包引用，无法释放
    app.get('/', (req, res) => {
        const renderer = createRenderer();
        res.send(renderer());
    });
    ```

-   **后果**：随着请求量增加，内存占用越来越高，GC 会频繁执行（GC 期间主线程会阻塞），导致服务响应越来越慢。

#### 2. 未清除的定时器/事件监听器

-   **问题场景**：SSR 渲染时使用了 `setInterval`、`setTimeout` 或事件监听器（如 `http.Server` 的 `request` 事件），但未在适当时候清除。

    ```javascript
    // 错误示例：未清除定时器
    app.get('/', (req, res) => {
        // 定时器未清除，每次请求都会创建新的定时器
        const timer = setInterval(() => {
            console.log('Processing request...');
        }, 1000);

        // 渲染逻辑
        res.send(renderTemplate());
        // 忘记清除 timer，导致 timer 一直存在，引用 req/res 对象无法释放
    });
    ```

-   **后果**：定时器和事件监听器会持续占用内存，且可能不断触发回调，导致事件循环负担加重，最终引发堵塞。

### 四、第三方依赖/框架问题

SSR 通常依赖第三方框架（如 Next.js、Nuxt.js、Koa/Express + React/Vue SSR），这些框架或其依赖库的 bug 也可能导致堵塞：

#### 1. 框架本身的性能瓶颈

-   例如：早期版本的 Next.js 在处理大量动态路由时，路由匹配逻辑存在性能问题，导致请求堵塞。
-   又如：某些 SSR 框架的模板引擎（如 EJS、Pug）在渲染复杂模板时，存在低效的字符串拼接操作，导致 CPU 占用率高。

#### 2. 依赖库的同步阻塞

-   某些第三方库（如日志库、数据验证库）可能内部使用了同步 API（如 `fs.writeFileSync` 写入日志），导致主线程阻塞。

    ```javascript
    // 错误示例：日志库使用同步写入
    const logger = require('bad-logger'); // 内部使用 fs.writeFileSync

    app.get('/', (req, res) => {
        logger.info('Request received'); // 同步写入日志，阻塞线程
        res.send(renderTemplate());
    });
    ```

### 五、资源耗尽导致的堵塞

#### 1. CPU 资源耗尽

-   场景：大量请求同时触发复杂的同步计算（如数据加密、模板渲染），导致 CPU 占用率 100%，事件循环无法推进。
-   后果：所有请求都需要等待 CPU 空闲，响应时间急剧增加。

#### 2. 内存资源耗尽

-   场景：渲染大量大尺寸页面（如包含大量图片、复杂组件的页面），导致内存占用超过 Node.js 进程限制（默认约 1.4GB）。
-   后果：进程会因内存溢出（OOM）崩溃，所有请求失败。

#### 3. 文件描述符耗尽

-   场景：SSR 渲染时频繁读取文件（如模板文件、静态资源），且未正确关闭文件句柄（虽然 Node.js 的 `fs` 模块会自动关闭，但某些异常场景下可能泄漏）。
-   后果：系统文件描述符耗尽，无法创建新的文件连接或网络连接，导致服务卡死。

#### 【科普补充】什么是文件描述符？

-   **定义**：文件描述符（File Descriptor，简称 FD）是操作系统用于管理已打开文件（或套接字、管道等 I/O 资源）的一个非负整数句柄。它用来标识当前进程打开的每一个文件或 I/O 资源。

-   **基本原理**：每当程序（Node.js 进程）打开一个文件、网络连接或管道，操作系统就分配一个唯一的文件描述符。进程通过该描述符对特定的文件/资源进行读写、关闭等操作。

-   **常见场景举例**：

    -   `fs.open()` 打开文件，返回 FD；
    -   网络服务器每接入一个新连接（如 HTTP 请求），内核可能分配一个 FD；
    -   标准输入/输出/错误（stdin、stdout、stderr）分别对应 0、1、2 号描述符。

-   **资源限制**：

    -   每个进程/系统能同时打开的文件描述符数量是有限制的，超过限制后无法再打开新文件或建立新连接，表现为“文件描述符耗尽”。
    -   在 Linux/Unix 下可用 `ulimit -n` 查看限制，Node.js 进程也受此约束。

-   **SSR 相关问题**：如果 SSR 代码反复打开文件却忘记关闭，或同时处理过多连接且未及时释放，就可能导致 FD 泄漏，引发进程卡死。

-   **举例说明**：

    ```js
    // Node.js 中文件描述符的简单使用
    const fs = require('fs');
    fs.open('tmp.txt', 'r', (err, fd) => {
        if (fd) {
            // fd 就是文件描述符
            fs.close(fd, () => {}); // 用完一定要关闭
        }
    });
    ```

**简而言之**：文件描述符是一种“引用票据”，用来跟踪和管理进程打开的所有 I/O 资源，合理管理才能避免资源枯竭导致服务不可用。

### 总结：堵塞的核心逻辑

Node.js SSR 的堵塞本质上是 **“事件循环被阻塞”或“资源被耗尽”**：

-   同步操作直接阻塞事件循环；
-   异步操作不当导致资源耗尽（如连接池、内存），间接阻塞；
-   内存泄漏、第三方依赖问题加剧资源消耗，最终引发堵塞。

### 排查建议

1. **使用性能分析工具**：
    - `node --inspect` + Chrome DevTools：查看 CPU 火焰图、内存快照，定位耗时操作和内存泄漏。
    - `clinic.js`、`0x`：Node.js 官方推荐的性能诊断工具，可检测事件循环延迟、内存泄漏等。
2. **监控关键指标**：
    - CPU 占用率、内存占用、事件循环延迟（`process.hrtime()` 可测量）。
    - 数据库连接数、API 请求响应时间。
3. **代码审计**：
    - 避免使用同步 I/O API，改用异步版本（如 `fs.promises.readFile`）。
    - 限制并发异步请求（如使用 `p-limit` 控制并发数）。
    - 及时清除定时器、事件监听器，避免闭包内存泄漏。
4. **优化 SSR 流程**：
    - 对频繁访问的页面进行缓存（如 Redis 缓存渲染结果）。
    - 拆分复杂渲染任务，使用 worker_threads 处理 CPU 密集型计算（Node.js 12+ 支持）。
    - 采用流式渲染（如 React 18 的 `renderToPipeableStream`），减少内存占用。
