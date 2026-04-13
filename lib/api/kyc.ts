import { apiUrl } from '@/constants/api';
import { isWebAuthEnvironment } from '@/lib/auth/web-auth';

import { PlizApiError } from './types';

export type KycVerificationType = 'bvn' | 'nin' | 'passport';
export type KycVerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected';

export type KycVerificationRecord = {
  userId: string;
  verificationType: KycVerificationType | null;
  status: KycVerificationStatus;
  isVerified: boolean;
  phoneVerified: boolean;
  verifiedAt: string | null;
  rejectionReason: string | null;
  attemptCount: number;
  attemptsRemaining: number;
  canRetry: boolean;
  createdAt: string;
  updatedAt: string;
};

export type KycStep = {
  step: number;
  label: string;
  completed: boolean;
  description: string;
};

export type KycUiMessage = {
  title: string;
  body: string;
  buttonLabel: string;
  buttonUrl: string;
};

export type KycStatusPayload = {
  verification: KycVerificationRecord | null;
  phoneNumber: string | null;
  steps: KycStep[];
  attemptsRemaining: number;
  canRetry: boolean;
  ui: KycUiMessage;
};

export type KycSubmitBvnBody = {
  verificationType: 'bvn';
  bvn: string;
};

function authHeaders(accessToken: string): HeadersInit {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
}

/**
 * GET /api/kyc/status
 */
export async function getKycStatus(accessToken: string): Promise<KycStatusPayload> {
  const res = await fetch(apiUrl('/api/kyc/status'), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: isWebAuthEnvironment() ? 'include' : 'omit',
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
    data?: KycStatusPayload;
  };

  if (!res.ok || data.success !== true || !data.data) {
    throw new PlizApiError(data.message ?? `Request failed (${res.status})`, res.status);
  }

  return data.data;
}

/**
 * POST /api/kyc/phone/send-otp
 */
export async function sendKycPhoneOtp(accessToken: string): Promise<void> {
  const res = await fetch(apiUrl('/api/kyc/phone/send-otp'), {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify({}),
    credentials: isWebAuthEnvironment() ? 'include' : 'omit',
  });

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new PlizApiError('Invalid response from server', res.status);
  }

  const data = json as { success?: boolean; message?: string };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(data.message ?? `Request failed (${res.status})`, res.status);
  }
}

/**
 * POST /api/kyc/phone/resend-otp
 */
export async function resendKycPhoneOtp(accessToken: string): Promise<void> {
  const res = await fetch(apiUrl('/api/kyc/phone/resend-otp'), {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify({}),
    credentials: isWebAuthEnvironment() ? 'include' : 'omit',
  });

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new PlizApiError('Invalid response from server', res.status);
  }

  const data = json as { success?: boolean; message?: string };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(data.message ?? `Request failed (${res.status})`, res.status);
  }
}

/**
 * POST /api/kyc/phone/verify-otp
 */
export async function verifyKycPhoneOtp(accessToken: string, otp: string): Promise<void> {
  const res = await fetch(apiUrl('/api/kyc/phone/verify-otp'), {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify({ otp: otp.trim() }),
    credentials: isWebAuthEnvironment() ? 'include' : 'omit',
  });

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new PlizApiError('Invalid response from server', res.status);
  }

  const data = json as { success?: boolean; message?: string };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(data.message ?? `Request failed (${res.status})`, res.status);
  }
}

/**
 * POST /api/kyc/submit — first identity submission
 */
export async function submitKyc(
  accessToken: string,
  body: KycSubmitBvnBody
): Promise<KycVerificationRecord> {
  const res = await fetch(apiUrl('/api/kyc/submit'), {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify(body),
    credentials: isWebAuthEnvironment() ? 'include' : 'omit',
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
    data?: { verification: KycVerificationRecord };
  };

  if (!res.ok || data.success !== true || !data.data?.verification) {
    throw new PlizApiError(data.message ?? `Request failed (${res.status})`, res.status);
  }

  return data.data.verification;
}

/**
 * PUT /api/kyc/update — resubmit after rejection
 */
export async function updateKyc(
  accessToken: string,
  body: KycSubmitBvnBody
): Promise<KycVerificationRecord> {
  const res = await fetch(apiUrl('/api/kyc/update'), {
    method: 'PUT',
    headers: authHeaders(accessToken),
    body: JSON.stringify(body),
    credentials: isWebAuthEnvironment() ? 'include' : 'omit',
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
    data?: { verification: KycVerificationRecord };
  };

  if (!res.ok || data.success !== true || !data.data?.verification) {
    throw new PlizApiError(data.message ?? `Request failed (${res.status})`, res.status);
  }

  return data.data.verification;
}
