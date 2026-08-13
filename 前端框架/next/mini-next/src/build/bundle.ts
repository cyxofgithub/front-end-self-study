/**
 * 构建管线：esbuild 双端构建。
 *
 * 对应 Next.js 中 webpack/turbopack 的角色，但只做最必要的两件事：
 *   1. 服务端构建：pages/ 下每个文件打成 CJS，供 Node require 后执行 SSR / 数据获取
 *   2. 客户端构建：entry.tsx 打成 ESM，利用 esbuild 的 code splitting，
 *      让每个动态 import() 的页面成为独立 chunk（对应 Next.js 的按路由分包）
 *
 * 同时生成「客户端清单」（pages-manifest）：路由 pattern -> 页面 chunk 的加载函数。
 * 客户端水合与导航时按它找到要加载的 chunk。
 */
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { BUILD_DIR } from '../shared/constants';
import { RouteTables } from '../server/router';

const require_ = createRequire(import.meta.url);

export interface BuildContext {
  serverCtx: esbuild.BuildContext;
  clientCtx: esbuild.BuildContext;
  tables: RouteTables;
}

/** 生成 .mini-next/generated/pages-manifest.ts（客户端路由清单） */
function writeClientManifest(root: string, tables: RouteTables): void {
  const lines = tables.pageRoutes.map(
    (r) => `  ${JSON.stringify(r.pattern)}: () => import('../../pages/${r.filePath}'),`
  );
  const routesJson = JSON.stringify(tables.pageRoutes, null, 2);
  const content = `// 本文件由 src/build/bundle.ts 在构建时生成，请勿手改
export const routes = ${routesJson};
export const pageLoaders = {
${lines.join('\n')}
};
export { default as App } from '../../pages/_app';
`;
  const outDir = path.join(root, BUILD_DIR, 'generated');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'pages-manifest.ts'), content);
}

/** 服务端构建用 CJS + require，rebuild 后清掉 require 缓存以加载新代码（dev 热更新） */
function clearServerRequireCache(root: string): void {
  const serverOut = path.join(root, BUILD_DIR, 'server');
  for (const key of Object.keys(require_.cache)) {
    if (key.startsWith(serverOut)) delete require_.cache[key];
  }
}

export async function createBuild(root: string, pagesDir: string, tables: RouteTables): Promise<BuildContext> {
  writeClientManifest(root, tables);

  const pageFiles = ['_app', ...tables.pageRoutes.map((r) => r.filePath), ...tables.apiRoutes.map((r) => r.filePath)];

  const invalidatePlugin: esbuild.Plugin = {
    name: 'invalidate-require-cache',
    setup(build) {
      build.onEnd(() => clearServerRequireCache(root));
    },
  };

  const serverCtx = await esbuild.context({
    entryPoints: pageFiles.map((f) => path.join(pagesDir, f + '.tsx')).map((p) => (fs.existsSync(p) ? p : p.replace(/\.tsx$/, '.ts'))),
    outbase: pagesDir,
    outdir: path.join(root, BUILD_DIR, 'server'),
    format: 'cjs',
    platform: 'node',
    bundle: true,
    jsx: 'automatic',
    // react 在服务端不打进 bundle，直接使用 node_modules 里的，保证 SSR 与客户端 hydrate 用的是同一份 React 约定
    external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'],
    plugins: [invalidatePlugin],
    logLevel: 'warning',
  });

  const clientCtx = await esbuild.context({
    entryPoints: [path.join(root, 'src/client/entry.tsx')],
    outdir: path.join(root, BUILD_DIR, 'static'),
    format: 'esm',
    platform: 'browser',
    bundle: true,
    splitting: true, // 动态 import() 的每个页面输出为独立 chunk -> 按路由分包
    jsx: 'automatic',
    logLevel: 'warning',
  });

  return { serverCtx, clientCtx, tables };
}
