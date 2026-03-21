import { apiUrl } from '@/constants/api';

import {
  type LoginRequestBody,
  type LoginSuccessData,
  type MeUser,
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
 * POST /api/auth/forgot-password — always succeeds with generic message if email is valid format (server may not reveal whether email exists).
 */
export async function requestForgotPassword(email: string): Promise<string> {
  const res = await fetch(apiUrl('/api/auth/forgot-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email: email.trim() }),
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
  };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(
      data.message ?? `Request failed (${res.status})`,
      res.status,
      Array.isArray(data.errors) ? data.errors : []
    );
  }

  return (
    data.message ??
    'If that email exists, a password reset link has been sent.'
  );
}

/** Must match POST /api/auth/reset-password validation (incl. confirmPassword). */
export type ResetPasswordBody = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * POST /api/auth/reset-password — set new password using email link token.
 */
export async function submitPasswordReset(body: ResetPasswordBody): Promise<string> {
  const res = await fetch(apiUrl('/api/auth/reset-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      token: body.token.trim(),
      newPassword: body.newPassword,
      confirmPassword: body.confirmPassword,
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
  };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(
      data.message ?? `Request failed (${res.status})`,
      res.status,
      Array.isArray(data.errors) ? data.errors : []
    );
  }

  return (
    data.message ??
    'Password has been reset successfully. Please login with your new password.'
  );
}

/** Must match POST /api/auth/change-password validation. */
export type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * POST /api/auth/change-password — change password while logged in (Bearer required).
 */
export async function changePassword(
  accessToken: string,
  body: ChangePasswordBody
): Promise<string> {
  const res = await fetch(apiUrl('/api/auth/change-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
      confirmPassword: body.confirmPassword,
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
  };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(
      data.message ?? `Request failed (${res.status})`,
      res.status,
      Array.isArray(data.errors) ? data.errors : []
    );
  }

  return (
    data.message ??
    'Password updated. Please sign in again on other devices if needed.'
  );
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

export type RefreshAccessTokenResult = {
  accessToken: string;
};

/**
 * POST /api/auth/refresh-token — new access JWT (refresh token unchanged).
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<RefreshAccessTokenResult> {
  const res = await fetch(apiUrl('/api/auth/refresh-token'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
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
    data?: { accessToken?: string };
  };

  if (!res.ok || data.success !== true || !data.data?.accessToken) {
    throw new PlizApiError(
      data.message ?? `Request failed (${res.status})`,
      res.status
    );
  }

  return { accessToken: data.data.accessToken };
}

/**
 * GET /api/auth/me — current user + profile (Bearer required).
 */
export async function getMe(accessToken: string): Promise<MeUser> {
  const res = await fetch(apiUrl('/api/auth/me'), {
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
    data?: { user: MeUser };
  };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(
      data.message ?? `Request failed (${res.status})`,
      res.status
    );
  }

  if (!data.data?.user) {
    throw new PlizApiError('Unexpected response shape', res.status);
  }

  return data.data.user;
}
