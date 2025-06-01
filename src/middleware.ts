import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = ['/auth/signin', '/auth/signup', '/'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Check if it's a public route
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Check if it's a protected route (starts with /user or /admin)
  const isProtectedRoute = pathname.startsWith('/user') || pathname.startsWith('/admin');
  
  // If accessing auth pages while logged in, redirect to dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  // If accessing protected routes without token, redirect to signin
  if (isProtectedRoute && !token) {
    // Store the attempted URL to redirect back after login
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
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
    '/auth/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}; 