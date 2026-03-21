import { API_BASE_URL, apiUrl } from '@/constants/api';

import { PlizApiError } from './types';

/** Must match POST /api/donations/initialize validation. */
export type DonationPaymentMethod = 'card' | 'transfer' | 'ussd' | 'bank';

export type InitializeDonationBody = {
  begId: string;
  amount: number;
  /** Backend accepts card | transfer | ussd (`bank` is normalized to transfer). */
  paymentMethod: DonationPaymentMethod;
  isAnonymous?: boolean;
  /** Optional note to the recipient (if API supports it). */
  message?: string;
  savedCardId?: string;
};

/** API only allows card, transfer, ussd — not `bank`. */
function toApiPaymentMethod(
  m: DonationPaymentMethod
): 'card' | 'transfer' | 'ussd' {
  if (m === 'bank') return 'transfer';
  return m;
}

export type InitializeDonationCheckoutResult = {
  kind: 'checkout';
  donationId: string;
  amount: number;
  paymentReference: string;
  paymentUrl: string;
  quickAmounts?: number[];
};

export type InitializeDonationSavedCardResult = {
  kind: 'saved_card';
  donationId: string;
  amount: number;
  paymentReference: string;
  status?: string;
};

export type InitializeDonationResult =
  | InitializeDonationCheckoutResult
  | InitializeDonationSavedCardResult;

/** GET /api/donations/verify — confirm payment after Paystack redirect to /payment/callback */
export type VerifyDonationApiResult = {
  success: boolean;
  message: string;
  data?: {
    begId?: string;
    amount?: number;
    reference?: string;
    status?: string;
  };
};

/**
 * Calls backend to verify a Paystack transaction by reference (server runs Paystack verify + donation processing).
 * No auth header — route must be public on the API.
 */
export async function verifyDonationByReference(
  reference: string
): Promise<VerifyDonationApiResult> {
  const trimmed = reference.trim();
  if (!trimmed) {
    return { success: false, message: 'Missing payment reference.' };
  }

  const params = new URLSearchParams();
  params.set('reference', trimmed);

  let res: Response;
  try {
    res = await fetch(apiUrl(`/api/donations/verify?${params.toString()}`), {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
  } catch (err) {
    const hint = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Network error: ${hint}\n\nAPI: ${API_BASE_URL}`,
    };
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return {
      success: false,
      message: 'Invalid response from server.',
    };
  }

  const body = json as VerifyDonationApiResult;
  if (typeof body.success === 'boolean' && typeof body.message === 'string') {
    return body;
  }

  return {
    success: false,
    message: body.message ?? `Request failed (${res.status})`,
    data: body.data,
  };
}

/**
 * POST /api/donations/initialize — Paystack checkout URL or saved-card charge.
 */
export async function initializeDonation(
  accessToken: string,
  body: InitializeDonationBody
): Promise<InitializeDonationResult> {
  const url = apiUrl('/api/donations/initialize');

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        begId: body.begId,
        amount: body.amount,
        paymentMethod: toApiPaymentMethod(body.paymentMethod),
        isAnonymous: body.isAnonymous ?? false,
        ...(body.message != null && body.message !== ''
          ? { message: body.message }
          : {}),
        ...(body.savedCardId ? { savedCardId: body.savedCardId } : {}),
      }),
    });
  } catch (err) {
    const hint =
      err instanceof Error ? err.message : String(err);
    throw new PlizApiError(
      `Network error: ${hint}\n\nAPI: ${API_BASE_URL}\n(Expo Web needs CORS on the API for this origin. Restart Expo after changing .env.)`,
      0
    );
  }

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
    data?: ApiDonationInitializeData;
  };

  if (!res.ok || data.success !== true) {
    throw new PlizApiError(
      data.message ?? `Request failed (${res.status})`,
      res.status,
      Array.isArray(data.errors) ? data.errors : []
    );
  }

  const d = data.data;
  if (!d) {
    throw new PlizApiError('Unexpected response shape', res.status);
  }

  const amountNum =
    typeof d.amount === 'number'
      ? d.amount
      : Number((d as { amount?: unknown }).amount);
  if (!Number.isFinite(amountNum)) {
    throw new PlizApiError('Unexpected response shape', res.status);
  }

  const paymentUrl = pickCheckoutUrl(d);
  const paymentReference = pickPaymentReference(d);
  const donationId = pickDonationId(d);

  if (paymentUrl) {
    return {
      kind: 'checkout',
      donationId: donationId || paymentReference,
      amount: amountNum,
      paymentReference: paymentReference || 'pending',
      paymentUrl,
      quickAmounts: d.quick_amounts ?? d.quickAmounts,
    };
  }

  if (!paymentReference) {
    throw new PlizApiError('Unexpected response shape', res.status);
  }

  return {
    kind: 'saved_card',
    donationId: donationId || paymentReference,
    amount: amountNum,
    paymentReference,
    status: d.status ?? d.payment_method ?? d.paymentMethod,
  };
}

/** Supports snake_case (current backend) and camelCase (docs / serializers). */
type ApiDonationInitializeData = {
  amount: number;
  donation_id?: string;
  donationId?: string;
  payment_reference?: string;
  paymentReference?: string;
  reference?: string;
  payment_url?: string;
  paymentUrl?: string;
  authorizationUrl?: string;
  payment_method?: string;
  paymentMethod?: string;
  status?: string;
  quick_amounts?: number[];
  quickAmounts?: number[];
};

function pickCheckoutUrl(d: ApiDonationInitializeData): string | undefined {
  const url =
    d.payment_url ?? d.paymentUrl ?? d.authorizationUrl ?? undefined;
  return typeof url === 'string' && url.length > 0 ? url : undefined;
}

function pickPaymentReference(d: ApiDonationInitializeData): string {
  const ref =
    d.payment_reference ?? d.paymentReference ?? d.reference ?? '';
  return typeof ref === 'string' ? ref : '';
}

function pickDonationId(d: ApiDonationInitializeData): string {
  const id = d.donation_id ?? d.donationId ?? '';
  return typeof id === 'string' ? id : '';
}
