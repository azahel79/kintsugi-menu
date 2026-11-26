/*
 * Kintsugi Banderilla · almacén de datos del prototipo.
 * Todo lo que ve el cliente sale de aquí y todo lo edita el panel admin.
 * En el prototipo se guarda en localStorage; en producción esto será la API + base de datos.
 */
(function () {
  'use strict';

  var KEY = 'kintsugi-menu-v1';
  var VERSION = 1;

  var IMG = 'assets/img/';

  function ramenDesc(extra) {
    return 'Fondo de la casa' + (extra ? ', ' + extra : '') + ', espinacas, mitad de huevo duro y alga nori.';
  }

  var SEED = {
    version: VERSION,

    negocio: {
      nombre: 'Kintsugi Banderilla',
      lema: 'Cocina Japonesa · Banderilla, Ver.',
      bienvenidaTitulo: '¡Bienvenido a Kintsugi!',
      bienvenidaTexto: 'Ramen artesanal, sushi armado a tu gusto, entradas y bebidas tradicionales.',
      horario: 'Mar a Dom · 1:00 PM – 10:00 PM',
      direccion: 'Centro, Banderilla, Veracruz',
      zona: 'Centro, Banderilla',
      whatsapp: '228 123 4567',
      facebook: 'https://facebook.com/',
      instagram: 'https://instagram.com/'
    },

    // Acceso de demostración (en producción: usuarios en BD con contraseña cifrada).
    admin: { email: 'dueno@kintsugibanderilla.mx', password: 'kintsugi2026' },

    // null = fondo sumi-e generado por CSS.
    fondos: {
      bienvenida: IMG + 'panda.jpg',
      'ramen-sushi': null,
      entradas: null,
      bebidas: IMG + 'fondo-bebidas.jpg'
    },
    mascota: IMG + 'panda.jpg',

    secciones: [
      { id: 'ramen-sushi', nombre: 'Ramen y Sushi', jp: '麺・寿司' },
      { id: 'entradas', nombre: 'Entradas', jp: '一品・串' },
      { id: 'bebidas', nombre: 'Bebidas', jp: '飲・甘味' }
    ],

    /*
     * estilo: 'ramen'  -> japonés antes del nombre, precio y foto redonda a la derecha
     *         'sushi'  -> japonés después del nombre, foto cuadrada, lleva a "Arma tu sushi"
     *         'lista'  -> descripción debajo, foto antes del precio
     */
    categorias: [
      { id: 'ramen', seccion: 'ramen-sushi', nombre: 'Ramen', mostrarTitulo: true, estilo: 'ramen', subMayus: true, vertical: '尺丹爪巨刀', lado: 'izq', kanji: '麺',
        nota: 'Todos los Ramen se preparan con fondo de la casa, espinacas, mitad de huevo duro y alga nori.' },
      { id: 'sushi', seccion: 'ramen-sushi', nombre: 'Sushi', mostrarTitulo: false, estilo: 'sushi', subMayus: true, vertical: '丂凵丂卄丨', lado: 'der', kanji: '寿', armable: true, nota: '' },
      { id: 'entradas', seccion: 'entradas', nombre: 'Entradas y arroz', mostrarTitulo: true, estilo: 'lista', subMayus: false, vertical: '一乙丹长丹丫丹', lado: 'der', kanji: '品', nota: '' },
      { id: 'brochetas', seccion: 'entradas', nombre: 'Yakitori y Kushiyaki', mostrarTitulo: false, estilo: 'lista', subMayus: false, vertical: '长山ㄎ卄一丫丹', lado: 'izq', kanji: '串', nota: '' },
      { id: 'kushiage', seccion: 'entradas', nombre: 'Kushiage', mostrarTitulo: false, estilo: 'lista', subMayus: false, vertical: '长山ㄎ卄一丹匚', lado: 'der', kanji: '揚', nota: '' },
      { id: 'bebidas', seccion: 'bebidas', nombre: 'Bebidas', mostrarTitulo: true, estilo: 'lista', subMayus: true, vertical: '乃巨乃一口丹丂', lado: 'izq', kanji: '飲', nota: '' },
      { id: 'postres', seccion: 'bebidas', nombre: 'Postres', mostrarTitulo: true, estilo: 'lista', subMayus: true, vertical: '尸口丂丁尺巨丂', lado: 'der', kanji: '甘', nota: '' }
    ],

    productos: [
      // RAMEN
      { id: 'vegetales', cat: 'ramen', nombre: 'Vegetales', jp: '野菜', precio: 70, sub: '', desc: ramenDesc('verduras de temporada') },
      { id: 'pollo-marinado', cat: 'ramen', nombre: 'Pollo marinado', jp: '鶏', precio: 75, sub: '', desc: ramenDesc('pollo marinado') },
      { id: 'cerdo-marinado', cat: 'ramen', nombre: 'Cerdo marinado', jp: '豚', precio: 75, sub: '', desc: ramenDesc('cerdo marinado') },
      { id: 'tocino', cat: 'ramen', nombre: 'Tocino', jp: 'ベーコン', precio: 75, sub: '', desc: ramenDesc('tocino dorado') },
      { id: 'dayto', cat: 'ramen', nombre: 'Dayto', jp: 'デイト', precio: 100, sub: '(Cerdo y camarón)', desc: ramenDesc('cerdo marinado y camarón') },
      { id: 'camarones', cat: 'ramen', nombre: 'Camarones', jp: 'メン', precio: 120, sub: '', desc: ramenDesc('camarones') },
      { id: 'arrachera', cat: 'ramen', nombre: 'Arrachera', jp: '牛', precio: 120, sub: '', desc: ramenDesc('arrachera') },
      { id: 'kintsugi', cat: 'ramen', nombre: 'Kintsugi', jp: '全部', precio: 200,
        sub: 'Fondo de la casa, camarón, arrachera, tocino, cerdo marinado, pollo, dos mitades de huevo duro y naruto.',
        desc: 'Nuestro ramen insignia servido en tazón ceremonial: fondo de la casa cocinado a fuego lento, camarón, arrachera, tocino dorado, cerdo marinado, pollo, dos mitades de huevo duro, naruto, espinacas y alga nori.',
        etiquetas: ['Especialidad', 'Nuevo', 'Picante opcional'],
        opciones: { titulo: 'Estilo de caldo', valores: ['Tradicional', 'Picante suave', 'Extra picante'] } },

      // SUSHI (rollos de "Arma tu sushi")
      { id: 'furaimaki', cat: 'sushi', nombre: 'Furaimaki', jp: 'フライ巻き', precio: 140, sub: '(Empanizado)', desc: 'Empanizado crujiente' },
      { id: 'futomaki', cat: 'sushi', nombre: 'Futomaki', jp: '太巻き', precio: 90, sub: '(Alga por fuera)', desc: 'Alga nori por fuera', img: IMG + 'sushi-futomaki.jpg' },
      { id: 'uramaki', cat: 'sushi', nombre: 'Uramaki', jp: '裏巻き', precio: 90, sub: '(Alga por dentro)', desc: 'Alga por dentro, arroz por fuera', img: IMG + 'sushi-uramaki.jpg' },

      // ENTRADAS Y ARROZ
      { id: 'gyoza', cat: 'entradas', nombre: 'Gyoza', precio: 75, sub: 'Empanadas japonesas de masa fina, rellenas de carne de cerdo (5 piezas).' },
      { id: 'tempura-surimi', cat: 'entradas', nombre: 'Tempura surimi', precio: 80, sub: '(5 piezas)' },
      { id: 'tempura-camaron', cat: 'entradas', nombre: 'Tempura camarón', precio: 120, sub: '(150 gramos)' },
      { id: 'takoyaki', cat: 'entradas', nombre: 'Takoyaki', precio: 75, sub: 'Bolitas crujientes y suaves por dentro, rellenas de pulpo (5 piezas).' },
      { id: 'domburi', cat: 'entradas', nombre: 'Domburi', precio: 70, sub: 'Verduras salteadas con pollo y tocino sobre gohan.' },
      { id: 'yakisoba', cat: 'entradas', nombre: 'Yakisoba (fideos)', precio: 85, sub: 'Vegetariano o con pollo.' },
      { id: 'yakisoba-premium', cat: 'entradas', nombre: 'Yakisoba (fideos)', precio: 140, sub: 'Con arrachera o camarón.' },
      { id: 'yakimeshi', cat: 'entradas', nombre: 'Yakimeshi', precio: 75, sub: 'Arroz frito (vegetariano / pollo / tocino).' },
      { id: 'yakimeshi-premium', cat: 'entradas', nombre: 'Yakimeshi', precio: 90, sub: 'Arroz frito (camarón / arrachera).' },
      { id: 'yakimeshi-mixto', cat: 'entradas', nombre: 'Yakimeshi mixto', precio: 90, sub: '(Camarón, pollo y tocino).' },

      // BROCHETAS
      { id: 'yakitori', cat: 'brochetas', nombre: 'Yakitori (4 piezas)', precio: 65, sub: 'Brocheta asada de pollo marinado.' },
      { id: 'kushiyaki', cat: 'brochetas', nombre: 'Kushiyaki (4 piezas)', precio: 80, sub: 'Brocheta asada de arrachera marinada.' },

      // KUSHIAGE
      { id: 'kushiage-queso', cat: 'kushiage', nombre: 'Kushiage queso (4 piezas)', precio: 75, sub: 'Brocheta empanizada de gouda.' },
      { id: 'kushiage-ebi', cat: 'kushiage', nombre: 'Kushiage ebi (4 piezas)', precio: 120, sub: 'Brocheta empanizada de camarón.' },

      // BEBIDAS
      { id: 'agua-del-dia', cat: 'bebidas', nombre: 'Agua del día', precio: 30, sub: '' },
      { id: 'calpis', cat: 'bebidas', nombre: 'Calpis', precio: 45, sub: '' },
      { id: 'calpis-sabor', cat: 'bebidas', nombre: 'Calpis de sabor', precio: 65, sub: 'Mango / Durazno / Fresa',
        opciones: { titulo: 'Sabor', valores: ['Mango', 'Durazno', 'Fresa'] } },
      { id: 'te-caliente', cat: 'bebidas', nombre: 'Té caliente', precio: 50, sub: 'Jazmín / Verde / Frutos rojos · Tetera 900 ml',
        opciones: { titulo: 'Sabor', valores: ['Jazmín', 'Verde', 'Frutos rojos'] } },
      { id: 'te-helado', cat: 'bebidas', nombre: 'Té helado', precio: 30, sub: '' },

      // POSTRES
      { id: 'volcan-fuji', cat: 'postres', nombre: 'Volcán Fuji', precio: 45, sub: 'Fresa / Chocolate / Vainilla',
        opciones: { titulo: 'Sabor', valores: ['Fresa', 'Chocolate', 'Vainilla'] } },
      { id: 'mochi-helado', cat: 'postres', nombre: 'Mochi helado', precio: 40, sub: '' },
      { id: 'tempura-helado', cat: 'postres', nombre: 'Tempura helado', precio: 50, sub: 'Frutos del bosque / Chocolate / Vainilla',
        opciones: { titulo: 'Sabor', valores: ['Frutos del bosque', 'Chocolate', 'Vainilla'] } }
    ],

    sushi: {
      incluidos: 3,
      extraVerdura: 15,
      extraProteina: 25,
      ingredientes: [
        { id: 'queso-crema', nombre: 'Queso crema', icono: 'bakery_dining', tipo: 'proteina', activo: true },
        { id: 'camaron', nombre: 'Camarón', icono: 'set_meal', tipo: 'proteina', activo: true },
        { id: 'surimi', nombre: 'Surimi', icono: 'phishing', tipo: 'proteina', activo: true },
        { id: 'atun', nombre: 'Atún', icono: 'water', tipo: 'proteina', activo: true },
        { id: 'pollo', nombre: 'Pollo', icono: 'egg_alt', tipo: 'proteina', activo: true },
        { id: 'arrachera', nombre: 'Arrachera', icono: 'skillet', tipo: 'proteina', activo: true },
        { id: 'huevo', nombre: 'Huevo', icono: 'egg', tipo: 'proteina', activo: true },
        { id: 'pepino', nombre: 'Pepino', icono: 'eco', tipo: 'verdura', activo: true },
        { id: 'zanahoria', nombre: 'Zanahoria', icono: 'nutrition', tipo: 'verdura', activo: true },
        { id: 'aguacate', nombre: 'Aguacate', icono: 'spa', tipo: 'verdura', activo: true },
        { id: 'platano', nombre: 'Plátano', icono: 'bakery_dining', tipo: 'verdura', activo: true },
        { id: 'mango', nombre: 'Mango', icono: 'sunny', tipo: 'verdura', activo: true }
      ]
    },

    promos: [
      { id: 'promo-sushi', titulo: '2X$150 EN SUSHI', subtitulo: 'Aplica en Futomaki y Uramaki · Todo octubre',
        texto: 'En Kintsugi no conocemos de restricciones, arma y combina tus ingredientes como más se te antoje.',
        etiqueta: 'PROMO 2x$150', img: IMG + 'promo-sushi.jpg', activa: true, portada: true, productos: ['futomaki', 'uramaki'] },
      { id: 'promo-te', titulo: '2X1 EN TÉ HELADO', subtitulo: 'Viernes de 2:00 PM a 6:00 PM',
        texto: 'Refréscate los viernes por la tarde con nuestro té helado.',
        etiqueta: '2x1', img: '', activa: false, portada: false, productos: ['te-helado'] }
    ]
  };

  // Valores por omisión de cada producto.
  SEED.productos.forEach(function (p, i) {
    if (p.disponible === undefined) p.disponible = true;
    if (!p.etiquetas) p.etiquetas = [];
    if (!p.jp) p.jp = '';
    if (!p.desc) p.desc = '';
    if (!p.img) p.img = '';
    if (!p.opciones) p.opciones = null;
    p.orden = i;
  });
  // Disponibilidad de ejemplo (como en el diseño del panel).
  SEED.productos.forEach(function (p) { if (p.id === 'calpis-sabor') p.disponible = false; });

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && d.version === VERSION) return d;
      }
    } catch (e) { /* almacenamiento no disponible: se usan los datos de ejemplo */ }
    return clone(SEED);
  }

  var data = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      alert('No se pudo guardar. El almacenamiento del navegador está lleno: usa fotos más ligeras o quita alguna.');
      return false;
    }
  }

  function reset() {
    data = clone(SEED);
    try { localStorage.removeItem(KEY); } catch (e) { /* nada */ }
  }

  function byOrden(a, b) { return (a.orden || 0) - (b.orden || 0); }

  function slug(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
  }

  function uid(base, list) {
    var id = slug(base), n = 2, ids = (list || []).map(function (x) { return x.id; });
    var out = id;
    while (ids.indexOf(out) !== -1) { out = id + '-' + n; n++; }
    return out;
  }

  window.KStore = {
    get data() { return data; },
    save: save,
    reset: reset,
    uid: uid,

    seccion: function (id) { return data.secciones.filter(function (s) { return s.id === id; })[0]; },
    categoria: function (id) { return data.categorias.filter(function (c) { return c.id === id; })[0]; },
    categoriasDe: function (seccionId) { return data.categorias.filter(function (c) { return c.seccion === seccionId; }); },
    producto: function (id) { return data.productos.filter(function (p) { return p.id === id; })[0]; },
    productosDe: function (catId) { return data.productos.filter(function (p) { return p.cat === catId; }).sort(byOrden); },
    promosActivas: function () { return data.promos.filter(function (p) { return p.activa; }); },
    promoDe: function (productoId) {
      return data.promos.filter(function (p) { return p.activa && p.productos.indexOf(productoId) !== -1; })[0];
    },
    seccionDeProducto: function (productoId) {
      var p = this.producto(productoId); if (!p) return null;
      var c = this.categoria(p.cat); return c ? c.seccion : null;
    }
  };
})();
