/**
 * MySQL 持久化模块
 * 用于将 Yjs 文档状态保存到 MySQL 数据库
 */

const mysql = require('mysql2/promise');
const Y = require('yjs');

const PREVIEW_LIMIT = 2000;

class MySQLPersistence {
    /**
     * @param {Object} config - MySQL 连接配置
     * @param {string} config.host - 数据库主机
     * @param {number} config.port - 数据库端口
     * @param {string} config.user - 数据库用户名
     * @param {string} config.password - 数据库密码
     * @param {string} config.database - 数据库名称
     * @param {string} config.tableName - 表名（默认: yjs_documents）
     */
    constructor(config) {
        this.config = {
            host: config.host || 'localhost',
            port: config.port || 3306,
            user: config.user || 'root',
            password: config.password || '',
            database: config.database || 'yjs_db',
            tableName: config.tableName || 'yjs_documents',
            ...config,
        };
        this.pool = null;
        this.initialized = false;
        // 存储每个文档的防抖定时器
        this.updateTimeouts = new Map();
    }

    /**
     * 初始化数据库连接和表结构
     */
    async initialize() {
        if (this.initialized) {
            return;
        }

        try {
            // 创建连接池
            this.pool = mysql.createPool({
                host: this.config.host,
                port: this.config.port,
                user: this.config.user,
                password: this.config.password,
                database: this.config.database,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            });

            // 确保表存在
            await this.createTableIfNotExists();

            this.initialized = true;
            console.log('✅ MySQL 持久化模块初始化成功');
        } catch (error) {
            console.error('❌ MySQL 持久化模块初始化失败:', error);
            throw error;
        }
    }

    /**
     * 创建表（如果不存在）
     */
    async createTableIfNotExists() {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS \`${this.config.tableName}\` (
                \`doc_name\` VARCHAR(255) NOT NULL,
                \`update_data\` LONGBLOB NOT NULL,
                \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (\`doc_name\`),
                INDEX \`idx_updated_at\` (\`updated_at\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;

        await this.pool.execute(createTableSQL);
        console.log(`✅ 表 ${this.config.tableName} 已就绪`);
    }

    /**
     * 获取文档的完整状态（合并所有更新）
     * @param {string} docName - 文档名称
     * @returns {Promise<Uint8Array|null>} 文档状态更新数据
     */
    async getYDoc(docName) {
        try {
            const [rows] = await this.pool.execute(
                `SELECT update_data FROM \`${this.config.tableName}\` WHERE doc_name = ?`,
                [docName]
            );

            if (rows.length === 0) {
                return null;
            }

            return rows[0].update_data;
        } catch (error) {
            console.error(`获取文档 ${docName} 失败:`, error);
            return null;
        }
    }

    /**
     * 存储文档更新
     * @param {string} docName - 文档名称
     * @param {Uint8Array} update - 文档更新数据
     */
    async storeUpdate(docName, update) {
        const decodedProsemirror = this.decodeProsemirrorFragment(update);
        const decodedPreview = this.toPreview(decodedProsemirror);
        console.log('[Yjs] 持久化写入前数据结构', {
            归属: 'Yjs',
            存储字段: 'update_data (LONGBLOB)',
            docName,
            updateLength: update?.length ?? 0,
            解码预览: {
                归属: 'Yjs->ProseMirror',
                decodedProsemirrorPreview: decodedPreview,
            },
        });
        try {
            // 使用 INSERT ... ON DUPLICATE KEY UPDATE 来更新或插入
            await this.pool.execute(
                `INSERT INTO \`${this.config.tableName}\` (doc_name, update_data) 
                 VALUES (?, ?) 
                 ON DUPLICATE KEY UPDATE 
                 update_data = VALUES(update_data),
                 updated_at = CURRENT_TIMESTAMP`,
                [docName, update]
            );
            console.log('[Yjs] 持久化写入后摘要', {
                归属: 'Yjs',
                docName,
                updateLength: update?.length ?? 0,
                writtenAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error(`存储文档 ${docName} 更新失败:`, error);
            throw error;
        }
    }

    decodeProsemirrorFragment(updateData) {
        try {
            if (!updateData) {
                return null;
            }
            const decodedDoc = new Y.Doc();
            Y.applyUpdate(decodedDoc, updateData);
            return decodedDoc.getXmlFragment('prosemirror').toJSON();
        } catch (error) {
            return {
                error: 'decode_failed',
                reason: error?.message || String(error),
            };
        }
    }

    toPreview(value) {
        if (value == null) {
            return value;
        }
        const json = JSON.stringify(value);
        if (json.length <= PREVIEW_LIMIT) {
            return value;
        }
        return {
            truncated: true,
            preview: json.slice(0, PREVIEW_LIMIT),
            totalChars: json.length,
        };
    }

    /**
     * 绑定文档状态（从数据库加载并监听更新）
     * @param {string} docName - 文档名称
     * @param {Y.Doc} ydoc - Yjs 文档实例
     */
    async bindState(docName, ydoc) {
        try {
            // 从数据库加载文档状态
            const persistedState = await this.getYDoc(docName);

            if (persistedState) {
                // 应用持久化的状态到文档
                Y.applyUpdate(ydoc, persistedState);
                console.log(
                    `📄 已从数据库加载文档: ${docName}`,
                    (() => {
                        try {
                            const decodedDoc = new Y.Doc();
                            Y.applyUpdate(decodedDoc, persistedState);
                            return this.toPreview(
                                decodedDoc
                                    .getXmlFragment('prosemirror')
                                    .toJSON()
                            );
                        } catch (e) {
                            return '[文档内容解析失败]';
                        }
                    })()
                );
            } else {
                console.log(`📄 创建新文档: ${docName}`);
            }

            // 监听文档更新，保存到数据库
            const updateHandler = async (update, origin) => {
                try {
                    // 获取文档的完整状态（而不是增量更新）
                    // 这样可以确保数据库存储的是完整状态
                    const fullState = Y.encodeStateAsUpdate(ydoc);
                    await this.storeUpdate(docName, fullState);
                } catch (error) {
                    console.error(`保存文档 ${docName} 更新时出错:`, error);
                }
            };

            // 使用防抖来减少数据库写入频率
            const debouncedUpdateHandler = (update, origin) => {
                // 清除之前的定时器
                const existingTimeout = this.updateTimeouts.get(docName);
                if (existingTimeout) {
                    clearTimeout(existingTimeout);
                }

                // 设置新的定时器
                const timeout = setTimeout(async () => {
                    await updateHandler(update, origin);
                    this.updateTimeouts.delete(docName);
                }, 1000); // 1秒防抖

                this.updateTimeouts.set(docName, timeout);
            };

            ydoc.on('update', debouncedUpdateHandler);

            // 初始保存
            const initialState = Y.encodeStateAsUpdate(ydoc);
            if (initialState.length > 0) {
                await this.storeUpdate(docName, initialState);
            }
        } catch (error) {
            console.error(`绑定文档 ${docName} 状态失败:`, error);
            throw error;
        }
    }

    /**
     * 写入文档状态（可选方法）
     * @param {string} docName - 文档名称
     * @param {Y.Doc} ydoc - Yjs 文档实例
     */
    async writeState(docName, ydoc) {
        try {
            const state = Y.encodeStateAsUpdate(ydoc);
            await this.storeUpdate(docName, state);
        } catch (error) {
            console.error(`写入文档 ${docName} 状态失败:`, error);
            throw error;
        }
    }

    /**
     * 删除文档
     * @param {string} docName - 文档名称
     */
    async deleteDoc(docName) {
        try {
            await this.pool.execute(
                `DELETE FROM \`${this.config.tableName}\` WHERE doc_name = ?`,
                [docName]
            );
            console.log(`🗑️  已删除文档: ${docName}`);
        } catch (error) {
            console.error(`删除文档 ${docName} 失败:`, error);
            throw error;
        }
    }

    /**
     * 关闭数据库连接
     */
    async close() {
        // 清除所有待处理的定时器
        for (const [docName, timeout] of this.updateTimeouts) {
            clearTimeout(timeout);
        }
        this.updateTimeouts.clear();

        if (this.pool) {
            await this.pool.end();
            this.initialized = false;
            console.log('✅ MySQL 连接已关闭');
        }
    }
}

module.exports = MySQLPersistence;
