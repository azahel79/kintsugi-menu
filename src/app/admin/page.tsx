import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { AdminShell, Cargando } from '@/components/admin/Shell';
import { adminCatalogo, adminPromos, adminSushi } from '@/lib/admin-data';

export const metadata: Metadata = { title: 'Panel', robots: { index: false } };

export default function PanelPage() {
  return (
    <AdminShell
      subtitulo="Panel de Administración"
      nav="panel"
      derecha={
        <Link href="/menu" target="_blank" className="inline-flex items-center gap-1 px-gutter-md py-gutter-xs rounded-full bg-washi/5 border border-kintsugi-gold/60 text-washi hover:bg-washi/10 font-label text-label-sm shrink-0">
          <span className="material-symbols-outlined text-body-md" aria-hidden="true">visibility</span>Ver menú
        </Link>
      }
    >
      <Suspense fallback={<Cargando />}>
        <Resumen />
      </Suspense>
    </AdminShell>
  );
}

function Acceso({ href, color, icono, titulo, texto }: { href: string; color: string; icono: string; titulo: string; texto: string }) {
  return (
    <Link href={href} className="flex items-center justify-between gap-gutter-md p-gutter-md rounded-md tarjeta-washi border border-kintsugi-gold hover:border-primary transition-colors">
      <div className="flex items-center gap-gutter-md">
        <div className={`w-11 h-11 rounded-md ${color} flex items-center justify-center shrink-0`}>
          <span className="material-symbols-outlined text-headline-md" aria-hidden="true">{icono}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-headline text-title-md">{titulo}</span>
          <span className="font-body text-body-sm text-smoke-gray">{texto}</span>
        </div>
      </div>
      <span className="material-symbols-outlined text-smoke-gray" aria-hidden="true">chevron_right</span>
    </Link>
  );
}

async function Resumen() {
  const [{ productos }, { promos }, sushi] = await Promise.all([adminCatalogo(), adminPromos(), adminSushi()]);
  const activos = productos.filter((p) => p.disponible).length;
  const agotados = productos.length - activos;
  const vigentes = promos.filter((p) => p.activa).length;
  const ings = sushi.ingredientes.filter((i) => i.activo).length;

  return (
    <>
      <section className="relative rounded-xl bg-ink-black/85 backdrop-blur-md ring-1 ring-kintsugi-gold/60 shadow-[0_12px_40px_-12px_rgba(0,0,0,.8)] p-gutter-lg flex items-center justify-between gap-gutter-md text-washi">
        <span aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-gold-light to-transparent" />
        <div className="flex flex-col gap-gutter-xs">
          <span className="inline-flex self-start items-center gap-1 px-gutter-sm py-0.5 rounded-sm bg-success text-on-success font-label text-label-sm">
            <span className="material-symbols-outlined text-body-sm" aria-hidden="true">check_circle</span>Menú en línea
          </span>
          <h1 className="font-headline text-headline-md text-washi">¡Hola! Todo listo hoy</h1>
          <p className="font-body text-body-sm text-washi/75">Tus cambios se reflejan al instante en el código QR.</p>
        </div>
        <Image src="/img/panda.jpg" alt="" width={64} height={64} className="w-16 h-16 rounded-full object-cover object-top border-2 border-kintsugi-gold shrink-0" />
      </section>

      <section aria-label="Resumen del menú" className="grid grid-cols-2 gap-gutter-md">
        <div className="rounded-md tarjeta-washi border border-kintsugi-gold/70 p-gutter-md flex flex-col gap-gutter-xs">
          <span className="font-label text-label-sm text-smoke-gray">Platillos activos</span>
          <span className="font-headline text-headline-lg tabular-nums">{activos}</span>
          {agotados > 0 && (
            <Link href="/admin/platillos?estado=agotados" className="font-body text-body-sm text-error underline underline-offset-2">
              {agotados} agotado{agotados > 1 ? 's' : ''}
            </Link>
          )}
        </div>
        <div className="rounded-md tarjeta-washi border border-kintsugi-gold/70 p-gutter-md flex flex-col gap-gutter-xs">
          <span className="font-label text-label-sm text-smoke-gray">Promos vigentes</span>
          <span className="font-headline text-headline-lg text-primary tabular-nums">{vigentes}</span>
        </div>
      </section>

      <section className="flex flex-col gap-gutter-md">
        <h2 className="self-start inline-flex items-center gap-gutter-sm px-gutter-md py-1 rounded-sm bg-ink-black text-washi shadow-md before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:rounded-[1px] before:bg-primary font-headline text-title-md uppercase">¿Qué quieres editar?</h2>
        <div className="grid grid-cols-1 gap-gutter-sm">
          <Acceso href="/admin/platillos" color="bg-primary text-on-primary" icono="ramen_dining" titulo="Platillos y precios" texto="Ramen, sushi, entradas, bebidas y postres" />
          <Acceso href="/admin/promos" color="bg-tertiary text-on-tertiary" icono="local_offer" titulo="Promociones y banners" texto="Activa o edita promos como 2x$150" />
          <Acceso href="/admin/sushi" color="bg-secondary text-on-secondary" icono="set_meal" titulo="Arma tu sushi" texto={`Rollos, ${ings} ingredientes y precios extra`} />
          <Acceso href="/admin/categorias" color="bg-washi text-ink-black border border-kintsugi-gold" icono="category" titulo="Secciones y categorías" texto="Nombres, notas y textos japoneses" />
          <Acceso href="/admin/ajustes" color="bg-ink-black text-washi" icono="palette" titulo="Fondos y datos del negocio" texto="Imágenes de fondo, horario y WhatsApp" />
        </div>
      </section>
    </>
  );
}
