'use client';

import { MoonIcon, SunIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

/**
 * Toggles the `dark` class on <html> and persists the choice.
 * The initial theme (saved choice or system preference) is applied
 * before paint by the inline script in app/layout.tsx, so there is no flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');
    root.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // Storage unavailable (private mode): theme still applies for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
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
