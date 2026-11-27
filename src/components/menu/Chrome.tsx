import Image from 'next/image';
import Link from 'next/link';
import { GrietaDorada } from '@/components/anim/Kintsugi';
import { LetrasCaen } from '@/components/anim/Letras';
import { FarolViento, FondoParallax, LogoCompacto, ProgresoOro } from '@/components/anim/Scroll';
import { enlaceSeguro, waLink, type Menu } from '@/lib/menu';
import { lineasHorario } from '@/lib/texto';
import { LogoFacebook, LogoInstagram, LogoTikTok, LogoWhatsApp } from './LogosRedes';

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
          <FarolViento sentido={-1}><Chochin kanji="鮨" /></FarolViento>
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
              <span className="font-label text-label-sm leading-tight mt-0.5 text-center text-balance">{s.nombre}</span>
            </Link>
          );
        })}
      </nav>
      <ProgresoOro />
    </header>
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
            <div className="font-body text-body-sm text-washi/80 flex items-start gap-1">
              <span className="material-symbols-outlined text-body-md text-kintsugi-gold mt-0.5" aria-hidden="true">schedule</span>
              <span className="flex flex-col">
                {lineasHorario(n.horario).map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </span>
            </div>
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
          <a href={waLink(n.whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 py-gutter-sm px-gutter-sm rounded-full bg-[#1DA851] text-white font-label text-label-sm">
            <LogoWhatsApp />WhatsApp
          </a>
        )}
        {fb && (
          <a href={fb} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 py-gutter-sm px-gutter-sm rounded-full bg-[#1877F2] text-white font-label text-label-sm">
            <LogoFacebook />Facebook
          </a>
        )}
        {ig && (
          <a href={ig} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 py-gutter-sm px-gutter-sm rounded-full bg-[linear-gradient(45deg,#FEDA75_0%,#FA7E1E_25%,#D62976_55%,#962FBF_80%,#4F5BD5_100%)] text-white font-label text-label-sm [text-shadow:0_1px_2px_rgba(0,0,0,.25)]">
            <LogoInstagram />Instagram
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
