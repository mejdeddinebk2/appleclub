'use client';

import { useRef } from 'react';
import { MoonIcon, SunIcon } from '@/components/icons';
import { sound } from '@/lib/sound';
import { originOf, toggleMode } from '@/lib/theme';
import { cn } from '@/lib/utils';

/**
 * Quick light/dark flip. The new theme expands as a circle from the button
 * (View Transitions API, with an instant fallback). The initial theme is applied
 * before paint by the inline script in app/layout.tsx, so there is no flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => {
        sound('pop');
        toggleMode(originOf(ref.current));
      }}
      aria-label="Toggle dark mode"
      className={cn(
        'group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white',
        className,
      )}
    >
      <MoonIcon className="h-[18px] w-[18px] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <SunIcon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
