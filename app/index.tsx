import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useCurrentUser } from '@/contexts/CurrentUserContext';

/**
 * Web root URL (`/`) reload hits this screen. Wait for session resolve, then:
 * - signed in → main app (skip splash so reload does not dump users to welcome)
 * - signed out → marketing splash → welcome
 */
export default function IndexScreen() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading && !user) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color="#2E8BEA" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/(main)" />;
  }

  return <Redirect href="/splash" />;
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
