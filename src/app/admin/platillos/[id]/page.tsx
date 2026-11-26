import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AdminShell, Cargando } from '@/components/admin/Shell';
import { adminCatalogo, adminProducto } from '@/lib/admin-data';
import { FormPlatillo } from '../FormPlatillo';

export const metadata: Metadata = { title: 'Editar platillo', robots: { index: false } };

export default function EditarPlatilloPage({ params }: PageProps<'/admin/platillos/[id]'>) {
  return (
    <AdminShell volver={{ href: '/admin/platillos', titulo: 'Editar platillo' }}>
      <Suspense fallback={<Cargando filas={5} />}>
        <Contenido params={params} />
      </Suspense>
    </AdminShell>
  );
}

async function Contenido({ params }: Pick<PageProps<'/admin/platillos/[id]'>, 'params'>) {
  const { id } = await params;
  const [p, { categorias }] = await Promise.all([adminProducto(id), adminCatalogo()]);
  if (!p) notFound();
  return <FormPlatillo p={p} categorias={categorias} />;
}
