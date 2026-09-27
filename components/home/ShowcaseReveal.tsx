'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { ArrowRightIcon } from '@/components/icons';
import { Container } from '@/components/ui/Container';
import { TextScramble } from '@/components/ui/TextScramble';
import { getSortedActivities } from '@/data/activities';
import { asset } from '@/lib/utils';

const COLS = 3;
const ROWS = 3;

/** Tiles N images into a cols×rows mosaic on ONE element via layered CSS backgrounds. */
function mosaicStyle(images: string[]): CSSProperties {
  const layers = ['linear-gradient(rgba(10,10,12,0.32), rgba(10,10,12,0.32))', ...images.map((src) => `url(${asset(src)})`)];
  const sizes = ['cover', ...images.map(() => `${100 / COLS}% ${100 / ROWS}%`)];
  const positions = [
    'center',
    ...images.map((_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = COLS > 1 ? (col / (COLS - 1)) * 100 : 50;
      const y = ROWS > 1 ? (row / (ROWS - 1)) * 100 : 50;
      return `${x}% ${y}%`;
    }),
  ];
  return {
    backgroundImage: layers.join(', '),
    backgroundSize: sizes.join(', '),
    backgroundPosition: positions.join(', '),
    backgroundRepeat: 'no-repeat',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  };
}

/**
 * A pinned scroll sequence: bold headline text filled with a photo mosaic, which
 * zooms and cross-dissolves into the real, clickable photo grid as the user scrolls.
 * Falls back to a static grid under prefers-reduced-motion.
 */
export function ShowcaseReveal() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const tiles = useMemo(
    () =>
      getSortedActivities()
        .filter((a) => a.image)
        .slice(0, 9)
        .reverse(),
    [],
  );
  const images = useMemo(() => tiles.map((a) => a.image!), [tiles]);
  const mosaic = useMemo(() => mosaicStyle(images), [images]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = wrap.getBoundingClientRect();
        const range = rect.height - window.innerHeight;
        const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;

        const textOp = 1 - Math.min(1, Math.max(0, (p - 0.5) / 0.22));
        const textScale = 1 + p * 0.4;
        const gridOp = Math.min(1, Math.max(0, (p - 0.42) / 0.3));
        const gridScale = 0.92 + Math.min(p, 0.72) * 0.11;
        const subOp = Math.min(1, Math.max(0, (p - 0.78) / 0.18));

        stage.style.setProperty('--text-op', textOp.toFixed(3));
        stage.style.setProperty('--text-scale', textScale.toFixed(3));
        stage.style.setProperty('--grid-op', gridOp.toFixed(3));
        stage.style.setProperty('--grid-scale', gridScale.toFixed(3));
        stage.style.setProperty('--sub-op', subOp.toFixed(3));
        stage.style.setProperty('--p', p.toFixed(3));
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section ref={wrapRef} className="showcase-wrap relative h-[280vh]">
      <div className="showcase-sticky sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <Container className="text-center">
          <p className="flex items-center justify-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-accent dark:text-accent-light">
            <span aria-hidden className="h-px w-6 shrink-0 bg-accent/60 dark:bg-accent-light/60" />
            <TextScramble text="Moments we're building" />
          </p>
        </Container>

        <div
          ref={stageRef}
          className="showcase-stage relative mt-6 w-full max-w-5xl px-6"
          style={{ ['--text-op' as string]: 1, ['--text-scale' as string]: 1, ['--grid-op' as string]: 0, ['--grid-scale' as string]: 0.92, ['--sub-op' as string]: 0 }}
        >
          <div className="relative aspect-[6/5] w-full sm:aspect-[16/10]">
            {/* Layer 1: headline masked by the photo mosaic */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex select-none flex-col items-center justify-center leading-[0.86]"
              style={{
                opacity: 'var(--text-op)',
                transform: 'scale(var(--text-scale))',
                willChange: 'transform, opacity',
              }}
            >
              {['LEARNING', 'BY', 'BUILDING'].map((word) => (
                <span
                  key={word}
                  className="font-black tracking-tighter"
                  style={{ fontSize: 'clamp(2.25rem, 9vw, 6.5rem)', ...mosaic }}
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Layer 2: the real, clickable photo grid it dissolves into */}
            <div
              className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1.5 overflow-hidden rounded-[1.75rem] sm:gap-2"
              style={{
                opacity: 'var(--grid-op)',
                transform: 'scale(var(--grid-scale))',
                pointerEvents: 'auto',
              }}
            >
              {tiles.map((activity, i) => (
                <Link
                  key={activity.id}
                  href="/activities"
                  className="group/tile relative block overflow-hidden bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:bg-neutral-800"
                  style={{ transitionDelay: `${i * 15}ms` }}
                >
                  <Image
                    src={asset(activity.image!)}
                    alt={activity.title}
                    fill
                    sizes="(min-width: 640px) 260px, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover/tile:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-2 bottom-2 line-clamp-2 text-left text-[11px] font-medium leading-tight text-white opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 sm:text-xs">
                    {activity.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div
            className="mt-8 flex flex-col items-center gap-5"
            style={{ opacity: 'var(--sub-op)', transform: 'translateY(calc((1 - var(--sub-op)) * 10px))' }}
          >
            <p className="max-w-lg text-pretty text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
              Workshops, hackathons and real shipped projects — built together, one event at a time.
            </p>
            <Link
              href="/activities"
              className="group inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-900"
            >
              See all activities
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
