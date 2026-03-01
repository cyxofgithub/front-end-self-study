import dotenv from 'dotenv';
dotenv.config();

/**
 * Dify API 客户端（共享模块）
 * 提供统一的 API 调用接口，供所有示例使用
 */

// Dify API 配置
const DIFY_CONFIG = {
    apiKey: process.env.DIFY_API_KEY,
    baseURL: process.env.DIFY_BASE_URL,
    endpoint: process.env.DIFY_ENDPOINT,
};

/**
 * 调用 Dify API
 * @param {string} prompt - 用户提示词
 * @param {Object|Array} optionsOrHistory - 选项对象或对话历史数组（向后兼容）
 * @param {Array} conversationHistory - 对话历史记录（可选，用于向后兼容）
 * @returns {Promise<string>} AI 响应内容
 */
export async function callDifyAPI(
    prompt,
    optionsOrHistory = {},
    conversationHistory = null
) {
    // 处理不同的调用方式（向后兼容）
    let options = {};
    let history = [];

    if (Array.isArray(optionsOrHistory)) {
        // 旧式调用：callDifyAPI(prompt, conversationHistory)
        history = optionsOrHistory;
    } else if (typeof optionsOrHistory === 'object') {
        // 新式调用：callDifyAPI(prompt, options)
        options = optionsOrHistory;
        if (options.conversationHistory) {
            history = options.conversationHistory;
        }
    }

    // 如果提供了独立的 conversationHistory 参数，优先使用
    if (conversationHistory) {
        history = conversationHistory;
    }

    // 合并配置
    const {
        user = process.env.DIFY_USER || 'demo-user',
        responseMode = 'blocking',
        includeHistory = true,
    } = options;

    // 构建完整提示词
    let fullPrompt = '';

    // 如果启用历史记录且存在历史，则添加到提示词中
    if (includeHistory && history.length > 0) {
        fullPrompt += '对话历史：\n';
        history.forEach((msg) => {
            const role =
                msg.role || (msg.type === 'user' ? 'user' : 'assistant');
            const content = msg.content || msg.message || msg.text;
            fullPrompt += `${role === 'user' ? '用户' : 'AI'}: ${content}\n`;
        });
        fullPrompt += '\n';
    }

    fullPrompt += `当前问题：${prompt}`;

    const requestBody = {
        inputs: {
            query: fullPrompt,
        },
        response_mode: responseMode,
        user: user,
    };

    try {
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
            throw new Error(
                `Dify API 调用失败: ${response.status} ${response.statusText}\n详情: ${errorText}`
            );
        }

        const data = await response.json();
        return data.answer || data.text || '无响应';
    } catch (error) {
        console.error('API 调用错误:', error);
        throw error;
    }
}

/**
 * 提取 JSON 内容（处理模型可能添加的额外文本）
 * @param {string} text - 包含 JSON 的文本
 * @returns {Object} 解析后的 JSON 对象
 */
export function extractJSON(text) {
    try {
        // 尝试直接解析
        return JSON.parse(text);
    } catch (e) {
        // 如果失败，尝试提取 JSON 部分
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('无法从响应中提取 JSON 格式');
        }
    }
}

/**
 * 获取 Dify API 配置
 * @returns {Object} API 配置对象
 */
export function getDifyConfig() {
    return { ...DIFY_CONFIG };
}
