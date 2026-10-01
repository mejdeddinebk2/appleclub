import { ArrowRightIcon } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { ScrollWords } from '@/components/ui/ScrollWords';
import { Section } from '@/components/ui/Section';

const MISSION = 'We believe the best way to learn technology is to build with it, together.';

export function Mission() {
  return (
    <Section>
      <h2 className="sr-only">{MISSION}</h2>
      <div aria-hidden>
        <ScrollWords
          text={MISSION}
          highlightFrom={MISSION.split(' ').length - 4}
          className="mx-auto max-w-4xl text-balance text-center text-3xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl"
        />
      </div>
      <Reveal>
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
