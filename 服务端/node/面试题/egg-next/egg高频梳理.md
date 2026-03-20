### 一、Node.js 核心基础（企业级深度）

#### 1. 事件循环与异步

**题目**：详细解释 Node.js 事件循环的 6 个阶段，结合 Egg.js 说明 `process.nextTick` 和 `setImmediate` 的执行顺序差异，以及高并发下如何控制异步并发数。

**答案**：

-   **事件循环 6 阶段**：
    1. **timers**：执行 `setTimeout`/`setInterval` 回调。
    2. **pending callbacks**：执行 I/O 回调（如网络、文件）。
    3. **idle, prepare**：内部使用。
    4. **poll**：等待新的 I/O 事件，是事件循环的核心阶段。
    5. **check**：执行 `setImmediate` 回调。
    6. **close callbacks**：执行 `close` 事件回调（如 `socket.on('close')`）。
-   **`process.nextTick` vs `setImmediate`**：
    -   `process.nextTick` 在当前阶段结束后立即执行（优先级最高），`setImmediate` 在 check 阶段执行。
    -   Egg.js 中，若在中间件中用 `process.nextTick` 延迟处理，会阻塞后续中间件执行，需谨慎。
-   **控制异步并发数**：
    -   用 `p-limit` 库：`const limit = pLimit(5); await Promise.all(tasks.map(t => limit(() => handleTask(t))))`。
    -   手动实现 Promise 队列，通过计数器控制并发。

#### 2. 内存管理与泄漏排查

**题目**：列举 Egg.js 中常见的内存泄漏场景，说明如何避免，以及用工具定位的方法。

**答案**：

-   **常见场景**：
    1. 闭包引用未释放（如中间件中缓存了请求对象）。
    2. 全局变量累积（如用 `global` 存储请求数据）。
    3. 未清理的事件监听器（如 `process.on('uncaughtException')` 重复绑定）。
    4. Redis/数据库连接未关闭。
-   **避免方法**：
    -   Egg.js 中用 `ctx` 存储请求级数据，避免全局变量。
    -   事件监听器在 `beforeClose` 生命周期中移除。
-   **定位工具**：
    -   `heapdump`：生成堆快照，用 Chrome DevTools 分析。
    -   `clinic.js`：`clinic doctor -- node app.js` 监控内存，`clinic heap-profiler` 定位泄漏点。

### 二、Egg.js 框架深度（企业微信级）

#### 1. 插件机制与生命周期

**题目**：Egg.js 插件的加载顺序是什么？如何开发一个企业微信内部的「鉴权插件」？插件与中间件的区别？解释 Egg.js 的生命周期及初始化数据库/Redis 的时机。

**答案**：

-   **插件加载顺序**：
    1. 按 `plugin.js` 中的 `enable` 和 `package` 依赖关系加载（依赖的插件先加载）。
    2. 内置插件（Egg.js 官方提供，如 egg-onerror、egg-session）→ 第三方插件（社区/团队维护的 npm 包，如 egg-redis、egg-mysql，需安装在 node_modules 并在 config/plugin.js 配置）→ 应用内插件（项目内自定义，通常源码放在 app/plugin/，仅本项目用）。
-   **开发企业微信鉴权插件**：
    -   目录结构：
        ```
        egg-wecom-auth/
        ├── app/
        │   └── middleware/
        │       └── wecomAuth.js  // 鉴权中间件
        ├── config/
        │   ├── config.default.js  // 默认配置
        │   └── plugin.js          // 插件声明
        └── package.json
        ```
    -   关键代码：
        ```javascript
        // app/middleware/wecomAuth.js
        module.exports = (options, app) => {
            return async function wecomAuth(ctx, next) {
                const token = ctx.get('Authorization');
                if (!token) ctx.throw(401, '未授权');
                // 验证企业微信 JWT token
                const user = await ctx.service.wecom.verifyToken(token);
                ctx.user = user;
                await next();
            };
        };
        ```
    -   `config/plugin.js`：
        ```javascript
        exports.wecomAuth = {
            enable: true,
            package: 'egg-wecom-auth',
        };
        ```
-   **插件 vs 中间件**：
    -   插件：可复用的功能模块（如数据库、缓存），影响全局。
    -   中间件：处理请求/响应的逻辑（如鉴权、日志），可按路由配置。
-   **生命周期及示例**：

    ```typescript
    // app.ts（框架入口文件）

    import { Application } from 'egg';

    export default class AppBootHook {
        app: Application;
        constructor(app: Application) {
            this.app = app;
        }

        // 插件和配置加载完毕，应用即将 ready，可初始化数据库/Redis 连接
        async willReady() {
            // 例如：预加载关键数据到内存
            this.app.logger.info('App willReady，加载全局数据');
            // await this.app.redis.get('some_key');
        }

        // 应用 Ready，可进行一些依赖 app 启动后的初始化逻辑
        async didReady() {
            this.app.logger.info('App didReady，应用已启动');
        }

        // 应用关闭前，适合做资源回收，如关闭数据库连接等
        async beforeClose() {
            this.app.logger.info('App beforeClose，资源释放');
            // await this.app.redis.quit();
        }
    }
    ```

    -   `willReady`：插件和配置加载完成，可用于初始化数据库/Redis 连接或预热内存数据。
    -   `didReady`：应用启动完成，适合一些依赖 app 的任务。
    -   `beforeClose`：应用关闭前，适合清理连接/资源，避免泄漏。

#### 2. 多进程模型

**题目**：Egg.js 的 `Master + Agent + Worker` 进程模型各职责是什么？如何利用多进程提升性能？进程间如何通信（IPC）？

**答案**：

-   **进程职责**：
    -   **Master**：管理进程（启动/重启 Agent 和 Worker），不处理业务逻辑。
    -   **Agent**：单进程，执行跨进程任务（如定时任务、配置拉取、资源监控）。
    -   **Worker**：多进程（默认 CPU 核数），处理 HTTP 请求和业务逻辑。
-   **提升性能**：
    -   Worker 多进程充分利用多核 CPU，通过 `cluster` 模块实现负载均衡。
    -   Agent 集中处理后台任务，避免阻塞 Worker。
-   **进程间通信（IPC）**：

    -   Worker 与 Agent：通过 `app.messenger` 发送消息（如 `app.messenger.sendToAgent('task', data)`）。
    -   Worker 之间：通过 Agent 中转（Worker1 → Agent → Worker2）。

-   **为什么有 Worker 还要 Agent？**  
    Worker 会起多份（按 CPU 核数），同一段逻辑会在每个 Worker 里各跑一遍；Agent 只有 1 个进程，适合“整机只跑一次”的任务。

    | 场景                                | 放 Worker 会怎样                             | 放 Agent 会怎样                           |
    | ----------------------------------- | -------------------------------------------- | ----------------------------------------- |
    | 定时任务（如每分钟扫库）            | 有 4 个 Worker 就扫 4 次，重复执行、可能冲突 | 只扫 1 次                                 |
    | 拉取/刷新配置                       | 每个 Worker 各拉一遍，浪费且可能不一致       | 拉一次，再通过 IPC 通知各 Worker          |
    | 监控/上报（如内存、QPS）            | 每个 Worker 各报一份，数据重复、难聚合       | 由 Agent 统一采集、上报一份               |
    | 预加载/预热（如连中间件、预拉数据） | 每个 Worker 都做一遍，重复开销               | 做一次，结果可通过 messenger 给 Worker 用 |

    结论：Worker = 多实例处理请求（吃满多核）；Agent = 单实例做“只跑一份”的后台/跨进程任务（定时、配置、监控等），避免重复执行。

### 三、中间层服务设计与架构

#### 1. BFF 层设计

**题目**：如何用 Egg.js 设计面向前端的 BFF 层，聚合多个后端微服务的数据？如何处理数据聚合时的并发和错误（如部分服务失败时的降级策略）？

**答案**：

-   **BFF 层设计**：
    -   在 `app/service` 中封装对后端微服务的调用（如 `service.user`、`service.order`）。
    -   在 `app/controller` 中聚合数据：
        ```javascript
        // app/controller/bff.js
        async getUserProfile() {
          const { userId } = ctx.params;
          // 并发调用用户、订单、积分服务
          const [user, orders, points] = await Promise.all([
            ctx.service.user.get(userId),
            ctx.service.order.list(userId),
            ctx.service.points.get(userId),
          ]);
          ctx.body = { user, orders, points };
        }
        ```
-   **并发与错误处理**：
    -   用 `Promise.allSettled` 替代 `Promise.all`，避免单个服务失败导致整体失败。
    -   降级策略：若积分服务失败，返回默认值（如 `points: 0`）。
    -   用 `egg-circuit-breaker` 实现熔断，防止故障扩散。

#### 2. 安全性与鉴权

**题目**：企业级鉴权方案选型（JWT/OAuth2.0/Session）？如何在 Egg.js 中实现？如何防止 XSS/CSRF/SQL 注入？

**答案**：

-   **鉴权方案选型**：
    -   企业微信内部系统：推荐 **JWT**（无状态、易扩展），结合 `egg-jwt` 插件。
    -   第三方应用集成：用 **OAuth2.0**（企业微信授权登录）。
-   **Egg.js 实现 JWT**：
    -   安装 `egg-jwt`，配置 `config.default.js`：
        ```javascript
        exports.jwt = {
            secret: 'your-secret', // 企业微信密钥
        };
        ```
    -   路由中使用：
        ```javascript
        // app/router.js
        module.exports = (app) => {
            const { router, controller, jwt } = app;
            router.get('/api/user', jwt, controller.user.get); // 需鉴权
        };
        ```
-   **安全防护**：
    -   **XSS**：用 `egg-security` 插件的 `xssProtection`，对用户输入进行转义。
    -   **CSRF**：`egg-security` 默认开启，通过 `ctx.csrf` 生成 token，前端请求时携带。
    -   **SQL 注入**：用 Sequelize/TypeORM 的参数化查询，避免拼接 SQL。

#### 3. 链路追踪与可观测性

**题目**：如何在 Egg.js 中实现请求全链路追踪（Trace ID/Span ID）？结合 ELK/Loki 设计日志中间件。

**答案**：

-   **链路追踪实现**：
    -   中间件生成 Trace ID：
        ```javascript
        // app/middleware/trace.js
        module.exports = () => {
            return async function trace(ctx, next) {
                ctx.traceId = ctx.get('X-Trace-ID') || uuid.v4();
                ctx.set('X-Trace-ID', ctx.traceId);
                await next();
            };
        };
        ```
    -   调用后端服务时，通过 HTTP header 传递 Trace ID。
-   **日志中间件**：
    -   用 `egg-logger` 记录日志，包含 Trace ID、请求参数、响应时间：
        ```javascript
        // app/middleware/logger.js
        module.exports = () => {
            return async function logger(ctx, next) {
                const start = Date.now();
                await next();
                const duration = Date.now() - start;
                ctx.logger.info({
                    traceId: ctx.traceId,
                    method: ctx.method,
                    url: ctx.url,
                    status: ctx.status,
                    duration,
                });
            };
        };
        ```
    -   日志输出到文件，通过 Filebeat 采集到 ELK/Loki 分析。

#### 4. 限流与熔断

**题目**：如何用 Egg.js 实现接口限流（令牌桶/漏桶算法）？高并发下如何保护服务？如何实现熔断降级？

**答案**：

-   **接口限流**：
    -   用 `egg-rate-limiter` 插件（基于 Redis 令牌桶）：
        ```javascript
        // config/config.default.js
        exports.rateLimiter = {
            redis: { host: '127.0.0.1', port: 6379 },
            limits: [
                { path: '/api/order', max: 100, duration: 60 }, // 每分钟100次
            ],
        };
        ```
-   **熔断降级**：
    -   熔断是一种服务保护机制。当后端依赖服务出现大量超时或错误时，熔断器会“断开”该服务调用，快速失败并直接返回降级结果，避免请求堆积进一步拖垮系统。当依赖恢复健康后，熔断器自动“闭合”恢复访问。常用于高并发/微服务架构下防止雪崩和级联故障。
    -   用 `opossum` 库实现熔断器：
        ```javascript
        // app/service/order.js
        const CircuitBreaker = require('opossum');
        class OrderService extends Service {
            constructor(ctx) {
                super(ctx);
                this.breaker = new CircuitBreaker(
                    this.callOrderService.bind(this),
                    {
                        timeout: 5000, // 5秒超时
                        errorThresholdPercentage: 50, // 错误率50%熔断
                    }
                );
                this.breaker.fallback(() => ({ orders: [] })); // 降级返回空列表
            }
            async callOrderService(userId) {
                return await this.ctx.curl('http://order-service/api/orders', {
                    userId,
                });
            }
            async list(userId) {
                return await this.breaker.fire(userId);
            }
        }
        ```

### 四、性能优化与问题排查

#### 1. 性能瓶颈定位

**题目**：Egg.js 中间层常见性能瓶颈（CPU 密集型/I/O 密集型）？如何用工具定位？如何优化？

**答案**：

-   **常见瓶颈**：
    -   **CPU 密集型**：复杂计算、JSON 大对象序列化。
    -   **I/O 密集型**：数据库慢查询、未缓存的第三方接口调用。
-   **定位工具**：
    -   `clinic.js`：`clinic flame -- node app.js` 生成火焰图，定位 CPU 热点。
    -   `egg-alinode`：阿里云 Node.js 性能平台，监控 CPU、内存、慢请求。
-   **优化方案**：

    -   CPU 密集型：用 `worker_threads` offload 计算任务。

        > `worker_threads` 是 Node.js 内置的多线程模块，可以把耗 CPU 的计算任务（如加密、压缩、复杂数据处理）丢到子线程，避免阻塞主事件循环，提升并发能力。典型使用场景包括：大文件哈希、图片处理、大量循环计算等。

        **示例：**

        ```typescript
        // worker.js
        const { parentPort } = require('worker_threads');
        parentPort.on('message', (data) => {
            // 执行耗时的计算任务
            const result = heavyCalculate(data);
            parentPort.postMessage(result);
        });

        // main.js
        const { Worker } = require('worker_threads');
        function runWorker(input): Promise<any> {
            return new Promise((resolve, reject) => {
                const worker = new Worker('./worker.js');
                worker.postMessage(input);
                worker.on('message', resolve);
                worker.on('error', reject);
            });
        }
        // 在 Egg.js Service 或 Controller 中调度 worker_threads
        ```

        > 企业项目中强烈建议 CPU 密集代码全部 offload 到 `worker_threads`，并监控子线程资源，防止“主线程阻塞”影响整体服务可用性。

    -   I/O 密集型：Redis 缓存热点数据（如用户信息），数据库加索引。

#### 2. 数据库优化

**题目**：如何优化数据库查询（索引设计/连接池/分页查询/避免 N+1 查询）？在 Egg.js 中如何用 Sequelize 处理事务？分布式事务的解决方案？

**答案**：

-   **查询优化**：
    -   索引设计：对 `WHERE`、`ORDER BY` 字段加索引（如 `userId`、`createTime`）。
    -   连接池：Sequelize 配置 `pool: { max: 10, min: 0 }`。
    -   分页查询：用 `OFFSET/LIMIT`，避免全表扫描。
    -   避免 N+1 查询：用 Sequelize 的 `include` 预加载关联数据。
-   **Sequelize 事务**：
    ```javascript
    // app/service/order.js
    async createOrder(data) {
      const transaction = await this.ctx.model.transaction();
      try {
        const order = await this.ctx.model.Order.create(data, { transaction });
        await this.ctx.model.Inventory.decrement('stock', { where: { id: data.productId }, transaction });
        await transaction.commit();
        return order;
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    }
    ```
-   **分布式事务**：
    -   用 Seata 或 TCC 模式，Egg.js 中通过 `egg-seata` 插件集成。

#### 3. 高并发与幂等性

**题目**：如何处理海量请求（集群部署/Nginx 负载均衡）？如何实现接口幂等性（防止重复提交）？结合企业微信消息推送场景说明。

**答案**：

-   **海量请求处理**：
    -   集群部署：多台服务器运行 Egg.js，Nginx 配置负载均衡（轮询/IP hash）。
    -   静态资源 CDN 加速，动态接口 Redis 缓存。
-   **幂等性实现**：
    -   企业微信消息推送场景：用户重复点击发送，需保证消息只推送一次。
    -   方案：
        1. 前端生成唯一 `requestId`，请求时携带。
        2. 后端用 Redis 存储 `requestId`，设置过期时间（如 5 分钟）：
            ```javascript
            // app/service/message.js
            async send(userId, content, requestId) {
              const key = `wecom:message:${requestId}`;
              const exists = await this.app.redis.get(key);
              if (exists) return { success: true, msg: '已发送' };
              // 调用企业微信 API 推送
              await this.callWecomAPI(userId, content);
              await this.app.redis.setex(key, 300, '1');
              return { success: true };
            }
            ```

### 五、源码与原理拓展

#### 1. Egg.js 源码

**题目**：Egg.js 的 Loader 机制如何按目录约定加载文件？中间件的「洋葱模型」如何实现？对比 Koa 的中间件。

**答案**：

-   **Loader 机制**：

    -   Egg.js 按 `app/controller`、`app/service`、`app/middleware` 等目录约定自动加载文件。
    -   `Loader` 类遍历目录，通过 `require` 加载文件，并挂载到 `app` 或 `ctx` 上（如 `app.controller.user`）。

    **目录 → 挂载关系示意**：

    ```mermaid
    flowchart LR
      subgraph dir["约定目录"]
        A[app/controller/user.js]
        B[app/service/user.js]
        C[app/middleware/auth.js]
      end
      subgraph loader["Loader 遍历 require"]
        L[按文件名/目录名]
      end
      subgraph mount["挂载到 app / ctx"]
        M1["app.controller.user"]
        M2["ctx.service.user"]
        M3["app.middleware.auth"]
      end
      dir --> loader --> mount
    ```

    **示例**：目录里有一个 `app/controller/user.js`，导出类或对象，Loader 会把它挂成 `app.controller.user`，在路由里用 `app.controller.user` 指向该控制器。

    ```
    app/
    ├── controller/
    │   └── user.js      →  app.controller.user
    ├── service/
    │   └── user.js      →  ctx.service.user（请求上下文中）
    └── middleware/
        └── auth.js      →  app.middleware.auth
    ```

    ```javascript
    // app/controller/user.js（约定：文件名 user → 挂载为 app.controller.user）
    module.exports = (app) => {
        return class UserController extends app.Controller {
            async index() {
                const users = await this.ctx.service.user.list(); // 对应 app/service/user.js
                this.ctx.body = users;
            }
        };
    };
    ```

    Controller 里通过 `this.ctx.service.xxx` 访问的 `xxx` 就是 `app/service/` 下同名文件挂上去的 Service，Loader 按目录约定和文件名一一对应。

-   **洋葱模型实现**：
    -   Egg.js 基于 Koa，中间件通过 `app.use(middleware)` 注册，形成一个数组。
    -   请求到达时，按顺序执行中间件，通过 `await next()` 进入下一个中间件，返回时逆序执行后续逻辑。
-   **与 Koa 对比**：
    -   Egg.js 中间件支持按路由配置（`router.get('/api', middleware1, middleware2)`），Koa 需手动判断路径。
    -   Egg.js 中间件可通过 `config.middleware` 全局配置，Koa 需手动 `app.use`。

### 六、实际场景与项目经验

#### 1. 项目架构设计

**题目**：介绍一个你做过的 Egg.js 中间层项目，模块划分、服务通信、数据库设计是怎样的？遇到的最大难点及解决方案？

**答案**（示例）：

-   **项目背景**：企业微信内部 CRM 系统的 BFF 层，聚合用户、客户、订单等微服务。
-   **模块划分**：
    -   `app/controller`：按业务分 `user`、`customer`、`order`。
    -   `app/service`：封装对后端微服务的调用（`service.user`、`service.customer`）。
    -   `app/middleware`：鉴权、日志、限流。
-   **服务通信**：
    -   用 `ctx.curl` 调用后端微服务，通过 `app.messenger` 实现 Worker 间通信。
-   **数据库设计**：
    -   仅存储 BFF 层配置（如路由规则、限流配置），业务数据来自后端微服务。
-   **最大难点**：
    -   高并发下后端微服务超时，导致 BFF 层响应慢。
    -   解决方案：用 `egg-circuit-breaker` 实现熔断，超时后返回缓存数据；同时优化后端微服务性能，增加 Redis 缓存。

#### 2. 企业微信集成

**题目**：如何对接企业微信 API（用户管理/消息推送/第三方应用授权）？如何处理 API 调用的限流和重试？

**答案**：

-   **对接步骤**：
    1. 在企业微信管理后台创建应用，获取 `corpid` 和 `corpsecret`。
    2. 用 `egg-curl` 调用 API，获取 `access_token`（有效期 2 小时，需缓存）：
        ```javascript
        // app/service/wecom.js
        async getAccessToken() {
          const key = 'wecom:access_token';
          let token = await this.app.redis.get(key);
          if (!token) {
            const res = await this.ctx.curl('https://qyapi.weixin.qq.com/cgi-bin/gettoken', {
              data: { corpid: 'xxx', corpsecret: 'xxx' },
              dataType: 'json',
            });
            token = res.data.access_token;
            await this.app.redis.setex(key, 7200, token);
          }
          return token;
        }
        ```
    3. 调用用户管理/消息推送 API，携带 `access_token`。
-   **限流与重试**：
    -   限流：企业微信 API 有调用频率限制（如每分钟 1000 次），用 `egg-rate-limiter` 控制。
    -   重试：用 `axios-retry` 或手动实现重试逻辑（网络错误时重试 3 次）。

#### 3. 线上故障排查

**题目**：分享一次线上故障（内存泄漏/服务崩溃/接口超时）的排查经历，如何定位、修复及预防？

**答案**（示例：内存泄漏）：

-   **故障现象**：Egg.js 服务内存持续增长，最终 OOM 重启。
-   **排查过程**：
    1. 用 `clinic heap-profiler` 生成堆快照，发现大量 `Buffer` 对象未释放。
    2. 排查代码，发现中间件中用 `fs.readFileSync` 读取大文件，且未关闭文件描述符。
-   **修复方案**：
    -   改用 `fs.createReadStream` 流式读取文件，避免一次性加载大文件。
    -   在 `finally` 块中关闭文件描述符。
-   **预防措施**：
    -   代码审查中禁止在中间件里同步读取大文件。
    -   用 `egg-alinode` 实时监控内存，设置告警阈值。

