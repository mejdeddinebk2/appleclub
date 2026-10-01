'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { TextScramble } from '@/components/ui/TextScramble';
import { getSortedActivities } from '@/data/activities';
import { siteConfig } from '@/data/site';
import { asset, cn } from '@/lib/utils';

interface Step {
  key: string;
  label: string;
  title: string;
  body: string;
  island: string;
}

const STEPS: Step[] = [
  {
    key: 'learn',
    label: 'Learn',
    title: 'Workshops that actually teach.',
    body: 'Hands-on sessions on Swift, SwiftUI and the Apple ecosystem — run by students who were beginners last year.',
    island: 'Workshop live',
  },
  {
    key: 'build',
    label: 'Build',
    title: 'Real apps, built in teams.',
    body: 'Pair up, open Xcode and turn an idea into a working prototype — with mentors one message away.',
    island: 'Build succeeded',
  },
  {
    key: 'ship',
    label: 'Ship',
    title: 'From Xcode to the App Store.',
    body: 'We walk you through TestFlight, App Store Connect and everything between “it runs” and “it’s live”.',
    island: 'Ready for review',
  },
  {
    key: 'belong',
    label: 'Belong',
    title: 'A crew that has your back.',
    body: 'Hackathons, meetups and late-night debugging — the people make the club.',
    island: '50+ members',
  },
];

const SCREEN_W = 300;
const SCREEN_H = 630;

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

function StatusBar({ dark }: { dark?: boolean }) {
  return (
    <div className={cn('flex items-center justify-between px-7 pt-[14px] text-[12px] font-semibold', dark ? 'text-white' : 'text-neutral-900')}>
      <span>9:41</span>
      <span className="flex items-center gap-1.5" aria-hidden>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
          <rect x="0" y="6" width="3" height="4" rx="0.8" />
          <rect x="4.3" y="4" width="3" height="6" rx="0.8" />
          <rect x="8.6" y="2" width="3" height="8" rx="0.8" />
          <rect x="12.9" y="0" width="3" height="10" rx="0.8" />
        </svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none" stroke="currentColor">
          <rect x="0.5" y="0.5" width="20" height="10" rx="3" opacity="0.5" />
          <rect x="2" y="2" width="15" height="7" rx="1.6" fill="currentColor" stroke="none" />
          <rect x="21.5" y="3.5" width="2" height="4" rx="1" fill="currentColor" stroke="none" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

function LearnScreen() {
  const items = useMemo(() => getSortedActivities().slice(0, 4), []);
  const tone: Record<string, string> = {
    Workshop: 'bg-sky-500/15 text-sky-600',
    Hackathon: 'bg-violet-500/15 text-violet-600',
    Project: 'bg-emerald-500/15 text-emerald-600',
  };
  return (
    <div className="h-full bg-neutral-100 text-neutral-900">
      <StatusBar />
      <div className="px-5 pt-14">
        <p className="text-[30px] font-bold leading-none tracking-tight">Activities</p>
        <p className="mt-1 text-[12px] text-neutral-500">{siteConfig.name}</p>
        <div className="mt-5 space-y-2.5">
          {items.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-200">
                {a.image && <Image src={asset(a.image)} alt="" fill sizes="48px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[12.5px] font-semibold leading-tight">{a.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={cn('rounded-full px-2 py-0.5 text-[9.5px] font-semibold', tone[a.category] ?? tone.Workshop)}>
                    {a.category}
                  </span>
                  <span className="text-[10px] text-neutral-400">{dateFmt.format(new Date(`${a.date}T12:00:00Z`))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BuildScreen() {
  const k = 'text-pink-400';
  const t = 'text-sky-300';
  const s = 'text-orange-300';
  const c = 'text-neutral-500';
  return (
    <div className="h-full bg-[#1c1c1e] font-mono text-white">
      <StatusBar dark />
      <div className="px-4 pt-14">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="ml-2 text-[10px] text-neutral-400">ClubApp.swift</span>
        </div>
        <pre className="mt-4 whitespace-pre-wrap text-[10.5px] leading-[1.7]">
          <span className={c}>{'// Think. Build. Innovate.\n'}</span>
          <span className={k}>struct </span>
          <span className={t}>ClubApp</span>
          {': '}
          <span className={t}>App</span>
          {' {\n  '}
          <span className={k}>var </span>
          {'body: '}
          <span className={k}>some </span>
          <span className={t}>Scene</span>
          {' {\n    '}
          <span className={t}>WindowGroup</span>
          {' {\n      '}
          <span className={t}>Text</span>
          {'('}
          <span className={s}>&quot;Hello, EPI 🍎&quot;</span>
          {')\n        .'}
          <span className={t}>font</span>
          {'(.largeTitle)\n    }\n  }\n}'}
        </pre>
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500/15 px-3 py-2 text-[11px] font-semibold text-emerald-400">
          <span>✓</span> Build Succeeded
        </div>
        <div className="mt-4 flex h-24 items-center justify-center rounded-2xl bg-black/60 text-[15px] font-semibold ring-1 ring-white/10">
          Hello, EPI 🍎
        </div>
      </div>
    </div>
  );
}

function ShipScreen() {
  return (
    <div className="h-full bg-white text-neutral-900">
      <StatusBar />
      <div className="px-5 pt-14">
        <div className="flex items-center gap-4">
          <div className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-[22px] bg-neutral-950 shadow-lg">
            <Image src={asset('/images/logo-apple-club.png')} alt="" width={58} height={58} className="h-[58px] w-[58px] object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-[18px] font-bold leading-tight tracking-tight">{siteConfig.name}</p>
            <p className="text-[11px] text-neutral-500">{siteConfig.school} · Sousse</p>
            <span className="mt-2 inline-block rounded-full bg-accent px-5 py-1 text-[12px] font-bold text-white">GET</span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 divide-x divide-neutral-200 text-center">
          <div>
            <p className="text-[13px] font-bold">5.0</p>
            <p className="text-[9px] text-amber-500">★★★★★</p>
          </div>
          <div>
            <p className="text-[13px] font-bold">4+</p>
            <p className="text-[9px] text-neutral-400">Age</p>
          </div>
          <div>
            <p className="text-[13px] font-bold">#1</p>
            <p className="text-[9px] text-neutral-400">Student club</p>
          </div>
        </div>
        <p className="mt-5 text-[14px] font-bold">What&apos;s New</p>
        <p className="mt-1 text-[11px] leading-relaxed text-neutral-500">
          New workshops, a brand-new hackathon and more students shipping their first app. Come build with us.
        </p>
        <div className="mt-4 flex gap-2">
          <div className="h-32 flex-1 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500" />
          <div className="h-32 flex-1 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-rose-500" />
          <div className="h-32 w-8 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500" />
        </div>
      </div>
    </div>
  );
}

const CREW = [
  '/images/gallery/epi-sup-friends.jpg',
  '/images/gallery/epi-club-amphitheater-group.jpg',
  '/images/gallery/epi-sup-celebration.jpg',
  '/images/gallery/epi-business-school-group.jpg',
  '/images/gallery/epi-sup-lineup.jpg',
  '/images/gallery/epi-club-lobby-group.jpg',
];

function BelongScreen() {
  return (
    <div className="h-full bg-black text-white">
      <StatusBar dark />
      <div className="px-4 pt-14">
        <p className="text-[28px] font-bold leading-none tracking-tight">Crew</p>
        <p className="mt-1 text-[12px] text-neutral-400">50+ builders and counting</p>
        <div className="mt-5 grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl">
          {CREW.map((src) => (
            <div key={src} className="relative aspect-[4/3] bg-neutral-800">
              <Image src={asset(src)} alt="" fill sizes="140px" quality={50} className="object-cover" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-[12px] font-semibold">
          Join the next meetup <span className="text-accent-light">→</span>
        </div>
      </div>
    </div>
  );
}

const SCREENS: ReactNode[] = [<LearnScreen key="l" />, <BuildScreen key="b" />, <ShipScreen key="s" />, <BelongScreen key="c" />];

/**
 * A pinned scroll story: an iPhone mockup whose screen changes as you scroll
 * (Learn → Build → Ship → Belong), with a Dynamic Island that expands on each change.
 */
export function PhoneStory() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [islandOpen, setIslandOpen] = useState(false);
  const [scale, setScale] = useState(0.8);
  const [designH, setDesignH] = useState(SCREEN_H);
  const activeRef = useRef(0);

  // Scroll progress → active step
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = wrap.getBoundingClientRect();
        const range = rect.height - window.innerHeight;
        const p = range > 0 ? Math.min(0.9999, Math.max(0, -rect.top / range)) : 0;
        const idx = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActive(idx);
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Keep the 300×630 design scaled to the phone's real size
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const measure = () => {
      if (!el.clientWidth) return;
      const k = el.clientWidth / SCREEN_W;
      setScale(k);
      // Fill the whole screen: derive the design height from the real box.
      setDesignH(Math.max(SCREEN_H * 0.9, el.clientHeight / k));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  // Dynamic Island: expand on every change, then settle
  useEffect(() => {
    setIslandOpen(true);
    const t = window.setTimeout(() => setIslandOpen(false), 1900);
    return () => window.clearTimeout(t);
  }, [active]);

  const goTo = useCallback((i: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    const range = wrap.offsetHeight - window.innerHeight;
    const y = top + range * ((i + 0.5) / STEPS.length);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);

  const step = STEPS[active];

  return (
    <section ref={wrapRef} aria-label="How the club works" className="phone-wrap relative h-[340vh] sm:h-[380vh]">
      <div className="phone-sticky sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid h-full w-full max-w-6xl grid-rows-[auto_1fr] items-center gap-2 px-6 pb-28 pt-20 sm:px-8 md:grid-cols-2 md:grid-rows-1 md:gap-10 md:pb-10 md:pt-16">
          {/* Copy */}
          <div className="order-2 md:order-1">
            <p className="flex items-center justify-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent md:justify-start md:text-sm dark:text-accent-light">
              <span aria-hidden className="h-px w-6 shrink-0 bg-accent/60 dark:bg-accent-light/60" />
              <TextScramble text="How it works" />
            </p>

            {/* Mobile: only the active step. Desktop: all four with the active one lit. */}
            <ol className="mt-4 md:mt-8 md:space-y-2">
              {STEPS.map((s, i) => (
                <li key={s.key} className={cn(i === active ? 'block' : 'hidden md:block')}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === active ? 'step' : undefined}
                    className={cn(
                      'group relative w-full rounded-2xl p-1 text-center transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:p-4 md:text-left',
                      i === active ? 'opacity-100 md:bg-neutral-100/80 md:dark:bg-white/[0.06]' : 'opacity-100 md:opacity-35 md:hover:opacity-70',
                    )}
                  >
                    <span className="flex items-center justify-center gap-3 md:justify-start">
                      <span className="font-mono text-xs tracking-[0.3em] text-neutral-400">0{i + 1}</span>
                      <span className="text-sm font-semibold text-accent dark:text-accent-light">{s.label}</span>
                    </span>
                    <span className="mt-1.5 block text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                      {s.title}
                    </span>
                    <span
                      className={cn(
                        'mx-auto mt-2 block max-w-md text-pretty text-sm leading-relaxed text-neutral-600 transition-all duration-500 md:mx-0 md:max-w-none md:text-base dark:text-neutral-400',
                        i === active ? 'md:max-h-32 md:opacity-100' : 'md:max-h-0 md:overflow-hidden md:opacity-0',
                      )}
                    >
                      {s.body}
                    </span>
                    {i === active && (
                      <span aria-hidden className="mt-3 hidden h-[3px] w-16 rounded-full bg-accent md:block" />
                    )}
                  </button>
                </li>
              ))}
            </ol>

            {/* progress dots (mobile) */}
            <div className="mt-5 flex justify-center gap-2 md:hidden" aria-hidden>
              {STEPS.map((s, i) => (
                <span
                  key={s.key}
                  className={cn('h-1.5 rounded-full transition-all duration-500', i === active ? 'w-6 bg-accent' : 'w-1.5 bg-neutral-300 dark:bg-neutral-700')}
                />
              ))}
            </div>
          </div>

          {/* Phone */}
          <div className="order-1 flex min-h-0 items-center justify-center md:order-2">
            <div className="relative h-[min(52svh,34rem)] min-h-[16rem] md:h-[min(74svh,40rem)]" style={{ aspectRatio: '9 / 19' }}>
              <div
                aria-hidden
                className="absolute -inset-10 -z-10 rounded-full bg-accent/25 blur-3xl"
              />
              <div className="absolute inset-0 rounded-[13%/6.2%] bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-800 p-[2.2%] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/20">
                <div className="relative h-full w-full overflow-hidden rounded-[11%/5.3%] bg-black p-[2.6%]">
                  <div ref={screenRef} className="relative h-full w-full overflow-hidden rounded-[10%/4.8%] bg-black">
                    <div
                      className="absolute left-0 top-0 origin-top-left"
                      style={{ width: SCREEN_W, height: designH, transform: `scale(${scale})` }}
                    >
                      {SCREENS.map((screen, i) => (
                        <div
                          key={STEPS[i].key}
                          aria-hidden={i !== active}
                          className={cn(
                            'absolute inset-0 transition-all duration-700 ease-out',
                            i === active ? 'translate-y-0 scale-100 opacity-100' : i < active ? '-translate-y-6 scale-95 opacity-0' : 'translate-y-6 scale-95 opacity-0',
                          )}
                        >
                          {screen}
                        </div>
                      ))}
                    </div>

                    {/* Dynamic Island */}
                    <div
                      aria-hidden
                      className="absolute left-1/2 top-[1.6%] z-10 flex h-[4.2%] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-black text-white transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
                      style={{ width: islandOpen ? '70%' : '27%' }}
                    >
                      <span
                        className={cn(
                          'flex items-center gap-1.5 whitespace-nowrap text-[clamp(7px,1.15vw,11px)] font-medium transition-opacity duration-300',
                          islandOpen ? 'opacity-100 delay-150' : 'opacity-0',
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.8)]" />
                        {step.island}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* side buttons */}
              <span aria-hidden className="absolute -left-[1.2%] top-[18%] h-[5%] w-[1.4%] rounded-l bg-neutral-700" />
              <span aria-hidden className="absolute -left-[1.2%] top-[26%] h-[8%] w-[1.4%] rounded-l bg-neutral-700" />
              <span aria-hidden className="absolute -right-[1.2%] top-[24%] h-[11%] w-[1.4%] rounded-r bg-neutral-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
