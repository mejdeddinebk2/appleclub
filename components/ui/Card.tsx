'use client';

import { useRef, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  /** Lift + shadow + mouse-follow spotlight on hover (also reacts to a parent `group`). */
  interactive?: boolean;
  /** Default inner padding. Disable it for edge-to-edge media, then pad the content yourself. */
  padded?: boolean;
  children: ReactNode;
}

const MAX_TILT_DEG = 7;

export function Card({ className, interactive = true, padded = true, children }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty('--x', `${x}px`);
    ref.current.style.setProperty('--y', `${y}px`);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;
    ref.current.style.setProperty('--rx', `${(-py * MAX_TILT_DEG).toFixed(2)}deg`);
    ref.current.style.setProperty('--ry', `${(px * MAX_TILT_DEG).toFixed(2)}deg`);
  };

  const onMouseLeave = () => {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        'group/card relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60',
        padded && 'p-8',
        interactive && 'tilt-card shine-sweep dark:hover:border-neutral-700',
        className,
      )}
    >
      {interactive && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            style={{
              background:
                'radial-gradient(560px circle at var(--x, 50%) var(--y, 50%), rgba(0,113,227,0.12), transparent 45%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] ring-1 ring-inset ring-accent/0 transition-all duration-500 group-hover/card:opacity-100 group-hover/card:ring-accent/15 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          />
        </>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
