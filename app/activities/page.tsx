import { ComingSoon } from '@/components/sections/ComingSoon';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Activities',
  description: 'Workshops, hackathons, and projects built by Apple Club members.',
  path: '/activities',
});

export default function ActivitiesPage() {
  return (
    <ComingSoon
      eyebrow="Activities"
      title="Workshops, hackathons, projects."
      description="A look at what we learn, what we build, and what we ship together."
    />
  );
}
