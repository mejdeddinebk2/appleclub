import type { ClubEvent } from '@/lib/types';

// TODO: sample data. Replace with the club's real events.
// Dates and times are in Tunisia local time. Events move to "Past" automatically once they end.
export const events: ClubEvent[] = [
  {
    id: 'welcome-day-2026',
    title: 'Welcome Day 2026',
    date: '2026-10-08',
    startTime: '10:00',
    endTime: '13:00',
    location: 'EPI Digital School, Main Hall',
    type: 'Meetup',
    description:
      'Meet the team, discover what we do this year, and sign up for the workshops and project teams that interest you.',
    link: { href: '/contact', label: 'Join the club' },
  },
  {
    id: 'ai-chatbot-workshop',
    title: 'Hands-on AI: Build Your First Chatbot',
    date: '2026-10-22',
    startTime: '14:00',
    endTime: '17:00',
    location: 'EPI Digital School, Computer Lab',
    type: 'Workshop',
    description:
      'A beginner-friendly afternoon on large language models: prompts, APIs, and a small chatbot you can take home. Bring your laptop.',
    link: { href: '/contact', label: 'Save my seat' },
  },
  {
    id: 'swiftui-workshop-2025',
    title: 'Building iOS Apps with SwiftUI',
    date: '2025-05-07',
    startTime: '14:00',
    endTime: '17:00',
    location: 'EPI Digital School, Computer Lab',
    type: 'Workshop',
    description: 'A hands-on introduction to SwiftUI: layouts, state, and running a first app in the simulator.',
  },
  {
    id: 'campus-hack-2025',
    title: 'Campus Hack 2025',
    date: '2025-04-19',
    startTime: '09:00',
    endTime: '21:00',
    location: 'EPI Digital School, IMSET Sousse',
    type: 'Hackathon',
    description: '8 teams, one challenge: build a tool that makes student life on campus better.',
    link: { href: '/activities', label: 'See the projects' },
  },
];
