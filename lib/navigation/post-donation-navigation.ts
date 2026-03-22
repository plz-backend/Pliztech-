import { router, type Href } from 'expo-router';

import { getBegById, isBegPastOrClosedForDonorNav } from '@/lib/api/beg';

const SESSION_KEY = 'pliz_open_past_overlay_beg_id';

function stashBegIdForActivityOverlay(begId: string): void {
  try {
    if (typeof globalThis !== 'undefined' && 'sessionStorage' in globalThis) {
      globalThis.sessionStorage.setItem(SESSION_KEY, begId);
    }
  } catch {
    /* ignore */
  }
}

/**
 * Open a beg in the right place:
 * - **Activity** + past-request overlay when the beg is no longer active (funded, expired, cancelled…)
 * - **Request detail** when it is still active
 *
 * Used after Paystack `/payment/callback`, notification taps, etc.
 * Falls back to request detail if the beg cannot be loaded.
 */
export async function navigateToBegDetailOrPastOverlay(
  begId: string,
  options?: { replace?: boolean }
): Promise<void> {
  const id = begId.trim();
  const nav = options?.replace ? router.replace : router.push;

  if (!id) {
    router.replace('/(tabs)/(main)' as Href);
    return;
  }

  try {
    const beg = await getBegById(id);
    if (isBegPastOrClosedForDonorNav(beg)) {
      stashBegIdForActivityOverlay(id);
      nav({
        pathname: '/(tabs)/(main)/activity',
        params: { openPastBeg: id },
      } as Href);
      return;
    }
  } catch {
    /* fall through to request detail */
  }

  nav({
    pathname: '/(tabs)/request/[id]',
    params: { id },
  } as Href);
}

/**
 * Activity screen: read beg id stashed for web session (survives full navigation to tabs).
 */
export function consumeStashedPastOverlayBegId(): string | null {
  try {
    if (typeof globalThis !== 'undefined' && 'sessionStorage' in globalThis) {
      const v = globalThis.sessionStorage.getItem(SESSION_KEY);
      globalThis.sessionStorage.removeItem(SESSION_KEY);
      const t = v?.trim();
      return t || null;
    }
  } catch {
    /* ignore */
  }
  return null;
}
