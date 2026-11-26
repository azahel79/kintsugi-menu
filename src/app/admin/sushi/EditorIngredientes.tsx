'use client';

import { useState } from 'react';
import { ICONOS_INGREDIENTE } from '@/lib/icons';

type Ing = { id?: string; nombre: string; icono: string; tipo: 'verdura' | 'proteina'; activo: boolean };

/** Lista editable de ingredientes; se envía al servidor como JSON en un campo oculto. */
export function EditorIngredientes({ iniciales }: { iniciales: Ing[] }) {
  const [ings, setIngs] = useState<Ing[]>(iniciales);
  const [editando, setEditando] = useState<number | null>(null);

  const cambiar = (i: number, cambios: Partial<Ing>) => setIngs((xs) => xs.map((x, k) => (k === i ? { ...x, ...cambios } : x)));
  const mover = (i: number, d: -1 | 1) =>
    setIngs((xs) => {
      const j = i + d;
      if (j < 0 || j >= xs.length) return xs;
      const c = [...xs];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });

  return (
    <section className="flex flex-col gap-gutter-sm">
      <input type="hidden" name="ingredientes" value={JSON.stringify(ings)} />
      <div className="flex items-center justify-between">
        <h2 className="self-start inline-flex items-center gap-gutter-sm px-gutter-md py-1 rounded-sm bg-ink-black text-washi shadow-md before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:rounded-[1px] before:bg-primary font-headline text-title-md uppercase">Ingredientes ({ings.length})</h2>
        <button
          type="button"
          onClick={() => {
            setIngs((xs) => [...xs, { nombre: '', icono: 'restaurant', tipo: 'verdura', activo: true }]);
            setEditando(ings.length);
          }}
          className="px-gutter-md py-gutter-xs rounded-full bg-secondary text-on-secondary font-label text-label-sm"
        >
          + Agregar
        </button>
      </div>
      <p className="font-body text-body-sm text-smoke-gray">Apaga los que no haya hoy. Toca un ingrediente para editarlo.</p>

      <ul className="flex flex-col gap-gutter-xs">
        {ings.map((i, k) => (
          <li key={k} className={`rounded-md tarjeta-washi border border-kintsugi-gold/70 ${i.activo ? '' : 'opacity-60'}`}>
            <div className="flex items-center justify-between gap-gutter-sm p-gutter-sm">
              <button type="button" onClick={() => setEditando(editando === k ? null : k)} aria-expanded={editando === k} className="flex items-center gap-gutter-xs min-w-0 text-left">
                <span className="material-symbols-outlined text-title-md text-secondary" aria-hidden="true">{i.icono}</span>
                <span className="font-body text-body-md truncate">{i.nombre || 'Nuevo ingrediente'}</span>
                <span className={`font-label text-[11px] px-1.5 rounded-sm ${i.tipo === 'verdura' ? 'bg-success/15 text-success' : 'bg-primary/10 text-primary'}`}>
                  {i.tipo === 'verdura' ? 'Verdura' : 'Proteína'}
                </span>
              </button>
              <label className="inline-flex items-center gap-1 font-label text-label-sm shrink-0">
                <input type="checkbox" checked={i.activo} onChange={(e) => cambiar(k, { activo: e.target.checked })} className="w-4 h-4 rounded-sm text-primary border-kintsugi-gold focus:ring-primary" />
                Hay
              </label>
            </div>

            {editando === k && (
              <div className="border-t border-kintsugi-gold/40 p-gutter-sm flex flex-col gap-gutter-sm">
                <label className="flex flex-col gap-gutter-xs">
                  <span className="font-label text-label-sm">Nombre</span>
                  <input autoFocus value={i.nombre} maxLength={40} onChange={(e) => cambiar(k, { nombre: e.target.value })} className="rounded-md bg-washi border border-kintsugi-gold/70 px-gutter-md py-gutter-sm font-body text-body-md focus:border-primary focus:ring-1 focus:ring-primary" />
                </label>
                <fieldset className="flex flex-col gap-gutter-xs">
                  <legend className="font-label text-label-sm mb-gutter-xs">Si lo piden de extra, se cobra como</legend>
                  <div className="grid grid-cols-2 gap-gutter-xs">
                    {(['verdura', 'proteina'] as const).map((t) => (
                      <label key={t} className="flex items-center gap-gutter-xs p-gutter-sm rounded-md bg-washi border border-kintsugi-gold/60 font-label text-label-sm">
                        <input type="radio" name={`tipo-${k}`} checked={i.tipo === t} onChange={() => cambiar(k, { tipo: t })} className="text-primary border-kintsugi-gold focus:ring-primary" />
                        {t === 'verdura' ? 'Verdura' : 'Proteína'}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="font-label text-label-sm mb-gutter-xs">Ícono</legend>
                  <div className="flex flex-wrap gap-gutter-xs">
                    {ICONOS_INGREDIENTE.map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        aria-label={ic}
                        aria-pressed={i.icono === ic}
                        onClick={() => cambiar(k, { icono: ic })}
                        className={`w-10 h-10 rounded-md border flex items-center justify-center ${i.icono === ic ? 'bg-secondary text-on-secondary border-secondary' : 'bg-washi border-kintsugi-gold/60'}`}
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">{ic}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="flex flex-wrap items-center justify-between gap-gutter-xs">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => mover(k, -1)} disabled={k === 0} className="w-9 h-9 rounded-full bg-washi border border-kintsugi-gold/60 disabled:opacity-30" aria-label="Subir">
                      <span className="material-symbols-outlined text-title-md" aria-hidden="true">arrow_upward</span>
                    </button>
                    <button type="button" onClick={() => mover(k, 1)} disabled={k === ings.length - 1} className="w-9 h-9 rounded-full bg-washi border border-kintsugi-gold/60 disabled:opacity-30" aria-label="Bajar">
                      <span className="material-symbols-outlined text-title-md" aria-hidden="true">arrow_downward</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIngs((xs) => xs.filter((_, x) => x !== k));
                      setEditando(null);
                    }}
                    className="px-gutter-md py-gutter-xs rounded-full border border-error/40 text-error font-label text-label-sm"
                  >
                    Quitar ingrediente
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
