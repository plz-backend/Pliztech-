import * as SecureStore from 'expo-secure-store';

import { isWebAuthEnvironment } from '@/lib/auth/web-auth';

const ACCESS_KEY = 'pliz_access_token';
const REFRESH_KEY = 'pliz_refresh_token';

/**
 * Web: access token in memory only. Refresh token is stored in an httpOnly cookie set by the API
 * (not localStorage / sessionStorage). Survives full page reload; lost when the tab closes unless
 * the cookie expires first.
 */
let webAccessToken: string | null = null;
let webRefreshToken: string | null = null;

export async function getAccessToken(): Promise<string | null> {
  if (isWebAuthEnvironment()) {
    return webAccessToken;
  }
  try {
    return await SecureStore.getItemAsync(ACCESS_KEY);
  } catch {
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  if (isWebAuthEnvironment()) {
    return webRefreshToken;
  }
  try {
    return await SecureStore.getItemAsync(REFRESH_KEY);
  } catch {
    return null;
  }
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  if (isWebAuthEnvironment()) {
    webAccessToken = accessToken;
    webRefreshToken = null;
    return;
  }
  await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
}

export async function clearTokens(): Promise<void> {
  if (isWebAuthEnvironment()) {
    webAccessToken = null;
    webRefreshToken = null;
    return;
  }
  try {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
  } catch {
    /* ignore */
  }
  try {
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  } catch {
    /* ignore */
  }
}
