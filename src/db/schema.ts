import {
  boolean,
  integer,
  numeric,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

/** Precio en pesos: numeric en BD, number en JS. */
const precio = (name: string) => numeric(name, { precision: 10, scale: 2, mode: 'number' });

/** Datos generales del restaurante (una sola fila, id = 1). */
export const negocio = pgTable('negocio', {
  id: integer('id').primaryKey().default(1),
  nombre: text('nombre').notNull(),
  lema: text('lema').notNull().default(''),
  bienvenidaTitulo: text('bienvenida_titulo').notNull().default(''),
  bienvenidaTexto: text('bienvenida_texto').notNull().default(''),
  horario: text('horario').notNull().default(''),
  direccion: text('direccion').notNull().default(''),
  zona: text('zona').notNull().default(''),
  whatsapp: text('whatsapp').notNull().default(''),
  facebook: text('facebook').notNull().default(''),
  instagram: text('instagram').notNull().default(''),
  tiktok: text('tiktok').notNull().default(''),
  /** Imagen de la portada (bienvenida). */
  portada: text('portada'),
  /** Mascota pequeña (pie de página, login, panel). */
  mascota: text('mascota'),
  avisoMesero: text('aviso_mesero').notNull().default('Pídelo a tu mesero'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Pestañas del menú: Ramen y Sushi, Entradas, Bebidas… */
export const secciones = pgTable('secciones', {
  id: text('id').primaryKey(),
  nombre: text('nombre').notNull(),
  jp: text('jp').notNull().default(''),
  /** Imagen de fondo; null = fondo sumi-e predeterminado. */
  fondo: text('fondo'),
  orden: integer('orden').notNull().default(0),
});

/** Tarjetas dentro de una sección (Ramen, Sushi, Postres…). */
export const categorias = pgTable('categorias', {
  id: text('id').primaryKey(),
  seccionId: text('seccion_id')
    .notNull()
    .references(() => secciones.id, { onDelete: 'cascade' }),
  nombre: text('nombre').notNull(),
  mostrarTitulo: boolean('mostrar_titulo').notNull().default(true),
  /** 'ramen' | 'sushi' | 'lista' — cómo se dibujan las filas. */
  estilo: text('estilo').notNull().default('lista'),
  subMayus: boolean('sub_mayus').notNull().default(false),
  /** Texto vertical decorativo (尺丹爪巨刀…). */
  vertical: text('vertical').notNull().default(''),
  /** 'izq' | 'der' */
  lado: text('lado').notNull().default('der'),
  /** Kanji del sello cuando un platillo no tiene foto. */
  kanji: text('kanji').notNull().default('品'),
  nota: text('nota').notNull().default(''),
  /** Muestra la guía "Arma tu sushi" debajo de la tarjeta. */
  armable: boolean('armable').notNull().default(false),
  visible: boolean('visible').notNull().default(true),
  orden: integer('orden').notNull().default(0),
});

export const productos = pgTable('productos', {
  id: text('id').primaryKey(),
  categoriaId: text('categoria_id')
    .notNull()
    .references(() => categorias.id, { onDelete: 'cascade' }),
  nombre: text('nombre').notNull(),
  jp: text('jp').notNull().default(''),
  precio: precio('precio').notNull(),
  /** Texto corto que se ve en la lista del menú. */
  sub: text('sub').notNull().default(''),
  /** Descripción larga del detalle. */
  descripcion: text('descripcion').notNull().default(''),
  img: text('img'),
  disponible: boolean('disponible').notNull().default(true),
  etiquetas: text('etiquetas').array().notNull().default([]),
  opcionesTitulo: text('opciones_titulo'),
  opciones: text('opciones').array().notNull().default([]),
  orden: integer('orden').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Reglas de "Arma tu sushi" (una sola fila, id = 1). */
export const sushiConfig = pgTable('sushi_config', {
  id: integer('id').primaryKey().default(1),
  incluidos: integer('incluidos').notNull().default(3),
  extraVerdura: precio('extra_verdura').notNull().default(15),
  extraProteina: precio('extra_proteina').notNull().default(25),
});

export const sushiIngredientes = pgTable('sushi_ingredientes', {
  id: text('id').primaryKey(),
  nombre: text('nombre').notNull(),
  icono: text('icono').notNull().default('restaurant'),
  /** 'verdura' | 'proteina' — define el precio cuando se pide de extra. */
  tipo: text('tipo').notNull().default('verdura'),
  activo: boolean('activo').notNull().default(true),
  orden: integer('orden').notNull().default(0),
});

export const promociones = pgTable('promociones', {
  id: text('id').primaryKey(),
  titulo: text('titulo').notNull(),
  subtitulo: text('subtitulo').notNull().default(''),
  texto: text('texto').notNull().default(''),
  etiqueta: text('etiqueta').notNull().default(''),
  img: text('img'),
  activa: boolean('activa').notNull().default(true),
  portada: boolean('portada').notNull().default(true),
  orden: integer('orden').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const promocionProductos = pgTable(
  'promocion_productos',
  {
    promocionId: text('promocion_id')
      .notNull()
      .references(() => promociones.id, { onDelete: 'cascade' }),
    productoId: text('producto_id')
      .notNull()
      .references(() => productos.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.promocionId, t.productoId] })],
);

/**
 * Fotos subidas desde el panel. Se guardan en Neon (base64) mientras se define el hosting;
 * se sirven en /media/[id] con caché inmutable. Migrables a un bucket después.
 */
export const imagenes = pgTable('imagenes', {
  id: uuid('id').primaryKey().defaultRandom(),
  mime: text('mime').notNull(),
  bytes: integer('bytes').notNull(),
  data: text('data').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const adminUsuarios = pgTable('admin_usuarios', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  nombre: text('nombre').notNull().default('Dueño'),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Negocio = typeof negocio.$inferSelect;
export type Seccion = typeof secciones.$inferSelect;
export type Categoria = typeof categorias.$inferSelect;
export type Producto = typeof productos.$inferSelect;
export type SushiConfig = typeof sushiConfig.$inferSelect;
export type SushiIngrediente = typeof sushiIngredientes.$inferSelect;
export type Promocion = typeof promociones.$inferSelect;
