import Image from 'next/image';
import Link from 'next/link';

type Props = {
  portada: string | null;
  lema: string;
  titulo: string;
  texto: string;
  horario: string;
  zona: string;
  primeraSeccion: string;
};

/** Vapor que sube del tazón del panda (encima de la ilustración). */
function Vapor() {
  return (
    <svg viewBox="0 0 120 160" aria-hidden="true" className="absolute left-[46%] top-[39%] w-[12%] pointer-events-none mix-blend-screen">
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={['M60 150 C40 120 80 100 60 70 C45 50 70 30 60 5', 'M40 150 C25 125 55 105 40 80 C30 60 50 45 42 20', 'M82 150 C98 125 70 108 84 82 C95 62 76 48 84 24'][i]}
          fill="none"
          stroke="#fff"
          strokeOpacity={0.55}
          strokeWidth={5}
          strokeLinecap="round"
          className="animate-steam origin-bottom"
          style={{ animationDelay: `${1.2 + i * 1.1}s`, filter: 'blur(1.5px)' }}
        />
      ))}
    </svg>
  );
}

/**
 * Portada. Todas las animaciones son CSS: empiezan desde el primer pintado,
 * sin esperar a que cargue JavaScript (así la portada aparece al instante).
 */
export function Portada({ portada, lema, titulo, texto, horario, zona, primeraSeccion }: Props) {
  return (
    <main className="relative min-h-dvh max-w-md mx-auto flex flex-col justify-between overflow-hidden bg-dark-surface text-washi">
      {/* Ilustración: se revela como una gota de tinta que se expande */}
      <div className="absolute inset-0 animate-tinta">
        {portada ? (
          // Contenedor con la proporción de la ilustración: el vapor queda alineado con el tazón.
          <div className="absolute left-1/2 top-0 h-full min-w-full -translate-x-1/2" style={{ aspectRatio: '1241 / 1268' }}>
            <Image src={portada} alt="Panda Kintsugi comiendo ramen en un tazón reparado con oro" fill priority fetchPriority="high" sizes="(max-width: 448px) 100vw, 448px" className="object-cover" quality={75} />
            <Vapor />
          </div>
        ) : (
          <div className="absolute inset-0 bg-sumi" />
        )}
      </div>

      {/* Velo de tinta: oscurece arriba y abajo para que el texto se lea sin cajas claras */}
      <div className="absolute inset-0 bg-linear-to-b from-dark-surface/95 via-dark-surface/0 via-30% to-dark-surface/95" />

      {/* Título de pincel directo sobre la ilustración + sello */}
      <div className="relative z-10 px-page-margin pt-gutter-xl flex flex-col items-center text-center gap-gutter-sm">
        <div className="relative">
          <h1 className="animate-pincel font-display text-[48px] leading-none tracking-wider uppercase text-primary [paint-order:stroke_fill] [-webkit-text-stroke:5px_#F2EEE6] [text-shadow:0_4px_0_#141414,0_10px_28px_rgba(0,0,0,.65)]">
            KINTSUGI
          </h1>
          <span className="animate-hanko absolute -right-12 -top-1 w-11 h-11 rounded-sm bg-primary text-on-primary border border-kintsugi-gold shadow-[0_4px_12px_rgba(0,0,0,.5)] inline-flex items-center justify-center">
            <span className="font-brush text-title-md leading-none">金継</span>
          </span>
        </div>
        <p className="animate-aparecer flex items-center gap-gutter-sm font-label text-label-sm text-washi tracking-[0.14em] uppercase whitespace-nowrap [text-shadow:0_1px_6px_rgba(0,0,0,.8)]">
          <span aria-hidden="true" className="h-px w-6 shrink-0 bg-linear-to-r from-transparent to-kintsugi-gold" />
          {lema}
          <span aria-hidden="true" className="h-px w-6 shrink-0 bg-linear-to-l from-transparent to-kintsugi-gold" />
        </p>
      </div>

      {/* Tarjeta de invitación */}
      <div className="animate-subir relative z-10 px-page-margin pb-[max(24px,env(safe-area-inset-bottom))] flex flex-col gap-gutter-md">
        {/* Laca negra translúcida (urushi) con filo dorado */}
        <div className="relative rounded-xl bg-ink-black/55 backdrop-blur-md ring-1 ring-kintsugi-gold/60 shadow-[0_12px_40px_-12px_rgba(0,0,0,.8)] p-gutter-lg flex flex-col items-center text-center gap-gutter-md text-washi">
          <span aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-gold-light to-transparent" />
          <div className="flex flex-col gap-gutter-xs">
            <h2 className="font-headline text-headline-md uppercase text-washi">{titulo}</h2>
            <p className="font-body text-body-md text-washi/80 text-pretty">{texto}</p>
          </div>
          <Link
            href={`/menu/${primeraSeccion}`}
            className="group relative overflow-hidden inline-flex items-center justify-center gap-gutter-sm w-full py-gutter-md px-gutter-xl rounded-full bg-primary text-on-primary border-2 border-kintsugi-gold active:scale-95 transition-transform duration-150"
          >
            <span aria-hidden="true" className="absolute inset-y-0 -left-1/3 w-1/3 bg-linear-to-r from-transparent via-white/35 to-transparent animate-sheen" />
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">restaurant_menu</span>
            <span className="font-label text-label-lg">Abrir menú digital</span>
          </Link>
          <p className="font-body text-body-sm text-kintsugi-gold">
            {horario} · {zona}
          </p>
        </div>
      </div>
    </main>
  );
}
