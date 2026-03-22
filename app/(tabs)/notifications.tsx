import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import { Text } from '@/components/Text';

import { Screen } from '@/components/Screen';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import {
  getNotifications,
  mapApiNotificationToListItem,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationListItem,
} from '@/lib/api/notifications';
import { PlizApiError } from '@/lib/api/types';
import { getAccessToken } from '@/lib/auth/access-token';
import {
  isUnauthorizedSessionError,
  recoverFromUnauthorized,
} from '@/lib/auth/session-expired';
import { navigateToBegDetailOrPastOverlay } from '@/lib/navigation/post-donation-navigation';

const ACCENT_BLUE = '#2E8BEA';

const ICON_MAP: Record<NotificationListItem['icon'], keyof typeof Ionicons.glyphMap> = {
  heart: 'heart-outline',
  'checkmark-circle': 'checkmark-circle-outline',
  chatbubble: 'chatbubble-outline',
  time: 'time-outline',
  'alert-circle': 'alert-circle-outline',
  gift: 'gift-outline',
};

function NotificationRow({
  item,
  onPress,
}: {
  item: NotificationListItem;
  onPress?: () => void;
}) {
  const iconName = ICON_MAP[item.icon];
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${item.iconColor}20` }]}>
        <Ionicons name={iconName} size={24} color={item.iconColor} />
      </View>
      <View style={styles.content}>
        <Text
          style={[styles.title, item.unread && styles.titleUnread]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
      </View>
      {item.unread ? <View style={styles.unreadDot} /> : null}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const { signOut } = useCurrentUser();
  const [items, setItems] = useState<NotificationListItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(
    async (opts?: { background?: boolean; _retryAfterRefresh?: boolean }) => {
      const background = opts?.background ?? false;
      const retryAfterRefresh = opts?._retryAfterRefresh ?? false;
      if (!background) {
        setLoading(true);
      }
      setError(null);
      try {
        const token = await getAccessToken();
        if (!token) {
          setItems([]);
          setUnreadCount(0);
          return;
        }
        const result = await getNotifications(token, { page: 1, limit: 50 });
        setItems(result.notifications.map(mapApiNotificationToListItem));
        setUnreadCount(result.unreadCount);
      } catch (e) {
        if (isUnauthorizedSessionError(e) && !retryAfterRefresh) {
          const recovered = await recoverFromUnauthorized(signOut);
          if (recovered) {
            await loadNotifications({ background, _retryAfterRefresh: true });
            return;
          }
          return;
        }
        const msg =
          e instanceof PlizApiError
            ? e.message
            : e instanceof Error
              ? e.message
              : 'Could not load notifications';
        setError(msg);
        if (!background) {
          setItems([]);
        }
      } finally {
        if (!background) {
          setLoading(false);
        }
      }
    },
    [signOut]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadNotifications({ background: true });
    } finally {
      setRefreshing(false);
    }
  }, [loadNotifications]);

  useFocusEffect(
    useCallback(() => {
      void loadNotifications();
    }, [loadNotifications])
  );

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      const token = await getAccessToken();
      if (!token) return;
      await markAllNotificationsRead(token);
      setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
      setUnreadCount(0);
    } catch (e) {
      if (isUnauthorizedSessionError(e)) {
        const recovered = await recoverFromUnauthorized(signOut);
        if (recovered) {
          await handleMarkAllRead();
        }
        return;
      }
      setError(e instanceof PlizApiError ? e.message : 'Could not mark all as read');
    }
  };

  const handleRowPress = async (item: NotificationListItem) => {
    if (item.unread) {
      try {
        const token = await getAccessToken();
        if (token) {
          await markNotificationRead(token, item.id);
        }
        setItems((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (e) {
        if (isUnauthorizedSessionError(e)) {
          await recoverFromUnauthorized(signOut);
        }
      }
    }

    if (item.begId) {
      void navigateToBegDetailOrPastOverlay(item.begId);
    }
  };

  return (
    <Screen backgroundColor="#FFFFFF">
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 ? (
            <Text style={styles.unreadCount}>{unreadCount} unread</Text>
          ) : null}
        </View>
        {unreadCount > 0 ? (
          <Pressable
            style={styles.markAllButton}
            onPress={() => void handleMarkAllRead()}
            accessibilityLabel="Mark all read"
            accessibilityRole="button"
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {loading && items.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={ACCENT_BLUE} />
          <Text style={styles.loadingHint}>Loading notifications…</Text>
        </View>
      ) : null}

      {error && !loading ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => void loadNotifications()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <NotificationRow item={item} onPress={() => void handleRowPress(item)} />
        )}
        contentContainerStyle={[
          styles.listContent,
          items.length === 0 && !loading ? styles.listEmpty : null,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} tintColor={ACCENT_BLUE} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="notifications-off-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySubtitle}>
                When someone supports you or sends a message, it will show up here.
              </Text>
            </View>
          ) : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  unreadCount: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  markAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_BLUE,
  },
  headerSpacer: {
    width: 80,
  },
  listContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },
  listEmpty: {
    justifyContent: 'center',
  },
  centered: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingHint: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#B91C1C',
  },
  retryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_BLUE,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pressed: {
    opacity: 0.7,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  titleUnread: {
    fontWeight: '700',
  },
  body: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT_BLUE,
    marginTop: 6,
    marginLeft: 12,
  },
});
