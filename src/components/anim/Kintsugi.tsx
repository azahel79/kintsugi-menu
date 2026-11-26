'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Children, type ReactNode } from 'react';

/* Grietas doradas: varias formas para que no todas las tarjetas se vean igual. */
const GRIETAS = [
  'M0 6 L38 5 L52 9 L74 3 L110 7 L131 4 L150 10 L188 5 L214 8 L240 4 L268 7 L300 5',
  'M0 5 L24 8 L60 4 L82 10 L96 6 L140 7 L162 3 L196 8 L230 5 L252 9 L300 6',
  'M0 7 L30 4 L44 8 L90 5 L118 10 L150 4 L176 7 L208 3 L244 8 L276 5 L300 7',
];

/** Línea dorada que se "repara" (se dibuja) al entrar en pantalla. */
export function GrietaDorada({ variante = 0, className = '', delay = 0 }: { variante?: number; className?: string; delay?: number }) {
  const d = GRIETAS[variante % GRIETAS.length];
  return (
    <svg viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true" className={`block w-full h-3 overflow-visible ${className}`}>
      <defs>
        <linearGradient id={`oro-${variante}`} x1="0" x2="1">
          <stop offset="0" stopColor="#9c7a16" />
          <stop offset=".45" stopColor="#E8C766" />
          <stop offset=".7" stopColor="#C9A227" />
          <stop offset="1" stopColor="#9c7a16" />
        </linearGradient>
      </defs>
      <motion.path
        d={d}
        fill="none"
        stroke={`url(#oro-${variante})`}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, delay, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}

const pergamino = {
  cerrado: { clipPath: 'inset(0% 0% 100% 0% round 24px)', y: 12 },
  abierto: { clipPath: 'inset(0% 0% 0% 0% round 24px)', y: 0 },
};

/**
 * Tarjeta que se desenrolla como pergamino (makimono) al aparecer.
 * La visibilidad se detecta en un contenedor sin recorte: Chrome mide el
 * clip-path del propio elemento y una tarjeta "enrollada" nunca contaría como visible.
 */
export function Makimono({ children, className = '', delay = 0, as = 'section', id }: { children: ReactNode; className?: string; delay?: number; as?: 'section' | 'div'; id?: string }) {
  const reduce = useReducedMotion();
  const Comp = as === 'div' ? motion.div : motion.section;
  return (
    <motion.div
      className="relative z-10 scroll-mt-32"
      id={id}
      initial={reduce ? false : 'cerrado'}
      whileInView="abierto"
      viewport={{ once: true, amount: 0.05 }}
    >
      <Comp className={className} variants={pergamino} transition={{ duration: 0.75, delay, ease: [0.2, 0, 0, 1] }}>
        {children}
      </Comp>
    </motion.div>
  );
}

const easeBrush = [0.65, 0, 0.35, 1] as const;

/**
 * Título de sección escrito con pincel + mancha de tinta que se expande detrás.
 * El disparo se detecta en el contenedor (sin clip-path) y baja por variantes.
 */
export function TituloPincel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className="relative inline-block" initial="oculto" whileInView="visible" viewport={{ once: true, amount: 0.6 }}>
      <motion.svg
        viewBox="0 0 200 60"
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 w-[135%] h-[170%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        variants={{ oculto: { scale: 0.4, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
        transition={{ duration: 0.9, ease: [0.2, 0, 0, 1] }}
      >
        <path
          d="M14 34c6-14 30-22 62-22 20 0 34-6 58-3 30 4 52 12 54 22 2 12-24 18-52 19-18 1-30 6-58 5-34-1-70-6-64-21z"
          fill="#141414"
          fillOpacity=".09"
        />
        <circle cx="186" cy="16" r="3.2" fill="#141414" fillOpacity=".1" />
        <circle cx="10" cy="48" r="2.2" fill="#141414" fillOpacity=".1" />
      </motion.svg>
      <motion.h2
        className={`relative ${className}`}
        variants={{ oculto: { clipPath: 'inset(-25% 100% -25% -5%)' }, visible: { clipPath: 'inset(-25% -5% -25% -5%)' } }}
        transition={{ duration: 0.8, delay: 0.15, ease: easeBrush }}
      >
        {children}
      </motion.h2>
    </motion.div>
  );
}

/** Los renglones de una carta aparecen en cascada, como si se fueran escribiendo. */
export function ListaCascada({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.01 }}
      variants={{ oculto: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }}
    >
      {Children.map(children, (hijo) =>
        hijo ? (
          <motion.div
            variants={{ oculto: { opacity: 0, y: 10, filter: 'blur(4px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
            transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
          >
            {hijo}
          </motion.div>
        ) : null,
      )}
    </motion.div>
  );
}

/** Kanji pequeño que pasa de borroso a nítido, como tinta que se seca. */
export function TintaSeca({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className={className}
      variants={{ oculto: { opacity: 0, filter: 'blur(6px)' }, visible: { opacity: 1, filter: 'blur(0px)' } }}
      transition={{ duration: 0.7, delay: 0.18, ease: 'easeOut' }}
    >
      {children}
    </motion.span>
  );
}

/** Precio que cae como un pequeño sello al final del renglón. */
export function PrecioSello({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={{ oculto: { opacity: 0, scale: 1.3, rotate: -6 }, visible: { opacity: 1, scale: 1, rotate: 0 } }}
      transition={{ type: 'spring', stiffness: 480, damping: 20, delay: 0.22 }}
    >
      {children}
    </motion.span>
  );
}

/** Texto vertical japonés que se escribe carácter por carácter. */
export function TextoVertical({ texto, className = '' }: { texto: string; className?: string }) {
  const chars = Array.from(texto);
  return (
    <span aria-hidden="true" className={`jp-vertical ${className}`}>
      {chars.map((c, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, delay: 0.25 + i * 0.09, ease: 'easeOut' }}
        >
          {c}
        </motion.span>
      ))}
    </span>
  );
}

/** Sello hanko rojo que cae y se "estampa". */
export function Hanko({ children, className = '', delay = 0, enVista = true }: { children: ReactNode; className?: string; delay?: number; enVista?: boolean }) {
  const anim = { scale: 1, rotate: -4, opacity: 1 };
  return (
    <motion.span
      className={`inline-flex items-center justify-center ${className}`}
      initial={{ scale: 2.2, rotate: -18, opacity: 0 }}
      {...(enVista ? { whileInView: anim, viewport: { once: true, amount: 0.1 } } : { animate: anim })}
      transition={{ type: 'spring', stiffness: 520, damping: 22, delay }}
    >
      {children}
    </motion.span>
  );
}
