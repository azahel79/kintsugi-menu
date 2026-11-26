import { BotonConfirmar, BotonGuardar, FormAccion } from '@/components/admin/Form';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { estilos } from '@/components/admin/Shell';
import { eliminarPromo, guardarPromo } from '@/lib/actions';
import type { Promocion } from '@/db/schema';

export function FormPromo({
  pr,
  productos,
}: {
  pr: (Promocion & { productos: string[] }) | null;
  productos: { id: string; nombre: string }[];
}) {
  return (
    <>
      <FormAccion action={guardarPromo} className="flex flex-col gap-gutter-md rounded-xl tarjeta-washi border border-kintsugi-gold/70 p-gutter-md">
        {pr && <input type="hidden" name="id" value={pr.id} />}
        <ImagePicker name="img" valorInicial={pr?.img ?? null} kanji="祭" etiqueta="Imagen o cartel de la promo" maxLado={1200} />
        <div className="flex flex-col gap-gutter-xs">
          <label htmlFor="titulo" className={estilos.label}>Título</label>
          <input id="titulo" name="titulo" required maxLength={60} defaultValue={pr?.titulo} placeholder="2X$150 EN SUSHI" className={`${estilos.input} uppercase`} />
        </div>
        <div className="flex flex-col gap-gutter-xs">
          <label htmlFor="subtitulo" className={estilos.label}>Cuándo y dónde aplica</label>
          <input id="subtitulo" name="subtitulo" maxLength={120} defaultValue={pr?.subtitulo} placeholder="Aplica en Futomaki y Uramaki · Todo octubre" className={estilos.input} />
        </div>
        <div className="flex flex-col gap-gutter-xs">
          <label htmlFor="texto" className={estilos.label}>Texto de la promoción</label>
          <textarea id="texto" name="texto" rows={2} maxLength={300} defaultValue={pr?.texto} className={estilos.input} />
        </div>
        <div className="flex flex-col gap-gutter-xs">
          <label htmlFor="etiqueta" className={estilos.label}>Etiqueta roja (sello)</label>
          <input id="etiqueta" name="etiqueta" maxLength={30} defaultValue={pr?.etiqueta} placeholder="PROMO 2x$150" className={estilos.input} />
        </div>
        <fieldset className="flex flex-col gap-gutter-xs">
          <legend className={`${estilos.label} mb-gutter-xs`}>Platillos a los que aplica</legend>
          <div className="grid grid-cols-2 gap-gutter-xs max-h-56 overflow-y-auto pr-1 rounded-md">
            {productos.map((p) => (
              <label key={p.id} className="flex items-center gap-gutter-xs p-gutter-xs rounded-md bg-washi border border-kintsugi-gold/50 font-body text-body-sm">
                <input type="checkbox" name="productos" value={p.id} defaultChecked={pr?.productos.includes(p.id)} className={estilos.check} />
                <span className="truncate">{p.nombre}</span>
              </label>
            ))}
          </div>
          <p className="font-body text-body-sm text-smoke-gray">La promo aparece en la sección de esos platillos y su sello sale en el detalle.</p>
        </fieldset>
        <div className="flex flex-wrap gap-gutter-lg">
          <label className="inline-flex items-center gap-gutter-xs font-label text-label-sm">
            <input type="checkbox" name="activa" defaultChecked={pr?.activa ?? true} className={estilos.check} />
            Activa
          </label>
          <label className="inline-flex items-center gap-gutter-xs font-label text-label-sm">
            <input type="checkbox" name="portada" defaultChecked={pr?.portada ?? true} className={estilos.check} />
            Mostrar en portada
          </label>
        </div>
        <BotonGuardar>Guardar promoción</BotonGuardar>
      </FormAccion>
      {pr && (
        <BotonConfirmar accion={eliminarPromo.bind(null, pr.id)} pregunta={`¿Eliminar la promoción "${pr.titulo}"?`}>
          Eliminar promoción
        </BotonConfirmar>
      )}
    </>
  );
}
