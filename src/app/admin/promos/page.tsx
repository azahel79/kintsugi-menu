import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { Interruptor } from '@/components/admin/Form';
import { AdminShell, Cargando } from '@/components/admin/Shell';
import { cambiarPromo } from '@/lib/actions';
import { adminPromos } from '@/lib/admin-data';

export const metadata: Metadata = { title: 'Promociones', robots: { index: false } };

export default function PromosPage() {
  return (
    <AdminShell
      subtitulo="Promociones"
      nav="promos"
      derecha={
        <Link href="/admin/promos/nueva" className="inline-flex items-center gap-1 px-gutter-md py-gutter-xs rounded-full bg-primary text-on-primary border border-kintsugi-gold font-label text-label-sm shrink-0">
          <span className="material-symbols-outlined text-body-md" aria-hidden="true">add</span>Nueva promo
        </Link>
      }
    >
      <Suspense fallback={<Cargando filas={3} />}>
        <Lista />
      </Suspense>
    </AdminShell>
  );
}

async function Lista() {
  const { promos, productos } = await adminPromos();
  if (!promos.length) {
    return (
      <div className="rounded-xl tarjeta-washi border border-kintsugi-gold/70 p-gutter-xl text-center flex flex-col items-center gap-gutter-sm">
        <span className="material-symbols-outlined text-display-lg text-kintsugi-gold" aria-hidden="true">local_offer</span>
        <p className="font-body text-body-md text-smoke-gray">Aún no tienes promociones. Crea la primera con “Nueva promo”.</p>
      </div>
    );
  }
  const ordenadas = [...promos].sort((a, b) => Number(b.activa) - Number(a.activa));
  return ordenadas.map((pr) => {
    const nombres = pr.productos.map((id) => productos.find((p) => p.id === id)?.nombre).filter(Boolean);
    return (
      <section key={pr.id} className={`rounded-xl p-gutter-lg flex flex-col gap-gutter-md ${pr.activa ? 'tarjeta-washi border-2 border-kintsugi-gold' : 'bg-light-surface-container/85 backdrop-blur-sm border border-kintsugi-gold/50'}`}>
        <div className="flex items-start justify-between gap-gutter-md">
          <div className="flex flex-col gap-gutter-xs min-w-0">
            <span className={`inline-flex self-start items-center px-gutter-sm py-0.5 rounded-sm font-label text-label-sm ${pr.activa ? 'bg-success text-on-success' : 'bg-smoke-gray text-washi'}`}>
              {pr.activa ? 'Activa en menú' : 'Pausada'}
            </span>
            <h2 className="font-headline text-headline-md uppercase">{pr.titulo}</h2>
            {pr.subtitulo && <p className="font-body text-body-sm text-smoke-gray">{pr.subtitulo}</p>}
            {nombres.length > 0 && <p className="font-body text-body-sm">Aplica en: {nombres.join(', ')}</p>}
          </div>
          <div className="relative w-16 h-16 rounded-md overflow-hidden border border-kintsugi-gold shrink-0 bg-tinta flex items-center justify-center">
            {pr.img ? <Image src={pr.img} alt="" fill sizes="64px" className="object-cover" /> : <span className="material-symbols-outlined text-headline-lg text-kintsugi-gold" aria-hidden="true">local_offer</span>}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-gutter-sm pt-gutter-sm border-t border-kintsugi-gold/50">
          <div className="flex flex-col gap-gutter-xs">
            <span className="inline-flex items-center gap-gutter-sm font-label text-label-sm">
              <Interruptor valor={pr.activa} etiqueta={`Activar ${pr.titulo}`} alCambiar={cambiarPromo.bind(null, pr.id, 'activa')} />
              Activa
            </span>
            <span className="inline-flex items-center gap-gutter-sm font-label text-label-sm">
              <Interruptor valor={pr.portada} etiqueta={`Mostrar ${pr.titulo} en portada`} alCambiar={cambiarPromo.bind(null, pr.id, 'portada')} />
              Mostrar en portada
            </span>
          </div>
          <Link href={`/admin/promos/${pr.id}`} className="px-gutter-md py-gutter-xs rounded-full tarjeta-washi border border-kintsugi-gold font-label text-label-sm">
            Editar
          </Link>
        </div>
      </section>
    );
  });
}
