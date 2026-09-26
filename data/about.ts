import type { Milestone, Value } from '@/lib/types';

// TODO: sample content. Replace the year, story, and milestones with the club's real history.
export const foundedYear = '2023';

export const story: string[] = [
  'Apple Club started with a simple idea: students at EPI Digital School who loved technology deserved a place to build things together, beyond the classroom.',
  'What began as a handful of friends sharing tips and side projects quickly grew into a community that runs workshops, joins hackathons, and ships real products.',
  'Today, Apple Club is the official tech club of EPI Digital School (IMSET Sousse), open to every student who is curious about code, design, and innovation, whatever their level.',
];

export const milestones: Milestone[] = [
  {
    year: '2023',
    title: 'The first meetup',
    description: 'A small group of students gathers to share projects, ideas, and a love for great technology.',
  },
  {
    year: '2024',
    title: 'Official club status',
    description: 'Apple Club becomes the official tech club of EPI Digital School and runs its first workshops.',
  },
  {
    year: '2025',
    title: 'Our first hackathon',
    description: 'Teams of members build working prototypes in a single weekend.',
  },
  {
    year: 'Today',
    title: 'A growing community',
    description: 'More members, more projects, and more ways to learn, build, and share.',
  },
];

export const values: Value[] = [
  {
    icon: 'bulb',
    title: 'Innovation',
    description: 'We chase bold ideas and are not afraid to try, fail, and try again.',
  },
  {
    icon: 'users',
    title: 'Community',
    description: 'Everyone is welcome. We grow faster when we help each other.',
  },
  {
    icon: 'book',
    title: 'Learning',
    description: 'We learn by doing, through workshops, mentoring, and real projects.',
  },
  {
    icon: 'sparkles',
    title: 'Craftsmanship',
    description: 'We care about the details, from clean code to thoughtful design.',
  },
];
