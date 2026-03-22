import { apiUrl } from '@/constants/api';
import { REQUEST_CATEGORIES } from '@/constants/categories';
import { avatarColorFromSeed } from '@/contexts/CurrentUserContext';
import type { ActivityRequest, ActivityRequestStatus } from '@/mock/activity';
import type { BrowseRequest, TrendingRequest } from '@/mock/home';
import type { RequestDetail } from '@/mock/requests';

import Ionicons from '@expo/vector-icons/Ionicons';

import { PlizApiError } from './types';

/** Category enum expected by POST /api/begs (express-validator). */
export type BegApiCategory =
  | 'food'
  | 'transport'
  | 'rent'
  | 'medical'
  | 'education'
  | 'emergency'
  | 'other';

export type CreateBegBody = {
  title: string;
  description: string;
  category: BegApiCategory;
  amountRequested: number;
  mediaType?: 'video' | 'audio' | 'text';
  mediaUrl?: string;
};

export type CreatedBeg = {
  id: string;
  title: string;
  description: string | null;
  categoryId: string;
  amountRequested: number;
  amountRaised: number;
  status: string;
  approved: boolean;
  mediaType: string | null;
  mediaUrl: string | null;
  expiresAt: string;
  createdAt: string;
};

/** Map Ask-for-help UI category ids to API category names (DB slug names). */
const UI_CATEGORY_TO_API: Record<string, BegApiCategory> = {
  food: 'food',
  health: 'medical',
  rent: 'rent',
  family: 'emergency',
  education: 'education',
  transport: 'transport',
  work: 'other',
  help: 'other',
};

export function uiCategoryToApiCategory(uiCategoryId: string): BegApiCategory {
  return UI_CATEGORY_TO_API[uiCategoryId] ?? 'other';
}

/** Backend BegService enforces title ≤ 25 characters. */
export function normalizeBegTitleForApi(title: string): string {
  const t = title.trim().replace(/\s+/g, ' ');
  return t.slice(0, 25);
}

/** Backend: max 30 words, 500 characters. */
export function clampBegDescriptionForApi(description: string): string {
  const trimmed = description.trim().replace(/\s+/g, ' ');
  const words = trimmed.split(' ').filter(Boolean).slice(0, 30);
  const joined = words.join(' ');
  return joined.length > 500 ? joined.slice(0, 500) : joined;
}

/**
 * POST /api/begs — create a beg (Bearer required, profile must be complete).
 */
export async function createBeg(
  accessToken: string,
  body: CreateBegBody
): Promise<{ beg: CreatedBeg; message: string }> {
  const res = await fetch(apiUrl('/api/begs'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      title: body.title,
      description: body.description,
      category: body.category,
      amountRequested: body.amountRequested,
      mediaType: body.mediaType ?? 'text',
      ...(body.mediaUrl ? { mediaUrl: body.mediaUrl } : {}),
    }),
  });

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new PlizApiError('Invalid response from server', res.status);
  }

  const data = json as {
    success?: boolean;
    message?: string;
    errors?: { field: string; message: string }[];
    data?: { beg: CreatedBeg };
  };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(
      data.message ?? `Request failed (${res.status})`,
      res.status,
      Array.isArray(data.errors) ? data.errors : []
    );
  }

  if (!data.data?.beg) {
    throw new PlizApiError('Unexpected response shape', res.status);
  }

  return { beg: data.data.beg, message: data.message ?? 'Beg created' };
}

/** Single item from GET /api/begs feed (matches backend IBegResponse JSON). */
export type BegFeedItem = {
  id: string;
  userId: string;
  username?: string;
  displayName?: string;
  isAnonymous?: boolean;
  firstName?: string;
  lastName?: string;
  title: string;
  description: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  };
  amountRequested: number;
  amountRaised: number;
  percentFunded?: number;
  status: string;
  approved: boolean;
  expiresAt: string;
  createdAt: string;
  timeRemaining?: string;
};

export type GetBegsFeedResult = {
  begs: BegFeedItem[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

/**
 * Map API category slug to Ask-for-help UI category id (for icons / filters).
 */
export function apiCategorySlugToUiCategoryId(slug: string): string {
  const map: Record<string, string> = {
    food: 'food',
    transport: 'transport',
    rent: 'rent',
    medical: 'health',
    education: 'education',
    emergency: 'family',
    other: 'help',
  };
  return map[slug] ?? 'help';
}

/**
 * GET /api/begs — public active feed (optional category filter).
 */
export async function getBegsFeed(options?: {
  page?: number;
  limit?: number;
  category?: BegApiCategory;
}): Promise<GetBegsFeedResult> {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 50;
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (options?.category) {
    params.set('category', options.category);
  }

  const res = await fetch(`${apiUrl('/api/begs')}?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new PlizApiError('Invalid response from server', res.status);
  }

  const data = json as {
    success?: boolean;
    message?: string;
    data?: {
      begs: BegFeedItem[];
      pagination?: { page: number; limit: number; total: number; pages: number };
    };
  };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(data.message ?? `Request failed (${res.status})`, res.status);
  }

  const begs = data.data?.begs ?? [];
  const p = data.data?.pagination;
  return {
    begs,
    pagination: {
      page: p?.page ?? page,
      limit: p?.limit ?? limit,
      total: p?.total ?? begs.length,
      pages: p?.pages ?? 1,
    },
  };
}

/**
 * GET /api/begs/my-begs — current user's requests (Bearer required).
 */
export async function getMyBegs(
  accessToken: string,
  options?: { page?: number; limit?: number }
): Promise<GetBegsFeedResult> {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 50;
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));

  const res = await fetch(`${apiUrl('/api/begs/my-begs')}?${params.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new PlizApiError('Invalid response from server', res.status);
  }

  const data = json as {
    success?: boolean;
    message?: string;
    data?: {
      begs: BegFeedItem[];
      pagination?: { page: number; limit: number; total: number; pages: number };
    };
  };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(data.message ?? `Request failed (${res.status})`, res.status);
  }

  const begs = data.data?.begs ?? [];
  const p = data.data?.pagination;
  return {
    begs,
    pagination: {
      page: p?.page ?? page,
      limit: p?.limit ?? limit,
      total: p?.total ?? begs.length,
      pages: p?.pages ?? 1,
    },
  };
}

function mapBegStatusToActivityStatus(beg: BegFeedItem): ActivityRequestStatus {
  const s = beg.status;
  if (s === 'funded') return 'funded';
  if (s === 'cancelled') return 'cancelled';
  if (s === 'expired') return 'expired';
  if (s === 'rejected') return 'cancelled';
  if (s === 'flagged') return 'active';

  const goal = Math.round(Number(beg.amountRequested) || 0);
  const raised = Math.round(Number(beg.amountRaised) || 0);
  if (goal > 0 && raised >= goal) return 'funded';
  if (beg.timeRemaining === 'Expired') return 'expired';

  return 'active';
}

/**
 * After a donation, use Activity “past request” overlay instead of the live request screen
 * when the beg is no longer active (fully funded, expired, cancelled, etc.).
 */
export function isBegPastOrClosedForDonorNav(beg: BegFeedItem): boolean {
  return mapBegStatusToActivityStatus(beg) !== 'active';
}

function categoryIconForBeg(beg: BegFeedItem): keyof typeof Ionicons.glyphMap {
  const uiId = apiCategorySlugToUiCategoryId(beg.category.slug);
  const cat = REQUEST_CATEGORIES.find((c) => c.id === uiId);
  return (cat?.icon ?? 'help-outline') as keyof typeof Ionicons.glyphMap;
}

/** Map GET /api/begs/my-begs item → Activity “Requests” row. */
export function begFeedItemToActivityRequest(beg: BegFeedItem): ActivityRequest {
  return {
    id: beg.id,
    title: beg.title.trim() || 'Request',
    timeAgo: formatBegCreatedTimeAgo(beg.createdAt),
    status: mapBegStatusToActivityStatus(beg),
    amount: Math.round(Number(beg.amountRequested) || 0),
    categoryId: apiCategorySlugToUiCategoryId(beg.category.slug),
    icon: categoryIconForBeg(beg),
  };
}

export function summarizeActivityRequests(begs: BegFeedItem[]): {
  total: number;
  funded: number;
  active: number;
} {
  const total = begs.length;
  let funded = 0;
  let active = 0;
  for (const b of begs) {
    const uiStatus = mapBegStatusToActivityStatus(b);
    if (uiStatus === 'funded') funded += 1;
    if (uiStatus === 'active') active += 1;
  }
  return { total, funded, active };
}

/** Listing label: "First Last", or fallbacks when profile names are missing. */
export function feedBegListingName(beg: BegFeedItem): string {
  if (beg.isAnonymous) return 'Anonymous';
  const first = beg.firstName?.trim() ?? '';
  const last = beg.lastName?.trim() ?? '';
  const combined = `${first} ${last}`.trim();
  if (combined) return combined;
  const legacy = (beg.displayName?.trim() || beg.username?.trim() || '').trim();
  return legacy || 'Member';
}

/** Avatar letter: first character of first name only; otherwise first char of fallback name. */
export function feedBegAvatarLetter(beg: BegFeedItem): string {
  if (beg.isAnonymous) return '?';
  const first = beg.firstName?.trim();
  if (first && first.length > 0) {
    return first[0]!.toUpperCase();
  }
  const fallback = feedBegListingName(beg);
  const ch = fallback.trim()[0];
  return ch ? ch.toUpperCase() : '?';
}

/** Map feed API item to browse card model. */
export function feedBegToBrowseRequest(beg: BegFeedItem): BrowseRequest {
  const name = feedBegListingName(beg);
  const initial = feedBegAvatarLetter(beg);
  const tr = beg.timeRemaining ?? '—';
  const timeLeft = tr === 'Expired' ? 'Expired' : `${tr} left`;
  const text =
    beg.description?.trim() ||
    beg.title.trim() ||
    'Request';

  const raised = Math.round(Number(beg.amountRaised) || 0);
  const goal = Math.round(Number(beg.amountRequested) || 0);
  const pct =
    beg.percentFunded ??
    (goal > 0 ? Math.round((raised / goal) * 100) : 0);

  return {
    id: beg.id,
    name,
    initial,
    avatarColor: avatarColorFromSeed(beg.userId || beg.id),
    timeLeft,
    categoryId: apiCategorySlugToUiCategoryId(beg.category.slug),
    categoryLabel: beg.category.name,
    text,
    raised,
    goal,
    percent: Math.min(100, Math.max(0, pct)),
    createdAt: beg.createdAt,
    expiresAt: beg.expiresAt,
  };
}

/** Relative time label for dashboard (e.g. "2h ago"). */
export function formatBegCreatedTimeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'Recently';
  const diffMs = Math.max(0, Date.now() - then);
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

/** Map feed item → home trending card. */
export function feedBegToTrendingRequest(beg: BegFeedItem): TrendingRequest {
  const name = feedBegListingName(beg);
  const initial = feedBegAvatarLetter(beg);
  const raised = Math.round(Number(beg.amountRaised) || 0);
  const goal = Math.round(Number(beg.amountRequested) || 0);
  const pct =
    beg.percentFunded ??
    (goal > 0 ? Math.round((raised / goal) * 100) : 0);
  const text =
    beg.description?.trim() ||
    beg.title.trim() ||
    'Request';

  return {
    id: beg.id,
    name,
    initial,
    avatarColor: avatarColorFromSeed(beg.userId || beg.id),
    timeAgo: formatBegCreatedTimeAgo(beg.createdAt),
    text,
    raised,
    goal,
    percent: Math.min(100, Math.max(0, pct)),
    createdAt: beg.createdAt,
  };
}

const TRENDING_SOURCE_LIMIT = 40;
const DEFAULT_TRENDING_COUNT = 5;

/**
 * Load trending begs for the home dashboard: GET /api/begs, then rank by
 * funding % (then amount raised, then recency).
 */
export async function getTrendingBegs(
  displayLimit = DEFAULT_TRENDING_COUNT
): Promise<TrendingRequest[]> {
  const { begs } = await getBegsFeed({
    page: 1,
    limit: TRENDING_SOURCE_LIMIT,
  });
  const mapped = begs.map(feedBegToTrendingRequest);
  mapped.sort((a, b) => {
    if (b.percent !== a.percent) return b.percent - a.percent;
    if (b.raised !== a.raised) return b.raised - a.raised;
    const ac = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bc = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bc - ac;
  });
  return mapped.slice(0, displayLimit);
}

/**
 * GET /api/begs/:id — public beg detail (same shape as feed items).
 */
export async function getBegById(begId: string): Promise<BegFeedItem> {
  const res = await fetch(apiUrl(`/api/begs/${encodeURIComponent(begId)}`), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new PlizApiError('Invalid response from server', res.status);
  }

  const data = json as {
    success?: boolean;
    message?: string;
    data?: { beg: BegFeedItem };
  };

  if (!res.ok || data.success !== true || !data.data?.beg) {
    throw new PlizApiError(
      data.message ??
        (res.status === 404 ? 'Request not found' : `Request failed (${res.status})`),
      res.status
    );
  }

  return data.data.beg;
}

/** Map API beg → request detail screen model (engagement counts are placeholders until API exists). */
export function begFeedItemToRequestDetail(beg: BegFeedItem): RequestDetail {
  const name = feedBegListingName(beg);
  const initial = feedBegAvatarLetter(beg);
  const raised = Math.round(Number(beg.amountRaised) || 0);
  const goal = Math.round(Number(beg.amountRequested) || 0);
  const pct =
    beg.percentFunded ??
    (goal > 0 ? Math.round((raised / goal) * 100) : 0);
  const text =
    beg.description?.trim() ||
    beg.title.trim() ||
    'Request';

  const titleLine = beg.title?.trim() ?? '';
  const descLine = beg.description?.trim() ?? '';
  let fullDescription: string;
  if (descLine && titleLine && descLine !== titleLine) {
    fullDescription = `${titleLine}\n\n${descLine}`;
  } else {
    fullDescription = descLine || titleLine || 'No details provided.';
  }

  const tr = beg.timeRemaining ?? '—';
  const timeRemaining = tr === 'Expired' ? 'Expired' : `${tr} left`;

  return {
    id: beg.id,
    name,
    initial,
    avatarColor: avatarColorFromSeed(beg.userId || beg.id),
    timeLeft: timeRemaining,
    categoryId: apiCategorySlugToUiCategoryId(beg.category.slug),
    categoryLabel: beg.category.name,
    text,
    raised,
    goal,
    percent: Math.min(100, Math.max(0, pct)),
    createdAt: beg.createdAt,
    expiresAt: beg.expiresAt,
    fullDescription,
    timeAgo: formatBegCreatedTimeAgo(beg.createdAt),
    timeRemaining,
    thumbsUp: 0,
    hearts: 0,
    gifts: 0,
    crowns: 0,
    messages: 0,
  };
}
