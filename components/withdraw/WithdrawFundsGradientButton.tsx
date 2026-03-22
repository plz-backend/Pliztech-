import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { Text } from '@/components/Text';

import { WITHDRAW_FUNDS_CTA_GRADIENT } from './withdrawFundsTheme';

export type WithdrawFundsGradientButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
};

export function WithdrawFundsGradientButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  accessibilityLabel = label,
}: WithdrawFundsGradientButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={inactive ? undefined : onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.outer,
        inactive && styles.outerDisabled,
        pressed && !inactive && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: inactive }}
    >
      <LinearGradient
        colors={[...WITHDRAW_FUNDS_CTA_GRADIENT]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.inner}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  outerDisabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.92,
  },
  inner: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
