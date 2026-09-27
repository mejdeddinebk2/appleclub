import type { Milestone, Value } from '@/lib/types';

export const foundedYear = '2023';
export const founder = 'Aziz Dely';

export const story: string[] = [
  'Apple Club EPI is a student-led technology club at EPI Sousse, founded by Aziz Dely in September 2023.',
  'The club brings together students passionate about technology, innovation, and the digital world. Our mission is to create a dynamic environment where students can learn, create, share, and grow through workshops, training sessions, tech events, challenges, and collaborative projects.',
  'We focus on developing both technical and professional skills, while encouraging creativity, teamwork, innovation, and connections with professionals and the tech community.',
  'From programming and artificial intelligence to cybersecurity, web development, entrepreneurship, and emerging technologies, Apple Club EPI offers a space for students to explore their interests and turn ideas into projects.',
  '3 years of learning, innovation, and community — and we\u2019re just getting started.',
];

// TODO: refine exact dates/titles for each milestone once confirmed with the board.
export const milestones: Milestone[] = [
  {
    year: '2023',
    title: 'Apple Club EPI is founded',
    description: 'Aziz Dely launches the club at EPI Sousse, bringing together the first group of tech-passionate students.',
  },
  {
    year: '2024',
    title: 'Growing community',
    description: 'The club expands its activities with regular workshops, training sessions, and tech events across AI, cybersecurity, and web development.',
  },
  {
    year: '2025',
    title: 'New board, new momentum',
    description: 'A new board takes over, led by Nour Mechri, expanding the club\u2019s projects, challenges, and partnerships.',
  },
  {
    year: 'Today',
    title: '3 years strong',
    description: 'A growing community of students learning, building, and sharing \u2014 and just getting started.',
  },
];

export const values: Value[] = [
  {
    icon: 'bulb',
    title: 'Innovation',
    description: 'We chase bold ideas across AI, cybersecurity, web development, and emerging technologies.',
  },
  {
    icon: 'users',
    title: 'Community',
    description: 'A dynamic environment where every student passionate about tech is welcome.',
  },
  {
    icon: 'book',
    title: 'Learning',
    description: 'We learn by doing, through workshops, training sessions, and collaborative projects.',
  },
  {
    icon: 'sparkles',
    title: 'Professionalism',
    description: 'We build technical and professional skills, and connect with professionals and the tech community.',
  },
];
