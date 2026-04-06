import { Platform } from 'react-native';

/**
 * Google ID token for POST /api/auth/google.
 * Configure `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` to match backend `GOOGLE_CLIENT_ID` (Web OAuth client).
 */
export async function signInWithGoogleNative(): Promise<string> {
  if (Platform.OS === 'web') {
    throw new Error('Use the web Google sign-in control on this platform.');
  }

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  if (!webClientId) {
    throw new Error(
      'Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID. It must match the Google OAuth client ID used by the API (GOOGLE_CLIENT_ID).'
    );
  }

  const { GoogleSignin, statusCodes } = await import('@react-native-google-signin/google-signin');

  GoogleSignin.configure({
    webClientId,
    offlineAccess: false,
  });

  if (Platform.OS === 'android') {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  try {
    const result = await GoogleSignin.signIn();
    if (result.type !== 'success') {
      throw new Error('GOOGLE_CANCELLED');
    }

    const idToken = result.data.idToken;
    if (!idToken) {
      throw new Error(
        'Google did not return an ID token. Ensure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID matches your API server configuration.'
      );
    }

    return idToken;
  } catch (e: unknown) {
    if (
      typeof e === 'object' &&
      e !== null &&
      'code' in e &&
      (e as { code: string }).code === statusCodes.SIGN_IN_CANCELLED
    ) {
      throw new Error('GOOGLE_CANCELLED');
    }
    throw e;
  }
}

export function isGoogleSignInConfigured(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim());
}
