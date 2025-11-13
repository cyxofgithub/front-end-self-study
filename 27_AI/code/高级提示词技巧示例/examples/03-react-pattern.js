import { callDifyAPI } from '../../utils/apiClient.js';

/**
 * ReAct 模式示例（Reasoning + Acting）
 *
 * 核心概念：
 * - ReAct = Reasoning（推理）+ Acting（行动）
 * - 模型在推理和行动之间交替进行
 * - 推理：分析当前情况，决定下一步行动
 * - 行动：执行具体操作（如搜索、计算、查询等）
 *
 * 工作流程：
 * 1. 观察（Observation）：获取当前状态信息
 * 2. 思考（Thought）：分析情况，决定下一步
 * 3. 行动（Action）：执行具体操作
 * 4. 观察结果（Observation）：获取行动结果
 * 5. 重复步骤 2-4，直到完成任务
 *
 * 适用场景：
 * - 需要多步骤推理的复杂任务
 * - 需要调用外部工具的任务
 * - 需要动态决策的任务
 */

/**
 * 示例 1: 问题解决流程（模拟 ReAct）
 * 展示推理和行动的交替过程
 */
export async function example1_ProblemSolving() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 1: 问题解决流程（ReAct 模式）');
    console.log('='.repeat(70));

    const prompt = `你是一个智能助手，需要解决以下问题。请使用 ReAct 模式：先推理（Thought），再行动（Action），然后观察结果（Observation），循环直到解决问题。

问题：用户想要开发一个待办事项应用，需要哪些技术栈和步骤？

请按以下格式输出：
Thought: [你的思考过程]
Action: [你要执行的操作，如：分析需求、列出技术栈、规划步骤等]
Observation: [操作的结果或发现]

开始解决问题：`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 300) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI ReAct 过程:');
        console.log(result);
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 示例 2: 信息检索与整合（ReAct 模式）
 * 展示如何通过推理决定需要搜索什么信息
 */
export async function example2_InformationRetrieval() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 2: 信息检索与整合（ReAct 模式）');
    console.log('='.repeat(70));

    const prompt = `你是一个研究助手，需要回答用户的问题。使用 ReAct 模式，通过推理决定需要查找哪些信息。

问题：React 18 有哪些新特性？它们对开发有什么影响？

ReAct 格式：
Thought: [分析问题，确定需要查找的信息]
Action: [执行操作，如：查找 React 18 新特性、分析影响等]
Observation: [获得的信息]

请开始：`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 250) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI ReAct 过程:');
        console.log(result);
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 示例 3: 多步骤任务规划（ReAct 模式）
 * 展示如何通过推理规划任务步骤
 */
export async function example3_TaskPlanning() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 3: 多步骤任务规划（ReAct 模式）');
    console.log('='.repeat(70));

    const prompt = `你是一个项目规划助手。使用 ReAct 模式帮助用户规划项目。

任务：开发一个在线购物网站

请按 ReAct 模式规划：
Thought: [分析任务，确定需要规划的方面]
Action: [执行规划操作，如：列出功能模块、确定技术选型、规划开发阶段等]
Observation: [规划结果]

继续循环，直到完成完整的项目规划：`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 300) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI ReAct 规划过程:');
        console.log(result);
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 示例 4: 带工具调用的 ReAct（模拟）
 * 展示如何在实际应用中结合工具使用
 */
export async function example4_ReActWithTools() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 4: 带工具调用的 ReAct（模拟）');
    console.log('='.repeat(70));

    const prompt = `你是一个智能助手，可以使用以下工具：
- search(query): 搜索信息
- calculate(expression): 计算数学表达式
- analyze(text): 分析文本内容

任务：用户问"2024年全球AI市场规模是多少？这个数字相比2023年增长了多少百分比？"

请使用 ReAct 模式，在需要时调用工具。

格式：
Thought: [分析需要做什么]
Action: [工具名称](参数)
Observation: [工具返回结果]

继续直到完成任务：`;

    console.log('\n📝 提示词示例：');
    console.log('展示如何结合工具使用 ReAct 模式\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI ReAct + 工具调用过程:');
        console.log(result);
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * ReAct 模式最佳实践总结
 */
export function showBestPractices() {
    console.log('\n' + '='.repeat(70));
    console.log('💡 ReAct 模式最佳实践');
    console.log('='.repeat(70));

    const practices = `
1. 明确 ReAct 循环结构
   ✓ 使用固定的格式：Thought -> Action -> Observation
   ✓ 确保每个循环都有明确的输出
   ✓ 在 Observation 后继续 Thought，形成循环

2. 推理（Thought）部分
   ✓ 分析当前情况
   ✓ 评估可用信息和工具
   ✓ 决定下一步行动
   ✓ 考虑可能的后果

3. 行动（Action）部分
   ✓ 明确指定要执行的操作
   ✓ 提供必要的参数
   ✓ 如果是工具调用，使用标准格式
   ✓ 行动应该具体可执行

4. 观察（Observation）部分
   ✓ 记录行动的结果
   ✓ 评估结果是否满足需求
   ✓ 识别新的信息或问题
   ✓ 为下一轮推理提供输入

5. 终止条件
   ✓ 明确何时结束循环
   ✓ 可以是：任务完成、信息足够、遇到错误等
   ✓ 在最后给出最终答案或总结

6. 适用场景
   ✓ 需要多步骤推理的复杂任务
   ✓ 需要调用外部工具的任务
   ✓ 需要动态决策的任务
   ✓ Agent 应用开发
   ✗ 简单的单步任务
   ✗ 不需要推理的格式化任务

7. 实现注意事项
   ✓ 在实际应用中，Action 需要真正执行
   ✓ 可以使用 LangChain Agents 实现
   ✓ 需要处理工具调用的错误情况
   ✓ 可以设置最大循环次数防止无限循环
`;

    console.log(practices);
}

/**
 * ReAct vs CoT 对比
 */
export function showComparison() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 ReAct vs Chain of Thought 对比');
    console.log('='.repeat(70));

    const comparison = `
┌──────────────┬──────────────────────┬──────────────────────┐
│ 特性         │ Chain of Thought     │ ReAct                │
├──────────────┼──────────────────────┼──────────────────────┤
│ 核心         │ 展示推理过程         │ 推理 + 行动循环      │
│ 输出         │ 思考步骤 + 答案      │ Thought/Action/Obs   │
│ 工具调用     │ 不支持               │ 支持                 │
│ 适用任务     │ 纯推理问题           │ 需要行动的任务       │
│ 复杂度       │ 中等                 │ 较高                 │
│ 实现难度     │ 低（仅提示词）       │ 高（需要工具集成）   │
│ Token 消耗   │ 中等                 │ 较高（多轮循环）     │
└──────────────┴──────────────────────┴──────────────────────┘

选择建议：
- 纯推理问题 → 使用 CoT
- 需要调用工具 → 使用 ReAct
- 简单问题 → 直接提问
- 复杂 Agent → 使用 ReAct + LangChain
`;

    console.log(comparison);
}

/**
 * 运行所有 ReAct 模式示例
 */
export async function runAllExamples() {
    console.log('\n🚀 ReAct 模式（Reasoning + Acting）完整示例\n');

    // 显示最佳实践和对比
    showBestPractices();
    showComparison();

    // 运行示例
    await example1_ProblemSolving();
    await example2_InformationRetrieval();
    await example3_TaskPlanning();
    await example4_ReActWithTools();

    console.log('\n' + '='.repeat(70));
    console.log('🎉 ReAct 模式示例演示完成！');
    console.log('='.repeat(70));
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllExamples().catch(console.error);
}
