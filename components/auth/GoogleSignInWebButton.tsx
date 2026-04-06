import * as Google from 'expo-auth-session/providers/google';
import { useEffect, useRef, useState } from 'react';

import { SocialButton } from '@/components/SocialButton';

export interface GoogleSignInWebButtonProps {
  onIdToken: (idToken: string) => void;
  disabled?: boolean;
}

/**
 * Web-only: obtains Google `id_token` via OpenID implicit flow for POST /api/auth/google.
 * Requires `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (Web client) matching API `GOOGLE_CLIENT_ID`.
 */
export function GoogleSignInWebButton({ onIdToken, disabled }: GoogleSignInWebButtonProps) {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() ?? '';
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId,
  });
  const [busy, setBusy] = useState(false);
  const onIdTokenRef = useRef(onIdToken);
  onIdTokenRef.current = onIdToken;

  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.params.id_token;
      if (token) {
        onIdTokenRef.current(token);
      }
      setBusy(false);
    } else if (response?.type === 'error') {
      setBusy(false);
    } else if (response?.type === 'cancel' || response?.type === 'dismiss') {
      setBusy(false);
    }
  }, [response]);

  if (!webClientId) {
    return null;
  }

  return (
    <SocialButton
      provider="google"
      disabled={disabled || busy || !request}
      onPress={() => {
        setBusy(true);
        void promptAsync();
      }}
    />
  );
}
