'use client';

import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * - LazyMotion + domAnimation: solo se carga la parte de Motion que usamos
 *   (animaciones, variantes, salida, gestos y "al entrar en pantalla"), no la librería completa.
 *   `strict` avisa si algún componente usa `motion.*` en lugar de `m.*`.
 * - Respeta "reducir movimiento" del sistema.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
