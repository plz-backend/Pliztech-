import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { clearTokens } from '@/lib/auth/access-token';

/**
 * Performs sign-out then redirects to welcome. Open via router from Profile (or elsewhere).
 */
export default function LogoutScreen() {
  const { refreshUser } = useCurrentUser();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await clearTokens();
      if (!cancelled) {
        router.replace('/(public)/welcome' as import('expo-router').Href);
      }
      void refreshUser();
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container} accessibilityLabel="Signing out">
      <ActivityIndicator size="large" color="#2E8BEA" />
      <Text style={styles.label}>Signing out…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  label: {
    marginTop: 16,
    fontSize: 15,
    color: '#6B7280',
  },
});
