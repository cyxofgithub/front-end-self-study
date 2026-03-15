export type CrdtEngineKind = 'js' | 'wasm';

export interface CrdtEngineSelection {
    requested: CrdtEngineKind;
    active: CrdtEngineKind;
    fallbackReason?: string;
}

interface YWasmModuleShape {
    YDoc: new () => unknown;
    applyUpdate: (doc: unknown, update: Uint8Array) => void;
}

interface GlobalModuleBridge {
    module?: { exports: Record<string, unknown> };
    exports?: Record<string, unknown>;
}

function isBrowserRuntime(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function normalizeEngine(value: string | null): CrdtEngineKind {
    return value === 'wasm' ? 'wasm' : 'js';
}

function asErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}

export class WasmUpdateProbe {
    private readonly wasmDoc: unknown;
    private readonly applyUpdate: (doc: unknown, update: Uint8Array) => void;

    constructor(module: YWasmModuleShape) {
        this.wasmDoc = new module.YDoc();
        this.applyUpdate = module.applyUpdate;
    }

    apply(update: Uint8Array): number {
        const begin = performance.now();
        this.applyUpdate(this.wasmDoc, update);
        return performance.now() - begin;
    }
}

async function importYwasmWithCjsBridge(): Promise<YWasmModuleShape> {
    const globalBridge = globalThis as unknown as GlobalModuleBridge;
    const previousModule = globalBridge.module;
    const previousExports = globalBridge.exports;
    const bridgeModule = { exports: {} as Record<string, unknown> };
    globalBridge.module = bridgeModule;
    globalBridge.exports = bridgeModule.exports;

    try {
        const namespaceModule = (await import('ywasm')) as unknown as Record<string, unknown>;
        const defaultExport =
            (namespaceModule?.default as Record<string, unknown> | undefined) ?? undefined;

        const esmCandidate = namespaceModule ?? {};
        const defaultCandidate = defaultExport ?? {};
        const cjsCandidate = bridgeModule.exports ?? {};

        const pickCandidate = [esmCandidate, defaultCandidate, cjsCandidate].find((candidate) => {
            const hasYDoc = typeof candidate.YDoc === 'function';
            const hasApplyUpdate = typeof candidate.applyUpdate === 'function';
            return hasYDoc && hasApplyUpdate;
        });

        if (!pickCandidate) {
            throw new Error(
                `local ywasm module shape invalid (esmKeys=${Object.keys(esmCandidate).join(',')}; defaultKeys=${Object.keys(defaultCandidate).join(',')}; cjsKeys=${Object.keys(cjsCandidate).join(',')})`
            );
        }

        return pickCandidate as unknown as YWasmModuleShape;
    } finally {
        if (previousModule === undefined) {
            delete globalBridge.module;
        } else {
            globalBridge.module = previousModule;
        }
        if (previousExports === undefined) {
            delete globalBridge.exports;
        } else {
            globalBridge.exports = previousExports;
        }
    }
}

export async function createCrdtEngineSelection(): Promise<{
    selection: CrdtEngineSelection;
    wasmProbe: WasmUpdateProbe | null;
}> {
    const requested = normalizeEngine(new URLSearchParams(window.location.search).get('crdtEngine'));
    if (requested !== 'wasm') {
        return {
            selection: {
                requested,
                active: 'js',
            },
            wasmProbe: null,
        };
    }

    if (isBrowserRuntime()) {
        try {
            const module = await importYwasmWithCjsBridge();
            if (!module || typeof module.YDoc !== 'function' || typeof module.applyUpdate !== 'function') {
                throw new Error('local ywasm module shape invalid');
            }
            return {
                selection: {
                    requested: 'wasm',
                    active: 'wasm',
                },
                wasmProbe: new WasmUpdateProbe(module),
            };
        } catch (error) {
            return {
                selection: {
                    requested: 'wasm',
                    active: 'js',
                    fallbackReason: `local npm ywasm 不可用：${asErrorMessage(error)}`,
                },
                wasmProbe: null,
            };
        }
    }

    try {
        const wasmEntryUrl = 'https://esm.sh/ywasm@0.25.0';
        const module = (await import(
            /* @vite-ignore */ wasmEntryUrl
        )) as unknown as YWasmModuleShape;
        if (!module || typeof module.YDoc !== 'function' || typeof module.applyUpdate !== 'function') {
            throw new Error('ywasm 模块结构不符合预期');
        }
        return {
            selection: {
                requested: 'wasm',
                active: 'wasm',
            },
            wasmProbe: new WasmUpdateProbe(module),
        };
    } catch (error) {
        return {
            selection: {
                requested: 'wasm',
                active: 'js',
                fallbackReason: asErrorMessage(error),
            },
            wasmProbe: null,
        };
    }
}
