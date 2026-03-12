import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { REQUEST_CATEGORIES } from '@/constants/categories';

const HEADING = '#1F2937';
const BODY = '#6B7280';

export type MainFilter = 'all' | 'ending-soon' | 'just-posted';

export interface FilterChipsProps {
  mainFilter: MainFilter;
  onMainFilterChange: (filter: MainFilter) => void;
  categoryFilter: string;
  onCategoryFilterChange: (categoryId: string) => void;
}

const MAIN_FILTERS: { id: MainFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'all', label: 'All Requests', icon: 'list-outline' },
  { id: 'ending-soon', label: 'Ending Soon', icon: 'time-outline' },
  { id: 'just-posted', label: 'Just Posted', icon: 'arrow-up-outline' },
];

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All', icon: null as keyof typeof Ionicons.glyphMap | null },
  ...REQUEST_CATEGORIES.map((cat) => ({
    id: cat.id,
    label: cat.label,
    icon: cat.icon,
  })),
];

export function FilterChips({
  mainFilter,
  onMainFilterChange,
  categoryFilter,
  onCategoryFilterChange,
}: FilterChipsProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.mainRow}>
        {MAIN_FILTERS.map((f) => (
          <Pressable
            key={f.id}
            onPress={() => onMainFilterChange(f.id)}
            style={[
              styles.mainChip,
              mainFilter === f.id && styles.mainChipSelected,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: mainFilter === f.id }}
          >
            {mainFilter === f.id && (
              <Ionicons name={f.icon} size={16} color="#FFFFFF" style={styles.mainChipIcon} />
            )}
            {mainFilter !== f.id && (
              <Ionicons name={f.icon} size={16} color={BODY} style={styles.mainChipIcon} />
            )}
            <Text
              style={[
                styles.mainChipLabel,
                mainFilter === f.id && styles.mainChipLabelSelected,
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {CATEGORY_FILTERS.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => onCategoryFilterChange(c.id)}
            style={[
              styles.categoryChip,
              categoryFilter === c.id && styles.categoryChipSelected,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: categoryFilter === c.id }}
          >
            {c.icon && (
              <Ionicons
                name={c.icon}
                size={14}
                color={categoryFilter === c.id ? HEADING : BODY}
                style={styles.categoryIcon}
              />
            )}
            <Text
              style={[
                styles.categoryLabel,
                categoryFilter === c.id && styles.categoryLabelSelected,
              ]}
            >
              {c.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  mainRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  mainChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  mainChipSelected: {
    backgroundColor: '#1F2937',
  },
  mainChipIcon: {
    marginRight: 6,
  },
  mainChipLabel: {
    fontSize: 13,
    color: HEADING,
    fontWeight: '500',
  },
  mainChipLabelSelected: {
    color: '#FFFFFF',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 24,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  categoryChipSelected: {
    backgroundColor: '#E5E7EB',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 13,
    color: BODY,
  },
  categoryLabelSelected: {
    color: HEADING,
    fontWeight: '500',
  },
});
