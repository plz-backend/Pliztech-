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
import { getMyDonations, myDonationToRecentContribution } from '@/lib/api/donations';
import { PlizApiError } from '@/lib/api/types';
import { getAccessToken } from '@/lib/auth/access-token';
import {
  isUnauthorizedSessionError,
  logoutAndGoToLogin,
} from '@/lib/auth/session-expired';
import type { RecentContribution, TrendingRequest } from '@/mock/home';

const RECENT_CONTRIBUTIONS_HOME_LIMIT = 5;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, isLoading, refreshUser, signOut } = useCurrentUser();
  const lastHomeRefreshRef = useRef<number>(0);
  const [trending, setTrending] = useState<TrendingRequest[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState<string | null>(null);
  const [recentContributions, setRecentContributions] = useState<RecentContribution[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);

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

  const loadRecentContributions = useCallback(
    async (opts?: { background?: boolean }) => {
      const background = opts?.background ?? false;
      if (!background) {
        setRecentLoading(true);
      }
      try {
        const token = await getAccessToken();
        if (!token) {
          setRecentContributions([]);
          return;
        }
        const result = await getMyDonations(token, {
          page: 1,
          limit: RECENT_CONTRIBUTIONS_HOME_LIMIT,
        });
        setRecentContributions(result.donations.map(myDonationToRecentContribution));
      } catch (e) {
        if (isUnauthorizedSessionError(e)) {
          await logoutAndGoToLogin(signOut);
          return;
        }
        if (!background) {
          setRecentContributions([]);
        }
      } finally {
        if (!background) {
          setRecentLoading(false);
        }
      }
    },
    [signOut]
  );

  useEffect(() => {
    void loadTrending();
  }, [loadTrending]);

  useEffect(() => {
    void loadRecentContributions();
  }, [loadRecentContributions]);

  useFocusEffect(
    useCallback(() => {
      const now = Date.now();
      if (now - lastHomeRefreshRef.current < CURRENT_USER_FOCUS_REFETCH_STALE_MS) {
        return;
      }
      lastHomeRefreshRef.current = now;
      void refreshUser();
      void loadTrending({ background: true });
      void loadRecentContributions({ background: true });
    }, [refreshUser, loadTrending, loadRecentContributions])
  );

  const firstName = isLoading && !user ? '…' : displayFirstName(user) || 'Guest';
  const role = user ? displayRoleLabel(user.role) : isLoading ? '…' : 'Member';

  const impactStats = user?.stats;
  const totalGiven = Math.round(Number(impactStats?.totalDonated) || 0);
  const peopleHelped = impactStats?.peopleHelped ?? 0;
  const weeklyHelped = impactStats?.peopleHelpedThisWeek ?? 0;

  const recentEmptyMessage = (() => {
    if (recentLoading || recentContributions.length > 0) return null;
    if (!user && !isLoading) {
      return 'Sign in to see your recent contributions.';
    }
    if (user) {
      return 'No contributions yet. Browse requests to help someone.';
    }
    return null;
  })();

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
          totalGiven={totalGiven}
          peopleHelped={peopleHelped}
          weeklyHelped={weeklyHelped}
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
          contributions={recentContributions}
          loading={recentLoading}
          emptyMessage={recentEmptyMessage}
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
