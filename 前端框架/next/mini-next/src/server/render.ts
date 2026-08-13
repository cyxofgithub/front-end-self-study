/**
 * SSR 渲染：把页面组件渲染成完整 HTML 字符串。
 *
 * 三个关键动作：
 *   1. renderToString(<App Component pageProps />) —— 在服务端执行 React 组件树
 *   2. 把 pageProps 以 __NEXT_DATA__ 注入 HTML —— 客户端水合时要拿到「同一份数据」，
 *      否则两端渲染结果不一致，hydration 会失败
 *   3. 挂上客户端 entry <script> —— 浏览器加载后执行 hydrateRoot 接管页面
 */
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { NEXT_DATA_ID, ROOT_ID, STATIC_PREFIX } from '../shared/constants';
import type { AppModule, NextData, PageModule } from '../shared/types';

export interface RenderInput {
  appMod: AppModule;
  pageMod: PageModule;
  pageProps: any;
  /** 路由 pattern，如 '/posts/[id]' */
  page: string;
  params: Record<string, string>;
}

export function renderPageToHtml({ appMod, pageMod, pageProps, page, params }: RenderInput): string {
  const App = appMod.default;
  const Component = pageMod.default;

  const appHtml = renderToString(createElement(App, { Component, pageProps }));

  const nextData: NextData = { props: { pageProps }, page, params };
  // 转义 '<'，防止 JSON 中的 '</script>' 提前闭合 script 标签（XSS 防护的最小版本）
  const dataJson = JSON.stringify(nextData).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>mini-next</title></head>
<body>
<div id="${ROOT_ID}">${appHtml}</div>
<script id="${NEXT_DATA_ID}" type="application/json">${dataJson}</script>
<script src="${STATIC_PREFIX}/entry.js" type="module"></script>
</body>
</html>`;
}
