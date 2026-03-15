import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { createCrdtEngineSelection, type CrdtEngineSelection } from './engine';
import { PerfTracker } from '../shared/perf';

const ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on']);

function isPerfLogEnabledByUrl(): boolean {
    const value = new URLSearchParams(window.location.search).get('perf');
    return value ? ENABLED_VALUES.has(value.toLowerCase()) : false;
}

function measureYjsApply(doc: Y.Doc, update: Uint8Array): number {
    const begin = performance.now();
    Y.applyUpdate(doc, update);
    return performance.now() - begin;
}

export interface CollabContext {
    ydoc: Y.Doc;
    yXmlFragment: Y.XmlFragment;
    wsProvider: WebsocketProvider;
    docName: string;
    wsUrl: string;
    engineSelection: CrdtEngineSelection;
    perfTracker: PerfTracker;
    perfLogEnabled: boolean;
}

export async function createCollabContext(): Promise<CollabContext> {
    // 通过 URL 参数切换房间与服务地址，便于本地多实例联调：
    // ?doc=同一名称会进入同一协同文档，?ws=指定 websocket 服务端地址，?crdtEngine=wasm|js 切换实验引擎。
    const searchParams = new URLSearchParams(window.location.search);
    const docName = searchParams.get('doc') || 'demo';
    const wsUrl = searchParams.get('ws') || 'ws://localhost:3000';
    const { selection: engineSelection, wasmProbe } = await createCrdtEngineSelection();
    const perfTracker = new PerfTracker();
    const perfLogEnabled = isPerfLogEnabledByUrl() || engineSelection.requested === 'wasm';

    const ydoc = new Y.Doc();
    const yXmlFragment = ydoc.getXmlFragment('prosemirror');
    const wsProvider = new WebsocketProvider(wsUrl, docName, ydoc);
    const yjsProbeDoc = new Y.Doc();
    let updateCount = 0;

    if (engineSelection.requested === 'wasm' && engineSelection.active !== 'wasm') {
        console.warn('[collab-crdt] ywasm 初始化失败，已自动回退到 yjs', {
            fallbackReason: engineSelection.fallbackReason,
        });
    } else {
        console.info('[collab-crdt] 当前协同引擎', engineSelection);
    }

    ydoc.on('update', (update) => {
        updateCount += 1;
        perfTracker.record('update.bytes', update.byteLength);

        const jsProbeMs = measureYjsApply(yjsProbeDoc, update);
        const jsProbeSummary = perfTracker.record('applyUpdate.jsProbeMs', jsProbeMs);

        let wasmProbeSummary: ReturnType<PerfTracker['record']> | null = null;
        if (wasmProbe) {
            const wasmProbeMs = wasmProbe.apply(update);
            wasmProbeSummary = perfTracker.record('applyUpdate.wasmProbeMs', wasmProbeMs);
        }

        if (perfLogEnabled && updateCount % 20 === 0) {
            console.info('[collab-perf] update 采样摘要', {
                updateCount,
                engineSelection,
                jsProbeSummary,
                wasmProbeSummary,
            });
        }
    });

    // awareness 是“在线用户临时状态”：用于远端光标渲染与在线列表展示，不会持久化到文档内容。
    wsProvider.awareness.setLocalStateField('user', {
        name: `用户 ${Math.random().toString(36).slice(2, 7)}`,
        color: `#${Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, '0')}`,
    });
    return {
        ydoc,
        yXmlFragment,
        wsProvider,
        docName,
        wsUrl,
        engineSelection,
        perfTracker,
        perfLogEnabled,
    };
}
