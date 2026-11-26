/* Kintsugi Banderilla · componentes compartidos (menú público y panel admin). */
(function () {
  'use strict';

  // Las páginas del admin viven en /admin y definen window.KROOT = '../'.
  var ROOT = window.KROOT || '';
  var S = window.KStore;

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function src(path) {
    if (!path) return '';
    if (/^(data:|blob:|https?:)/.test(path)) return path;
    return ROOT + path;
  }

  function money(n) {
    var v = Number(n) || 0;
    return '$' + (Math.round(v) === v ? v : v.toFixed(2));
  }

  function param(name) { return new URLSearchParams(location.search).get(name); }

  function waNumber() {
    var d = String(S.data.negocio.whatsapp || '').replace(/\D/g, '');
    if (d.length === 10) d = '52' + d;
    return d;
  }

  function waLink(msg) {
    var n = waNumber();
    return 'https://wa.me/' + n + (msg ? '?text=' + encodeURIComponent(msg) : '');
  }

  function link(url) { return url && /^https?:\/\//.test(url) ? url : '#'; }

  /* ---------- Fondos ---------- */

  // Devuelve el HTML de fondo de una sección: la imagen del dueño o el fondo sumi-e generado.
  function fondo(key, cls) {
    var f = S.data.fondos[key];
    cls = cls || 'absolute inset-0 w-full h-full';
    if (f) return '<img src="' + esc(src(f)) + '" alt="" class="' + cls + ' object-cover pointer-events-none">';
    return '<div class="' + cls + ' bg-sumi pointer-events-none" aria-hidden="true"></div>';
  }

  /* ---------- Miniaturas ---------- */

  // Foto del platillo o, si no hay, un sello con el kanji de la categoría.
  function thumb(p, cls, shape) {
    var cat = S.categoria(p.cat) || {};
    shape = shape || 'rounded-full';
    if (p.img) {
      return '<img src="' + esc(src(p.img)) + '" alt="' + esc(p.nombre) + '" class="' + cls + ' ' + shape + ' object-cover border border-kintsugi-gold shrink-0">';
    }
    return '<span class="' + cls + ' ' + shape + ' shrink-0 inline-flex items-center justify-center bg-washi border border-kintsugi-gold/70 text-primary font-bold" style="font-family:\'Noto Sans JP\',sans-serif" aria-hidden="true">' + esc(cat.kanji || '品') + '</span>';
  }

  /* ---------- Menú público ---------- */

  function menuHeader(activo) {
    var tabs = S.data.secciones.map(function (s) {
      var on = s.id === activo;
      return '<a href="menu.html?s=' + esc(s.id) + '"' + (on ? ' aria-current="page"' : '') +
        ' class="flex flex-col items-center justify-center py-gutter-xs px-gutter-xs rounded-md ' +
        (on ? 'bg-ink-black text-washi border-2 border-kintsugi-gold' : 'bg-light-surface-container-low text-ink-black border border-kintsugi-gold/70 hover:border-primary') + '">' +
        '<span class="font-body text-body-sm ' + (on ? 'text-kintsugi-gold' : 'text-smoke-gray') + ' leading-none" aria-hidden="true">' + esc(s.jp) + '</span>' +
        '<span class="font-label text-label-sm leading-tight mt-0.5">' + esc(s.nombre) + '</span></a>';
    }).join('');

    return '' +
      '<header class="sticky top-0 z-30 bg-washi/95 border-b-2 border-kintsugi-gold px-page-margin py-gutter-sm flex flex-col gap-gutter-sm">' +
        '<div class="flex items-center justify-between gap-gutter-sm border-b border-kintsugi-gold/40 pb-gutter-xs">' +
          '<a href="index.html" class="flex items-center gap-gutter-xs">' +
            '<span class="px-1.5 py-0.5 rounded-sm bg-primary text-on-primary font-body text-body-sm font-bold" aria-hidden="true">金継</span>' +
            '<span class="font-display text-headline-lg text-primary leading-none tracking-wide uppercase">KINTSUGI</span>' +
          '</a>' +
          '<a href="arma-tu-sushi.html" class="inline-flex items-center gap-1 px-gutter-md py-gutter-xs rounded-full bg-primary text-on-primary border border-kintsugi-gold font-label text-label-sm shrink-0">' +
            '<span class="material-symbols-outlined text-body-md" aria-hidden="true">restaurant</span><span>Arma tu sushi</span>' +
          '</a>' +
        '</div>' +
        '<nav aria-label="Secciones del menú" class="grid gap-gutter-xs" style="grid-template-columns:repeat(' + S.data.secciones.length + ',minmax(0,1fr))">' + tabs + '</nav>' +
      '</header>';
  }

  function footer() {
    var n = S.data.negocio;
    return '' +
      '<footer class="relative z-10 border-t-2 border-kintsugi-gold bg-washi/95 px-page-margin py-gutter-lg flex flex-col gap-gutter-md">' +
        '<div class="flex items-center justify-between gap-gutter-md">' +
          '<div class="flex flex-col gap-gutter-xs min-w-0">' +
            '<span class="font-display text-headline-md text-primary uppercase">' + esc(n.nombre) + '</span>' +
            '<p class="font-body text-body-sm text-smoke-gray flex items-center gap-1"><span class="material-symbols-outlined text-body-md text-primary" aria-hidden="true">schedule</span>' + esc(n.horario) + '</p>' +
            '<p class="font-body text-body-sm text-smoke-gray flex items-center gap-1"><span class="material-symbols-outlined text-body-md text-primary" aria-hidden="true">location_on</span>' + esc(n.direccion) + '</p>' +
          '</div>' +
          '<img src="' + esc(src(S.data.mascota)) + '" alt="" class="w-12 h-12 rounded-full object-cover object-top border-2 border-kintsugi-gold shrink-0">' +
        '</div>' +
        '<div class="grid grid-cols-3 gap-gutter-sm">' +
          '<a href="' + esc(waLink('¡Hola Kintsugi! 🍜')) + '" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-1 py-gutter-sm px-gutter-sm rounded-full bg-success text-on-success font-label text-label-sm"><span class="material-symbols-outlined text-body-md" aria-hidden="true">chat</span><span>WhatsApp</span></a>' +
          '<a href="' + esc(link(n.facebook)) + '" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-1 py-gutter-sm px-gutter-sm rounded-full bg-secondary text-on-secondary font-label text-label-sm"><span class="material-symbols-outlined text-body-md" aria-hidden="true">thumb_up</span><span>Facebook</span></a>' +
          '<a href="' + esc(link(n.instagram)) + '" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-1 py-gutter-sm px-gutter-sm rounded-full bg-primary text-on-primary font-label text-label-sm"><span class="material-symbols-outlined text-body-md" aria-hidden="true">photo_camera</span><span>Instagram</span></a>' +
        '</div>' +
      '</footer>';
  }

  /* ---------- Panel admin ---------- */

  var ADMIN_KEY = 'kintsugi-admin-sesion';

  function isLogged() { try { return sessionStorage.getItem(ADMIN_KEY) === '1'; } catch (e) { return false; } }
  function login() { try { sessionStorage.setItem(ADMIN_KEY, '1'); } catch (e) { /* nada */ } }
  function logout() { try { sessionStorage.removeItem(ADMIN_KEY); } catch (e) { /* nada */ } }
  function guard() { if (!isLogged()) location.replace('index.html'); }

  function adminBg() {
    var f = S.data.fondos.admin;
    return '<div class="fixed inset-0 max-w-md mx-auto pointer-events-none z-0 overflow-hidden">' +
      (f ? '<img src="' + esc(src(f)) + '" alt="" class="w-full h-full object-cover">' : '<div class="w-full h-full bg-sumi"></div>') +
      '</div>';
  }

  // Encabezado con marca: subtitle = texto pequeño; right = HTML del botón derecho.
  function adminHeader(subtitle, right) {
    return '<header class="sticky top-0 z-30 bg-light-surface-container-low/95 border-b-2 border-kintsugi-gold px-page-margin py-gutter-md flex items-center justify-between gap-gutter-sm">' +
      '<div class="flex items-center gap-gutter-sm">' +
        '<span class="px-1.5 py-0.5 rounded-sm bg-primary text-on-primary font-body text-body-sm font-bold" aria-hidden="true">金継</span>' +
        '<div class="flex flex-col"><span class="font-display text-headline-md text-primary leading-none uppercase">KINTSUGI</span>' +
        '<span class="font-label text-label-sm text-smoke-gray">' + esc(subtitle) + '</span></div>' +
      '</div>' + (right || '') + '</header>';
  }

  // Encabezado contextual con flecha de regreso.
  function adminBackHeader(title, href, label) {
    return '<header class="sticky top-0 z-30 bg-light-surface-container-low/95 border-b-2 border-kintsugi-gold px-page-margin py-gutter-md flex items-center justify-between gap-gutter-sm">' +
      '<a href="' + esc(href) + '" aria-label="' + esc(label || 'Volver') + '" class="w-10 h-10 rounded-full bg-light-surface-container-low border border-kintsugi-gold flex items-center justify-center text-ink-black">' +
        '<span class="material-symbols-outlined" aria-hidden="true">arrow_back</span></a>' +
      '<h1 class="font-headline text-headline-md text-ink-black">' + esc(title) + '</h1>' +
      '<span class="w-10" aria-hidden="true"></span></header>';
  }

  function adminNav(activo) {
    var items = [
      ['panel', 'panel.html', 'dashboard', 'Inicio'],
      ['platillos', 'platillos.html', 'restaurant_menu', 'Menú'],
      ['promos', 'promos.html', 'local_offer', 'Promos'],
      ['ajustes', 'ajustes.html', 'settings', 'Ajustes']
    ];
    return '<nav aria-label="Navegación de administración" class="sticky bottom-0 z-30 bg-light-surface-container-low border-t-2 border-kintsugi-gold grid grid-cols-4 px-gutter-xs py-gutter-xs">' +
      items.map(function (it) {
        var on = it[0] === activo;
        return '<a href="' + it[1] + '"' + (on ? ' aria-current="page"' : '') + ' class="flex flex-col items-center gap-0.5 py-gutter-xs rounded-md ' + (on ? 'text-primary' : 'text-smoke-gray hover:text-ink-black') + '">' +
          '<span class="material-symbols-outlined text-headline-md' + (on ? ' fill' : '') + '" aria-hidden="true">' + it[2] + '</span>' +
          '<span class="font-label text-label-sm">' + it[3] + '</span></a>';
      }).join('') + '</nav>';
  }

  /* ---------- Utilidades ---------- */

  var toastTimer;
  function toast(msg) {
    var el = document.getElementById('k-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'k-toast';
      el.setAttribute('role', 'status');
      el.className = 'k-toast fixed left-1/2 bottom-24 z-50 -translate-x-1/2 px-gutter-lg py-gutter-sm rounded-full bg-ink-black text-washi border border-kintsugi-gold font-label text-label-sm shadow-lg';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2200);
  }

  // Lee una foto, la reduce (máx. maxW px) y la devuelve como dataURL JPEG.
  function readImage(file, maxW) {
    maxW = maxW || 900;
    return new Promise(function (resolve, reject) {
      if (!file || !/^image\//.test(file.type)) { reject(new Error('Archivo no válido')); return; }
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error('No se pudo leer la imagen')); };
      reader.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error('Imagen dañada')); };
        img.onload = function () {
          var scale = Math.min(1, maxW / img.width);
          var c = document.createElement('canvas');
          c.width = Math.round(img.width * scale);
          c.height = Math.round(img.height * scale);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL('image/jpeg', 0.8));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Abre un selector de archivo y entrega la imagen reducida.
  function pickImage(maxW) {
    return new Promise(function (resolve) {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = function () {
        if (!input.files || !input.files[0]) return;
        readImage(input.files[0], maxW).then(resolve).catch(function (e) { alert(e.message); });
      };
      input.click();
    });
  }

  window.KUI = {
    esc: esc, src: src, money: money, param: param, waLink: waLink,
    fondo: fondo, thumb: thumb, menuHeader: menuHeader, footer: footer,
    isLogged: isLogged, login: login, logout: logout, guard: guard,
    adminBg: adminBg, adminHeader: adminHeader, adminBackHeader: adminBackHeader, adminNav: adminNav,
    toast: toast, readImage: readImage, pickImage: pickImage
  };
})();
