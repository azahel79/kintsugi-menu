import 'server-only';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const SESSION_COOKIE = 'kintsugi_sesion';
const DURACION = 60 * 60 * 24 * 7; // 7 días

function clave() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error('AUTH_SECRET falta o es muy corto (.env.local).');
  return new TextEncoder().encode(secret);
}

export async function crearSesion(uid: number) {
  const token = await new SignJWT({ uid })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${DURACION}s`)
    .sign(clave());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DURACION,
  });
}

export async function cerrarSesion() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function verificarToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, clave(), { algorithms: ['HS256'] });
    return typeof payload.uid === 'number' ? { uid: payload.uid } : null;
  } catch {
    return null;
  }
}

/** Úsalo al inicio de cada página y acción del panel. */
export async function requireAdmin() {
  const sesion = await verificarToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!sesion) redirect('/admin/login');
  return sesion;
}
