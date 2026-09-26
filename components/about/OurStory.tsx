import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { foundedYear, milestones, story } from '@/data/about';

export function OurStory() {
  return (
    <Section id="story" className="border-y border-neutral-200/70 bg-neutral-50 dark:border-neutral-900 dark:bg-neutral-950">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow={`Our story · Since ${foundedYear}`}
            title="How it started."
          />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {story.map((paragraph) => (
              <p key={paragraph} className="text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <div>
          <h3 className="sr-only">Milestones</h3>
          <ol className="relative space-y-10 border-l border-neutral-200 pl-8 lg:mt-24 dark:border-neutral-800">
            {milestones.map((milestone, i) => (
              <li key={`${milestone.year}-${milestone.title}`} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[38.5px] top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-neutral-50 dark:ring-neutral-950"
                />
                <Reveal delay={i * 100}>
                  <p className="text-sm font-semibold text-accent dark:text-accent-light">{milestone.year}</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight">{milestone.title}</p>
                  <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-400">{milestone.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
