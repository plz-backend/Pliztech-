import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import type { RecentContribution } from '@/lib/types/home';

const HEADING = '#1F2937';
const BODY = '#6B7280';
const BRAND_BLUE = '#2E8BEA';
const CHECK_BG = '#D1FAE5';
const CHECK_COLOR = '#059669';

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export interface ContributionCardProps {
  contribution: RecentContribution;
}

export function ContributionCard({ contribution }: ContributionCardProps) {
  const { contributorName, description, amount, timeAgo } = contribution;

  return (
    <View style={styles.card}>
      <View style={styles.checkWrap}>
        <Ionicons name="checkmark" size={18} color={CHECK_COLOR} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{contributorName}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>{formatNaira(amount)}</Text>
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  checkWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CHECK_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: HEADING,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: BODY,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: BRAND_BLUE,
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: BODY,
  },
});
