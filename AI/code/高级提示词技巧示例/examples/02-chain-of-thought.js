import { callDifyAPI } from '../../utils/apiClient.js';

/**
 * Chain of Thought (CoT) 思维链示例
 *
 * 核心概念：
 * - 引导模型逐步思考，展示推理过程
 * - 将复杂问题分解为多个简单步骤
 * - 让模型"展示工作过程"，而不是直接给出答案
 *
 * 优势：
 * - 提高复杂问题的准确率
 * - 增强模型推理能力
 * - 结果可解释性更强
 *
 * 适用场景：
 * - 数学问题求解
 * - 逻辑推理
 * - 多步骤问题分析
 * - 需要解释过程的任务
 */

/**
 * 示例 1: 数学问题求解
 * 通过引导模型展示计算步骤，提高准确性
 */
export async function example1_MathProblem() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 1: 数学问题求解（Chain of Thought）');
    console.log('='.repeat(70));

    const prompt = `请解决以下数学问题，并展示你的思考过程。

问题：一家商店有 120 个苹果，第一天卖出了总数的 1/3，第二天卖出了剩余数量的 1/4，第三天卖出了剩余数量的 1/5。请问最后还剩多少个苹果？

请按以下步骤思考：
1. 首先计算第一天卖出后剩余的数量
2. 然后计算第二天卖出后剩余的数量
3. 最后计算第三天卖出后剩余的数量
4. 给出最终答案

思考过程：`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 250) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI 推理过程:');
        console.log(result);
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 示例 2: 逻辑推理问题
 * 通过展示推理链，解决复杂的逻辑问题
 */
export async function example2_LogicalReasoning() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 2: 逻辑推理（Chain of Thought）');
    console.log('='.repeat(70));

    const prompt = `请分析以下逻辑问题，并展示你的推理过程。

问题：
在一个班级中：
- 如果小明参加比赛，那么小红也会参加
- 如果小红参加比赛，那么小刚不会参加
- 如果小刚不参加比赛，那么小丽会参加
- 小丽没有参加比赛

请问：小明是否参加了比赛？

请按以下步骤推理：
1. 从已知条件开始分析
2. 根据逻辑关系逐步推导
3. 检查是否存在矛盾
4. 得出结论

推理过程：`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 300) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI 推理过程:');
        console.log(result);
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 示例 3: 多步骤问题分析
 * 将复杂问题分解为多个思考步骤
 */
export async function example3_MultiStepAnalysis() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 3: 多步骤问题分析（Chain of Thought）');
    console.log('='.repeat(70));

    const prompt = `请分析以下问题，并展示你的思考过程。

问题：一个电商网站想要提高用户转化率，当前转化率为 2%。请分析可能的原因并提出改进方案。

请按以下步骤思考：
步骤 1: 分析转化率低可能的原因
  - 考虑用户行为路径
  - 考虑页面设计因素
  - 考虑产品展示因素
  - 考虑支付流程因素

步骤 2: 针对每个原因，提出具体的改进措施
  - 页面优化建议
  - 用户体验改进
  - 技术优化方案

步骤 3: 评估改进措施的优先级
  - 哪些措施影响最大
  - 哪些措施实施成本最低
  - 哪些措施可以快速见效

步骤 4: 给出综合建议

思考过程：`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 400) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI 分析结果:');
        console.log(result);
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 示例 4: Zero-shot CoT（零样本思维链）
 * 通过简单的提示词触发模型自动展示思考过程
 */
export async function example4_ZeroShotCoT() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 4: Zero-shot CoT（零样本思维链）');
    console.log('='.repeat(70));

    const prompt = `请解决以下问题，并展示你的思考过程。

问题：一个水池有两个进水管和一个出水管。进水管 A 单独注满水池需要 6 小时，进水管 B 单独注满水池需要 8 小时，出水管单独排空水池需要 10 小时。如果三个管子同时打开，需要多少小时才能注满水池？

让我们一步步思考这个问题。`;

    console.log('\n📝 提示词示例：');
    console.log('使用 "让我们一步步思考" 触发 CoT 推理\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI 推理过程:');
        console.log(result);
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * Chain of Thought 最佳实践总结
 */
export function showBestPractices() {
    console.log('\n' + '='.repeat(70));
    console.log('💡 Chain of Thought 最佳实践');
    console.log('='.repeat(70));

    const practices = `
1. 明确要求展示思考过程
   ✓ 使用 "请展示你的思考过程"
   ✓ 使用 "让我们一步步分析"
   ✓ 使用 "请按以下步骤思考"

2. 提供思考框架（可选）
   ✓ 对于复杂问题，提供思考步骤大纲
   ✓ 引导模型按逻辑顺序思考
   ✓ 避免过于详细的步骤（让模型自己填充）

3. 分解复杂问题
   ✓ 将大问题拆分为小问题
   ✓ 每个步骤解决一个子问题
   ✓ 确保步骤之间有逻辑关联

4. 触发词使用
   ✓ Zero-shot CoT: "让我们一步步思考"
   ✓ Few-shot CoT: 提供带思考过程的示例
   ✓ 明确步骤: "步骤1...步骤2..."

5. 适用场景
   ✓ 数学计算问题
   ✓ 逻辑推理问题
   ✓ 多步骤分析任务
   ✓ 需要解释过程的任务
   ✗ 简单的事实查询
   ✗ 不需要推理的格式化任务

6. 注意事项
   ✓ CoT 会增加 token 消耗
   ✓ 对于简单问题可能过度复杂化
   ✓ 需要验证推理过程的正确性
   ✓ 可以结合结构化输出使用
`;

    console.log(practices);
}

/**
 * 运行所有 Chain of Thought 示例
 */
export async function runAllExamples() {
    console.log('\n🚀 Chain of Thought（思维链）完整示例\n');

    // 显示最佳实践
    showBestPractices();

    // 运行示例
    await example1_MathProblem();
    await example2_LogicalReasoning();
    await example3_MultiStepAnalysis();
    await example4_ZeroShotCoT();

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Chain of Thought 示例演示完成！');
    console.log('='.repeat(70));
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllExamples().catch(console.error);
}
