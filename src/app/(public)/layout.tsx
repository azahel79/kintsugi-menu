import { SakuraPetals } from '@/components/anim/SakuraPetals';

/** Menú público: solo lectura, con pétalos de sakura de fondo. */
export default function PublicLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      {children}
      <div aria-hidden="true" className="fixed inset-0 z-20 max-w-md mx-auto pointer-events-none">
        <SakuraPetals cantidad={16} className="w-full h-full" />
      </div>
    </>
  );
}
