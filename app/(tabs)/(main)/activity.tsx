import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Text } from '@/components/Text';

import { ActivityRequestCard } from '@/components/activity/ActivityRequestCard';
import { ActivityTypeFilters, type ActivityType } from '@/components/activity/ActivityTypeFilters';
import { CommunityStories } from '@/components/activity/CommunityStories';
import { GivingCard } from '@/components/activity/GivingCard';
import { GivingSummaryCards } from '@/components/activity/GivingSummaryCards';
import { SummaryCards } from '@/components/activity/SummaryCards';
import { Screen } from '@/components/Screen';
import {
  begFeedItemToActivityRequest,
  getMyBegs,
  summarizeActivityRequests,
} from '@/lib/api/beg';
import {
  getMyDonations,
  myDonationToGivingContribution,
  summarizeGivingDonations,
} from '@/lib/api/donations';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { PlizApiError } from '@/lib/api/types';
import { getAccessToken } from '@/lib/auth/access-token';
import {
  isUnauthorizedSessionError,
  recoverFromUnauthorized,
} from '@/lib/auth/session-expired';
import type { ActivityRequest, GivingContribution } from '@/mock/activity';

const LOGO = require('@/assets/images/pliz-logo.png');

const MY_BEGS_PAGE_LIMIT = 100;
const MY_DONATIONS_PAGE_LIMIT = 200;

export default function ActivityScreen() {
  const { signOut } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<ActivityType>('requests');

  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [requestsAuthRequired, setRequestsAuthRequired] = useState(false);
  const [myRequests, setMyRequests] = useState<ActivityRequest[]>([]);
  const [requestsSummary, setRequestsSummary] = useState({
    total: 0,
    funded: 0,
    active: 0,
  });

  const [givingLoading, setGivingLoading] = useState(false);
  const [givingError, setGivingError] = useState<string | null>(null);
  const [givingAuthRequired, setGivingAuthRequired] = useState(false);
  const [myGiving, setMyGiving] = useState<GivingContribution[]>([]);
  const [givingSummary, setGivingSummary] = useState({
    totalGiven: 0,
    peopleHelped: 0,
    thisMonth: 0,
    avgGift: 0,
  });

  const loadMyRequests = useCallback(
    async (opts?: { _retryAfterRefresh?: boolean }) => {
      const retryAfterRefresh = opts?._retryAfterRefresh ?? false;
      setRequestsLoading(true);
      setRequestsError(null);
      setRequestsAuthRequired(false);
      try {
        const token = await getAccessToken();
        if (!token) {
          setRequestsAuthRequired(true);
          setMyRequests([]);
          setRequestsSummary({ total: 0, funded: 0, active: 0 });
          return;
        }

        const result = await getMyBegs(token, { page: 1, limit: MY_BEGS_PAGE_LIMIT });
        const rows = result.begs.map(begFeedItemToActivityRequest);
        setMyRequests(rows);

        const partial = summarizeActivityRequests(result.begs);
        setRequestsSummary({
          total: result.pagination.total,
          funded: partial.funded,
          active: partial.active,
        });
      } catch (e) {
        if (isUnauthorizedSessionError(e) && !retryAfterRefresh) {
          const recovered = await recoverFromUnauthorized(signOut);
          if (recovered) {
            await loadMyRequests({ _retryAfterRefresh: true });
            return;
          }
          return;
        }
        setMyRequests([]);
        setRequestsSummary({ total: 0, funded: 0, active: 0 });
        setRequestsError(
          e instanceof PlizApiError ? e.message : 'Could not load your requests.'
        );
      } finally {
        setRequestsLoading(false);
      }
    },
    [signOut]
  );

  const loadMyGiving = useCallback(
    async (opts?: { _retryAfterRefresh?: boolean }) => {
      const retryAfterRefresh = opts?._retryAfterRefresh ?? false;
      setGivingLoading(true);
      setGivingError(null);
      setGivingAuthRequired(false);
      try {
        const token = await getAccessToken();
        if (!token) {
          setGivingAuthRequired(true);
          setMyGiving([]);
          setGivingSummary({
            totalGiven: 0,
            peopleHelped: 0,
            thisMonth: 0,
            avgGift: 0,
          });
          return;
        }

        const result = await getMyDonations(token, {
          page: 1,
          limit: MY_DONATIONS_PAGE_LIMIT,
        });
        const rows = result.donations.map(myDonationToGivingContribution);
        setMyGiving(rows);
        setGivingSummary(summarizeGivingDonations(result.donations));
      } catch (e) {
        if (isUnauthorizedSessionError(e) && !retryAfterRefresh) {
          const recovered = await recoverFromUnauthorized(signOut);
          if (recovered) {
            await loadMyGiving({ _retryAfterRefresh: true });
            return;
          }
          return;
        }
        setMyGiving([]);
        setGivingSummary({
          totalGiven: 0,
          peopleHelped: 0,
          thisMonth: 0,
          avgGift: 0,
        });
        setGivingError(
          e instanceof PlizApiError ? e.message : 'Could not load your giving history.'
        );
      } finally {
        setGivingLoading(false);
      }
    },
    [signOut]
  );

  useFocusEffect(
    useCallback(() => {
      if (activeTab === 'requests') {
        void loadMyRequests();
      }
      if (activeTab === 'giving') {
        void loadMyGiving();
      }
    }, [activeTab, loadMyRequests, loadMyGiving])
  );

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

  const renderEmptyGiving = () => {
    if (givingLoading) return null;
    if (givingAuthRequired) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Sign in to see your giving</Text>
          <Text style={styles.emptySubtitle}>
            Log in to view donations you&apos;ve made on Pliz.
          </Text>
          <Pressable
            style={styles.primaryCta}
            onPress={() => router.push('/(auth)/login')}
            accessibilityRole="button"
            accessibilityLabel="Log in"
          >
            <Text style={styles.primaryCtaLabel}>Log in</Text>
          </Pressable>
        </View>
      );
    }
    if (givingError) return null;
    return (
      <View style={styles.emptyState}>
        <Ionicons name="heart-outline" size={48} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>No giving activity yet</Text>
        <Text style={styles.emptySubtitle}>
          When you support others, your contributions will appear here.
        </Text>
      </View>
    );
  };

  const renderEmptyRequests = () => {
    if (requestsLoading) return null;
    if (requestsAuthRequired) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Sign in to see your requests</Text>
          <Text style={styles.emptySubtitle}>
            Log in to view requests you&apos;ve posted on Pliz.
          </Text>
          <Pressable
            style={styles.primaryCta}
            onPress={() => router.push('/(auth)/login')}
            accessibilityRole="button"
            accessibilityLabel="Log in"
          >
            <Text style={styles.primaryCtaLabel}>Log in</Text>
          </Pressable>
        </View>
      );
    }
    if (requestsError) return null;
    return (
      <View style={styles.emptyState}>
        <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>No requests yet</Text>
        <Text style={styles.emptySubtitle}>
          When you ask for help, your requests will show up here.
        </Text>
        <Pressable
          style={styles.primaryCta}
          onPress={() => router.push('/(tabs)/(main)/create')}
          accessibilityRole="button"
          accessibilityLabel="Create a request"
        >
          <Text style={styles.primaryCtaLabel}>Ask for help</Text>
        </Pressable>
      </View>
    );
  };

  const requestsData = activeTab === 'requests' ? myRequests : [];
  const givingData = activeTab === 'giving' ? myGiving : [];
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
      : activeTab === 'requests'
        ? renderEmptyRequests
        : undefined;

  type ListItem = ActivityRequest | GivingContribution;
  const typedListData = listData as ListItem[];
  const typedRenderItem = renderItem as (info: { item: ListItem }) => React.ReactElement;

  const listHeader = (
    <>
      <ActivityTypeFilters activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'requests' && (
        <>
          <SummaryCards
            total={requestsSummary.total}
            funded={requestsSummary.funded}
            active={requestsSummary.active}
          />
          {requestsLoading ? (
            <View style={styles.requestsLoading}>
              <ActivityIndicator size="small" color="#2E8BEA" />
              <Text style={styles.requestsLoadingText}>Loading your requests…</Text>
            </View>
          ) : null}
          {requestsError ? (
            <View style={styles.inlineNotice}>
              <Text style={styles.inlineNoticeText}>{requestsError}</Text>
              <Pressable
                onPress={() => void loadMyRequests()}
                style={styles.retryLink}
                accessibilityRole="button"
                accessibilityLabel="Retry loading requests"
              >
                <Text style={styles.retryLinkText}>Try again</Text>
              </Pressable>
            </View>
          ) : null}
        </>
      )}
      {activeTab === 'giving' && (
        <>
          <GivingSummaryCards
            totalGiven={givingSummary.totalGiven}
            peopleHelped={givingSummary.peopleHelped}
            thisMonth={givingSummary.thisMonth}
            avgGift={givingSummary.avgGift}
          />
          {givingLoading ? (
            <View style={styles.requestsLoading}>
              <ActivityIndicator size="small" color="#2E8BEA" />
              <Text style={styles.requestsLoadingText}>Loading your giving…</Text>
            </View>
          ) : null}
          {givingError ? (
            <View style={styles.inlineNotice}>
              <Text style={styles.inlineNoticeText}>{givingError}</Text>
              <Pressable
                onPress={() => void loadMyGiving()}
                style={styles.retryLink}
                accessibilityRole="button"
                accessibilityLabel="Retry loading giving history"
              >
                <Text style={styles.retryLinkText}>Try again</Text>
              </Pressable>
            </View>
          ) : null}
        </>
      )}
      {activeTab === 'stories' && <CommunityStories />}
    </>
  );

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
        ListHeaderComponent={listHeader}
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
  requestsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  requestsLoadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  inlineNotice: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: 'center',
  },
  inlineNoticeText: {
    fontSize: 14,
    color: '#B45309',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryLinkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E8BEA',
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
    marginBottom: 20,
  },
  primaryCta: {
    backgroundColor: '#2E8BEA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  primaryCtaLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
