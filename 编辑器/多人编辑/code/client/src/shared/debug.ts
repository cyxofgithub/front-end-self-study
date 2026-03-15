const DEBUG_PREFIX = '[collab-debug]';
const ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on']);

let cachedDebugEnabled: boolean | undefined;

export function isDebugEnabled(): boolean {
    if (cachedDebugEnabled !== undefined) {
        return cachedDebugEnabled;
    }

    const value = new URLSearchParams(window.location.search).get('debug');
    cachedDebugEnabled = value ? ENABLED_VALUES.has(value.toLowerCase()) : false;
    return cachedDebugEnabled;
}

export function debugLog(step: string, payload?: unknown): void {
    if (!isDebugEnabled()) {
        return;
    }

    if (payload === undefined) {
        console.log(`${DEBUG_PREFIX} ${step}`);
        return;
    }

    console.log(`${DEBUG_PREFIX} ${step}`, payload);
}

export function debugGroup(step: string, payload: unknown, callback: () => void): void {
    if (!isDebugEnabled()) {
        callback();
        return;
    }

    console.groupCollapsed(`${DEBUG_PREFIX} ${step}`);
    if (payload !== undefined) {
        console.log(payload);
    }
    try {
        callback();
    } finally {
        console.groupEnd();
    }
}
