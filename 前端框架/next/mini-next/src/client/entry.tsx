/**
 * 客户端水合入口（对应 Next.js 客户端运行时的入口）。
 *
 * 水合（hydration）：服务端已经把组件渲染成 HTML 字符串发到浏览器，
 * 这里用「同一个组件 + 同一份 pageProps」对这些已有 DOM 调用 hydrateRoot，
 * React 复用现有 DOM、只补上事件监听等运行时能力，页面从「静态 HTML」变成「可交互应用」。
 */
import { hydrateRoot } from 'react-dom/client';
import { App, pageLoaders } from '../../.mini-next/generated/pages-manifest';
import { NEXT_DATA_ID, ROOT_ID } from '../shared/constants';
import type { NextData, PageModule } from '../shared/types';
import { ClientApp } from './router';

async function main() {
  // 服务端注入的页面数据：水合必须用同一份 props，两端渲染结果才一致
  const data = JSON.parse(document.getElementById(NEXT_DATA_ID)!.textContent!) as NextData;
  const mod = (await (pageLoaders as Record<string, () => Promise<PageModule>>)[data.page]()) as PageModule;

  hydrateRoot(
    document.getElementById(ROOT_ID)!,
    <ClientApp
      App={App}
      initialComponent={mod.default}
      initialProps={data.props.pageProps}
      initialPathname={window.location.pathname}
    />
  );
}

void main();
