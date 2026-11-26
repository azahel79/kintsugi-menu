import { eq } from 'drizzle-orm';
import { db, schema as s } from '@/db';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Sirve las fotos subidas desde el panel. Cada foto nueva recibe un id nuevo,
 * así que se pueden guardar en caché para siempre.
 */
export async function GET(_req: Request, ctx: RouteContext<'/media/[id]'>) {
  const { id } = await ctx.params;
  if (!UUID.test(id)) return new Response('No encontrada', { status: 404 });

  const [img] = await db.select().from(s.imagenes).where(eq(s.imagenes.id, id)).limit(1);
  if (!img) return new Response('No encontrada', { status: 404 });

  return new Response(Buffer.from(img.data, 'base64'), {
    headers: {
      'Content-Type': img.mime,
      'Content-Length': String(img.bytes),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
