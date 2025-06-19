import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  if (isAdminRoute) {
    const authCookie = request.cookies.get('admin-auth');
    if (authCookie?.value !== 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 