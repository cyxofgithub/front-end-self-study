import dotenv from 'dotenv';
dotenv.config();

/**
 * 上下文记忆与对话历史管理示例
 *
 * 核心概念：
 * 1. Memory（对话记忆）- LangChain.js 核心概念之一
 * 2. 三种常用记忆类型：Buffer Memory、Window Memory、Summary Memory
 * 3. 如何在实际应用中管理对话历史
 *
 * 学习目标：
 * - 理解不同记忆策略的适用场景
 * - 掌握如何将记忆集成到 Chains 中
 * - 学习如何在 Prompts 中使用历史对话
 */

// ============ Dify API 配置 ============
const DIFY_CONFIG = {
    apiKey: process.env.DIFY_API_KEY,
    baseURL: process.env.DIFY_BASE_URL,
    endpoint: process.env.DIFY_ENDPOINT,
};

// ============ 通用 API 调用函数 ============
async function callDifyAPI(prompt, conversationHistory = []) {
    // 将历史对话整合到提示词中
    let fullPrompt = '';

    if (conversationHistory.length > 0) {
        fullPrompt += '对话历史：\n';
        conversationHistory.forEach((msg, index) => {
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

// ============================================
// 记忆类型 1: Buffer Memory（缓冲记忆）
// ============================================
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
class BufferMemory {
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

// ============================================
// 记忆类型 2: Window Memory（窗口记忆）
// ============================================
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
class WindowMemory {
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

// ============================================
// 记忆类型 3: Summary Memory（摘要记忆）
// ============================================
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
class SummaryMemory {
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

// ============================================
// 场景 1: 个人助手（使用 Buffer Memory）
// ============================================
async function scenario1_PersonalAssistant() {
    console.log('\n' + '='.repeat(70));
    console.log('📱 场景 1: 个人助手（Buffer Memory）');
    console.log('='.repeat(70));
    console.log('适用场景：短期对话，需要完整上下文');
    console.log('记忆策略：保存所有对话历史\n');

    const memory = new BufferMemory();

    // 模拟多轮对话
    const conversations = [
        '我叫张三，今年 25 岁',
        '我是一名前端开发工程师',
        '我正在学习 AI 相关的技术',
        '你还记得我的名字和职业吗？',
        '我想了解 LangChain 的 Memory 概念',
    ];

    for (let i = 0; i < conversations.length; i++) {
        const userInput = conversations[i];

        console.log(`\n📤 用户 (第 ${i + 1} 轮): ${userInput}`);

        // 添加用户消息到记忆
        memory.addUserMessage(userInput);

        // 调用 API（传入历史记录）
        const response = await callDifyAPI(userInput, memory.getHistory());

        // 添加 AI 回复到记忆
        memory.addAIMessage(response);

        console.log(`📥 AI: ${response}`);

        // 显示记忆统计
        const stats = memory.getStats();
        console.log(
            `📊 记忆状态: ${stats.totalMessages} 条消息, 约 ${stats.estimatedTokens} tokens`
        );

        // 模拟间隔
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('\n✅ 场景 1 演示完成！');
    console.log(
        '💡 观察：AI 能够记住之前对话中的所有信息（姓名、年龄、职业等）'
    );
}

// ============================================
// 场景 2: 客服机器人（使用 Window Memory）
// ============================================
async function scenario2_CustomerService() {
    console.log('\n' + '='.repeat(70));
    console.log('🤖 场景 2: 客服机器人（Window Memory）');
    console.log('='.repeat(70));
    console.log('适用场景：长时间交互，只需要近期上下文');
    console.log('记忆策略：只保留最近 3 轮对话\n');

    const memory = new WindowMemory(3); // 只保留 3 轮

    const conversations = [
        '你好，我想咨询一下产品价格',
        '基础版多少钱？',
        '专业版呢？',
        '两者有什么区别？',
        '支持哪些支付方式？',
        '可以开发票吗？',
        '你还记得我一开始问的基础版价格吗？', // 这个信息已经超出窗口
    ];

    for (let i = 0; i < conversations.length; i++) {
        const userInput = conversations[i];

        console.log(`\n📤 用户 (第 ${i + 1} 轮): ${userInput}`);

        memory.addUserMessage(userInput);

        const response = await callDifyAPI(userInput, memory.getHistory());

        memory.addAIMessage(response);

        console.log(`📥 AI: ${response}`);

        const stats = memory.getStats();
        console.log(
            `📊 记忆状态: 活跃 ${stats.activeMessages} 条 | 存档 ${stats.archivedMessages} 条 | 约 ${stats.estimatedTokens} tokens`
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('\n✅ 场景 2 演示完成！');
    console.log(
        '💡 观察：AI 只能记住最近 3 轮对话，早期的信息（基础版价格）已被遗忘'
    );
}

// ============================================
// 场景 3: 长对话助手（使用 Summary Memory）
// ============================================
async function scenario3_LongConversationAssistant() {
    console.log('\n' + '='.repeat(70));
    console.log('🧠 场景 3: 长对话智能助手（Summary Memory）');
    console.log('='.repeat(70));
    console.log('适用场景：超长对话，需要长期记忆');
    console.log('记忆策略：定期生成摘要，压缩历史\n');

    const memory = new SummaryMemory(2); // 每 2 轮就生成摘要

    const conversations = [
        '我正在开发一个电商网站',
        '需要实现购物车功能',
        '用户登录后可以添加商品到购物车',
        '购物车数据应该存储在哪里？',
        '我还需要实现订单管理功能',
        '订单需要支持多种状态',
        '你能总结一下我们讨论的项目需求吗？', // 测试摘要功能
    ];

    for (let i = 0; i < conversations.length; i++) {
        const userInput = conversations[i];

        console.log(`\n📤 用户 (第 ${i + 1} 轮): ${userInput}`);

        memory.addUserMessage(userInput);

        const response = await callDifyAPI(userInput, memory.getHistory());

        await memory.addAIMessage(response); // 注意这里是 await，因为可能触发摘要生成

        console.log(`📥 AI: ${response}`);

        const stats = memory.getStats();
        console.log(
            `📊 记忆状态: 活跃 ${stats.activeMessages} 条 | 摘要: ${
                stats.hasSummary ? '有' : '无'
            } | 约 ${stats.estimatedTokens} tokens`
        );

        if (stats.hasSummary) {
            console.log(`📝 当前摘要长度: ${stats.summaryLength} 字符`);
        }

        await new Promise((resolve) => setTimeout(resolve, 1500)); // 稍长间隔，因为可能需要生成摘要
    }

    console.log('\n✅ 场景 3 演示完成！');
    console.log(
        '💡 观察：AI 通过摘要保留了早期对话的核心信息，同时控制了 token 消耗'
    );
}

// ============================================
// 记忆策略对比
// ============================================
function compareMemoryStrategies() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 三种记忆策略对比');
    console.log('='.repeat(70));

    const comparison = `
┌──────────────┬────────────────┬────────────────┬────────────────┐
│ 特性         │ Buffer Memory  │ Window Memory  │ Summary Memory │
├──────────────┼────────────────┼────────────────┼────────────────┤
│ 信息完整性   │ ⭐⭐⭐⭐⭐      │ ⭐⭐⭐          │ ⭐⭐⭐⭐        │
│ Token 效率   │ ⭐⭐            │ ⭐⭐⭐⭐        │ ⭐⭐⭐⭐⭐      │
│ 实现复杂度   │ ⭐              │ ⭐⭐            │ ⭐⭐⭐⭐        │
│ 适用对话轮数 │ < 10 轮        │ 10-50 轮       │ 50+ 轮         │
│ API 调用次数 │ 低             │ 低             │ 高（需生成摘要）│
└──────────────┴────────────────┴────────────────┴────────────────┘

使用建议：

🔹 Buffer Memory (缓冲记忆)
   ✓ 简单的问答系统
   ✓ 短期咨询服务
   ✓ 快速原型开发
   ✗ 不适合长时间交互

🔹 Window Memory (窗口记忆)
   ✓ 客服机器人
   ✓ 任务助手
   ✓ 对话式界面
   ✗ 不适合需要长期记忆的场景

🔹 Summary Memory (摘要记忆)
   ✓ 长期知识管理
   ✓ 复杂任务规划
   ✓ 学习助手
   ✗ 需要额外的 API 成本

💡 实际应用中可以组合使用：
   - 近期用 Window Memory
   - 远期用 Summary Memory
   - 关键信息用独立存储（数据库）
`;

    console.log(comparison);
}

// ============================================
// 主函数
// ============================================
async function main() {
    console.log('🚀 上下文记忆与对话历史管理 - 完整示例');
    console.log('基于 LangChain.js Memory 概念\n');

    try {
        // 显示对比表
        // compareMemoryStrategies();

        // 场景 1: 个人助手（Buffer Memory）
        await scenario1_PersonalAssistant();

        // 场景 2: 客服机器人（Window Memory）
        await scenario2_CustomerService();

        // 场景 3: 长对话助手（Summary Memory）
        await scenario3_LongConversationAssistant();

        console.log('\n' + '='.repeat(70));
        console.log('🎉 所有场景演示完成！');
        console.log('='.repeat(70));
        console.log('\n核心学习要点总结：\n');
        console.log('1️⃣  Memory (记忆) 是 LangChain.js 的核心概念之一');
        console.log('2️⃣  不同记忆策略适用于不同场景，需要根据实际需求选择');
        console.log('3️⃣  记忆管理直接影响 token 消耗和成本');
        console.log('4️⃣  在 Chains (链式调用) 中，Memory 负责维护上下文');
        console.log('5️⃣  在 Prompts (提示词) 中，需要合理整合历史对话');
        console.log('\n💡 下一步学习建议：');
        console.log('   - 了解 Agents（智能代理）如何使用 Memory');
        console.log('   - 学习如何将 Memory 持久化到数据库');
        console.log(
            '   - 探索更多高级记忆策略（如 Entity Memory、Knowledge Graph Memory）'
        );
    } catch (error) {
        console.error('❌ 执行出错:', error.message);
        console.error('请检查：');
        console.error('  1. .env 文件中的 Dify API 配置是否正确');
        console.error('  2. API Key 是否有效');
        console.error('  3. 网络连接是否正常');
    }
}

// ============================================
// 运行主函数
// ============================================
main().catch(console.error);

// ============================================
// 使用说明
// ============================================
/**
 * 📖 使用方法：
 *
 * 1. 确保已安装依赖：
 *    npm install dotenv groq-sdk
 *
 * 2. 配置 .env 文件：
 *    DIFY_API_KEY=your_api_key
 *    DIFY_BASE_URL=https://api.dify.ai/v1
 *    DIFY_ENDPOINT=/workflows/run
 *    DIFY_USER=demo-user
 *
 * 3. 运行示例：
 *    node 实现上下文记忆与对话历史管理.js
 *
 * 🎯 学习目标：
 * - 理解 Memory 在 AI 应用中的重要性
 * - 掌握三种常用记忆策略的实现
 * - 学会根据场景选择合适的记忆类型
 * - 了解如何优化 token 消耗
 *
 * 🔗 相关概念：
 * - Chains（链式调用）：Memory 是 Chain 的一部分
 * - Prompts（提示词模板）：需要整合历史对话
 * - Agents（智能代理）：使用 Memory 维护状态
 *
 * 📚 扩展阅读：
 * - LangChain Memory 文档: https://js.langchain.com/docs/modules/memory/
 * - Token 优化最佳实践
 * - 对话系统设计模式
 */
