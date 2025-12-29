# Node.js 版本 - Yjs 多人协同文档编辑系统

这是使用 **Node.js + Express + WebSocket** 实现的 Yjs 多人协同文档编辑系统后端服务。

## 📚 项目简介

使用 Node.js 生态系统中的 `y-websocket` 库，完全兼容 Yjs 协议，实现简单高效。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd server/nodejs
npm install
```

### 2. 初始化数据库

```bash
# 登录 MySQL
mysql -u root -p

# 执行初始化脚本（在 code 目录下）
source ../../init-db.sql
```

### 3. 配置数据库（可选）

通过环境变量配置数据库连接：

```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_USER=root
export MYSQL_PASSWORD=your_password
export MYSQL_DATABASE=yjs_db
export MYSQL_TABLE_NAME=yjs_documents
```

如果不设置环境变量，将使用默认配置。

### 4. 启动服务器

```bash
npm start
```

服务器将在 `http://localhost:3000` 启动。

### 5. 访问应用

打开浏览器访问 `http://localhost:3000`。

## 📁 文件说明

-   `server.js` - Express + WebSocket 服务器主文件
-   `mysql-persistence.js` - MySQL 持久化模块
-   `package.json` - Node.js 依赖配置

## 🔧 配置说明

### 端口配置

默认端口：3000

通过环境变量修改：

```bash
export PORT=8080
npm start
```

### 数据库配置

支持通过环境变量配置：

-   `MYSQL_HOST` - 数据库主机（默认：localhost）
-   `MYSQL_PORT` - 数据库端口（默认：3306）
-   `MYSQL_USER` - 数据库用户名（默认：root）
-   `MYSQL_PASSWORD` - 数据库密码（默认：空）
-   `MYSQL_DATABASE` - 数据库名称（默认：yjs_db）
-   `MYSQL_TABLE_NAME` - 表名（默认：yjs_documents）

## 🎯 核心功能

1. **WebSocket 服务器** - 使用 `y-websocket` 库实现 Yjs 协议
2. **MySQL 持久化** - 文档状态自动保存到数据库
3. **静态资源服务** - 提供前端文件（client 目录）

## 📝 开发说明

### 开发模式

```bash
npm start
```

### 生产部署

建议使用 PM2 或其他进程管理器：

```bash
npm install -g pm2
pm2 start server.js --name yjs-editor
pm2 save
pm2 startup
```

## 🐛 常见问题

### Q: 数据库连接失败？

A: 检查：

1. MySQL 服务是否运行
2. 数据库配置是否正确
3. 数据库和表是否已创建

### Q: 静态资源无法访问？

A: 确保 `client` 目录在项目根目录（code 目录）下。

### Q: WebSocket 连接失败？

A: 检查：

1. 服务器是否正常启动
2. 端口是否被占用
3. 防火墙是否阻止连接

## 📖 参考资源

-   [Yjs 官方文档](https://docs.yjs.dev/)
-   [y-websocket GitHub](https://github.com/yjs/y-websocket)
-   [Express 官方文档](https://expressjs.com/)

---

**Happy Coding! 🎉**
