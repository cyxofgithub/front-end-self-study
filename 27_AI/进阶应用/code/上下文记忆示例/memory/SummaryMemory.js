import { callDifyAPI } from '../utils/apiClient.js';

/**
 * Summary Memory - 对历史对话进行总结压缩
 *
 * 优点：
 * - 保留关键信息，节省 token
 * - 适合超长对话
 *
 * 缺点：
 * - 需要额外的 API 调用生成摘要
 * - 可能丢失细节信息
 *
 * 适用场景：
 * - 超长对话（50+ 轮）
 * - 需要长期记忆的场景
 * - 智能助手、知识管理
 */
export class SummaryMemory {
    constructor(summaryThreshold = 4) {
        this.messages = [];
        this.summary = ''; // 历史对话摘要
        this.summaryThreshold = summaryThreshold; // 达到多少轮对话后触发摘要
    }

    addUserMessage(content) {
        this.messages.push({
            role: 'user',
            content: content,
            timestamp: new Date().toISOString(),
        });
    }

    addAIMessage(content) {
        this.messages.push({
            role: 'assistant',
            content: content,
            timestamp: new Date().toISOString(),
        });

        // 检查是否需要生成摘要
        this._checkAndSummarize();
    }

    // 检查并生成摘要
    async _checkAndSummarize() {
        const rounds = Math.floor(this.messages.length / 2);

        if (rounds >= this.summaryThreshold) {
            console.log(`📝 触发摘要生成（已达到 ${rounds} 轮对话）...`);
            await this.generateSummary();
        }
    }

    // 生成摘要（调用 AI）
    async generateSummary() {
        if (this.messages.length === 0) return;

        const conversationText = this.messages
            .map((m) => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`)
            .join('\n');

        const summaryPrompt = `请对以下对话进行简洁摘要，提取关键信息和重要内容：

${conversationText}

请用 2-3 句话概括上述对话的核心内容：`;

        try {
            const newSummary = await callDifyAPI(summaryPrompt, []);
            console.log(
                '🚀 ~ SummaryMemory ~ generateSummary ~ newSummary:',
                newSummary
            );

            // 如果已有旧摘要，合并
            if (this.summary) {
                this.summary = `${this.summary}\n\n新摘要：${newSummary}`;
            } else {
                this.summary = newSummary;
            }

            console.log('✅ 摘要生成完成');

            // 清空已摘要的消息，只保留最后 2 轮
            this.messages = this.messages.slice(-4);
        } catch (error) {
            console.error('❌ 摘要生成失败:', error.message);
        }
    }

    // 获取历史（包括摘要）
    getHistory() {
        const history = [];

        if (this.summary) {
            history.push({
                role: 'system',
                content: `历史对话摘要：${this.summary}`,
            });
        }

        history.push(...this.messages);
        return history;
    }

    clear() {
        this.messages = [];
        this.summary = '';
    }

    getStats() {
        return {
            activeMessages: this.messages.length,
            hasSummary: !!this.summary,
            summaryLength: this.summary.length,
            estimatedTokens: this._estimateTokens(),
        };
    }

    _estimateTokens() {
        const messagesChars = this.messages.reduce(
            (sum, msg) => sum + msg.content.length,
            0
        );
        const summaryChars = this.summary.length;
        return Math.ceil((messagesChars + summaryChars) * 1.5);
    }
}
