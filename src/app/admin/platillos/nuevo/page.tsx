import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminShell, Cargando } from '@/components/admin/Shell';
import { adminCatalogo } from '@/lib/admin-data';
import { FormPlatillo } from '../FormPlatillo';

export const metadata: Metadata = { title: 'Nuevo platillo', robots: { index: false } };

export default function NuevoPlatilloPage({ searchParams }: PageProps<'/admin/platillos/nuevo'>) {
  return (
    <AdminShell volver={{ href: '/admin/platillos', titulo: 'Nuevo platillo' }}>
      <Suspense fallback={<Cargando filas={5} />}>
        <Contenido searchParams={searchParams} />
      </Suspense>
    </AdminShell>
  );
}

async function Contenido({ searchParams }: Pick<PageProps<'/admin/platillos/nuevo'>, 'searchParams'>) {
  const [{ categorias }, sp] = await Promise.all([adminCatalogo(), searchParams]);
  return <FormPlatillo p={null} categorias={categorias} catInicial={typeof sp.cat === 'string' ? sp.cat : undefined} />;
}
