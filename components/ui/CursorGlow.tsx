'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, summary, .tilt-card';

/**
 * A soft accent-colored glow that trails the pointer, a dot that tracks it exactly,
 * and a ring that expands around anything clickable — for a tactile, premium feel.
 * No-ops on touch devices and under prefers-reduced-motion.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduced) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let glowX = targetX;
    let glowY = targetY;
    let raf = 0;
    let visible = false;
    let hovering = false;

    const show = () => {
      if (visible) return;
      visible = true;
      glowRef.current?.style.setProperty('opacity', '1');
      dotRef.current?.style.setProperty('opacity', '1');
    };

    const hide = () => {
      visible = false;
      glowRef.current?.style.setProperty('opacity', '0');
      dotRef.current?.style.setProperty('opacity', '0');
      ringRef.current?.style.setProperty('opacity', '0');
    };

    const place = (el: HTMLDivElement | null, x: number, y: number, scale = 1) => {
      if (!el) return;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      targetX = e.clientX;
      targetY = e.clientY;
      show();
      place(dotRef.current, targetX, targetY, hovering ? 0 : 1);
      place(ringRef.current, targetX, targetY, hovering ? 1 : 0.4);
      ringRef.current?.style.setProperty('opacity', hovering ? '1' : '0');
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(INTERACTIVE_SELECTOR);
      if (!el || hovering) return;
      hovering = true;
      place(dotRef.current, targetX, targetY, 0);
      place(ringRef.current, targetX, targetY, 1);
      ringRef.current?.style.setProperty('opacity', '1');
    };

    const onOut = (e: MouseEvent) => {
      const from = (e.target as HTMLElement).closest(INTERACTIVE_SELECTOR);
      if (!from) return;
      const to = (e.relatedTarget as HTMLElement | null)?.closest(INTERACTIVE_SELECTOR);
      if (to) return;
      hovering = false;
      place(dotRef.current, targetX, targetY, 1);
      place(ringRef.current, targetX, targetY, 0.4);
      ringRef.current?.style.setProperty('opacity', '0');
    };

    const tick = () => {
      glowX += (targetX - glowX) * 0.12;
      glowY += (targetY - glowY) * 0.12;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%) scale(${hovering ? 1.3 : 1})`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[65] hidden sm:block">
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[440px] w-[440px] rounded-full opacity-0 blur-3xl transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(0,113,227,0.16), rgba(59,130,246,0.07) 42%, transparent 70%)',
          mixBlendMode: 'plus-lighter',
        }}
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-11 w-11 rounded-full border border-accent/70 opacity-0 transition-[opacity,transform] duration-300 ease-out"
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2 w-2 rounded-full bg-accent opacity-0 shadow-[0_0_14px_3px_rgba(0,113,227,0.75)] transition-[opacity,transform] duration-200 ease-out"
      />
    </div>
  );
}
