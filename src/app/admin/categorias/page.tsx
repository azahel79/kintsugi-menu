import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BotonGuardar, FormAccion } from '@/components/admin/Form';
import { AdminShell, Cargando, estilos } from '@/components/admin/Shell';
import { crearCategoria, guardarCategorias } from '@/lib/actions';
import { adminCatalogo } from '@/lib/admin-data';
import { AccionesCategoria } from './AccionesCategoria';

export const metadata: Metadata = { title: 'Secciones y categorías', robots: { index: false } };

const tituloSeccion =
  "self-start inline-flex items-center gap-gutter-sm px-gutter-md py-1 rounded-sm bg-ink-black text-washi shadow-md before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:rounded-[1px] before:bg-primary font-headline text-title-md uppercase";

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
  const { secciones, categorias, productos } = await adminCatalogo();
  const cuenta = (id: string) => productos.filter((p) => p.categoriaId === id).length;

  return (
    <>
      <p className="tarjeta-washi rounded-md border border-kintsugi-gold/50 px-gutter-md py-gutter-sm font-body text-body-sm text-smoke-gray">
        Cada <b>pestaña</b> del menú se divide en <b>categorías</b> (una tarjeta cada una). Para pasar un platillo a otra categoría, edítalo en <b>Platillos</b>.
      </p>

      <FormAccion action={guardarCategorias} className="flex flex-col gap-gutter-xl">
        <section className="flex flex-col gap-gutter-sm">
          <h2 className={tituloSeccion}>Pestañas del menú</h2>
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

        {secciones.map((s) => {
          const cats = categorias.filter((c) => c.seccionId === s.id);
          return (
            <section key={s.id} className="flex flex-col gap-gutter-sm">
              <h2 className={tituloSeccion}>{s.nombre}</h2>
              {!cats.length && <p className="font-body text-body-sm text-smoke-gray tarjeta-washi rounded-md px-gutter-md py-gutter-sm">Sin categorías todavía.</p>}
              {cats.map((c, i) => {
                const n = cuenta(c.id);
                return (
                  <fieldset key={c.id} className={`${estilos.tarjeta} flex flex-col gap-gutter-sm`}>
                    <legend className="sr-only">{c.nombre}</legend>
                    <input type="hidden" name="id" value={c.id} />
                    <div className="flex items-center justify-between gap-gutter-sm">
                      <span className="font-label text-label-sm text-smoke-gray">
                        {n} platillo{n === 1 ? '' : 's'}
                        {c.armable && ' · guía "Arma tu sushi"'}
                      </span>
                      <AccionesCategoria id={c.id} nombre={c.nombre} platillos={n} primera={i === 0} ultima={i === cats.length - 1} />
                    </div>
                    <label className="flex flex-col gap-gutter-xs">
                      <span className={estilos.label}>Nombre de la categoría</span>
                      <input name="nombre" defaultValue={c.nombre} maxLength={40} className={`${estilos.input} font-headline uppercase`} />
                    </label>
                    <div className="flex flex-wrap gap-x-gutter-lg gap-y-gutter-xs">
                      <label className="inline-flex items-center gap-1 font-label text-label-sm">
                        <input type="checkbox" name={`titulo:${c.id}`} defaultChecked={c.mostrarTitulo} className={estilos.check} />
                        Mostrar título en el menú
                      </label>
                      <label className="inline-flex items-center gap-1 font-label text-label-sm">
                        <input type="checkbox" name={`visible:${c.id}`} defaultChecked={c.visible} className={estilos.check} />
                        Visible
                      </label>
                    </div>
                    <label className="flex flex-col gap-gutter-xs">
                      <span className={estilos.label}>Pestaña</span>
                      <select name={`seccion:${c.id}`} defaultValue={c.seccionId} className={estilos.input}>
                        {secciones.map((x) => (
                          <option key={x.id} value={x.id}>{x.nombre}</option>
                        ))}
                      </select>
                    </label>
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
                );
              })}
            </section>
          );
        })}

        <div className="sticky bottom-gutter-md z-20">
          <BotonGuardar>Guardar categorías</BotonGuardar>
        </div>
      </FormAccion>

      <section className="flex flex-col gap-gutter-sm">
        <h2 className={tituloSeccion}>Nueva categoría</h2>
        <FormAccion action={crearCategoria} className={`${estilos.tarjeta} flex flex-col gap-gutter-sm`}>
          <label className="flex flex-col gap-gutter-xs">
            <span className={estilos.label}>Nombre</span>
            <input name="nombre" maxLength={40} placeholder="Ej. Bebidas calientes" className={`${estilos.input} font-headline uppercase`} />
          </label>
          <label className="flex flex-col gap-gutter-xs">
            <span className={estilos.label}>¿En qué pestaña va?</span>
            <select name="seccionId" className={estilos.input} defaultValue={secciones[0]?.id}>
              {secciones.map((x) => (
                <option key={x.id} value={x.id}>{x.nombre}</option>
              ))}
            </select>
          </label>
          <BotonGuardar icono="add">Crear categoría</BotonGuardar>
        </FormAccion>
      </section>
    </>
  );
}
