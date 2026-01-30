import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware runs on every request before the page is rendered
 * Use it for: authentication, redirects, header manipulation, etc.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Example 1: Protect admin routes (simple demo - check for auth cookie)
  // In production, use proper authentication tokens
  if (pathname.startsWith('/blog-admin')) {
    const authCookie = request.cookies.get('isAuthenticated');

    if (!authCookie || authCookie.value !== 'true') {
      // Redirect to login page if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Example 2: Add custom headers to API routes
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('X-Custom-Header', 'API-Request');
    response.headers.set('X-Request-Time', new Date().toISOString());
    return response;
  }

  // Example 3: Redirect old paths to new paths
  if (pathname === '/old-blog') {
    return NextResponse.redirect(new URL('/blog', request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
