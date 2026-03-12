import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { ActivityRequestCard } from '@/components/activity/ActivityRequestCard';
import { ActivityTypeFilters, type ActivityType } from '@/components/activity/ActivityTypeFilters';
import { CommunityStories } from '@/components/activity/CommunityStories';
import { GivingCard } from '@/components/activity/GivingCard';
import { GivingSummaryCards } from '@/components/activity/GivingSummaryCards';
import { SummaryCards } from '@/components/activity/SummaryCards';
import { Screen } from '@/components/Screen';
import {
  MOCK_ACTIVITY_REQUESTS,
  MOCK_ACTIVITY_SUMMARY,
  MOCK_GIVING_CONTRIBUTIONS,
  MOCK_GIVING_SUMMARY,
} from '@/mock/activity';
import type { ActivityRequest, GivingContribution } from '@/mock/activity';

const LOGO = require('@/assets/images/pliz-logo.png');

export default function ActivityScreen() {
  const [activeTab, setActiveTab] = useState<ActivityType>('requests');

  const renderRequestItem = useCallback(
    ({ item }: { item: ActivityRequest }) => (
      <ActivityRequestCard request={item} />
    ),
    []
  );

  const renderGivingItem = useCallback(
    ({ item }: { item: GivingContribution }) => (
      <GivingCard contribution={item} />
    ),
    []
  );

  const ListHeader = (
    <>
      <ActivityTypeFilters activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'requests' && (
        <SummaryCards
          total={MOCK_ACTIVITY_SUMMARY.total}
          funded={MOCK_ACTIVITY_SUMMARY.funded}
          active={MOCK_ACTIVITY_SUMMARY.active}
        />
      )}
      {activeTab === 'giving' && (
        <GivingSummaryCards
          totalGiven={MOCK_GIVING_SUMMARY.totalGiven}
          peopleHelped={MOCK_GIVING_SUMMARY.peopleHelped}
          thisMonth={MOCK_GIVING_SUMMARY.thisMonth}
          avgGift={MOCK_GIVING_SUMMARY.avgGift}
        />
      )}
      {activeTab === 'stories' && <CommunityStories />}
    </>
  );

  const renderEmptyGiving = () => (
    <View style={styles.emptyState}>
      <Ionicons name="heart-outline" size={48} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No giving activity yet</Text>
      <Text style={styles.emptySubtitle}>
        When you support others, your contributions will appear here.
      </Text>
    </View>
  );

  const requestsData = activeTab === 'requests' ? MOCK_ACTIVITY_REQUESTS : [];
  const givingData = activeTab === 'giving' ? MOCK_GIVING_CONTRIBUTIONS : [];
  const storiesData: GivingContribution[] = [];

  const listData = activeTab === 'requests' ? requestsData : activeTab === 'giving' ? givingData : storiesData;
  const renderItem =
    activeTab === 'requests'
      ? renderRequestItem
      : activeTab === 'giving'
        ? renderGivingItem
        : renderRequestItem;
  const ListEmptyComponent =
    activeTab === 'giving' && givingData.length === 0
      ? renderEmptyGiving
      : undefined;

  type ListItem = ActivityRequest | GivingContribution;
  const typedListData = listData as ListItem[];
  const typedRenderItem = renderItem as (info: { item: ListItem }) => React.ReactElement;

  return (
    <Screen backgroundColor="#FFFFFF">
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <View style={styles.logoSection}>
          <Image source={LOGO} style={styles.logo} contentFit="contain" />
        </View>
        <View style={styles.backButtonSpacer} />
      </View>

      <FlatList<ListItem>
        data={typedListData}
        renderItem={typedRenderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={[
          styles.listContent,
          (listData.length === 0 || activeTab === 'stories') && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  logo: {
    width: 40,
    height: 40,
  },
  backButtonSpacer: {
    width: 40,
  },
  listContent: {
    paddingBottom: 24,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
