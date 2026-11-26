# Kintsugi Banderilla · Menú digital (prototipo)

Prototipo navegable del menú digital de **Kintsugi Banderilla**, hecho a partir del diseño exportado de Google Stitch (11 pantallas). Es HTML con Tailwind (CDN) y JavaScript sin dependencias. No hay que compilar nada.

## Cómo abrirlo

Desde esta carpeta:

```bash
python -m http.server 5510
```

Luego abre <http://localhost:5510>. Ábrelo con un servidor y no con doble clic: en `file://` algunos navegadores no comparten los datos guardados entre páginas.

## Pantallas

| Diseño de Stitch | Archivo |
|---|---|
| 0 · Bienvenida | `index.html` |
| 1a · Ramen y Sushi | `menu.html?s=ramen-sushi` |
| 1b · Entradas y brochetas | `menu.html?s=entradas` |
| 1c · Bebidas y postres | `menu.html?s=bebidas` |
| 2 · Detalle del producto | `producto.html?id=kintsugi` |
| 3 · Arma tu sushi | `arma-tu-sushi.html` |
| 4 · Admin acceso | `admin/index.html` |
| 5 · Admin panel principal | `admin/panel.html` |
| 6 · Admin platillos y precios | `admin/platillos.html` |
| 7 · Admin editar platillo | `admin/editar.html?id=…` |
| 8 · Admin promociones | `admin/promos.html` |
| 9 · Admin configurador sushi | `admin/sushi.html` |
| 10 · Admin apariencia y negocio | `admin/ajustes.html` |

**Acceso demo:** `dueno@kintsugibanderilla.mx` / `kintsugi2026` (ya vienen escritos en el formulario).

## Qué puede editar el dueño

- **Platillos:** nombre, nombre japonés, precio, categoría, foto, texto corto, descripción, etiquetas (Especialidad, Nuevo…), opciones o sabores, y disponible o agotado. También puede agregar y eliminar platillos.
- **Promociones:** título, texto, imagen, etiqueta, platillos a los que aplica, si está activa y si sale en la portada.
- **Arma tu sushi:** precio de cada rollo, cuántos ingredientes incluye, precio de los extras, y los ingredientes (agregar, editar, quitar, activar o desactivar).
- **Negocio y apariencia:** WhatsApp, horario, dirección, redes sociales, mensaje de bienvenida y el fondo de cada sección.

Los pedidos se mandan por WhatsApp con un mensaje ya escrito, que incluye el sushi armado y el total.

## Estructura

```
assets/js/store.js            datos del menú (semilla) + guardar/cargar
assets/js/ui.js               componentes compartidos (encabezados, pie, nav admin, fotos)
assets/js/tailwind-config.js  tokens del diseño de Stitch (colores, tipografías, espacios)
assets/css/kintsugi.css       utilidades y fondo sumi-e generado
assets/img/                   imágenes
```

## Limitaciones del prototipo

- Los datos se guardan en el `localStorage` del navegador: cada dispositivo tiene su propia copia. Para producción esto pasa a una API con base de datos, y entonces lo que el dueño edite se verá en el celular de todos los clientes.
- El inicio de sesión es solo demostrativo. No es seguro.
- Las fotos que sube el dueño se reducen a 900 px y se guardan dentro del navegador, que aguanta unos 5 MB en total.
- Las imágenes generadas en Stitch requieren la sesión de Google de la cuenta que hizo el diseño, así que no se pudieron descargar. Se usaron las fotos reales del negocio (panda, promo, futomaki y uramaki) y un fondo sumi-e generado con CSS. Las demás fotos se suben desde el panel, en **Platillos → Editar → Cambiar foto**.
