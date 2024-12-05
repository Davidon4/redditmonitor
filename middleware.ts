import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const licenseKey = request.cookies.get('license_key');
  
  if (!licenseKey && !request.nextUrl.pathname.startsWith('/api/verify-license')) {
    return NextResponse.redirect(new URL('/license', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/welcome/:path*',
    '/home/:path*',
    '/api/:path*',
    '/license'
  ]
};