import { Card } from '@/components/ui/Card';
import { SocialLinks } from '@/components/ui/SocialLinks';
import type { Member, SocialLink, SocialPlatform } from '@/lib/types';
import { MemberAvatar } from './MemberAvatar';

const platformOrder: SocialPlatform[] = ['linkedin', 'github', 'instagram', 'tiktok', 'facebook', 'discord'];

const platformLabels: Record<SocialPlatform, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  discord: 'Discord',
};

function memberSocialLinks(member: Member): SocialLink[] {
  return platformOrder.flatMap((platform) => {
    const href = member.socials[platform];
    return href ? [{ platform, href, label: `${member.name} on ${platformLabels[platform]}` }] : [];
  });
}

export function MemberCard({ member }: { member: Member }) {
  const links = memberSocialLinks(member);

  return (
    <Card className="group flex h-full flex-col items-center text-center">
      <MemberAvatar member={member} />
      <h3 className="mt-6 text-lg font-semibold tracking-tight">{member.name}</h3>
      <p className="mt-1 text-sm font-medium text-accent dark:text-accent-light">{member.role}</p>
      {member.bio && (
        <p className="mt-3 text-pretty text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{member.bio}</p>
      )}
      {links.length > 0 && (
        <SocialLinks
          links={links}
          className="mt-auto justify-center gap-1 pt-6"
          linkClassName="text-neutral-500 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:bg-neutral-800"
        />
      )}
    </Card>
  );
}
