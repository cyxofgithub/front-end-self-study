/**
 * SSR 页：getServerSideProps 在「每个请求」到达时于服务端执行。
 * 连续刷新页面，时间戳每次都变——这是它与 getStaticProps 最直观的区别。
 */
export default function SsrPage({ serverTime, url }: { serverTime: string; url: string }) {
  return (
    <div>
      <h1>SSR 页面</h1>
      <p>本次请求的服务端时间：{serverTime}</p>
      <p>连续刷新，时间会变化（每次都重新执行 getServerSideProps）。</p>
      <p>试试在地址栏加 query（/ssr?a=1），getServerSideProps 能拿到：{url}</p>
    </div>
  );
}

export function getServerSideProps(ctx: { params: Record<string, string>; query: Record<string, string> }) {
  return {
    props: {
      serverTime: new Date().toISOString(),
      url: `query = ${JSON.stringify(ctx.query)}`,
    },
  };
}
