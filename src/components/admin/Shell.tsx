import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

type Nav = 'panel' | 'platillos' | 'promos' | 'ajustes' | null;

const NAV: [Exclude<Nav, null>, string, string, string][] = [
  ['panel', '/admin', 'dashboard', 'Inicio'],
  ['platillos', '/admin/platillos', 'restaurant_menu', 'Menú'],
  ['promos', '/admin/promos', 'local_offer', 'Promos'],
  ['ajustes', '/admin/ajustes', 'settings', 'Ajustes'],
];

/**
 * Estructura común del panel (fondo, encabezado y navegación inferior).
 * - `subtitulo` + `derecha`: encabezado con marca.
 * - `volver`: encabezado contextual con flecha de regreso.
 */
export function AdminShell({
  children,
  subtitulo,
  derecha,
  volver,
  nav = null,
}: {
  children: ReactNode;
  subtitulo?: string;
  derecha?: ReactNode;
  volver?: { href: string; titulo: string };
  nav?: Nav;
}) {
  return (
    <div className="relative min-h-dvh max-w-md mx-auto bg-light-surface flex flex-col overflow-x-clip text-ink-black">
      {/* Mismo lenguaje que el menú: fondo ilustrado fijo con un velo de papel washi */}
      <div aria-hidden="true" className="fixed inset-0 max-w-md mx-auto pointer-events-none z-0">
        <Image src="/img/fondo-ramen-sushi-bambu.jpg" alt="" fill sizes="448px" className="object-cover" />
        <div className="absolute inset-0 bg-washi/35" />
      </div>

      {volver ? (
        <header className="sticky top-0 z-30 bg-ink-black border-b border-kintsugi-gold/60 shadow-[0_8px_24px_-12px_rgba(0,0,0,.6)] px-page-margin py-gutter-md flex items-center justify-between gap-gutter-sm text-washi">
          <Link href={volver.href} aria-label="Volver" className="w-10 h-10 rounded-full bg-washi/5 border border-kintsugi-gold/50 flex items-center justify-center hover:bg-washi/10">
            <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          </Link>
          <h1 className="font-headline text-headline-md">{volver.titulo}</h1>
          <span className="w-10" aria-hidden="true" />
        </header>
      ) : (
        <header className="sticky top-0 z-30 bg-ink-black border-b border-kintsugi-gold/60 shadow-[0_8px_24px_-12px_rgba(0,0,0,.6)] px-page-margin py-gutter-md flex items-center justify-between gap-gutter-sm">
          <div className="flex items-center gap-gutter-sm">
            <span className="px-1.5 py-0.5 rounded-sm bg-primary text-on-primary font-brush text-body-md" aria-hidden="true">金継</span>
            <div className="flex flex-col">
              <span className="font-display text-headline-md text-primary leading-none uppercase [paint-order:stroke_fill] [-webkit-text-stroke:2px_#F2EEE6]">KINTSUGI</span>
              <span className="font-label text-label-sm text-kintsugi-gold">{subtitulo}</span>
            </div>
          </div>
          {derecha}
        </header>
      )}

      <main className="relative z-10 flex-1 px-page-margin py-gutter-lg flex flex-col gap-gutter-lg">{children}</main>

      {nav && (
        <nav aria-label="Navegación del panel" className="sticky bottom-0 z-30 bg-ink-black border-t border-kintsugi-gold/60 grid grid-cols-4 gap-gutter-xs px-gutter-sm pt-gutter-sm pb-[max(8px,env(safe-area-inset-bottom))]">
          {NAV.map(([id, href, icono, label]) => {
            const on = id === nav;
            return (
              <Link
                key={id}
                href={href}
                aria-current={on ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 py-gutter-xs rounded-md transition-colors ${
                  on ? 'bg-primary text-on-primary shadow-[0_0_14px_-2px_rgba(200,55,45,.7)]' : 'text-washi/70 hover:text-washi hover:bg-washi/5'
                }`}
              >
                <span className={`material-symbols-outlined text-headline-md ${on ? 'fill' : 'text-kintsugi-gold'}`} aria-hidden="true">{icono}</span>
                <span className="font-label text-label-sm">{label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export function Cargando({ filas = 4 }: { filas?: number }) {
  return (
    <div className="flex flex-col gap-gutter-sm" aria-busy="true" aria-label="Cargando">
      {Array.from({ length: filas }, (_, i) => (
        <div key={i} className="h-20 rounded-md tarjeta-washi border border-kintsugi-gold/40 animate-pulse" />
      ))}
    </div>
  );
}

export const estilos = {
  input:
    'w-full rounded-md bg-washi border border-kintsugi-gold/70 px-gutter-md py-gutter-sm font-body text-body-md text-ink-black focus:border-primary focus:ring-1 focus:ring-primary',
  label: 'font-label text-label-sm text-ink-black',
  tarjeta: 'rounded-lg tarjeta-washi border border-kintsugi-gold/70 p-gutter-md',
  check: 'w-4 h-4 rounded-sm text-primary border-kintsugi-gold focus:ring-primary',
  btnPrimario:
    'inline-flex items-center justify-center gap-gutter-sm w-full py-gutter-md px-gutter-xl rounded-full bg-primary text-on-primary border border-kintsugi-gold font-label text-label-lg hover:bg-primary/90 active:scale-[.98] transition disabled:opacity-60',
  btnChico: 'inline-flex items-center gap-1 px-gutter-md py-gutter-xs rounded-full font-label text-label-sm shrink-0',
};
