/**
 * 动态路由页：pages/posts/[id].tsx -> /posts/:id
 * getStaticPaths 声明构建期要预渲染哪些路径；getStaticProps 按 params 逐条取数。
 */
export default function Post({ id, title }: { id: string; title: string }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>本页由动态路由 /posts/[id] 渲染，当前 id = {id}</p>
      <p>试试把地址栏改成 /posts/1、/posts/2、/posts/3（构建期已预渲染这三条路径）。</p>
    </div>
  );
}

export function getStaticPaths() {
  return { paths: ['/posts/1', '/posts/2', '/posts/3'] };
}

export function getStaticProps({ params }: { params: Record<string, string> }) {
  return { props: { id: params.id, title: `文章 ${params.id}` } };
}
