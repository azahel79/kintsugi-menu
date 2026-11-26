# Kintsugi Banderilla · Menú digital

Menú digital de solo lectura para **Kintsugi (Cocina Japonesa, Banderilla)**, con un panel donde el dueño edita todo. El diseño parte de las 11 pantallas exportadas de Google Stitch.

- **Next.js 16** (App Router, Cache Components, Turbopack) + **TypeScript** + **Tailwind CSS 4**
- **Neon** (Postgres) con **Drizzle ORM**
- **Motion** para las animaciones; los pétalos de sakura son un canvas propio, sin librería
- Sesión del panel con cookie firmada (JWT, `jose`) y contraseñas cifradas con `bcryptjs`

## Arrancar en local

```bash
npm install
cp .env.example .env.local   # y llena DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run db:migrate           # crea las tablas en Neon
npm run db:seed              # carga el menú de ejemplo y el usuario del panel
npm run dev -- -p 3100
```

- Menú público: <http://localhost:3100>
- Panel del dueño: <http://localhost:3100/admin>

## Rutas

| Ruta | Qué es |
|---|---|
| `/` | Portada: el panda se revela con una gota de tinta, el título se escribe con pincel y cae el sello 金継 |
| `/menu/[seccion]` | Ramen y Sushi · Entradas · Bebidas. Al entrar se abre una cortina noren |
| `/platillo/[id]` | Detalle en una hoja de papel washi (foto, descripción, sabores, sello 特選) |
| `/admin/login` | Acceso del dueño |
| `/admin` | Resumen y accesos rápidos |
| `/admin/platillos` | Buscar, filtrar, marcar agotado, reordenar, crear y editar platillos |
| `/admin/promos` | Crear y editar promociones; activar o pausar; mostrar en portada |
| `/admin/sushi` | Precios de rollos, cuántos ingredientes incluye, precio de extras, ingredientes |
| `/admin/categorias` | Nombres de las pestañas y categorías, notas, textos verticales y sellos |
| `/admin/ajustes` | Portada, mascota, fondo de cada sección, datos del negocio y contraseña |
| `/media/[id]` | Fotos subidas desde el panel (caché inmutable) |

El cliente **solo consulta** el menú: no hay pedidos ni carrito. "Arma tu sushi" se muestra como guía informativa.

## Cómo se actualiza el menú

- `src/lib/menu.ts` lee todo el menú en una sola consulta con `'use cache'` y la etiqueta `menu`. Las páginas públicas se generan como HTML estático.
- Cada acción del panel (`src/lib/actions.ts`) termina con `updateTag('menu')`, así que el cambio se ve al instante y los clientes nunca esperan a la base de datos.
- Como respaldo, la caché se renueva una vez al día. Si editas la base **fuera del panel**, el cambio puede tardar hasta 24 h; reinicia el servidor para verlo antes.

## Fotos

El navegador reduce las fotos (máx. 1400 px, WebP) antes de subirlas. Se guardan en Neon (tabla `imagenes`) mientras se define el hosting y se sirven en `/media/[id]`, optimizadas por `next/image`. Las fotos que se suben pero nunca se guardan se borran solas después de 24 h. Si después se usa un bucket (S3, R2, Cloudinary), solo cambian `subirImagen` y la ruta `/media`.

## Base de datos

```bash
npm run db:generate   # genera una migración después de cambiar src/db/schema.ts
npm run db:migrate    # aplica migraciones
npm run db:seed -- --reset   # vuelve a cargar el menú de ejemplo (no borra fotos ni usuarios)
npm run db:studio     # explorador visual de Drizzle
```

## Producción (servidor propio)

```bash
npm run build && npm start   # usa PORT=xxxx para cambiar el puerto
```

- Pon el servidor detrás de Nginx con HTTPS: la cookie de sesión es `secure` en producción.
- Las fuentes latinas están en `src/fonts`, así que el build no necesita descargarlas. Las japonesas (Noto Sans JP y Yuji Syuku) y los íconos los sirve Google Fonts al navegador.
- Si agregas un ícono Material Symbols nuevo, agrégalo a `src/lib/icons.ts`. Solo se descargan los que están en esa lista.

## Estructura

```
src/app/(public)/      menú público (portada, secciones, detalle)
src/app/admin/         panel del dueño
src/app/media/[id]/    fotos guardadas en Neon
src/components/anim/   animaciones: grieta dorada, pergamino, sello hanko, texto vertical, pétalos
src/components/menu/   piezas del menú (encabezado, faroles, tarjetas, promo, portada)
src/components/admin/  piezas del panel (estructura, formularios, selector de fotos)
src/db/                esquema, conexión y datos iniciales
src/lib/               menú en caché, acciones del servidor, sesión, íconos
src/proxy.ts           protege /admin (Next 16 renombró middleware → proxy)
prototipo-html/        prototipo HTML original (referencia)
```
