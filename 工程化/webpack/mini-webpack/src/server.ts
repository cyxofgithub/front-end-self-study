/**
 * mini-webpack dev server：对照 mini-vite 看两处关键差异。
 *
 * 1. 启动：这里必须先 buildModuleGraph 打出完整 bundle 才能响应请求
 *          （mini-vite 是起服务就能响应，模块请求到了再转换）
 * 2. HMR ：文件变更后重建依赖图，但只把**变更的模块**（hot-update 增量）推给浏览器，
 *          浏览器在运行时替换模块工厂并重跑入口，不整包重取、不刷新页面
 *          （mini-vite 只推变更文件的 URL，浏览器 import 单个文件）
 */
import { createServer, type IncomingMessage, type ServerResponse } from 'http';
import { readFileSync } from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { WebSocketServer, type WebSocket } from 'ws';
import { buildModuleGraph, type ModuleGraph } from './graph.js';
import { generateBundle } from './bundle.js';
import { getRootDir } from './paths.js';

const PORT = 5175;
const root = getRootDir();
const entry = path.join(root, 'src', 'main.js');

/** 内存里的 bundle + 模块图缓存 —— 对应 webpack-dev-server 把产物放内存不落盘 */
let cachedBundle = '';
let cachedGraph: ModuleGraph = new Map();
let buildCount = 0;

function rebuild(reason: string): void {
  const start = performance.now();
  const { graph, entryId } = buildModuleGraph(entry, root);
  cachedBundle = generateBundle(graph, entryId);
  buildCount++;
  const cost = performance.now() - start;
  console.log(
    `[mini-webpack] 第 ${buildCount} 次构建（${reason}）：${graph.size} 个模块，${cost.toFixed(1)}ms`
  );
  cachedGraph = graph;
}

/**
 * 对比新旧模块图，算出本次要推给浏览器的增量。
 * - 变更/新增：id 相同但 code 变了，或只有新图有 —— 进 modules
 * - 删除     ：只有旧图有 —— 进 removed
 * 真实 webpack 把这三类分别写进 hot-update.json 的 c/r/m 字段，
 * 这里合并成一个对象，因为应用时变更与新增都走「替换工厂」同一条路径。
 */
function diffModules(prev: ModuleGraph, next: ModuleGraph): {
  modules: Record<string, string>;
  removed: string[];
} {
  const modules: Record<string, string> = {};
  const removed: string[] = [];

  for (const [id, mod] of next) {
    const old = prev.get(id);
    if (!old || old.code !== mod.code) modules[id] = mod.code;
  }
  for (const id of prev.keys()) {
    if (!next.has(id)) removed.push(id);
  }
  return { modules, removed };
}

/** HMR client：webpack 的做法是拉 hot-update 增量，这里把清单与代码合并成一条 WS 消息 */
const HMR_CLIENT = `
(function () {
  var ws = new WebSocket('ws://' + location.host + '/__hmr');
  ws.onmessage = function (e) {
    var msg = JSON.parse(e.data);
    if (msg.type === 'update') {
      // webpack 真实流程：拉 hot-update.json 拿到变更模块清单，
      // 再拉 hot-update.js 执行 webpackHotUpdate 合并模块工厂。
      // 这里把两步合成一条 WS 消息，直接调 runtime 的 hotApply 增量替换。
      console.log('[mini-webpack] 收到 hot-update，应用增量更新（不刷新页面）');
      self.__miniWebpackRequire__.hotApply(msg.modules, msg.removed);
    }
  };
})();
`;

function handleRequest(req: IncomingMessage, res: ServerResponse): void {
  const urlPath = (req.url ?? '/').split('?')[0];

  if (urlPath === '/' || urlPath === '/index.html') {
    const html = readFileSync(path.join(root, 'index.html'), 'utf-8').replace(
      '</body>',
      `<script>${HMR_CLIENT}</script></body>`
    );
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
    return;
  }

  // 浏览器只会请求这一个 JS —— 与 Vite 的「N 个模块请求」形成对比
  if (urlPath === '/bundle.js') {
    res.setHeader('Content-Type', 'application/javascript');
    res.end(cachedBundle);
    return;
  }

  res.statusCode = 404;
  res.end('Not Found');
}

function main(): void {
  console.log('[mini-webpack] 启动前必须先完成全量打包...');
  rebuild('启动');

  const server = createServer(handleRequest);

  const wss = new WebSocketServer({ noServer: true });
  const clients = new Set<WebSocket>();
  server.on('upgrade', (req, socket, head) => {
    if (req.url === '/__hmr') {
      wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
    } else {
      socket.destroy();
    }
  });
  wss.on('connection', (ws: WebSocket) => {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
  });

  const onSourceChange = (file: string): void => {
    const prev = cachedGraph;
    rebuild(`${path.basename(file)} 变更`);
    const { modules, removed } = diffModules(prev, cachedGraph);
    const changedCount = Object.keys(modules).length;
    console.log(
      `[mini-webpack] 增量：变更 ${changedCount} 个模块${
        removed.length ? `，删除 ${removed.length} 个` : ''
      }（浏览器只替换这些模块，不整包重取）`
    );
    const data = JSON.stringify({ type: 'update', modules, removed });
    clients.forEach((c) => {
      if (c.readyState === 1) c.send(data);
    });
  };

  // 与 webpack 的 watch 一致：改文件触发增量；新增/删除文件也走同一增量逻辑
  chokidar
    .watch(path.join(root, 'src'), { ignoreInitial: true })
    .on('change', onSourceChange)
    .on('add', onSourceChange)
    .on('unlink', onSourceChange);

  // 端口被占用时自动往后找一个空端口（webpack-dev-server 的 port: 'auto' 同理），
  // 否则 listen 抛出的 EADDRINUSE 是 error 事件，会直接崩掉进程。
  let port = PORT;
  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE' && port < PORT + 10) {
      console.log(`[mini-webpack] 端口 ${port} 被占用，尝试 ${port + 1}`);
      server.listen(++port);
      return;
    }
    throw err;
  });
  server.on('listening', () => {
    console.log(`mini-webpack dev server at http://localhost:${port}`);
  });
  server.listen(port);
}

main();
