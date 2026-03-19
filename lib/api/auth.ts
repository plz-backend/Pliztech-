import { apiUrl } from '@/constants/api';

import {
  type LoginRequestBody,
  type LoginSuccessData,
  type SignupRequestBody,
  type SignupSuccessResponse,
  PlizApiError,
} from './types';

/**
 * POST /api/auth/signup — create account (no token returned; verify email then complete profile).
 */
export async function signup(
  body: SignupRequestBody
): Promise<SignupSuccessResponse['data']> {
  const res = await fetch(apiUrl('/api/auth/signup'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new PlizApiError('Invalid response from server', res.status);
  }

  const data = json as { success?: boolean; message?: string; errors?: { field: string; message: string }[]; data?: SignupSuccessResponse['data'] };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(
      data.message ?? `Request failed (${res.status})`,
      res.status,
      Array.isArray(data.errors) ? data.errors : []
    );
  }

  if (!data.data?.user) {
    throw new PlizApiError('Unexpected response shape', res.status);
  }

  return data.data;
}

/**
 * POST /api/auth/login
 */
export async function login(body: LoginRequestBody): Promise<LoginSuccessData> {
  const res = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: body.email.trim(),
      password: body.password,
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
    data?: LoginSuccessData;
  };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(
      data.message ?? `Request failed (${res.status})`,
      res.status,
      Array.isArray(data.errors) ? data.errors : []
    );
  }

  if (!data.data?.accessToken || !data.data?.refreshToken) {
    throw new PlizApiError('Unexpected response shape', res.status);
  }

  return data.data;
}
