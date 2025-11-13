import { callDifyAPI } from '../../utils/apiClient.js';

/**
 * Few-shot Learning（少样本学习）示例
 *
 * 核心概念：
 * - 通过在提示词中提供少量示例，引导模型学习特定模式
 * - 让模型通过观察示例来理解任务要求和输出格式
 * - 适用于：文本分类、代码生成、格式转换等任务
 *
 * 优势：
 * - 无需微调模型
 * - 快速适应新任务
 * - 成本低、灵活性高
 */

/**
 * 示例 1: 情感分析（文本分类）
 * 通过提供正负面情感的例子，让模型学会识别情感倾向
 */
export async function example1_SentimentAnalysis() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 1: 情感分析（Few-shot Learning）');
    console.log('='.repeat(70));

    const prompt = `你是一个情感分析专家。请分析以下文本的情感倾向。

示例：
文本: "这个产品太棒了，我非常满意！"
情感: 正面

文本: "服务态度很差，完全不推荐。"
情感: 负面

文本: "质量还可以，但价格有点贵。"
情感: 中性

现在请分析以下文本：
文本: "这部电影的剧情很精彩，演员表演也很到位，值得一看！"
情感:`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 200) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI 分析结果:', result);
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 示例 2: 代码生成（格式转换）
 * 通过提供输入输出示例，让模型学会特定格式转换
 */
export async function example2_CodeGeneration() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 2: 代码生成（Few-shot Learning）');
    console.log('='.repeat(70));

    const prompt = `你是一个代码转换专家。请将以下 JavaScript 对象转换为 TypeScript 接口定义。

示例 1:
输入:
{
  "name": "string",
  "age": "number",
  "email": "string"
}

输出:
interface User {
  name: string;
  age: number;
  email: string;
}

示例 2:
输入:
{
  "id": "number",
  "title": "string",
  "published": "boolean"
}

输出:
interface Article {
  id: number;
  title: string;
  published: boolean;
}

现在请转换以下对象：
输入:
{
  "userId": "number",
  "username": "string",
  "isActive": "boolean",
  "tags": "string[]"
}

输出:`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 300) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI 生成结果:');
        console.log(result);
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 示例 3: 文本摘要（任务理解）
 * 通过提供摘要示例，让模型理解摘要的长度和风格要求
 */
export async function example3_TextSummarization() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 3: 文本摘要（Few-shot Learning）');
    console.log('='.repeat(70));

    const prompt = `你是一个专业的内容摘要专家。请为以下文章生成简洁的摘要（50字以内）。

示例 1:
原文: "人工智能正在改变我们的生活方式。从智能手机到自动驾驶汽车，AI技术已经渗透到各个领域。未来，AI将在医疗、教育、金融等行业发挥更大作用。"
摘要: "AI技术已广泛应用于生活各领域，未来将在医疗、教育、金融等行业发挥更大作用。"

示例 2:
原文: "区块链技术具有去中心化、不可篡改等特点，在金融、供应链管理等领域有广泛应用前景。但同时也面临性能、能耗等挑战。"
摘要: "区块链具有去中心化特点，应用前景广阔，但面临性能和能耗挑战。"

现在请为以下文章生成摘要：
原文: "前端开发技术日新月异，React、Vue、Angular等框架不断更新。开发者需要持续学习新技术，同时也要关注性能优化、用户体验等核心问题。"
摘要:`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 400) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI 生成摘要:', result);
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * Few-shot Learning 最佳实践总结
 */
export function showBestPractices() {
    console.log('\n' + '='.repeat(70));
    console.log('💡 Few-shot Learning 最佳实践');
    console.log('='.repeat(70));

    const practices = `
1. 示例数量
   ✓ 通常 2-5 个示例效果最佳
   ✓ 太少：模型可能无法理解模式
   ✓ 太多：浪费 token，可能过拟合

2. 示例质量
   ✓ 选择具有代表性的示例
   ✓ 覆盖不同的场景和边界情况
   ✓ 保持示例风格一致

3. 示例顺序
   ✓ 简单到复杂排列
   ✓ 将最重要的示例放在前面
   ✓ 最后一个示例最接近目标任务

4. 提示词结构
   ✓ 明确说明任务目标
   ✓ 清晰标注输入输出
   ✓ 使用一致的格式

5. 适用场景
   ✓ 文本分类和标注
   ✓ 格式转换
   ✓ 代码生成
   ✓ 数据提取
   ✗ 不适合需要大量上下文的任务
   ✗ 不适合需要推理链的复杂任务

6. 成本考虑
   ✓ Few-shot 会增加 token 消耗
   ✓ 对于频繁调用的任务，考虑微调模型
   ✓ 平衡示例数量和效果
`;

    console.log(practices);
}

/**
 * 运行所有 Few-shot Learning 示例
 */
export async function runAllExamples() {
    console.log('\n🚀 Few-shot Learning（少样本学习）完整示例\n');

    // 显示最佳实践
    showBestPractices();

    // 运行示例
    await example1_SentimentAnalysis();
    await example2_CodeGeneration();
    await example3_TextSummarization();

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Few-shot Learning 示例演示完成！');
    console.log('='.repeat(70));
}
