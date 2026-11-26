import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative min-h-dvh max-w-md mx-auto bg-sumi flex flex-col items-center justify-center gap-gutter-lg px-page-margin text-center">
      <span className="font-brush text-[88px] leading-none text-primary" aria-hidden="true">迷子</span>
      <h1 className="font-headline text-headline-lg text-ink-black">Esta página se perdió</h1>
      <p className="font-body text-body-md text-smoke-gray">Puede que el platillo ya no esté en el menú.</p>
      <Link href="/menu" className="px-gutter-xl py-gutter-md rounded-full bg-primary text-on-primary border border-kintsugi-gold font-label text-label-lg">
        Ver el menú
      </Link>
    </main>
  );
}
