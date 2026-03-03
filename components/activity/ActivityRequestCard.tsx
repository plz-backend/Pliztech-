import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ActivityRequest, ActivityRequestStatus } from '@/mock/activity';

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

const STATUS_CONFIG: Record<
  ActivityRequestStatus,
  { bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  funded: { bg: '#059669', text: '#FFFFFF', icon: 'checkmark-circle' },
  active: { bg: '#DBEAFE', text: '#2E8BEA', icon: 'checkmark-circle' },
  expired: { bg: '#FFEDD5', text: '#EA580C', icon: 'time-outline' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626', icon: 'close-circle' },
};

export interface ActivityRequestCardProps {
  request: ActivityRequest;
  onPress: () => void;
}

export function ActivityRequestCard({ request, onPress }: ActivityRequestCardProps) {
  const { title, timeAgo, status, amount, icon } = request;
  const config = STATUS_CONFIG[status];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${status}, ${formatNaira(amount)}`}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color="#6B7280" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </View>
      <View style={styles.right}>
        <View style={[styles.statusChip, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon} size={14} color={config.text} style={styles.statusIcon} />
          <Text style={[styles.statusText, { color: config.text }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
        <Text style={styles.amount}>{formatNaira(amount)}</Text>
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
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 13,
    color: '#6B7280',
  },
  right: {
    alignItems: 'flex-end',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});
