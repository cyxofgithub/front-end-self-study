import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    resolve: {
        alias: {
            util: fileURLToPath(new URL('./src/shims/ywasm-util.ts', import.meta.url)),
            path: fileURLToPath(new URL('./src/shims/ywasm-path.ts', import.meta.url)),
            fs: fileURLToPath(new URL('./src/shims/ywasm-fs.ts', import.meta.url)),
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                __dirname: '"/"',
            },
        },
    },
});
