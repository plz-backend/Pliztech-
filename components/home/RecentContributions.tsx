import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { CommunityStoriesCard } from './CommunityStoriesCard';
import { ContributionCard } from './ContributionCard';

import type { RecentContribution } from '@/mock/home';

const HEADING = '#1F2937';
const BRAND_BLUE = '#2E8BEA';

export interface RecentContributionsProps {
  contributions: readonly RecentContribution[];
  onSeeAll: () => void;
  onCommunityStories?: () => void;
  loading?: boolean;
  /** Shown when not loading and there are no rows (e.g. signed out or empty history). */
  emptyMessage?: string | null;
}

export function RecentContributions({
  contributions,
  onSeeAll,
  onCommunityStories,
  loading = false,
  emptyMessage = null,
}: RecentContributionsProps) {
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>My Recent Contributions</Text>
        <Pressable
          onPress={onSeeAll}
          style={styles.seeAll}
          accessibilityLabel="See all contributions"
          accessibilityRole="button"
        >
          <Text style={styles.seeAllText}>See all →</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={BRAND_BLUE} />
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      ) : null}

      {!loading && contributions.length === 0 && emptyMessage ? (
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      ) : null}

      {!loading
        ? contributions.map((contribution) => (
            <ContributionCard key={contribution.id} contribution={contribution} />
          ))
        : null}

      <View style={styles.communityStoriesWrap}>
        <CommunityStoriesCard onPress={onCommunityStories} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: HEADING,
  },
  seeAll: {
    padding: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_BLUE,
  },
  communityStoriesWrap: {
    marginTop: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
    marginBottom: 4,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 16,
    marginBottom: 4,
  },
});
