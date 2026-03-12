import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import {
  CTA_BLUE,
  CTA_COLORS,
  CTA_GRADIENT,
  CTA_TRANSPARENT,
  CTA_WHITE,
} from '@/constants/cta-buttons';

export type CTAButtonVariant = 'gradient' | 'white' | 'transparent' | 'blue';

export interface CTAButtonProps {
  label: string;
  onPress: () => void;
  variant?: CTAButtonVariant;
  accessibilityLabel?: string;
  disabled?: boolean;
}

export function CTAButton({
  label,
  onPress,
  variant = 'gradient',
  accessibilityLabel = label,
  disabled = false,
}: CTAButtonProps) {
  const content = (
    <Text
      style={[
        styles.label,
        variant === 'gradient' && styles.labelWhite,
        variant === 'white' && styles.labelBlue,
        variant === 'transparent' && styles.labelBlue,
        variant === 'blue' && styles.labelWhite,
      ]}
    >
      {label}
    </Text>
  );

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'gradient' && styles.buttonGradient,
        variant === 'white' && styles.buttonWhite,
        variant === 'transparent' && styles.buttonTransparent,
        variant === 'blue' && styles.buttonBlue,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
    >
      {variant === 'gradient' && (
        <LinearGradient
          colors={[...CTA_GRADIENT.gradientColors]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.inner}>{content}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    maxWidth: CTA_GRADIENT.width,
    height: CTA_GRADIENT.height,
    borderRadius: CTA_GRADIENT.borderRadius,
    overflow: 'hidden',
    paddingVertical: CTA_GRADIENT.paddingVertical,
    paddingHorizontal: CTA_GRADIENT.paddingHorizontal,
  },
  buttonGradient: {
    // LinearGradient provides background
  },
  buttonWhite: {
    backgroundColor: CTA_WHITE.backgroundColor,
  },
  buttonTransparent: {
    backgroundColor: 'transparent',
    borderWidth: CTA_TRANSPARENT.borderWidth,
    borderColor: CTA_COLORS.blueStart, // gradient border approximated
  },
  buttonBlue: {
    backgroundColor: CTA_BLUE.backgroundColor,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
  },
  labelWhite: {
    color: CTA_COLORS.white,
  },
  labelBlue: {
    color: CTA_COLORS.blueStart,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
});
