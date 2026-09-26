import { ArrowRightIcon } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

export function Mission() {
  return (
    <Section>
      <Reveal>
        <h2 className="mx-auto max-w-4xl text-balance text-center text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          We believe the best way to learn technology is to{' '}
          <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400">
            build with it, together.
          </span>
        </h2>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/about" variant="ghost" className="group">
            Read our story
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
