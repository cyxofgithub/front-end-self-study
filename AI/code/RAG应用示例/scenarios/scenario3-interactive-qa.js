import { RAGApplication } from '../rag.js';
import readline from 'readline';

/**
 * 场景3：交互式问答系统
 *
 * 这个场景演示如何构建一个交互式的 RAG 问答系统
 * 用户可以通过命令行与系统交互
 */

// 创建示例知识库
const knowledgeBase = [
    {
        name: '前端开发指南',
        content: `
前端开发是现代 Web 开发的重要组成部分。

HTML（超文本标记语言）是网页的结构骨架，定义了网页的内容和结构。

CSS（层叠样式表）用于控制网页的外观和布局，包括颜色、字体、间距等。

JavaScript 是网页的交互语言，用于实现动态效果和用户交互。

现代前端框架如 React、Vue、Angular 提供了组件化开发方式，提高了代码的可维护性和复用性。

响应式设计确保网页在不同设备上都能良好显示。

性能优化包括代码分割、懒加载、缓存策略等。
        `.trim(),
    },
    {
        name: '后端开发指南',
        content: `
后端开发负责服务器端逻辑和数据处理。

RESTful API 是一种设计 Web API 的架构风格，使用 HTTP 方法（GET、POST、PUT、DELETE）进行操作。

数据库设计需要考虑数据关系、索引、查询性能等因素。

身份认证和授权是后端安全的重要组成部分。

微服务架构将应用拆分为多个独立的服务，提高了可扩展性和可维护性。

缓存策略可以显著提高应用性能，常用的缓存方案包括 Redis、Memcached 等。

日志和监控对于生产环境的运维至关重要。
        `.trim(),
    },
    {
        name: 'DevOps 指南',
        content: `
DevOps 是开发和运维的结合，旨在提高软件交付效率。

CI/CD（持续集成/持续部署）自动化了代码测试和部署流程。

容器化技术如 Docker 提供了应用隔离和一致性环境。

容器编排工具如 Kubernetes 管理大规模容器部署。

基础设施即代码（IaC）使用代码来管理和配置基础设施。

监控和日志收集工具帮助识别和解决问题。

自动化测试包括单元测试、集成测试、端到端测试等。
        `.trim(),
    },
];

async function main() {
    console.log('💬 场景3：交互式问答系统\n');
    console.log('输入 "exit" 或 "quit" 退出\n');

    // 创建 RAG 应用实例
    const rag = new RAGApplication({
        chunkSize: 500,
        chunkOverlap: 50,
        topK: 3,
    });

    // 初始化知识库
    console.log('📚 正在初始化知识库...');
    await rag.initialize(knowledgeBase);
    console.log('✅ 知识库初始化完成！\n');

    // 创建交互式命令行界面
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // 对话历史
    const conversationHistory = [];

    // 提示用户输入
    const askQuestion = () => {
        rl.question('❓ 请输入您的问题: ', async (query) => {
            if (
                query.toLowerCase() === 'exit' ||
                query.toLowerCase() === 'quit'
            ) {
                console.log('\n👋 再见！');
                rl.close();
                return;
            }

            if (query.trim() === '') {
                askQuestion();
                return;
            }

            try {
                // 使用 RAG 回答问题
                const result = await rag.ask(query, conversationHistory);

                // 更新对话历史
                conversationHistory.push({ role: 'user', content: query });
                conversationHistory.push({
                    role: 'assistant',
                    content: result.answer,
                });

                console.log(`\n💡 AI 回答:\n${result.answer}\n`);

                if (result.sources.length > 0) {
                    console.log('📚 参考来源:');
                    result.sources.forEach((source, index) => {
                        console.log(
                            `  ${index + 1}. [${
                                source.metadata.source
                            }] (相似度: ${(source.score * 100).toFixed(2)}%)`
                        );
                    });
                    console.log('');
                }
            } catch (error) {
                console.error('❌ 发生错误:', error.message);
            }

            // 继续提问
            askQuestion();
        });
    };

    askQuestion();
}

main().catch(console.error);
