import type { ReactNode } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface ComingSoonProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

/** Temporary page body for sections that are not built yet. */
export function ComingSoon({ eyebrow, title, description, children }: ComingSoonProps) {
  return (
    <Section className="flex min-h-[70vh] items-center">
      <Reveal>
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 flex justify-center">
          <span className="rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
            Coming soon
          </span>
        </div>
        {children && <div className="mt-10 flex justify-center">{children}</div>}
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/" variant="outline">
            Back to home
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
