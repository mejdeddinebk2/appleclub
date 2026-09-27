'use client';

import Link from 'next/link';
import { useRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary:
    'shine-sweep relative bg-accent text-white shadow-lg shadow-accent/25 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-accent/40 hover:shadow-xl',
  secondary:
    'shine-sweep bg-neutral-900 text-white hover:-translate-y-0.5 hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200',
  outline:
    'border border-neutral-300 text-neutral-900 hover:-translate-y-0.5 hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:border-neutral-600 dark:hover:bg-neutral-900',
  ghost: 'text-accent hover:text-accent-hover dark:text-accent-light',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-[15px]',
  lg: 'px-8 py-4 text-base',
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function buttonClasses({ variant = 'primary', size = 'md', className }: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

/** Subtly pulls the element toward the cursor. No-ops on touch and under reduced motion. */
function useMagnetic<T extends HTMLElement>(strength = 0.25, max = 12) {
  const ref = useRef<T>(null);

  const onMouseMove = (e: MouseEvent<T>) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const x = Math.max(-max, Math.min(max, relX * strength));
    const y = Math.max(-max, Math.min(max, relY * strength));
    e.currentTarget.style.translate = `${x}px ${y}px`;
  };

  const onMouseLeave = (e: MouseEvent<T>) => {
    e.currentTarget.style.translate = '0px 0px';
  };

  return { ref, onMouseMove, onMouseLeave };
}

interface ButtonLinkProps extends StyleProps {
  href: string;
  children: ReactNode;
}

export function ButtonLink({ href, variant, size, className, children }: ButtonLinkProps) {
  const magnetic = useMagnetic<HTMLAnchorElement>();
  return (
    <Link
      ref={magnetic.ref}
      href={href}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      className={buttonClasses({ variant, size, className })}
    >
      {children}
    </Link>
  );
}

type ButtonProps = StyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant, size, className, type = 'button', onMouseMove, onMouseLeave, ...props }: ButtonProps) {
  const magnetic = useMagnetic<HTMLButtonElement>();
  return (
    <button
      ref={magnetic.ref}
      type={type}
      onMouseMove={(e) => {
        magnetic.onMouseMove(e);
        onMouseMove?.(e);
      }}
      onMouseLeave={(e) => {
        magnetic.onMouseLeave(e);
        onMouseLeave?.(e);
      }}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}
