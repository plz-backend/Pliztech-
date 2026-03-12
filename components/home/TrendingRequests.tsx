import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { RequestCard } from './RequestCard';

import type { TrendingRequest } from '@/mock/home';

const HEADING = '#1F2937';
const BRAND_BLUE = '#2E8BEA';

export interface TrendingRequestsProps {
  requests: readonly TrendingRequest[];
  onSeeAll: () => void;
}

export function TrendingRequests({
  requests,
  onSeeAll,
}: TrendingRequestsProps) {
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Trending Requests</Text>
        <Pressable
          onPress={onSeeAll}
          style={styles.seeAll}
          accessibilityLabel="See all requests"
          accessibilityRole="button"
        >
          <Text style={styles.seeAllText}>See all →</Text>
        </Pressable>
      </View>

      <View style={styles.listContent}>
        {requests.map((item) => (
          <RequestCard key={item.id} request={item} />
        ))}
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
    marginBottom: 16,
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
  listContent: {
    paddingBottom: 8,
  },
});
