import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { getUnreadNotificationCount } from '@/lib/api/notifications';
import { getAccessToken } from '@/lib/auth/access-token';
import {
  isUnauthorizedSessionError,
  recoverFromUnauthorized,
} from '@/lib/auth/session-expired';

/**
 * Polls unread count when the screen is focused (same behavior as Home / Profile headers).
 */
export function useUnreadNotificationCount() {
  const { signOut } = useCurrentUser();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(
    async (opts?: { _retryAfterRefresh?: boolean }) => {
      const retryAfterRefresh = opts?._retryAfterRefresh ?? false;
      try {
        const token = await getAccessToken();
        if (!token) {
          setUnreadCount(0);
          return;
        }
        const count = await getUnreadNotificationCount(token);
        setUnreadCount(count);
      } catch (e) {
        if (isUnauthorizedSessionError(e) && !retryAfterRefresh) {
          const recovered = await recoverFromUnauthorized(signOut);
          if (recovered) {
            await refreshUnreadCount({ _retryAfterRefresh: true });
          }
          return;
        }
        setUnreadCount(0);
      }
    },
    [signOut]
  );

  useFocusEffect(
    useCallback(() => {
      void refreshUnreadCount();
    }, [refreshUnreadCount])
  );

  return { unreadCount, refreshUnreadCount };
}
