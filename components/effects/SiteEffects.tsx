'use client';

import { useEffect, useState } from 'react';
import { sound } from '@/lib/sound';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
export const EGG_EVENT = 'apple-epi:egg';
const RETRO_MS = 10000;

/**
 * Invisible site-wide behaviors:
 *  - tiny haptic tick on taps (Android) and optional UI sounds
 *  - pointer-tracked specular highlight on Liquid Glass surfaces
 *  - easter egg: Konami code or 5 quick taps on the logo -> apple rain + retro Mac mode
 */
export function SiteEffects() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let retroTimer: ReturnType<typeof setTimeout> | undefined;
    let toastTimer: ReturnType<typeof setTimeout> | undefined;

    const rainApples = () => {
      if (reduced) return;
      const layer = document.createElement('div');
      layer.setAttribute('aria-hidden', 'true');
      const emojis = ['🍎', '🍏', '🍎', '🍎', '✨'];
      for (let i = 0; i < 44; i += 1) {
        const el = document.createElement('span');
        el.className = 'apple-confetti';
        el.textContent = emojis[i % emojis.length];
        el.style.left = `${Math.random() * 100}%`;
        el.style.fontSize = `${18 + Math.random() * 26}px`;
        el.style.setProperty('--dx', `${(Math.random() - 0.5) * 160}px`);
        el.style.setProperty('--rot', `${(Math.random() - 0.5) * 900}deg`);
        el.style.setProperty('--dur', `${2.6 + Math.random() * 2}s`);
        el.style.setProperty('--delay', `${Math.random() * 0.9}s`);
        layer.appendChild(el);
      }
      document.body.appendChild(layer);
      window.setTimeout(() => layer.remove(), 5600);
    };

    const triggerEgg = () => {
      const root = document.documentElement;
      if (root.classList.contains('retro')) return;
      rainApples();
      sound('chime');
      const wasDark = root.classList.contains('dark');
      root.classList.remove('dark');
      root.classList.add('retro');
      setToast('🍎 Welcome back to 1999 — returning to the future in 10s…');
      retroTimer = setTimeout(() => {
        root.classList.remove('retro');
        if (wasDark) root.classList.add('dark');
        setToast(null);
      }, RETRO_MS);
      toastTimer = setTimeout(() => setToast(null), RETRO_MS);
    };

    // --- Konami code
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[progress]) {
        progress += 1;
        if (progress === KONAMI.length) {
          progress = 0;
          triggerEgg();
        }
      } else {
        progress = key === KONAMI[0] ? 1 : 0;
      }
    };

    // --- Clicks: haptics + sound
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest('button, a, [role="button"], summary');
      if (!el) return;
      if (typeof navigator.vibrate === 'function') navigator.vibrate(8);
      sound(el.closest('[data-sound="chime"]') ? 'chime' : 'tick');
    };

    // --- Liquid glass specular highlight
    let ticking = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || ticking) return;
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('.glass-spec');
      if (!el) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--gx', `${e.clientX - r.left}px`);
        el.style.setProperty('--gy', `${e.clientY - r.top}px`);
        ticking = false;
      });
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener(EGG_EVENT, triggerEgg);
    document.addEventListener('click', onClick, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(EGG_EVENT, triggerEgg);
      document.removeEventListener('click', onClick);
      window.removeEventListener('pointermove', onMove);
      if (retroTimer) clearTimeout(retroTimer);
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, []);

  if (!toast) return null;
  return (
    <div
      role="status"
      className="egg-toast fixed bottom-24 left-1/2 z-[310] w-[min(92vw,26rem)] -translate-x-1/2 rounded-2xl border border-neutral-900 bg-white px-5 py-3 text-center text-sm font-medium text-neutral-900 shadow-2xl md:bottom-10"
    >
      {toast}
    </div>
  );
}
