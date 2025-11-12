import dotenv from 'dotenv';
dotenv.config();

/**
 * Dify API 客户端
 * 提供统一的 API 调用接口
 */

// Dify API 配置
const DIFY_CONFIG = {
    apiKey: process.env.DIFY_API_KEY,
    baseURL: process.env.DIFY_BASE_URL,
    endpoint: process.env.DIFY_ENDPOINT,
};
console.log('🚀 ~ DIFY_CONFIG:', DIFY_CONFIG);

/**
 * 调用 Dify API
 * @param {string} prompt - 用户提示词
 * @param {Array} conversationHistory - 对话历史记录
 * @returns {Promise<string>} AI 响应内容
 */
export async function callDifyAPI(prompt, conversationHistory = []) {
    // 将历史对话整合到提示词中
    let fullPrompt = '';

    if (conversationHistory.length > 0) {
        fullPrompt += '对话历史：\n';
        conversationHistory.forEach((msg) => {
            fullPrompt += `${msg.role === 'user' ? '用户' : 'AI'}: ${
                msg.content
            }\n`;
        });
        fullPrompt += '\n';
    }

    fullPrompt += `当前问题：${prompt}`;

    const requestBody = {
        inputs: {
            query: fullPrompt,
        },
        response_mode: 'blocking',
        user: process.env.DIFY_USER || 'demo-user',
    };

    const response = await fetch(
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

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 调用失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.answer || data.text || '无响应';
}
