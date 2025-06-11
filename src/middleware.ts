import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
// const publicRoutes = ['/', '/signin', '/auth/signin', '/auth/signup'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const adminToken = request.cookies.get('admin_token')?.value;
  const { pathname } = request.nextUrl;

  // Define public routes
  const isAdminLoginPage = pathname === '/login';
  const isUserLoginPage = pathname === '/signin';
  const isUserRoute = pathname.startsWith('/user');
  const isAdminRoute = pathname.startsWith('/admin');
  
  // Check if it's a public route
  // const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/'));
  
  // If already logged in and trying to access login pages, redirect to respective dashboards
  if (isUserLoginPage && token) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  if (isAdminLoginPage && adminToken) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Handle user routes protection
  if (isUserRoute && !token) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Handle admin routes protection
  if (isAdminRoute && !isAdminLoginPage && !adminToken) {
    const adminLoginUrl = new URL('/login', request.url);
    adminLoginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(adminLoginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes starting with /user or /admin
     * Match auth routes
     * Don't match api routes
     * Don't match static files
     */
    '/user/:path*',
    '/admin/:path*',
    '/login',
    '/signin',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}; 