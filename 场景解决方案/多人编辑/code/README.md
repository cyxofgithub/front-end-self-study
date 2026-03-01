# Yjs 多人协同文档编辑系统

本项目基于 **Yjs**（高性能 CRDT 引擎），实现了适用于团队的实时多人协作文本编辑系统，支持 Node.js 及 Spring Boot 两套后端，便于不同技术栈集成使用。

## 📁 项目结构

```
code/
├── client/                   # 前端静态资源及 Yjs 客户端
│   ├── index.html            # 编辑器页面
│   └── client.js             # Yjs 同步逻辑及连接配置
│
├── server/                   # 服务端代码
│   ├── nodejs/               # Node.js 实现
│   │   ├── server.js         # Express + WebSocket 服务
│   │   ├── mysql-persistence.js # Yjs 状态 MySQL 持久化
│   │   ├── package.json
│   │   └── package-lock.json
│
├── init-db.sql               # 初始化 MySQL 表结构脚本
├── MYSQL_SETUP.md            # MySQL 配置/使用说明文档
└── README.md                 # 项目说明（本文件）
```

## 🎯 主要特性

-   ✅ **实时协同**：多用户同步编辑，毫秒级响应
-   ✅ **自动冲突解决**：基于 CRDT，无需手动合并
-   ✅ **断线重连与离线编辑**：离线可编辑，恢复后自动与他人同步
-   ✅ **高效持久化**：文档状态存储于 MySQL，安全可靠
-   ✅ **双服务端实现**：便于前/后端人员选型和扩展

## 🚀 快速上手指南

### 方案一：Node.js 服务端

#### 1. 安装依赖

```bash
cd server/nodejs
npm install
```

#### 2. 初始化数据库

```bash
# 登录 MySQL，执行表结构脚本
mysql -u root -p < ../../init-db.sql
```

#### 3. 启动服务

```bash
cd server/nodejs
npm start
```

服务默认启动于 [http://localhost:3000](http://localhost:3000)

### 方案二：Spring Boot 服务端

#### 1. 环境要求

-   JDK 1.8+
-   Maven 3.6+
-   MySQL 5.7+
-   Node.js（用于启动 client 静态资源服务器）

#### 2. 数据库准备

```bash
mysql -u root -p < init-db.sql
```

#### 3. 数据库配置

编辑 `server/spring-boot/src/main/resources/application.yml`：

```yaml
spring:
    datasource:
        url: jdbc:mysql://localhost:3306/yjs_db
        username: root
        password: your_password
```

#### 4. 启动服务

分别启动：

-   Spring Boot WebSocket 服务（3000 端口默认）

```bash
cd server/spring-boot
mvn spring-boot:run
```

-   Client 前端静态服务器（8080 端口默认）

```bash
cd client
npm install        # 首次需
npm start
```

### 访问应用

浏览器访问 [http://localhost:8080](http://localhost:8080)

1. 打开多个标签页/浏览器测试多端实时编辑
2. 内容输入任意变动将自动同步到所有已打开标签页

## 📖 技术原理简述

### Yjs 协同机制

-   **全局唯一标识**：每个字符变更带唯一 ID（客户端 ID+时间+位置）
-   **幂等与可交换性**：操作顺序不同，结果仍能收敛一致
-   **只传变化**：同步过程仅发送变更数据，降低带宽和延迟

### CRDT 冲突解决举例

同时插入内容的合并无需服务器转换逻辑，按 ID 排序即可自然收敛——无需 OT 传统算法的复杂修改偏移调整。

## 🔧 配置说明

### MySQL 连接（Node.js）

可通过环境变量覆盖默认参数：

```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_USER=root
export MYSQL_PASSWORD=your_password
export MYSQL_DATABASE=yjs_db
export MYSQL_TABLE_NAME=yjs_documents
```

### WebSocket 连接及文档路由

-   WebSocket 默认端口：3000
-   路径格式：`ws://localhost:3000/{docName}`，如 `/demo`、`/文档1` 等

## 📚 目录与组件补充说明

-   **client/** 前端编辑器页面及 Yjs 适配代码
    -   `index.html`：基础页面
    -   `client.js`：连接服务器，实现实时同步
-   **server/nodejs/** Node.js 服务端
    -   `server.js`：Express + ws 搭建实时通道
    -   `mysql-persistence.js`：MySQL 文档持久化实现
-   **server/spring-boot/** Spring Boot 服务端
    -   WebSocket+MySQL 全栈后端，详情见专用 README

## 🐞 常见问题解答

-   **为何需要 WebSocket？**  
    WebSocket 用于在多客户端之间转发消息和同步文档状态。

-   **文档数据存储位置？**  
    所有协同编辑内容最终持久化于 MySQL（默认表名 `yjs_documents`）。

-   **并发编辑规模如何？**  
    Yjs 支持大规模并发同步，但受服务器和带宽影响，建议负载测试评估。

-   **是否支持访问权限控制？**  
    可在服务端自定义认证和文档访问鉴权逻辑，具体见服务端实现。

-   **Node.js/Spring Boot 两方案主要差异？**  
    Node.js 采取现成 [y-websocket](https://github.com/yjs/y-websocket) 实现，配置简单、自带持久化接口；Spring Boot 适合 Java 生态，但 WebSocket/CRDT 需自行集成。

## 参考资料

-   [Yjs - 官方文档](https://docs.yjs.dev/)
-   [Yjs 项目地址](https://github.com/yjs/yjs)
-   [CRDT 理论与实践](https://crdt.tech/)
-   [y-websocket 协议](https://github.com/yjs/y-websocket)

## 许可证

MIT License

---

**Happy Sync & Collaboration！🎉**
