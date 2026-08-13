/**
 * 首页：getStaticProps + useState 计数器。
 * 计数器可点击 = 水合成功；message 出现在 HTML 源码中 = 服务端渲染成功。
 */
import { useState } from 'react';

export default function Home({ message }: { message: string }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>mini-next 首页</h1>
      <p>{message}</p>
      <button onClick={() => setCount((c) => c + 1)}>count: {count}（点我验证水合）</button>
    </div>
  );
}

export function getStaticProps() {
  return {
    props: { message: '这段文字由 getStaticProps 在服务端产生，写进了 HTML（可查看网页源码验证）' },
  };
}
