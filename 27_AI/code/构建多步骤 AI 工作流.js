import dotenv from 'dotenv';
dotenv.config();
console.log('配置信息:', {
    DIFY_API_KEY: process.env.DIFY_API_KEY,
    DIFY_BASE_URL: process.env.DIFY_BASE_URL,
    DIFY_ENDPOINT: process.env.DIFY_ENDPOINT,
    DIFY_USER: process.env.DIFY_USER,
});
/**
 * 多步骤 AI 工作流示例
 * 场景：智能博客文章生成助手
 *
 * 工作流步骤：
 * 1. 分析用户输入的主题，提取关键词
 * 2. 根据关键词生成文章大纲
 * 3. 根据大纲生成完整文章
 * 4. 对文章进行总结和优化建议
 *
 * 使用 Dify API
 */

// ============ Dify API 配置 ============
const DIFY_CONFIG = {
    apiKey: process.env.DIFY_API_KEY,
    baseURL: process.env.DIFY_BASE_URL,
    endpoint: process.env.DIFY_ENDPOINT,
};

// Dify API 调用函数（支持流式响应）
async function callDifyAPI(prompt, user = process.env.DIFY_USER) {
    const requestBody = {
        inputs: {
            query: prompt,
        },

        response_mode: 'blocking', // 使用阻塞模式，一次性返回完整响应
        user: user,
    };

    console.log('🔍 调用 Dify API (阻塞模式)...');

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
        console.error('❌ API 返回错误:');
        console.error('状态码:', response.status);
        console.error('响应内容:', errorText);
        throw new Error(
            `Dify API 调用失败: ${response.status} ${response.statusText}\n详情: ${errorText}`
        );
    }

    // 处理阻塞模式响应 (直接返回完整 JSON)
    const data = await response.json();

    console.log('✅ API 调用成功');

    // blocking 模式返回格式：
    // {
    //   "message_id": "xxx",
    //   "conversation_id": "xxx",
    //   "mode": "chat",
    //   "answer": "实际回答内容",
    //   "metadata": {...},
    //   "created_at": timestamp
    // }

    if (!data.answer) {
        console.error('❌ 响应中没有 answer 字段:', data);
        throw new Error('API 响应格式异常：缺少 answer 字段');
    }

    return data.answer;
}

// ============ 步骤1: 主题分析与关键词提取 ============
async function step1_analyzeTopicAndExtractKeywords(topic) {
    console.log('\n📌 步骤1: 分析主题并提取关键词...');

    const prompt = `你是一个专业的内容分析师。请分析以下主题，提取3-5个核心关键词。

主题: ${topic}

请以 JSON 格式输出：
{
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "category": "文章类别",
  "tone": "建议的写作风格"
}`;

    const responseText = await callDifyAPI(prompt);

    // 尝试提取 JSON（有时模型会在前后加说明文字）
    let result;
    try {
        // 尝试直接解析
        result = JSON.parse(responseText);
    } catch (e) {
        // 如果失败，尝试提取 JSON 部分
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('无法解析返回的 JSON 格式');
        }
    }

    console.log('✅ 关键词:', result.keywords);
    console.log('✅ 类别:', result.category);
    console.log('✅ 风格:', result.tone);

    return result;
}

// ============ 步骤2: 生成文章大纲（使用 Few-shot Learning）============
async function step2_generateOutline(analysisResult) {
    console.log('\n📌 步骤2: 生成文章大纲...');

    // Few-shot Learning: 提供示例引导模型输出格式
    const prompt = `你是一个专业的内容策划师。根据以下信息生成文章大纲。

关键词: ${analysisResult.keywords.join(', ')}
类别: ${analysisResult.category}
风格: ${analysisResult.tone}

参考格式（Few-shot示例）：
示例1 - 主题"前端性能优化"：
1. 引言：为什么性能优化重要
2. 核心优化策略
   2.1 代码层面优化
   2.2 资源加载优化
3. 实战案例分析
4. 总结与建议

请为当前主题生成类似结构的大纲（3-4个主要章节）：`;

    const outline = await callDifyAPI(prompt);
    console.log('✅ 大纲生成完成:\n', outline);

    return outline;
}

// ============ 步骤3: 根据大纲生成文章（使用 Chain of Thought）============
async function step3_generateArticle(outline, analysisResult) {
    console.log('\n📌 步骤3: 生成完整文章...');

    // Chain of Thought: 引导模型逐步思考
    const prompt = `你是一个专业的技术博客作者。请根据以下大纲撰写文章。

大纲:
${outline}

写作要求:
- 风格: ${analysisResult.tone}
- 关键词必须自然融入: ${analysisResult.keywords.join(', ')}
- 字数: 约500-800字
- 结构清晰，每个章节有实质内容

思考过程（Chain of Thought）:
1. 先确定每个章节的核心论点
2. 为每个论点找到支撑性论据或案例
3. 用通俗易懂的语言展开
4. 确保逻辑连贯

请开始撰写：`;

    const article = await callDifyAPI(prompt);
    console.log(
        '✅ 文章生成完成（部分预览）:\n',
        article.substring(0, 300) + '...'
    );

    return article;
}

// ============ 步骤4: 文章评估与优化建议（结构化输出）============
async function step4_evaluateAndSuggest(article) {
    console.log('\n📌 步骤4: 评估文章质量并给出建议...');

    const prompt = `你是一个专业的内容审核师。请评估以下文章的质量。

文章内容:
${article.substring(0, 1000)}...

请严格按照 JSON 格式输出评估结果：
{
  "quality_score": "评分(1-10)",
  "strengths": ["优点1", "优点2"],
  "weaknesses": ["不足1", "不足2"],
  "suggestions": ["改进建议1", "改进建议2"],
  "seo_score": "SEO友好度(1-10)"
}`;

    const responseText = await callDifyAPI(prompt);

    // 尝试提取 JSON
    let evaluation;
    try {
        evaluation = JSON.parse(responseText);
    } catch (e) {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            evaluation = JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('无法解析返回的 JSON 格式');
        }
    }

    console.log('✅ 质量评分:', evaluation.quality_score);
    console.log('✅ 优点:', evaluation.strengths);
    console.log('✅ 改进建议:', evaluation.suggestions);

    return evaluation;
}

// ============ 主工作流：串联所有步骤 ============
async function runArticleGenerationWorkflow(topic) {
    console.log('🚀 开始多步骤 AI 工作流...');
    console.log('📝 主题:', topic);
    console.log('='.repeat(60));

    try {
        // 步骤1: 分析主题
        const analysis = await step1_analyzeTopicAndExtractKeywords(topic);

        // 步骤2: 生成大纲
        const outline = await step2_generateOutline(analysis);

        // 步骤3: 生成文章
        const article = await step3_generateArticle(outline, analysis);

        // 步骤4: 评估与建议
        const evaluation = await step4_evaluateAndSuggest(article);

        // 最终输出
        console.log('\n' + '='.repeat(60));
        console.log('🎉 工作流完成！');
        console.log('='.repeat(60));

        return {
            topic,
            analysis,
            outline,
            article,
            evaluation,
        };
    } catch (error) {
        console.error('❌ 工作流执行出错:', error.message);
        throw error;
    }
}

// ============ 运行示例 ============
async function main() {
    const topic = '评价一下广州全运会';

    const result = await runArticleGenerationWorkflow(topic);

    // 保存结果（可选）
    console.log('\n💾 完整结果已生成，可以保存到文件或数据库');
    console.log('文章字数:', result.article.length);
}

// 执行主函数
main().catch(console.error);
