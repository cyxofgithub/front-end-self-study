import wasmAssetUrl from 'ywasm/ywasm_bg.wasm?url';

let wasmBytesCache: Uint8Array | null = null;

export function readFileSync(path: string): Uint8Array {
    if (wasmBytesCache) {
        return wasmBytesCache;
    }
    const request = new XMLHttpRequest();
    request.open('GET', wasmAssetUrl, false);
    // 同步 XHR 在 document 环境下不允许设置 responseType=arraybuffer，
    // 这里使用 x-user-defined 读取原始字节并手动转换成 Uint8Array。
    request.overrideMimeType('text/plain; charset=x-user-defined');
    request.send(null);

    if (request.status >= 200 && request.status < 300) {
        const source = request.responseText ?? '';
        const bytes = new Uint8Array(source.length);
        for (let index = 0; index < source.length; index += 1) {
            bytes[index] = source.charCodeAt(index) & 0xff;
        }
        wasmBytesCache = bytes;
        return wasmBytesCache;
    }

    throw new Error(`ywasm wasm 资源读取失败，status=${request.status}`);
}

export default {
    readFileSync,
};
