/**
 * 路由模式匹配（服务端与客户端共用）。
 *
 * Next.js 的文件系统路由约定：
 *   pages/index.tsx      -> /
 *   pages/about.tsx      -> /about
 *   pages/posts/[id].tsx -> /posts/:id   （[param] 是动态段）
 *
 * 本文件只负责「pattern -> 正则」与「pathname -> 命中 + params」，
 * 不关心路由表是怎么来的（服务端从 fs 扫描，客户端从构建期生成的 manifest 读取）。
 */

export interface RouteEntry {
  /** 路由模式，如 '/posts/[id]' */
  pattern: string;
  /** pages/ 下的相对路径（无扩展名），如 'posts/[id]'，用于定位构建产物 */
  filePath: string;
}

interface CompiledRoute extends RouteEntry {
  regex: RegExp;
  paramNames: string[];
}

/** 把 '/posts/[id]' 编译成正则 /^\/posts\/([^/]+)$/ 与参数名列表 ['id'] */
export function compilePattern(entry: RouteEntry): CompiledRoute {
  const paramNames: string[] = [];
  const source = entry.pattern.replace(/\[([^/[\]]+)\]/g, (_, name: string) => {
    paramNames.push(name);
    return '([^/]+)';
  });
  return { ...entry, regex: new RegExp(`^${source}$`), paramNames };
}

/**
 * 排序规则：静态段多的排前面，保证 '/posts/all' 优先于 '/posts/[id]'。
 * 对应 Next.js 中 predefined routes 优先于 dynamic routes 的规则。
 */
export function sortRoutes<T extends RouteEntry>(entries: T[]): T[] {
  const score = (pattern: string) =>
    pattern
      .split('/')
      .filter(Boolean)
      .reduce((sum, seg) => sum + (seg.startsWith('[') ? 1 : 10), 0);
  return [...entries].sort((a, b) => score(b.pattern) - score(a.pattern));
}

export interface RouteMatch {
  entry: RouteEntry;
  params: Record<string, string>;
}

/** 用 pathname 依次匹配路由表，返回命中的路由与动态参数 */
export function matchRoute(entries: RouteEntry[], pathname: string): RouteMatch | null {
  const path = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  for (const entry of entries) {
    const { regex, paramNames } = compilePattern(entry);
    const m = regex.exec(path);
    if (m) {
      const params: Record<string, string> = {};
      paramNames.forEach((name, i) => {
        params[name] = decodeURIComponent(m[i + 1]);
      });
      return { entry, params };
    }
  }
  return null;
}
