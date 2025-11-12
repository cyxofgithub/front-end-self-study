import { callDifyAPI, extractJSON } from '../utils/apiClient.js';

/**
 * 结构化输出示例
 *
 * 核心概念：
 * - 要求模型以特定格式输出（如 JSON、XML、表格等）
 * - 便于程序化处理和解析
 * - 提高输出的可靠性和一致性
 *
 * 优势：
 * - 输出格式统一，易于解析
 * - 减少后处理工作
 * - 提高数据质量
 * - 便于集成到系统中
 *
 * 适用场景：
 * - API 响应生成
 * - 数据提取和转换
 * - 报告生成
 * - 配置生成
 */

/**
 * 示例 1: JSON 格式输出
 * 要求模型输出标准 JSON 格式
 */
export async function example1_JSONOutput() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 1: JSON 格式输出');
    console.log('='.repeat(70));

    const prompt = `请分析以下文章，并以 JSON 格式输出分析结果。

文章：
"人工智能正在快速发展，ChatGPT 等大语言模型改变了我们与计算机交互的方式。这些技术可以用于内容创作、代码生成、问答系统等多个领域。然而，AI 也带来了隐私、就业等社会问题。"

请严格按照以下 JSON 格式输出：
{
  "title": "文章标题（如果没有则生成）",
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "summary": "文章摘要（50字以内）",
  "sentiment": "正面/中性/负面",
  "topics": ["主题1", "主题2"],
  "word_count": 字数
}

只输出 JSON，不要添加任何其他文字。`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 300) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI 原始输出:');
        console.log(result);
        console.log('\n📦 解析后的 JSON:');
        const jsonResult = extractJSON(result);
        console.log(JSON.stringify(jsonResult, null, 2));
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 示例 2: 表格格式输出
 * 要求模型以表格形式输出数据
 */
export async function example2_TableOutput() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 2: 表格格式输出');
    console.log('='.repeat(70));

    const prompt = `请分析以下三个前端框架，并以表格格式输出对比结果。

框架：
1. React - 由 Facebook 开发，使用虚拟 DOM，生态丰富
2. Vue - 由尤雨溪开发，渐进式框架，学习曲线平缓
3. Angular - 由 Google 开发，完整的 MVC 框架，适合大型项目

请以 Markdown 表格格式输出：
| 框架 | 开发者 | 核心特性 | 适用场景 | 学习难度 |
|------|--------|----------|----------|----------|
| ... | ... | ... | ... | ... |

只输出表格，不要添加其他说明。`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 250) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI 表格输出:');
        console.log(result);
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 示例 3: XML 格式输出
 * 要求模型以 XML 格式输出结构化数据
 */
export async function example3_XMLOutput() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 3: XML 格式输出');
    console.log('='.repeat(70));

    const prompt = `请将以下产品信息转换为 XML 格式。

产品信息：
- 名称：MacBook Pro 14"
- 价格：14999 元
- 配置：M3 芯片，16GB 内存，512GB 存储
- 颜色：深空灰色、银色
- 特性：Retina 显示屏、Touch ID、长续航

请严格按照以下 XML 格式输出：
<?xml version="1.0" encoding="UTF-8"?>
<product>
  <name>产品名称</name>
  <price>价格</price>
  <specs>
    <spec name="芯片">...</spec>
    <spec name="内存">...</spec>
    <spec name="存储">...</spec>
  </specs>
  <colors>
    <color>颜色1</color>
    <color>颜色2</color>
  </colors>
  <features>
    <feature>特性1</feature>
    <feature>特性2</feature>
  </features>
</product>

只输出 XML，不要添加其他文字。`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 300) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI XML 输出:');
        console.log(result);
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 示例 4: 嵌套 JSON 结构
 * 要求模型输出复杂的嵌套 JSON 结构
 */
export async function example4_NestedJSON() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 4: 嵌套 JSON 结构');
    console.log('='.repeat(70));

    const prompt = `请分析以下项目需求，并以嵌套 JSON 格式输出项目规划。

需求：开发一个在线教育平台，包含用户管理、课程管理、支付系统、学习进度跟踪等功能。

请严格按照以下 JSON 格式输出：
{
  "project": {
    "name": "项目名称",
    "description": "项目描述",
    "modules": [
      {
        "name": "模块名称",
        "description": "模块描述",
        "features": ["功能1", "功能2"],
        "tech_stack": ["技术1", "技术2"],
        "priority": "高/中/低"
      }
    ],
    "timeline": {
      "total_weeks": 总周数,
      "phases": [
        {
          "phase": "阶段名称",
          "weeks": 周数,
          "deliverables": ["交付物1", "交付物2"]
        }
      ]
    }
  }
}

只输出 JSON，不要添加任何其他文字。`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 350) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI 原始输出:');
        console.log(result);
        console.log('\n📦 解析后的 JSON:');
        const jsonResult = extractJSON(result);
        console.log(JSON.stringify(jsonResult, null, 2));
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 示例 5: 带验证的结构化输出
 * 要求模型输出符合特定 schema 的数据
 */
export async function example5_ValidatedOutput() {
    console.log('\n' + '='.repeat(70));
    console.log('📚 示例 5: 带验证的结构化输出');
    console.log('='.repeat(70));

    const prompt = `请分析以下代码片段，并以 JSON 格式输出代码审查结果。

代码：
\`\`\`javascript
function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    return total;
}
\`\`\`

请严格按照以下 JSON Schema 输出（所有字段必填）：
{
  "code_quality": {
    "score": 1-10的整数,
    "issues": [
      {
        "type": "问题类型（bug/performance/style/best_practice）",
        "severity": "严重程度（high/medium/low）",
        "description": "问题描述",
        "suggestion": "改进建议"
      }
    ]
  },
  "suggestions": [
    {
      "improvement": "改进建议",
      "priority": "high/medium/low"
    }
  ],
  "overall_assessment": "总体评价"
}

注意：
- score 必须是 1-10 的整数
- issues 和 suggestions 是数组，至少包含一个元素
- 所有字符串字段不能为空

只输出 JSON，不要添加任何其他文字。`;

    console.log('\n📝 提示词示例：');
    console.log(prompt.substring(0, 400) + '...\n');

    try {
        const result = await callDifyAPI(prompt);
        console.log('✅ AI 原始输出:');
        console.log(result);
        console.log('\n📦 解析后的 JSON:');
        const jsonResult = extractJSON(result);
        console.log(JSON.stringify(jsonResult, null, 2));

        // 简单验证
        if (
            jsonResult.code_quality &&
            jsonResult.code_quality.score >= 1 &&
            jsonResult.code_quality.score <= 10
        ) {
            console.log('\n✅ JSON 格式验证通过');
        } else {
            console.log('\n⚠️ JSON 格式可能不符合要求');
        }
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    }
}

/**
 * 结构化输出最佳实践总结
 */
export function showBestPractices() {
    console.log('\n' + '='.repeat(70));
    console.log('💡 结构化输出最佳实践');
    console.log('='.repeat(70));

    const practices = `
1. 明确指定格式
   ✓ 提供完整的格式示例
   ✓ 使用 "严格按照以下格式" 等强调词
   ✓ 明确说明 "只输出 JSON，不要添加其他文字"

2. 提供 Schema 定义
   ✓ 列出所有必需字段
   ✓ 指定字段类型和约束
   ✓ 说明可选字段
   ✓ 提供嵌套结构示例

3. 格式选择
   ✓ JSON: 最常用，易于解析
   ✓ XML: 需要严格结构时使用
   ✓ 表格: 适合对比数据
   ✓ CSV: 适合简单列表数据

4. 错误处理
   ✓ 使用 extractJSON 等工具解析
   ✓ 验证必需字段是否存在
   ✓ 检查数据类型是否正确
   ✓ 提供默认值处理

5. 提示词技巧
   ✓ 在提示词末尾强调格式要求
   ✓ 使用 "必须"、"严格" 等词
   ✓ 提供格式示例（Few-shot）
   ✓ 明确说明不要添加额外文字

6. 适用场景
   ✓ API 响应生成
   ✓ 数据提取和转换
   ✓ 报告生成
   ✓ 配置生成
   ✓ 代码生成（如生成配置文件）

7. 注意事项
   ✓ 模型可能不总是严格遵循格式
   ✓ 需要后处理验证和清理
   ✓ 复杂结构可能需要多次尝试
   ✓ 考虑使用 OpenAI 的 structured_outputs 功能（如果可用）
`;

    console.log(practices);
}

/**
 * 运行所有结构化输出示例
 */
export async function runAllExamples() {
    console.log('\n🚀 结构化输出完整示例\n');

    // 显示最佳实践
    showBestPractices();

    // 运行示例
    await example1_JSONOutput();
    await example2_TableOutput();
    await example3_XMLOutput();
    await example4_NestedJSON();
    await example5_ValidatedOutput();

    console.log('\n' + '='.repeat(70));
    console.log('🎉 结构化输出示例演示完成！');
    console.log('='.repeat(70));
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllExamples().catch(console.error);
}
