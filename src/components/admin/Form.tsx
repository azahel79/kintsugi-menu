'use client';

import { useActionState, useEffect, useOptimistic, useState, useTransition, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import type { Estado } from '@/lib/actions';
import { estilos } from './Shell';

/** Formulario con acción de servidor: muestra errores y un aviso al guardar. */
export function FormAccion({
  action,
  children,
  className = 'flex flex-col gap-gutter-md',
}: {
  action: (prev: Estado, fd: FormData) => Promise<Estado>;
  children: ReactNode;
  className?: string;
}) {
  const [estado, enviar] = useActionState(action, null);
  // Cada guardado exitoso es un objeto nuevo: lo usamos para volver a mostrar el aviso.
  const [avisos, setAvisos] = useState<{ n: number; de: Estado }>({ n: 0, de: null });
  if (estado?.ok && avisos.de !== estado) setAvisos({ n: avisos.n + 1, de: estado });
  return (
    <form action={enviar} className={className} noValidate>
      {children}
      {estado?.error && (
        <p role="alert" className="flex items-center gap-1 rounded-md bg-error/10 border border-error/30 px-gutter-md py-gutter-sm font-body text-body-sm text-error">
          <span className="material-symbols-outlined text-body-md" aria-hidden="true">error</span>
          {estado.error}
        </p>
      )}
      {estado?.ok && <Aviso key={avisos.n} texto={estado.mensaje ?? 'Guardado'} />}
    </form>
  );
}

export function BotonGuardar({ children = 'Guardar cambios', icono = 'save' }: { children?: ReactNode; icono?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={estilos.btnPrimario}>
      <span className={`material-symbols-outlined text-title-md ${pending ? 'animate-spin' : ''}`} aria-hidden="true">
        {pending ? 'restart_alt' : icono}
      </span>
      <span>{pending ? 'Guardando…' : children}</span>
    </button>
  );
}

/** Aviso flotante que desaparece solo. */
export function Aviso({ texto }: { texto: string }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div role="status" className="fixed left-1/2 bottom-24 z-50 -translate-x-1/2 inline-flex items-center gap-1 px-gutter-lg py-gutter-sm rounded-full bg-ink-black text-washi border border-kintsugi-gold font-label text-label-sm shadow-lg">
      <span className="material-symbols-outlined text-body-md text-kintsugi-gold" aria-hidden="true">check_circle</span>
      {texto}
    </div>
  );
}

/** Interruptor que llama a una acción del servidor al momento (con respuesta optimista). */
export function Interruptor({
  valor,
  alCambiar,
  etiqueta,
  textos,
}: {
  valor: boolean;
  alCambiar: (v: boolean) => Promise<void>;
  etiqueta: string;
  textos?: [string, string];
}) {
  // Muestra el cambio al instante; si el servidor falla, vuelve solo al valor real.
  const [actual, setOptimista] = useOptimistic(valor);
  const [pendiente, start] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={actual}
      aria-label={etiqueta}
      disabled={pendiente}
      onClick={() => {
        const v = !actual;
        start(async () => {
          setOptimista(v);
          await alCambiar(v);
        });
      }}
      className="inline-flex items-center gap-gutter-xs disabled:opacity-70"
    >
      <span className={`relative w-10 h-6 rounded-full transition-colors duration-150 ${actual ? 'bg-success' : 'bg-smoke-gray/40'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-150 ${actual ? 'translate-x-4' : ''}`} />
      </span>
      {textos && <span className={`font-body text-body-sm font-semibold ${actual ? 'text-success' : 'text-error'}`}>{actual ? textos[0] : textos[1]}</span>}
    </button>
  );
}

/** Botón que confirma antes de ejecutar una acción destructiva. */
export function BotonConfirmar({ accion, pregunta, children }: { accion: () => Promise<void>; pregunta: string; children: ReactNode }) {
  const [pendiente, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() => {
        if (confirm(pregunta)) start(() => accion());
      }}
      className="inline-flex items-center justify-center gap-1 py-gutter-sm px-gutter-lg rounded-full tarjeta-washi border border-error/40 text-error font-label text-label-sm disabled:opacity-60"
    >
      <span className="material-symbols-outlined text-body-md" aria-hidden="true">delete</span>
      {children}
    </button>
  );
}
