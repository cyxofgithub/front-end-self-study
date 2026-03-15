import { EditorState, type Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, chainCommands } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import {
    columnResizing,
    goToNextCell,
    tableEditing,
} from 'prosemirror-tables';
import {
    initProseMirrorDoc,
    yCursorPlugin,
    ySyncPlugin,
    yUndoPlugin,
    undo,
    redo,
} from 'y-prosemirror';
import { createCollabContext } from './collab/provider';
import { createCommandRegistry } from './editor/commands';
import { proseMirrorSchema } from './editor/schema';
import { createToolbarController } from './editor/toolbar';
import { debugLog, isDebugEnabled } from './shared/debug';
import { getAppDomNodes } from './shared/dom';
import { updateConnectionStatus, updateUserList } from './ui/status';
import type { YXmlEvent } from 'yjs';

interface CollabDebugSnapshot {
    getDocJson: () => unknown;
    getTextContent: () => string;
    getAwarenessUsers: () => Array<{ clientId: number; user: unknown }>;
}

declare global {
    interface Window {
        __collabDebug?: CollabDebugSnapshot;
    }
}

function summarizeSelection(selection: Selection) {
    return {
        from: selection.from,
        to: selection.to,
        empty: selection.empty,
    };
}

function getAwarenessUsers() {
    return Array.from(wsProvider.awareness.getStates().entries()).map(([clientId, state]) => ({
        clientId,
        user: state.user,
    }));
}

function getAwarenessSnapshot() {
    return Array.from(wsProvider.awareness.getStates().entries()).map(([clientId, state]) => ({
        clientId,
        state,
    }));
}

function getYjsFragmentSnapshot() {
    return {
        clientId: ydoc.clientID,
        fragmentLength: yXmlFragment.length,
        fragmentString: yXmlFragment.toString(),
        fragmentJson: yXmlFragment.toJSON(),
    };
}

const { editorRoot, statusIndicator, statusText, userList, toolbar } = getAppDomNodes();
const { ydoc, yXmlFragment, wsProvider } = createCollabContext();
const commandRegistry = createCommandRegistry(proseMirrorSchema);

debugLog('bootstrap.sourceDoc', {
    归属: 'Yjs',
    说明: '原始文档结构（createCollabContext 后）',
    ...getYjsFragmentSnapshot(),
});

const { doc, mapping } = initProseMirrorDoc(yXmlFragment, proseMirrorSchema);

// 插件顺序会影响行为：先接入 Yjs 同步，再叠加光标/撤销，最后补充表格与基础快捷键能力。
const state = EditorState.create({
    doc,
    schema: proseMirrorSchema,
    plugins: [
        ySyncPlugin(yXmlFragment, { mapping }),
        yCursorPlugin(wsProvider.awareness),
        yUndoPlugin(),
        keymap({
            'Mod-z': undo,
            'Mod-y': redo,
            'Mod-Shift-z': redo,
        }),
        keymap({
            Tab: chainCommands(goToNextCell(1)),
            'Shift-Tab': chainCommands(goToNextCell(-1)),
        }),
        columnResizing(),
        tableEditing(),
        history(),
        keymap(baseKeymap),
    ],
});

let editorView: EditorView;
const toolbarController = createToolbarController({
    toolbar,
    getView: () => editorView,
    commandRegistry,
});

editorView = new EditorView(editorRoot, {
    state,
    attributes: {
        spellcheck: 'true',
    },
    dispatchTransaction(transaction) {
        // 所有本地/远端变更都会走这里，更新状态后立刻刷新工具栏可用性与激活态。
        const nextState = editorView.state.apply(transaction);
        editorView.updateState(nextState);
        toolbarController.updateToolbarState();
        debugLog('[ProseMirror] 事务后文档结构', {
            归属: 'ProseMirror',
            说明: '中间态数据结构（transaction 后）',
            docChanged: transaction.docChanged,
            stepTypes: transaction.steps.map((step) => step.constructor.name),
            selection: summarizeSelection(nextState.selection),
            pmDocTextContent: nextState.doc.textContent,
            pmDocJson: nextState.doc.toJSON(),
        });
    },
});

let hasInjectedInitialText = false;
let connectionTimeout: number | undefined;
const CONNECTION_TIMEOUT = 10000;
let unobserveYXmlFragment: (() => void) | undefined;

wsProvider.on('status', (event: { status: 'connected' | 'disconnected' | 'connecting' }) => {
    updateConnectionStatus(statusIndicator, statusText, event.status, connectionTimeout);
});

wsProvider.on('sync', (isSynced: boolean) => {
    // 只在首次同步完成时写入引导文案，避免覆盖真实协同内容。
    if (isSynced && !hasInjectedInitialText) {
        // 双重判空：Yjs 文档和当前编辑器都为空时才注入默认文本。
        if (yXmlFragment.length === 0 && editorView.state.doc.textContent.length === 0) {
            const initialText = '欢迎使用 Yjs + ProseMirror 多人协同编辑 Demo，开始输入内容吧。';
            editorView.dispatch(editorView.state.tr.insertText(initialText));
        }
        hasInjectedInitialText = true;
    }
    if (isSynced) {
        debugLog('sync.after', {
            归属: 'Yjs',
            说明: '原始文档结构（sync 后）',
            ...getYjsFragmentSnapshot(),
        });
        debugLog('[ProseMirror] 同步后文档结构', {
            归属: 'ProseMirror',
            说明: '中间态数据结构（sync 后）',
            pmDocTextContent: editorView.state.doc.textContent,
            pmDocJson: editorView.state.doc.toJSON(),
        });
        debugLog('[Yjs] 在线编辑状态', {
            归属: 'Yjs',
            说明: '中间态数据结构（awareness）',
            awarenessStates: getAwarenessSnapshot(),
        });
        updateConnectionStatus(statusIndicator, statusText, 'connected', connectionTimeout);
    }
});

if (isDebugEnabled()) {
    const handleYXmlFragmentChange = (event: YXmlEvent) => {
        debugLog('yxmlfragment.change', {
            归属: 'Yjs',
            说明: '原始文档结构（fragment 变更后）',
            delta: event.changes.delta,
            ...getYjsFragmentSnapshot(),
        });
    };
    yXmlFragment.observe(handleYXmlFragmentChange);
    unobserveYXmlFragment = () => {
        yXmlFragment.unobserve(handleYXmlFragmentChange);
    };
}

wsProvider.awareness.on('change', () => {
    updateUserList(userList, wsProvider);
});

connectionTimeout = window.setTimeout(() => {
    // 超时后主动更新 UI，避免“连接中...”长期停留造成误导。
    if (statusText.textContent === '连接中...') {
        statusIndicator.classList.add('disconnected');
        statusText.textContent = '连接超时，请检查服务器是否运行';
    }
}, CONNECTION_TIMEOUT);

updateConnectionStatus(statusIndicator, statusText, 'connecting', connectionTimeout);
updateUserList(userList, wsProvider);
toolbarController.updateToolbarState();

if (isDebugEnabled()) {
    window.__collabDebug = {
        getDocJson: () => editorView.state.doc.toJSON(),
        getTextContent: () => editorView.state.doc.textContent,
        getAwarenessUsers,
    };
}

window.addEventListener('beforeunload', () => {
    // 页面关闭前释放监听与连接，避免残留会话与内存泄漏。
    toolbarController.destroy();
    unobserveYXmlFragment?.();
    editorView.destroy();
    wsProvider.destroy();
    ydoc.destroy();
    delete window.__collabDebug;
});

