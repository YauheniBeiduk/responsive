import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const requireAuth: string[] = [
  '/chat',
  '/api',
  '/reporting',
  '/unauthorized',
  '/persona',
  '/prompt',
];
const requireAdmin: string[] = ['/reporting'];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  if (requireAuth.some((path) => pathname.startsWith(path))) {
    const token = await getToken({
      req: request,
    });
    // check if we are in browser
    let isBrowser = !!request.cookies.get('__Secure-next-auth.session-token');
    if (!token && isBrowser) {
      const url = new URL(`/`, request.url);
      return NextResponse.redirect(url);
    }

    if (requireAdmin.some((path) => pathname.startsWith(path))) {
      //check if not authorized
      if (!token?.isAdmin) {
        const url = new URL(`/unauthorized`, request.url);
        return NextResponse.rewrite(url);
      }
    }
  }

  // Language handling
  let locale = request.cookies.get('locale') || 'ro';

  // If locale is not set in cookies, set the default locale
  if (!request.cookies.get('locale')) {
    res.cookies.set('locale', locale as string);
  }

  // Add the locale to the request headers for further processing in your app
  request.headers.set('Accept-Language', locale as string);

  return res;
}

// note that middleware is not applied to api/auth as this is required to logon (i.e. requires anon access)
export const config = {
  matcher: [
    '/unauthorized/:path*',
    '/reporting/:path*',
    '/api/chat:path*',
    '/api/images:path*',
    '/chat/:path*',
  ],
};
