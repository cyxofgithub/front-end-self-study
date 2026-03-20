/**
 * 静态文件服务：对应 Vite 以 index.html 为入口，其余按路径在根目录查找。
 */
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

export function getRootDir(): string {
  const currentFile = fileURLToPath(import.meta.url);
  const srcDir = path.dirname(currentFile);
  return path.resolve(srcDir, '..', 'demo');
}

export async function trySendFile(
  root: string,
  urlPath: string,
  res: import('http').ServerResponse
): Promise<boolean> {
  const normalized = urlPath === '/' ? '/index.html' : urlPath.split('?')[0];
  const filePath = path.join(root, normalized);
  if (!filePath.startsWith(path.resolve(root))) {
    return false;
  }
  try {
    const st = await stat(filePath);
    if (!st.isFile()) return false;
    const ext = path.extname(filePath);
    const contentType = MIME[ext] ?? 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    createReadStream(filePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}
