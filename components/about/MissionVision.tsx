import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { siteConfig } from '@/data/site';

const items = [
  { label: 'Our mission', text: siteConfig.mission },
  { label: 'Our vision', text: siteConfig.vision },
];

export function MissionVision() {
  return (
    <Section id="mission" className="pt-0 sm:pt-0">
      <h2 className="sr-only">Mission and vision</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item.label} delay={i * 120} className="h-full">
            <Card className="relative h-full overflow-hidden p-10 sm:p-12">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
              />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent dark:text-accent-light">
                {item.label}
              </p>
              <p className="mt-5 text-pretty text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
                {item.text}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
