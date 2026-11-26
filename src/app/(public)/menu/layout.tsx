import { Noren } from '@/components/anim/Noren';

/** Las secciones del menú comparten la cortina noren (persiste entre secciones). */
export default function MenuLayout({ children }: LayoutProps<'/menu'>) {
  return (
    <>
      {children}
      <Noren />
    </>
  );
}
