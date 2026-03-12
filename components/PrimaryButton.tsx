import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

const HEIGHT = 56;
const BORDER_RADIUS = 999;

const GRADIENT_COLORS = ['#1a5a9e', '#2E8BEA'] as const; // darker left → lighter right
const DEFAULT_SOLID_BG = '#E07A5F'; // coral/salmon

export type PrimaryButtonVariant = 'gradient' | 'solid';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  /** 'gradient' = blue gradient (default), 'solid' = solid fill */
  variant?: PrimaryButtonVariant;
  /** When variant="solid", background color (default: coral). Ignored when variant="gradient". */
  backgroundColor?: string;
  /** When true, button is not clickable and appears disabled */
  disabled?: boolean;
  /** Optional icon to show on the right of the label */
  rightIcon?: keyof typeof Ionicons.glyphMap;
}

export function PrimaryButton({
  label,
  onPress,
  accessibilityLabel = label,
  variant = 'gradient',
  backgroundColor = DEFAULT_SOLID_BG,
  disabled = false,
  rightIcon,
}: PrimaryButtonProps) {
  const isSolid = variant === 'solid';

  const content = (
    <>
      <Text style={styles.label}>{label}</Text>
      {rightIcon && (
        <Ionicons name={rightIcon} size={20} color="#FFFFFF" style={styles.rightIcon} />
      )}
    </>
  );

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
    >
      {isSolid ? (
        <View style={[styles.gradient, { backgroundColor }]}>{content}</View>
      ) : (
        <LinearGradient
          colors={[...GRADIENT_COLORS]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: HEIGHT,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  rightIcon: {
    marginLeft: 8,
  },
});
