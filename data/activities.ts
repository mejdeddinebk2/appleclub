import type { Activity, ActivityCategory } from '@/lib/types';

/** Filter order on the Activities page. Categories with no activities are hidden. */
export const activityCategories: ActivityCategory[] = ['Workshop', 'Hackathon', 'Project'];

// TODO: sample data. Replace with the club's real activities.
export const activities: Activity[] = [
  {
    id: 'intro-web-workshop',
    title: 'Intro to Web Development',
    date: '2025-03-12',
    category: 'Workshop',
    description:
      'A beginner-friendly session covering HTML, CSS, and JavaScript. Every attendee left with their own page online.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 'campus-hack-2025',
    title: 'Campus Hack 2025',
    date: '2025-04-19',
    category: 'Hackathon',
    description:
      '24 hours, 8 teams, one challenge: build a tool that makes student life on campus better.',
    tags: ['24h', 'Teamwork', 'Prototyping'],
  },
  {
    id: 'swiftui-workshop',
    title: 'Building iOS Apps with SwiftUI',
    date: '2025-05-07',
    category: 'Workshop',
    description: 'A hands-on introduction to SwiftUI: layouts, state, and running a first app in the simulator.',
    tags: ['Swift', 'SwiftUI', 'iOS'],
  },
  {
    id: 'club-website',
    title: 'Apple Club Website',
    date: '2026-09-26',
    category: 'Project',
    description:
      'The site you are browsing, built by club members with Next.js and Tailwind CSS and deployed with GitLab CI.',
    link: { href: 'https://gitlab.com/mejd1/appleclub', label: 'View on GitLab' },
    tags: ['Next.js', 'Tailwind CSS', 'TypeScript'],
  },
];

/** Newest first. */
export function getSortedActivities(list: Activity[] = activities): Activity[] {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}
