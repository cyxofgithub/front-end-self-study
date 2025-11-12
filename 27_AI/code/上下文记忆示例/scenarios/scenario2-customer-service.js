import dotenv from 'dotenv';
dotenv.config();

import { WindowMemory } from '../memory/WindowMemory.js';
import { callDifyAPI } from '../utils/apiClient.js';

/**
 * 场景 2: 客服机器人（使用 Window Memory）
 *
 * 演示如何使用 Window Memory 只保留最近的对话
 * 适合长时间交互，只需要近期上下文的场景
 */
export async function scenario2_CustomerService() {
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
