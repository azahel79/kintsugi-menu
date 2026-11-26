'use client';

import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';
import { subirImagen } from '@/lib/actions';

/** Reduce la foto en el navegador (máx. `maxLado` px, WebP) antes de subirla. */
async function reducir(file: File, maxLado: number): Promise<File> {
  const bmp = await createImageBitmap(file);
  const escala = Math.min(1, maxLado / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * escala);
  const h = Math.round(bmp.height * escala);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.82));
  if (!blob) throw new Error('No se pudo procesar la imagen');
  return new File([blob], 'foto.webp', { type: 'image/webp' });
}

export async function subirFoto(file: File, maxLado = 1400) {
  if (!file.type.startsWith('image/')) throw new Error('Elige una imagen (JPG, PNG o WebP).');
  const fd = new FormData();
  fd.append('archivo', await reducir(file, maxLado));
  const r = await subirImagen(fd);
  if (r.error || !r.url) throw new Error(r.error ?? 'No se pudo subir la imagen');
  return r.url;
}

/**
 * Campo de foto para formularios: sube al elegir y guarda la URL en un input oculto.
 * `kanji` se muestra como sello cuando aún no hay foto.
 */
export function ImagePicker({
  name,
  valorInicial,
  kanji = '品',
  etiqueta = 'Fotografía',
  maxLado = 1400,
  forma = 'rounded-md',
  tamano = 'w-20 h-20',
}: {
  name: string;
  valorInicial: string | null;
  kanji?: string;
  etiqueta?: string;
  maxLado?: number;
  forma?: string;
  tamano?: string;
}) {
  const [url, setUrl] = useState(valorInicial ?? '');
  const [error, setError] = useState('');
  const [subiendo, start] = useTransition();
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-lg tarjeta-washi border border-kintsugi-gold p-gutter-md flex items-center gap-gutter-md">
      <input type="hidden" name={name} value={url} />
      <div className={`relative ${tamano} ${forma} overflow-hidden border border-kintsugi-gold shrink-0 bg-tinta flex items-center justify-center`}>
        {url ? (
          <Image src={url} alt="" fill sizes="96px" className="object-cover" />
        ) : (
          <span className="font-brush text-headline-lg text-primary" aria-hidden="true">{kanji}</span>
        )}
        {subiendo && <span className="absolute inset-0 bg-ink-black/50 flex items-center justify-center"><span className="material-symbols-outlined text-washi animate-spin" aria-hidden="true">restart_alt</span></span>}
      </div>
      <div className="flex flex-col gap-gutter-xs min-w-0">
        <span className="font-label text-label-sm">{etiqueta}</span>
        <div className="flex flex-wrap gap-gutter-xs">
          <button
            type="button"
            disabled={subiendo}
            onClick={() => input.current?.click()}
            className="inline-flex items-center gap-1 px-gutter-md py-gutter-xs rounded-full bg-secondary text-on-secondary font-label text-label-sm disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-body-md" aria-hidden="true">photo_camera</span>
            {subiendo ? 'Subiendo…' : url ? 'Cambiar foto' : 'Subir foto'}
          </button>
          {url && !subiendo && (
            <button type="button" onClick={() => setUrl('')} className="px-gutter-md py-gutter-xs rounded-full bg-washi border border-kintsugi-gold/70 font-label text-label-sm text-smoke-gray">
              Quitar
            </button>
          )}
        </div>
        {error && <p role="alert" className="font-body text-body-sm text-error">{error}</p>}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (!f) return;
          setError('');
          start(async () => {
            try {
              setUrl(await subirFoto(f, maxLado));
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Error al subir');
            }
          });
        }}
      />
    </div>
  );
}
