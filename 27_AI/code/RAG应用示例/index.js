import dotenv from 'dotenv';
dotenv.config();

/**
 * RAG 应用示例主入口
 *
 * 运行方式：
 * node index.js --scenario=1  # 运行场景1：知识库问答
 * node index.js --scenario=2  # 运行场景2：文档问答
 * node index.js --scenario=3  # 运行场景3：交互式问答
 */

const scenario =
    process.argv.find((arg) => arg.startsWith('--scenario='))?.split('=')[1] ||
    '1';

async function main() {
    switch (scenario) {
        case '1':
            console.log('🎯 运行场景1：知识库问答系统\n');
            const { default: scenario1 } = await import(
                './scenarios/scenario1-knowledge-base.js'
            );
            break;

        case '2':
            console.log('🎯 运行场景2：文档问答系统\n');
            const { default: scenario2 } = await import(
                './scenarios/scenario2-document-qa.js'
            );
            break;

        case '3':
            console.log('🎯 运行场景3：交互式问答系统\n');
            const { default: scenario3 } = await import(
                './scenarios/scenario3-interactive-qa.js'
            );
            break;

        default:
            console.log('❌ 未知场景，请使用 --scenario=1/2/3');
            console.log('\n可用场景:');
            console.log('  1 - 知识库问答系统');
            console.log('  2 - 文档问答系统');
            console.log('  3 - 交互式问答系统');
    }
}

main().catch(console.error);
