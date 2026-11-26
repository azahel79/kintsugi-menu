'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Cortina noren (暖簾) que se abre cada vez que cambias de sección del menú.
 *
 * - Vive en el layout de /menu: Next 16 conserva "dormidas" las páginas visitadas,
 *   así que dentro de la página la cortina se restauraría ya abierta.
 * - La apertura es 100% CSS y arranca sola al aparecer (con un pequeño retraso):
 *   corre en el compositor del navegador, así que se ve fluida aunque JavaScript
 *   esté ocupado montando la sección nueva. JavaScript solo la retira al terminar.
 */
export function Noren() {
  const seccion = usePathname().split('/')[2] ?? '';
  const [abiertaPara, setAbiertaPara] = useState<string | null>(null);
  const visible = abiertaPara !== seccion;

  // Respaldo: si por algo no llega el evento de fin de animación, se retira igual.
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setAbiertaPara(seccion), 1200);
    return () => clearTimeout(t);
  }, [visible, seccion]);

  if (!visible) return null;

  return (
    <div key={seccion} aria-hidden="true" className="fixed inset-0 z-50 pointer-events-none flex max-w-md mx-auto overflow-hidden">
      {([-1, 1] as const).map((lado) => (
        <div
          key={lado}
          onAnimationEnd={lado === 1 ? () => setAbiertaPara(seccion) : undefined}
          className={`relative h-full w-1/2 bg-noren border-x border-black/20 origin-top will-change-transform ${lado === -1 ? 'animate-noren-izq' : 'animate-noren-der'}`}
        >
          {/* El nombre del negocio en japonés (金継ぎ), en horizontal y partido entre las dos telas */}
          <span
            className={`absolute top-[40vh] font-brush text-[56px] leading-none whitespace-nowrap text-washi/95 [text-shadow:0_3px_10px_rgba(0,0,0,.35)] ${lado === -1 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}`}
            style={{ clipPath: lado === -1 ? 'inset(-20% 50% -20% -10%)' : 'inset(-20% -10% -20% 50%)' }}
          >
            金継ぎ
          </span>
          <span className="absolute bottom-0 inset-x-0 h-3 bg-black/25" />
        </div>
      ))}
    </div>
  );
}
