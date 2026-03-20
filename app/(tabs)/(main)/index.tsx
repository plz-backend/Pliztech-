import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeHeader } from '@/components/home/HomeHeader';
import { ImpactCard } from '@/components/home/ImpactCard';
import { QuickActions } from '@/components/home/QuickActions';
import { RecentContributions } from '@/components/home/RecentContributions';
import { TrendingRequests } from '@/components/home/TrendingRequests';
import {
  CURRENT_USER_FOCUS_REFETCH_STALE_MS,
  displayFirstName,
  displayRoleLabel,
  useCurrentUser,
} from '@/contexts/CurrentUserContext';

import { getTrendingBegs } from '@/lib/api/beg';
import { PlizApiError } from '@/lib/api/types';
import { MOCK_IMPACT, MOCK_RECENT_CONTRIBUTIONS } from '@/mock/home';
import type { TrendingRequest } from '@/mock/home';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, isLoading, refreshUser } = useCurrentUser();
  const lastHomeRefreshRef = useRef<number>(0);
  const [trending, setTrending] = useState<TrendingRequest[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState<string | null>(null);

  const loadTrending = useCallback(async (opts?: { background?: boolean }) => {
    const background = opts?.background ?? false;
    if (!background) {
      setTrendingLoading(true);
    }
    setTrendingError(null);
    try {
      const items = await getTrendingBegs(5);
      setTrending(items);
    } catch (e) {
      if (!background) {
        const msg =
          e instanceof PlizApiError
            ? e.message
            : e instanceof Error
              ? e.message
              : 'Could not load trending requests';
        setTrendingError(msg);
        setTrending([]);
      }
    } finally {
      if (!background) {
        setTrendingLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadTrending();
  }, [loadTrending]);

  useFocusEffect(
    useCallback(() => {
      const now = Date.now();
      if (now - lastHomeRefreshRef.current < CURRENT_USER_FOCUS_REFETCH_STALE_MS) {
        return;
      }
      lastHomeRefreshRef.current = now;
      void refreshUser();
      void loadTrending({ background: true });
    }, [refreshUser, loadTrending])
  );

  const firstName = isLoading && !user ? '…' : displayFirstName(user) || 'Guest';
  const role = user ? displayRoleLabel(user.role) : isLoading ? '…' : 'Member';

  const onAskForHelp = () => {
    router.push('/(tabs)/(main)/create');
  };

  const onBrowseRequests = () => {
    router.push('/(tabs)/(main)/browse');
  };

  const onSeeAll = () => {
    router.push('/(tabs)/(main)/browse');
  };

  const onSeeAllContributions = () => {
    router.push('/(tabs)/(main)/activity');
  };

  const onNotifications = () => {
    router.push('/(tabs)/notifications');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} collapsable={false}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingHorizontal: 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <HomeHeader
          firstName={firstName}
          role={role}
          onNotificationPress={onNotifications}
        />
        <ImpactCard
          totalGiven={MOCK_IMPACT.totalGiven}
          peopleHelped={MOCK_IMPACT.peopleHelped}
          weeklyHelped={MOCK_IMPACT.weeklyHelped}
        />
        <QuickActions
          onAskForHelp={onAskForHelp}
          onBrowseRequests={onBrowseRequests}
        />
        <TrendingRequests
          requests={trending}
          loading={trendingLoading}
          errorMessage={trendingError}
          onRetry={() => void loadTrending()}
          onSeeAll={onSeeAll}
        />
        <RecentContributions
          contributions={MOCK_RECENT_CONTRIBUTIONS}
          onSeeAll={onSeeAllContributions}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
});
