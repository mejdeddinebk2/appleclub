import { ActivitiesExplorer } from '@/components/activities/ActivitiesExplorer';
import { JoinCta } from '@/components/home/JoinCta';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ChapterNav } from '@/components/ui/ChapterNav';
import { activityCategories, getSortedActivities } from '@/data/activities';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Activities',
  description:
    'Workshops, hackathons, and projects by Apple Club, the official tech club of EPI Digital School (IMSET Sousse).',
  path: '/activities',
});

export default function ActivitiesPage() {
  const activities = getSortedActivities();

  return (
    <>
      <Section className="pb-12 sm:pb-16">
        <Reveal>
          <SectionHeading
            as="h1"
            chapter="03"
            eyebrow="Activities"
            title="Workshops, hackathons, projects."
            description="A look at what we have learned, built, and shipped together. Pick a category to explore."
          />
        </Reveal>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <ActivitiesExplorer activities={activities} categories={activityCategories} />
      </Section>

<ChapterNav current="03" />

      <JoinCta />
    </>
  );
}
