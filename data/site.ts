import type { Feature, NavItem, SocialLink, Stat } from '@/lib/types';

const fallbackUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

/** Global site settings. Edit these values to update content across the site. */
export const siteConfig = {
  name: 'Apple Club EPI',
  school: 'EPI Sup',
  campus: 'Sousse, Tunisie',
  tagline: 'Think. Build. Innovate.',
  description:
    "L'Apple Club EPI est le premier club étudiant dédié au développement d'applications mobiles iOS au sein du groupe EPI Sup (École Polytechnique Internationale), à Sousse, Tunisie.",
  mission:
    "Connecter les étudiants avec l'écosystème iOS, organiser des événements technologiques, et concevoir des applications mobiles réelles.",
  vision:
    "Former les étudiants aux technologies Apple et perfectionner leurs compétences en programmation mobile, pour en faire les futurs développeurs iOS de demain.",
  contactEmail: 'apple.epiclub@gmail.com',
  teacherAdvisor: {
    name: 'Mme. Nahla Baccar',
    role: 'Enseignante responsable',
  },
  url: (process.env.NEXT_PUBLIC_SITE_URL || fallbackUrl).replace(/\/$/, ''),
  keywords: [
    'Apple Club EPI',
    'EPI Sup',
    'Sousse',
    'iOS development',
    'Apple technologies',
    'student club',
    'mobile apps',
    'Tunisia',
  ],
  joinFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSeXfjkXset6HaqGOCG68DOyrRbLxFA6HEhW5lOTstUt2K_Qsw/viewform?embedded=true',
  joinFormUrlDirect:
    'https://docs.google.com/forms/d/e/1FAIpQLSeXfjkXset6HaqGOCG68DOyrRbLxFA6HEhW5lOTstUt2K_Qsw/viewform',
};

export const navItems: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Members', href: '/members' },
  { label: 'Activities', href: '/activities' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export const socialLinks: SocialLink[] = [
  { platform: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/apple_epi_club/' },
  { platform: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/100077138213374/?locale=fr_FR' },
];

export const features: Feature[] = [
  {
    icon: 'code',
    title: 'Workshops iOS',
    description:
      'Sessions pratiques sur Swift, SwiftUI, et le développement mobile Apple, animées par et pour les étudiants.',
    href: '/activities',
  },
  {
    icon: 'trophy',
    title: 'Hackathons',
    description: 'Des sprints intenses et fun où les idées deviennent des prototypes fonctionnels en un week-end.',
    href: '/activities',
  },
  {
    icon: 'bulb',
    title: 'Projets',
    description: "De vraies applications construites en équipe, du premier croquis jusqu'au lancement.",
    href: '/activities',
  },
  {
    icon: 'users',
    title: 'Communauté',
    description: "Un réseau accueillant d'esprits curieux, de mentors, et de futurs développeurs iOS.",
    href: '/members',
  },
];

// Technologies the club works with, shown as a scrolling strip on the homepage.
export const techStack: string[] = [
  'Swift',
  'SwiftUI',
  'Xcode',
  'UIKit',
  'iOS',
  'ARKit',
  'CoreData',
  'WidgetKit',
  'Combine',
  'CloudKit',
  'TestFlight',
  'App Store Connect',
];

// Sample figures: update them with the club's real numbers.
export const stats: Stat[] = [
  { value: '50+', label: 'Membres actifs' },
  { value: '20+', label: 'Workshops organisés' },
  { value: '5', label: 'Hackathons' },
  { value: '10+', label: 'Projets lancés' },
];
