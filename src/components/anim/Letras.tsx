'use client';

import { m } from 'motion/react';

const ETIQUETAS = { span: m.span, p: m.p, h1: m.h1, h2: m.h2, h3: m.h3 } as const;
type Etiqueta = keyof typeof ETIQUETAS;

type Props = {
  texto: string;
  className?: string;
  as?: Etiqueta;
  /** 'vista': al aparecer en pantalla · 'carga': al montar la página */
  cuando?: 'vista' | 'carga';
  delay?: number;
};

/**
 * Letras que caen una por una y se asientan como sellos.
 * Los lectores de pantalla leen el texto completo (sr-only), no letra por letra.
 */
export function LetrasCaen({ texto, className = '', as = 'span', cuando = 'vista', delay = 0 }: Props) {
  const Comp = ETIQUETAS[as];
  const disparo = cuando === 'vista' ? { whileInView: 'visible', viewport: { once: true, amount: 0.6 } } : { animate: 'visible' };
  return (
    <Comp
      className={className}
      initial="oculto"
      {...disparo}
      variants={{ oculto: {}, visible: { transition: { staggerChildren: 0.035, delayChildren: delay } } }}
    >
      <span className="sr-only">{texto}</span>
      {/* Letras agrupadas por palabra: así un título largo nunca se parte a media palabra. */}
      {texto.split(' ').map((palabra, w, todas) => (
        <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
          {Array.from(palabra).map((c, i) => (
            <m.span
              key={i}
              className="inline-block"
              variants={{
                oculto: { opacity: 0, y: -16, rotate: (w + i) % 2 ? 8 : -8 },
                visible: { opacity: 1, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 520, damping: 18 } },
              }}
            >
              {c}
            </m.span>
          ))}
          {w < todas.length - 1 && <span className="inline-block w-[0.3em]" />}
        </span>
      ))}
    </Comp>
  );
}

/** Palabras que aparecen como tinta: de borrosas a nítidas, una tras otra. */
export function PalabrasTinta({ texto, className = '', as = 'p', delay = 0.2 }: Omit<Props, 'cuando'>) {
  const Comp = ETIQUETAS[as];
  const palabras = texto.split(/\s+/).filter(Boolean);
  return (
    <Comp
      className={className}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ oculto: {}, visible: { transition: { staggerChildren: 0.03, delayChildren: delay } } }}
    >
      <span className="sr-only">{texto}</span>
      {palabras.map((p, i) => (
        <m.span
          key={i}
          aria-hidden="true"
          className="inline-block mr-[0.28em]"
          variants={{ oculto: { opacity: 0, filter: 'blur(5px)', y: 4 }, visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.45 } } }}
        >
          {p}
        </m.span>
      ))}
    </Comp>
  );
}
