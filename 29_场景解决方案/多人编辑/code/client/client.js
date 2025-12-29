/**
 * Yjs 客户端集成代码
 * 实现多人协同文档编辑的核心逻辑
 */

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// ==================== 初始化 Yjs 文档 ====================
// Y.Doc 是 Yjs 的核心数据结构，代表一个可协同编辑的文档
const ydoc = new Y.Doc();

// 创建一个文本类型（Y.Text），用于存储文档内容
// Y.Text 是 CRDT 数据结构，支持并发编辑且自动解决冲突
const ytext = ydoc.getText('content');

// ==================== 连接 WebSocket 服务器 ====================
// 从 URL 获取文档名称（默认为 'demo'）
const docName =
    new URLSearchParams(window.location.search).get('doc') || 'demo';

// 获取 WebSocket 服务器地址（支持从环境变量或 URL 参数获取）
const wsUrl =
    new URLSearchParams(window.location.search).get('ws') ||
    'ws://localhost:3000';

// ==================== UI 元素 ====================
// 确保 DOM 已加载后再获取元素
const editor = document.getElementById('editor');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const userList = document.getElementById('userList');

// 创建 WebSocket Provider，用于与服务器同步
const wsProvider = new WebsocketProvider(
    wsUrl, // WebSocket 服务器地址
    docName, // 文档名称（同一名称的文档会同步）
    ydoc // Yjs 文档实例
);

// 添加连接超时检测
let connectionTimeout;
const CONNECTION_TIMEOUT = 10000; // 10秒超时

// 安全地监听 WebSocket 连接事件
function setupWebSocketListeners() {
    // 等待 WebSocket 实例创建
    if (wsProvider.ws) {
        wsProvider.ws.addEventListener('open', () => {
            console.log('WebSocket 连接已建立');
            clearTimeout(connectionTimeout);
            // status 事件应该会触发，但如果没有，我们手动更新
            setTimeout(() => {
                if (statusText && statusText.textContent === '连接中...') {
                    statusIndicator.classList.remove('disconnected');
                    statusText.textContent = '已连接';
                }
            }, 500);
        });

        wsProvider.ws.addEventListener('error', (error) => {
            console.error('WebSocket 连接错误:', error);
            if (statusIndicator && statusText) {
                statusIndicator.classList.add('disconnected');
                statusText.textContent = '连接失败';
            }
            clearTimeout(connectionTimeout);
        });

        wsProvider.ws.addEventListener('close', () => {
            console.log('WebSocket 连接已关闭');
            if (statusIndicator && statusText) {
                statusIndicator.classList.add('disconnected');
                statusText.textContent = '已断开';
            }
            clearTimeout(connectionTimeout);

            // 尝试重连
            setTimeout(() => {
                console.log('尝试重新连接...');
                if (statusText) {
                    statusText.textContent = '重连中...';
                }
                if (wsProvider && typeof wsProvider.connect === 'function') {
                    wsProvider.connect();
                }
            }, 3000);
        });
    } else {
        // 如果 WebSocket 还没创建，稍后重试
        setTimeout(setupWebSocketListeners, 100);
    }
}

// 初始化 WebSocket 监听器
setupWebSocketListeners();

// 设置连接超时
connectionTimeout = setTimeout(() => {
    if (statusText && statusText.textContent === '连接中...') {
        console.warn('连接超时，请检查：');
        console.warn('1. 服务器是否运行在 http://localhost:3000');
        console.warn('2. 运行命令: npm start 或 node server.js');
        console.warn('3. 检查浏览器控制台是否有错误信息');
        statusIndicator.classList.add('disconnected');
        statusText.textContent = '连接超时，请检查服务器是否运行';
    }
}, CONNECTION_TIMEOUT);

// ==================== 同步控制标志 ====================
// 防止双向同步时的循环触发
let isUpdatingFromYjs = false;
let isUpdatingFromEditor = false;

// ==================== 同步 Yjs 文档到编辑器 ====================
// 当 Yjs 文档内容变化时，更新编辑器显示
ytext.observe((event) => {
    // 如果是由编辑器触发的更新，则忽略（避免循环）
    if (isUpdatingFromEditor) return;

    isUpdatingFromYjs = true;

    try {
        // 获取当前文档内容
        const content = ytext.toString();
        const currentEditorValue = editor.value;

        // 只有当内容确实不同时才更新
        if (content !== currentEditorValue) {
            // 保存光标位置和选择范围
            const cursorPosition = editor.selectionStart;
            const cursorEnd = editor.selectionEnd;
            const scrollTop = editor.scrollTop;

            // 计算内容变化前后的长度差
            const lengthDiff = content.length - currentEditorValue.length;

            // 更新编辑器内容
            editor.value = content;

            // 智能恢复光标位置
            // 如果变化不大（小于100字符），尝试保持相对位置
            if (Math.abs(lengthDiff) < 100) {
                // 如果是在末尾输入，保持光标在末尾
                if (
                    cursorPosition === currentEditorValue.length &&
                    lengthDiff > 0
                ) {
                    editor.setSelectionRange(content.length, content.length);
                } else {
                    // 否则尝试保持相对位置
                    const newPosition = Math.min(
                        cursorPosition + lengthDiff,
                        content.length
                    );
                    const newEnd = Math.min(
                        cursorEnd + lengthDiff,
                        content.length
                    );
                    editor.setSelectionRange(newPosition, newEnd);
                }
            } else {
                // 变化较大时，保持光标在末尾
                editor.setSelectionRange(content.length, content.length);
            }

            // 恢复滚动位置
            editor.scrollTop = scrollTop;
        }
    } finally {
        isUpdatingFromYjs = false;
    }
});

// ==================== 同步编辑器内容到 Yjs ====================
// 监听编辑器的输入事件
editor.addEventListener('input', (e) => {
    // 如果是由 Yjs 触发的更新，则忽略（避免循环）
    if (isUpdatingFromYjs) return;

    isUpdatingFromEditor = true;

    try {
        const newValue = editor.value;
        const oldValue = ytext.toString();

        // 只有当内容确实不同时才更新
        if (newValue !== oldValue) {
            // 计算差异并应用增量更新
            const oldLength = oldValue.length;
            const newLength = newValue.length;

            // 找到第一个不同的位置
            let diffStart = 0;
            while (
                diffStart < oldLength &&
                diffStart < newLength &&
                oldValue[diffStart] === newValue[diffStart]
            ) {
                diffStart++;
            }

            // 找到最后一个不同的位置（从末尾开始）
            let diffEndOld = oldLength;
            let diffEndNew = newLength;
            while (
                diffEndOld > diffStart &&
                diffEndNew > diffStart &&
                oldValue[diffEndOld - 1] === newValue[diffEndNew - 1]
            ) {
                diffEndOld--;
                diffEndNew--;
            }

            // 使用事务来批量应用更改
            ydoc.transact(() => {
                // 删除变化的部分
                if (diffEndOld > diffStart) {
                    ytext.delete(diffStart, diffEndOld - diffStart);
                }
                // 插入新的内容
                if (diffEndNew > diffStart) {
                    ytext.insert(
                        diffStart,
                        newValue.substring(diffStart, diffEndNew)
                    );
                }
            });
        }
    } finally {
        isUpdatingFromEditor = false;
    }
});

// 监听其他可能改变编辑器内容的事件
editor.addEventListener('paste', () => {
    // paste 事件会触发 input 事件，所以不需要单独处理
});

editor.addEventListener('cut', () => {
    // cut 事件会触发 input 事件，所以不需要单独处理
});

// ==================== 连接状态管理 ====================
// 统一的连接状态更新函数
function updateConnectionStatus(status) {
    console.log('更新连接状态:', status);

    if (status === 'connected') {
        statusIndicator.classList.remove('disconnected');
        statusText.textContent = '已连接';
        clearTimeout(connectionTimeout);

        // 等待同步完成后初始化编辑器内容
        // 使用 setTimeout 确保 Yjs 文档已从服务器同步完成
        setTimeout(() => {
            const content = ytext.toString();

            // 如果文档为空，设置初始内容
            if (ytext.length === 0) {
                const initialContent = `欢迎使用 Yjs 多人协同文档编辑系统！

这是一个基于 CRDT（无冲突复制数据类型）技术的实时协作编辑 Demo。

✨ 特性：
- 实时多人协同编辑
- 自动冲突解决
- 离线编辑支持
- 高性能同步

📖 使用方式：
1. 打开多个浏览器标签页
2. 在不同标签页中同时编辑
3. 观察实时同步效果

💡 技术原理：
Yjs 使用 CRDT 算法，为每个字符分配唯一 ID，通过数据结构设计
自动解决并发编辑冲突，无需中心化服务器进行复杂的操作转换。

开始编辑吧！`;

                isUpdatingFromEditor = true;
                try {
                    ytext.insert(0, initialContent);
                    editor.value = initialContent;
                    editor.setSelectionRange(
                        initialContent.length,
                        initialContent.length
                    );
                } finally {
                    isUpdatingFromEditor = false;
                }
            } else if (content && content !== editor.value) {
                // 如果文档有内容但与编辑器不一致，同步到编辑器
                isUpdatingFromYjs = true;
                try {
                    editor.value = content;
                    // 将光标移到末尾
                    editor.setSelectionRange(content.length, content.length);
                } finally {
                    isUpdatingFromYjs = false;
                }
            }
        }, 200);
    } else if (status === 'disconnected') {
        statusIndicator.classList.add('disconnected');
        statusText.textContent = '已断开';
    } else if (status === 'connecting') {
        statusText.textContent = '连接中...';
    }
}

// 监听 y-websocket 的状态事件
wsProvider.on('status', (event) => {
    console.log('连接状态事件:', event.status);
    updateConnectionStatus(event.status);
});

// 检查 WebSocket 的实际连接状态（备用检测机制）
function checkWebSocketStatus() {
    if (wsProvider.ws) {
        const readyState = wsProvider.ws.readyState;
        if (readyState === WebSocket.OPEN) {
            // WebSocket 已连接，但状态可能还没更新
            if (
                statusText &&
                (statusText.textContent === '连接中...' ||
                    statusText.textContent === '连接超时，请检查服务器是否运行')
            ) {
                console.log('检测到 WebSocket 已连接，更新状态');
                updateConnectionStatus('connected');
            }
        } else if (
            readyState === WebSocket.CLOSED ||
            readyState === WebSocket.CLOSING
        ) {
            // WebSocket 已关闭
            if (
                statusText &&
                statusText.textContent !== '已断开' &&
                statusText.textContent !== '连接失败'
            ) {
                console.log('检测到 WebSocket 已断开，更新状态');
                updateConnectionStatus('disconnected');
            }
        } else if (readyState === WebSocket.CONNECTING) {
            // 正在连接中
            if (statusText && statusText.textContent !== '连接中...') {
                statusText.textContent = '连接中...';
            }
        }
    }
}

// 定期检查连接状态（作为备用方案，每秒检查一次）
setInterval(checkWebSocketStatus, 1000);

// 监听同步完成事件
wsProvider.on('synced', () => {
    console.log('文档已同步');
    // 同步完成后，确保编辑器内容与 Yjs 文档一致
    const content = ytext.toString();
    if (content !== editor.value) {
        isUpdatingFromYjs = true;
        try {
            editor.value = content;
        } finally {
            isUpdatingFromYjs = false;
        }
    }
});

// ==================== 用户管理 ====================
// 监听用户加入和离开
wsProvider.awareness.on('change', () => {
    updateUserList();
});

function updateUserList() {
    const states = wsProvider.awareness.getStates();
    userList.innerHTML = '';

    states.forEach((state, clientId) => {
        const user = state.user || { name: `用户 ${clientId}` };
        const badge = document.createElement('span');
        badge.className = 'user-badge';
        badge.textContent = user.name;
        userList.appendChild(badge);
    });

    if (states.size === 0) {
        userList.innerHTML = '<span style="color: #999;">暂无其他用户</span>';
    }
}

// 设置当前用户信息
wsProvider.awareness.setLocalStateField('user', {
    name: `用户 ${Math.random().toString(36).substr(2, 5)}`,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
});

// ==================== 页面卸载时清理 ====================
window.addEventListener('beforeunload', () => {
    wsProvider.destroy();
    ydoc.destroy();
});

// ==================== 调试信息 ====================
// 在控制台输出 Yjs 文档状态（开发时使用）
console.log('=== Yjs 多人协同编辑系统初始化 ===');
console.log('文档名称:', docName);
console.log('WebSocket 服务器地址:', wsUrl);
console.log('当前内容长度:', ytext.length);

// 输出连接提示
console.log('\n📋 连接状态检查：');
console.log('1. 确保服务器正在运行: npm start 或 node server.js');
console.log('2. 服务器应运行在: http://localhost:3000');
console.log('3. WebSocket 地址: ws://localhost:3000');
console.log('4. 如果连接失败，请检查：');
console.log('   - 服务器是否已启动');
console.log('   - 端口 3000 是否被占用');
console.log('   - 防火墙是否阻止连接');
console.log('   - 浏览器控制台是否有错误信息\n');

// 监听文档更新事件（仅在开发环境详细输出）
if (window.location.hostname === 'localhost') {
    ydoc.on('update', (update) => {
        console.log('📝 文档更新:');
        console.log('  - 类型:', update.constructor.name); // Uint8Array
        console.log('  - 大小:', update.length, 'bytes');
        console.log('  - 数据:', Array.from(update)); // 转换为普通数组查看
    });
}

// 5秒后检查连接状态
setTimeout(() => {
    if (wsProvider.ws) {
        const readyState = wsProvider.ws.readyState;
        const stateNames = {
            [WebSocket.CONNECTING]: '连接中',
            [WebSocket.OPEN]: '已连接',
            [WebSocket.CLOSING]: '关闭中',
            [WebSocket.CLOSED]: '已关闭',
        };
        console.log('🔌 WebSocket 状态:', stateNames[readyState] || '未知');

        if (readyState === WebSocket.CLOSED) {
            console.error('❌ WebSocket 连接失败！');
            console.error('请确保服务器正在运行: npm start');
        } else if (readyState === WebSocket.OPEN) {
            console.log('✅ WebSocket 连接成功！');
        }
    } else {
        console.warn('⚠️ WebSocket 实例尚未创建');
    }
}, 5000);
