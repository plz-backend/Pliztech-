import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

const ACCENT = {
  blueBar: '#2E8BEA',
  blueText: '#1E40AF',
  orangeBar: '#F59E0B',
  orangeText: '#D97706',
  greenBar: '#059669',
  greenText: '#047857',
} as const;

export type WithdrawCardUiStatus =
  | 'withdrawable'
  | 'withdrawn'
  | 'processing'
  | 'success';

export type FundedWithdrawRequestCardProps = {
  emoji: string;
  title: string;
  donorSubtitle: string;
  statusLabel: string;
  amountLabel: string;
  /** 0–1 fill for the bottom accent bar */
  barFillRatio: number;
  barColor: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export function FundedWithdrawRequestCard({
  emoji,
  title,
  donorSubtitle,
  statusLabel,
  amountLabel,
  barFillRatio,
  barColor,
  selected = false,
  disabled = false,
  onPress,
}: FundedWithdrawRequestCardProps) {
  const fillPct = Math.min(100, Math.max(0, barFillRatio * 100));

  const statusColor =
    barColor === ACCENT.orangeBar
      ? ACCENT.orangeText
      : barColor === ACCENT.greenBar
        ? ACCENT.greenText
        : ACCENT.blueText;

  const amountColor =
    barColor === ACCENT.orangeBar
      ? ACCENT.orangeText
      : barColor === ACCENT.greenBar
        ? ACCENT.greenText
        : '#111827';

  const content = (
    <>
      <View style={styles.topRow}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.textCol}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.donorLine} numberOfLines={1}>
            {donorSubtitle}
          </Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        <Text style={[styles.amountText, { color: amountColor }]}>{amountLabel}</Text>
      </View>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${fillPct}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </>
  );

  if (onPress && !disabled) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          selected && styles.cardSelected,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, disabled && styles.cardDisabled, selected && styles.cardSelected]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: '#2E8BEA',
    borderWidth: 2,
  },
  cardDisabled: {
    opacity: 0.92,
  },
  pressed: {
    opacity: 0.92,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
    lineHeight: 34,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    lineHeight: 22,
  },
  donorLine: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '800',
  },
  barTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
