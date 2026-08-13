/**
 * 静态伺服（对应 `next start` 之于纯 SSG 站点）。
 * 只读 .mini-next/export/ 下的静态文件——没有 renderToString、没有数据获取函数执行，
 * 用它对比 dev 模式可以直观感受 SSG（构建期渲染）与 SSR（请求期渲染）的区别。
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { BUILD_DIR } from '../shared/constants';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.map': 'application/json',
};

const root = process.cwd();
const exportDir = path.join(root, BUILD_DIR, 'export');

if (!fs.existsSync(exportDir)) {
  console.error(`找不到 ${BUILD_DIR}/export/，请先运行 pnpm build`);
  process.exit(1);
}

http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    let file = path.join(exportDir, pathname);

    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      file = path.join(file, 'index.html');
    } else if (!fs.existsSync(file) && !path.extname(pathname)) {
      file = path.join(exportDir, pathname, 'index.html');
    }

    if (!fs.existsSync(file)) {
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      return res.end('404');
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(3000, () => console.log('mini-next static server: http://localhost:3000 （纯静态伺服，无服务端渲染）'));
