export type SocialPlatform = 'instagram' | 'discord' | 'linkedin' | 'github';

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export type FeatureIcon = 'code' | 'trophy' | 'bulb' | 'users';

export interface Feature {
  icon: FeatureIcon;
  title: string;
  description: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  /** Path inside /public, e.g. "/images/members/jane.jpg" */
  photo: string;
  bio?: string;
  socials: Partial<Record<SocialPlatform, string>>;
}
