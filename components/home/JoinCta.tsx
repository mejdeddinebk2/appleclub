'use client';

import { useRef, type MouseEvent } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { siteConfig } from '@/data/site';

export function JoinCta() {
  const panelRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    panelRef.current?.style.setProperty('--x', `${e.clientX - rect.left}px`);
    panelRef.current?.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  return (
    <Section className="pt-0 sm:pt-0">
      <Reveal>
        <div
          ref={panelRef}
          onMouseMove={onMouseMove}
          className="group relative isolate overflow-hidden rounded-[2.5rem] bg-neutral-950 px-8 py-20 text-center text-white sm:px-16 sm:py-24 dark:bg-neutral-900"
        >
          <div
            aria-hidden
            className="absolute -top-32 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/40 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.08), transparent 45%)',
            }}
          />
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Ready to build with us?</h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-neutral-300">
            Whether you are writing your first line of code or already shipping apps, there is a place for you at{' '}
            {siteConfig.name}.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <ButtonLink href="/contact" size="lg">
              Join Us
            </ButtonLink>
            <SocialLinks linkClassName="text-neutral-300 hover:text-white dark:hover:text-white" />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
