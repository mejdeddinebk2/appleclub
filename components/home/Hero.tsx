import Image from 'next/image';
import { HeroBackground } from '@/components/home/HeroBackground';
import { HeroScrollFx } from '@/components/home/HeroScrollFx';
import { ArrowRightIcon } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/data/site';
import { asset } from '@/lib/utils';

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden py-20">
      <HeroBackground />

      <HeroScrollFx>
        <Container className="text-center">
          <div className="relative mx-auto w-fit animate-fade-up">
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
            style={{ fontSize: 'clamp(3.5rem, 13vw, 9rem)' }}
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
            className="shimmer-text mt-4 animate-fade-up pb-1 text-3xl font-semibold tracking-tight sm:text-5xl"
            style={{ animationDelay: '240ms' }}
          >
            {siteConfig.tagline}
          </p>

          <p
            className="mx-auto mt-6 max-w-2xl animate-fade-up text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400"
            style={{ animationDelay: '320ms' }}
          >
            {siteConfig.mission}
          </p>

          <div
            className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-4 sm:flex-row"
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
        </Container>
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
