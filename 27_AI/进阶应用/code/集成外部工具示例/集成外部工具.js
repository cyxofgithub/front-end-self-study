import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
dotenv.config();

/**
 * 集成外部工具示例 - AI Agent 实现
 *
 * 核心概念：
 * 1. Tools（工具集成）- 让 AI 能够调用外部工具
 * 2. Function Calling - AI 决定何时、如何调用工具
 * 3. Agent 模式 - AI 自主决策使用哪个工具
 *
 * 实现的工具：
 * - 🌐 网络搜索工具（模拟搜索 API）
 * - 🗄️ 数据库查询工具（SQLite）
 * - 🌤️ 天气查询工具（模拟天气 API）
 * - 🧮 计算器工具（自定义工具）
 *
 * 学习目标：
 * - 理解如何设计和实现工具系统
 * - 掌握 Function Calling 的使用
 * - 学习 AI Agent 的构建模式
 * - 理解工具选择和执行流程
 */

// ============ Dify API 配置 ============
const DIFY_CONFIG = {
    apiKey: process.env.DIFY_API_KEY,
    baseURL: process.env.DIFY_BASE_URL,
    endpoint: process.env.DIFY_ENDPOINT,
};

// ============ 工具定义 ============

/**
 * 工具 1: 网络搜索工具
 * 模拟调用搜索 API（实际应用中可集成 Google Search API、Bing Search API 等）
 */
class WebSearchTool {
    constructor() {
        this.name = 'web_search';
        this.description =
            '在互联网上搜索最新的信息。适用于查询实时新闻、最新资讯、网络上的公开信息等。';
    }

    /**
     * 模拟搜索 API 调用
     * 在实际应用中，这里应该调用真实的搜索 API，例如：
     * - Google Custom Search API
     * - Bing Web Search API
     * - SerpAPI
     * - Brave Search API
     */
    async execute(query) {
        console.log(`\n🔍 执行网络搜索: "${query}"`);

        // 模拟 API 延迟
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 模拟搜索结果
        // 实际应用中，这里应该是真实的 API 调用
        const mockResults = {
            AI发展: [
                {
                    title: 'AI 技术的最新进展 - 2024',
                    snippet:
                        '人工智能在2024年取得了重大突破，特别是在大语言模型和多模态AI领域...',
                    url: 'https://example.com/ai-trends-2024',
                },
                {
                    title: 'ChatGPT 和 Claude 的对比分析',
                    snippet: '本文深入分析了当前主流AI助手的优缺点...',
                    url: 'https://example.com/chatgpt-vs-claude',
                },
            ],
            default: [
                {
                    title: `关于"${query}"的搜索结果`,
                    snippet:
                        '找到了相关的网络信息，建议查看最新的资讯网站获取更多详情。',
                    url: 'https://example.com/search',
                },
            ],
        };

        const results = mockResults[query] || mockResults['default'];

        return {
            query: query,
            results: results,
            timestamp: new Date().toISOString(),
        };
    }

    formatResults(results) {
        let formatted = `搜索结果 (${results.results.length} 条):\n\n`;
        results.results.forEach((result, index) => {
            formatted += `${index + 1}. ${result.title}\n`;
            formatted += `   ${result.snippet}\n`;
            formatted += `   链接: ${result.url}\n\n`;
        });
        return formatted;
    }
}

/**
 * 工具 2: 数据库查询工具
 * 集成 SQLite 数据库，演示如何让 AI 查询结构化数据
 */
class DatabaseTool {
    constructor() {
        this.name = 'database_query';
        this.description =
            '查询产品数据库中的商品信息。可以查询产品名称、价格、库存等信息。';
        this.db = null;
    }

    /**
     * 初始化数据库
     * 在实际应用中，这里可以连接到：
     * - MySQL
     * - PostgreSQL
     * - MongoDB
     * - 或任何其他数据库
     */
    async initialize() {
        // 创建内存数据库（演示用）
        this.db = await open({
            filename: ':memory:',
            driver: sqlite3.Database,
        });

        // 创建示例表
        await this.db.exec(`
            CREATE TABLE products (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                stock INTEGER NOT NULL,
                description TEXT
            )
        `);

        // 插入示例数据
        const products = [
            {
                name: 'iPhone 15 Pro',
                category: '手机',
                price: 7999,
                stock: 50,
                description: '最新款苹果手机',
            },
            {
                name: 'MacBook Pro M3',
                category: '电脑',
                price: 12999,
                stock: 30,
                description: '高性能笔记本电脑',
            },
            {
                name: 'AirPods Pro 2',
                category: '耳机',
                price: 1899,
                stock: 100,
                description: '无线降噪耳机',
            },
            {
                name: 'iPad Air',
                category: '平板',
                price: 4799,
                stock: 45,
                description: '轻薄平板电脑',
            },
            {
                name: 'Apple Watch Series 9',
                category: '手表',
                price: 3199,
                stock: 60,
                description: '智能手表',
            },
        ];

        for (const product of products) {
            await this.db.run(
                'INSERT INTO products (name, category, price, stock, description) VALUES (?, ?, ?, ?, ?)',
                [
                    product.name,
                    product.category,
                    product.price,
                    product.stock,
                    product.description,
                ]
            );
        }

        console.log('✅ 数据库初始化完成');
    }

    /**
     * 执行查询
     * 注意：在实际应用中，需要做好 SQL 注入防护
     */
    async execute(query) {
        console.log(`\n🗄️ 执行数据库查询: "${query}"`);

        // 解析自然语言查询，转换为 SQL
        // 在实际应用中，可以使用 AI 来生成 SQL 语句
        const sql = this.parseQueryToSQL(query);

        try {
            const results = await this.db.all(sql);
            return {
                query: query,
                sql: sql,
                results: results,
                count: results.length,
            };
        } catch (error) {
            return {
                query: query,
                sql: sql,
                error: error.message,
                results: [],
            };
        }
    }

    /**
     * 将自然语言查询转换为 SQL
     * 简化版本，实际应用中应该更加智能
     */
    parseQueryToSQL(query) {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('所有') || lowerQuery.includes('全部')) {
            return 'SELECT * FROM products';
        }

        if (lowerQuery.includes('手机')) {
            return "SELECT * FROM products WHERE category = '手机'";
        }

        if (lowerQuery.includes('价格') && lowerQuery.includes('最贵')) {
            return 'SELECT * FROM products ORDER BY price DESC LIMIT 1';
        }

        if (lowerQuery.includes('价格') && lowerQuery.includes('最便宜')) {
            return 'SELECT * FROM products ORDER BY price ASC LIMIT 1';
        }

        if (lowerQuery.includes('库存')) {
            return 'SELECT name, stock FROM products WHERE stock > 0 ORDER BY stock DESC';
        }

        // 默认返回所有产品
        return 'SELECT * FROM products';
    }

    formatResults(results) {
        if (results.error) {
            return `❌ 查询出错: ${results.error}`;
        }

        if (results.count === 0) {
            return '没有找到相关产品';
        }

        let formatted = `找到 ${results.count} 个产品:\n\n`;
        results.results.forEach((product, index) => {
            formatted += `${index + 1}. ${product.name}\n`;
            formatted += `   类别: ${product.category}\n`;
            formatted += `   价格: ¥${product.price}\n`;
            formatted += `   库存: ${product.stock} 件\n`;
            if (product.description) {
                formatted += `   描述: ${product.description}\n`;
            }
            formatted += '\n';
        });

        return formatted;
    }

    async close() {
        if (this.db) {
            await this.db.close();
        }
    }
}

/**
 * 工具 3: 天气查询工具
 * 模拟天气 API（实际应用中可集成 OpenWeatherMap、和风天气等）
 */
class WeatherTool {
    constructor() {
        this.name = 'weather_query';
        this.description =
            '查询指定城市的天气信息。可以获取温度、天气状况、湿度等信息。';
    }

    /**
     * 模拟天气 API 调用
     * 在实际应用中，这里应该调用真实的天气 API，例如：
     * - OpenWeatherMap API
     * - 和风天气 API
     * - 心知天气 API
     */
    async execute(city) {
        console.log(`\n🌤️ 查询天气: ${city}`);

        // 模拟 API 延迟
        await new Promise((resolve) => setTimeout(resolve, 800));

        // 模拟天气数据
        const mockWeatherData = {
            北京: { temp: 15, condition: '晴', humidity: 45, wind: '北风 3级' },
            上海: {
                temp: 22,
                condition: '多云',
                humidity: 65,
                wind: '东南风 2级',
            },
            深圳: { temp: 28, condition: '阴', humidity: 75, wind: '南风 1级' },
            杭州: {
                temp: 20,
                condition: '小雨',
                humidity: 80,
                wind: '东风 2级',
            },
        };

        const weather = mockWeatherData[city] || {
            temp: 18,
            condition: '晴',
            humidity: 50,
            wind: '微风',
        };

        return {
            city: city,
            temperature: weather.temp,
            condition: weather.condition,
            humidity: weather.humidity,
            wind: weather.wind,
            timestamp: new Date().toISOString(),
        };
    }

    formatResults(results) {
        return (
            `${results.city}的天气:\n` +
            `🌡️ 温度: ${results.temperature}°C\n` +
            `☁️ 天气: ${results.condition}\n` +
            `💧 湿度: ${results.humidity}%\n` +
            `🌬️ 风力: ${results.wind}`
        );
    }
}

/**
 * 工具 4: 计算器工具
 * 自定义工具示例，执行数学计算
 */
class CalculatorTool {
    constructor() {
        this.name = 'calculator';
        this.description = '执行数学计算。支持加减乘除、幂运算等基本数学运算。';
    }

    async execute(expression) {
        console.log(`\n🧮 执行计算: ${expression}`);

        try {
            // 安全地计算数学表达式
            // 注意：在生产环境中使用 eval 是不安全的，应该使用专门的数学表达式解析库
            // 这里仅作演示用途
            const sanitized = expression.replace(/[^0-9+\-*/.()%\s]/g, '');
            const result = eval(sanitized);

            return {
                expression: expression,
                result: result,
                success: true,
            };
        } catch (error) {
            return {
                expression: expression,
                error: error.message,
                success: false,
            };
        }
    }

    formatResults(results) {
        if (results.success) {
            return `计算结果: ${results.expression} = ${results.result}`;
        } else {
            return `❌ 计算出错: ${results.error}`;
        }
    }
}

// ============ AI Agent 系统 ============

/**
 * AI Agent - 智能工具选择和执行
 */
class AIAgent {
    constructor(tools) {
        this.tools = tools;
        this.conversationHistory = [];
    }

    /**
     * 分析用户查询，决定使用哪个工具
     */
    async analyzeQuery(userQuery) {
        console.log('\n' + '='.repeat(60));
        console.log(`👤 用户查询: ${userQuery}`);
        console.log('='.repeat(60));

        // 构建工具描述
        const toolDescriptions = this.tools
            .map((tool) => `- ${tool.name}: ${tool.description}`)
            .join('\n');

        // 让 AI 决定使用哪个工具
        const systemPrompt = `你是一个智能助手，需要根据用户的问题选择合适的工具。

可用工具：
${toolDescriptions}

请分析用户的问题："${userQuery}"

按以下 JSON 格式回复：
{
    "tool": "工具名称",
    "parameter": "工具参数",
    "reasoning": "选择该工具的理由"
}

如果不需要使用工具，请回复：
{
    "tool": "none",
    "response": "直接回答"
}`;

        try {
            const aiResponse = await this.callDifyAPI(systemPrompt);
            console.log('\n🤖 AI 决策:', aiResponse);

            // 解析 AI 的决策
            const decision = this.parseDecision(aiResponse);
            return decision;
        } catch (error) {
            console.error('AI 分析失败:', error);
            return {
                tool: 'none',
                response: '抱歉，我暂时无法理解你的问题。',
            };
        }
    }

    /**
     * 解析 AI 的决策
     */
    parseDecision(response) {
        try {
            // 尝试从响应中提取 JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('解析决策失败:', error);
        }

        // 如果解析失败，使用简单的关键词匹配
        const lowerResponse = response.toLowerCase();

        if (
            lowerResponse.includes('search') ||
            lowerResponse.includes('搜索')
        ) {
            return { tool: 'web_search', parameter: response };
        }
        if (
            lowerResponse.includes('database') ||
            lowerResponse.includes('数据库')
        ) {
            return { tool: 'database_query', parameter: response };
        }
        if (
            lowerResponse.includes('weather') ||
            lowerResponse.includes('天气')
        ) {
            return { tool: 'weather_query', parameter: response };
        }
        if (
            lowerResponse.includes('calculator') ||
            lowerResponse.includes('计算')
        ) {
            return { tool: 'calculator', parameter: response };
        }

        return { tool: 'none', response: response };
    }

    /**
     * 执行工具
     */
    async executeTool(toolName, parameter) {
        const tool = this.tools.find((t) => t.name === toolName);

        if (!tool) {
            return `❌ 工具 "${toolName}" 不存在`;
        }

        try {
            const result = await tool.execute(parameter);
            return tool.formatResults(result);
        } catch (error) {
            return `❌ 执行工具时出错: ${error.message}`;
        }
    }

    /**
     * 生成最终回复
     */
    async generateFinalResponse(userQuery, toolResult) {
        const prompt = `用户问题: ${userQuery}

工具返回的信息:
${toolResult}

请根据上述信息，用自然、友好的语言回答用户的问题。`;

        try {
            const response = await this.callDifyAPI(prompt);
            return response;
        } catch (error) {
            console.error('生成回复失败:', error);
            return toolResult; // 如果 AI 调用失败，直接返回工具结果
        }
    }

    /**
     * 处理用户查询的主流程
     */
    async process(userQuery) {
        // 1. 分析查询，决定使用哪个工具
        const decision = await this.analyzeQuery(userQuery);

        // 2. 如果不需要工具，直接返回
        if (decision.tool === 'none') {
            console.log('\n✅ 直接回复（无需工具）');
            return decision.response;
        }

        // 3. 执行工具
        console.log(`\n⚙️ 使用工具: ${decision.tool}`);
        if (decision.reasoning) {
            console.log(`💡 选择理由: ${decision.reasoning}`);
        }

        const toolResult = await this.executeTool(
            decision.tool,
            decision.parameter
        );
        console.log('\n📊 工具结果:');
        console.log(toolResult);

        // 4. 基于工具结果生成最终回复
        console.log('\n🤔 生成最终回复...');
        const finalResponse = await this.generateFinalResponse(
            userQuery,
            toolResult
        );

        return finalResponse;
    }

    /**
     * 调用 Dify API
     */
    async callDifyAPI(prompt) {
        const requestBody = {
            inputs: { query: prompt },
            response_mode: 'blocking',
            user: process.env.DIFY_USER || 'agent-demo-user',
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
            throw new Error(
                `API 调用失败: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        return data.answer || data.text || JSON.stringify(data);
    }
}

// ============ 主程序 ============

async function main() {
    console.log('🚀 AI Agent 集成外部工具示例\n');

    // 1. 初始化所有工具
    console.log('📦 初始化工具...');
    const searchTool = new WebSearchTool();
    const weatherTool = new WeatherTool();
    const calculatorTool = new CalculatorTool();
    const databaseTool = new DatabaseTool();
    await databaseTool.initialize();

    const tools = [searchTool, databaseTool, weatherTool, calculatorTool];
    console.log(`✅ 已加载 ${tools.length} 个工具\n`);

    // 2. 创建 AI Agent
    const agent = new AIAgent(tools);

    // 3. 测试不同类型的查询
    const testQueries = [
        '帮我搜索一下最新的 AI 发展趋势',
        '北京今天天气怎么样？',
        '帮我查询数据库中所有的手机产品',
        '计算 (15 + 27) * 3 等于多少？',
        '你好，请介绍一下你自己',
    ];

    for (const query of testQueries) {
        console.log('\n' + '═'.repeat(70));
        const response = await agent.process(query);
        console.log('\n💬 最终回复:');
        console.log(response);
        console.log('═'.repeat(70));

        // 等待一下，避免 API 频率限制
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // 4. 清理资源
    await databaseTool.close();
    console.log('\n\n✨ 演示完成！');
}

// ============ 交互式模式 ============

/**
 * 交互式聊天模式
 * 运行: node 集成外部工具.js --interactive
 */
async function interactiveMode() {
    const { default: readline } = await import('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // 初始化工具
    console.log('📦 初始化工具...');
    const searchTool = new WebSearchTool();
    const weatherTool = new WeatherTool();
    const calculatorTool = new CalculatorTool();
    const databaseTool = new DatabaseTool();
    await databaseTool.initialize();

    const tools = [searchTool, databaseTool, weatherTool, calculatorTool];
    const agent = new AIAgent(tools);

    console.log('\n✅ AI Agent 已就绪！');
    console.log('\n可用工具:');
    tools.forEach((tool) => {
        console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log('\n输入 "exit" 或 "quit" 退出\n');

    const askQuestion = () => {
        rl.question('👤 你: ', async (query) => {
            if (
                query.toLowerCase() === 'exit' ||
                query.toLowerCase() === 'quit'
            ) {
                await databaseTool.close();
                console.log('\n👋 再见！');
                rl.close();
                return;
            }

            if (!query.trim()) {
                askQuestion();
                return;
            }

            try {
                const response = await agent.process(query);
                console.log('\n🤖 AI:', response, '\n');
            } catch (error) {
                console.error('\n❌ 出错了:', error.message, '\n');
            }

            askQuestion();
        });
    };

    askQuestion();
}

// 运行
if (process.argv.includes('--interactive')) {
    interactiveMode().catch(console.error);
} else {
    main().catch(console.error);
}
