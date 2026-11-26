import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BotonGuardar, FormAccion } from '@/components/admin/Form';
import { AdminShell, Cargando, estilos } from '@/components/admin/Shell';
import { guardarCategorias } from '@/lib/actions';
import { adminCatalogo } from '@/lib/admin-data';

export const metadata: Metadata = { title: 'Secciones y categorías', robots: { index: false } };

export default function CategoriasPage() {
  return (
    <AdminShell volver={{ href: '/admin', titulo: 'Secciones y categorías' }}>
      <Suspense fallback={<Cargando filas={5} />}>
        <Contenido />
      </Suspense>
    </AdminShell>
  );
}

async function Contenido() {
  const { secciones, categorias } = await adminCatalogo();
  return (
    <FormAccion action={guardarCategorias} className="flex flex-col gap-gutter-xl">
      <section className="flex flex-col gap-gutter-sm">
        <h2 className="self-start inline-flex items-center gap-gutter-sm px-gutter-md py-1 rounded-sm bg-ink-black text-washi shadow-md before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:rounded-[1px] before:bg-primary font-headline text-title-md uppercase">Pestañas del menú</h2>
        <div className={`${estilos.tarjeta} flex flex-col gap-gutter-sm`}>
          {secciones.map((s) => (
            <div key={s.id} className="grid grid-cols-[1fr_7rem] gap-gutter-sm">
              <input type="hidden" name="seccionId" value={s.id} />
              <label className="flex flex-col gap-gutter-xs">
                <span className={estilos.label}>Nombre</span>
                <input name="seccionNombre" defaultValue={s.nombre} maxLength={30} className={estilos.input} />
              </label>
              <label className="flex flex-col gap-gutter-xs">
                <span className={estilos.label}>Japonés</span>
                <input name="seccionJp" defaultValue={s.jp} maxLength={12} className={`${estilos.input} font-jp`} />
              </label>
            </div>
          ))}
        </div>
      </section>

      {secciones.map((s) => (
        <section key={s.id} className="flex flex-col gap-gutter-sm">
          <h2 className="self-start inline-flex items-center gap-gutter-sm px-gutter-md py-1 rounded-sm bg-ink-black text-washi shadow-md before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:rounded-[1px] before:bg-primary font-headline text-title-md uppercase">{s.nombre}</h2>
          {categorias
            .filter((c) => c.seccionId === s.id)
            .map((c) => (
              <fieldset key={c.id} className={`${estilos.tarjeta} flex flex-col gap-gutter-sm`}>
                <legend className="sr-only">{c.nombre}</legend>
                <input type="hidden" name="id" value={c.id} />
                <div className="flex items-end gap-gutter-sm">
                  <label className="flex-1 flex flex-col gap-gutter-xs">
                    <span className={estilos.label}>Nombre de la categoría</span>
                    <input name="nombre" defaultValue={c.nombre} maxLength={40} className={`${estilos.input} font-headline uppercase`} />
                  </label>
                  <label className="inline-flex items-center gap-1 pb-gutter-sm font-label text-label-sm">
                    <input type="checkbox" name={`visible:${c.id}`} defaultChecked={c.visible} className={estilos.check} />
                    Visible
                  </label>
                </div>
                <label className="flex flex-col gap-gutter-xs">
                  <span className={estilos.label}>Nota (aparece bajo el título)</span>
                  <textarea name="nota" rows={2} defaultValue={c.nota} maxLength={240} className={estilos.input} />
                </label>
                <div className="grid grid-cols-[1fr_5rem] gap-gutter-sm">
                  <label className="flex flex-col gap-gutter-xs">
                    <span className={estilos.label}>Texto vertical decorativo</span>
                    <input name="vertical" defaultValue={c.vertical} maxLength={12} className={`${estilos.input} font-jp`} />
                  </label>
                  <label className="flex flex-col gap-gutter-xs">
                    <span className={estilos.label}>Sello</span>
                    <input name="kanji" defaultValue={c.kanji} maxLength={2} className={`${estilos.input} font-brush text-center text-headline-md`} />
                  </label>
                </div>
              </fieldset>
            ))}
        </section>
      ))}

      <div className="sticky bottom-gutter-md z-20">
        <BotonGuardar>Guardar categorías</BotonGuardar>
      </div>
    </FormAccion>
  );
}
