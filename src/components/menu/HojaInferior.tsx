'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/** Hoja de papel washi que sube desde abajo (detalle del platillo). */
export function HojaInferior({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.main
      className={className}
      initial={{ y: '40%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.main>
  );
}
