/** 路径工具：demo 目录作为项目根，与 mini-vite 的 static.ts#getRootDir 对应 */
import path from 'path';
import { fileURLToPath } from 'url';

export function getRootDir(): string {
  const currentFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(currentFile), '..', 'demo');
}
