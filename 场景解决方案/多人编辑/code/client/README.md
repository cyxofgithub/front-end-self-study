# Client 静态文件服务器

这是 Yjs 多人协同编辑系统的前端静态文件服务器，独立于后端服务运行。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd client
npm install
```

### 2. 启动服务器

```bash
npm start
```

服务器将在 `http://localhost:8080` 启动。

### 3. 访问应用

打开浏览器访问 `http://localhost:8080`。

## 🔧 配置说明

### 端口配置

默认端口：8080

通过环境变量修改：

```bash
export PORT=3001
npm start
```

### WebSocket 服务器地址

前端默认连接到 `ws://localhost:3000`（Spring Boot WebSocket 服务器）。

可以通过 URL 参数修改：

```
http://localhost:8080?ws=ws://localhost:3000
```

## 📝 使用说明

### 启动完整系统

需要同时启动两个服务：

1. **Spring Boot WebSocket 服务器**（端口 3000）：
   ```bash
   cd server/spring-boot
   mvn spring-boot:run
   ```

2. **Client 静态文件服务器**（端口 8080）：
   ```bash
   cd client
   npm start
   ```

然后访问 `http://localhost:8080` 即可使用。

## 🎯 架构说明

- **Client 服务器**（端口 8080）：提供前端静态资源（HTML、JS、CSS）
- **Spring Boot 服务器**（端口 3000）：提供 WebSocket 服务和 MySQL 持久化

两个服务独立运行，通过 WebSocket 协议通信。

---

**Happy Coding! 🎉**

