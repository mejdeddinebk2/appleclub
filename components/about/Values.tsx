import type { ComponentType } from 'react';
import {
  BookIcon,
  BulbIcon,
  CodeIcon,
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
  type IconProps,
} from '@/components/icons';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { values } from '@/data/about';
import type { ValueIcon } from '@/lib/types';

const icons: Record<ValueIcon, ComponentType<IconProps>> = {
  bulb: BulbIcon,
  users: UsersIcon,
  book: BookIcon,
  sparkles: SparklesIcon,
  code: CodeIcon,
  trophy: TrophyIcon,
};

export function Values() {
  return (
    <Section id="values">
      <Reveal>
        <SectionHeading
          eyebrow="Our values"
          title="What we stand for."
          description="Four pillars guide everything we do, from a one-hour workshop to a full product launch."
        />
      </Reveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value, i) => {
          const Icon = icons[value.icon];
          return (
            <Reveal key={value.title} delay={i * 100} className="h-full">
              <Card className="h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent dark:text-accent-light">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{value.title}</h3>
                <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-400">{value.description}</p>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
