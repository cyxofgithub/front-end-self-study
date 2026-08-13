/**
 * _app（对应 pages/_app.tsx）：所有页面的公共外壳。
 * mini-next 在 SSR 与水合时都会用它包裹当前页面组件。
 */
import type { ComponentType } from 'react';
import { Link } from '../src/client/link';

interface AppProps {
  Component: ComponentType<any>;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <nav style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Link href="/">首页(SSG)</Link>
        <Link href="/about">关于(纯静态)</Link>
        <Link href="/ssr">SSR 页</Link>
        <Link href="/posts/1">文章 1</Link>
        <Link href="/posts/2">文章 2</Link>
      </nav>
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  );
}
