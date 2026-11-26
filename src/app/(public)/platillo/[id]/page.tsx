import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { GrietaDorada, Hanko, TextoVertical } from '@/components/anim/Kintsugi';
import { LetrasCaen } from '@/components/anim/Letras';
import { HojaInferior } from '@/components/menu/HojaInferior';
import { FondoSeccion } from '@/components/menu/Chrome';
import { dinero, getMenu, promoDe } from '@/lib/menu';

export async function generateStaticParams() {
  const menu = await getMenu();
  return menu.productos.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<'/platillo/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const menu = await getMenu();
  const p = menu.productos.find((x) => x.id === id);
  return p ? { title: p.nombre, description: p.descripcion || p.sub } : { title: 'Platillo' };
}

function claseEtiqueta(t: string) {
  if (t === 'Especialidad') return 'bg-primary text-on-primary';
  if (t === 'Nuevo') return 'bg-tertiary text-on-tertiary';
  return 'bg-washi text-ink-black border border-ink-black/30';
}

export default function PlatilloPage({ params }: PageProps<'/platillo/[id]'>) {
  return (
    <Suspense fallback={<div className="min-h-dvh max-w-md mx-auto bg-sumi" aria-busy="true" />}>
      <Platillo params={params} />
    </Suspense>
  );
}

async function Platillo({ params }: Pick<PageProps<'/platillo/[id]'>, 'params'>) {
  const { id } = await params;
  const menu = await getMenu();
  const p = menu.productos.find((x) => x.id === id);
  if (!p) notFound();

  const cat = menu.categorias.find((c) => c.id === p.categoriaId);
  const seccion = menu.secciones.find((s) => s.id === cat?.seccionId) ?? menu.secciones[0];
  const especial = p.etiquetas.includes('Especialidad');
  const promo = promoDe(menu, p.id);
  const volver = `/menu/${seccion?.id ?? ''}#${cat?.id ?? ''}`;

  return (
    <div className="relative min-h-dvh max-w-md mx-auto bg-light-surface flex flex-col justify-end overflow-hidden">
      {/* Fondo de la sección detrás de la hoja */}
      <div className="absolute inset-0 pointer-events-none">
        <FondoSeccion src={seccion?.fondo ?? null} />
        <header className="absolute top-0 inset-x-0 z-10 px-page-margin pt-gutter-xl pb-gutter-md flex items-start justify-between">
          <div className="px-gutter-md py-gutter-xs rounded-sm bg-washi/95 border border-kintsugi-gold">
            <span className="font-display text-headline-lg text-primary uppercase">KINTSUGI</span>
          </div>
          <span className="bg-washi/80 rounded-sm px-1 py-2">
            <TextoVertical texto="いらっしゃい" className="font-brush text-ink-black text-headline-md" />
          </span>
        </header>
      </div>

      <HojaInferior className="relative z-20 mt-40 bg-washi/95 backdrop-blur-sm rounded-t-xl border-t-2 border-kintsugi-gold flex flex-col">
        <div className="flex items-center justify-between px-page-margin pt-gutter-md pb-gutter-sm">
          <span className="font-body text-body-sm text-smoke-gray tracking-widest uppercase font-semibold">
            {cat?.nombre}
            {especial && ' · Especialidad'}
          </span>
          <span className="w-10 h-1 rounded-full bg-kintsugi-gold" aria-hidden="true" />
          <Link href={volver} aria-label="Volver al menú" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-washi text-ink-black border border-kintsugi-gold hover:border-primary">
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">close</span>
          </Link>
        </div>

        <div className="px-page-margin">
          <div className="relative h-60 rounded-lg overflow-hidden border-2 border-kintsugi-gold bg-tinta">
            {p.img ? (
              <Image src={p.img} alt={p.nombre} fill sizes="(max-width: 448px) 92vw, 416px" className="object-cover" priority />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-28 h-28 rounded-full bg-washi/90 border-2 border-kintsugi-gold flex items-center justify-center text-primary font-brush text-[64px]" aria-hidden="true">
                  {cat?.kanji ?? '品'}
                </span>
              </div>
            )}
            {especial && (
              <Hanko delay={0.6} className="absolute bottom-gutter-md right-gutter-md w-11 h-11 rounded-sm bg-primary border border-kintsugi-gold text-on-primary font-brush text-body-md">
                特選
              </Hanko>
            )}
          </div>
        </div>

        <div className="px-page-margin pt-gutter-xl pb-[max(24px,env(safe-area-inset-bottom))] flex flex-col gap-gutter-lg">
          <div className="flex items-start justify-between gap-gutter-md">
            <div className="flex items-start gap-gutter-md min-w-0">
              {p.jp && (
                <span className="flex flex-col items-center px-1 py-1 rounded-sm bg-primary text-on-primary text-body-sm font-jp font-bold leading-[1.15] shrink-0" aria-hidden="true">
                  {Array.from(p.jp).map((c, i) => <span key={i}>{c}</span>)}
                </span>
              )}
              <div className="flex flex-col gap-gutter-xs min-w-0">
                <LetrasCaen as="h1" texto={p.nombre} cuando="carga" delay={0.35} className="font-headline text-headline-lg text-ink-black uppercase tracking-wider" />
                <div className="flex flex-wrap items-center gap-gutter-xs">
                  {!p.disponible && <span className="px-gutter-sm py-0.5 rounded-sm bg-smoke-gray text-washi font-label text-label-sm">Agotado hoy</span>}
                  {promo && <span className="px-gutter-sm py-0.5 rounded-sm bg-primary text-on-primary font-label text-label-sm">{promo.etiqueta || promo.titulo}</span>}
                  {p.etiquetas.map((t) => (
                    <span key={t} className={`px-gutter-sm py-0.5 rounded-sm font-label text-label-sm ${claseEtiqueta(t)}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <span className={`font-price text-display-lg-mobile tabular-nums shrink-0 ${!p.disponible ? 'text-smoke-gray line-through' : especial ? 'text-primary' : 'text-oro-viejo'}`}>
              {dinero(p.precio)}
            </span>
          </div>

          {(p.descripcion || p.sub || cat?.nota) && (
            <p className="font-body text-body-md text-smoke-gray text-pretty leading-relaxed">{p.descripcion || p.sub || cat?.nota}</p>
          )}

          <GrietaDorada variante={1} delay={0.4} />

          {p.opciones.length > 0 && (
            <div className="flex flex-col gap-gutter-sm">
              <span className="font-label text-label-lg text-ink-black">{p.opcionesTitulo || 'Opciones'}</span>
              <ul className="flex flex-wrap gap-gutter-sm">
                {p.opciones.map((o) => (
                  <li key={o} className="inline-flex items-center px-gutter-lg py-gutter-sm rounded-full bg-washi text-ink-black border border-kintsugi-gold/70 font-label text-label-sm">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cat?.armable && (
            <p className="rounded-md bg-light-surface-container-low border border-kintsugi-gold/60 p-gutter-md font-body text-body-sm text-ink-black">
              Elige {menu.sushi.incluidos} ingredientes: {menu.sushi.ingredientes.map((i) => i.nombre).join(', ')}. Extra: verduras{' '}
              {dinero(menu.sushi.extraVerdura)}, proteínas {dinero(menu.sushi.extraProteina)}.
            </p>
          )}

          {menu.negocio.avisoMesero && (
            <p className="flex items-center justify-center gap-gutter-sm font-label text-label-sm text-smoke-gray">
              <span className="font-brush text-title-md text-primary" aria-hidden="true">いただきます</span>
              · {menu.negocio.avisoMesero}
            </p>
          )}
        </div>
      </HojaInferior>
    </div>
  );
}
