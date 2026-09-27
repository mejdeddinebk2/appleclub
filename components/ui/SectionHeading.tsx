import { TextScramble } from '@/components/ui/TextScramble';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' ? 'mx-auto text-center' : 'text-left', className)}>
      {eyebrow && (
        <p
          className={cn(
            'flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-accent dark:text-accent-light',
            align === 'center' && 'justify-center',
          )}
        >
          <span aria-hidden className="h-px w-6 shrink-0 bg-accent/60 dark:bg-accent-light/60" />
          <TextScramble text={eyebrow} />
        </p>
      )}
      <Tag className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">{title}</Tag>
      <span
        aria-hidden
        className={cn('draw-line mt-6 block h-px w-16 bg-accent/50', align === 'center' && 'mx-auto')}
      />
      {description && (
        <p className="mt-5 text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">
          {description}
        </p>
      )}
    </div>
  );
}
