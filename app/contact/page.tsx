import { ComingSoon } from '@/components/sections/ComingSoon';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Join Us',
  description: 'Join Apple Club or get in touch with the team at EPI Digital School (IMSET Sousse).',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <ComingSoon
      eyebrow="Contact"
      title="Join the club."
      description="The membership form is on its way. In the meantime, reach us on our socials."
    >
      <SocialLinks showLabels className="justify-center gap-4" linkClassName="px-4" />
    </ComingSoon>
  );
}
