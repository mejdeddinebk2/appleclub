import { ComingSoon } from '@/components/sections/ComingSoon';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Members',
  description: 'Meet the students behind Apple Club at EPI Digital School.',
  path: '/members',
});

export default function MembersPage() {
  return (
    <ComingSoon
      eyebrow="Members"
      title="The people behind the club."
      description="Meet the team of builders, designers, and organizers who make Apple Club happen."
    />
  );
}
