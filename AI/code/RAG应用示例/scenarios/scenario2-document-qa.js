import { RAGApplication } from '../rag.js';
import { loadDocumentsFromDir } from '../utils/documentLoader.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 场景2：文档问答系统
 *
 * 这个场景演示如何从文件系统加载文档并构建文档问答系统
 * 支持从指定目录加载多个文档文件
 */

async function main() {
    console.log('📄 场景2：文档问答系统\n');

    // 创建 RAG 应用实例
    const rag = new RAGApplication({
        chunkSize: 500,
        chunkOverlap: 50,
        topK: 3,
        storagePath: path.join(__dirname, '../data/documentQA.json'),
    });

    // 从示例文档目录加载文档（如果存在）
    const docsDir = path.join(__dirname, '../data/documents');

    try {
        const documents = await loadDocumentsFromDir(docsDir, ['.txt', '.md']);

        if (documents.length === 0) {
            console.log('⚠️  未找到文档文件，使用示例文档...');
            // 创建示例文档
            await createSampleDocuments(docsDir);
            const sampleDocs = await loadDocumentsFromDir(docsDir, [
                '.txt',
                '.md',
            ]);
            await rag.initialize(sampleDocs);
        } else {
            await rag.initialize(documents);
        }
    } catch (error) {
        console.log('⚠️  文档目录不存在，使用示例文档...');
        // 创建示例文档
        await createSampleDocuments(docsDir);
        const sampleDocs = await loadDocumentsFromDir(docsDir, ['.txt', '.md']);
        await rag.initialize(sampleDocs);
    }

    // 交互式问答（示例）
    const questions = [
        '文档的主要内容是什么？',
        '有哪些重要的概念？',
        '请总结一下关键点',
    ];

    for (const question of questions) {
        const result = await rag.ask(question);

        console.log(`\n💡 AI 回答:`);
        console.log(result.answer);
        console.log(`\n📚 参考来源:`);
        result.sources.forEach((source, index) => {
            console.log(
                `  ${index + 1}. [${source.metadata.source}] (相似度: ${(
                    source.score * 100
                ).toFixed(2)}%)`
            );
        });

        console.log('\n' + '-'.repeat(60) + '\n');
    }
}

/**
 * 创建示例文档
 */
async function createSampleDocuments(docsDir) {
    const fs = await import('fs/promises');
    await fs.mkdir(docsDir, { recursive: true });

    const sampleDocs = [
        {
            name: 'AI基础.md',
            content: `# AI 基础概念

## 什么是人工智能
人工智能（AI）是计算机科学的一个分支，旨在创建能够执行通常需要人类智能的任务的系统。

## 机器学习
机器学习是 AI 的一个子集，它使计算机能够从数据中学习，而无需明确编程。

## 深度学习
深度学习是机器学习的一个子集，使用神经网络来模拟人脑的工作方式。

## 自然语言处理
自然语言处理（NLP）是 AI 的一个分支，专注于计算机与人类语言之间的交互。
`,
        },
        {
            name: 'RAG技术.txt',
            content: `RAG（检索增强生成）技术

RAG 是一种结合了信息检索和文本生成的技术。它通过以下步骤工作：

1. 文档加载：从各种来源加载文档
2. 文档分割：将长文档分割成小块
3. 向量化：将文档块转换为向量表示
4. 存储：将向量存储到向量数据库
5. 检索：根据用户查询检索相关文档
6. 生成：将检索到的上下文与查询一起发送给 LLM 生成回答

RAG 的优势：
- 可以提供基于实际文档的准确回答
- 减少幻觉问题
- 可以引用来源
- 支持知识更新
`,
        },
    ];

    for (const doc of sampleDocs) {
        const filePath = path.join(docsDir, doc.name);
        await fs.writeFile(filePath, doc.content, 'utf-8');
    }

    console.log(`✅ 创建了 ${sampleDocs.length} 个示例文档`);
}

main().catch(console.error);
