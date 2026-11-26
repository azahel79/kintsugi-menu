'use client';

import { useTransition } from 'react';
import { eliminarCategoria, moverCategoria } from '@/lib/actions';

/** Subir / bajar / eliminar una categoría (botones sueltos dentro del formulario grande). */
export function AccionesCategoria({
  id,
  nombre,
  platillos,
  primera,
  ultima,
}: {
  id: string;
  nombre: string;
  platillos: number;
  primera: boolean;
  ultima: boolean;
}) {
  const [pendiente, start] = useTransition();
  const btn = 'w-9 h-9 rounded-full bg-washi border border-kintsugi-gold/60 flex items-center justify-center disabled:opacity-30';

  return (
    <div className={`flex items-center gap-gutter-xs ${pendiente ? 'opacity-60' : ''}`}>
      <button type="button" disabled={primera || pendiente} onClick={() => start(() => moverCategoria(id, -1))} aria-label={`Subir ${nombre}`} className={btn}>
        <span className="material-symbols-outlined text-title-md" aria-hidden="true">arrow_upward</span>
      </button>
      <button type="button" disabled={ultima || pendiente} onClick={() => start(() => moverCategoria(id, 1))} aria-label={`Bajar ${nombre}`} className={btn}>
        <span className="material-symbols-outlined text-title-md" aria-hidden="true">arrow_downward</span>
      </button>
      <button
        type="button"
        disabled={pendiente}
        aria-label={`Eliminar ${nombre}`}
        title={platillos ? 'Primero mueve o elimina sus platillos' : 'Eliminar categoría'}
        onClick={() => {
          if (platillos) {
            alert(`"${nombre}" tiene ${platillos} platillo${platillos > 1 ? 's' : ''}. Muévelos a otra categoría (al editar cada platillo) o elimínalos primero.`);
            return;
          }
          if (!confirm(`¿Eliminar la categoría "${nombre}"?`)) return;
          start(async () => {
            const r = await eliminarCategoria(id);
            if (r.error) alert(r.error);
          });
        }}
        className={`${btn} text-error border-error/40`}
      >
        <span className="material-symbols-outlined text-title-md" aria-hidden="true">delete</span>
      </button>
    </div>
  );
}
