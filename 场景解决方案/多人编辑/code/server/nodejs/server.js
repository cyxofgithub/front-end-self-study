/**
 * Yjs WebSocket 服务器
 * 用于多个客户端之间的文档同步
 * 支持 MySQL 数据库持久化
 */

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const { setupWSConnection, setPersistence } = require('y-websocket/bin/utils');
const MySQLPersistence = require('./mysql-persistence');

const app = express();
const server = http.createServer(app);

// 提供静态文件服务（指向 client 目录）
const path = require('path');
const clientDir = path.join(__dirname, '../../client');
app.use(express.static(clientDir));

// ==================== MySQL 持久化配置 ====================
// 从环境变量读取数据库配置，如果没有则使用默认值
const mysqlConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'cyx@123456',
    database: process.env.MYSQL_DATABASE || 'yjs_db',
    tableName: process.env.MYSQL_TABLE_NAME || 'yjs_documents',
};

// 初始化 MySQL 持久化
let mysqlPersistence = null;

async function initializePersistence() {
    try {
        mysqlPersistence = new MySQLPersistence(mysqlConfig);
        await mysqlPersistence.initialize();

        // 设置持久化层到 y-websocket
        setPersistence({
            bindState: async (docName, ydoc) => {
                await mysqlPersistence.bindState(docName, ydoc);
            },
            writeState: async (docName, ydoc) => {
                await mysqlPersistence.writeState(docName, ydoc);
            },
            provider: mysqlPersistence,
        });

        console.log('✅ MySQL 持久化已启用');
    } catch (error) {
        console.error('❌ MySQL 持久化初始化失败:', error.message);
        console.warn('⚠️  服务器将在无持久化模式下运行（数据仅存储在内存中）');
        console.warn('   请检查数据库配置或运行 init-db.sql 初始化数据库');
    }
}

// 启动时初始化持久化
initializePersistence();

// ==================== WebSocket 服务器 ====================
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    console.log('新的客户端连接:', req.socket.remoteAddress);

    // 设置 Yjs WebSocket 连接
    setupWSConnection(ws, req, {
        // 文档名称（可以从 URL 参数中获取）
        docName: req.url.slice(1).split('?')[0] || 'default-doc',
        // 垃圾回收配置
        gc: true,
    });

    ws.on('close', () => {
        console.log('客户端断开连接');
    });

    ws.on('error', (error) => {
        console.error('WebSocket 错误:', error);
    });
});

// ==================== 优雅关闭 ====================
process.on('SIGINT', async () => {
    console.log('\n正在关闭服务器...');
    if (mysqlPersistence) {
        await mysqlPersistence.close();
    }
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});

process.on('SIGTERM', async () => {
    console.log('\n正在关闭服务器...');
    if (mysqlPersistence) {
        await mysqlPersistence.close();
    }
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`WebSocket 服务器运行在 ws://localhost:${PORT}`);
    console.log(
        `\n打开多个浏览器标签页访问 http://localhost:${PORT} 来测试多人协同编辑`
    );
    console.log('\n📊 数据库配置:');
    console.log(`   - 主机: ${mysqlConfig.host}:${mysqlConfig.port}`);
    console.log(`   - 数据库: ${mysqlConfig.database}`);
    console.log(`   - 表名: ${mysqlConfig.tableName}`);
    console.log(`\n💡 提示: 可以通过环境变量配置数据库连接，例如:`);
    console.log(
        `   MYSQL_HOST=localhost MYSQL_USER=root MYSQL_PASSWORD=password MYSQL_DATABASE=yjs_db npm start`
    );
});
