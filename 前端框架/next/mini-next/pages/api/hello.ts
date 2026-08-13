/**
 * API Route（对应 pages/api/*）：默认导出一个 (req, res) => void 处理器。
 * 它不是页面，不会被路由到 React 渲染管线，而是直接由服务器调用。
 */
export default function handler(req: any, res: any) {
  res.json({
    message: 'hello from mini-next api',
    query: req.query ?? {},
    time: new Date().toISOString(),
  });
}
