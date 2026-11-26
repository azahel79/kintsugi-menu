'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { useRef, type ReactNode } from 'react';

/** Hilo de oro bajo el encabezado que se "repara" conforme bajas por el menú. */
export function ProgresoOro() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  return (
    <motion.span
      aria-hidden="true"
      className="absolute left-0 right-0 -bottom-[2px] h-[3px] origin-left rounded-full bg-linear-to-r from-[#9c7a16] via-gold-light to-kintsugi-gold shadow-[0_0_8px_rgba(232,199,102,.7)]"
      style={{ scaleX }}
    />
  );
}

/** Fondo de sección con parallax: se mueve más lento que el contenido. */
export function FondoParallax({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  return (
    <motion.div aria-hidden="true" className="absolute inset-x-0 -top-[8%] h-[116%] pointer-events-none" style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

/** El logo del encabezado se compacta al bajar, dejando más espacio a la carta. */
export function LogoCompacto({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 140], [1, 0.84]);
  return (
    <motion.div className="origin-left" style={reduce ? undefined : { scale }}>
      {children}
    </motion.div>
  );
}

/** Los faroles se mecen más fuerte mientras más rápido haces scroll. */
export function FarolViento({ children, sentido = 1 }: { children: ReactNode; sentido?: 1 | -1 }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocidad = useVelocity(scrollY);
  const rotate = useSpring(useTransform(velocidad, [-2500, 0, 2500], [14 * sentido, 0, -14 * sentido], { clamp: true }), {
    stiffness: 120,
    damping: 6,
    mass: 0.6,
  });
  return (
    <motion.span className="inline-block origin-top" style={reduce ? undefined : { rotate }}>
      {children}
    </motion.span>
  );
}

/** El texto vertical de cada tarjeta flota un poco a contracorriente del scroll. */
export function FlotarVertical({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [28, -28]);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

/** Las fotos de los platillos se acercan (zoom suave) al pasar por el centro de la pantalla. */
export function ZoomScroll({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.12]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div className="w-full h-full" style={reduce ? undefined : { scale }}>
        {children}
      </motion.div>
    </div>
  );
}
