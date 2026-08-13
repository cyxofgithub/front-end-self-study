import type { ComponentType } from 'react';

/** 数据获取函数的上下文（对应 Next.js 的 GetServerSidePropsContext / GetStaticPropsContext 的精简版） */
export interface GetPropsContext {
  /** 动态路由参数，如 /posts/[id] 命中 /posts/1 时 params = { id: '1' } */
  params: Record<string, string>;
  /** query string 解析结果 */
  query: Record<string, string>;
}

/** 页面模块的约定形状：默认导出组件，可选导出数据获取函数 */
export interface PageModule {
  default: ComponentType<any>;
  /** 每次请求都在服务端执行（SSR 数据） */
  getServerSideProps?: (ctx: GetPropsContext) => { props: any } | Promise<{ props: any }>;
  /** 构建期（dev 下为每次请求）执行一次（SSG 数据） */
  getStaticProps?: (ctx: GetPropsContext) => { props: any } | Promise<{ props: any }>;
  /** 动态路由声明要预渲染哪些路径 */
  getStaticPaths?: () => { paths: string[] } | Promise<{ paths: string[] }>;
}

/** 注入 HTML 的 __NEXT_DATA__，客户端水合时读取 */
export interface NextData {
  props: { pageProps: any };
  /** 命中的路由 pattern，如 /posts/[id] */
  page: string;
  params: Record<string, string>;
}

/** _app 模块的约定形状 */
export interface AppModule {
  default: ComponentType<{ Component: ComponentType<any>; pageProps: any }>;
}
