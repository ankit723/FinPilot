import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/'
]);

const isOnboardingRoute = createRouteMatcher([
  '/onboarding(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  
  try {
    // Protect all other routes
    const { userId } = await auth.protect();
    
    // Allow onboarding routes for authenticated users
    if (isOnboardingRoute(req)) {
      return NextResponse.next();
    }
    
    // Set path header for active link detection
    const headers = new Headers();
    headers.set("x-pathname", req.nextUrl.pathname);
    
    return NextResponse.next({ headers });
  } catch (error) {
    // If auth protection fails, redirect to sign-in
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};