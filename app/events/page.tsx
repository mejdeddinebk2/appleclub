import { EventsTimeline } from '@/components/events/EventsTimeline';
import { JoinCta } from '@/components/home/JoinCta';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ChapterNav } from '@/components/ui/ChapterNav';
import { events } from '@/data/events';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Events',
  description:
    'Upcoming and past Apple Club events at EPI Digital School (IMSET Sousse): workshops, hackathons, meetups, and talks.',
  path: '/events',
});

export default function EventsPage() {
  return (
    <>
      <Section className="pb-12 sm:pb-16">
        <Reveal>
          <SectionHeading
            as="h1"
            chapter="04"
            eyebrow="Events"
            title="What is coming up."
            description="Workshops, hackathons, meetups, and talks. Everyone at EPI Digital School is welcome."
          />
        </Reveal>
      </Section>

      <EventsTimeline events={events} renderedAt={Date.now()} />

<ChapterNav current="04" />

      <JoinCta />
    </>
  );
}
