import { mkdir, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, '..');
const sourceDir = resolve(projectRoot, 'node_modules/@ffmpeg/core/dist/esm');
const targetDir = resolve(projectRoot, 'public/ffmpeg');

await mkdir(targetDir, { recursive: true });
await copyFile(
    resolve(sourceDir, 'ffmpeg-core.js'),
    resolve(targetDir, 'ffmpeg-core.js')
);
await copyFile(
    resolve(sourceDir, 'ffmpeg-core.wasm'),
    resolve(targetDir, 'ffmpeg-core.wasm')
);

console.log('Prepared local ffmpeg core assets in public/ffmpeg');
