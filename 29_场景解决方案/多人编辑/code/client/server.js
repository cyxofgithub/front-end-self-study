/**
 * Client 静态文件服务器
 * 独立提供前端静态资源服务
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// 提供静态文件服务（当前目录）
const clientDir = __dirname;
app.use(express.static(clientDir));

// 所有路由都返回 index.html（用于 SPA）
app.get('*', (req, res) => {
    res.sendFile(path.join(clientDir, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Client 服务器已启动`);
    console.log(`📡 静态资源服务器运行在 http://localhost:${PORT}`);
    console.log(`\n💡 提示:`);
    console.log(`   - 访问 http://localhost:${PORT} 查看前端页面`);
    console.log(`   - WebSocket 服务器运行在 ws://localhost:3000`);
    console.log(`   - 前端会自动连接到 WebSocket 服务器\n`);
});

