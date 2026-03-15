import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export interface CollabContext {
    ydoc: Y.Doc;
    yXmlFragment: Y.XmlFragment;
    wsProvider: WebsocketProvider;
    docName: string;
    wsUrl: string;
}

export function createCollabContext(): CollabContext {
    // 通过 URL 参数切换房间与服务地址，便于本地多实例联调：
    // ?doc=同一名称会进入同一协同文档，?ws=指定 websocket 服务端地址。
    const docName = new URLSearchParams(window.location.search).get('doc') || 'demo';
    const wsUrl =
        new URLSearchParams(window.location.search).get('ws') || 'ws://localhost:3000';

    const ydoc = new Y.Doc();
    const yXmlFragment = ydoc.getXmlFragment('prosemirror');
    const wsProvider = new WebsocketProvider(wsUrl, docName, ydoc);

    // awareness 是“在线用户临时状态”：用于远端光标渲染与在线列表展示，不会持久化到文档内容。
    wsProvider.awareness.setLocalStateField('user', {
        name: `用户 ${Math.random().toString(36).slice(2, 7)}`,
        color: `#${Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, '0')}`,
    });
    return { ydoc, yXmlFragment, wsProvider, docName, wsUrl };
}
