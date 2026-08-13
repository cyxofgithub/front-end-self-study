/**
 * 静态导出（对应 `next build` 的 SSG 部分）。
 *
 * 与 dev 模式的 SSR 用同一套 render 管线，区别在于执行时机：
 * 所有页面在「构建期」渲染成 HTML 落盘，请求期只是静态文件伺服——这就是 SSG 的本质。
 *
 * 动态路由（如 /posts/[id]）通过 getStaticPaths 声明要预渲染哪些路径，逐个展开。
 * 同时导出每个页面的 /_next/data/*.json，使静态站点上的客户端导航也能拿到数据。
 */
import fs from 'node:fs';
import path from 'node:path';
import { scanPages } from './router';
import { createBuild } from '../build/bundle';
import { matchRoute } from '../shared/route-match';
import { loadAppModule, loadPageModule } from './page-loader';
import { resolvePageProps } from './data';
import { renderPageToHtml } from './render';
import { BUILD_DIR } from '../shared/constants';

async function main() {
  const root = process.cwd();
  const pagesDir = path.join(root, 'pages');
  const tables = scanPages(pagesDir);
  const { serverCtx, clientCtx } = await createBuild(root, pagesDir, tables);
  await Promise.all([serverCtx.rebuild(), clientCtx.rebuild()]);
  await Promise.all([serverCtx.dispose(), clientCtx.dispose()]);

  const exportDir = path.join(root, BUILD_DIR, 'export');
  fs.rmSync(exportDir, { recursive: true, force: true });
  fs.mkdirSync(exportDir, { recursive: true });
  fs.cpSync(path.join(root, BUILD_DIR, 'static'), path.join(exportDir, '_next', 'static'), { recursive: true });

  const appMod = loadAppModule(root);

  for (const entry of tables.pageRoutes) {
    const pageMod = loadPageModule(root, entry.filePath);

    // 展开要预渲染的路径：静态路由只有自己；动态路由由 getStaticPaths 声明
    const paths: { pathname: string; params: Record<string, string> }[] = [];
    if (entry.pattern.includes('[')) {
      if (!pageMod.getStaticPaths) {
        throw new Error(`动态路由 ${entry.pattern} 在静态导出时必须提供 getStaticPaths`);
      }
      for (const p of (await pageMod.getStaticPaths()).paths) {
        const m = matchRoute([entry], p);
        if (m) paths.push({ pathname: p, params: m.params });
      }
    } else {
      paths.push({ pathname: entry.pattern, params: {} });
    }

    for (const { pathname, params } of paths) {
      const pageProps = await resolvePageProps(pageMod, { params, query: {} });
      const html = renderPageToHtml({ appMod, pageMod, pageProps, page: entry.pattern, params });

      const dir = pathname === '/' ? exportDir : path.join(exportDir, pathname);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), html);

      // 与 dev-server 的 URL 约定一致：/_next/data/about.json、/_next/data/index.json（首页）
      const dataFile = path.join(exportDir, '_next', 'data', (pathname === '/' ? '/index' : pathname) + '.json');
      fs.mkdirSync(path.dirname(dataFile), { recursive: true });
      fs.writeFileSync(dataFile, JSON.stringify({ pageProps }));

      console.log(`✓ 预渲染 ${pathname}`);
    }
  }

  console.log(`\n构建完成，静态产物在 ${BUILD_DIR}/export/，运行 pnpm start 伺服`);
}

void main();
