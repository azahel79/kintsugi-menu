import { BotonConfirmar, BotonGuardar, FormAccion } from '@/components/admin/Form';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { estilos } from '@/components/admin/Shell';
import { eliminarProducto, guardarProducto } from '@/lib/actions';
import type { Categoria, Producto } from '@/db/schema';

const ETIQUETAS = ['Especialidad', 'Nuevo', 'Picante opcional', 'Picante', 'Vegetariano'];

export function FormPlatillo({ p, categorias, catInicial }: { p: Producto | null; categorias: Categoria[]; catInicial?: string }) {
  const cat = p?.categoriaId ?? (categorias.some((c) => c.id === catInicial) ? catInicial : categorias[0]?.id);
  const kanji = categorias.find((c) => c.id === cat)?.kanji ?? '品';
  return (
    <>
      <FormAccion action={guardarProducto} className="flex flex-col gap-gutter-md rounded-xl tarjeta-washi border border-kintsugi-gold/70 p-gutter-md">
        {p && <input type="hidden" name="id" value={p.id} />}
        <ImagePicker name="img" valorInicial={p?.img ?? null} kanji={kanji} etiqueta="Fotografía del platillo" />

        <div className="flex flex-col gap-gutter-xs">
          <label htmlFor="nombre" className={estilos.label}>Nombre en español</label>
          <input id="nombre" name="nombre" required maxLength={80} defaultValue={p?.nombre} className={`${estilos.input} font-headline text-title-md uppercase`} />
        </div>
        <div className="grid grid-cols-2 gap-gutter-md">
          <div className="flex flex-col gap-gutter-xs">
            <label htmlFor="jp" className={estilos.label}>Nombre japonés</label>
            <input id="jp" name="jp" maxLength={30} defaultValue={p?.jp} placeholder="Opcional" className={`${estilos.input} font-jp`} />
          </div>
          <div className="flex flex-col gap-gutter-xs">
            <label htmlFor="precio" className={estilos.label}>Precio (MXN $)</label>
            <input id="precio" name="precio" type="number" inputMode="decimal" min={0} step="0.5" required defaultValue={p?.precio} className={`${estilos.input} font-headline text-title-md text-primary tabular-nums`} />
          </div>
        </div>
        <div className="flex flex-col gap-gutter-xs">
          <label htmlFor="categoriaId" className={estilos.label}>Categoría</label>
          <select id="categoriaId" name="categoriaId" defaultValue={cat} className={estilos.input}>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-gutter-xs">
          <label htmlFor="sub" className={estilos.label}>Texto corto en el menú</label>
          <input id="sub" name="sub" maxLength={200} defaultValue={p?.sub} placeholder="Ej. (5 piezas) · Mango / Fresa" className={estilos.input} />
        </div>
        <div className="flex flex-col gap-gutter-xs">
          <label htmlFor="descripcion" className={estilos.label}>Descripción e ingredientes</label>
          <textarea id="descripcion" name="descripcion" rows={3} maxLength={800} defaultValue={p?.descripcion} className={estilos.input} />
        </div>

        <details className="group rounded-md tarjeta-washi border border-kintsugi-gold/70 p-gutter-md" open={!!p && (p.etiquetas.length > 0 || p.opciones.length > 0)}>
          <summary className="cursor-pointer list-none flex items-center justify-between font-label text-label-lg">
            Etiquetas y opciones
            <span className="material-symbols-outlined text-smoke-gray transition-transform group-open:rotate-180" aria-hidden="true">expand_more</span>
          </summary>
          <div className="flex flex-col gap-gutter-md pt-gutter-md">
            <fieldset className="flex flex-col gap-gutter-xs">
              <legend className={`${estilos.label} mb-gutter-xs`}>Etiquetas</legend>
              <div className="flex flex-wrap gap-gutter-xs">
                {ETIQUETAS.map((t) => (
                  <label key={t} className="inline-flex items-center gap-1 px-gutter-sm py-gutter-xs rounded-full bg-washi border border-kintsugi-gold/60 font-label text-label-sm">
                    <input type="checkbox" name="etiquetas" value={t} defaultChecked={p?.etiquetas.includes(t)} className={estilos.check} />
                    {t}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="opcionesTitulo" className={estilos.label}>Opciones para elegir (ej. Sabores)</label>
              <input id="opcionesTitulo" name="opcionesTitulo" maxLength={40} defaultValue={p?.opcionesTitulo ?? ''} placeholder="Sabores" className={estilos.input} />
            </div>
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="opciones" className={estilos.label}>Valores separados por coma</label>
              <input id="opciones" name="opciones" defaultValue={p?.opciones.join(', ')} placeholder="Mango, Durazno, Fresa" className={estilos.input} />
            </div>
          </div>
        </details>

        <label className="flex items-center justify-between p-gutter-md rounded-md tarjeta-washi border border-kintsugi-gold/70">
          <span className="flex flex-col">
            <span className="font-label text-label-lg">Disponible en el menú</span>
            <span className="font-body text-body-sm text-smoke-gray">Apágalo si se agotó hoy</span>
          </span>
          <input type="checkbox" name="disponible" defaultChecked={p?.disponible ?? true} className="w-5 h-5 rounded-sm text-primary border-kintsugi-gold focus:ring-primary" />
        </label>

        <BotonGuardar>{p ? 'Guardar cambios' : 'Agregar al menú'}</BotonGuardar>
      </FormAccion>

      {p && (
        <BotonConfirmar accion={eliminarProducto.bind(null, p.id)} pregunta={`¿Eliminar "${p.nombre}" del menú? No se puede deshacer.`}>
          Eliminar platillo
        </BotonConfirmar>
      )}
    </>
  );
}
