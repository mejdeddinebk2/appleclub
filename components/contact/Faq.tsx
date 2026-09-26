import { PlusIcon } from '@/components/icons';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { faqs } from '@/data/contact';

/** FAQ accordion built on native <details>, so it works without JavaScript and with keyboards. */
export function Faq() {
  if (faqs.length === 0) return null;

  return (
    <Section id="faq" className="border-t border-neutral-200/70 dark:border-neutral-900">
      <Reveal>
        <SectionHeading eyebrow="FAQ" title="Good questions." description="A few things students often ask before joining." />
      </Reveal>

      <Reveal delay={100}>
        <Card interactive={false} padded={false} className="mx-auto mt-14 max-w-3xl divide-y divide-neutral-200 dark:divide-neutral-800">
          {faqs.map((faq) => (
            <details key={faq.question} className="group px-6 sm:px-8">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
                {faq.question}
                <PlusIcon className="h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-300 group-open:rotate-45 group-open:text-accent" />
              </summary>
              <p className="-mt-2 pb-6 pr-10 leading-relaxed text-neutral-600 dark:text-neutral-400">{faq.answer}</p>
            </details>
          ))}
        </Card>
      </Reveal>
    </Section>
  );
}
