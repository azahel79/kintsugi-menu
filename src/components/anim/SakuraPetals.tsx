'use client';

import { useEffect, useRef } from 'react';

type Petalo = {
  x: number; y: number; r: number; vy: number; vx: number;
  rot: number; vr: number; fase: number; vf: number; color: string;
};

const COLORES = ['#f4b6c2', '#eea3b3', '#f7c9d2', '#e58b9d'];

/**
 * Pétalos de sakura cayendo en un canvas ligero (sin librerías).
 * Se pausan cuando la pestaña no está visible y no aparecen con "reducir movimiento".
 */
export function SakuraPetals({ cantidad = 14, className = '' }: { cantidad?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, last = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const nuevo = (inicio: boolean): Petalo => ({
      x: Math.random() * w,
      y: inicio ? Math.random() * h : -20,
      r: 5 + Math.random() * 5,
      vy: 18 + Math.random() * 22,
      vx: -8 + Math.random() * 16,
      rot: Math.random() * Math.PI * 2,
      vr: (-0.6 + Math.random() * 1.2),
      fase: Math.random() * Math.PI * 2,
      vf: 0.8 + Math.random() * 1.2,
      color: COLORES[(Math.random() * COLORES.length) | 0],
    });
    const petalos = Array.from({ length: cantidad }, () => nuevo(true));

    const dibujar = (p: Petalo) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      // Aplana el pétalo para simular que gira en 3D.
      ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.fase)));
      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.bezierCurveTo(p.r * 0.9, -p.r * 0.9, p.r * 0.9, p.r * 0.6, 0, p.r);
      ctx.bezierCurveTo(-p.r * 0.9, p.r * 0.6, -p.r * 0.9, -p.r * 0.9, 0, -p.r);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      // Muesca característica del pétalo de cerezo.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(0, -p.r * 1.05, p.r * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < petalos.length; i++) {
        const p = petalos[i];
        p.fase += p.vf * dt;
        p.y += p.vy * dt;
        p.x += (p.vx + Math.sin(p.fase) * 14) * dt;
        p.rot += p.vr * dt;
        if (p.y > h + 20 || p.x < -30 || p.x > w + 30) petalos[i] = nuevo(false);
        dibujar(p);
      }
      raf = requestAnimationFrame(tick);
    };

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick); }
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [cantidad]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
