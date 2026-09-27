export type SocialPlatform = 'instagram' | 'discord' | 'linkedin' | 'github' | 'facebook';

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

export interface FaqItem {
  question: string;
  answer: string;
}

export type EventType = 'Workshop' | 'Hackathon' | 'Meetup' | 'Talk';

/** Named ClubEvent to avoid clashing with the DOM `Event` type. */
export interface ClubEvent {
  id: string;
  title: string;
  /** Local date in Tunisia, "YYYY-MM-DD" */
  date: string;
  /** Local 24h time, "HH:MM" */
  startTime: string;
  endTime?: string;
  location: string;
  description: string;
  type: EventType;
  /** Internal ("/contact") or external ("https://...") link, e.g. a registration form. */
  link?: { href: string; label?: string };
}

export interface GalleryImage {
  id: string;
  /** Path inside /public, e.g. "/images/gallery/hackathon-01.jpg" */
  src: string;
  /** Intrinsic size in pixels. Used to keep the aspect ratio and avoid layout shift. */
  width: number;
  height: number;
  /** Describes what is in the photo, for screen readers. */
  alt: string;
  caption: string;
  /** Optional event reference, e.g. "Campus Hack 2025" */
  event?: string;
  /** Optional "YYYY-MM-DD" */
  date?: string;
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
