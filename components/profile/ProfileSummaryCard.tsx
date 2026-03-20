import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export type ProfileSummaryCardProps = {
  fullName: string;
  email: string;
  verified: boolean;
  roleLabel: string;
  avatarColor: string;
  initials: string;
  /** Placeholder until donor/stats API exists */
  given?: number;
  helped?: number;
  requests?: number;
  isLoading?: boolean;
};

export function ProfileSummaryCard({
  fullName,
  email,
  verified,
  roleLabel,
  avatarColor,
  initials,
  given = 0,
  helped = 0,
  requests = 0,
  isLoading = false,
}: ProfileSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          {isLoading && !fullName ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={2}>
              {isLoading && !fullName ? 'Loading…' : fullName}
            </Text>
            {!isLoading && fullName ? <View style={styles.onlineDot} /> : null}
            <View style={styles.roleBadge}>
              <Ionicons name="heart" size={12} color="#FFFFFF" />
              <Text style={styles.roleText}>{roleLabel}</Text>
            </View>
          </View>
          <Text style={styles.email} numberOfLines={1}>
            {isLoading && !email ? '…' : email}
          </Text>
          {verified ? (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          ) : !isLoading && email ? (
            <Text style={styles.unverifiedHint}>Email not verified</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, styles.statGiven]}>{formatNaira(given)}</Text>
          <Text style={styles.statLabel}>Given</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{helped}</Text>
          <Text style={styles.statLabel}>Helped</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{requests}</Text>
          <Text style={styles.statLabel}>Requests</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flexShrink: 1,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E8BEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  unverifiedHint: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#22C55E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statGiven: {
    color: '#2E8BEA',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
});
