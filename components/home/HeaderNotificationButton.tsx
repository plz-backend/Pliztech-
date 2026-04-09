import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

const BRAND_BLUE = '#2E8BEA';

export type HeaderNotificationButtonProps = {
  onPress: () => void;
  /** When &gt; 0, shows the unread dot (same as home). */
  unreadCount?: number;
};

/**
 * Notification entry control used on the home header — reuse on other screens for a consistent bell.
 */
export function HeaderNotificationButton({
  onPress,
  unreadCount = 0,
}: HeaderNotificationButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.wrap}
      accessibilityLabel="Notifications"
      accessibilityRole="button"
    >
      <View style={styles.circle}>
        <Ionicons name="notifications-outline" size={22} color={BRAND_BLUE} />
        {unreadCount > 0 ? <View style={styles.unreadDot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 4,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
