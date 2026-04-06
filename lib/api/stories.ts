import { apiUrl } from '@/constants/api';

import { PlizApiError } from './types';

export type StoryAuthor = {
  username: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  isAnonymous: boolean;
};

export type StoryItem = {
  id: string;
  content: string;
  isApproved: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  user: StoryAuthor;
};

export type StoriesFeedResult = {
  stories: StoryItem[];
  pagination?: { page: number; limit: number; total: number; pages: number };
};

/**
 * GET /api/stories — approved community stories (Bearer).
 */
export async function getStoriesFeed(
  accessToken: string,
  options?: { page?: number; limit?: number }
): Promise<StoriesFeedResult> {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  const res = await fetch(`${apiUrl('/api/stories')}?${params}`, {
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
    data?: { stories?: StoryItem[]; total?: number; pages?: number };
  };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(data.message ?? `Request failed (${res.status})`, res.status);
  }

  const raw = data.data;
  if (!raw?.stories) {
    return { stories: [] };
  }
  return {
    stories: raw.stories,
    pagination: {
      page,
      limit,
      total: raw.total ?? raw.stories.length,
      pages: raw.pages ?? 1,
    },
  };
}

/**
 * POST /api/stories — submit story (max 60 words server-side).
 */
export async function createStory(
  accessToken: string,
  body: { content: string }
): Promise<{ id: string; content: string }> {
  const res = await fetch(apiUrl('/api/stories'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content: body.content }),
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
    data?: { story: { id: string; content: string } };
  };

  if (!res.ok || data.success !== true || !data.data?.story) {
    throw new PlizApiError(data.message ?? `Request failed (${res.status})`, res.status);
  }

  return data.data.story;
}
