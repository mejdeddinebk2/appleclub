import Image from 'next/image';
import { HeroBackground } from '@/components/home/HeroBackground';
import { HeroScrollFx } from '@/components/home/HeroScrollFx';
import { ArrowRightIcon } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { siteConfig } from '@/data/site';
import { asset } from '@/lib/utils';

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden py-20">
      <HeroBackground />

      <HeroScrollFx>
        <div className="mx-auto w-full max-w-[100rem] px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-16 xl:gap-20">
            {/* Text column */}
            <div className="text-center lg:text-left">
              <div className="relative mx-auto w-fit animate-fade-up lg:mx-0">
                <div
                  aria-hidden
                  className="animate-pulse-slow absolute inset-0 -z-10 rounded-full bg-accent/25 blur-2xl"
                />
                <Image
                  src={asset('/images/logo-apple-club.png')}
                  alt={`${siteConfig.name} logo`}
                  width={96}
                  height={96}
                  priority
                  className="h-20 w-20 object-contain drop-shadow-2xl sm:h-24 sm:w-24"
                />
              </div>

              <p
                className="mt-8 animate-fade-up text-xs font-medium uppercase tracking-[0.3em] text-neutral-500 sm:text-sm dark:text-neutral-400"
                style={{ animationDelay: '80ms' }}
              >
                {siteConfig.school} · {siteConfig.campus}
              </p>

              <h1
                className="mt-5 font-semibold leading-[0.92] tracking-tighter"
                style={{ fontSize: 'clamp(3rem, 6.5vw, 7.5rem)' }}
              >
                {`${siteConfig.name}.`.split(' ').map((word, i) => (
                  <span key={word + i} className="mr-[0.22em] inline-block overflow-hidden last:mr-0">
                    <span className="word-in inline-block" style={{ animationDelay: `${160 + i * 90}ms` }}>
                      {word}
                    </span>
                  </span>
                ))}
              </h1>

              <p
                className="shimmer-text mt-4 animate-fade-up pb-1 text-2xl font-semibold tracking-tight sm:text-4xl"
                style={{ animationDelay: '240ms' }}
              >
                {siteConfig.tagline}
              </p>

              <p
                className="mx-auto mt-6 max-w-xl animate-fade-up text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl lg:mx-0 lg:max-w-none dark:text-neutral-400"
                style={{ animationDelay: '320ms' }}
              >
                {siteConfig.mission}
              </p>

              <div
                className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
                style={{ animationDelay: '400ms' }}
              >
                <ButtonLink href={siteConfig.joinFormUrlDirect} size="lg">
                  Join Us
                </ButtonLink>
                <ButtonLink href="/about" variant="ghost" size="lg" className="group">
                  Learn more
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </ButtonLink>
              </div>
            </div>

            {/* Photo column */}
            <div
              className="relative mx-auto w-full max-w-sm animate-fade-up sm:max-w-md lg:mx-0 lg:max-w-none"
              style={{ animationDelay: '200ms' }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-neutral-900/20 ring-1 ring-black/5 dark:ring-white/10">
                <Image
                  src={asset('/images/gallery/epi-business-school-group.jpg')}
                  alt="Apple Club EPI members posing together on campus"
                  fill
                  priority
                  sizes="(min-width: 1024px) 48vw, (min-width: 640px) 60vw, 85vw"
                  className="object-cover object-[50%_28%]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
                />
              </div>

              <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-neutral-200/80 bg-white/90 px-5 py-3 shadow-xl backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90 sm:block">
                <p className="text-lg font-semibold tracking-tight">🍎 Apple Club EPI</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Think Different. Create Together.</p>
              </div>
            </div>
          </div>
        </div>
      </HeroScrollFx>

      <div
        aria-hidden
        className="animate-fade-in absolute inset-x-0 bottom-8 z-10 hidden flex-col items-center gap-2 sm:flex"
        style={{ animationDelay: '900ms' }}
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
          Scroll
        </span>
        <span className="scroll-cue flex h-8 w-5 items-start justify-center rounded-full border border-neutral-300 p-1 dark:border-neutral-700">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
      </div>
    </section>
  );
}
