import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// Dify API 配置
const DIFY_CONFIG = {
    apiKey: process.env.DIFY_API_KEY,
    baseURL: process.env.DIFY_BASE_URL,
    endpoint: process.env.DIFY_ENDPOINT,
    user: process.env.DIFY_USER || 'default-user',
};

// 验证配置
if (!DIFY_CONFIG.apiKey || !DIFY_CONFIG.baseURL || !DIFY_CONFIG.endpoint) {
    console.error('❌ 错误: 缺少必要的环境变量配置');
    console.error('请确保设置了以下环境变量:');
    console.error('  - DIFY_API_KEY');
    console.error('  - DIFY_BASE_URL');
    console.error('  - DIFY_ENDPOINT');
    console.error('  - DIFY_USER (可选)');
    process.exit(1);
}

// SSE 流式聊天端点
app.post('/api/chat/stream', async (req, res) => {
    const { message, conversation_id, user } = req.body;

    if (!message) {
        return res.status(400).json({ error: '缺少 message 参数' });
    }

    try {
        // 构建提示词，要求返回 markdown 格式
        const markdownPrompt = `请使用 Markdown 格式返回你的回答。对于代码块，请使用 \`\`\`语言名称 的格式。对于列表、标题、加粗等，请使用相应的 Markdown 语法。

用户问题：${message}`;

        // 构建 Dify API 请求
        const requestBody = {
            inputs: {
                query: markdownPrompt,
            },
            query: markdownPrompt,
            response_mode: 'streaming',
            user: user || DIFY_CONFIG.user,
            conversation_id: conversation_id || undefined,
        };
        console.log('🚀 ~ requestBody:', requestBody);

        // 调用 Dify API
        const difyResponse = await fetch(
            `${DIFY_CONFIG.baseURL}${DIFY_CONFIG.endpoint}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${DIFY_CONFIG.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            }
        );

        if (!difyResponse.ok) {
            const errorText = await difyResponse.text();
            console.error('❌ Dify API 错误:', difyResponse.status, errorText);
            return res.status(difyResponse.status).json({
                error: 'Dify API 调用失败',
                details: errorText,
            });
        }

        // 设置 SSE 响应头
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // 禁用 Nginx 缓冲

        // 将 Dify 的 SSE 流转发给客户端
        const reader = difyResponse.body.getReader();
        const decoder = new TextDecoder();

        // 处理客户端断开连接
        req.on('close', () => {
            console.log('客户端断开连接，清理资源...');
            reader.cancel().catch(() => {
                // 忽略取消错误
            });
        });

        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    // 发送结束事件
                    res.write('event: end\n');
                    res.write('data: {"done": true}\n\n');
                    res.end();
                    break;
                }

                // 解码数据块
                const chunk = decoder.decode(value, { stream: true });

                // 检查响应是否已关闭
                if (res.closed || res.destroyed) {
                    console.log('响应已关闭，停止转发');
                    reader.cancel().catch(() => {});
                    break;
                }

                // 直接转发数据块（Dify 已经格式化为 SSE 格式）
                res.write(chunk);
            }
        } catch (streamError) {
            // 检查是否是客户端断开连接导致的错误
            if (!res.closed && !res.destroyed) {
                console.error('❌ 流处理错误:', streamError);
                res.write(`event: error\n`);
                res.write(
                    `data: ${JSON.stringify({
                        error: streamError.message,
                    })}\n\n`
                );
                res.end();
            }
        }
    } catch (error) {
        console.error('❌ 服务器错误:', error);
        res.status(500).json({
            error: '服务器内部错误',
            details: error.message,
        });
    }
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📡 Dify API: ${DIFY_CONFIG.baseURL}${DIFY_CONFIG.endpoint}`);
});
