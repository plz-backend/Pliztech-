import { apiUrl } from '@/constants/api';

import {
  type CompleteProfileBody,
  type CompletedProfile,
  type UpdateProfileBody,
  type UpdatedProfilePayload,
  PlizApiError,
} from './types';

/**
 * POST /api/auth/profile/complete — requires verified email + Bearer access token.
 */
export async function completeProfile(
  accessToken: string,
  body: CompleteProfileBody
): Promise<{ profile: CompletedProfile }> {
  const payload: Record<string, unknown> = {
    firstName: body.firstName.trim(),
    lastName: body.lastName.trim(),
    phoneNumber: body.phoneNumber.trim(),
    agreeToTerms: body.agreeToTerms,
    isAnonymous: body.isAnonymous ?? false,
  };

  const middle = body.middleName?.trim();
  if (middle) {
    payload.middleName = middle;
  }

  const display = body.displayName?.trim();
  if (display) {
    payload.displayName = display;
  }

  const res = await fetch(apiUrl('/api/auth/profile/complete'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
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
    data?: { profile: CompletedProfile };
  };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(
      data.message ?? `Request failed (${res.status})`,
      res.status,
      Array.isArray(data.errors) ? data.errors : []
    );
  }

  if (!data.data?.profile) {
    throw new PlizApiError('Unexpected response shape', res.status);
  }

  return data.data;
}

/**
 * PUT /api/auth/profile — update name / phone (Bearer required).
 */
export async function updateProfile(
  accessToken: string,
  body: UpdateProfileBody
): Promise<{ profile: UpdatedProfilePayload }> {
  const res = await fetch(apiUrl('/api/auth/profile'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
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
    data?: { profile: UpdatedProfilePayload };
  };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(
      data.message ?? `Request failed (${res.status})`,
      res.status,
      Array.isArray(data.errors) ? data.errors : []
    );
  }

  if (!data.data?.profile) {
    throw new PlizApiError('Unexpected response shape', res.status);
  }

  return data.data;
}
