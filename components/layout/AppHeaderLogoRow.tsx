import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { HeaderNotificationButton } from '@/components/home/HeaderNotificationButton';
import { useUnreadNotificationCount } from '@/hooks/useUnreadNotificationCount';

const LOGO = require('@/assets/images/pliz-logo.png');

const NOTIFICATIONS_HREF = '/(tabs)/notifications' as Href;

export type AppHeaderLogoRowProps = {
  onPressBack?: () => void;
  backIconColor?: string;
  marginBottom?: number;
  /** When false, omits the bell (e.g. rare layouts). Default true. */
  showNotification?: boolean;
};

export function AppHeaderLogoRow({
  onPressBack,
  backIconColor = '#1F2937',
  marginBottom = 16,
  showNotification = true,
}: AppHeaderLogoRowProps) {
  const { unreadCount } = useUnreadNotificationCount();
  const goBack = onPressBack ?? (() => router.back());

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
      <View style={styles.logoSection} pointerEvents="none">
        <Image source={LOGO} style={styles.logo} contentFit="contain" />
      </View>
      <View style={[styles.side, styles.sideRight]}>
        {showNotification ? (
          <HeaderNotificationButton
            onPress={() => router.push(NOTIFICATIONS_HREF)}
            unreadCount={unreadCount}
          />
        ) : (
          <View style={styles.sideSpacer} />
        )}
      </View>
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
    alignItems: 'flex-end',
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
  logoSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
});
