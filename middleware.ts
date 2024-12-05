import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
    // Check if user is authenticated
  if (token) {
    // Get user's onboarding status
    const hasCompletedOnboarding = token.hasCompletedOnboarding;

    // If user is signed in and trying to access the landing page
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    
    // If user hasn't completed onboarding and isn't on the onboarding page
    if (!hasCompletedOnboarding && 
        !request.nextUrl.pathname.startsWith('/welcome') && 
        !request.nextUrl.pathname.startsWith('/api/')) {  // Add this condition
      return NextResponse.redirect(new URL('/welcome', request.url));
    }
    
    // If user has completed onboarding and tries to access onboarding page
    if (hasCompletedOnboarding && request.nextUrl.pathname.startsWith('/welcome')) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
      '/home',
      '/welcome',
      '/',
      '/api/onboarding'  // Add this to ensure middleware runs for onboarding
  ]
};