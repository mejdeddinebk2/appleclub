import Link from 'next/link';
import { ArrowRightIcon } from '@/components/icons';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';

interface Chapter {
  num: string;
  label: string;
  href: string;
}

const CHAPTERS: Chapter[] = [
  { num: '01', label: 'About', href: '/about' },
  { num: '02', label: 'Members', href: '/members' },
  { num: '03', label: 'Activities', href: '/activities' },
  { num: '04', label: 'Events', href: '/events' },
  { num: '05', label: 'Gallery', href: '/gallery' },
  { num: '06', label: 'Contact', href: '/contact' },
];

/** A quiet "next chapter" wayfinding link, shown at the bottom of each main page. */
export function ChapterNav({ current }: { current: string }) {
  const index = CHAPTERS.findIndex((c) => c.num === current);
  const next = CHAPTERS[(index + 1) % CHAPTERS.length];

  return (
    <Container className="py-10 sm:py-14">
      <Reveal>
        <Link
          href={next.href}
          className="group tilt-card flex items-center justify-between gap-4 rounded-2xl border border-neutral-200/70 bg-neutral-50 px-6 py-5 transition-colors hover:border-accent/40 dark:border-neutral-800 dark:bg-neutral-900/60"
        >
          <span className="flex items-baseline gap-3">
            <span className="font-mono text-xs tracking-[0.3em] text-neutral-400 dark:text-neutral-600">
              CH.{next.num}
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Next</span>
            <span className="text-lg font-semibold tracking-tight">{next.label}</span>
          </span>
          <ArrowRightIcon className="h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent" />
        </Link>
      </Reveal>
    </Container>
  );
}
