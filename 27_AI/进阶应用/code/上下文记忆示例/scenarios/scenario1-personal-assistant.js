import dotenv from 'dotenv';
dotenv.config();

import { BufferMemory } from '../memory/BufferMemory.js';
import { callDifyAPI } from '../utils/apiClient.js';

/**
 * 场景 1: 个人助手（使用 Buffer Memory）
 *
 * 演示如何使用 Buffer Memory 保存完整的对话历史
 * 适合短期对话，需要完整上下文的场景
 */
export async function scenario1_PersonalAssistant() {
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
