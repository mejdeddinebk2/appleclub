import { MissionVision } from '@/components/about/MissionVision';
import { OurStory } from '@/components/about/OurStory';
import { Values } from '@/components/about/Values';
import { JoinCta } from '@/components/home/JoinCta';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ChapterNav } from '@/components/ui/ChapterNav';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'About',
  description:
    'The mission, vision, founding story, and values of Apple Club EPI, the official iOS development club of EPI Sup (Sousse, Tunisia).',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <Section className="pb-16 sm:pb-20">
        <Reveal>
          <SectionHeading
            as="h1"
            chapter="01"
            eyebrow="About"
            title="Built by students, for students."
            description="Apple Club EPI is where curiosity meets craft: a community at EPI Sup that learns, builds, and shares iOS technology together."
          />
        </Reveal>
      </Section>

      <MissionVision />
      <OurStory />
      <Values />

<ChapterNav current="01" />

      <JoinCta />
    </>
  );
}
