import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

const HEADING = '#1F2937';
const BODY = '#6B7280';
const BRAND_BLUE = '#2E8BEA';

export interface CategoryChipProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  onPress: () => void;
}

export function CategoryChip({ label, icon, selected, onPress }: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <Ionicons
        name={icon}
        size={18}
        color={selected ? BRAND_BLUE : BODY}
        style={styles.icon}
      />
      <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    marginRight: 8,
    minWidth: '47%',
  },
  chipSelected: {
    borderColor: BRAND_BLUE,
    backgroundColor: '#EFF6FF',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    color: HEADING,
    flex: 1,
  },
  labelSelected: {
    color: BRAND_BLUE,
    fontWeight: '600',
  },
});
