import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';

export interface AmountChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Merged onto the chip (e.g. `{ flex: 1 }` for a single row). */
  style?: StyleProp<ViewStyle>;
}

export function AmountChip({ label, selected, onPress, style }: AmountChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected, style]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: '100%',
    paddingVertical: 14,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: '#2E8BEA',
    backgroundColor: '#EFF6FF',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  labelSelected: {
    color: '#2E8BEA',
  },
});
