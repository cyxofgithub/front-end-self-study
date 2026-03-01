/**
 * Window Memory - 只保留最近 N 轮对话
 *
 * 优点：
 * - 控制 token 消耗
 * - 避免超出 token 限制
 *
 * 缺点：
 * - 会丢失较早的对话信息
 * - 需要合理设置窗口大小
 *
 * 适用场景：
 * - 中长期对话（10-50 轮）
 * - 只需要近期上下文
 * - 客服机器人、任务助手
 */
export class WindowMemory {
    constructor(windowSize = 5) {
        this.messages = [];
        this.windowSize = windowSize; // 保留最近 N 轮对话（一轮 = 1 个用户消息 + 1 个 AI 回复）
        this.archivedMessages = []; // 存档的历史消息
    }

    addUserMessage(content) {
        this.messages.push({
            role: 'user',
            content: content,
            timestamp: new Date().toISOString(),
        });
        this._maintainWindow();
    }

    addAIMessage(content) {
        this.messages.push({
            role: 'assistant',
            content: content,
            timestamp: new Date().toISOString(),
        });
        this._maintainWindow();
    }

    // 维护窗口大小
    _maintainWindow() {
        // 计算对话轮数（user + assistant = 1 轮）
        const maxMessages = this.windowSize * 2;

        if (this.messages.length > maxMessages) {
            // 将超出的消息移到存档
            const removed = this.messages.splice(
                0,
                this.messages.length - maxMessages
            );
            this.archivedMessages.push(...removed);
        }
    }

    // 获取当前窗口内的历史
    getHistory() {
        return this.messages;
    }

    // 获取所有历史（包括存档）
    getAllHistory() {
        return [...this.archivedMessages, ...this.messages];
    }

    clear() {
        this.messages = [];
        this.archivedMessages = [];
    }

    getStats() {
        return {
            activeMessages: this.messages.length,
            archivedMessages: this.archivedMessages.length,
            totalMessages: this.messages.length + this.archivedMessages.length,
            windowSize: this.windowSize,
            estimatedTokens: this._estimateTokens(this.messages),
        };
    }

    _estimateTokens(messages) {
        const totalChars = messages.reduce(
            (sum, msg) => sum + msg.content.length,
            0
        );
        return Math.ceil(totalChars * 1.5);
    }
}

