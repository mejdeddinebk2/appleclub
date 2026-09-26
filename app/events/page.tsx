import { ComingSoon } from '@/components/sections/ComingSoon';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Events',
  description: 'Upcoming Apple Club events at EPI Digital School (IMSET Sousse).',
  path: '/events',
});

export default function EventsPage() {
  return (
    <ComingSoon
      eyebrow="Events"
      title="What is coming up."
      description="Our calendar of upcoming workshops, talks, and hackathons."
    />
  );
}
