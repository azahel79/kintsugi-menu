'use client';

import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';
import { Aviso } from '@/components/admin/Form';
import { subirFoto } from '@/components/admin/ImagePicker';
import { guardarImagenNegocio } from '@/lib/actions';

type Fondo = { destino: string; nombre: string; url: string | null; predeterminado: 'sumi' | 'ninguno' };

/** Tarjetas para cambiar la portada, la mascota y el fondo de cada sección. */
export function Fondos({ fondos }: { fondos: Fondo[] }) {
  const [urls, setUrls] = useState(() => Object.fromEntries(fondos.map((f) => [f.destino, f.url])));
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState(0);
  const [, start] = useTransition();
  const input = useRef<HTMLInputElement>(null);
  const destino = useRef('');

  const aplicar = (d: string, url: string | null) =>
    start(async () => {
      setOcupado(d);
      setError('');
      try {
        await guardarImagenNegocio(d, url);
        setUrls((u) => ({ ...u, [d]: url }));
        setAviso((n) => n + 1);
      } catch {
        setError('No se pudo guardar la imagen.');
      } finally {
        setOcupado(null);
      }
    });

  return (
    <section className="flex flex-col gap-gutter-md">
      <h2 className="self-start inline-flex items-center gap-gutter-sm px-gutter-md py-1 rounded-sm bg-ink-black text-washi shadow-md before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:rounded-[1px] before:bg-primary font-headline text-title-md uppercase">Portada y fondos</h2>
      <div className="grid grid-cols-2 gap-gutter-sm">
        {fondos.map((f) => {
          const url = urls[f.destino];
          return (
            <div key={f.destino} className="rounded-md tarjeta-washi border border-kintsugi-gold p-gutter-sm flex flex-col gap-gutter-xs">
              <div className={`relative w-full h-24 rounded-sm overflow-hidden border border-kintsugi-gold/60 ${url ? '' : f.predeterminado === 'sumi' ? 'bg-sumi' : 'bg-tinta'}`}>
                {url && <Image src={url} alt={`Imagen de ${f.nombre}`} fill sizes="200px" className="object-cover" />}
                {ocupado === f.destino && (
                  <span className="absolute inset-0 bg-ink-black/50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-washi animate-spin" aria-hidden="true">restart_alt</span>
                  </span>
                )}
              </div>
              <span className="font-label text-label-sm">{f.nombre}</span>
              <div className="flex gap-gutter-xs">
                <button
                  type="button"
                  disabled={!!ocupado}
                  onClick={() => {
                    destino.current = f.destino;
                    input.current?.click();
                  }}
                  className="flex-1 h-8 rounded-full bg-secondary text-on-secondary font-label text-label-sm disabled:opacity-60"
                >
                  Cambiar
                </button>
                {url && (
                  <button
                    type="button"
                    disabled={!!ocupado}
                    onClick={() => aplicar(f.destino, null)}
                    aria-label={`Quitar imagen de ${f.nombre}`}
                    title="Usar el fondo predeterminado"
                    className="w-8 h-8 shrink-0 inline-flex items-center justify-center rounded-full bg-washi border border-kintsugi-gold/60 text-smoke-gray disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-body-md" aria-hidden="true">restart_alt</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {error && <p role="alert" className="font-body text-body-sm text-error">{error}</p>}
      {aviso > 0 && <Aviso key={aviso} texto="Imagen actualizada" />}
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;
          const d = destino.current;
          setOcupado(d);
          subirFoto(file, d === 'mascota' ? 600 : 1600)
            .then((url) => aplicar(d, url))
            .catch((err) => {
              setOcupado(null);
              setError(err instanceof Error ? err.message : 'Error al subir');
            });
        }}
      />
    </section>
  );
}
