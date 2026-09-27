import type { Activity } from '@/lib/types';

// Real activities from Apple Club EPI's Instagram (@apple_epi_club) and Facebook page.
export const activities: Activity[] = [
  {
    id: 'epi-survival-challenge-2',
    title: 'EPI Survival Challenge 2.0',
    date: '2026-02-12',
    category: 'Hackathon',
    description:
      'An overnight hackathon on the theme "Rallying to defend Digital Humanity": AI, IoT, Web, DevOps, and 3D Modeling challenges from check-in to sunrise, with a Mystery Game and music break along the way.',
    image: '/images/activities/survival-challenge-2.jpg',
    tags: ['AI', 'IoT', 'Web', 'DevOps', '3D Modeling', 'Overnight'],
  },
  {
    id: 'epi-survival-challenge-1',
    title: 'EPI Survival Challenge',
    date: '2025-02-10',
    category: 'Hackathon',
    description:
      'The first edition of our flagship hackathon: teams competed through the night on AI, IoT, Web, DevOps, and 3D Modeling challenges at EPI Digital.',
    image: '/images/activities/survival-challenge-1.jpg',
    tags: ['AI', 'IoT', 'Web', 'DevOps', '3D Modeling', 'Overnight'],
  },
  {
    id: 'nvidia-deep-learning',
    title: 'NVIDIA Certified Deep Learning Course',
    date: '2025-02-20',
    category: 'Workshop',
    description:
      '"From Basics to Brilliance": a certified 2-day training on deep learning and GPU computing, run in partnership with T2T Academy and NVIDIA Ambassador Mr. Hedi Fekih.',
    image: '/images/activities/nvidia-deep-learning.jpg',
    tags: ['AI', 'Deep Learning', 'NVIDIA', 'Certified'],
  },
  {
    id: 'tech-entreprise',
    title: 'Tech & Entreprise: Building the Future',
    date: '2025-02-07',
    category: 'Workshop',
    description:
      'A conference on DevOps, Embedded Systems, AI, and Entrepreneurship with 4 speakers: Mr. Ameur Chiheb Abid, Mr. Slaheddine Dardouri, Dr. Naoufel Khayati, and Dr. Hedi Fekih.',
    image: '/images/activities/tech-entreprise.jpg',
    tags: ['DevOps', 'Embedded Systems', 'AI', 'Entrepreneurship'],
  },
  {
    id: 'photoshop-creative-lab',
    title: 'Creative Lab with Photoshop',
    date: '2025-12-01',
    category: 'Workshop',
    description:
      'A hands-on design workshop with Chahine Fehri (Brand Owner, Adobe Photoshop & Illustrator Designer, Web Developer) in the Seminar Room.',
    image: '/images/activities/photoshop-lab.jpg',
    tags: ['Design', 'Photoshop', 'Adobe'],
  },
  {
    id: 'master-your-pfe',
    title: 'Master Your PFE',
    date: '2024-12-13',
    category: 'Workshop',
    description:
      'A conference on planning and executing a final-year project (PFE), with startup founders sharing their journeys, followed by on-site job interviews.',
    image: '/images/activities/master-your-pfe.jpg',
    tags: ['PFE', 'Career', 'Entrepreneurship'],
  },
  {
    id: 'cybersecurity-sql-injection',
    title: 'Cybersecurity: Understanding SQL Injection and Prevention Strategies',
    date: '2024-11-22',
    category: 'Workshop',
    description:
      'A hands-on cybersecurity workshop with Theb Nachet, CEO and cybersecurity expert at Evosec Consulting, covering SQL injection attacks and how to prevent them.',
    image: '/images/activities/cybersecurity-sql.jpg',
    tags: ['Cybersecurity', 'SQL Injection'],
  },
  {
    id: 'team-building-2024',
    title: 'Team Building Training',
    date: '2024-11-14',
    category: 'Workshop',
    description:
      'A team-building day at EPI Stadium hosted by English communication trainer and life coach Ms. Maram Ouertani, focused on communication and collaboration.',
    image: '/images/activities/team-building.jpg',
    tags: ['Soft Skills', 'Communication', 'Teamwork'],
  },
  {
    id: 'lets-have-fun-chill-out',
    title: "Let's Have Fun — Chill Out: Year-End Edition",
    date: '2025-05-07',
    category: 'Project',
    description:
      'A year-end chill-out day at EPI Stadium, co-organized with Tech to Think Academy, Fight Club by Louay Miled, Marsaoui Gym, and Mobystore.',
    image: '/images/activities/lets-have-fun.jpg',
    tags: ['Community', 'Year-End'],
  },
  {
    id: 'integration-day-2024',
    title: 'Integration Day',
    date: '2024-10-25',
    category: 'Project',
    description:
      'Our recruitment stand at EPI Stadium, welcoming new students to discover the tech world and become part of the Apple Club EPI team.',
    tags: ['Recruitment', 'Community'],
  },
];

export const activityCategories: Activity['category'][] = ['Workshop', 'Hackathon', 'Project'];

export function getSortedActivities(): Activity[] {
  return [...activities].sort((a, b) => (a.date < b.date ? 1 : -1));
}
