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
        size={15}
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
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 6,
    marginRight: 6,
    minWidth: '47%',
  },
  chipSelected: {
    borderColor: BRAND_BLUE,
    backgroundColor: '#EFF6FF',
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    color: HEADING,
    flex: 1,
  },
  labelSelected: {
    color: BRAND_BLUE,
    fontWeight: '600',
  },
});
