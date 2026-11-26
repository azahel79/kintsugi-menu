import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminShell, Cargando } from '@/components/admin/Shell';
import { adminPromos } from '@/lib/admin-data';
import { FormPromo } from '../FormPromo';

export const metadata: Metadata = { title: 'Nueva promoción', robots: { index: false } };

export default function NuevaPromoPage() {
  return (
    <AdminShell volver={{ href: '/admin/promos', titulo: 'Nueva promoción' }}>
      <Suspense fallback={<Cargando filas={5} />}>
        <Contenido />
      </Suspense>
    </AdminShell>
  );
}

async function Contenido() {
  const { productos } = await adminPromos();
  return <FormPromo pr={null} productos={productos} />;
}
