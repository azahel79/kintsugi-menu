import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { AdminShell, Cargando } from '@/components/admin/Shell';
import { adminCatalogo } from '@/lib/admin-data';
import { ListaPlatillos } from './ListaPlatillos';

export const metadata: Metadata = { title: 'Platillos y precios', robots: { index: false } };

export default function PlatillosPage({ searchParams }: PageProps<'/admin/platillos'>) {
  return (
    <AdminShell
      subtitulo="Platillos y precios"
      nav="platillos"
      derecha={
        <Link href="/admin/platillos/nuevo" className="inline-flex items-center gap-1 px-gutter-md py-gutter-xs rounded-full bg-primary text-on-primary border border-kintsugi-gold font-label text-label-sm shrink-0">
          <span className="material-symbols-outlined text-body-md" aria-hidden="true">add</span>Nuevo
        </Link>
      }
    >
      <Suspense fallback={<Cargando filas={6} />}>
        <Contenido searchParams={searchParams} />
      </Suspense>
    </AdminShell>
  );
}

async function Contenido({ searchParams }: Pick<PageProps<'/admin/platillos'>, 'searchParams'>) {
  const [{ categorias, productos }, sp] = await Promise.all([adminCatalogo(), searchParams]);
  const cat = typeof sp.cat === 'string' ? sp.cat : 'all';
  return (
    <ListaPlatillos
      categorias={categorias.map((c) => ({ id: c.id, nombre: c.nombre, kanji: c.kanji }))}
      productos={productos.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        img: p.img,
        disponible: p.disponible,
        categoriaId: p.categoriaId,
        especial: p.etiquetas.includes('Especialidad'),
        busqueda: `${p.nombre} ${p.sub} ${p.jp}`,
      }))}
      filtroInicial={cat}
      soloAgotados={sp.estado === 'agotados'}
    />
  );
}
