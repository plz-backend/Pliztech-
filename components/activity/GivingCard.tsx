import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/Text';

import type { GivingContribution } from '@/mock/activity';

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export interface GivingCardProps {
  contribution: GivingContribution;
  onPress?: () => void;
}

export function GivingCard({ contribution, onPress }: GivingCardProps) {
  const { requestId, recipientName, description, amount, timeAgo } = contribution;

  return (
    <Link
      href={{ pathname: '/(tabs)/request/[id]', params: { id: requestId } }}
      asChild
      push
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`Gave ${formatNaira(amount)} to ${recipientName} for ${description}`}
        onPress={onPress}
      >
      <View style={styles.statusWrap}>
        <Ionicons name="checkmark" size={20} color="#059669" />
      </View>
      <View style={styles.content}>
        <Text style={styles.recipient} numberOfLines={1}>
          {recipientName}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>{formatNaira(amount)}</Text>
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </View>
    </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 24,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  recipient: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E8BEA',
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 13,
    color: '#6B7280',
  },
});
