import Ionicons from '@expo/vector-icons/Ionicons';

export type ActivityRequestStatus = 'funded' | 'active' | 'expired' | 'cancelled';

/** UI row for Activity → Requests (API-backed or mock). */
export type ActivityRequest = {
  id: string;
  title: string;
  timeAgo: string;
  status: ActivityRequestStatus;
  amount: number;
  categoryId: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export const MOCK_ACTIVITY_REQUESTS: ActivityRequest[] = [
  {
    id: '1',
    title: 'Transport fare to Abuja',
    timeAgo: '2 days ago',
    status: 'funded',
    amount: 3200,
    categoryId: 'transport',
    icon: 'car-outline',
  },
  {
    id: '2',
    title: 'Utility bill assistance',
    timeAgo: '1 week ago',
    status: 'expired',
    amount: 8000,
    categoryId: 'rent',
    icon: 'home-outline',
  },
  {
    id: '3',
    title: 'Medical check-up',
    timeAgo: '2 weeks ago',
    status: 'active',
    amount: 12000,
    categoryId: 'health',
    icon: 'medical-outline',
  },
  {
    id: '4',
    title: 'Just need Help',
    timeAgo: '2 weeks ago',
    status: 'cancelled',
    amount: 2000,
    categoryId: 'help',
    icon: 'heart-outline',
  },
];

export const MOCK_ACTIVITY_SUMMARY = {
  total: 4,
  funded: 1,
  active: 1,
} as const;

/** UI row for Activity → Giving (API-backed or mock). */
export type GivingContribution = {
  id: string;
  requestId: string;
  recipientName: string;
  recipientInitial: string;
  recipientColor: string;
  description: string;
  amount: number;
  timeAgo: string;
  categoryId: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export const MOCK_GIVING_CONTRIBUTIONS: GivingContribution[] = [
  {
    id: 'g1',
    requestId: '1',
    recipientName: 'Morgan K',
    recipientInitial: 'M',
    recipientColor: '#93C5FD',
    description: 'Utility bill assistance',
    amount: 5000,
    timeAgo: '2 hours ago',
    categoryId: 'rent',
    icon: 'home-outline',
  },
  {
    id: 'g2',
    requestId: '2',
    recipientName: 'Taylor K.',
    recipientInitial: 'T',
    recipientColor: '#F59E0B',
    description: 'Food Support',
    amount: 4000,
    timeAgo: '2 days ago',
    categoryId: 'food',
    icon: 'cart-outline',
  },
  {
    id: 'g3',
    requestId: '3',
    recipientName: 'Adaeze O',
    recipientInitial: 'A',
    recipientColor: '#86EFAC',
    description: 'Transport fare to work',
    amount: 3000,
    timeAgo: '5 days ago',
    categoryId: 'transport',
    icon: 'car-outline',
  },
  {
    id: 'g4',
    requestId: '4',
    recipientName: 'Chidi E.',
    recipientInitial: 'C',
    recipientColor: '#E9D5FF',
    description: 'Medical Expenses',
    amount: 8000,
    timeAgo: '8 days ago',
    categoryId: 'health',
    icon: 'medical-outline',
  },
];

export const MOCK_GIVING_SUMMARY = {
  totalGiven: 45000,
  peopleHelped: 12,
  thisMonth: 28000,
  avgGift: 3791,
} as const;

export const MOCK_COMMUNITY_STORIES = [
  {
    id: 's1',
    text: "When my car broke down unexpectedly, I didn't know how I'd get to work. Within 24 hours, the Plz community helped me cover the cost of repairs.",
    authorName: 'Sarah M',
    authorInitial: 'S',
    authorColor: '#2E8BEA',
    amountReceived: 18000,
    role: 'Receiver' as const,
  },
  {
    id: 's2',
    text: "I was struggling to pay my rent after losing my job. The support I received gave me hope and time to find something new. Forever grateful.",
    authorName: 'James O.',
    authorInitial: 'J',
    authorColor: '#059669',
    amountReceived: 25000,
    role: 'Receiver' as const,
  },
  {
    id: 's3',
    text: "Helping others through Plz has been incredibly rewarding. Knowing my contribution made a real difference in someone's life keeps me coming back.",
    authorName: 'Amina K',
    authorInitial: 'A',
    authorColor: '#7C3AED',
    amountReceived: 0,
    role: 'Giver' as const,
  },
  {
    id: 's4',
    text: "Medical bills were piling up and I didn't know where to turn. The community stepped in and helped me get back on my feet. Thank you!",
    authorName: 'David E.',
    authorInitial: 'D',
    authorColor: '#EA580C',
    amountReceived: 15000,
    role: 'Receiver' as const,
  },
] as const;

export type CommunityStory = (typeof MOCK_COMMUNITY_STORIES)[number];
