'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { members } from '@/data/members';
import { siteConfig } from '@/data/site';
import { asset } from '@/lib/utils';

/** Real team photos from the club gallery, shown as a mosaic behind the title. */
const TILES: Array<{ src: string; pos: string }> = [
  { src: '/images/gallery/epi-sup-friends.jpg', pos: '50% 30%' },
  { src: '/images/gallery/epi-club-amphitheater-group.jpg', pos: '50% 40%' },
  { src: '/images/gallery/epi-sup-celebration.jpg', pos: '50% 35%' },
  { src: '/images/gallery/epi-business-school-group.jpg', pos: '50% 30%' },
  { src: '/images/gallery/epi-sup-lineup.jpg', pos: '50% 40%' },
  { src: '/images/gallery/epi-club-lobby-group.jpg', pos: '50% 35%' },
  { src: '/images/gallery/epi-sup-booth-team.jpg', pos: '50% 40%' },
  { src: '/images/gallery/epi-stadium-booths.jpg', pos: '50% 45%' },
  { src: '/images/gallery/epi-sup-tent-team.jpg', pos: '50% 60%' },
  { src: '/images/gallery/epi-club-moment-08.jpg', pos: '50% 40%' },
  { src: '/images/gallery/epi-club-moment-13.jpg', pos: '50% 40%' },
  { src: '/images/gallery/epi-club-moment-20.jpg', pos: '50% 40%' },
];

// Staggered reveal order so the mosaic fills in organically, not row by row.
const ORDER = [5, 0, 8, 2, 10, 4, 1, 9, 6, 11, 3, 7];

const EXIT_AT = 4000;

type State = 'idle' | 'play' | 'exit' | 'done';

/**
 * Cinematic first-visit intro: the team's photos assemble into a mosaic while the logo
 * ring draws itself, then a curtain lifts into the hero. Plays once per session on the
 * home page (the inline script in app/layout.tsx sets <html data-intro>). Skippable by
 * tapping, pressing a key, or using the Skip button.
 */
export function Intro() {
  const [state, setState] = useState<State>('idle');
  const timers = useRef<number[]>([]);
  const faces = members.filter((m) => m.photo).slice(0, 5);

  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    document.documentElement.removeAttribute('data-intro');
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [window.setTimeout(() => setState('done'), 1000)];
    setState('exit');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute('data-intro')) {
      setState('done');
      return;
    }
    setState('play');
    timers.current = [window.setTimeout(finish, EXIT_AT)];
    const onKey = () => finish();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, [finish]);

  if (state === 'done') return null;

  return (
    <div
      className="intro-root"
      data-state={state === 'exit' ? 'exit' : 'play'}
      role="dialog"
      aria-label={`Welcome to ${siteConfig.name}`}
      onClick={finish}
    >
      {/* Photo mosaic */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-4 gap-1 p-1 sm:grid-cols-4 sm:grid-rows-3 sm:gap-1.5 sm:p-1.5">
        {TILES.map((tile, i) => (
          <div
            key={tile.src}
            className="intro-tile relative overflow-hidden rounded-xl bg-neutral-900 sm:rounded-2xl"
            style={{ animationDelay: `${150 + ORDER.indexOf(i) * 110}ms` }}
          >
            <Image
              src={asset(tile.src)}
              alt=""
              fill
              sizes="(min-width: 640px) 25vw, 34vw"
              quality={55}
              priority={i < 4}
              className="intro-drift object-cover"
              style={{ objectPosition: tile.pos }}
            />
          </div>
        ))}
      </div>

      {/* Readability veil */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.55)_45%,rgba(0,0,0,0.78)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-accent/25 to-transparent mix-blend-screen"
      />

      {/* Center content */}
      <div className="intro-content absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="intro-rise relative h-24 w-24 sm:h-28 sm:w-28" style={{ animationDelay: '100ms' }}>
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
            <circle
              className="intro-ring"
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="rgb(var(--accent-light-rgb))"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <Image
            src={asset('/images/logo-apple-club.png')}
            alt=""
            width={72}
            height={72}
            priority
            className="absolute inset-0 m-auto h-14 w-14 rounded-xl bg-white object-contain p-1 drop-shadow-2xl sm:h-16 sm:w-16"
          />
        </div>

        <p
          className="intro-rise mt-7 text-[11px] font-medium uppercase tracking-[0.32em] text-white/70 sm:text-xs"
          style={{ animationDelay: '700ms' }}
        >
          {siteConfig.school} · {siteConfig.campus}
        </p>

        <p
          role="heading"
          aria-level={2}
          className="intro-rise mt-3 font-semibold leading-[0.95] tracking-tighter text-white"
          style={{ animationDelay: '900ms', fontSize: 'clamp(2.4rem, 9vw, 5.5rem)' }}
        >
          {siteConfig.name}
        </p>

        <p
          className="intro-rise mt-4 flex flex-wrap items-center justify-center gap-x-3 text-lg font-semibold tracking-tight sm:text-2xl"
          style={{ animationDelay: '1300ms' }}
        >
          {siteConfig.tagline.split(' ').map((word, i) => (
            <span
              key={word}
              className={i === 0 ? 'text-white' : i === 1 ? 'text-accent-light' : 'text-white/80'}
            >
              {word}
            </span>
          ))}
        </p>

        {/* Meet the team */}
        <div
          className="intro-rise mt-9 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-4 backdrop-blur-md"
          style={{ animationDelay: '1700ms' }}
        >
          <span className="flex -space-x-2.5">
            {faces.map((m) => (
              <span key={m.id} className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-black/60 sm:h-9 sm:w-9">
                <Image src={asset(m.photo!)} alt="" fill sizes="36px" className="object-cover" />
              </span>
            ))}
          </span>
          <span className="text-xs font-medium text-white/90 sm:text-sm">Meet the team 👋</span>
        </div>
      </div>

      {/* Bottom bar: progress + skip */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
            <div className="intro-bar h-full rounded-full bg-accent-light" />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              finish();
            }}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
