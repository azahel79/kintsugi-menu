import 'server-only';
import { asc } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';
import { db, schema as s } from '@/db';

export const MENU_TAG = 'menu';

export type MenuProducto = {
  id: string;
  categoriaId: string;
  nombre: string;
  jp: string;
  precio: number;
  sub: string;
  descripcion: string;
  img: string | null;
  disponible: boolean;
  etiquetas: string[];
  opcionesTitulo: string | null;
  opciones: string[];
};

export type MenuPromo = {
  id: string;
  titulo: string;
  subtitulo: string;
  texto: string;
  etiqueta: string;
  img: string | null;
  portada: boolean;
  productos: string[];
};

/**
 * Todo el menú en una sola lectura. Se guarda en caché y se
 * invalida (updateTag('menu')) cada vez que el dueño guarda algo en el panel.
 * Así los clientes nunca esperan a la base de datos.
 */
export async function getMenu() {
  'use cache';
  cacheLife('days'); // respaldo: se refresca 1 vez al día aunque nadie guarde nada
  cacheTag(MENU_TAG);

  const [negocioRows, secciones, categorias, productos, sushiRows, ingredientes, promos, promoProds] = await Promise.all([
    db.select().from(s.negocio),
    db.select().from(s.secciones).orderBy(asc(s.secciones.orden)),
    db.select().from(s.categorias).orderBy(asc(s.categorias.orden)),
    db.select().from(s.productos).orderBy(asc(s.productos.orden), asc(s.productos.nombre)),
    db.select().from(s.sushiConfig),
    db.select().from(s.sushiIngredientes).orderBy(asc(s.sushiIngredientes.orden)),
    db.select().from(s.promociones).orderBy(asc(s.promociones.orden)),
    db.select().from(s.promocionProductos),
  ]);

  const n = negocioRows[0];
  if (!n) throw new Error('La base de datos está vacía: corre "npm run db:seed".');

  const sushi = sushiRows[0] ?? { incluidos: 3, extraVerdura: 15, extraProteina: 25 };

  return {
    negocio: {
      nombre: n.nombre,
      lema: n.lema,
      bienvenidaTitulo: n.bienvenidaTitulo,
      bienvenidaTexto: n.bienvenidaTexto,
      horario: n.horario,
      direccion: n.direccion,
      zona: n.zona,
      whatsapp: n.whatsapp,
      facebook: n.facebook,
      instagram: n.instagram,
      tiktok: n.tiktok,
      portada: n.portada,
      mascota: n.mascota,
      avisoMesero: n.avisoMesero,
    },
    secciones,
    categorias: categorias.filter((c) => c.visible),
    productos: productos.map(
      (p): MenuProducto => ({
        id: p.id,
        categoriaId: p.categoriaId,
        nombre: p.nombre,
        jp: p.jp,
        precio: p.precio,
        sub: p.sub,
        descripcion: p.descripcion,
        img: p.img,
        disponible: p.disponible,
        etiquetas: p.etiquetas,
        opcionesTitulo: p.opcionesTitulo,
        opciones: p.opciones,
      }),
    ),
    sushi: {
      incluidos: sushi.incluidos,
      extraVerdura: sushi.extraVerdura,
      extraProteina: sushi.extraProteina,
      ingredientes: ingredientes.filter((i) => i.activo).map(({ id, nombre, icono, tipo }) => ({ id, nombre, icono, tipo })),
    },
    promos: promos
      .filter((p) => p.activa)
      .map(
        (p): MenuPromo => ({
          id: p.id,
          titulo: p.titulo,
          subtitulo: p.subtitulo,
          texto: p.texto,
          etiqueta: p.etiqueta,
          img: p.img,
          portada: p.portada,
          productos: promoProds.filter((x) => x.promocionId === p.id).map((x) => x.productoId),
        }),
      ),
  };
}

export type Menu = Awaited<ReturnType<typeof getMenu>>;

export function promoDe(menu: Menu, productoId: string) {
  return menu.promos.find((p) => p.productos.includes(productoId));
}

export function seccionDe(menu: Menu, productoId: string) {
  const p = menu.productos.find((x) => x.id === productoId);
  const c = p && menu.categorias.find((x) => x.id === p.categoriaId);
  return c?.seccionId ?? null;
}

export function dinero(n: number) {
  return '$' + (Number.isInteger(n) ? n : n.toFixed(2));
}

export function waLink(numero: string, msg?: string) {
  let d = numero.replace(/\D/g, '');
  if (d.length === 10) d = '52' + d;
  return `https://wa.me/${d}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
}

export function enlaceSeguro(url: string) {
  return /^https?:\/\//.test(url) ? url : null;
}
