'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Wraps the hero content and drives a cinematic "pull back" as the user scrolls
 * past it: the CSS var --p goes 0 → 1 over the hero's own height, and
 * `.hero-scroll-fx` (globals.css) turns that into scale/opacity/blur.
 * No-ops under prefers-reduced-motion.
 */
export function HeroScrollFx({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -rect.top / (rect.height * 0.7)));
        el.style.setProperty('--p', p.toFixed(4));
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="hero-scroll-fx">
      {children}
    </div>
  );
}
