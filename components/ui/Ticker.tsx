import { cn } from '@/lib/utils';

interface TickerProps {
  items: string[];
  label: string;
  className?: string;
}

/** Seamless auto-scrolling strip. Pauses on hover; content is duplicated for a clean loop. */
export function Ticker({ items, label, className }: TickerProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden border-y border-neutral-200/70 bg-neutral-50/70 py-5 dark:border-neutral-900 dark:bg-neutral-950/50',
        className,
      )}
    >
      <p className="sr-only">{label}: {items.join(', ')}</p>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent dark:from-black sm:w-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent dark:from-black sm:w-40"
      />
      <div aria-hidden className="marquee-track flex w-max items-center gap-12">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-12 text-lg font-medium tracking-tight text-neutral-400 dark:text-neutral-600"
          >
            {item}
            <span className="h-1 w-1 shrink-0 rounded-full bg-accent/50" />
          </span>
        ))}
      </div>
    </div>
  );
}
