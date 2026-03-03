export const MOCK_USER = {
  firstName: 'Michael',
  role: 'Community Supporter',
} as const;

export const MOCK_IMPACT = {
  totalGiven: 45000,
  peopleHelped: 12,
  weeklyHelped: 3,
} as const;

export const MOCK_TRENDING_REQUESTS = [
  {
    id: '1',
    name: 'Jamie R',
    initial: 'J',
    avatarColor: '#F59E0B',
    timeAgo: '2h ago',
    text: 'Need help covering unexpected medical bills this month as i have been sick and haven\'t been able to go to work.',
    raised: 9000,
    goal: 15000,
    percent: 63,
  },
  {
    id: '2',
    name: 'Alex T',
    initial: 'A',
    avatarColor: '#93C5FD',
    timeAgo: '5h ago',
    text: 'Struggling to afford groceries for my family this week. Any support would mean the world.',
    raised: 8950,
    goal: 9000,
    percent: 98,
  },
  {
    id: '3',
    name: 'Nnenna Ugwu',
    initial: 'N',
    avatarColor: '#86EFAC',
    timeAgo: '2h ago',
    text: 'Need assistance with school fees for my children. Every little bit helps.',
    raised: 12000,
    goal: 25000,
    percent: 48,
  },
] as const;

export type TrendingRequest = (typeof MOCK_TRENDING_REQUESTS)[number];

export const MOCK_RECENT_CONTRIBUTIONS = [
  {
    id: '1',
    contributorName: 'Morgan K',
    description: 'Utility bill assistance',
    amount: 5000,
    timeAgo: '2 hours ago',
  },
  {
    id: '2',
    contributorName: 'Taylor K.',
    description: 'School supplies',
    amount: 2500,
    timeAgo: '2 days ago',
  },
] as const;

export type RecentContribution = (typeof MOCK_RECENT_CONTRIBUTIONS)[number];

export const MOCK_BROWSE_REQUESTS = [
  {
    id: '1',
    name: 'Adaeze O',
    initial: 'A',
    avatarColor: '#93C5FD',
    timeLeft: '2h left',
    categoryId: 'transport',
    categoryLabel: 'Transport',
    badge: '3 requests',
    text: 'Need help with transport fare to get to my new job interview in Ikeja tomorrow morning.',
    raised: 3200,
    goal: 5000,
    percent: 64,
  },
  {
    id: '2',
    name: 'Chidi E.',
    initial: 'C',
    avatarColor: '#F59E0B',
    timeLeft: '18h left',
    categoryId: 'health',
    categoryLabel: 'Health & Personal Care',
    badge: 'New',
    text: 'Need assistance with medical bills for my mother\'s checkup. Every little bit helps.',
    raised: 6300,
    goal: 10000,
    percent: 63,
  },
  {
    id: '3',
    name: 'Tobias C.',
    initial: 'T',
    avatarColor: '#86EFAC',
    timeLeft: '36h left',
    categoryId: 'education',
    categoryLabel: 'Education & Skills',
    badge: 'New',
    text: 'Need help with school fees for my final semester. I\'m so close to graduating.',
    raised: 12000,
    goal: 25000,
    percent: 48,
  },
  {
    id: '4',
    name: 'Racheal I.',
    initial: 'R',
    avatarColor: '#E9D5FF',
    timeLeft: '52h left',
    categoryId: 'rent',
    categoryLabel: 'Rent & Utilities',
    badge: '5 requests',
    text: 'Struggling to pay rent this month after unexpected expenses. Any support appreciated.',
    raised: 14000,
    goal: 50000,
    percent: 28,
  },
] as const;

export type BrowseRequest = (typeof MOCK_BROWSE_REQUESTS)[number];
