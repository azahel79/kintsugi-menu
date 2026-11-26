'use server';

import bcrypt from 'bcryptjs';
import { eq, inArray, max, sql } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db, schema as s } from '@/db';
import { MENU_TAG } from '@/lib/menu';
import { cerrarSesion, crearSesion, requireAdmin } from '@/lib/session';

export type Estado = { ok?: boolean; error?: string; mensaje?: string } | null;

// Las fotos llegan ya reducidas desde el navegador (~1 MB); 4 MB es el margen bajo el límite de Vercel (4.5 MB).
const MAX_IMG = 4 * 1024 * 1024;
const TIPOS_IMG = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
// Hash de relleno: si el correo no existe se compara igual, para no revelar qué correos son válidos.
const HASH_RELLENO = bcrypt.hashSync('kintsugi-relleno', 10);

/* ---------------- utilidades ---------------- */

function slug(t: string) {
  return (
    t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) ||
    'item'
  );
}

async function idUnico(base: string, existe: (id: string) => Promise<boolean>) {
  const raiz = slug(base);
  let id = raiz;
  for (let n = 2; await existe(id); n++) id = `${raiz}-${n}`;
  return id;
}

const texto = (max = 300) => z.string().trim().max(max).default('');
const imagenUrl = z
  .string()
  .trim()
  .refine((v) => v === '' || /^\/(img|media)\/[\w./-]+$/.test(v), 'Imagen no válida')
  .transform((v) => v || null);
const numero = z.coerce.number({ message: 'Escribe un número' }).min(0, 'No puede ser negativo').max(100000);

function primerError(e: z.ZodError) {
  return e.issues[0]?.message ?? 'Revisa los datos';
}

function lista(v: FormDataEntryValue | null) {
  return String(v ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 20);
}

/** Borra una foto de /media si ya nadie la usa. */
async function borrarSiHuerfana(url: string | null | undefined) {
  const id = url?.match(/^\/media\/([0-9a-f-]{36})$/i)?.[1];
  if (!id) return;
  const [uso] = await db.execute<{ n: number }>(sql`
    select (
      (select count(*) from ${s.productos} where ${s.productos.img} = ${url}) +
      (select count(*) from ${s.promociones} where ${s.promociones.img} = ${url}) +
      (select count(*) from ${s.secciones} where ${s.secciones.fondo} = ${url}) +
      (select count(*) from ${s.negocio} where ${s.negocio.portada} = ${url} or ${s.negocio.mascota} = ${url})
    )::int as n`).then((r) => r.rows);
  if (!uso?.n) await db.delete(s.imagenes).where(eq(s.imagenes.id, id));
}

function refrescarMenu() {
  updateTag(MENU_TAG);
}

/* ---------------- sesión ---------------- */

export async function login(_prev: Estado, fd: FormData): Promise<Estado> {
  const datos = z
    .object({ email: z.string().trim().toLowerCase().email('Correo no válido'), password: z.string().min(1, 'Escribe tu contraseña').max(200) })
    .safeParse({ email: fd.get('email'), password: fd.get('password') });
  if (!datos.success) return { error: primerError(datos.error) };

  const [u] = await db.select().from(s.adminUsuarios).where(eq(s.adminUsuarios.email, datos.data.email)).limit(1);
  const ok = u ? await bcrypt.compare(datos.data.password, u.passwordHash) : await bcrypt.compare(datos.data.password, HASH_RELLENO);
  if (!u || !ok) return { error: 'Correo o contraseña incorrectos.' };

  await crearSesion(u.id);
  redirect('/admin');
}

export async function logout() {
  await cerrarSesion();
  redirect('/admin/login');
}

export async function cambiarPassword(_prev: Estado, fd: FormData): Promise<Estado> {
  const { uid } = await requireAdmin();
  const d = z
    .object({
      actual: z.string().min(1, 'Escribe tu contraseña actual'),
      nueva: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres').max(200),
      confirmar: z.string(),
    })
    .refine((v) => v.nueva === v.confirmar, { message: 'Las contraseñas nuevas no coinciden' })
    .safeParse(Object.fromEntries(fd));
  if (!d.success) return { error: primerError(d.error) };

  const [u] = await db.select().from(s.adminUsuarios).where(eq(s.adminUsuarios.id, uid)).limit(1);
  if (!u || !(await bcrypt.compare(d.data.actual, u.passwordHash))) return { error: 'La contraseña actual no es correcta.' };
  await db.update(s.adminUsuarios).set({ passwordHash: await bcrypt.hash(d.data.nueva, 12) }).where(eq(s.adminUsuarios.id, uid));
  return { ok: true, mensaje: 'Contraseña actualizada' };
}

/* ---------------- imágenes ---------------- */

export async function subirImagen(fd: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const f = fd.get('archivo');
  if (!(f instanceof File) || f.size === 0) return { error: 'No se recibió la imagen.' };
  if (!TIPOS_IMG.includes(f.type)) return { error: 'Formato no permitido (usa JPG, PNG o WebP).' };
  if (f.size > MAX_IMG) return { error: 'La imagen pesa demasiado (máx. 4 MB).' };

  const data = Buffer.from(await f.arrayBuffer()).toString('base64');
  const [img] = await db.insert(s.imagenes).values({ mime: f.type, bytes: f.size, data }).returning({ id: s.imagenes.id });
  await limpiarHuerfanas();
  return { url: `/media/${img.id}` };
}

/**
 * Fotos que se subieron pero nunca se guardaron en un formulario (p. ej. el dueño
 * canceló). Se borran después de 24 h para no llenar la base de datos.
 */
async function limpiarHuerfanas() {
  await db.execute(sql`
    delete from ${s.imagenes} i
    where i.created_at < now() - interval '24 hours'
      and not exists (select 1 from ${s.productos} where img = '/media/' || i.id::text)
      and not exists (select 1 from ${s.promociones} where img = '/media/' || i.id::text)
      and not exists (select 1 from ${s.secciones} where fondo = '/media/' || i.id::text)
      and not exists (select 1 from ${s.negocio} where portada = '/media/' || i.id::text or mascota = '/media/' || i.id::text)`);
}

/* ---------------- platillos ---------------- */

const productoSchema = z.object({
  nombre: z.string().trim().min(1, 'Escribe el nombre del platillo').max(80),
  jp: texto(30),
  precio: numero,
  categoriaId: z.string().min(1, 'Elige una categoría'),
  sub: texto(200),
  descripcion: texto(800),
  img: imagenUrl,
  opcionesTitulo: texto(40),
});

export async function guardarProducto(_prev: Estado, fd: FormData): Promise<Estado> {
  await requireAdmin();
  const d = productoSchema.safeParse(Object.fromEntries(fd));
  if (!d.success) return { error: primerError(d.error) };

  const id = String(fd.get('id') || '');
  const etiquetas = fd.getAll('etiquetas').map(String).filter(Boolean).slice(0, 8);
  const opciones = lista(fd.get('opciones'));
  const valores = {
    ...d.data,
    disponible: fd.get('disponible') === 'on',
    etiquetas,
    opciones,
    opcionesTitulo: opciones.length ? d.data.opcionesTitulo || 'Opciones' : null,
    updatedAt: new Date(),
  };

  if (id) {
    const [antes] = await db.select({ img: s.productos.img }).from(s.productos).where(eq(s.productos.id, id)).limit(1);
    if (!antes) return { error: 'Ese platillo ya no existe.' };
    await db.update(s.productos).set(valores).where(eq(s.productos.id, id));
    if (antes.img !== valores.img) await borrarSiHuerfana(antes.img);
  } else {
    const nuevoId = await idUnico(d.data.nombre, async (x) => (await db.select({ id: s.productos.id }).from(s.productos).where(eq(s.productos.id, x))).length > 0);
    const [{ m }] = await db.select({ m: max(s.productos.orden) }).from(s.productos);
    await db.insert(s.productos).values({ id: nuevoId, ...valores, orden: (m ?? 0) + 1 });
  }
  refrescarMenu();
  redirect(`/admin/platillos?cat=${encodeURIComponent(d.data.categoriaId)}`);
}

export async function eliminarProducto(id: string) {
  await requireAdmin();
  const [p] = await db.delete(s.productos).where(eq(s.productos.id, id)).returning({ img: s.productos.img });
  if (p) await borrarSiHuerfana(p.img);
  refrescarMenu();
  redirect('/admin/platillos');
}

export async function cambiarDisponible(id: string, disponible: boolean) {
  await requireAdmin();
  await db.update(s.productos).set({ disponible, updatedAt: new Date() }).where(eq(s.productos.id, id));
  refrescarMenu();
}

/** Sube o baja un platillo dentro de su categoría. */
export async function moverProducto(id: string, dir: -1 | 1) {
  await requireAdmin();
  const [p] = await db.select().from(s.productos).where(eq(s.productos.id, id)).limit(1);
  if (!p) return;
  const hermanos = await db.select({ id: s.productos.id, orden: s.productos.orden }).from(s.productos).where(eq(s.productos.categoriaId, p.categoriaId)).orderBy(s.productos.orden, s.productos.nombre);
  const i = hermanos.findIndex((h) => h.id === id);
  const j = i + dir;
  if (j < 0 || j >= hermanos.length) return;
  [hermanos[i], hermanos[j]] = [hermanos[j], hermanos[i]];
  for (const [k, h] of hermanos.entries()) await db.update(s.productos).set({ orden: k }).where(eq(s.productos.id, h.id));
  refrescarMenu();
}

/* ---------------- promociones ---------------- */

const promoSchema = z.object({
  titulo: z.string().trim().min(1, 'Escribe el título de la promoción').max(60),
  subtitulo: texto(120),
  texto: texto(300),
  etiqueta: texto(30),
  img: imagenUrl,
});

export async function guardarPromo(_prev: Estado, fd: FormData): Promise<Estado> {
  await requireAdmin();
  const d = promoSchema.safeParse(Object.fromEntries(fd));
  if (!d.success) return { error: primerError(d.error) };
  const id = String(fd.get('id') || '');
  const productos = fd.getAll('productos').map(String).filter(Boolean);
  const valores = { ...d.data, titulo: d.data.titulo.toUpperCase(), activa: fd.get('activa') === 'on', portada: fd.get('portada') === 'on' };

  let promoId = id;
  if (id) {
    const [antes] = await db.select({ img: s.promociones.img }).from(s.promociones).where(eq(s.promociones.id, id)).limit(1);
    if (!antes) return { error: 'Esa promoción ya no existe.' };
    await db.update(s.promociones).set(valores).where(eq(s.promociones.id, id));
    if (antes.img !== valores.img) await borrarSiHuerfana(antes.img);
  } else {
    promoId = await idUnico('promo-' + d.data.titulo, async (x) => (await db.select({ id: s.promociones.id }).from(s.promociones).where(eq(s.promociones.id, x))).length > 0);
    await db.insert(s.promociones).values({ id: promoId, ...valores });
  }
  await db.delete(s.promocionProductos).where(eq(s.promocionProductos.promocionId, promoId));
  if (productos.length) {
    const validos = await db.select({ id: s.productos.id }).from(s.productos).where(inArray(s.productos.id, productos));
    if (validos.length) await db.insert(s.promocionProductos).values(validos.map((v) => ({ promocionId: promoId, productoId: v.id })));
  }
  refrescarMenu();
  redirect('/admin/promos');
}

export async function eliminarPromo(id: string) {
  await requireAdmin();
  const [p] = await db.delete(s.promociones).where(eq(s.promociones.id, id)).returning({ img: s.promociones.img });
  if (p) await borrarSiHuerfana(p.img);
  refrescarMenu();
  redirect('/admin/promos');
}

export async function cambiarPromo(id: string, campo: 'activa' | 'portada', valor: boolean) {
  await requireAdmin();
  await db.update(s.promociones).set(campo === 'activa' ? { activa: valor } : { portada: valor }).where(eq(s.promociones.id, id));
  refrescarMenu();
}

/* ---------------- arma tu sushi ---------------- */

const ingredienteSchema = z.object({
  id: z.string().max(60).optional(),
  nombre: z.string().trim().min(1, 'Un ingrediente no tiene nombre').max(40),
  icono: z.string().regex(/^[a-z_]{2,40}$/).default('restaurant'),
  tipo: z.enum(['verdura', 'proteina']),
  activo: z.boolean(),
});

export async function guardarSushi(_prev: Estado, fd: FormData): Promise<Estado> {
  await requireAdmin();
  const reglas = z
    .object({ incluidos: z.coerce.number().int().min(1).max(6), extraVerdura: numero, extraProteina: numero })
    .safeParse({ incluidos: fd.get('incluidos'), extraVerdura: fd.get('extraVerdura'), extraProteina: fd.get('extraProteina') });
  if (!reglas.success) return { error: primerError(reglas.error) };

  let ings: z.infer<typeof ingredienteSchema>[];
  try {
    ings = z.array(ingredienteSchema).max(40).parse(JSON.parse(String(fd.get('ingredientes') || '[]')));
  } catch (e) {
    return { error: e instanceof z.ZodError ? primerError(e) : 'Lista de ingredientes no válida' };
  }

  // Precios de los rollos (campos "rollo:<id>").
  const precios: { id: string; precio: number }[] = [];
  for (const [k, v] of fd.entries()) {
    if (!k.startsWith('rollo:')) continue;
    const p = numero.safeParse(v);
    if (!p.success) return { error: 'Revisa el precio de los rollos' };
    precios.push({ id: k.slice(6), precio: p.data });
  }

  await db.insert(s.sushiConfig).values({ id: 1, ...reglas.data }).onConflictDoUpdate({ target: s.sushiConfig.id, set: reglas.data });
  for (const r of precios) await db.update(s.productos).set({ precio: r.precio, updatedAt: new Date() }).where(eq(s.productos.id, r.id));

  // Reemplaza la lista de ingredientes conservando los ids existentes.
  const usados = new Set<string>();
  const filas = ings.map((i, orden) => {
    let id = i.id && !usados.has(i.id) ? i.id : slug(i.nombre);
    while (usados.has(id)) id += '-2';
    usados.add(id);
    return { id, nombre: i.nombre, icono: i.icono, tipo: i.tipo, activo: i.activo, orden };
  });
  await db.delete(s.sushiIngredientes);
  if (filas.length) await db.insert(s.sushiIngredientes).values(filas);

  refrescarMenu();
  return { ok: true, mensaje: 'Configuración guardada' };
}

/* ---------------- negocio, fondos y categorías ---------------- */

const urlOpcional = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === '' || /^https?:\/\//.test(v), 'Los enlaces deben empezar con https://')
  .default('');

export async function guardarNegocio(_prev: Estado, fd: FormData): Promise<Estado> {
  await requireAdmin();
  const d = z
    .object({
      nombre: z.string().trim().min(1, 'Escribe el nombre del negocio').max(60),
      lema: texto(80),
      bienvenidaTitulo: texto(60),
      bienvenidaTexto: texto(200),
      horario: texto(80),
      direccion: texto(120),
      zona: texto(60),
      whatsapp: z.string().trim().max(20).regex(/^[\d\s+()-]*$/, 'El WhatsApp solo lleva números').default(''),
      facebook: urlOpcional,
      instagram: urlOpcional,
      avisoMesero: texto(80),
    })
    .safeParse(Object.fromEntries(fd));
  if (!d.success) return { error: primerError(d.error) };
  await db.update(s.negocio).set({ ...d.data, updatedAt: new Date() }).where(eq(s.negocio.id, 1));
  refrescarMenu();
  return { ok: true, mensaje: 'Datos guardados' };
}

/** destino: 'portada' | 'mascota' | 'seccion:<id>'. url null = volver al predeterminado. */
export async function guardarImagenNegocio(destino: string, url: string | null) {
  await requireAdmin();
  const limpia = url === null ? null : imagenUrl.parse(url);
  let anterior: string | null = null;

  if (destino === 'portada' || destino === 'mascota') {
    const [n] = await db.select().from(s.negocio).limit(1);
    anterior = n?.[destino] ?? null;
    await db.update(s.negocio).set(destino === 'portada' ? { portada: limpia } : { mascota: limpia }).where(eq(s.negocio.id, 1));
  } else if (destino.startsWith('seccion:')) {
    const id = destino.slice(8);
    const [sec] = await db.select({ fondo: s.secciones.fondo }).from(s.secciones).where(eq(s.secciones.id, id)).limit(1);
    if (!sec) return;
    anterior = sec.fondo;
    await db.update(s.secciones).set({ fondo: limpia }).where(eq(s.secciones.id, id));
  } else {
    return;
  }
  if (anterior !== limpia) await borrarSiHuerfana(anterior);
  refrescarMenu();
}

/** Renumera el orden de las categorías: pestaña por pestaña, sin huecos (0, 1, 2…). */
async function compactarCategorias() {
  const [secciones, cats] = await Promise.all([
    db.select({ id: s.secciones.id, orden: s.secciones.orden }).from(s.secciones),
    db.select({ id: s.categorias.id, seccionId: s.categorias.seccionId, orden: s.categorias.orden }).from(s.categorias),
  ]);
  const ordenSec = new Map(secciones.map((x) => [x.id, x.orden]));
  cats.sort((a, b) => (ordenSec.get(a.seccionId) ?? 99) - (ordenSec.get(b.seccionId) ?? 99) || a.orden - b.orden);
  for (const [i, c] of cats.entries()) if (c.orden !== i) await db.update(s.categorias).set({ orden: i }).where(eq(s.categorias.id, c.id));
}

export async function guardarCategorias(_prev: Estado, fd: FormData): Promise<Estado> {
  await requireAdmin();
  const ids = fd.getAll('id').map(String);
  const cat = z.object({
    nombre: z.string().trim().min(1, 'Cada categoría necesita nombre').max(40),
    nota: texto(240),
    vertical: texto(12),
    kanji: texto(2),
  });
  const secs = fd.getAll('seccionId').map(String);
  for (const [i, id] of ids.entries()) {
    const d = cat.safeParse({ nombre: fd.getAll('nombre')[i], nota: fd.getAll('nota')[i], vertical: fd.getAll('vertical')[i], kanji: fd.getAll('kanji')[i] });
    if (!d.success) return { error: primerError(d.error) };
    const seccion = String(fd.get(`seccion:${id}`) ?? '');
    await db
      .update(s.categorias)
      .set({
        ...d.data,
        kanji: d.data.kanji || '品',
        visible: fd.get(`visible:${id}`) === 'on',
        mostrarTitulo: fd.get(`titulo:${id}`) === 'on',
        ...(secs.includes(seccion) ? { seccionId: seccion } : {}),
      })
      .where(eq(s.categorias.id, id));
  }
  // Nombres de las secciones (pestañas).
  for (const [i, id] of secs.entries()) {
    const nombre = String(fd.getAll('seccionNombre')[i] ?? '').trim().slice(0, 30);
    const jp = String(fd.getAll('seccionJp')[i] ?? '').trim().slice(0, 12);
    if (nombre) await db.update(s.secciones).set({ nombre, jp }).where(eq(s.secciones.id, id));
  }
  await compactarCategorias();
  refrescarMenu();
  return { ok: true, mensaje: 'Categorías guardadas' };
}

export async function crearCategoria(_prev: Estado, fd: FormData): Promise<Estado> {
  await requireAdmin();
  const d = z
    .object({
      nombre: z.string().trim().min(1, 'Escribe el nombre de la categoría').max(40),
      seccionId: z.string().min(1, 'Elige en qué pestaña va'),
    })
    .safeParse({ nombre: fd.get('nombre'), seccionId: fd.get('seccionId') });
  if (!d.success) return { error: primerError(d.error) };
  const [sec] = await db.select({ id: s.secciones.id }).from(s.secciones).where(eq(s.secciones.id, d.data.seccionId)).limit(1);
  if (!sec) return { error: 'Esa pestaña ya no existe.' };

  const id = await idUnico(d.data.nombre, async (x) => (await db.select({ id: s.categorias.id }).from(s.categorias).where(eq(s.categorias.id, x))).length > 0);
  const hermanas = await db.select({ id: s.categorias.id }).from(s.categorias).where(eq(s.categorias.seccionId, sec.id));
  const [{ m }] = await db.select({ m: max(s.categorias.orden) }).from(s.categorias);
  await db.insert(s.categorias).values({
    id,
    seccionId: sec.id,
    nombre: d.data.nombre,
    mostrarTitulo: true,
    estilo: 'lista',
    subMayus: false,
    vertical: '',
    // Alterna el lado del texto vertical respecto a la tarjeta anterior.
    lado: hermanas.length % 2 ? 'izq' : 'der',
    kanji: '品',
    nota: '',
    orden: (m ?? 0) + 1,
  });
  await compactarCategorias();
  refrescarMenu();
  return { ok: true, mensaje: 'Categoría creada: ya puedes asignarle platillos' };
}

export async function eliminarCategoria(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(s.productos).where(eq(s.productos.categoriaId, id));
  if (n > 0) return { error: `Esta categoría tiene ${n} platillo${n > 1 ? 's' : ''}. Muévelos a otra categoría o elimínalos primero.` };
  await db.delete(s.categorias).where(eq(s.categorias.id, id));
  await compactarCategorias();
  refrescarMenu();
  return {};
}

/** Sube o baja una categoría dentro de su pestaña (conserva los demás lugares). */
export async function moverCategoria(id: string, dir: -1 | 1) {
  await requireAdmin();
  const [c] = await db.select().from(s.categorias).where(eq(s.categorias.id, id)).limit(1);
  if (!c) return;
  const hermanas = await db
    .select({ id: s.categorias.id, orden: s.categorias.orden })
    .from(s.categorias)
    .where(eq(s.categorias.seccionId, c.seccionId))
    .orderBy(s.categorias.orden);
  const i = hermanas.findIndex((h) => h.id === id);
  const j = i + dir;
  if (j < 0 || j >= hermanas.length) return;
  const lugares = hermanas.map((h) => h.orden);
  [hermanas[i], hermanas[j]] = [hermanas[j], hermanas[i]];
  for (const [k, h] of hermanas.entries()) await db.update(s.categorias).set({ orden: lugares[k] }).where(eq(s.categorias.id, h.id));
  await compactarCategorias();
  refrescarMenu();
}
