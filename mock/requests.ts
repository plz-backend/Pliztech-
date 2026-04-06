import { MOCK_BROWSE_REQUESTS, MOCK_TRENDING_REQUESTS } from './home';
import type { BrowseRequest, TrendingRequest } from './home';

export interface RequestDetail extends BrowseRequest {
  /** Beg owner — hide donation UI when same as current user */
  ownerUserId?: string;
  fullDescription: string;
  timeAgo: string;
  timeRemaining: string;
  thumbsUp: number;
  hearts: number;
  gifts: number;
  crowns: number;
  messages: number;
}

/** Convert trending request shape to browse-like base for RequestDetail */
function trendingToBase(t: TrendingRequest) {
  return {
    id: t.id,
    name: t.name,
    initial: t.initial,
    avatarColor: t.avatarColor,
    timeLeft: '12h left',
    categoryId: 'health',
    categoryLabel: 'Health & Personal Care',
    badge: undefined as string | undefined,
    text: t.text,
    raised: t.raised,
    goal: t.goal,
    percent: t.percent,
  };
}

const PLATFORM_FEE_PERCENT = 5;

export function getRequestReceives(amount: number): number {
  return Math.round(amount * (1 - PLATFORM_FEE_PERCENT / 100));
}

export function getPlatformFee(amount: number): number {
  return amount - getRequestReceives(amount);
}

const REQUEST_EXTRAS: Record<string, Partial<Omit<RequestDetail, keyof BrowseRequest>>> = {
  '1': {
    fullDescription:
      "Need help with transport fare to get to my new job interview in Ikeja tomorrow morning. I just got called for this opportunity and really need to make it.",
    timeAgo: '2 hours ago',
    timeRemaining: '8h left',
    thumbsUp: 12,
    hearts: 8,
    gifts: 3,
    crowns: 1,
    messages: 2,
  },
  '2': {
    fullDescription:
      "Need assistance with medical bills for my mother's checkup. Every little bit helps. She's been unwell and we need to get her the care she deserves.",
    timeAgo: '5 hours ago',
    timeRemaining: '18h left',
    thumbsUp: 5,
    hearts: 4,
    gifts: 2,
    crowns: 0,
    messages: 1,
  },
  '3': {
    fullDescription:
      "Need help with school fees for my final semester. I'm so close to graduating. This support would mean everything to me and my family.",
    timeAgo: '1 day ago',
    timeRemaining: '36h left',
    thumbsUp: 8,
    hearts: 6,
    gifts: 1,
    crowns: 0,
    messages: 3,
  },
  '4': {
    fullDescription:
      'Struggling to pay rent this month after unexpected expenses. Any support appreciated. I want to keep a roof over my family\'s head.',
    timeAgo: '2 days ago',
    timeRemaining: '52h left',
    thumbsUp: 3,
    hearts: 2,
    gifts: 0,
    crowns: 0,
    messages: 0,
  },
};

const TRENDING_EXTRAS: Record<string, Omit<RequestDetail, keyof BrowseRequest>> = {
  '1': {
    fullDescription:
      "Need help covering unexpected medical bills this month as I have been sick and haven't been able to go to work. Any support would mean the world to me and my family.",
    timeAgo: '2h ago',
    timeRemaining: '12h left',
    thumbsUp: 15,
    hearts: 10,
    gifts: 4,
    crowns: 1,
    messages: 3,
  },
  '2': {
    fullDescription:
      "Struggling to afford groceries for my family this week. Any support would mean the world. We're doing our best to get by.",
    timeAgo: '5h ago',
    timeRemaining: '6h left',
    thumbsUp: 22,
    hearts: 18,
    gifts: 12,
    crowns: 2,
    messages: 5,
  },
  '3': {
    fullDescription:
      "Need assistance with school fees for my children. Every little bit helps. Education is so important for their future.",
    timeAgo: '2h ago',
    timeRemaining: '48h left',
    thumbsUp: 8,
    hearts: 6,
    gifts: 2,
    crowns: 0,
    messages: 2,
  },
};

export function getRequestDetail(id: string): RequestDetail | null {
  const browseBase = MOCK_BROWSE_REQUESTS.find((r) => r.id === id);
  const trendingBase = MOCK_TRENDING_REQUESTS.find((r) => r.id === id);
  const extra = REQUEST_EXTRAS[id];
  const trendingExtra = TRENDING_EXTRAS[id];

  if (browseBase && extra) {
    return { ...browseBase, ...extra } as RequestDetail;
  }
  if (trendingBase && trendingExtra) {
    const base = trendingToBase(trendingBase);
    return { ...base, ...trendingExtra } as RequestDetail;
  }
  return null;
}
