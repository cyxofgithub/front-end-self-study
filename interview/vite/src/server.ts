/**
 * mini-vite 开发服务器入口：预构建 → 静态服务 → /src 按需转换 → /node_modules/.vite 预构建产物 → HMR 注入与 WebSocket
 */
import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from 'http';
import { readFileSync } from 'fs';
import path from 'path';
import { getRootDir, trySendFile } from './static.js';
import { transformRequest } from './transform.js';
import { ensurePrebundle } from './prebundle.js';
import { injectHMRClient, createHMRServer } from './hmr.js';

const PORT = 5174;

async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = req.url ?? '/';
  const urlPath = url.split('?')[0];

  // 1. /src/* → 按需转换
  if (urlPath.startsWith('/src/') && (urlPath.endsWith('.js') || urlPath.endsWith('.ts') || urlPath.endsWith('.jsx') || urlPath.endsWith('.tsx'))) {
    const result = await transformRequest(urlPath);
    if ('err' in result) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end(result.err);
      return;
    }
    res.setHeader('Content-Type', 'application/javascript');
    res.end(result.code);
    return;
  }

  const root = getRootDir();

  // 2. 根路径返回 index.html（并注入 HMR client）
  if (urlPath === '/' || urlPath === '/index.html') {
    const htmlPath = path.join(root, 'index.html');
    let html = readFileSync(htmlPath, 'utf-8');
    html = injectHMRClient(html);
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
    return;
  }

  // 3. 静态文件（含 /node_modules/.vite/deps.js）
  const sent = await trySendFile(root, urlPath, res);
  if (sent) return;

  res.statusCode = 404;
  res.end('Not Found');
}

async function main(): Promise<void> {
  const root = getRootDir();
  console.log("🚀 ~ main ~ root:", root)
  console.log('Running prebundle...');
  await ensurePrebundle();
  console.log('Prebundle done.');

  const server = createHttpServer(async (req, res) => {
    try {
      await handleRequest(req, res);
    } catch (e) {
      res.statusCode = 500;
      res.end(e instanceof Error ? e.message : String(e));
    }
  });

  createHMRServer(server, root);

  server.listen(PORT, () => {
    console.log(`mini-vite dev server at http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
