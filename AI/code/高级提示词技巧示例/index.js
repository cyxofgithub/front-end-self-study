import dotenv from 'dotenv';
dotenv.config();

import {
    runAllExamples as runFewShotExamples,
    showBestPractices as showFewShotPractices,
} from './examples/01-few-shot-learning.js';
import {
    runAllExamples as runCoTExamples,
    showBestPractices as showCoTPractices,
} from './examples/02-chain-of-thought.js';
import {
    runAllExamples as runReActExamples,
    showBestPractices as showReActPractices,
    showComparison as showReActComparison,
} from './examples/03-react-pattern.js';
import {
    runAllExamples as runStructuredExamples,
    showBestPractices as showStructuredPractices,
} from './examples/04-structured-output.js';

/**
 * 高级提示词技巧示例 - 主入口文件
 *
 * 本示例展示了四种高级提示词技巧：
 * 1. Few-shot Learning（少样本学习）
 * 2. Chain of Thought (CoT)（思维链）
 * 3. ReAct 模式（推理+行动）
 * 4. 结构化输出
 *
 * 核心学习目标：
 * - 理解不同提示词技巧的原理和应用场景
 * - 掌握如何编写高效的提示词
 * - 学会根据任务选择合适的技巧
 * - 了解各种技巧的最佳实践
 */

/**
 * 技巧对比表
 */
function showTechniquesComparison() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 高级提示词技巧对比');
    console.log('='.repeat(70));

    const comparison = `
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│ 特性             │ Few-shot Learning│ Chain of Thought │ ReAct            │
├──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ 核心原理         │ 示例引导         │ 逐步推理         │ 推理+行动循环     │
│ 适用任务         │ 格式转换         │ 复杂推理         │ 需要工具的任务   │
│                  │ 文本分类         │ 数学问题         │ 动态决策         │
│                  │ 代码生成         │ 逻辑推理         │ Agent 应用       │
│ 实现难度         │ ⭐              │ ⭐⭐             │ ⭐⭐⭐           │
│ Token 消耗       │ 中等             │ 中等             │ 较高             │
│ 输出可解释性     │ 低               │ 高               │ 高               │
│ 工具调用支持     │ 否               │ 否               │ 是               │
│ 最佳示例数量     │ 2-5 个           │ 0-2 个           │ 0-1 个           │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘

┌──────────────────┬──────────────────┐
│ 特性             │ 结构化输出       │
├──────────────────┼──────────────────┤
│ 核心原理         │ 指定输出格式     │
│ 适用任务         │ API 响应生成     │
│                  │ 数据提取         │
│                  │ 报告生成         │
│ 实现难度         │ ⭐⭐             │
│ Token 消耗       │ 低-中等          │
│ 输出可解释性     │ 中               │
│ 工具调用支持     │ 否               │
│ 格式选择         │ JSON/XML/表格    │
└──────────────────┴──────────────────┘

选择建议：
🔹 需要学习特定模式 → Few-shot Learning
🔹 需要展示推理过程 → Chain of Thought
🔹 需要调用工具/动态决策 → ReAct
🔹 需要固定格式输出 → 结构化输出
🔹 可以组合使用多种技巧
`;

    console.log(comparison);
}

/**
 * 使用场景指南
 */
function showUsageGuide() {
    console.log('\n' + '='.repeat(70));
    console.log('📖 使用场景指南');
    console.log('='.repeat(70));

    const guide = `
场景 1: 文本分类任务
  → 使用 Few-shot Learning
  → 提供 3-5 个分类示例
  → 让模型学习分类模式

场景 2: 数学问题求解
  → 使用 Chain of Thought
  → 要求展示计算步骤
  → 提高准确性

场景 3: 代码生成任务
  → 使用 Few-shot Learning + 结构化输出
  → 提供代码示例
  → 要求输出 JSON 格式的代码结构

场景 4: 复杂问题分析
  → 使用 Chain of Thought
  → 分解为多个思考步骤
  → 逐步分析

场景 5: 需要搜索信息的任务
  → 使用 ReAct 模式
  → 推理需要什么信息
  → 调用搜索工具

场景 6: API 响应生成
  → 使用结构化输出
  → 指定 JSON Schema
  → 便于程序解析

场景 7: 多步骤任务规划
  → 使用 ReAct 模式
  → 推理 -> 行动 -> 观察循环
  → 动态调整计划

场景 8: 数据提取任务
  → 使用 Few-shot Learning + 结构化输出
  → 提供提取示例
  → 要求 JSON 格式输出
`;

    console.log(guide);
}

/**
 * 技巧组合使用示例
 */
function showCombinationExamples() {
    console.log('\n' + '='.repeat(70));
    console.log('🔗 技巧组合使用示例');
    console.log('='.repeat(70));

    const examples = `
组合 1: Few-shot + 结构化输出
  场景: 代码审查工具
  - 使用 Few-shot 提供审查示例
  - 使用结构化输出要求 JSON 格式
  - 便于程序化处理审查结果

组合 2: CoT + 结构化输出
  场景: 复杂问题分析报告
  - 使用 CoT 展示分析过程
  - 使用结构化输出生成报告 JSON
  - 既有人工可读的过程，又有机器可解析的结果

组合 3: ReAct + 结构化输出
  场景: 智能 Agent 任务
  - 使用 ReAct 进行推理和行动
  - 使用结构化输出记录每个步骤的结果
  - 便于追踪和调试

组合 4: Few-shot + CoT
  场景: 代码生成任务
  - 使用 Few-shot 提供代码风格示例
  - 使用 CoT 展示代码设计思路
  - 生成高质量代码
`;

    console.log(examples);
}

/**
 * 主函数 - 运行所有示例
 */
async function runAllTechniques() {
    console.log('\n' + '='.repeat(70));
    console.log('🚀 高级提示词技巧 - 完整示例集合');
    console.log('='.repeat(70));
    console.log('\n本示例将展示四种高级提示词技巧：');
    console.log('1️⃣  Few-shot Learning（少样本学习）');
    console.log('2️⃣  Chain of Thought（思维链）');
    console.log('3️⃣  ReAct 模式（推理+行动）');
    console.log('4️⃣  结构化输出\n');

    try {
        // 显示对比和指南
        showTechniquesComparison();
        showUsageGuide();
        showCombinationExamples();

        console.log('\n' + '='.repeat(70));
        console.log('开始运行示例...');
        console.log('='.repeat(70));

        // 运行 Few-shot Learning 示例
        console.log('\n\n');
        await runFewShotExamples();

        // 运行 Chain of Thought 示例
        console.log('\n\n');
        await runCoTExamples();

        // 运行 ReAct 模式示例
        console.log('\n\n');
        await runReActExamples();

        // 运行结构化输出示例
        console.log('\n\n');
        await runStructuredExamples();

        // 总结
        console.log('\n\n' + '='.repeat(70));
        console.log('🎉 所有高级提示词技巧示例演示完成！');
        console.log('='.repeat(70));
        console.log('\n💡 学习要点总结：\n');
        console.log('1️⃣  Few-shot Learning 适合需要学习特定模式的任务');
        console.log('2️⃣  Chain of Thought 适合需要展示推理过程的复杂问题');
        console.log('3️⃣  ReAct 模式适合需要调用工具和动态决策的任务');
        console.log('4️⃣  结构化输出适合需要固定格式的程序化处理');
        console.log('5️⃣  可以组合使用多种技巧，发挥各自优势');
        console.log('\n📚 下一步学习建议：');
        console.log('   - 在实际项目中应用这些技巧');
        console.log('   - 尝试组合使用多种技巧');
        console.log('   - 学习 LangChain.js 中的相关实现');
        console.log(
            '   - 探索更多高级提示词技巧（如 Self-Consistency、Tree of Thoughts）'
        );
    } catch (error) {
        console.error('\n❌ 执行出错:', error.message);
        console.error('请检查：');
        console.error('  1. .env 文件中的 Dify API 配置是否正确');
        console.error('  2. API Key 是否有效');
        console.error('  3. 网络连接是否正常');
    }
}

/**
 * 运行单个技巧的示例
 */
async function runSingleTechnique(technique) {
    console.log('\n' + '='.repeat(70));
    console.log(`🚀 运行 ${technique} 示例`);
    console.log('='.repeat(70));

    try {
        switch (technique.toLowerCase()) {
            case 'few-shot':
            case 'fewshot':
            case '1':
                await runFewShotExamples();
                break;
            case 'cot':
            case 'chain-of-thought':
            case '2':
                await runCoTExamples();
                break;
            case 'react':
            case '3':
                await runReActExamples();
                break;
            case 'structured':
            case 'structured-output':
            case '4':
                await runStructuredExamples();
                break;
            default:
                console.log(
                    '未知的技巧，请选择：few-shot, cot, react, structured'
                );
        }
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 显示帮助信息
 */
function showHelp() {
    console.log('\n' + '='.repeat(70));
    console.log('📖 使用说明');
    console.log('='.repeat(70));

    const help = `
运行所有示例：
  node index.js

运行单个技巧示例：
  node index.js --technique=few-shot
  node index.js --technique=cot
  node index.js --technique=react
  node index.js --technique=structured

或者使用 package.json 中的脚本：
  npm run prompt:all          # 运行所有示例
  npm run prompt:few-shot     # Few-shot Learning
  npm run prompt:cot          # Chain of Thought
  npm run prompt:react        # ReAct 模式
  npm run prompt:structured   # 结构化输出

环境配置：
  确保 .env 文件中包含：
  DIFY_API_KEY=your_api_key
  DIFY_BASE_URL=your_base_url
  DIFY_ENDPOINT=your_endpoint
  DIFY_USER=your_user_id
`;

    console.log(help);
}

// 主函数
async function main() {
    const args = process.argv.slice(2);

    // 检查是否需要显示帮助
    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        return;
    }

    // 检查是否运行单个技巧
    const techniqueArg = args.find((arg) => arg.startsWith('--technique='));
    if (techniqueArg) {
        const technique = techniqueArg.split('=')[1];
        await runSingleTechnique(technique);
    } else {
        // 运行所有示例
        await runAllTechniques();
    }
}

// 执行主函数
main().catch(console.error);
