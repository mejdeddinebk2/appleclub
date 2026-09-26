import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  /** Lift + shadow on hover (also reacts to a parent `group`). */
  interactive?: boolean;
  children: ReactNode;
}

export function Card({ className, interactive = true, children }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-neutral-200/70 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-900/60',
        interactive &&
          'transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/5 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-neutral-900/5 dark:hover:border-neutral-700 dark:group-hover:border-neutral-700',
        className,
      )}
    >
      {children}
    </div>
  );
}
