import { Platform } from 'react-native';

import { refreshAccessToken } from '@/lib/api/auth';

import { getRefreshToken, setTokens } from './access-token';

/** Single in-flight refresh so concurrent 401s share one token rotation. */
let refreshPromise: Promise<boolean> | null = null;

/**
 * Uses stored refresh token to obtain a new access token and persists both.
 * @returns true if a new access token was stored; false if no refresh token or refresh failed.
 */
export function tryRefreshAccessToken(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        const { accessToken } = await refreshAccessToken();
        await setTokens(accessToken, '');
        return true;
      }
      const rt = await getRefreshToken();
      if (!rt?.trim()) {
        return false;
      }
      const { accessToken } = await refreshAccessToken(rt);
      await setTokens(accessToken, rt);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
