import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AdminShell, Cargando } from '@/components/admin/Shell';
import { adminPromos } from '@/lib/admin-data';
import { FormPromo } from '../FormPromo';

export const metadata: Metadata = { title: 'Editar promoción', robots: { index: false } };

export default function EditarPromoPage({ params }: PageProps<'/admin/promos/[id]'>) {
  return (
    <AdminShell volver={{ href: '/admin/promos', titulo: 'Editar promoción' }}>
      <Suspense fallback={<Cargando filas={5} />}>
        <Contenido params={params} />
      </Suspense>
    </AdminShell>
  );
}

async function Contenido({ params }: Pick<PageProps<'/admin/promos/[id]'>, 'params'>) {
  const { id } = await params;
  const { promos, productos } = await adminPromos();
  const pr = promos.find((p) => p.id === id);
  if (!pr) notFound();
  return <FormPromo pr={pr} productos={productos} />;
}
