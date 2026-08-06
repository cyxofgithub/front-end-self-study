import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware 会在每个请求的页面渲染之前运行
 * 适用场景：身份验证、重定向、请求头处理等
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 示例 1：保护 admin 路由（简单演示——检查 auth cookie）
  // 生产环境中请使用正规的身份验证 token
  if (pathname.startsWith('/blog-admin')) {
    const authCookie = request.cookies.get('isAuthenticated');

    if (!authCookie || authCookie.value !== 'true') {
      // 未登录时重定向到登录页
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 示例 2：为 API 路由添加自定义响应头
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('X-Custom-Header', 'API-Request');
    response.headers.set('X-Request-Time', new Date().toISOString());
    return response;
  }

  // 示例 3：将旧路径重定向到新路径
  if (pathname === '/old-blog') {
    return NextResponse.redirect(new URL('/blog', request.url));
  }

  // 继续处理请求
  return NextResponse.next();
}

/**
 * 配置 middleware 应该作用于哪些路由
 */
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - api（API 路由）
     * - _next/static（静态文件）
     * - _next/image（图片优化文件）
     * - favicon.ico（网站图标文件）
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
