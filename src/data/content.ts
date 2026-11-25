/* THE OFFER LOOKS GOOD. DOES THE JOB? — editable content source.
   EVERYTHING ABOUT BOTH OFFERS IS A CONSTRUCTED EXAMPLE: the organisations, roles, terms and amounts are fictional.
   They are not real offers and not salary benchmarks. Nothing here is a fit score. */

export type OfferId = 'A' | 'B';
export type PriorityId = 'income' | 'learning' | 'autonomy' | 'creative' | 'stability' | 'team';
export type DrawerId = 'work' | 'people' | 'feedback' | 'learning' | 'hours' | 'money';
export type Choice = 'A' | 'B' | 'more';

export const COPY = {
  title: 'YOU HAVE TWO OFFERS.',
  lede: 'They both want you. Both sound promising.\nBoth leave a few things unanswered.',
  cta: 'OPEN YOUR OFFERS',
  exhibit: 'THE OFFER LOOKS GOOD. DOES THE JOB?',
  end1: 'A BETTER OFFER ISN’T ALWAYS THE SAME AS A BETTER FIT.',
  end2: 'READ THE OFFER. QUESTION THE ASSUMPTIONS.',
  attribution: 'A Studio Bridge research exhibit',
  disclosure: 'Constructed example. North Pier Product Works and Room Eight Design Office are fictional. All terms and amounts are illustrative, not real offers or salary benchmarks.',
  persistence: 'Nothing you choose here is saved or sent anywhere. Closing the page clears it.'
};

export const CHOICES: Record<Choice, { first: string; again: string; short: string }> = {
  A: { first: 'AT FIRST GLANCE, I’D CHOOSE A', again: 'NOW I’D CHOOSE A', short: 'Offer A · North Pier' },
  B: { first: 'AT FIRST GLANCE, I’D CHOOSE B', again: 'NOW I’D CHOOSE B', short: 'Offer B · Room Eight' },
  more: { first: 'I NEED MORE INFORMATION', again: 'I STILL NEED MORE INFORMATION', short: 'Need more information' }
};

/* Each letter line can be tagged with priorities (emphasis) and can be underlined with the pen. */
export interface LetterLine { id: string; label: string; text: string; pri: PriorityId[]; fine?: string }
export interface Offer {
  id: OfferId; org: string; tag: string; role: string; envelope: string; envelopeSeal: string; opened: string; doc: string; accent: string;
  salutation: string; lines: LetterLine[]; closing: string; signoff: string;
}

export const OFFERS: Record<OfferId, Offer> = {
  A: {
    id: 'A', org: 'NORTH PIER PRODUCT WORKS', tag: 'THE BIGGER TEAM', role: 'Junior Product Designer', accent: '#1f3a2a',
    envelope: 'OF_PROP_01_ForestGreenEnvelope_v01', envelopeSeal: 'OF_PROP_01_ForestGreenEnvelope_v01__seal', opened: 'OF_PROP_03_OpenedEnvelope_v01', doc: 'OF_DOC_01_OfferA_NorthPier_v01',
    salutation: 'Dear Candidate,',
    lines: [
      { id: 'A-pay', label: 'Pay', text: 'A gross monthly salary of ₹56,000, as set out in the attached annexure.', pri: ['income', 'stability'], fine: 'The annexure isn’t in the envelope. Is ₹56,000 gross, CTC, or take-home?' },
      { id: 'A-mode', label: 'Working pattern', text: 'Hybrid: three days a week in our studio.', pri: ['stability', 'team'], fine: 'Which three days? Fixed by the team, or yours to choose?' },
      { id: 'A-team', label: 'Team', text: 'You will join an established digital product team.', pri: ['team', 'learning'], fine: 'How big is “the team” you’d sit with every day?' },
      { id: 'A-growth', label: 'Growth', text: 'We offer structured growth and a learning budget.', pri: ['learning'], fine: '“Structured” how? The budget amount isn’t stated.' },
      { id: 'A-pace', label: 'Pace', text: 'We move fast and ship often.', pri: ['stability', 'autonomy'], fine: 'Fast for whom? What happens in release weeks?' }
    ],
    closing: 'We are excited about what you will build with us.',
    signoff: 'Head of Design, North Pier Product Works'
  },
  B: {
    id: 'B', org: 'ROOM EIGHT DESIGN OFFICE', tag: 'THE CLOSER STUDIO', role: 'Junior Multidisciplinary Designer', accent: '#4c2027',
    envelope: 'OF_PROP_02_BurgundyEnvelope_v01', envelopeSeal: 'OF_PROP_02_BurgundyEnvelope_v01__seal', opened: 'OF_PROP_03_OpenedEnvelope_v01__burgundy', doc: 'OF_DOC_02_OfferB_RoomEight_v01',
    salutation: 'Dear Candidate,',
    lines: [
      { id: 'B-pay', label: 'Pay', text: 'A gross monthly salary of ₹40,000, reviewed after probation.', pri: ['income', 'stability'], fine: 'How long is probation, and what decides the review?' },
      { id: 'B-mode', label: 'Working pattern', text: 'On-site, five days a week, in our small studio.', pri: ['stability', 'team'], fine: 'How far is the studio from where you’d live?' },
      { id: 'B-team', label: 'Team', text: 'You will work closely with our founder and a small team.', pri: ['team', 'learning'], fine: 'Closely meaning daily reviews, or that the founder does everything?' },
      { id: 'B-work', label: 'Work', text: 'Every week brings a different kind of project.', pri: ['creative', 'autonomy'], fine: 'Brand, web, packaging, social: which most of the time?' },
      { id: 'B-own', label: 'Ownership', text: 'You will own real client work from day one.', pri: ['autonomy', 'creative'], fine: 'Own it alone, or with someone checking first?' }
    ],
    closing: 'We think you would thrive in a studio like ours.',
    signoff: 'Founder & Creative Director, Room Eight Design Office'
  }
};

/* Comparison rows lit by the ruler: what each letter states, and what it leaves out. */
export const COMPARE: { label: string; A: string | null; B: string | null }[] = [
  { label: 'Role title', A: 'Junior Product Designer', B: 'Junior Multidisciplinary Designer' },
  { label: 'Gross monthly pay', A: '₹56,000 (illustrative)', B: '₹40,000 (illustrative)' },
  { label: 'Salary breakdown', A: null, B: null },
  { label: 'Working pattern', A: 'Hybrid, 3 office days', B: 'On-site, 5 days' },
  { label: 'Probation length', A: null, B: null },
  { label: 'Who you report to', A: null, B: 'The founder' },
  { label: 'Learning support', A: 'Budget (amount not stated)', B: null },
  { label: 'Typical hours', A: null, B: null }
];

export const PRIORITIES: Record<PriorityId, { name: string; ask: string }> = {
  income: { name: 'Income', ask: 'What will actually reach my account each month?' },
  learning: { name: 'Learning', ask: 'Who will teach me, and how?' },
  autonomy: { name: 'Autonomy', ask: 'How much will I decide on my own?' },
  creative: { name: 'Creative Work', ask: 'What kind of work will fill my week?' },
  stability: { name: 'Stability', ask: 'How predictable are the pay, hours and role?' },
  team: { name: 'Team Environment', ask: 'Who will I sit with, and how do they work?' }
};
export const DEFAULT_PRIORITY_ORDER: PriorityId[] = ['income', 'learning', 'autonomy', 'creative', 'stability', 'team'];

/* The six drawers: what you'd find out by looking or asking. Fictional, role-grounded details. */
export interface Drawer { id: DrawerId; name: string; pri: PriorityId[]; A: string; B: string; missingA: string; missingB: string; questions: string[] }
export const DRAWERS: Drawer[] = [
  {
    id: 'work', name: 'The Actual Work', pri: ['creative', 'autonomy'],
    A: 'Mostly screens for one product’s onboarding and settings flows, inside an existing design system. Research is run by another team; you would observe sessions at first.',
    B: 'Brand identities, social campaigns, a website refresh, the occasional packaging job. Two or three client projects at once; you would present some of your own work.',
    missingA: 'How much is production inside the system, and how much is new problem-solving.',
    missingB: 'How the mix is decided, and whether you get a say in what you take on.',
    questions: ['What would a typical week of my work look like in the first three months?', 'How much of the role is production work, and how much is new design?']
  },
  {
    id: 'people', name: 'The People', pri: ['team', 'learning'],
    A: 'A product team of about forty, including six designers. Your design lead manages five people across two time zones.',
    B: 'Seven people in one room. The founder is also the creative director and reviews almost everything before it goes out.',
    missingA: 'How much of the lead’s time a junior actually gets.',
    missingB: 'What happens when the founder is away or overloaded.',
    questions: ['Who will I work with most closely, day to day?', 'How much time will my lead or reviewer have for me each week?']
  },
  {
    id: 'feedback', name: 'The Feedback', pri: ['learning', 'team'],
    A: 'Design critique every two weeks. A formal performance review every six months.',
    B: 'Informal feedback across the table, every day. No formal review process yet.',
    missingA: 'Whether juniors present at crit, or only listen.',
    missingB: 'How you would know where you stand, and what “doing well” looks like.',
    questions: ['When will I first hear how I am doing, and in what form?', 'What does doing well look like in the first six months?']
  },
  {
    id: 'learning', name: 'The Learning', pri: ['learning'],
    A: 'A learning budget is mentioned but not quantified. There is an internal design guild that meets monthly.',
    B: 'No structured training. The founder says people “learn on the job” across many kinds of work.',
    missingA: 'The budget amount, and whether juniors get time to use it.',
    missingB: 'Who teaches you, and how mistakes are handled.',
    questions: ['How do new designers usually learn here, and from whom?', 'Is there time set aside for learning, or does it happen around deadlines?']
  },
  {
    id: 'hours', name: 'The Hours', pri: ['stability', 'team'],
    A: 'Listed hours are 10:00–19:00. The team mentions that release weeks “sometimes run late”.',
    B: 'On-site 10:00–18:30, five days. Client deadlines can mean evenings “a few times a month”.',
    missingA: 'Which three days are office days, and whether they’re fixed.',
    missingB: 'How often “a few times a month” is in a busy season.',
    questions: ['How often did the team work late in the last quarter?', 'Is the working pattern written into the contract?']
  },
  {
    id: 'money', name: 'The Money', pri: ['income', 'stability'],
    A: '₹56,000 gross a month (illustrative). The letter refers to an annexure with the salary breakdown; it isn’t attached. Three office days mean commuting costs you pay.',
    B: '₹40,000 gross a month (illustrative). Paid monthly. Salary is “reviewed after probation”, but the probation length isn’t stated.',
    missingA: 'The breakdown: basic pay, allowances and deductions.',
    missingB: 'Probation length, and what the review is based on.',
    questions: ['Can I see the salary breakdown, and what will be deducted before take-home?', 'How long is probation, and when is the first salary review?']
  }
];

/* Hypothetical circumstance cards: no personal data is collected. */
export interface Circumstance { id: string; text: string; look: string; drawers: DrawerId[]; question: string }
export const CIRCUMSTANCES: Circumstance[] = [
  { id: 'income', text: 'I need a stable income right away', look: 'Probation pay, when salary is paid, and the notice period.', drawers: ['money', 'hours'], question: 'Is the full salary paid during probation?' },
  { id: 'mentor', text: 'Mentorship matters a lot to me', look: 'Who reviews your work, and how often.', drawers: ['people', 'feedback', 'learning'], question: 'Who will review my work in the first month?' },
  { id: 'commute', text: 'My commute would be long', look: 'Office days, travel cost and time. Try the calculator.', drawers: ['hours', 'money'], question: 'Can office days be scheduled to avoid peak travel?' },
  { id: 'breadth', text: 'I want to try many kinds of work', look: 'How varied the projects really are week to week.', drawers: ['work'], question: 'Could I work on more than one type of project in my first year?' },
  { id: 'predictable', text: 'I need predictable hours', look: 'Late weeks, deadline seasons and weekend work.', drawers: ['hours'], question: 'How predictable are working hours in a busy month?' },
  { id: 'remote', text: 'Remote flexibility matters to me', look: 'Whether the pattern is written down, and who decides it.', drawers: ['hours', 'people'], question: 'Is the hybrid arrangement in the contract, or at a manager’s discretion?' },
  { id: 'specialise', text: 'I’m still exploring a specialisation', look: 'Whether the role lets you move toward the work you want next.', drawers: ['work', 'learning'], question: 'Has anyone in this role moved toward a different specialisation?' }
];

/* A typical week (opened from the desk clock). Illustrative. */
export const WEEK: Record<OfferId, { days: ('office' | 'home' | 'unknown' | 'off')[]; hours: string; note: string }> = {
  A: { days: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'off', 'off'], hours: '10:00–19:00', note: '3 office days + 2 home days. Which days is not stated.' },
  B: { days: ['office', 'office', 'office', 'office', 'office', 'off', 'off'], hours: '10:00–18:30', note: 'On-site five days. Occasional client-deadline evenings.' }
};

export const GROSS: Record<OfferId, number> = { A: 56000, B: 40000 };
export const OFFICE_DAYS_PER_WEEK: Record<OfferId, number> = { A: 3, B: 5 };

export interface Source { title: string; publisher: string; url?: string; note: string }
export const SOURCES: Record<string, Source> = {
  sb: { title: 'Studio Bridge primary research: thematic synthesis', publisher: 'Studio Bridge team', note: 'Interviews with students, educators, design professionals and employers raised support, mentorship, feedback and respect as things that show up only after joining. Paraphrased; no participant is quoted.' },
  deloitte2025: { title: '2025 Gen Z and Millennial Survey', publisher: 'Deloitte Global, May 2025', url: 'https://www.deloitte.com/global/en/about/press-room/deloitte-2025-gen-z-and-millennial-survey.html', note: 'Over 23,000 respondents in 44 countries. Learning and development ranked among the top three reasons for choosing a current employer; many felt managers were missing the mark on their development.' },
  epf: { title: 'Employees’ Provident Funds and Miscellaneous Provisions Act, 1952', publisher: 'Government of India (via V.V. Giri National Labour Institute)', url: 'https://vvgnli.gov.in/sites/default/files/Employees%27%20Provident%20Funds%20and%20Miscellaneous%20Provisions%20Act%2C%201952.pdf', note: 'Provident fund contributions are set as 12% of basic wages and dearness allowance, not of the gross figure. That is one reason a gross number alone can’t tell you take-home pay.' }
};

export const DISCLAIMERS = [
  COPY.disclosure,
  'There is no fit score. Priorities and circumstances only change which evidence is emphasised.',
  'The calculator does exact arithmetic on the illustrative figures and any commute cost you type. It does not calculate tax, provident fund or other deductions.',
  'Circumstance cards are hypothetical prompts. Nothing you pick is stored.',
  'No interview quotations appear here; themes are paraphrased until checked against transcripts.'
];
