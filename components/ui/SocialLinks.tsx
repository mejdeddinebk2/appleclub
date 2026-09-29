import type { ComponentType } from 'react';
import {
  DiscordIcon,
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  type IconProps,
} from '@/components/icons';
import { socialLinks } from '@/data/site';
import type { SocialLink, SocialPlatform } from '@/lib/types';
import { cn } from '@/lib/utils';

export const socialIcons: Record<SocialPlatform, ComponentType<IconProps>> = {
  instagram: InstagramIcon,
  discord: DiscordIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
};

interface SocialLinksProps {
  links?: SocialLink[];
  showLabels?: boolean;
  className?: string;
  linkClassName?: string;
}

export function SocialLinks({ links = socialLinks, showLabels = false, className, linkClassName }: SocialLinksProps) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {links.map(({ platform, label, href }) => {
        const Icon = socialIcons[platform];
        return (
          <li key={platform}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={showLabels ? undefined : label}
              className={cn(
                'inline-flex items-center gap-2 rounded-full p-2 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:hover:text-accent-light',
                linkClassName,
              )}
            >
              <Icon className="h-5 w-5" />
              {showLabels && <span className="text-sm">{label}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
