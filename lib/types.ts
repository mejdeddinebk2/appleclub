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

export type ValueIcon = FeatureIcon | 'book' | 'sparkles';

export interface Value {
  icon: ValueIcon;
  title: string;
  description: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export type ActivityCategory = 'Workshop' | 'Hackathon' | 'Project';

export interface Activity {
  id: string;
  title: string;
  /** ISO date, e.g. "2025-03-12" */
  date: string;
  category: ActivityCategory;
  description: string;
  /** Path inside /public, e.g. "/images/activities/hackathon.jpg". Omit it for a gradient cover. */
  image?: string;
  imageAlt?: string;
  /** Internal ("/gallery") or external ("https://...") link. */
  link?: { href: string; label?: string };
  tags?: string[];
}

export interface Member {
  id: string;
  name: string;
  /** Displayed title, e.g. "President", "Dev Lead", "UI/UX Designer" */
  role: string;
  /** Group the member belongs to, e.g. "Board", "Dev Team", "Design Team". Defaults to "Members". */
  team?: string;
  /** Path inside /public, e.g. "/images/members/jane.jpg". Omit it to show an initials avatar. */
  photo?: string;
  bio?: string;
  socials: Partial<Record<SocialPlatform, string>>;
}

export interface MemberGroup {
  team: string;
  members: Member[];
}
