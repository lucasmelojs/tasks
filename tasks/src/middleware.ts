// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;
  
  // Update the paths to match the new structure
  const isAuthPage = pathname.startsWith('/auth/');
  
  // If there's no session and trying to access protected routes
  if (!session && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // If there's a session and trying to access auth pages
  if (session && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};