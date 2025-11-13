import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 向量存储
 * learn-todo: td-idf算法
 * 使用简单的文本相似度算法（TF-IDF 简化版）来模拟向量检索
 * 在实际生产环境中，应该使用专业的向量数据库（如 Pinecone、Weaviate、Chroma 等）
 */

/**
 * 简单的文本向量化（基于词频）
 * 将文本转换为词频向量
 * @param {string} text - 输入文本
 * @returns {Map<string, number>} 词频映射
 */
function textToVector(text) {
    // 简单的分词和词频统计
    const words = text
        .toLowerCase()
        .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 1);

    const wordFreq = new Map();
    for (const word of words) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }

    return wordFreq;
}

/**
 * 计算两个向量的余弦相似度
 * @param {Map<string, number>} vec1 - 向量1
 * @param {Map<string, number>} vec2 - 向量2
 * @returns {number} 相似度分数（0-1）
 */
function cosineSimilarity(vec1, vec2) {
    const allWords = new Set([...vec1.keys(), ...vec2.keys()]);

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (const word of allWords) {
        const v1 = vec1.get(word) || 0;
        const v2 = vec2.get(word) || 0;

        dotProduct += v1 * v2;
        norm1 += v1 * v1;
        norm2 += v2 * v2;
    }

    if (norm1 === 0 || norm2 === 0) {
        return 0;
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * 向量存储类
 */
export class VectorStore {
    constructor(storagePath = null) {
        this.storagePath =
            storagePath || path.join(__dirname, '../data/vectorStore.json');
        this.vectors = []; // [{text, vector, metadata}, ...]
        this.idfMap = new Map(); // 逆文档频率
    }

    /**
     * 添加文档块到向量存储
     * @param {Array<{text: string, metadata: object}>} chunks - 文档块数组
     * @param {number} batchSize - 批处理大小，避免一次性处理过多数据
     * @param {number} saveInterval - 每处理多少批后保存一次（0 表示只在最后保存）
     */
    async addDocuments(chunks, batchSize = 100, saveInterval = 5) {
        console.log(`📝 添加 ${chunks.length} 个文档块到向量存储...`);

        const totalBatches = Math.ceil(chunks.length / batchSize);

        // 分批处理文档，避免内存溢出
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);
            const batchNum = Math.floor(i / batchSize) + 1;
            console.log(
                `  处理批次 ${batchNum}/${totalBatches} (${batch.length} 个文档块)`
            );

            // 计算当前批次的向量
            for (const chunk of batch) {
                const vector = textToVector(chunk.text);
                this.vectors.push({
                    text: chunk.text,
                    vector: vector,
                    metadata: chunk.metadata,
                });
            }

            // 定期更新 IDF 和保存（避免每次都保存，提高性能）
            const shouldSave =
                (saveInterval > 0 && batchNum % saveInterval === 0) ||
                batchNum === totalBatches;

            if (shouldSave) {
                this._updateIDF();
                await this.save();
                console.log(`  💾 已保存进度 (${batchNum}/${totalBatches})`);
            }

            // 定期触发垃圾回收（如果可用）
            if (batchNum % 10 === 0 && global.gc) {
                global.gc();
            }
        }

        // 确保最后更新一次 IDF（如果之前没有更新）
        this._updateIDF();
        console.log(`✅ 成功添加 ${chunks.length} 个文档块`);
    }

    /**
     * 更新逆文档频率（IDF）
     */
    _updateIDF() {
        const totalDocs = this.vectors.length;
        const wordDocCount = new Map();

        // 统计每个词出现在多少个文档中
        for (const doc of this.vectors) {
            const words = new Set(doc.vector.keys());
            for (const word of words) {
                wordDocCount.set(word, (wordDocCount.get(word) || 0) + 1);
            }
        }

        // 计算 IDF
        for (const [word, count] of wordDocCount.entries()) {
            this.idfMap.set(word, Math.log(totalDocs / count));
        }
    }

    /**
     * 相似度搜索
     * @param {string} query - 查询文本
     * @param {number} topK - 返回前 K 个最相似的结果
     * @returns {Array<{text: string, score: number, metadata: object}>} 相似文档列表
     */
    similaritySearch(query, topK = 3) {
        const queryVector = textToVector(query);

        // 计算与所有文档的相似度
        const results = this.vectors.map((doc) => {
            // 应用 TF-IDF 权重
            const weightedQueryVec = new Map();
            const weightedDocVec = new Map();

            for (const [word, freq] of queryVector.entries()) {
                const idf = this.idfMap.get(word) || 0;
                weightedQueryVec.set(word, freq * idf);
            }

            for (const [word, freq] of doc.vector.entries()) {
                const idf = this.idfMap.get(word) || 0;
                weightedDocVec.set(word, freq * idf);
            }

            const score = cosineSimilarity(weightedQueryVec, weightedDocVec);

            return {
                text: doc.text,
                score: score,
                metadata: doc.metadata,
            };
        });

        // 按相似度排序并返回前 K 个
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, topK);
    }

    /**
     * 保存向量存储到文件
     * 使用分批序列化优化大文件保存，避免内存溢出
     */
    async save() {
        try {
            const dir = path.dirname(this.storagePath);
            await fs.mkdir(dir, { recursive: true });

            // 直接构建序列化数组，避免中间对象
            const serializedVectors = [];
            const totalVectors = this.vectors.length;

            // 分批处理，避免一次性处理所有向量
            const batchSize = 500;
            for (let i = 0; i < totalVectors; i += batchSize) {
                const batch = this.vectors.slice(
                    i,
                    Math.min(i + batchSize, totalVectors)
                );
                for (const v of batch) {
                    serializedVectors.push({
                        text: v.text,
                        metadata: v.metadata,
                        // 将 Map 转换为对象以便序列化
                        vector: Object.fromEntries(v.vector),
                    });
                }

                // 定期触发垃圾回收（如果可用）
                if (i % (batchSize * 10) === 0 && global.gc) {
                    global.gc();
                }
            }

            const data = {
                vectors: serializedVectors,
                idfMap: Object.fromEntries(this.idfMap),
            };

            // 使用紧凑格式而不是格式化，减少文件大小
            const jsonString = JSON.stringify(data);

            // 写入文件
            await fs.writeFile(this.storagePath, jsonString, 'utf-8');

            // 清理临时变量
            serializedVectors.length = 0;
        } catch (error) {
            console.error('保存向量存储失败:', error);
            throw error;
        }
    }

    /**
     * 从文件加载向量存储
     * 优化大文件加载，使用流式处理
     */
    async load() {
        try {
            const stats = await fs.stat(this.storagePath);
            const fileSizeMB = stats.size / (1024 * 1024);

            if (fileSizeMB > 100) {
                console.log(
                    `⚠️  警告: 向量存储文件较大 (${fileSizeMB.toFixed(
                        2
                    )} MB)，加载可能需要一些时间...`
                );
            }

            const data = await fs.readFile(this.storagePath, 'utf-8');
            const parsed = JSON.parse(data);

            // 分批处理向量，避免一次性创建太多 Map 对象
            const batchSize = 1000;
            this.vectors = [];

            for (let i = 0; i < parsed.vectors.length; i += batchSize) {
                const batch = parsed.vectors.slice(i, i + batchSize);
                const processedBatch = batch.map((v) => ({
                    text: v.text,
                    metadata: v.metadata,
                    vector: new Map(Object.entries(v.vector || {})),
                }));
                this.vectors.push(...processedBatch);

                // 定期触发垃圾回收（如果可用）
                if (i % (batchSize * 10) === 0 && global.gc) {
                    global.gc();
                }
            }

            this.idfMap = new Map(Object.entries(parsed.idfMap || {}));
            console.log(`✅ 从文件加载了 ${this.vectors.length} 个向量`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('📝 向量存储文件不存在，将创建新的存储');
            } else {
                console.error('加载向量存储失败:', error);
                // 如果加载失败，清空现有数据
                this.vectors = [];
                this.idfMap = new Map();
            }
        }
    }

    /**
     * 清空向量存储
     */
    clear() {
        this.vectors = [];
        this.idfMap = new Map();
    }

    /**
     * 获取存储统计信息
     */
    getStats() {
        return {
            totalDocuments: this.vectors.length,
            totalWords: this.idfMap.size,
        };
    }
}
