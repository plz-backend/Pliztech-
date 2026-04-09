import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppHeaderTitleRow } from '@/components/layout/AppHeaderTitleRow';
import { CTAButton } from '@/components/CTAButton';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';

const BORDER_GRAY = '#E5E7EB';
const TITLE_DARK = '#1F2937';
const BODY_GRAY = '#6B7280';
const BRAND_BLUE = '#2E8BEA';
const CHECK_ICON_BG = '#E8F4FD';
const AUTO_REDIRECT_MS = 4500;

function firstParam(value: string | string[] | undefined): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default function ChangePasswordSuccessScreen() {
  const params = useLocalSearchParams<{ message?: string | string[] }>();
  const messageParam = firstParam(params.message);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToSecurity = useCallback(() => {
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
      redirectTimer.current = null;
    }
    router.replace('/(tabs)/security-settings');
  }, []);

  useEffect(() => {
    redirectTimer.current = setTimeout(() => {
      redirectTimer.current = null;
      router.replace('/(tabs)/security-settings');
    }, AUTO_REDIRECT_MS);
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  const detail =
    typeof messageParam === 'string' && messageParam.trim().length > 0
      ? messageParam.trim()
      : 'Your password has been updated. Other sessions have been signed out for your security.';

  return (
    <Screen backgroundColor="#F9FAFB" scrollable>
      <AppHeaderTitleRow
        title="Password changed"
        onPressBack={goToSecurity}
        backIconColor={TITLE_DARK}
      />

      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <Ionicons name="checkmark" size={56} color={BRAND_BLUE} />
        </View>

        <Text style={styles.body}>{detail}</Text>

        <Text style={styles.hint}>Returning to Security Settings in a few seconds…</Text>

        <View style={styles.ctaWrap}>
          <CTAButton
            label="Back to Security Settings"
            onPress={goToSecurity}
            variant="gradient"
            accessibilityLabel="Back to Security Settings"
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: CHECK_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: BODY_GRAY,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 320,
    fontWeight: '500',
  },
  hint: {
    fontSize: 14,
    color: BODY_GRAY,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  ctaWrap: {
    width: '100%',
    alignItems: 'center',
  },
});
