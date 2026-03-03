import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProgressBar } from '@/components/ProgressBar';
import { REQUEST_CATEGORIES } from '@/constants/categories';

import type { BrowseRequest } from '@/mock/home';

const BRAND_BLUE = '#2E8BEA';
const HEADING = '#1F2937';
const BODY = '#6B7280';

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

function getCategoryIcon(categoryId: string) {
  const cat = REQUEST_CATEGORIES.find((c) => c.id === categoryId);
  return cat?.icon ?? 'help-outline';
}

export interface BrowseRequestCardProps {
  request: BrowseRequest;
  onPress: () => void;
}

export function BrowseRequestCard({ request, onPress }: BrowseRequestCardProps) {
  const {
    name,
    initial,
    avatarColor,
    timeLeft,
    categoryId,
    categoryLabel,
    badge,
    text,
    raised,
    goal,
    percent,
  } = request;

  const categoryIcon = getCategoryIcon(categoryId);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Request by ${name}: ${text.slice(0, 50)}...`}
    >
      <View style={styles.topRow}>
        <View style={styles.left}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.nameWrap}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
              {badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.timeLeft}>
          <Ionicons name="time-outline" size={14} color={BODY} />
          <Text style={styles.timeLeftText}>{timeLeft}</Text>
        </View>
      </View>

      <View style={styles.categoryRow}>
        <Ionicons name={categoryIcon as keyof typeof Ionicons.glyphMap} size={16} color={BODY} />
        <Text style={styles.categoryLabel}>{categoryLabel}</Text>
      </View>

      <Text style={styles.text} numberOfLines={3}>
        {text}
      </Text>

      <View style={styles.amountRow}>
        <Text style={styles.amount}>
          <Text style={styles.amountRaised}>{formatNaira(raised)}</Text>
          {' / '}
          {formatNaira(goal)}
        </Text>
        <Text style={styles.percent}>{percent}%</Text>
      </View>

      <ProgressBar percent={percent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  pressed: {
    opacity: 0.95,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nameWrap: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: HEADING,
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    color: BODY,
  },
  timeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  timeLeftText: {
    fontSize: 12,
    color: BODY,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  categoryLabel: {
    fontSize: 13,
    color: BODY,
  },
  text: {
    fontSize: 14,
    color: HEADING,
    lineHeight: 20,
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 14,
    color: BODY,
  },
  amountRaised: {
    fontWeight: '700',
    color: HEADING,
  },
  percent: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_BLUE,
  },
});
