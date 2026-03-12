import { Pressable, StyleSheet, View } from 'react-native';

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
}

export function RecentContributions({
  contributions,
  onSeeAll,
  onCommunityStories,
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

      {contributions.map((contribution) => (
        <ContributionCard key={contribution.id} contribution={contribution} />
      ))}

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
});
