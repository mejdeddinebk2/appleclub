'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __lenis?: { scrollTo: (target: number | string | HTMLElement, opts?: object) => void };
  }
}

/**
 * Buttery inertia scrolling (Lenis) for mouse/trackpad users. Touch devices keep
 * their native momentum scrolling, and visitors who prefer reduced motion get
 * normal scrolling. Pauses automatically while a modal locks the page.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let observer: MutationObserver | undefined;
    let destroyed = false;
    let cleanup: (() => void) | undefined;

    void import('lenis').then(({ default: Lenis }) => {
      if (destroyed) return;
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        anchors: true,
      });
      window.__lenis = lenis;

      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      // Menus, dialogs and the command palette lock the page with body overflow:hidden.
      const syncLock = () => {
        if (document.body.style.overflow === 'hidden' || document.documentElement.hasAttribute('data-intro')) lenis.stop();
        else lenis.start();
      };
      observer = new MutationObserver(syncLock);
      observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-intro'] });
      syncLock();

      cleanup = () => {
        lenis.destroy();
        delete window.__lenis;
      };
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      cleanup?.();
    };
  }, []);

  return null;
}
