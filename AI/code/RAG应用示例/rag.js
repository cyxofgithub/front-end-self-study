import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { processDocuments, loadDocument } from './utils/documentLoader.js';
import { VectorStore } from './utils/vectorStore.js';
import { callDifyAPI } from '../utils/apiClient.js';

/**
 * RAG（检索增强生成）应用
 *
 * RAG 工作流程：
 * 1. 文档加载与分割：将文档分割成小块
 * 2. 向量化：将文档块转换为向量
 * 3. 存储：将向量存储到向量数据库
 * 4. 检索：根据用户查询检索相关文档块
 * 5. 增强生成：将检索到的上下文与用户查询一起发送给 LLM 生成回答
 */

export class RAGApplication {
    constructor(options = {}) {
        this.vectorStore = new VectorStore(options.storagePath);
        this.chunkSize = options.chunkSize || 500;
        this.chunkOverlap = options.chunkOverlap || 50;
        this.topK = options.topK || 3; // 检索前 K 个相关文档
    }

    /**
     * 初始化 RAG 应用：加载文档并构建向量存储
     * @param {string|Array} documents - 文档路径或文档内容数组
     * @param {Object} options - 初始化选项
     * @param {number} options.batchSize - 批处理大小（默认 50，减少内存占用）
     * @param {number} options.saveInterval - 保存间隔（默认 5）
     * @param {number} options.docBatchSize - 文档批处理大小（默认 1，每次处理一个文档）
     */
    async initialize(documents, options = {}) {
        console.log('🚀 初始化 RAG 应用...');

        // 尝试从文件加载已有的向量存储
        await this.vectorStore.load();

        // 如果向量存储为空，处理文档
        if (this.vectorStore.vectors.length === 0) {
            console.log('📚 处理文档并构建向量索引...');

            // 使用优化的批处理参数
            const batchSize = options.batchSize || 50; // 减小默认批处理大小
            const saveInterval = options.saveInterval || 5;
            const docBatchSize = options.docBatchSize || 1; // 每次处理一个文档

            // 准备文档列表
            let docList = [];
            if (typeof documents === 'string') {
                // 如果是文件路径，需要先加载
                const content = await loadDocument(documents);
                docList = [
                    {
                        path: documents,
                        content,
                        name: path.basename(documents),
                    },
                ];
            } else if (Array.isArray(documents)) {
                docList = documents;
            }

            // 分批处理文档，避免一次性处理所有文档

            for (let i = 0; i < docList.length; i += docBatchSize) {
                const docBatch = docList.slice(i, i + docBatchSize);
                console.log(
                    `  处理文档 ${i + 1}-${Math.min(
                        i + docBatchSize,
                        docList.length
                    )}/${docList.length}`
                );

                // 处理当前批次的文档
                const chunks = await processDocuments(
                    docBatch,
                    this.chunkSize,
                    this.chunkOverlap
                );

                // 立即添加到向量存储（如果 chunks 不为空）
                if (chunks.length > 0) {
                    await this.vectorStore.addDocuments(
                        chunks,
                        batchSize,
                        saveInterval
                    );
                }

                // 清理临时变量，帮助垃圾回收
                chunks.length = 0;

                // 定期触发垃圾回收（如果可用）
                if ((i + docBatchSize) % 5 === 0 && global.gc) {
                    global.gc();
                }
            }
        } else {
            console.log('✅ 使用已有的向量存储');
        }

        const stats = this.vectorStore.getStats();
        console.log(
            `📊 向量存储统计: ${stats.totalDocuments} 个文档块, ${stats.totalWords} 个唯一词`
        );
    }

    /**
     * 检索相关文档
     * @param {string} query - 用户查询
     * @returns {Array} 相关文档列表
     */
    retrieve(query) {
        console.log(`🔍 检索查询: "${query}"`);
        const results = this.vectorStore.similaritySearch(query, this.topK);

        console.log(`📄 找到 ${results.length} 个相关文档块:`);
        results.forEach((result, index) => {
            console.log(
                `  ${index + 1}. [相似度: ${(result.score * 100).toFixed(
                    2
                )}%] ${result.text.substring(0, 100)}...`
            );
        });

        return results;
    }

    /**
     * 构建增强提示词
     * @param {string} query - 用户查询
     * @param {Array} retrievedDocs - 检索到的文档
     * @returns {string} 增强后的提示词
     */
    buildAugmentedPrompt(query, retrievedDocs) {
        let prompt = `基于以下上下文信息回答问题。如果上下文中没有相关信息，请说明无法从提供的上下文中找到答案。

上下文信息：
`;

        retrievedDocs.forEach((doc, index) => {
            prompt += `\n[文档 ${index + 1}]\n${doc.text}\n`;
        });

        prompt += `\n问题：${query}\n\n请基于上述上下文信息回答问题：`;

        return prompt;
    }

    /**
     * 生成回答
     * @param {string} query - 用户查询
     * @param {Array} conversationHistory - 对话历史
     * @returns {Promise<string>} AI 生成的回答
     */
    async generate(query, conversationHistory = []) {
        // 1. 检索相关文档
        const retrievedDocs = this.retrieve(query);

        // 2. 构建增强提示词
        const augmentedPrompt = this.buildAugmentedPrompt(query, retrievedDocs);

        // 3. 调用 LLM 生成回答
        console.log('🤖 调用 AI 生成回答...');
        const answer = await callDifyAPI(augmentedPrompt, conversationHistory);

        return answer;
    }

    /**
     * 问答接口（完整的 RAG 流程）
     * @param {string} query - 用户查询
     * @param {Array} conversationHistory - 对话历史
     * @returns {Promise<{answer: string, sources: Array}>} 回答和来源
     */
    async ask(query, conversationHistory = []) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`❓ 用户问题: ${query}`);
        console.log(`${'='.repeat(60)}\n`);

        // 检索相关文档
        const retrievedDocs = this.retrieve(query);

        // 生成回答
        const answer = await this.generate(query, conversationHistory);

        // 返回结果
        return {
            answer: answer,
            sources: retrievedDocs.map((doc) => ({
                text: doc.text,
                score: doc.score,
                metadata: doc.metadata,
            })),
        };
    }
}
