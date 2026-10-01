'use client';

import { useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ScrollWordsProps {
  text: string;
  /** Index of the first word that should use the animated gradient. */
  highlightFrom?: number;
  className?: string;
}

/**
 * Words light up one by one as the paragraph scrolls through the viewport
 * (Apple "Vision Pro" style). Falls back to fully visible text for reduced motion.
 */
export function ScrollWords({ text, highlightFrom, className }: ScrollWordsProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => text.split(' '), [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>('[data-w]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spans.forEach((s) => s.style.setProperty('--wo', '1'));
      return;
    }

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top is at 85% of the viewport, 1 when its bottom reaches 45%.
      const start = vh * 0.85;
      const end = vh * 0.45 - rect.height * 0.15;
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end + rect.height * 0.6)));
      const lit = p * (spans.length + 2);
      spans.forEach((s, i) => {
        const o = Math.min(1, Math.max(0.16, lit - i));
        s.style.setProperty('--wo', o.toFixed(2));
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span
            data-w
            className={cn('scroll-word', highlightFrom !== undefined && i >= highlightFrom && 'mesh-text')}
          >
            {w}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
