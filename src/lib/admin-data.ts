import 'server-only';
import { asc, eq } from 'drizzle-orm';
import { db, schema as s } from '@/db';
import { requireAdmin } from '@/lib/session';

/* Lecturas del panel: siempre frescas (sin caché) y solo con sesión válida. */

export async function adminCatalogo() {
  await requireAdmin();
  const [secciones, categorias, productos] = await Promise.all([
    db.select().from(s.secciones).orderBy(asc(s.secciones.orden)),
    db.select().from(s.categorias).orderBy(asc(s.categorias.orden)),
    db.select().from(s.productos).orderBy(asc(s.productos.orden), asc(s.productos.nombre)),
  ]);
  return { secciones, categorias, productos };
}

export async function adminProducto(id: string) {
  await requireAdmin();
  const [p] = await db.select().from(s.productos).where(eq(s.productos.id, id)).limit(1);
  return p ?? null;
}

export async function adminPromos() {
  await requireAdmin();
  const [promos, rel, productos] = await Promise.all([
    db.select().from(s.promociones).orderBy(asc(s.promociones.orden), asc(s.promociones.createdAt)),
    db.select().from(s.promocionProductos),
    db.select({ id: s.productos.id, nombre: s.productos.nombre, categoriaId: s.productos.categoriaId }).from(s.productos).orderBy(asc(s.productos.orden)),
  ]);
  return {
    promos: promos.map((p) => ({ ...p, productos: rel.filter((r) => r.promocionId === p.id).map((r) => r.productoId) })),
    productos,
  };
}

export async function adminSushi() {
  await requireAdmin();
  const [config, ingredientes, categorias] = await Promise.all([
    db.select().from(s.sushiConfig),
    db.select().from(s.sushiIngredientes).orderBy(asc(s.sushiIngredientes.orden)),
    db.select().from(s.categorias).where(eq(s.categorias.armable, true)),
  ]);
  const rollos = categorias.length
    ? await db.select().from(s.productos).where(eq(s.productos.categoriaId, categorias[0].id)).orderBy(asc(s.productos.orden))
    : [];
  return { config: config[0] ?? { id: 1, incluidos: 3, extraVerdura: 15, extraProteina: 25 }, ingredientes, rollos, catSushi: categorias[0] ?? null };
}

export async function adminNegocio() {
  await requireAdmin();
  const [[negocio], secciones] = await Promise.all([db.select().from(s.negocio).limit(1), db.select().from(s.secciones).orderBy(asc(s.secciones.orden))]);
  return { negocio, secciones };
}
