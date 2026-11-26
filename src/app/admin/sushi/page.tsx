import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { BotonGuardar, FormAccion } from '@/components/admin/Form';
import { AdminShell, Cargando, estilos } from '@/components/admin/Shell';
import { guardarSushi } from '@/lib/actions';
import { adminSushi } from '@/lib/admin-data';
import { EditorIngredientes } from './EditorIngredientes';

export const metadata: Metadata = { title: 'Arma tu sushi', robots: { index: false } };

export default function SushiPage() {
  return (
    <AdminShell volver={{ href: '/admin', titulo: 'Arma tu sushi' }}>
      <Suspense fallback={<Cargando filas={5} />}>
        <Contenido />
      </Suspense>
    </AdminShell>
  );
}

async function Contenido() {
  const { config, ingredientes, rollos, catSushi } = await adminSushi();
  const num = `${estilos.input} font-headline text-title-md tabular-nums`;

  return (
    <FormAccion action={guardarSushi} className="flex flex-col gap-gutter-xl">
      <section className="flex flex-col gap-gutter-sm">
        <h2 className="self-start inline-flex items-center gap-gutter-sm px-gutter-md py-1 rounded-sm bg-ink-black text-washi shadow-md before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:rounded-[1px] before:bg-primary font-headline text-title-md uppercase">Precios de rollos</h2>
        <div className={`${estilos.tarjeta} flex flex-col gap-gutter-sm`}>
          {rollos.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-gutter-md">
              <label htmlFor={`rollo-${r.id}`} className="font-headline text-title-md uppercase">{r.nombre}</label>
              <input id={`rollo-${r.id}`} name={`rollo:${r.id}`} type="number" inputMode="decimal" min={0} step="0.5" defaultValue={r.precio} className={`w-28 text-right ${num}`} />
            </div>
          ))}
          {!rollos.length && <p className="font-body text-body-sm text-smoke-gray">No hay rollos todavía.</p>}
          {catSushi && (
            <Link href={`/admin/platillos?cat=${catSushi.id}`} className="self-start font-label text-label-sm text-secondary underline underline-offset-2">
              Agregar o editar rollos (foto, nombre, descripción)
            </Link>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-gutter-sm">
        <h2 className="self-start inline-flex items-center gap-gutter-sm px-gutter-md py-1 rounded-sm bg-ink-black text-washi shadow-md before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:rounded-[1px] before:bg-primary font-headline text-title-md uppercase">Reglas y extras</h2>
        <div className="grid grid-cols-3 gap-gutter-sm">
          <div className="rounded-md tarjeta-washi border border-kintsugi-gold/80 p-gutter-sm flex flex-col gap-gutter-xs">
            <label htmlFor="incluidos" className="font-label text-label-sm text-smoke-gray">Incluidos</label>
            <input id="incluidos" name="incluidos" type="number" min={1} max={6} defaultValue={config.incluidos} className={num} />
          </div>
          <div className="rounded-md tarjeta-washi border border-kintsugi-gold/80 p-gutter-sm flex flex-col gap-gutter-xs">
            <label htmlFor="extraVerdura" className="font-label text-label-sm text-smoke-gray">Verdura extra $</label>
            <input id="extraVerdura" name="extraVerdura" type="number" min={0} step="0.5" defaultValue={config.extraVerdura} className={num} />
          </div>
          <div className="rounded-md tarjeta-washi border border-kintsugi-gold/80 p-gutter-sm flex flex-col gap-gutter-xs">
            <label htmlFor="extraProteina" className="font-label text-label-sm text-smoke-gray">Proteína extra $</label>
            <input id="extraProteina" name="extraProteina" type="number" min={0} step="0.5" defaultValue={config.extraProteina} className={num} />
          </div>
        </div>
      </section>

      <EditorIngredientes
        iniciales={ingredientes.map((i) => ({ id: i.id, nombre: i.nombre, icono: i.icono, tipo: i.tipo === 'proteina' ? 'proteina' : 'verdura', activo: i.activo }))}
      />

      <div className="sticky bottom-gutter-md z-20">
        <BotonGuardar>Guardar configuración</BotonGuardar>
      </div>
    </FormAccion>
  );
}
