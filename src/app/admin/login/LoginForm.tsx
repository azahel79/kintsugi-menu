'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/lib/actions';

function Entrar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex items-center justify-center gap-gutter-sm w-full py-gutter-md px-gutter-xl rounded-full bg-primary text-on-primary border border-kintsugi-gold font-label text-label-lg hover:bg-primary/90 active:scale-95 transition disabled:opacity-70">
      <span className="material-symbols-outlined text-title-md" aria-hidden="true">login</span>
      {pending ? 'Entrando…' : 'Entrar al panel'}
    </button>
  );
}

export function LoginForm() {
  const [estado, enviar] = useActionState(login, null);
  const [ver, setVer] = useState(false);
  const campo = 'flex items-center gap-gutter-sm px-gutter-md py-gutter-xs rounded-md bg-washi/10 border border-kintsugi-gold/50 focus-within:border-gold-light focus-within:ring-1 focus-within:ring-gold-light';

  return (
    <form action={enviar} className="relative rounded-xl bg-ink-black/60 backdrop-blur-md ring-1 ring-kintsugi-gold/60 shadow-[0_12px_40px_-12px_rgba(0,0,0,.8)] p-gutter-xl flex flex-col gap-gutter-lg text-washi">
      <span aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-gold-light to-transparent" />
      <div className="flex flex-col gap-gutter-xs">
        <h2 className="font-headline text-headline-md">Acceso al panel</h2>
        <p className="font-body text-body-sm text-washi/75">Edita platillos, precios, promociones y fondos sin depender de nadie.</p>
      </div>

      <div className="flex flex-col gap-gutter-md">
        <div className="flex flex-col gap-gutter-xs">
          <label htmlFor="email" className="font-label text-label-sm">Correo electrónico</label>
          <div className={campo}>
            <span className="material-symbols-outlined text-kintsugi-gold text-title-md" aria-hidden="true">mail</span>
            <input id="email" name="email" type="email" autoComplete="username" required className="w-full bg-transparent border-none text-washi placeholder:text-washi/40 font-body text-body-md focus:ring-0 p-1" />
          </div>
        </div>
        <div className="flex flex-col gap-gutter-xs">
          <label htmlFor="password" className="font-label text-label-sm">Contraseña</label>
          <div className={campo}>
            <span className="material-symbols-outlined text-kintsugi-gold text-title-md" aria-hidden="true">lock</span>
            <input id="password" name="password" type={ver ? 'text' : 'password'} autoComplete="current-password" required className="w-full bg-transparent border-none text-washi font-body text-body-md focus:ring-0 p-1" />
            <button type="button" onClick={() => setVer(!ver)} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="text-washi/60 hover:text-washi p-1">
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">{ver ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
        </div>
        {estado?.error && (
          <p role="alert" className="flex items-center gap-1 rounded-md bg-primary/20 border border-primary/50 px-gutter-sm py-gutter-xs font-body text-body-sm text-washi">
            <span className="material-symbols-outlined text-body-md" aria-hidden="true">error</span>
            {estado.error}
          </p>
        )}
      </div>
      <Entrar />
    </form>
  );
}
