'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TextScrambleProps {
  text: string;
  className?: string;
  as?: 'span' | 'p';
}

/**
 * Splits text into characters that settle in with a short blur/rise stagger once
 * scrolled into view — a quiet "decode" moment for eyebrows/labels. Falls back to
 * plain text under prefers-reduced-motion or before hydration.
 */
export function TextScramble({ text, className, as: Tag = 'span' }: TextScrambleProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const chars = text.split('');

  return (
    <Tag ref={ref as never} className={cn('inline-block', className)} aria-label={text}>
      {visible
        ? chars.map((ch, i) => (
            <span
              key={i}
              aria-hidden
              className="scramble-char"
              style={{ ['--i' as string]: i }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))
        : <span className="opacity-0">{text}</span>}
    </Tag>
  );
}
