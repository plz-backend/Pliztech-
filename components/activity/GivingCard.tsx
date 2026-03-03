import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { GivingContribution } from '@/mock/activity';

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export interface GivingCardProps {
  contribution: GivingContribution;
  onPress: () => void;
}

export function GivingCard({ contribution, onPress }: GivingCardProps) {
  const { recipientName, description, amount, timeAgo } = contribution;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Gave ${formatNaira(amount)} to ${recipientName} for ${description}`}
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
    </Pressable>
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
  pressed: {
    opacity: 0.95,
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
