import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_KEY = 'pliz_access_token';
const REFRESH_KEY = 'pliz_refresh_token';

/** In-memory only on web — avoids localStorage; tokens are lost on refresh (use httpOnly cookies in production web). */
let webAccessToken: string | null = null;
let webRefreshToken: string | null = null;

export async function getAccessToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return webAccessToken;
  }
  try {
    return await SecureStore.getItemAsync(ACCESS_KEY);
  } catch {
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return webRefreshToken;
  }
  try {
    return await SecureStore.getItemAsync(REFRESH_KEY);
  } catch {
    return null;
  }
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  if (Platform.OS === 'web') {
    webAccessToken = accessToken;
    webRefreshToken = refreshToken;
    return;
  }
  await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
}

export async function clearTokens(): Promise<void> {
  if (Platform.OS === 'web') {
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
