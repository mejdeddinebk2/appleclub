import { MissionVision } from '@/components/about/MissionVision';
import { OurStory } from '@/components/about/OurStory';
import { Values } from '@/components/about/Values';
import { JoinCta } from '@/components/home/JoinCta';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'About',
  description:
    'The mission, vision, founding story, and values of Apple Club, the official tech club of EPI Digital School (IMSET Sousse).',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <Section className="pb-16 sm:pb-20">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="About"
            title="Built by students, for students."
            description="Apple Club is where curiosity meets craft: a community at EPI Digital School that learns, builds, and shares technology together."
          />
        </Reveal>
      </Section>
      <MissionVision />
      <OurStory />
      <Values />
      <JoinCta />
    </>
  );
}
