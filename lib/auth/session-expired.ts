import { router, type Href } from 'expo-router';

import { PlizApiError } from '@/lib/api/types';

const LOGIN_SESSION_EXPIRED = '/(auth)/login?session=expired' as Href;

/** True when the API rejected the Bearer token (expired, invalid, or revoked). */
export function isUnauthorizedSessionError(error: unknown): boolean {
  return error instanceof PlizApiError && error.status === 401;
}

/**
 * Clears the local session (via `signOut` from `CurrentUserProvider`) and opens the login screen
 * with a query flag so we can show a session-expired notice.
 */
export async function logoutAndGoToLogin(signOut: () => Promise<void>): Promise<void> {
  await signOut();
  router.replace(LOGIN_SESSION_EXPIRED);
}
