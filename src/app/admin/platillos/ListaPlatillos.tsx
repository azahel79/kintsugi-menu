'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { Interruptor } from '@/components/admin/Form';
import { cambiarDisponible, moverProducto } from '@/lib/actions';

type Item = {
  id: string;
  nombre: string;
  precio: number;
  img: string | null;
  disponible: boolean;
  categoriaId: string;
  especial: boolean;
  busqueda: string;
};

const normal = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function ListaPlatillos({
  categorias,
  productos,
  filtroInicial,
  soloAgotados,
}: {
  categorias: { id: string; nombre: string; kanji: string }[];
  productos: Item[];
  filtroInicial: string;
  soloAgotados: boolean;
}) {
  const [filtro, setFiltro] = useState(categorias.some((c) => c.id === filtroInicial) ? filtroInicial : 'all');
  const [q, setQ] = useState('');
  const [agotados, setAgotados] = useState(soloAgotados);
  const [moviendo, start] = useTransition();

  const orden = categorias.map((c) => c.id);
  const visibles = useMemo(() => {
    const nq = normal(q.trim());
    return productos
      .filter((p) => (filtro === 'all' || p.categoriaId === filtro) && (!agotados || !p.disponible) && (!nq || normal(p.busqueda).includes(nq)))
      .sort((a, b) => orden.indexOf(a.categoriaId) - orden.indexOf(b.categoriaId));
  }, [productos, filtro, q, agotados, orden]);

  const chip = (on: boolean) =>
    `shrink-0 px-gutter-md py-gutter-xs rounded-full font-label text-label-sm border transition-colors ${on ? 'bg-primary text-on-primary border-primary' : 'bg-washi text-ink-black border-kintsugi-gold/60'}`;
  const puedeOrdenar = filtro !== 'all' && !q && !agotados;

  return (
    <>
      <div className="-mx-page-margin -mt-gutter-lg sticky top-[70px] z-20 bg-light-surface-container/85 backdrop-blur-sm backdrop-blur-sm px-page-margin py-gutter-md border-b border-kintsugi-gold/50 flex flex-col gap-gutter-sm">
        <label className="flex items-center gap-gutter-sm px-gutter-md py-gutter-xs rounded-full bg-washi border border-kintsugi-gold/70 focus-within:border-primary">
          <span className="material-symbols-outlined text-primary text-title-md" aria-hidden="true">search</span>
          <span className="sr-only">Buscar platillo</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar platillo..." className="w-full bg-transparent border-none placeholder:text-smoke-gray/70 font-body text-body-md focus:ring-0 p-1" />
        </label>
        <div className="flex items-center gap-gutter-xs overflow-x-auto no-scrollbar" role="group" aria-label="Filtrar por categoría">
          <button type="button" aria-pressed={filtro === 'all'} className={chip(filtro === 'all')} onClick={() => setFiltro('all')}>Todo</button>
          {categorias.map((c) => (
            <button key={c.id} type="button" aria-pressed={filtro === c.id} className={chip(filtro === c.id)} onClick={() => setFiltro(c.id)}>
              {c.nombre}
            </button>
          ))}
          <button type="button" aria-pressed={agotados} className={chip(agotados)} onClick={() => setAgotados(!agotados)}>Agotados</button>
        </div>
      </div>

      {puedeOrdenar && <p className="font-body text-body-sm text-smoke-gray">Usa las flechas para cambiar el orden en el menú.</p>}

      <ul className={`flex flex-col gap-gutter-sm ${moviendo ? 'opacity-70' : ''}`}>
        {visibles.map((p, i) => {
          const cat = categorias.find((c) => c.id === p.categoriaId);
          return (
            <li key={p.id} className={`rounded-md border p-gutter-md flex items-center justify-between gap-gutter-sm ${p.disponible ? 'tarjeta-washi border-kintsugi-gold/80' : 'bg-light-surface-container/85 backdrop-blur-sm border-kintsugi-gold/50'}`}>
              <div className="flex items-center gap-gutter-md min-w-0">
                <div className="relative w-12 h-12 rounded-sm overflow-hidden border border-kintsugi-gold shrink-0 bg-tinta flex items-center justify-center">
                  {p.img ? <Image src={p.img} alt="" fill sizes="48px" className="object-cover" /> : <span className="font-brush text-title-md text-primary" aria-hidden="true">{cat?.kanji ?? '品'}</span>}
                </div>
                <div className="flex flex-col min-w-0 gap-0.5">
                  <span className="font-headline text-title-md uppercase truncate">{p.nombre}</span>
                  <div className="flex items-center gap-gutter-sm flex-wrap">
                    <span className={`font-price text-price-md tabular-nums ${p.especial ? 'text-primary' : 'text-oro-viejo'}`}>${p.precio}</span>
                    <Interruptor valor={p.disponible} etiqueta={`${p.nombre} disponible`} textos={['Disponible', 'Agotado']} alCambiar={(v) => cambiarDisponible(p.id, v)} />
                  </div>
                  {filtro === 'all' && <span className="font-body text-body-sm text-smoke-gray">{cat?.nombre}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {puedeOrdenar && (
                  <div className="flex flex-col">
                    <button type="button" disabled={i === 0 || moviendo} onClick={() => start(() => moverProducto(p.id, -1))} aria-label={`Subir ${p.nombre}`} className="w-7 h-6 flex items-center justify-center text-smoke-gray disabled:opacity-30">
                      <span className="material-symbols-outlined text-title-md" aria-hidden="true">arrow_upward</span>
                    </button>
                    <button type="button" disabled={i === visibles.length - 1 || moviendo} onClick={() => start(() => moverProducto(p.id, 1))} aria-label={`Bajar ${p.nombre}`} className="w-7 h-6 flex items-center justify-center text-smoke-gray disabled:opacity-30">
                      <span className="material-symbols-outlined text-title-md" aria-hidden="true">arrow_downward</span>
                    </button>
                  </div>
                )}
                <Link href={`/admin/platillos/${p.id}`} className="px-gutter-md py-gutter-xs rounded-full bg-washi border border-kintsugi-gold font-label text-label-sm">Editar</Link>
              </div>
            </li>
          );
        })}
      </ul>

      {!visibles.length && (
        <div className="rounded-md tarjeta-washi border border-kintsugi-gold/70 p-gutter-xl text-center flex flex-col items-center gap-gutter-sm">
          <span className="material-symbols-outlined text-display-lg text-kintsugi-gold" aria-hidden="true">search_off</span>
          <p className="font-body text-body-md text-smoke-gray">No hay platillos que coincidan.</p>
          <Link href={`/admin/platillos/nuevo${filtro !== 'all' ? `?cat=${filtro}` : ''}`} className="px-gutter-md py-gutter-xs rounded-full bg-primary text-on-primary font-label text-label-sm">+ Agregar platillo</Link>
        </div>
      )}
    </>
  );
}
