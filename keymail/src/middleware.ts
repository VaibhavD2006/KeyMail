import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  console.log("Middleware - URL:", request.nextUrl.pathname);
  
  // Skip middleware for Next.js internals and auth API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("Middleware - Token exists:", !!token);
    
    // For debugging
    if (token) {
      console.log("Token User ID:", token.id);
      console.log("Token Provider:", token.provider);
    }

    // Check if the user is authenticated
    if (!token) {
      // If the user is not authenticated and trying to access a protected route
      if (isProtectedRoute(request.nextUrl.pathname)) {
        console.log("Redirecting unauthenticated user to login");
        // Redirect to the login page
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      // If the user is authenticated and trying to access auth pages
      if (isAuthRoute(request.nextUrl.pathname)) {
        console.log("Redirecting authenticated user to dashboard");
        // Redirect to the dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // In case of error, allow the request to proceed
    // This prevents a redirect loop if there's an issue with the token
    return NextResponse.next();
  }
}

// Define which routes are protected (require authentication)
function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = [
    '/dashboard',
    '/api/clients',
    '/api/emails',
    '/api/templates',
  ];
  
  // Check if the path starts with any of the protected paths
  return protectedPaths.some(path => pathname.startsWith(path));
}

// Define which routes are for authentication (login, register)
function isAuthRoute(pathname: string): boolean {
  return pathname === '/login' || pathname === '/register';
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}; 