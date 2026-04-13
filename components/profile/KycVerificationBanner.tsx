import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

const CARD_BG = '#FFFBF0';
const BORDER = '#F0B429';
const ICON_CIRCLE_BG = '#FEF3C7';
const SHIELD_COLOR = '#EA580C';
const TITLE_COLOR = '#EA580C';
const SUBTITLE_COLOR = '#C2410C';
const CTA_COLOR = '#7C2D12';

export type KycVerificationBannerProps = {
  onPress: () => void;
};

/**
 * Profile CTA to start government ID / KYC verification (warm amber card + shield).
 */
export function KycVerificationBanner({ onPress }: KycVerificationBannerProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Start identity verification"
    >
      <View style={styles.iconCircle}>
        <Ionicons name="shield-outline" size={28} color={SHIELD_COLOR} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>Verify your Identity</Text>
        <Text style={styles.subtitle}>
          Unlock higher request limits and build trust with donors
        </Text>
        <Text style={styles.cta}>
          Start Verification <Text style={styles.ctaArrow}>→</Text>
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.92,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ICON_CIRCLE_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: TITLE_COLOR,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: SUBTITLE_COLOR,
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 10,
  },
  cta: {
    fontSize: 15,
    fontWeight: '700',
    color: CTA_COLOR,
  },
  ctaArrow: {
    fontWeight: '700',
  },
});
