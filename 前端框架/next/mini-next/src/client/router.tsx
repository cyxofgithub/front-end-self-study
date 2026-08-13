/**
 * 客户端路由（对应 next/router + next/link 背后的运行时）。
 *
 * 核心思想：首屏是服务端渲染的完整 HTML；之后的跳转不再刷新页面，
 * 而是由 JS 接管——拉取目标页面的数据 JSON + 动态加载页面 chunk，
 * 然后用 React setState 换掉当前页面组件，配合 pushState 更新地址栏。
 * 这就是「SSR 首屏 + SPA 后续导航」的混合模式。
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import { matchRoute, type RouteEntry } from '../shared/route-match';
import { DATA_PREFIX } from '../shared/constants';
import { pageLoaders, routes } from '../../.mini-next/generated/pages-manifest';
import type { PageModule } from '../shared/types';

export interface RouterValue {
  pathname: string;
  push: (href: string) => void;
  back: () => void;
}

export const RouterContext = createContext<RouterValue | null>(null);

export function useRouter(): RouterValue | null {
  return useContext(RouterContext);
}

interface ClientAppProps {
  App: ComponentType<{ Component: ComponentType<any>; pageProps: any }>;
  initialComponent: ComponentType<any>;
  initialProps: any;
  initialPathname: string;
}

export function ClientApp({ App, initialComponent, initialProps, initialPathname }: ClientAppProps): ReactNode {
  const [state, setState] = useState({
    Component: initialComponent,
    pageProps: initialProps,
    pathname: initialPathname,
  });

  /** 客户端导航：取数据 + 加载页面 chunk + 换组件，全程不刷新页面 */
  async function navigate(href: string, { push = true } = {}) {
    const match = matchRoute(routes as RouteEntry[], href);
    if (!match) {
      window.location.href = href; // 未命中路由表，退化为整页跳转
      return;
    }
    const dataUrl = `${DATA_PREFIX}${href === '/' ? '/index' : href}.json`;
    const [mod, res] = await Promise.all([
      (pageLoaders as Record<string, () => Promise<PageModule>>)[match.entry.pattern](),
      fetch(dataUrl),
    ]);
    const data = (await res.json()) as { pageProps: any };
    if (push) window.history.pushState(null, '', href);
    setState({ Component: mod.default, pageProps: data.pageProps, pathname: href });
  }

  // 浏览器前进/后退时同步页面
  useEffect(() => {
    const onPopState = () => void navigate(window.location.pathname, { push: false });
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const router: RouterValue = {
    pathname: state.pathname,
    push: (href) => void navigate(href),
    back: () => window.history.back(),
  };

  return (
    <RouterContext.Provider value={router}>
      <App Component={state.Component} pageProps={state.pageProps} />
    </RouterContext.Provider>
  );
}
