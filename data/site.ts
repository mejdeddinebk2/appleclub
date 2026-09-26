import type { Feature, NavItem, SocialLink, Stat } from '@/lib/types';

const fallbackUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

/** Global site settings. Edit these values to update content across the site. */
export const siteConfig = {
  name: 'Apple Club',
  school: 'EPI Digital School',
  campus: 'IMSET Sousse',
  tagline: 'Think. Build. Innovate.',
  description:
    'Apple Club is the official tech club of EPI Digital School (IMSET Sousse): a community of students who learn, build, and share through workshops, hackathons, and real projects.',
  mission:
    'We bring together students who love technology to learn by doing, share knowledge, and turn bold ideas into real products.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || fallbackUrl).replace(/\/$/, ''),
  keywords: [
    'Apple Club',
    'EPI Digital School',
    'IMSET Sousse',
    'tech club',
    'student club',
    'hackathon',
    'workshops',
    'Tunisia',
  ],
};

export const navItems: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Members', href: '/members' },
  { label: 'Activities', href: '/activities' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

// TODO: replace with the club's real accounts.
export const socialLinks: SocialLink[] = [
  { platform: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
  { platform: 'discord', label: 'Discord', href: 'https://discord.com/' },
];

export const features: Feature[] = [
  {
    icon: 'code',
    title: 'Workshops',
    description: 'Hands-on sessions on web, mobile, AI, and design, led by students for students.',
    href: '/activities',
  },
  {
    icon: 'trophy',
    title: 'Hackathons',
    description: 'Intense, fun build sprints where ideas become working prototypes in a weekend.',
    href: '/activities',
  },
  {
    icon: 'bulb',
    title: 'Projects',
    description: 'Real products built in teams, from the first sketch all the way to launch.',
    href: '/activities',
  },
  {
    icon: 'users',
    title: 'Community',
    description: 'A welcoming network of curious minds, mentors, and future founders.',
    href: '/members',
  },
];

// Sample figures: update them with the club's real numbers.
export const stats: Stat[] = [
  { value: '50+', label: 'Active members' },
  { value: '20+', label: 'Workshops hosted' },
  { value: '5', label: 'Hackathons' },
  { value: '10+', label: 'Projects shipped' },
];
