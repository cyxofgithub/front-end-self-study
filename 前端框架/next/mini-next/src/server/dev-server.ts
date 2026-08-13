/**
 * 开发服务器（对应 `next dev`）。
 *
 * 请求分发顺序：
 *   /_next/static/*  -> 客户端构建产物（entry.js 与各页面 chunk）
 *   /api/*           -> API Routes（pages/api/ 下文件的默认导出函数）
 *   /_next/data/*    -> 客户端导航时的数据请求：只跑数据获取函数、返回 JSON，不渲染 HTML
 *   其余             -> 页面 SSR：匹配路由 -> 跑数据获取 -> renderToString -> 完整 HTML
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { scanPages } from './router';
import { createBuild } from '../build/bundle';
import { matchRoute } from '../shared/route-match';
import { loadAppModule, loadPageModule } from './page-loader';
import { resolvePageProps } from './data';
import { renderPageToHtml } from './render';
import { BUILD_DIR, DATA_PREFIX, STATIC_PREFIX } from '../shared/constants';

const MIME: Record<string, string> = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.map': 'application/json',
    '.json': 'application/json',
    '.html': 'text/html; charset=utf-8',
};

function send(
    res: http.ServerResponse,
    status: number,
    body: string,
    contentType = 'text/html; charset=utf-8'
) {
    res.writeHead(status, { 'content-type': contentType });
    res.end(body);
}

async function main() {
    const root = process.cwd();
    const pagesDir = path.join(root, 'pages');
    const tables = scanPages(pagesDir);
    console.log('🚀 ~ main ~ tables:', tables);
    const { serverCtx, clientCtx } = await createBuild(root, pagesDir, tables);

    await Promise.all([serverCtx.rebuild(), clientCtx.rebuild()]);
    await Promise.all([serverCtx.watch(), clientCtx.watch()]); // 文件变更自动重建；服务端产物重建后会清 require 缓存

    const server = http.createServer(async (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const pathname = decodeURIComponent(url.pathname);
        console.log('🚀 ~ main ~ pathname:', pathname);

        try {
            // 1. 客户端静态产物
            if (pathname.startsWith(STATIC_PREFIX + '/')) {
                const file = path.join(
                    root,
                    BUILD_DIR,
                    'static',
                    pathname.slice(STATIC_PREFIX.length)
                );
                if (!fs.existsSync(file) || !fs.statSync(file).isFile())
                    return send(res, 404, 'not found');
                res.writeHead(200, {
                    'content-type':
                        MIME[path.extname(file)] ?? 'application/octet-stream',
                });
                return fs.createReadStream(file).pipe(res);
            }

            // 2. API Routes：默认导出 (req, res) => void
            const apiMatch = matchRoute(tables.apiRoutes, pathname);
            if (apiMatch) {
                const mod = loadPageModule(root, apiMatch.entry.filePath);
                const handler = mod.default as any;
                (res as any).json = (data: unknown) =>
                    send(res, 200, JSON.stringify(data), 'application/json');
                (req as any).query = Object.fromEntries(url.searchParams);
                return await handler(req, res);
            }

            // 3. 页面数据请求（客户端导航时由客户端路由发起）
            if (pathname.startsWith(DATA_PREFIX + '/')) {
                const pagePath =
                    pathname.slice(DATA_PREFIX.length).replace(/\.json$/, '') ||
                    '/';
                const match = matchRoute(
                    tables.pageRoutes,
                    pagePath === '/index' ? '/' : pagePath
                );
                if (!match) return send(res, 404, '{}', 'application/json');
                const mod = loadPageModule(root, match.entry.filePath);
                const pageProps = await resolvePageProps(mod, {
                    params: match.params,
                    query: Object.fromEntries(url.searchParams),
                });
                return send(
                    res,
                    200,
                    JSON.stringify({ pageProps }),
                    'application/json'
                );
            }

            // 4. 页面 SSR：路由匹配 -> 加载模块 -> 取数 -> 渲染成 HTML

            // (1) 路由匹配：用请求 pathname 去路由表里找命中项，拿到页面文件位置与动态参数
            //     例如 '/posts/1' 命中 '/posts/[id]'，得到 entry.filePath='posts/[id]'、params={id:'1'}
            const match = matchRoute(tables.pageRoutes, pathname);
            if (!match)
                return send(
                    res,
                    404,
                    `404 | 没有命中任何页面路由: ${pathname}`
                );

            // (2) 加载页面模块：require 服务端构建产物（.mini-next/server/posts/[id].js）
            //     拿到默认导出的组件 + 可选的 getServerSideProps / getStaticProps
            const pageMod = loadPageModule(root, match.entry.filePath);

            // (3) 加载 _app 模块：所有页面的公共外壳，SSR 时会用它包裹当前页面组件
            const appMod = loadAppModule(root);
            1;
            // (4) 取数：执行页面导出的数据获取函数（有 gSSP 走 gSSP，否则 gSP，都没有则空 props）
            //     结果 pageProps 会作为 props 传给组件，并以 __NEXT_DATA__ 注入 HTML 供水合复用
            const pageProps = await resolvePageProps(pageMod, {
                params: match.params,
                query: Object.fromEntries(url.searchParams),
            });

            // (5) 渲染：renderToString 执行组件树得到 HTML 字符串，并拼出完整页面
            //     （含 __NEXT_DATA__ 与 entry.js 引用），首屏即有内容、浏览器再水合接管
            const html = renderPageToHtml({
                appMod,
                pageMod,
                pageProps,
                page: match.entry.pattern,
                params: match.params,
            });
            send(res, 200, html);
        } catch (err) {
            console.error(err);
            send(res, 500, `<pre>${String(err)}</pre>`);
        }
    });

    server.listen(3000, () => {
        console.log('mini-next dev server: http://localhost:3000');
        console.log(
            '路由表:\n' +
                tables.pageRoutes
                    .map(
                        (r) =>
                            `  ${r.pattern.padEnd(16)} <- pages/${r.filePath}`
                    )
                    .join('\n')
        );
    });
}

void main();
