/**
 * Carga el menú inicial de Kintsugi en Neon.
 * Uso: npm run db:seed        (no borra nada si ya hay datos)
 *      npm run db:seed -- --reset   (borra el menú y lo vuelve a cargar; NO borra fotos ni usuarios)
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcryptjs';
import * as s from './schema';

const db = drizzle(neon(process.env.DATABASE_URL!), { schema: s });
const reset = process.argv.includes('--reset');

const ramenDesc = (extra: string) =>
  `Fondo de la casa, ${extra}, espinacas, mitad de huevo duro y alga nori.`;

const secciones = [
  { id: 'ramen-sushi', nombre: 'Ramen y Sushi', jp: '麺・寿司', fondo: '/img/fondo-ramen-sushi-bambu.jpg', orden: 0 },
  { id: 'entradas', nombre: 'Entradas', jp: '一品・串', fondo: '/img/fondo-entradas-enso.jpg', orden: 1 },
  { id: 'bebidas', nombre: 'Bebidas', jp: '飲・甘味', fondo: '/img/fondo-bebidas-dragon.jpg', orden: 2 },
];

const categorias = [
  { id: 'ramen', seccionId: 'ramen-sushi', nombre: 'Ramen', mostrarTitulo: true, estilo: 'ramen', subMayus: true, vertical: '尺丹爪巨刀', lado: 'izq', kanji: '麺',
    nota: 'Todos los Ramen se preparan con fondo de la casa, espinacas, mitad de huevo duro y alga nori.' },
  { id: 'sushi', seccionId: 'ramen-sushi', nombre: 'Sushi', mostrarTitulo: false, estilo: 'sushi', subMayus: true, vertical: '丂凵丂卄丨', lado: 'der', kanji: '寿', armable: true },
  { id: 'entradas', seccionId: 'entradas', nombre: 'Entradas', mostrarTitulo: true, estilo: 'lista', subMayus: false, vertical: '前菜', lado: 'der', kanji: '品' },
  { id: 'arroz-fideos', seccionId: 'entradas', nombre: 'Arroz y fideos', mostrarTitulo: true, estilo: 'lista', subMayus: false, vertical: 'ご飯と麺', lado: 'izq', kanji: '飯' },
  { id: 'brochetas', seccionId: 'entradas', nombre: 'Yakitori y Kushiyaki', mostrarTitulo: true, estilo: 'lista', subMayus: false, vertical: '焼き鳥', lado: 'der', kanji: '串' },
  { id: 'kushiage', seccionId: 'entradas', nombre: 'Kushiage', mostrarTitulo: true, estilo: 'lista', subMayus: false, vertical: '串揚げ', lado: 'izq', kanji: '揚' },
  { id: 'bebidas', seccionId: 'bebidas', nombre: 'Bebidas', mostrarTitulo: true, estilo: 'lista', subMayus: true, vertical: '乃巨乃一口丹丂', lado: 'izq', kanji: '飲' },
  { id: 'postres', seccionId: 'bebidas', nombre: 'Postres', mostrarTitulo: true, estilo: 'lista', subMayus: true, vertical: '尸口丂丁尺巨丂', lado: 'der', kanji: '甘' },
].map((c, i) => ({ nota: '', armable: false, ...c, orden: i }));

type P = Partial<typeof s.productos.$inferInsert> & { id: string; categoriaId: string; nombre: string; precio: number };
const productos: P[] = [
  { id: 'vegetales', categoriaId: 'ramen', nombre: 'Vegetales', jp: '野菜', precio: 70, descripcion: ramenDesc('verduras de temporada') },
  { id: 'pollo-marinado', categoriaId: 'ramen', nombre: 'Pollo marinado', jp: '鶏', precio: 75, descripcion: ramenDesc('pollo marinado') },
  { id: 'cerdo-marinado', categoriaId: 'ramen', nombre: 'Cerdo marinado', jp: '豚', precio: 75, descripcion: ramenDesc('cerdo marinado') },
  { id: 'tocino', categoriaId: 'ramen', nombre: 'Tocino', jp: 'ベーコン', precio: 75, descripcion: ramenDesc('tocino dorado') },
  { id: 'dayto', categoriaId: 'ramen', nombre: 'Dayto', jp: 'デイト', precio: 100, sub: '(Cerdo y camarón)', descripcion: ramenDesc('cerdo marinado y camarón') },
  { id: 'camarones', categoriaId: 'ramen', nombre: 'Camarones', jp: 'メン', precio: 120, descripcion: ramenDesc('camarones') },
  { id: 'arrachera', categoriaId: 'ramen', nombre: 'Arrachera', jp: '牛', precio: 120, descripcion: ramenDesc('arrachera') },
  { id: 'kintsugi', categoriaId: 'ramen', nombre: 'Kintsugi', jp: '全部', precio: 200,
    sub: 'Fondo de la casa, camarón, arrachera, tocino, cerdo marinado, pollo, dos mitades de huevo duro y naruto.',
    descripcion: 'Nuestro ramen insignia servido en tazón ceremonial: fondo de la casa cocinado a fuego lento, camarón, arrachera, tocino dorado, cerdo marinado, pollo, dos mitades de huevo duro, naruto, espinacas y alga nori.',
    etiquetas: ['Especialidad', 'Nuevo', 'Picante opcional'], opcionesTitulo: 'Estilo de caldo', opciones: ['Tradicional', 'Picante suave', 'Extra picante'] },

  { id: 'furaimaki', categoriaId: 'sushi', nombre: 'Furaimaki', jp: 'フライ巻き', precio: 140, sub: '(Empanizado)', descripcion: 'Rollo empanizado y crujiente. Elige 3 ingredientes.' },
  { id: 'futomaki', categoriaId: 'sushi', nombre: 'Futomaki', jp: '太巻き', precio: 90, sub: '(Alga por fuera)', descripcion: 'Rollo con alga nori por fuera. Elige 3 ingredientes.', img: '/img/sushi-futomaki.jpg' },
  { id: 'uramaki', categoriaId: 'sushi', nombre: 'Uramaki', jp: '裏巻き', precio: 90, sub: '(Alga por dentro)', descripcion: 'Rollo con alga por dentro y arroz con ajonjolí por fuera. Elige 3 ingredientes.', img: '/img/sushi-uramaki.jpg' },

  { id: 'gyoza', categoriaId: 'entradas', nombre: 'Gyoza', precio: 75, sub: 'Empanadas japonesas de masa fina, rellenas de carne de cerdo (5 piezas).' },
  { id: 'tempura-surimi', categoriaId: 'entradas', nombre: 'Tempura surimi', precio: 80, sub: '(5 piezas)' },
  { id: 'tempura-camaron', categoriaId: 'entradas', nombre: 'Tempura camarón', precio: 120, sub: '(150 gramos)' },
  { id: 'takoyaki', categoriaId: 'entradas', nombre: 'Takoyaki', precio: 75, sub: 'Bolitas crujientes y suaves por dentro, rellenas de pulpo (5 piezas).' },
  { id: 'domburi', categoriaId: 'arroz-fideos', nombre: 'Domburi', precio: 70, sub: 'Verduras salteadas con pollo y tocino sobre gohan.' },
  { id: 'yakisoba', categoriaId: 'arroz-fideos', nombre: 'Yakisoba (fideos)', precio: 85, sub: 'Vegetariano o con pollo.' },
  { id: 'yakisoba-premium', categoriaId: 'arroz-fideos', nombre: 'Yakisoba (fideos)', precio: 140, sub: 'Con arrachera o camarón.' },
  { id: 'yakimeshi', categoriaId: 'arroz-fideos', nombre: 'Yakimeshi', precio: 75, sub: 'Arroz frito (vegetariano / pollo / tocino).' },
  { id: 'yakimeshi-premium', categoriaId: 'arroz-fideos', nombre: 'Yakimeshi', precio: 90, sub: 'Arroz frito (camarón / arrachera).' },
  { id: 'yakimeshi-mixto', categoriaId: 'arroz-fideos', nombre: 'Yakimeshi mixto', precio: 90, sub: '(Camarón, pollo y tocino).' },

  { id: 'yakitori', categoriaId: 'brochetas', nombre: 'Yakitori (4 piezas)', precio: 70, sub: 'Brocheta asada de pollo marinado.' },
  { id: 'kushiyaki', categoriaId: 'brochetas', nombre: 'Kushiyaki (4 piezas)', precio: 80, sub: 'Brocheta asada de arrachera marinada.' },
  { id: 'kushiage-queso', categoriaId: 'kushiage', nombre: 'Kushiage queso (4 piezas)', precio: 75, sub: 'Brocheta empanizada de gouda.' },
  { id: 'kushiage-ebi', categoriaId: 'kushiage', nombre: 'Kushiage ebi (4 piezas)', precio: 120, sub: 'Brocheta empanizada de camarón.' },

  { id: 'agua-del-dia', categoriaId: 'bebidas', nombre: 'Agua del día', precio: 30 },
  { id: 'calpis', categoriaId: 'bebidas', nombre: 'Calpis', precio: 45 },
  { id: 'calpis-sabor', categoriaId: 'bebidas', nombre: 'Calpis de sabor', precio: 65, sub: 'Mango / Durazno / Fresa', opcionesTitulo: 'Sabores', opciones: ['Mango', 'Durazno', 'Fresa'] },
  { id: 'te-caliente', categoriaId: 'bebidas', nombre: 'Té caliente', precio: 50, sub: 'Jazmín / Verde / Frutos rojos · Tetera 900 ml', opcionesTitulo: 'Sabores', opciones: ['Jazmín', 'Verde', 'Frutos rojos'] },
  { id: 'te-helado', categoriaId: 'bebidas', nombre: 'Té helado', precio: 30 },

  { id: 'volcan-fuji', categoriaId: 'postres', nombre: 'Volcán Fuji', precio: 45, sub: 'Fresa / Chocolate / Vainilla', opcionesTitulo: 'Sabores', opciones: ['Fresa', 'Chocolate', 'Vainilla'] },
  { id: 'mochi-helado', categoriaId: 'postres', nombre: 'Mochi helado', precio: 40 },
  { id: 'tempura-helado', categoriaId: 'postres', nombre: 'Tempura helado', precio: 50, sub: 'Frutos del bosque / Chocolate / Vainilla', opcionesTitulo: 'Sabores', opciones: ['Frutos del bosque', 'Chocolate', 'Vainilla'] },
];

// Ilustraciones de Ramen y Sushi (public/img/platillos/<id>.jpg).
const CON_ILUSTRACION = ['vegetales', 'pollo-marinado', 'cerdo-marinado', 'tocino', 'dayto', 'camarones', 'arrachera', 'kintsugi', 'furaimaki', 'futomaki', 'uramaki'];

const ingredientes = [
  ['queso-crema', 'Queso crema', 'bakery_dining', 'proteina'],
  ['camaron', 'Camarón', 'set_meal', 'proteina'],
  ['surimi', 'Surimi', 'phishing', 'proteina'],
  ['atun', 'Atún', 'water', 'proteina'],
  ['pollo', 'Pollo', 'egg_alt', 'proteina'],
  ['arrachera', 'Arrachera', 'skillet', 'proteina'],
  ['huevo', 'Huevo', 'egg', 'proteina'],
  ['pepino', 'Pepino', 'eco', 'verdura'],
  ['zanahoria', 'Zanahoria', 'nutrition', 'verdura'],
  ['aguacate', 'Aguacate', 'spa', 'verdura'],
  ['platano', 'Plátano', 'bakery_dining', 'verdura'],
  ['mango', 'Mango', 'sunny', 'verdura'],
].map(([id, nombre, icono, tipo], orden) => ({ id, nombre, icono, tipo, orden, activo: true }));

const promos = [
  { id: 'promo-sushi', titulo: '2X$150 EN SUSHI', subtitulo: 'Aplica en Futomaki y Uramaki · Todo octubre',
    texto: 'En Kintsugi no conocemos de restricciones: arma y combina los ingredientes de tu sushi como más se te antoje.',
    etiqueta: 'PROMO 2x$150', img: '/img/promo-sushi-2x150.jpg', activa: true, portada: true, orden: 0 },
  { id: 'promo-te', titulo: '2X1 EN TÉ HELADO', subtitulo: 'Viernes de 2:00 PM a 6:00 PM',
    texto: 'Refréscate los viernes por la tarde con nuestro té helado.', etiqueta: '2x1', img: null, activa: false, portada: false, orden: 1 },
];

async function main() {
  const existentes = await db.select({ id: s.negocio.id }).from(s.negocio);
  if (existentes.length && !reset) {
    console.log('Ya hay datos. Usa --reset para recargar el menú de ejemplo.');
  } else {
    if (reset) {
      await db.delete(s.promocionProductos);
      await db.delete(s.promociones);
      await db.delete(s.productos);
      await db.delete(s.categorias);
      await db.delete(s.secciones);
      await db.delete(s.sushiIngredientes);
      await db.delete(s.sushiConfig);
      await db.delete(s.negocio);
    }
    await db.insert(s.negocio).values({
      id: 1,
      nombre: 'Kintsugi Banderilla',
      lema: 'Cocina Japonesa · Banderilla, Ver.',
      bienvenidaTitulo: '¡Bienvenido a Kintsugi!',
      bienvenidaTexto: 'Ramen artesanal, sushi armado a tu gusto, entradas y bebidas tradicionales.',
      horario: 'Mar a Dom · 1:00 PM – 10:00 PM',
      direccion: 'Centro, Banderilla, Veracruz',
      zona: 'Centro, Banderilla',
      whatsapp: '228 123 4567',
      facebook: 'https://facebook.com/',
      instagram: 'https://instagram.com/',
      portada: '/img/panda.jpg',
      mascota: '/img/panda.jpg',
      avisoMesero: 'Pídelo a tu mesero',
    });
    await db.insert(s.secciones).values(secciones);
    await db.insert(s.categorias).values(categorias);
    await db.insert(s.productos).values(
      productos.map((p, i) => ({
        ...p,
        img: CON_ILUSTRACION.includes(p.id) ? `/img/platillos/${p.id}.jpg` : p.img,
        disponible: p.id !== 'calpis-sabor',
        orden: i,
      })),
    );
    await db.insert(s.sushiConfig).values({ id: 1, incluidos: 3, extraVerdura: 15, extraProteina: 25 });
    await db.insert(s.sushiIngredientes).values(ingredientes);
    await db.insert(s.promociones).values(promos);
    await db.insert(s.promocionProductos).values([
      { promocionId: 'promo-sushi', productoId: 'futomaki' },
      { promocionId: 'promo-sushi', productoId: 'uramaki' },
      { promocionId: 'promo-te', productoId: 'te-helado' },
    ]);
    console.log(`Menú cargado: ${productos.length} platillos, ${categorias.length} categorías.`);
  }

  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const pass = process.env.ADMIN_PASSWORD || '';
  if (email && pass) {
    const ya = await db.select({ id: s.adminUsuarios.id }).from(s.adminUsuarios);
    if (!ya.length) {
      await db.insert(s.adminUsuarios).values({ email, nombre: 'Dueño', passwordHash: await bcrypt.hash(pass, 12) });
      console.log(`Usuario del panel creado: ${email}`);
    }
  }
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
