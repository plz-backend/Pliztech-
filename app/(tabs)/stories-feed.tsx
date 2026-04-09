import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Text } from '@/components/Text';

import { AppHeaderTitleRow } from '@/components/layout/AppHeaderTitleRow';
import { Screen } from '@/components/Screen';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { getStoriesFeed, type StoryItem } from '@/lib/api/stories';
import { PlizApiError } from '@/lib/api/types';
import { withUnauthorizedRecovery } from '@/lib/auth/session-expired';

function formatStoryDate(iso?: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function StoriesFeedScreen() {
  const { signOut } = useCurrentUser();
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await withUnauthorizedRecovery(signOut, (token) =>
        getStoriesFeed(token, { page: 1, limit: 30 })
      );
      setStories(res.stories);
    } catch (e) {
      setError(
        e instanceof PlizApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Could not load stories'
      );
      setStories([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [signOut]);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    void load();
  };

  return (
    <Screen backgroundColor="#F9FAFB" scrollable={false}>
      <AppHeaderTitleRow
        title="Community stories"
        marginBottom={12}
        trailingActions={
          <Pressable
            onPress={() => router.push('/(tabs)/share-story' as import('expo-router').Href)}
            style={styles.writeBtn}
            accessibilityLabel="Write a story"
            accessibilityRole="button"
          >
            <Ionicons name="create-outline" size={22} color="#2E8BEA" />
          </Pressable>
        }
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2E8BEA" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2E8BEA" />
          }
        >
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {!error && stories.length === 0 ? (
            <Text style={styles.empty}>No stories yet. Be the first to share yours.</Text>
          ) : null}
          {stories.map((s) => (
            <View key={s.id} style={styles.card}>
              <Text style={styles.storyBody}>{s.content}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaAuthor}>
                  {s.user?.isAnonymous ? 'Anonymous' : s.user?.username ?? 'Member'}
                </Text>
                <Text style={styles.metaDate}>{formatStoryDate(s.createdAt)}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  writeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  empty: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  storyBody: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E8BEA',
  },
  metaDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
