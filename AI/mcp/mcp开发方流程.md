# MCP 开发流程

## 一、核心概念

**MCP（Model Context Protocol）**：模型上下文协议，用于 AI 客户端与服务器通信。

-   **MCP 服务器**：提供工具（Tools）和提示词（Prompts）能力
-   **MCP 客户端**：如 Cursor、Claude Desktop 等 AI 应用
-   **传输方式**：stdio（标准输入输出）或 HTTP
-   **协议格式**：JSON-RPC 2.0

## 二、传输方式对比

| 特性       | stdio                    | HTTP                 |
| ---------- | ------------------------ | -------------------- |
| 通信方式   | 标准输入输出（进程通信） | HTTP POST 请求       |
| 适用场景   | 本地进程，简单部署       | 远程服务，跨网络访问 |
| 实现复杂度 | 简单（readline）         | 中等（HTTP 服务器）  |
| 性能       | 低延迟                   | 网络延迟             |
| 安全性     | 本地安全                 | 需要 HTTPS 和认证    |

## 三、开发步骤

### 1. 环境准备

```bash
# Node.js v18+（支持 ES 模块）
node -v

# 初始化项目
mkdir mcp-server && cd mcp-server
npm init -y

# 在 package.json 中添加
# "type": "module"
```

### 2. 实现服务器

**核心结构：**

```javascript
// 1. 定义服务器配置
const MCP_SERVER_CONFIG = {
  name: 'server-name',
  description: '服务器描述',
  tools: [...],      // 工具列表
  prompts: [...]    // 提示词列表
};

// 2. 实现工具函数
async function toolFunction(params) {
  // 工具逻辑
  return result;
}

// 3. 处理 JSON-RPC 2.0 消息
async function handleMcpMessage(message) {
  const request = JSON.parse(message);
  const { method, params, id } = request;

  // 处理不同方法
  if (method === 'initialize') { ... }
  if (method === 'tools/list') { ... }
  if (method === 'tools/call') { ... }
  if (method === 'prompts/list') { ... }
  if (method === 'prompts/get') { ... }

  return createResponse(id, result);
}

// 4. 启动服务器（stdio）
function startServer() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', async (line) => {
    const response = await handleMcpMessage(line);
    if (response) process.stdout.write(`${response}\n`);
  });
}
```

**HTTP 传输方式实现：**

```javascript
import http from 'http';

// 4. 启动 HTTP 服务器
function startHttpServer(port = 3000) {
    const server = http.createServer(async (req, res) => {
        // 只处理 POST 请求
        if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            return;
        }

        // 读取请求体
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                // 处理 JSON-RPC 2.0 请求
                const response = await handleMcpMessage(body);

                if (response) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(response);
                } else {
                    // 通知请求，不返回响应
                    res.writeHead(204);
                    res.end();
                }
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(
                    JSON.stringify({
                        jsonrpc: '2.0',
                        id: null,
                        error: { code: -32603, message: error.message },
                    })
                );
            }
        });
    });

    server.listen(port, () => {
        console.log(`MCP HTTP 服务器运行在 http://localhost:${port}`);
    });
}
```

### 3. 必需方法实现

| 方法           | 说明           | 响应格式                                        |
| -------------- | -------------- | ----------------------------------------------- |
| `initialize`   | 初始化连接     | `{ protocolVersion, capabilities, serverInfo }` |
| `tools/list`   | 列出所有工具   | `{ tools: [...] }`                              |
| `tools/call`   | 调用工具       | `{ content: [{ type, text }] }`                 |
| `prompts/list` | 列出所有提示词 | `{ prompts: [...] }`                            |
| `prompts/get`  | 获取提示词内容 | `{ messages: [...] }`                           |

### 4. 客户端配置（Cursor）

**stdio 方式：**

1. 打开设置：`Cmd/Ctrl + ,` → Features → MCP
2. 添加服务器：
    - **Name**: 服务器名称
    - **Type**: `command` (stdio)
    - **Command**: `node /绝对路径/main.js`
3. 验证：检查状态指示灯是否为绿色

**HTTP 方式：**

1. 打开设置：`Cmd/Ctrl + ,` → Features → MCP
2. 添加服务器：
    - **Name**: 服务器名称
    - **Type**: `http` 或 `url`
    - **URL**: `http://localhost:3000`（服务器地址）
3. 验证：检查状态指示灯是否为绿色

### 5. 测试调试

**stdio 方式测试：**

```bash
# 手动测试
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node main.js

# 查看日志
# stdout 只能输出 JSON-RPC 消息
# 调试日志使用 stderr: console.error()
```

**HTTP 方式测试：**

```bash
# 启动服务器
node main.js

# 使用 curl 测试
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'

# 或使用 httpie
http POST http://localhost:3000 \
  jsonrpc=2.0 method=tools/list id=1
```

## 四、工具定义示例

```javascript
{
  name: 'get_forecast',
  description: '查询天气预报',
  parameters: {
    type: 'object',
    properties: {
      city: { type: 'string', description: '城市名称' },
      days: { type: 'integer', default: 3, minimum: 1, maximum: 7 }
    },
    required: ['city']
  }
}
```

## 五、提示词定义示例

```javascript
{
  name: 'weather_query',
  description: '快速查询天气',
  arguments: [
    { name: 'city', description: '城市名称', required: true },
    { name: 'days', description: '天数', required: false }
  ]
}
```

## 六、常见问题

| 问题           | 解决方案                                                                     |
| -------------- | ---------------------------------------------------------------------------- |
| 服务器无响应   | 检查 Node.js 版本，确认 `type: "module"`                                     |
| 客户端无法连接 | stdio：验证 command 路径为绝对路径<br>HTTP：检查服务器是否启动，URL 是否正确 |
| JSON 解析错误  | 确保消息格式符合 JSON-RPC 2.0                                                |
| 工具调用失败   | 检查参数验证和错误处理逻辑                                                   |
| HTTP CORS 错误 | 添加 CORS 响应头（如需要）                                                   |

## 七、最佳实践

1. **错误处理**：所有方法都要有 try-catch 和错误响应
2. **参数验证**：工具调用前验证必需参数
3. **日志记录**：stdio 使用 `stderr`，HTTP 使用 `console.log/error`
4. **响应格式**：严格遵循 JSON-RPC 2.0 规范
5. **通知请求**：`id` 为 `undefined` 时不返回响应
6. **HTTP 安全**：生产环境使用 HTTPS，添加认证机制
7. **跨域处理**：HTTP 方式如需要，添加 CORS 响应头

## 八、总结

通信：http/stido(进程通信)
消息格式：json2.0
必须实现的几个方法：
| -------------- | -------------- | ----------------------------------------------- |
| `initialize` | 初始化连接 | 返回版本服务信息、提供的工具和提示词能力 |
| `tools/list` | 列出所有工具 | 返回工具列表 |
| `tools/call` | 调用工具 | 支持工具调用 |
| `prompts/list` | 列出所有提示词 | 返回提示词列表 |
| `prompts/get` | 获取提示词内容 | 获取提示词内容 |
