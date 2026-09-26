import { ComingSoon } from '@/components/sections/ComingSoon';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Gallery',
  description: 'Photos from past Apple Club events, workshops, and hackathons.',
  path: '/gallery',
});

export default function GalleryPage() {
  return (
    <ComingSoon
      eyebrow="Gallery"
      title="Moments we made."
      description="Snapshots from our workshops, hackathons, and community events."
    />
  );
}
