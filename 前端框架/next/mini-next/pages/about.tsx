/** 纯静态页面：没有任何数据获取函数，props 为空 */
import { useRouter } from '../src/client/router';

export default function About() {
  const router = useRouter();
  return (
    <div>
      <h1>关于 mini-next</h1>
      <p>本页没有导出任何数据获取函数，是一个纯静态页面。</p>
      <p>当前路径（来自 useRouter）：{router?.pathname ?? '（服务端渲染中）'}</p>
      <button onClick={() => router?.push('/posts/3')}>用 useRouter().push 跳到文章 3</button>
    </div>
  );
}
