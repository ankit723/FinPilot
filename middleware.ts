// Simple middleware approach compatible with Edge Functions
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)'
];

// Routes for authenticated users only related to onboarding
const authRoutes = [
  '/onboarding(.*)'
];

// Check if the current route is public
const isPublicRoute = (path: string) => {
  return publicRoutes.some(route => {
    const regex = new RegExp(`^${route.replace(/\(.*\)/, '.*')}$`);
    return regex.test(path);
  });
};

// Check if the current route is an auth route
const isAuthRoute = (path: string) => {
  return authRoutes.some(route => {
    const regex = new RegExp(`^${route.replace(/\(.*\)/, '.*')}$`);
    return regex.test(path);
  });
};

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  
  // Add path header for active link detection
  const headers = new Headers(req.headers);
  headers.set("x-pathname", path);
  
  // If the route is public, allow access
  if (isPublicRoute(path)) {
    return NextResponse.next({
      headers
    });
  }

  // Check for auth cookie - simplified approach for Edge compatibility
  // Just checking if the cookie exists, not validating it
  const hasAuthCookie = req.cookies.has('__clerk_db_jwt');
  
  // If the user is not authenticated and trying to access a protected route,
  // redirect to sign-in
  if (!hasAuthCookie) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  
  // Allow the request to continue
  return NextResponse.next({
    headers
  });
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};