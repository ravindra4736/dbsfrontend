/**
 * Middleware for Route Protection
 * Protects admin routes by checking authentication status
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/admin/login', '/unauthorized', '/forbidden'];

// Routes that require authentication
const protectedRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // Special case: redirect authenticated users away from login
    if (pathname === '/admin/login') {
      const accessToken = request.cookies.get('accessToken')?.value;
      if (accessToken) {
        const dashboardUrl = new URL('/admin', request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
    return NextResponse.next();
  }

  // Check if the route is protected
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      // No token found, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Token exists, allow access with cache control to prevent back-button access
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // For all other routes, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
