import Image from 'next/image';
import { ArrowRightIcon } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/data/site';
import { asset } from '@/lib/utils';

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden py-20">
      {/* Soft animated glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[40%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 animate-float rounded-full bg-gradient-to-tr from-sky-300/40 via-blue-400/30 to-indigo-400/40 blur-3xl sm:h-[40rem] sm:w-[40rem] dark:from-sky-500/20 dark:via-blue-600/20 dark:to-indigo-700/25" />
      </div>

      <Container className="text-center">
        <div className="mx-auto w-fit animate-fade-up">
          <Image
            src={asset('/logo.svg')}
            alt={`${siteConfig.name} logo`}
            width={96}
            height={96}
            priority
            unoptimized
            className="h-20 w-20 drop-shadow-2xl sm:h-24 sm:w-24"
          />
        </div>

        <p
          className="mt-8 animate-fade-up text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 sm:text-sm dark:text-neutral-400"
          style={{ animationDelay: '80ms' }}
        >
          {siteConfig.school} · {siteConfig.campus}
        </p>

        <h1
          className="mt-4 animate-fade-up text-6xl font-semibold tracking-tighter sm:text-7xl md:text-8xl"
          style={{ animationDelay: '160ms' }}
        >
          {siteConfig.name}.
        </h1>

        <p
          className="mt-4 animate-fade-up bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text pb-1 text-3xl font-semibold tracking-tight text-transparent sm:text-5xl dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400"
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
          <ButtonLink href="/contact" size="lg">
            Join Us
          </ButtonLink>
          <ButtonLink href="/about" variant="ghost" size="lg" className="group">
            Learn more
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
