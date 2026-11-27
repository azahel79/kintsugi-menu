import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Acceso del dueño', robots: { index: false } };

/** Acceso del dueño con el mismo lenguaje que la portada: panda, pincel y laca negra. */
export default function LoginPage() {
  return (
    <main className="relative min-h-dvh max-w-md mx-auto bg-dark-surface flex flex-col justify-between px-page-margin py-gutter-xl overflow-hidden text-washi">
      <div aria-hidden="true" className="absolute inset-0">
        <Image src="/img/panda.jpg" alt="" fill priority sizes="448px" className="object-cover object-top" />
        <div className="absolute inset-0 bg-linear-to-b from-dark-surface/90 via-dark-surface/40 via-35% to-dark-surface/95" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-gutter-sm">
        <div className="relative">
          <h1 className="font-display text-[44px] leading-none tracking-wider uppercase text-primary [paint-order:stroke_fill] [-webkit-text-stroke:5px_#F2EEE6] [text-shadow:0_4px_0_#141414,0_10px_28px_rgba(0,0,0,.65)]">
            KINTSUGI
          </h1>
          <span className="absolute -right-12 -top-1 w-10 h-10 rounded-sm bg-primary text-on-primary border border-kintsugi-gold flex items-center justify-center font-brush text-body-md rotate-[-4deg] shadow-[0_4px_12px_rgba(0,0,0,.5)]" aria-hidden="true">
            金継
          </span>
        </div>
        <p lang="ja" className="-mt-1 font-brush text-[30px] leading-none tracking-[0.4em] pl-[0.4em] text-gold-light [text-shadow:0_2px_0_#141414,0_4px_14px_rgba(0,0,0,.7)]">
          金継ぎ
        </p>
        <p className="flex items-center gap-gutter-sm font-label text-label-sm tracking-[0.14em] uppercase whitespace-nowrap [text-shadow:0_1px_6px_rgba(0,0,0,.8)]">
          <span aria-hidden="true" className="h-px w-6 bg-linear-to-r from-transparent to-kintsugi-gold" />
          Panel del dueño
          <span aria-hidden="true" className="h-px w-6 bg-linear-to-l from-transparent to-kintsugi-gold" />
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-gutter-md">
        <LoginForm />
        <Link href="/" className="self-center inline-flex items-center gap-1 font-label text-label-sm text-washi/75 hover:text-washi">
          <span className="material-symbols-outlined text-body-md" aria-hidden="true">arrow_back</span>
          Volver al menú público
        </Link>
      </div>
    </main>
  );
}
