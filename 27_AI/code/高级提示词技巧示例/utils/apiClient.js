import dotenv from 'dotenv';
dotenv.config();

/**
 * Dify API 客户端
 * 提供统一的 API 调用接口，用于高级提示词技巧示例
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
 * @param {Object} options - 可选配置
 * @param {string} options.user - 用户标识
 * @param {string} options.responseMode - 响应模式 ('blocking' | 'streaming')
 * @returns {Promise<string>} AI 响应内容
 */
export async function callDifyAPI(prompt, options = {}) {
    const {
        user = process.env.DIFY_USER || 'demo-user',
        responseMode = 'blocking',
    } = options;

    const requestBody = {
        inputs: {
            query: prompt,
        },
        response_mode: responseMode,
        user: user,
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
        throw new Error(
            `Dify API 调用失败: ${response.status} ${response.statusText}\n详情: ${errorText}`
        );
    }

    const data = await response.json();
    return data.answer || data.text || '无响应';
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
