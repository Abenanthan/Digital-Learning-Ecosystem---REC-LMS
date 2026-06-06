import { NextRequest, NextResponse } from 'next/server';

const protectedPrefixes = [
  '/admin',
  '/teacher',
  '/student',
  '/dashboard',
  '/courses',
  '/settings',
  '/progress',
];

function isProtectedPath(pathname: string): boolean {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasRefreshToken = Boolean(request.cookies.get('refreshToken')?.value);

  if (isProtectedPath(pathname) && !hasRefreshToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
