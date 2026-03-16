/**
 * HMR：WebSocket 服务 + 文件监听，向浏览器推送 full-reload 或 update 事件。
 * 对应 Vite 的 HMR 流程：文件变 → 推消息 → 客户端刷新或重新请求模块。
 */
import chokidar from 'chokidar';
import path from 'path';
import { WebSocketServer, type WebSocket } from 'ws';
import type { Server } from 'http';
import { getRootDir } from './static.js';

const HMR_CLIENT = `
(function () {
  const ws = new WebSocket('ws://' + location.host + '/__hmr');
  ws.onmessage = function (e) {
    const msg = JSON.parse(e.data);
    if (msg.type === 'full-reload') location.reload();
    if (msg.type === 'update' && msg.path) {
      import(msg.path + '?t=' + Date.now()).catch(function () { location.reload(); });
    }
  };
})();
`;

export function injectHMRClient(html: string): string {
  const script = `<script type="module">${HMR_CLIENT}</script></body>`;
  return html.replace('</body>', script);
}

export function createHMRServer(httpServer: Server, root: string): void {
  const wss = new WebSocketServer({ noServer: true });
  httpServer.on('upgrade', (req, socket, head) => {
    if (req.url === '/__hmr') {
      wss.handleUpgrade(req, socket, head, (ws: WebSocket) => {
        wss.emit('connection', ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  const clients = new Set<WebSocket>();
  wss.on('connection', (ws: WebSocket) => {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
  });

  function broadcast(payload: { type: string; path?: string }) {
    const data = JSON.stringify(payload);
    clients.forEach((c) => {
      if (c.readyState === 1) c.send(data);
    });
  }

  const srcDir = path.join(root, 'src');
  chokidar
    .watch(srcDir, { ignoreInitial: true, depth: 2 })
    .on('change', (filePath) => {
      const relative = path.relative(root, filePath).replace(/\\/g, '/');
      const urlPath = '/' + relative;
      broadcast({ type: 'update', path: urlPath });
    })
    .on('error', (err: unknown) => {
      console.warn('[hmr] watcher error:', err instanceof Error ? err.message : String(err));
    });
}
