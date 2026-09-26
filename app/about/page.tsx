import { ComingSoon } from '@/components/sections/ComingSoon';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'About',
  description: 'The mission, vision, and founding story of Apple Club at EPI Digital School (IMSET Sousse).',
  path: '/about',
});

export default function AboutPage() {
  return (
    <ComingSoon
      eyebrow="About"
      title="Our story."
      description="Our mission, our vision, and how a group of curious students started Apple Club."
    />
  );
}
