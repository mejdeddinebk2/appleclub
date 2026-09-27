import type { ClubEvent } from '@/lib/types';

// Real past events from Apple Club EPI's Instagram (@apple_epi_club).
// Dates and times are in Tunisia local time. New upcoming events should be added here.
export const events: ClubEvent[] = [
  {
    id: 'epi-survival-challenge-2',
    title: 'EPI Survival Challenge 2.0',
    date: '2026-02-12',
    startTime: '16:30',
    endTime: '08:00',
    location: 'EPI Digital School',
    type: 'Hackathon',
    description:
      'An overnight hackathon on AI, IoT, Web, DevOps, and 3D Modeling, with check-in, a Mystery Game, and a conference edition featuring industry speakers.',
  },
  {
    id: 'epi-survival-challenge-1',
    title: 'EPI Survival Challenge',
    date: '2025-02-10',
    startTime: '16:30',
    endTime: '08:00',
    location: 'EPI Digital School',
    type: 'Hackathon',
    description:
      'The first EPI Survival Challenge: an overnight hackathon with AI, IoT, Web, DevOps, and 3D Modeling challenges.',
  },
  {
    id: 'lets-have-fun-chill-out',
    title: "Let's Have Fun — Chill Out: Year-End Edition",
    date: '2025-05-07',
    startTime: '12:00',
    location: 'EPI Stadium',
    type: 'Meetup',
    description:
      'A year-end chill-out day co-organized with Tech to Think Academy, Fight Club by Louay Miled, Marsaoui Gym, and Mobystore.',
  },
  {
    id: 'photoshop-creative-lab',
    title: 'Creative Lab with Photoshop',
    date: '2025-12-01',
    startTime: '14:00',
    location: 'Seminar Room',
    type: 'Workshop',
    description: 'A hands-on Photoshop design workshop with Chahine Fehri.',
  },
  {
    id: 'nvidia-deep-learning',
    title: 'NVIDIA Certified Deep Learning Course',
    date: '2025-02-20',
    startTime: '10:00',
    location: 'Seminar Room, EPI Digital',
    type: 'Workshop',
    description: 'A certified 2-day deep learning and GPU computing training with NVIDIA Ambassador Mr. Hedi Fekih.',
  },
  {
    id: 'tech-entreprise',
    title: 'Tech & Entreprise: Building the Future',
    date: '2025-02-07',
    startTime: '09:30',
    location: 'Auditorium',
    type: 'Talk',
    description: 'A conference on DevOps, Embedded Systems, AI, and Entrepreneurship with 4 guest speakers.',
  },
  {
    id: 'master-your-pfe',
    title: 'Master Your PFE',
    date: '2024-12-13',
    startTime: '10:00',
    endTime: '13:00',
    location: 'EPI Amphi',
    type: 'Talk',
    description:
      'A conference on planning and executing a final-year project (PFE), with startup founders and job interviews on-site.',
  },
  {
    id: 'cybersecurity-sql-injection',
    title: 'Cybersecurity: SQL Injection and Prevention Strategies',
    date: '2024-11-22',
    startTime: '13:00',
    location: 'Seminar Room',
    type: 'Workshop',
    description: 'A workshop with Theb Nachet, CEO and cybersecurity expert at Evosec Consulting.',
  },
  {
    id: 'team-building-2024',
    title: 'Team Building Training',
    date: '2024-11-14',
    startTime: '17:00',
    endTime: '19:00',
    location: 'EPI Digital Stadium',
    type: 'Workshop',
    description: 'A team-building day hosted by English communication trainer and life coach Ms. Maram Ouertani.',
  },
  {
    id: 'integration-day-2024',
    title: 'Integration Day',
    date: '2024-10-25',
    startTime: '10:00',
    location: 'EPI Stadium',
    type: 'Meetup',
    description: 'Meet the team and discover the tech world at our recruitment stand.',
  },
];
