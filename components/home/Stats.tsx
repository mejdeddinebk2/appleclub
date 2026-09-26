import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { stats } from '@/data/site';

export function Stats() {
  return (
    <Section className="border-y border-neutral-200/70 bg-neutral-50 py-20 sm:py-24 dark:border-neutral-900 dark:bg-neutral-950">
      <h2 className="sr-only">Club in numbers</h2>
      <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 80} className="text-center">
            <p className="bg-gradient-to-b from-neutral-900 to-neutral-500 bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl dark:from-white dark:to-neutral-500">
              {stat.value}
            </p>
            <p className="mt-2 text-sm font-medium text-neutral-500 sm:text-base dark:text-neutral-400">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
