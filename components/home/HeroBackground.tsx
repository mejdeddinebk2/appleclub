'use client';

import { useEffect, useRef } from 'react';

/** The hero's floating gradient blobs, nudged gently by the pointer for depth. */
export function HeroBackground() {
  const blob1 = useRef<HTMLDivElement>(null);
  const blob2 = useRef<HTMLDivElement>(null);
  const scrollLayer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let px = 0;
    let py = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      scrollLayer.current?.style.setProperty('translate', `0 ${window.scrollY * 0.18}px`);
    };

    const tick = () => {
      cx += (px - cx) * 0.06;
      cy += (py - cy) * 0.06;
      blob1.current?.style.setProperty('translate', `${cx * 24}px ${cy * 24}px`);
      blob2.current?.style.setProperty('translate', `${cx * -32}px ${cy * -32}px`);
      raf = requestAnimationFrame(tick);
    };

    if (canHover) window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div ref={scrollLayer} className="absolute inset-0">
        <div className="aurora-veil absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl" />
        <div
          ref={blob1}
          className="absolute left-[35%] top-[38%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 animate-float rounded-full bg-gradient-to-tr from-sky-300/40 via-blue-400/30 to-indigo-400/40 blur-3xl sm:h-[38rem] sm:w-[38rem] dark:from-sky-500/20 dark:via-blue-600/20 dark:to-indigo-700/25"
        />
        <div
          ref={blob2}
          className="absolute left-[65%] top-[55%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 animate-float-slow rounded-full bg-gradient-to-tr from-rose-300/30 via-red-400/25 to-orange-300/30 blur-3xl sm:h-[30rem] sm:w-[30rem] dark:from-rose-500/15 dark:via-red-600/15 dark:to-orange-500/15"
        />
        <div className="grid-veil absolute inset-0 opacity-[0.35]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,white_75%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,black_75%)]" />
    </div>
  );
}
