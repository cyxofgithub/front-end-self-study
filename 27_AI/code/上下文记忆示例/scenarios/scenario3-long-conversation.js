import dotenv from 'dotenv';
dotenv.config();

import { SummaryMemory } from '../memory/SummaryMemory.js';
import { callDifyAPI } from '../utils/apiClient.js';

/**
 * 场景 3: 长对话智能助手（使用 Summary Memory）
 *
 * 演示如何使用 Summary Memory 自动生成摘要
 * 适合超长对话，需要长期记忆的场景
 */
export async function scenario3_LongConversationAssistant() {
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
