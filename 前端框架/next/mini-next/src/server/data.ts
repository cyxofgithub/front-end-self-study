/**
 * 数据获取：执行页面模块导出的 getServerSideProps / getStaticProps。
 *
 * 两种数据获取的本质区别不在 API 形状，而在「执行时机」：
 *   - getServerSideProps：每个请求到达时执行（请求期），能拿到 req/query 等请求上下文
 *   - getStaticProps：构建期执行一次（dev 下退化为每次请求执行），结果可落盘复用
 */
import type { GetPropsContext, PageModule } from '../shared/types';

export async function resolvePageProps(mod: PageModule, ctx: GetPropsContext): Promise<any> {
  if (mod.getServerSideProps) {
    const result = await mod.getServerSideProps(ctx);
    return result.props;
  }
  if (mod.getStaticProps) {
    const result = await mod.getStaticProps(ctx);
    return result.props;
  }
  return {};
}
