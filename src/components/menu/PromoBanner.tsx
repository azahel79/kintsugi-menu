import Image from 'next/image';
import { Hanko, Makimono } from '@/components/anim/Kintsugi';
import { LetrasCaen } from '@/components/anim/Letras';
import { ZoomScroll } from '@/components/anim/Scroll';
import type { MenuPromo } from '@/lib/menu';

/** Promoción vigente: cartel con brillo dorado que cruza cada pocos segundos. */
export function PromoBanner({ promo, nombres }: { promo: MenuPromo; nombres: string[] }) {
  return (
    <Makimono as="div" className="relative z-10 rounded-lg border-2 border-ink-black/70 bg-washi/75 backdrop-blur-[3px] overflow-hidden">
      <section aria-label="Promoción vigente" className="flex items-stretch">
        {promo.img && (
          <div className="relative w-28 shrink-0 border-r-2 border-kintsugi-gold">
            <ZoomScroll className="absolute inset-0">
              <div className="relative w-full h-full">
                <Image src={promo.img} alt={promo.titulo} fill sizes="112px" className="object-cover" />
              </div>
            </ZoomScroll>
          </div>
        )}
        <div className="relative flex-1 min-w-0 p-gutter-md flex flex-col gap-gutter-xs">
          <span aria-hidden="true" className="absolute inset-y-0 -left-1/3 w-1/3 bg-linear-to-r from-transparent via-gold-light/40 to-transparent animate-sheen pointer-events-none" />
          <Hanko className="self-start px-gutter-sm py-0.5 rounded-sm bg-primary text-on-primary font-label text-label-sm">
            {promo.etiqueta || 'PROMO DEL MES'}
          </Hanko>
          <LetrasCaen as="h2" texto={promo.titulo} delay={0.3} className="font-headline text-title-md text-ink-black uppercase" />
          {promo.subtitulo && <p className="font-body text-body-sm text-smoke-gray">{promo.subtitulo}</p>}
          {promo.texto && <p className="font-body text-body-sm text-ink-black text-pretty">{promo.texto}</p>}
          {!promo.subtitulo && nombres.length > 0 && (
            <p className="font-body text-body-sm text-smoke-gray">Aplica en {nombres.join(', ')}</p>
          )}
        </div>
      </section>
    </Makimono>
  );
}
