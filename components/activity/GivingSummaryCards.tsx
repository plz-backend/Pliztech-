import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

export interface GivingSummaryCardsProps {
  totalGiven: number;
  peopleHelped: number;
  thisMonth: number;
  avgGift: number;
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

const CARDS = [
  {
    key: 'totalGiven' as const,
    icon: 'heart-outline' as keyof typeof Ionicons.glyphMap,
    iconBg: '#BFDBFE',
    iconColor: '#3B82F6',
    cardBg: '#EFF6FF',
    valueColor: '#1F2937',
    labelLight: false,
    getLabel: () => 'Total Given',
  },
  {
    key: 'peopleHelped' as const,
    icon: 'people-outline' as keyof typeof Ionicons.glyphMap,
    iconBg: '#FECACA',
    iconColor: '#DC2626',
    cardBg: '#F87171',
    valueColor: '#FFFFFF',
    labelLight: true,
    getLabel: () => 'People Helped',
  },
  {
    key: 'thisMonth' as const,
    icon: 'calendar-outline' as keyof typeof Ionicons.glyphMap,
    iconBg: '#93C5FD',
    iconColor: '#2563EB',
    cardBg: '#4F46E5',
    valueColor: '#FFFFFF',
    labelLight: true,
    getLabel: () => 'This Month',
  },
  {
    key: 'avgGift' as const,
    icon: 'trending-up-outline' as keyof typeof Ionicons.glyphMap,
    iconBg: '#93C5FD',
    iconColor: '#2563EB',
    cardBg: '#D1FAE5',
    valueColor: '#1F2937',
    labelLight: false,
    getLabel: () => 'Avg. Gift',
  },
] as const;

export function GivingSummaryCards({
  totalGiven,
  peopleHelped,
  thisMonth,
  avgGift,
}: GivingSummaryCardsProps) {
  const values = { totalGiven, peopleHelped, thisMonth, avgGift };

  const formatValue = (key: (typeof CARDS)[number]['key']) => {
    const val = values[key];
    return key === 'peopleHelped' ? String(val) : formatNaira(val);
  };

  return (
    <View style={styles.grid}>
      {CARDS.map((card) => (
        <View
          key={card.key}
          style={[styles.card, { backgroundColor: card.cardBg }]}
        >
          <View style={[styles.iconWrap, { backgroundColor: card.iconBg }]}>
            <Ionicons name={card.icon} size={22} color={card.iconColor} />
          </View>
          <Text
            style={[styles.value, { color: card.valueColor }]}
            numberOfLines={1}
          >
            {formatValue(card.key)}
          </Text>
          <Text
            style={[styles.label, card.labelLight && styles.labelLight]}
          >
            {card.getLabel()}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
  },
  labelLight: {
    color: 'rgba(255,255,255,0.9)',
  },
});
