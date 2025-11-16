# AI Agent SSE 流式聊天示例

这是一个使用 React + Express 构建的 AI Agent 聊天应用示例，通过 Server-Sent Events (SSE) 实现流式响应。

## 技术栈

-   **前端**: React + Vite + @chatscope/chat-ui-kit-react + streamdown
-   **后端**: Express + Node.js
-   **API**: Dify API (通过后端代理)

## 功能特性

-   ✅ 实时流式响应显示
-   ✅ 美观的聊天界面（使用 @chatscope/chat-ui-kit-react）
-   ✅ SSE 流式数据处理（使用 streamdown）
-   ✅ 对话历史管理
-   ✅ 错误处理和重试机制

## 项目结构

```
AI_Agent示例/
├── server/           # Express 后端服务器
│   └── server.js    # 代理 Dify API 的 SSE 流
├── client/          # React 前端应用
│   ├── src/
│   │   ├── App.jsx              # 主应用组件
│   │   ├── main.jsx             # 入口文件
│   │   ├── index.css            # 全局样式
│   │   ├── App.css              # 应用样式
│   │   └── utils/
│   │       └── streamClient.js  # SSE 流处理工具
│   ├── index.html               # HTML 模板
│   └── vite.config.js           # Vite 配置
└── README.md        # 说明文档
```

## 环境变量配置

在项目根目录创建 `.env` 文件（如果不存在），添加以下配置：

```env
DIFY_API_KEY=your_api_key_here
DIFY_BASE_URL=https://dify.cvte.com
DIFY_ENDPOINT=/app/c7fd3595-7e95-40e8-8d77-2ca778694c73/develop
DIFY_USER=your_user_id
PORT=3001
```

## 安装依赖

```bash
npm install
# 或
yarn install
```

## 运行应用

### 方式一：同时启动前后端（推荐）

```bash
npm run dev
```

这会同时启动：

-   后端服务器：http://localhost:3001
-   前端应用：http://localhost:3000

### 方式二：分别启动

**启动后端服务器：**

```bash
npm run dev:server
```

**启动前端应用：**

```bash
npm run dev:client
```

## 构建生产版本

```bash
npm run build
```

构建产物将输出到 `client/dist` 目录。

## 使用说明

1. 确保已配置 `.env` 文件中的 Dify API 参数
2. 启动应用后，访问 http://localhost:3000
3. 在聊天界面输入消息，AI 会以流式方式实时返回响应
4. 对话历史会自动保存，支持多轮对话

## API 端点

### POST /api/chat/stream

流式聊天端点，接收用户消息并返回 SSE 流式响应。

**请求体：**

```json
{
    "message": "用户消息内容",
    "conversation_id": "对话ID（可选）",
    "user": "用户ID（可选）"
}
```

**响应：**
Server-Sent Events 流，格式：

```
event: message
data: {"event": "message", "answer": "...", "conversation_id": "..."}

event: message_end
data: {"event": "message_end"}
```

### GET /health

健康检查端点，返回服务器状态。

## 技术细节

### SSE 流处理

使用 `streamdown` 库处理 SSE 流式数据：

-   自动解析 SSE 格式（`event:` 和 `data:` 行）
-   处理不完整的数据块
-   支持错误处理和流式结束检测

### Dify API 集成

后端服务器作为代理：

-   保护 API Key（不暴露给前端）
-   处理 CORS 问题
-   转发 SSE 流式响应
-   自动处理连接断开和错误

### 前端状态管理

-   使用 React Hooks 管理消息列表和对话状态
-   实时更新流式响应内容
-   支持对话历史管理

## 故障排除

### 后端服务器无法启动

1. 检查 `.env` 文件配置是否正确
2. 确认端口 3001 未被占用
3. 检查 Dify API 配置是否正确

### 前端无法连接后端

1. 确认后端服务器已启动
2. 检查 `vite.config.js` 中的代理配置
3. 查看浏览器控制台的错误信息

### SSE 流式响应不工作

1. 检查网络连接
2. 查看浏览器控制台和服务器日志
3. 确认 Dify API 返回的是正确的 SSE 格式

## 许可证

MIT
