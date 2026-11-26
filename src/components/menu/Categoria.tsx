import Image from 'next/image';
import Link from 'next/link';
import { GrietaDorada, Hanko, ListaCascada, Makimono, PrecioSello, TextoVertical, TintaSeca, TituloPincel } from '@/components/anim/Kintsugi';
import { LetrasCaen, PalabrasTinta } from '@/components/anim/Letras';
import { FlotarVertical } from '@/components/anim/Scroll';
import { dinero, type Menu, type MenuProducto } from '@/lib/menu';
import type { Categoria } from '@/db/schema';

const chip = 'px-gutter-xs py-0.5 rounded-sm font-label text-label-sm';

function Agotado({ p }: { p: MenuProducto }) {
  return p.disponible ? null : <span className={`${chip} bg-smoke-gray text-washi`}>Agotado hoy</span>;
}

/** Precios en oro viejo; la Especialidad en bermellón; agotados en gris tachado. */
function Precio({ p, grande = false }: { p: MenuProducto; grande?: boolean }) {
  const color = !p.disponible ? 'text-smoke-gray line-through' : p.etiquetas.includes('Especialidad') ? 'text-primary' : 'text-oro-viejo';
  return (
    <PrecioSello className={`font-price ${grande ? 'text-price-lg' : 'text-price-md'} tabular-nums ${color}`}>
      {dinero(p.precio)}
    </PrecioSello>
  );
}

function JpChico({ jp }: { jp: string }) {
  return jp ? <TintaSeca className="font-jp text-body-sm text-smoke-gray shrink-0">{jp}</TintaSeca> : null;
}

function Foto({ p, clase }: { p: MenuProducto; clase: string }) {
  if (!p.img) return null;
  return <Image src={p.img} alt={p.nombre} width={128} height={128} className={`object-cover border border-kintsugi-gold ${clase}`} />;
}

/** Una fila de platillo según el estilo de su categoría (como en el diseño de Stitch). */
function Fila({ p, cat, ultima }: { p: MenuProducto; cat: Categoria; ultima: boolean }) {
  const linea = ultima ? 'pt-gutter-xs' : 'py-gutter-xs border-b border-ink-black/15';
  const base = `group flex justify-between gap-gutter-sm ${linea} ${p.disponible ? '' : 'opacity-70'} active:bg-ink-black/5 rounded-sm transition-colors`;
  const especial = p.etiquetas.includes('Especialidad');
  const nombre = (
    <h3 className={`font-headline text-title-md uppercase ${especial && p.disponible ? 'texto-brillo' : 'text-ink-black'}`}>{p.nombre}</h3>
  );
  const sub = p.sub ? <span className={`font-body text-body-sm text-smoke-gray ${cat.subMayus ? 'uppercase' : ''}`}>{p.sub}</span> : null;
  const href = `/platillo/${p.id}`;

  if (cat.estilo === 'ramen' && p.etiquetas.includes('Especialidad')) {
    return (
      <Link href={href} className={`${base} items-start`}>
        <div className="flex flex-col gap-gutter-xs min-w-0">
          <div className="flex items-baseline gap-gutter-xs flex-wrap">
            <JpChico jp={p.jp} />
            {nombre}
            <Hanko className={`${chip} bg-primary text-on-primary`}>Especialidad</Hanko>
            <Agotado p={p} />
          </div>
          {p.sub && <p className="font-body text-body-sm text-ink-black text-pretty">{p.sub}</p>}
        </div>
        <div className="flex flex-col items-end gap-gutter-xs shrink-0">
          <Precio p={p} grande />
          <Foto p={p} clase="w-16 h-16 rounded-full border-2 shadow-md" />
        </div>
      </Link>
    );
  }

  if (cat.estilo === 'ramen') {
    return (
      <Link href={href} className={`${base} items-center`}>
        {p.sub ? (
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-gutter-xs"><JpChico jp={p.jp} />{nombre}</div>
            {sub}
          </div>
        ) : (
          <div className="flex items-baseline gap-gutter-xs min-w-0"><JpChico jp={p.jp} />{nombre}</div>
        )}
        <div className="flex items-center gap-gutter-sm shrink-0">
          <Agotado p={p} />
          <Precio p={p} />
          <Foto p={p} clase="w-14 h-14 rounded-full shadow-sm" />
        </div>
      </Link>
    );
  }

  if (cat.estilo === 'sushi') {
    return (
      <Link href={href} className={`${base} items-center`}>
        <div className="flex flex-col min-w-0">
          <h3 className="font-headline text-title-md text-ink-black uppercase">
            {p.nombre} {p.jp && <TintaSeca className="font-jp text-body-sm text-smoke-gray font-normal">{p.jp}</TintaSeca>}
          </h3>
          {sub}
        </div>
        <div className="flex items-center gap-gutter-sm shrink-0">
          <Agotado p={p} />
          <Precio p={p} />
          <Foto p={p} clase="w-16 h-14 rounded-md shadow-sm" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={`${base} items-center`}>
      <div className="flex flex-col min-w-0">
        {nombre}
        {p.sub && <p className={`font-body text-body-sm text-smoke-gray ${cat.subMayus ? 'uppercase' : ''}`}>{p.sub}</p>}
      </div>
      <div className="flex items-center gap-gutter-xs shrink-0">
        <Agotado p={p} />
        <Foto p={p} clase="w-10 h-10 rounded-full" />
        <Precio p={p} />
      </div>
    </Link>
  );
}

function Vertical({ cat }: { cat: Categoria }) {
  if (!cat.vertical) return null;
  const len = Array.from(cat.vertical).length;
  const size = len <= 5 ? 'text-headline-lg' : len <= 7 ? 'text-headline-md' : 'text-title-md';
  const lado = cat.lado === 'izq' ? 'pr-gutter-xs border-r' : 'pl-gutter-xs border-l';
  return (
    <div className={`flex flex-col items-center justify-center shrink-0 ${lado} border-ink-black/20`}>
      <FlotarVertical>
        <TextoVertical texto={cat.vertical} className={`${size} text-ink-black font-bold tracking-widest`} />
      </FlotarVertical>
    </div>
  );
}

/** Guía informativa de "Arma tu sushi" (el cliente solo la consulta). */
function GuiaSushi({ sushi }: { sushi: Menu['sushi'] }) {
  const mitad = Math.ceil(sushi.ingredientes.length / 2);
  return (
    <div className="border-t border-ink-black/25 pt-gutter-sm flex flex-col gap-gutter-md">
      <div className="flex items-center justify-center gap-gutter-sm">
        <span className="font-brush text-headline-md text-primary" aria-hidden="true">寿司</span>
        <LetrasCaen as="h3" texto="Arma tu sushi" className="font-headline text-title-md text-ink-black uppercase" />
      </div>
      <ol className="grid grid-cols-3 gap-gutter-xs text-center">
        {[
          ['一', 'Elige tu rollo'],
          ['二', `Elige ${sushi.incluidos} ingredientes`],
          ['三', 'Agrega extras'],
        ].map(([k, t]) => (
          <li key={k} className="flex flex-col items-center gap-1 rounded-md bg-washi/80 border border-kintsugi-gold/50 p-gutter-xs">
            <span className="w-7 h-7 rounded-sm bg-primary text-on-primary flex items-center justify-center font-brush text-body-md" aria-hidden="true">{k}</span>
            <span className="font-label text-label-sm leading-tight">{t}</span>
          </li>
        ))}
      </ol>
      <ul
        className="grid grid-cols-2 grid-flow-col gap-x-gutter-md gap-y-gutter-xs px-gutter-sm font-body text-body-sm text-ink-black uppercase"
        style={{ gridTemplateRows: `repeat(${mitad}, auto)` }}
        aria-label="Ingredientes disponibles"
      >
        {sushi.ingredientes.map((i) => (
          <li key={i.id} className="flex items-center gap-1">
            <span className="material-symbols-outlined text-body-md text-secondary" aria-hidden="true">{i.icono}</span>
            {i.nombre}
          </li>
        ))}
      </ul>
      <div className="text-center border-t border-ink-black/15 pt-gutter-xs">
        <p className="font-label text-label-sm text-ink-black uppercase">
          Ingrediente extra — Verduras: {dinero(sushi.extraVerdura)} c/u · Proteínas: {dinero(sushi.extraProteina)} c/u
        </p>
      </div>
    </div>
  );
}

export function CategoriaCard({ cat, menu, indice }: { cat: Categoria; menu: Menu; indice: number }) {
  const items = menu.productos.filter((p) => p.categoriaId === cat.id);
  if (!items.length) return null;

  const lista = (
    <ListaCascada className="flex-1 min-w-0 flex flex-col gap-gutter-sm">
      {items.map((p, i) => (
        <Fila key={p.id} p={p} cat={cat} ultima={i === items.length - 1} />
      ))}
    </ListaCascada>
  );

  return (
    <Makimono
      id={cat.id}
      className="relative z-10 rounded-xl border-2 border-ink-black/70 bg-washi/75 backdrop-blur-[3px] p-gutter-md flex flex-col gap-gutter-md shadow-[0_6px_24px_-12px_rgba(20,20,20,.45)]"
    >
      {cat.mostrarTitulo ? (
        <div className="flex flex-col items-center text-center gap-gutter-xs">
          <TituloPincel className="font-display text-headline-lg text-primary tracking-wider uppercase">{cat.nombre}</TituloPincel>
          {cat.nota && <PalabrasTinta texto={cat.nota} className="font-body text-body-sm text-ink-black text-pretty" />}
          <GrietaDorada variante={indice} className="mt-gutter-xs" delay={0.3} />
        </div>
      ) : (
        <h2 className="sr-only">{cat.nombre}</h2>
      )}
      <div className="flex items-stretch gap-gutter-sm">
        {cat.lado === 'izq' ? <><Vertical cat={cat} />{lista}</> : <>{lista}<Vertical cat={cat} /></>}
      </div>
      {cat.armable && <GuiaSushi sushi={menu.sushi} />}
    </Makimono>
  );
}
