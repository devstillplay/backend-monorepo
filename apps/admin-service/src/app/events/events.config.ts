export const HEADLINE_COLORS = ['ink', 'gold', 'green'] as const;
export type HeadlineColor = (typeof HEADLINE_COLORS)[number];
export type HeadlineLine = { text: string; color: HeadlineColor };
export type DiscussionPoint = { title: string; desc: string };

export const DEFAULT_OCCUPATIONS = [
  'Student',
  'Software / Tech professional',
  'Finance / Banking',
  'Betting / Gaming industry',
  'Entrepreneur / Business owner',
  'Regulator / Public sector',
  'Media / Journalist',
  'Researcher / Academic',
  'Legal / Compliance',
];

/** Seeded on first boot so the existing /webinar page keeps working until edited in admin. */
export const DEFAULT_WEBINAR = {
  slug: 'responsible-betting-financial-innovation',
  kicker: 'Webinar',
  title: 'Can Responsible Betting & Financial Innovation Coexist?',
  headlineLines: [
    { text: 'Can Responsible', color: 'ink' },
    { text: 'Betting &', color: 'ink' },
    { text: 'Financial', color: 'gold' },
    { text: 'Innovation', color: 'gold' },
    { text: 'Coexist?', color: 'ink' },
  ] satisfies HeadlineLine[],
  description:
    'Join Still Play for a candid conversation on how responsible betting and financial innovation can grow together — protecting bettors while expanding fair access to credit.',
  startsAt: new Date('2026-10-24T11:00:00.000Z'),
  endsAt: new Date('2026-10-24T13:00:00.000Z'),
  timezone: 'Africa/Lagos',
  timezoneLabel: 'WAT',
  platform: 'Zoom',
  bannerUrl: '/assets/events/responsible-betting-webinar.jpg',
  discussionKicker: "What we'll discuss",
  discussionTitle: 'A conversation for bettors, operators and financial partners',
  discussionPoints: [
    {
      title: 'Responsible betting',
      desc: 'Practical safeguards that protect bettors and their essential funds.',
    },
    {
      title: 'Financial innovation',
      desc: 'How credit and fintech tools can serve bettors fairly and transparently.',
    },
    {
      title: 'Industry & regulation',
      desc: 'What operators, lenders and regulators can build together.',
    },
  ] satisfies DiscussionPoint[],
  formTitle: 'Reserve your spot',
  formSubtitle: 'Register to receive your Zoom link and event reminders.',
  registerButtonLabel: 'Register for free',
  occupationOptions: DEFAULT_OCCUPATIONS,
  published: true,
  featured: true,
  registrationOpen: true,
};
