import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

const HEIGHT = 56;
const BORDER_RADIUS = 999;
const BORDER_WIDTH = 2;
const BORDER_COLOR = '#4A90E2';

export interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export function SecondaryButton({
  label,
  onPress,
  accessibilityLabel = label,
}: SecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.inner}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: HEIGHT,
    borderRadius: BORDER_RADIUS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: BORDER_COLOR,
    fontSize: 17,
    fontWeight: '600',
  },
});
