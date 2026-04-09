import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';
import { HeaderNotificationButton } from '@/components/home/HeaderNotificationButton';
import { useUnreadNotificationCount } from '@/hooks/useUnreadNotificationCount';

const NOTIFICATIONS_HREF = '/(tabs)/notifications' as Href;

export type AppHeaderTitleRowProps = {
  title: string;
  subtitle?: string;
  onPressBack?: () => void;
  backIconColor?: string;
  marginBottom?: number;
  /** Replaces the entire right column (use for Notifications “Mark all read”, etc.). */
  rightSlot?: ReactNode;
  /** Shown after the notification bell (e.g. compose on Community stories). */
  trailingActions?: ReactNode;
  showNotification?: boolean;
};

export function AppHeaderTitleRow({
  title,
  subtitle,
  onPressBack,
  backIconColor = '#1F2937',
  marginBottom = 20,
  rightSlot,
  trailingActions,
  showNotification = true,
}: AppHeaderTitleRowProps) {
  const { unreadCount } = useUnreadNotificationCount();
  const goBack = onPressBack ?? (() => router.back());

  let right: ReactNode;
  if (rightSlot != null) {
    right = rightSlot;
  } else if (showNotification || trailingActions != null) {
    right = (
      <View style={styles.rightCluster}>
        {showNotification ? (
          <HeaderNotificationButton
            onPress={() => router.push(NOTIFICATIONS_HREF)}
            unreadCount={unreadCount}
          />
        ) : null}
        {trailingActions}
      </View>
    );
  } else {
    right = <View style={styles.sideSpacer} />;
  }

  return (
    <View style={[styles.row, { marginBottom }]}>
      <View style={styles.side}>
        <Pressable
          onPress={goBack}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={backIconColor} />
        </Pressable>
      </View>
      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.sideRight}>{right}</View>
    </View>
  );
}

const SIDE_W = 48;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: {
    width: SIDE_W,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    minWidth: SIDE_W,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'nowrap',
    gap: 2,
  },
  sideSpacer: {
    width: 40,
    height: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
    minWidth: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
});
