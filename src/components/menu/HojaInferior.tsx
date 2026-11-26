import type { ReactNode } from 'react';

/** Hoja de papel washi que sube desde abajo (detalle del platillo). Animación CSS: no espera a JavaScript. */
export function HojaInferior({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <main className={`animate-hoja ${className}`}>{children}</main>;
}
