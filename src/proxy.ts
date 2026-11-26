import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

const COOKIE = 'kintsugi_sesion';

async function valido(token?: string) {
  if (!token || !process.env.AUTH_SECRET) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET), { algorithms: ['HS256'] });
    return true;
  } catch {
    return false;
  }
}

/**
 * Revisión rápida del panel: sin sesión válida no se entra a /admin.
 * (La verificación definitiva se repite en cada página y acción con requireAdmin.)
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ok = await valido(request.cookies.get(COOKIE)?.value);
  const esLogin = pathname === '/admin/login';

  if (!ok && !esLogin) return NextResponse.redirect(new URL('/admin/login', request.url));
  if (ok && esLogin) return NextResponse.redirect(new URL('/admin', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
