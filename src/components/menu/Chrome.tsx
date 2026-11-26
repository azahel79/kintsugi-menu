import Image from 'next/image';
import Link from 'next/link';
import { GrietaDorada } from '@/components/anim/Kintsugi';
import { LetrasCaen } from '@/components/anim/Letras';
import { FarolViento, FondoParallax, LogoCompacto, ProgresoOro } from '@/components/anim/Scroll';
import { enlaceSeguro, waLink, type Menu } from '@/lib/menu';

/** Farolito chōchin que se mece en el encabezado. */
export function Chochin({ kanji = '麺' }: { kanji?: string }) {
  return (
    <span aria-hidden="true" className="relative inline-block w-9 h-12 origin-top animate-sway">
      <svg viewBox="0 0 36 48" className="w-full h-full drop-shadow-[0_2px_3px_rgba(0,0,0,.25)]">
        <line x1="18" y1="0" x2="18" y2="5" stroke="#141414" strokeWidth="1.5" />
        <rect x="9" y="4" width="18" height="4" rx="1" fill="#141414" />
        <ellipse cx="18" cy="25" rx="15" ry="17" fill="#C8372D" />
        {[14, 20, 26, 32, 38].map((y) => (
          <path key={y} d={`M4.5 ${y - 1} Q18 ${y + 2} 31.5 ${y - 1}`} stroke="#8e1f17" strokeOpacity=".55" fill="none" strokeWidth="1" />
        ))}
        <rect x="9" y="40" width="18" height="4" rx="1" fill="#141414" />
        <line x1="18" y1="44" x2="18" y2="48" stroke="#C9A227" strokeWidth="1.5" />
      </svg>
      <span className="absolute inset-x-0 top-[34%] text-center font-brush text-[13px] leading-none text-washi">{kanji}</span>
    </span>
  );
}

export function MenuHeader({ menu, activa }: { menu: Menu; activa: string }) {
  return (
    <header className="sticky top-0 z-30 bg-ink-black border-b border-kintsugi-gold/60 shadow-[0_8px_24px_-12px_rgba(0,0,0,.6)] px-page-margin pt-[max(8px,env(safe-area-inset-top))] pb-gutter-sm flex flex-col gap-gutter-sm">
      <div className="flex items-center justify-between gap-gutter-sm border-b border-kintsugi-gold/25 pb-gutter-xs">
        <LogoCompacto>
          <Link href="/" className="flex items-center gap-gutter-xs" aria-label="Kintsugi, volver a la portada">
            {/* Sello con el nombre en japonés: 金継ぎ (kintsugi) */}
            <span lang="ja" className="px-1.5 py-0.5 rounded-sm bg-primary text-on-primary border border-kintsugi-gold/70 font-brush text-body-md leading-tight whitespace-nowrap shadow-[0_2px_6px_rgba(0,0,0,.4)]">
              金継ぎ
            </span>
            <LetrasCaen texto="KINTSUGI" cuando="carga" delay={0.15} className="font-display text-headline-lg text-primary leading-none tracking-wide uppercase [paint-order:stroke_fill] [-webkit-text-stroke:3px_#F2EEE6]" />
          </Link>
        </LogoCompacto>
        <div className="flex items-start gap-1 -mb-3">
          <FarolViento><Chochin kanji="麺" /></FarolViento>
          <FarolViento sentido={-1}><Chochin kanji="寿" /></FarolViento>
        </div>
      </div>
      <nav aria-label="Secciones del menú" className="grid gap-gutter-xs" style={{ gridTemplateColumns: `repeat(${menu.secciones.length}, minmax(0, 1fr))` }}>
        {menu.secciones.map((s) => {
          const on = s.id === activa;
          return (
            <Link
              key={s.id}
              href={`/menu/${s.id}`}
              aria-current={on ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-gutter-xs px-gutter-xs rounded-md transition-colors duration-150 ${
                on ? 'bg-primary text-on-primary border border-kintsugi-gold shadow-[0_0_14px_-2px_rgba(200,55,45,.7)]' : 'bg-washi/5 text-washi/90 border border-kintsugi-gold/30 hover:border-kintsugi-gold/70 hover:bg-washi/10'
              }`}
            >
              <span className={`font-jp text-body-sm leading-none ${on ? 'text-gold-light' : 'text-kintsugi-gold/80'}`} aria-hidden="true">{s.jp}</span>
              <span className="font-label text-label-sm leading-tight mt-0.5">{s.nombre}</span>
            </Link>
          );
        })}
      </nav>
      <ProgresoOro />
    </header>
  );
}

/** Logo de TikTok (nota musical con el desfase cian/rosa de la marca). */
function LogoTikTok() {
  const d =
    'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z';
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[15px] h-[15px] overflow-visible">
      <path d={d} fill="#25F4EE" transform="translate(-1 -1)" />
      <path d={d} fill="#FE2C55" transform="translate(1 1)" />
      <path d={d} fill="#141414" />
    </svg>
  );
}

export function MenuFooter({ menu }: { menu: Menu }) {
  const n = menu.negocio;
  const fb = enlaceSeguro(n.facebook);
  const ig = enlaceSeguro(n.instagram);
  const tt = enlaceSeguro(n.tiktok);
  return (
    <footer className="relative z-10 border-t border-kintsugi-gold/60 bg-ink-black text-washi px-page-margin pt-gutter-lg pb-[max(16px,env(safe-area-inset-bottom))] flex flex-col gap-gutter-md">
      <div aria-hidden="true" className="absolute inset-0 bg-seigaiha opacity-40 pointer-events-none" />
      <div className="relative flex items-center justify-between gap-gutter-md">
        <div className="flex flex-col gap-gutter-xs min-w-0">
          <LetrasCaen texto={n.nombre} className="font-display text-headline-md text-primary uppercase [paint-order:stroke_fill] [-webkit-text-stroke:2px_#F2EEE6]" />
          {n.horario && (
            <p className="font-body text-body-sm text-washi/80 flex items-center gap-1">
              <span className="material-symbols-outlined text-body-md text-kintsugi-gold" aria-hidden="true">schedule</span>
              {n.horario}
            </p>
          )}
          {n.direccion && (
            <p className="font-body text-body-sm text-washi/80 flex items-center gap-1">
              <span className="material-symbols-outlined text-body-md text-kintsugi-gold" aria-hidden="true">location_on</span>
              {n.direccion}
            </p>
          )}
        </div>
        {n.mascota && (
          <Image src={n.mascota} alt="" width={48} height={48} className="w-12 h-12 rounded-full object-cover object-top border-2 border-kintsugi-gold shrink-0" />
        )}
      </div>
      <div className="relative grid grid-cols-2 gap-gutter-sm">
        {n.whatsapp && (
          <a href={waLink(n.whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 py-gutter-sm px-gutter-sm rounded-full bg-success text-on-success font-label text-label-sm">
            <span className="material-symbols-outlined text-body-md" aria-hidden="true">chat</span>WhatsApp
          </a>
        )}
        {fb && (
          <a href={fb} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 py-gutter-sm px-gutter-sm rounded-full bg-secondary text-on-secondary font-label text-label-sm">
            <span className="material-symbols-outlined text-body-md" aria-hidden="true">thumb_up</span>Facebook
          </a>
        )}
        {ig && (
          <a href={ig} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 py-gutter-sm px-gutter-sm rounded-full bg-primary text-on-primary font-label text-label-sm">
            <span className="material-symbols-outlined text-body-md" aria-hidden="true">photo_camera</span>Instagram
          </a>
        )}
        {tt && (
          <a href={tt} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 py-gutter-sm px-gutter-sm rounded-full bg-washi text-ink-black font-label text-label-sm">
            <LogoTikTok />TikTok
          </a>
        )}
      </div>
      <GrietaDorada variante={2} className="relative opacity-80" />
    </footer>
  );
}

/** Fondo de la sección: imagen subida por el dueño o el sumi-e predeterminado. */
/**
 * Fondo de la sección. Se queda fijo al tamaño de la pantalla (sticky) mientras
 * las tarjetas pasan encima: así las ilustraciones de las orillas (bambú, cerezos,
 * dragón) siempre se ven, aunque la sección sea muy larga.
 */
export function FondoSeccion({ src }: { src: string | null }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <FondoParallax>
          {src ? <Image src={src} alt="" fill priority fetchPriority="high" sizes="(max-width: 448px) 100vw, 448px" quality={75} className="object-cover" /> : <div className="absolute inset-0 bg-sumi" />}
        </FondoParallax>
      </div>
    </div>
  );
}
