/**
 * Buffer Memory - 保存所有对话历史
 *
 * 优点：
 * - 完整保留所有上下文信息
 * - 实现简单，不会丢失信息
 *
 * 缺点：
 * - 随着对话增多，token 消耗增大
 * - 可能超出模型 token 限制
 *
 * 适用场景：
 * - 短期对话（< 10 轮）
 * - 需要完整上下文的任务
 * - 个人助手、简单问答
 */
export class BufferMemory {
    constructor() {
        this.messages = [];
    }

    // 添加用户消息
    addUserMessage(content) {
        this.messages.push({
            role: 'user',
            content: content,
            timestamp: new Date().toISOString(),
        });
    }

    // 添加 AI 回复
    addAIMessage(content) {
        this.messages.push({
            role: 'assistant',
            content: content,
            timestamp: new Date().toISOString(),
        });
    }

    // 获取所有历史记录
    getHistory() {
        return this.messages;
    }

    // 清空记忆
    clear() {
        this.messages = [];
    }

    // 获取统计信息
    getStats() {
        return {
            totalMessages: this.messages.length,
            userMessages: this.messages.filter((m) => m.role === 'user').length,
            aiMessages: this.messages.filter((m) => m.role === 'assistant')
                .length,
            estimatedTokens: this.estimateTokens(),
        };
    }

    // 粗略估计 token 数量（中文约 1 字 = 2 tokens，英文约 1 词 = 1.3 tokens）
    estimateTokens() {
        const totalChars = this.messages.reduce(
            (sum, msg) => sum + msg.content.length,
            0
        );
        return Math.ceil(totalChars * 1.5); // 粗略估计
    }
}
