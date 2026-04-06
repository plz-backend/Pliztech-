import { Platform } from 'react-native';

export type AppleSignInResult = {
  idToken: string;
  firstName?: string;
  lastName?: string;
};

/**
 * Identity token + optional name for POST /api/auth/apple (name only on first authorization).
 */
export async function signInWithApple(): Promise<AppleSignInResult> {
  if (Platform.OS !== 'ios') {
    throw new Error('Apple Sign In is only available on iOS.');
  }

  const AppleAuthentication = await import('expo-apple-authentication');

  const available = await AppleAuthentication.isAvailableAsync();
  if (!available) {
    throw new Error('Apple Sign In is not available on this device.');
  }

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  const idToken = credential.identityToken;
  if (!idToken) {
    throw new Error('Apple did not return an identity token.');
  }

  let firstName: string | undefined;
  let lastName: string | undefined;
  if (credential.fullName) {
    firstName = credential.fullName.givenName ?? undefined;
    lastName = credential.fullName.familyName ?? undefined;
  }

  return { idToken, firstName, lastName };
}
