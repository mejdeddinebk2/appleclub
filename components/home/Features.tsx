import Link from 'next/link';
import type { ComponentType } from 'react';
import { ArrowRightIcon, BulbIcon, CodeIcon, TrophyIcon, UsersIcon, type IconProps } from '@/components/icons';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { features } from '@/data/site';
import type { FeatureIcon } from '@/lib/types';

const icons: Record<FeatureIcon, ComponentType<IconProps>> = {
  code: CodeIcon,
  trophy: TrophyIcon,
  bulb: BulbIcon,
  users: UsersIcon,
};

export function Features() {
  return (
    <Section id="what-we-do">
      <Reveal>
        <SectionHeading
          eyebrow="What we do"
          title="Learn it. Build it. Ship it."
          description="From your first line of code to your first launch, we create spaces where students grow by making real things together."
        />
      </Reveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => {
          const Icon = icons[feature.icon];
          return (
            <Reveal key={feature.title} delay={i * 100} className="h-full">
              <Link
                href={feature.href}
                className="group block h-full rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Card className="flex h-full flex-col">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent dark:text-accent-light">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent dark:text-accent-light">
                    Explore
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Card>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
