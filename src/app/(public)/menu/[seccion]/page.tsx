import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CategoriaCard } from '@/components/menu/Categoria';
import { FondoSeccion, MenuFooter, MenuHeader } from '@/components/menu/Chrome';
import { PromoBanner } from '@/components/menu/PromoBanner';
import { getMenu, seccionDe } from '@/lib/menu';

export async function generateStaticParams() {
  const menu = await getMenu();
  return menu.secciones.map((s) => ({ seccion: s.id }));
}

export async function generateMetadata({ params }: PageProps<'/menu/[seccion]'>): Promise<Metadata> {
  const { seccion } = await params;
  const menu = await getMenu();
  const s = menu.secciones.find((x) => x.id === seccion);
  return { title: s?.nombre ?? 'Menú' };
}

export default function SeccionPage({ params }: PageProps<'/menu/[seccion]'>) {
  return (
    <Suspense fallback={<EsqueletoMenu />}>
      <Seccion params={params} />
    </Suspense>
  );
}

function EsqueletoMenu() {
  return (
    <div className="min-h-dvh max-w-md mx-auto bg-sumi px-page-margin pt-28 flex flex-col gap-gutter-lg" aria-busy="true">
      {[0, 1].map((i) => (
        <div key={i} className="h-72 rounded-xl border-2 border-ink-black/20 bg-washi/70 animate-pulse" />
      ))}
    </div>
  );
}

async function Seccion({ params }: Pick<PageProps<'/menu/[seccion]'>, 'params'>) {
  const { seccion } = await params;
  const menu = await getMenu();
  const s = menu.secciones.find((x) => x.id === seccion);
  if (!s) notFound();

  const categorias = menu.categorias.filter((c) => c.seccionId === s.id);
  const promos = menu.promos.filter((p) => p.portada && p.productos.some((id) => seccionDe(menu, id) === s.id));

  return (
    <div className="relative min-h-dvh max-w-md mx-auto bg-light-surface flex flex-col overflow-x-clip">
      <MenuHeader menu={menu} activa={s.id} />
      <main className="relative z-10 flex-1 px-page-margin py-gutter-lg flex flex-col gap-gutter-lg overflow-clip">
        <FondoSeccion src={s.fondo} />
        {promos.map((p) => (
          <PromoBanner
            key={p.id}
            promo={p}
            nombres={p.productos.map((id) => menu.productos.find((x) => x.id === id)?.nombre).filter((x): x is string => !!x)}
          />
        ))}
        {categorias.map((c, i) => (
          <CategoriaCard key={c.id} cat={c} menu={menu} indice={i} />
        ))}
        {!categorias.length && (
          <p className="relative z-10 rounded-lg bg-washi/90 p-gutter-lg text-center font-body text-body-md text-smoke-gray">
            Pronto agregaremos platillos en esta sección.
          </p>
        )}
      </main>
      <MenuFooter menu={menu} />
    </div>
  );
}
