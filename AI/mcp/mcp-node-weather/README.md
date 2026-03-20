# MCP（Model Context Protocol）快速入门文档（Node.js 版）

本文将基于 Node.js 重构 MCP 服务器示例（天气查询工具），涵盖环境搭建、代码实现、客户端配置及核心调试，让你快速掌握 Node.js 环境下的 MCP 开发。

---

## 一、核心概念回顾（Node.js 视角）

MCP 的客户端-服务器架构在 Node.js 中表现为：

-   **MCP 服务器**：用原生 Node.js 编写的本地服务，通过 `readline` 模块处理 stdio 通信，遵循 MCP 协议**暴露工具/提示能力**。
-   **MCP 客户端**：如 Claude Desktop、Cursor 等 AI 应用，通过 stdio 与 Node.js 服务器通信。
-   **传输方式**：本示例使用 `stdio`（标准输入输出，本地进程通信），通过 JSON 消息进行交互。

---

## 二、环境搭建（Node.js）

### 1. 前置条件

-   安装 Node.js（推荐 v18+，需支持 ES 模块和 async/await）：[Node.js 官网](https://nodejs.org/)
-   验证安装：
    ```bash
    node -v  # 输出 v18.x.x 及以上
    npm -v   # 输出 9.x.x 及以上
    ```

### 2. 初始化项目

```bash
# 创建项目目录并进入
mkdir mcp-node-weather && cd mcp-node-weather

# 初始化 npm 项目（默认 ES 模块，需设置 type: module）
npm init -y
# 编辑 package.json，添加 "type": "module"（关键：Node.js 启用 ES 模块）
sed -i '' '/"name": "mcp-node-weather",/a\  "type": "module",' package.json  # Mac/Linux
# Windows 手动编辑 package.json，添加 "type": "module"

# 注意：本示例使用原生 Node.js 实现，无需安装任何第三方依赖
# 若需使用真实天气 API，可安装 HTTP 请求库（示例用模拟数据）：
# npm install axios
```

---

## 三、Node.js 实现 MCP 天气服务器

### 1. 完整代码（main.js）

本示例使用原生 Node.js 实现，无需第三方库，通过 `readline` 模块处理 stdio 通信：

```javascript
/**
 * 遵循 MCP 协议的 Node.js 服务器（stdio 传输）
 * 功能：提供天气查询工具 get_forecast
 */
import { createInterface } from 'readline';

// 1. 定义服务器元数据和工具列表
const MCP_SERVER_CONFIG = {
    name: 'node-weather-server',
    description: '基于 Node.js 的天气查询工具服务器（遵循 MCP 协议）',
    tools: [
        {
            name: 'get_forecast',
            description: '查询指定城市未来几天的天气预报',
            parameters: {
                type: 'object',
                properties: {
                    city: {
                        type: 'string',
                        description: '城市名称（如广州、北京）',
                    },
                    days: {
                        type: 'integer',
                        description: '预报天数，默认3天',
                        default: 3,
                        minimum: 1,
                        maximum: 7,
                    },
                },
                required: ['city'], // 必传参数
            },
        },
    ],
};

// 2. 模拟天气查询工具的核心逻辑
async function getForecast(params) {
    const { city, days = 3 } = params;
    // 验证参数
    if (typeof city !== 'string' || city.trim() === '') {
        throw new Error('错误：城市名称必须为非空字符串！');
    }
    if (!Number.isInteger(days) || days < 1 || days > 7) {
        throw new Error('错误：预报天数必须为1-7之间的整数！');
    }
    // 模拟天气数据（无 API 依赖，可直接运行）
    const mockWeatherData = {
        北京: '晴转多云，气温10~20℃',
        上海: '阴有小雨，气温15~22℃',
        广州: '晴，气温20~30℃',
        深圳: '多云，气温22~28℃',
        成都: '小雨，气温12~18℃',
    };
    const weatherInfo = mockWeatherData[city] || `暂未查询到${city}的天气数据`;
    return `${city}未来${days}天天气：${weatherInfo}`;

    // --------------- 真实 API 调用示例（需安装 axios）---------------
    // import axios from 'axios';
    // const API_KEY = "你的天气 API Key";
    // const response = await axios.get("https://api.weatherapi.com/v1/forecast.json", {
    //   params: { key: API_KEY, q: city, days: days },
    // });
    // const weatherText = response.data.forecast.forecastday[0].day.condition.text;
    // return `${city}未来${days}天天气：${weatherText}`;
}

// 3. 处理 MCP 消息的核心函数
async function handleMcpMessage(message) {
    try {
        const data = JSON.parse(message);
        // 处理「发现请求」：客户端请求服务器的能力列表
        if (data.type === 'discover') {
            return JSON.stringify({
                type: 'discoverResponse',
                name: MCP_SERVER_CONFIG.name,
                description: MCP_SERVER_CONFIG.description,
                tools: MCP_SERVER_CONFIG.tools,
                prompts: [], // 可扩展添加提示词能力
            });
        }
        // 处理「工具调用请求」：客户端调用具体工具
        else if (data.type === 'invoke') {
            const { name, parameters } = data;
            // 匹配天气查询工具
            if (name === 'get_forecast') {
                const result = await getForecast(parameters);
                return JSON.stringify({
                    type: 'invokeResponse',
                    result: { type: 'string', value: result },
                });
            }
            // 未知工具
            else {
                return JSON.stringify({
                    type: 'error',
                    error: { message: `未知工具：${name}` },
                });
            }
        }
        // 未知消息类型
        else {
            return JSON.stringify({
                type: 'error',
                error: { message: `未知消息类型：${data.type}` },
            });
        }
    } catch (error) {
        // 异常处理
        return JSON.stringify({
            type: 'error',
            error: { message: error.message || '服务器处理失败' },
        });
    }
}

// 4. 启动服务器：监听 stdin（客户端输入），向 stdout 输出响应
function startServer() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });

    // 监听客户端发送的每一行 JSON 消息
    rl.on('line', async (line) => {
        if (line.trim() === '') return;
        // 处理消息并返回响应（MCP 要求每个响应单独一行）
        const response = await handleMcpMessage(line);
        process.stdout.write(`${response}\n`);
    });

    // 监听服务器退出
    process.on('SIGINT', () => {
        rl.close();
        process.exit(0);
    });

    console.log('✅ Node.js MCP 天气服务器已启动（stdio 传输）');
}

// 启动服务器
startServer();
```

### 2. 运行服务器

```bash
# 直接运行
node main.js
# 若需后台运行（Mac/Linux），可使用：
# nohup node main.js > mcp-server.log 2>&1 &
```

运行成功后，控制台会输出：`✅ Node.js MCP 天气服务器已启动（stdio 传输）`

---

## 四、客户端配置（Cursor）

### 1. 打开 MCP 设置面板

1.  打开 Cursor 设置面板：
    -   **macOS**：`Cmd + ,`
    -   **Windows/Linux**：`Ctrl + ,`
2.  在设置界面的左侧导航栏中，找到并点击 **Features** -> **MCP**。

### 2. 添加 MCP 服务器

1.  点击页面上的 **Add new MCP server** 按钮。
2.  在弹出的表单中填写服务器信息：
    -   **Name**: `node-weather-server`（自定义名称）
    -   **Type**: 选择 `command` (stdio)
    -   **Command**: `node /absolute/path/to/your/mcp-node-weather/main.js`
        -   _注意：请务必将 `/absolute/path/to/your/...` 替换为你本地 `main.js` 文件的**绝对路径**。_

### 3. 验证与使用

添加完成后，检查服务器状态指示灯是否变绿（表示已连接）。
在 Cursor 的 Composer (`Ctrl/Cmd + I`) 或 Chat (`Ctrl/Cmd + L`) 中，直接输入自然语言指令，例如：

> “查询广州未来 5 天的天气”

Cursor 将自动识别意图并调用该 MCP 工具获取数据。

---

## 五、核心调试与测试

### 1. 手动测试服务器

可以通过直接向服务器发送 JSON 消息来测试：

```bash
# 启动服务器
node main.js

# 在另一个终端，发送发现请求（测试工具列表）
echo '{"type":"discover"}' | node main.js

# 发送工具调用请求（测试天气查询）
echo '{"type":"invoke","name":"get_forecast","parameters":{"city":"广州","days":5}}' | node main.js
```

### 2. 常见问题排查

| 问题现象            | 解决方案                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 服务器启动无响应    | 检查 Node.js 版本（需 v18+），确认 `package.json` 中添加了 `"type": "module"`                                         |
| Cursor 无法调用工具 | 1. 验证配置中的 `command` 路径是否正确（必须是绝对路径）<br>2. 检查服务器是否能正常启动<br>3. 查看 Cursor 的 MCP 日志 |
| 工具调用返回错误    | 查看服务器控制台日志，检查参数是否传递正确（如 city 为字符串）                                                        |
| JSON 解析错误       | 确保客户端发送的消息格式正确，服务器返回的响应也是有效的 JSON                                                         |

### 3. 日志查看

-   **服务器日志**：直接输出到控制台，若后台运行可查看 `mcp-server.log`
-   **Cursor MCP 日志**：在 Cursor 设置中查看 MCP 服务器状态，或查看 Cursor 的日志目录

## 六、下一步实践

1. 替换模拟数据为真实天气 API（如 [天气 API](https://www.weatherapi.com/)），测试端到端调用。
2. 实现一个本地文件读取工具（注意权限控制），体验 MCP 操作本地资源。
3. 添加更多工具，如空气质量查询、历史天气查询等。
4. 实现提示词（Prompts）功能，提供预定义的提示模板。
5. 添加日志记录功能，方便调试和监控工具调用情况。
