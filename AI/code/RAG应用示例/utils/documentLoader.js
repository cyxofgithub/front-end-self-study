import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 文档加载器
 * 负责从文件系统加载文档并分割成小块
 */

/**
 * 文本分割器
 * 将长文本按照指定大小和重叠分割成多个块
 * @param {string} text - 要分割的文本
 * @param {number} chunkSize - 每个块的大小（字符数）
 * @param {number} overlap - 块之间的重叠大小（字符数）
 * @returns {Array<{text: string, index: number, start: number, end: number}>} 分割后的文本块
 */
export function splitText(text, chunkSize = 500, overlap = 50) {
    // 如果文本为空或太短，直接返回
    if (!text || text.length === 0) {
        return [];
    }

    // 确保 chunkSize 和 overlap 是合理的值
    chunkSize = Math.max(100, chunkSize); // 最小 100 字符
    overlap = Math.min(overlap, chunkSize / 2); // overlap 不能超过 chunkSize 的一半

    const chunks = [];
    let index = 0;
    let start = 0;
    const textLength = text.length;

    while (start < textLength) {
        const end = Math.min(start + chunkSize, textLength);
        // 使用 slice 而不是 substring，性能更好
        const chunkText = text.slice(start, end).trim();

        // 只有当 chunk 不为空时才添加
        if (chunkText.length > 0) {
            chunks.push({
                text: chunkText,
                index: index++,
                start: start,
                end: end,
            });
        }

        // 移动到下一个块的起始位置（考虑重叠）
        // 确保不会无限循环
        const nextStart = end - overlap;
        if (nextStart <= start) {
            start = end;
        } else {
            start = nextStart;
        }

        // 安全检查：防止无限循环
        if (chunks.length > 100000) {
            console.warn('⚠️  警告: 文档块数量过多，可能存在问题');
            break;
        }
    }

    return chunks;
}

/**
 * 从文件加载文档
 * @param {string} filePath - 文件路径
 * @returns {Promise<string>} 文件内容
 */
export async function loadDocument(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
    } catch (error) {
        console.error(`加载文档失败: ${filePath}`, error);
        throw error;
    }
}

/**
 * 从目录加载所有文档
 * @param {string} dirPath - 目录路径
 * @param {Array<string>} extensions - 文件扩展名列表，如 ['.txt', '.md']
 * @param {number} maxFileSizeMB - 最大文件大小（MB），超过此大小的文件将被跳过
 * @returns {Promise<Array<{path: string, content: string}>>} 文档列表
 */
export async function loadDocumentsFromDir(
    dirPath,
    extensions = ['.txt', '.md', '.js'],
    maxFileSizeMB = 50
) {
    const documents = [];
    const files = await fs.readdir(dirPath);
    const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const ext = path.extname(file);

        if (extensions.includes(ext)) {
            try {
                // 检查文件大小
                const stats = await fs.stat(filePath);
                if (stats.size > maxFileSizeBytes) {
                    console.warn(
                        `跳过大文件 ${file} (${(
                            stats.size /
                            1024 /
                            1024
                        ).toFixed(2)} MB，超过限制 ${maxFileSizeMB} MB)`
                    );
                    continue;
                }

                const content = await loadDocument(filePath);
                documents.push({
                    path: filePath,
                    content: content,
                    name: file,
                });
            } catch (error) {
                console.warn(`跳过文件 ${file}:`, error.message);
            }
        }
    }

    return documents;
}

/**
 * 处理文档：加载并分割
 * @param {string|Array} source - 文件路径或文档内容数组
 * @param {number} chunkSize - 块大小
 * @param {number} overlap - 重叠大小
 * @returns {Promise<Array<{text: string, metadata: object}>>} 处理后的文档块
 */
export async function processDocuments(source, chunkSize = 500, overlap = 50) {
    let documents = [];

    // 如果 source 是字符串，当作文件路径处理
    if (typeof source === 'string') {
        const content = await loadDocument(source);
        documents = [{ path: source, content, name: path.basename(source) }];
    }
    // 如果 source 是数组，直接使用
    else if (Array.isArray(source)) {
        documents = source;
    }

    // 分割所有文档，优化内存使用
    const chunks = [];
    for (const doc of documents) {
        // 检查文档内容大小，避免处理过大的文档
        const contentSizeMB = (doc.content?.length || 0) / (1024 * 1024);
        if (contentSizeMB > 100) {
            console.warn(
                `⚠️  跳过超大文档 ${
                    doc.name || doc.path
                } (${contentSizeMB.toFixed(2)} MB)`
            );
            continue;
        }

        const textChunks = splitText(doc.content, chunkSize, overlap);

        // 直接创建最终格式的 chunk，避免中间对象
        for (let i = 0; i < textChunks.length; i++) {
            const chunk = textChunks[i];
            chunks.push({
                text: chunk.text,
                metadata: {
                    source: doc.path || doc.name || 'unknown',
                    chunkIndex: chunk.index,
                    start: chunk.start,
                    end: chunk.end,
                },
            });
        }

        // 清理临时变量
        textChunks.length = 0;
    }

    return chunks;
}
