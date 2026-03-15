import { WebsocketProvider } from 'y-websocket';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export function updateConnectionStatus(
    statusIndicator: HTMLElement,
    statusText: HTMLElement,
    status: ConnectionStatus,
    connectionTimeout?: number
) {
    // 连接态映射到统一 UI：图标颜色 + 文案，同时在连接成功后清理超时定时器。
    if (status === 'connected') {
        statusIndicator.classList.remove('disconnected');
        statusText.textContent = '已连接';
        if (connectionTimeout) {
            window.clearTimeout(connectionTimeout);
        }
        return;
    }

    if (status === 'disconnected') {
        statusIndicator.classList.add('disconnected');
        statusText.textContent = '已断开';
        return;
    }

    statusIndicator.classList.remove('disconnected');
    statusText.textContent = '连接中...';
}

export function updateUserList(userList: HTMLElement, wsProvider: WebsocketProvider) {
    // awareness 保存当前在线客户端临时状态，这里每次变更都全量重绘用户徽标。
    const states = wsProvider.awareness.getStates();
    userList.innerHTML = '';

    states.forEach((state, clientId) => {
        const user = state.user as { name?: string } | undefined;
        const badge = document.createElement('span');
        badge.className = 'user-badge';
        badge.textContent = user?.name || `用户 ${clientId}`;
        userList.appendChild(badge);
    });

    if (states.size === 0) {
        userList.innerHTML = '<span style="color: #999;">暂无其他用户</span>';
    }
}
