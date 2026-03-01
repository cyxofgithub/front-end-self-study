/**
 * 遵循 MCP 协议的 Node.js 服务器（stdio 传输）
 * 功能：提供天气查询工具 get_forecast
 */
const { createInterface } = require('readline');

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
    prompts: [
        {
            name: 'weather_query',
            description: '快速查询指定城市的天气预报',
            arguments: [
                {
                    name: 'city',
                    description: '要查询的城市名称',
                    required: true,
                },
                {
                    name: 'days',
                    description: '预报天数（1-7天），默认为3天',
                    required: false,
                },
            ],
        },
        {
            name: 'weather_analysis',
            description: '分析天气数据并给出详细解读',
            arguments: [
                {
                    name: 'city',
                    description: '要分析的城市名称',
                    required: true,
                },
                {
                    name: 'days',
                    description: '分析的天数（1-7天），默认为3天',
                    required: false,
                },
            ],
        },
        {
            name: 'travel_suggestion',
            description: '根据天气情况给出出行建议',
            arguments: [
                {
                    name: 'city',
                    description: '目的地城市名称',
                    required: true,
                },
                {
                    name: 'days',
                    description: '出行天数（1-7天），默认为3天',
                    required: false,
                },
            ],
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
}

// 2.5. 生成提示词内容的核心函数
function getPromptContent(promptName, promptArgs = {}) {
    const { city, days = 3 } = promptArgs;

    switch (promptName) {
        case 'weather_query':
            return `请帮我查询${
                city || '[城市名称]'
            }未来${days}天的天气预报。如果城市名称未提供，请先询问用户要查询哪个城市。`;

        case 'weather_analysis':
            return `请帮我分析${
                city || '[城市名称]'
            }未来${days}天的天气情况，包括：
1. 天气趋势分析
2. 温度变化特点
3. 降水概率评估
4. 适合的穿衣建议
5. 特殊天气提醒

如果城市名称未提供，请先询问用户要分析哪个城市。`;

        case 'travel_suggestion':
            return `我计划前往${
                city || '[城市名称]'
            }旅行${days}天，请根据当地的天气预报给我以下建议：
1. 最佳出行时间
2. 需要携带的衣物和物品
3. 户外活动建议
4. 天气相关的注意事项
5. 备选方案（如遇恶劣天气）

建议的顺序要保持一致

如果城市名称未提供，请先询问用户的目的地城市。`;

        default:
            throw new Error(`未知的提示词：${promptName}`);
    }
}

// 3. 创建 JSON-RPC 2.0 响应
function createResponse(id, result, error = null) {
    // JSON-RPC 2.0 规范：响应必须包含 id（如果请求有 id）
    // id 可以是 string、number 或 null（对于格式错误的请求）
    // 如果 id 为 undefined，不应该调用此函数（通知请求）
    const response = {
        jsonrpc: '2.0',
        id: id, // 必须包含 id（即使是 null）
    };

    if (error) {
        response.error = {
            code: error.code || -32000,
            message: error.message || 'Unknown error',
        };
    } else {
        response.result = result;
    }
    return JSON.stringify(response);
}

// 4. 处理 MCP 消息的核心函数（JSON-RPC 2.0 格式）
async function handleMcpMessage(message) {
    let requestId = null;
    try {
        const request = JSON.parse(message);

        // 提取 id
        // id 可以是 string、number、null（有效请求）或 undefined（通知请求）
        requestId = request.id;

        // 验证 JSON-RPC 2.0 格式
        if (request.jsonrpc !== '2.0') {
            // 格式错误的请求
            // 如果 id 存在（包括 null），返回错误响应；否则不响应（通知请求）
            if (requestId !== undefined) {
                return createResponse(requestId, null, {
                    code: -32600,
                    message: 'Invalid Request: jsonrpc must be "2.0"',
                });
            }
            // 通知请求且格式错误，不发送响应
            return null;
        }

        const { method, params, id } = request;

        // 检查是否是通知请求（id 字段不存在）
        const isNotification = id === undefined;

        // 验证必需字段
        if (!method) {
            if (!isNotification) {
                return createResponse(id, null, {
                    code: -32600,
                    message: 'Invalid Request: method is required',
                });
            }
            return null; // 通知请求，不发送响应
        }

        // 处理 initialize 方法
        if (method === 'initialize') {
            if (isNotification) {
                return null; // 通知请求，不发送响应
            }
            return createResponse(id, {
                protocolVersion: '2024-11-05',
                capabilities: {
                    tools: {},
                    prompts: {},
                },
                serverInfo: {
                    name: MCP_SERVER_CONFIG.name,
                    version: '1.0.0',
                },
            });
        }

        // 处理 tools/list 方法
        if (method === 'tools/list') {
            if (isNotification) {
                return null; // 通知请求，不发送响应
            }
            return createResponse(id, {
                tools: MCP_SERVER_CONFIG.tools.map((tool) => ({
                    name: tool.name,
                    description: tool.description,
                    inputSchema: tool.parameters,
                })),
            });
        }

        // 处理 tools/call 方法
        if (method === 'tools/call') {
            if (isNotification) {
                return null; // 通知请求，不发送响应
            }
            const { name, arguments: toolArgs } = params || {};

            if (name === 'get_forecast') {
                try {
                    const result = await getForecast(toolArgs || {});
                    return createResponse(id, {
                        content: [
                            {
                                type: 'text',
                                text: result,
                            },
                        ],
                    });
                } catch (error) {
                    return createResponse(id, null, {
                        code: -32000,
                        message: error.message || '工具调用失败',
                    });
                }
            } else {
                return createResponse(id, null, {
                    code: -32601,
                    message: `未知工具：${name}`,
                });
            }
        }

        // 处理 prompts/list 方法
        if (method === 'prompts/list') {
            if (isNotification) {
                return null; // 通知请求，不发送响应
            }
            return createResponse(id, {
                prompts: MCP_SERVER_CONFIG.prompts.map((prompt) => ({
                    name: prompt.name,
                    description: prompt.description,
                    arguments: prompt.arguments,
                })),
            });
        }

        // 处理 prompts/get 方法
        if (method === 'prompts/get') {
            if (isNotification) {
                return null; // 通知请求，不发送响应
            }
            const { name, arguments: promptArgs = {} } = params || {};

            const prompt = MCP_SERVER_CONFIG.prompts.find(
                (p) => p.name === name
            );

            if (!prompt) {
                return createResponse(id, null, {
                    code: -32601,
                    message: `未知提示词：${name}`,
                });
            }

            // 验证必需参数
            for (const arg of prompt.arguments) {
                if (arg.required && !promptArgs[arg.name]) {
                    return createResponse(id, null, {
                        code: -32602,
                        message: `缺少必需参数：${arg.name}`,
                    });
                }
            }

            try {
                const content = getPromptContent(name, promptArgs);
                return createResponse(id, {
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: content,
                            },
                        },
                    ],
                });
            } catch (error) {
                return createResponse(id, null, {
                    code: -32000,
                    message: error.message || '生成提示词失败',
                });
            }
        }

        // 处理 ping 方法（可选，用于健康检查）
        if (method === 'ping') {
            if (isNotification) {
                return null; // 通知请求，不发送响应
            }
            return createResponse(id, {});
        }

        // 未知方法
        if (isNotification) {
            return null; // 通知请求，不发送响应
        }
        return createResponse(id, null, {
            code: -32601,
            message: `未知方法：${method}`,
        });
    } catch (error) {
        // JSON 解析错误或其他异常
        // 如果请求有 id，返回错误响应；否则不响应
        if (requestId !== undefined) {
            return createResponse(requestId, null, {
                code: -32700,
                message: `Parse error: ${error.message}`,
            });
        }
        return null; // 通知请求，不发送响应
    }
}

// 5. 启动服务器：监听 stdin（客户端输入），向 stdout 输出响应
function startServer() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });

    // 监听客户端发送的每一行 JSON 消息
    rl.on('line', async (line) => {
        if (line.trim() === '') return;
        try {
            // 处理消息并返回响应（MCP 要求每个响应单独一行）
            const response = await handleMcpMessage(line);
            // 如果返回 null，表示这是通知请求，不需要发送响应
            if (response !== null) {
                process.stdout.write(`${response}\n`);
            }
        } catch (error) {
            // 如果处理过程中出错，尝试发送错误响应
            // 但我们需要知道请求的 id，这里我们无法获取，所以不发送响应
            // 或者发送一个格式错误的响应（不推荐）
            // 最好的做法是记录错误到 stderr
            console.error(`MCP Server Error: ${error.message}`);
        }
    });

    // 监听服务器退出
    process.on('SIGINT', () => {
        rl.close();
        process.exit(0);
    });

    // 注意：MCP 协议要求 stdout 只能包含 JSON-RPC 2.0 格式的消息
    // 因此不能输出任何日志到 stdout，如果需要调试日志，请使用 stderr
    // 例如：console.error('MCP 服务器已启动');
}

// 启动服务器
startServer();
