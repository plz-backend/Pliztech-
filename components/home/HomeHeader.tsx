import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

const COLORS = {
  heading: '#1F2937',
  body: '#6B7280',
  brandBlue: '#2E8BEA',
  avatarBg: '#374151',
  pillBg: '#2E8BEA',
  bellBg: '#F3F4F6',
} as const;

export interface HomeHeaderProps {
  firstName: string;
  role: string;
  onNotificationPress?: () => void;
  /** When &gt; 0, shows a badge on the bell (e.g. unread API count). */
  unreadNotificationCount?: number;
}

export function HomeHeader({
  firstName,
  role,
  onNotificationPress,
  unreadNotificationCount = 0,
}: HomeHeaderProps) {
  const initial = firstName.charAt(0).toUpperCase();
  const isBeginnerBadge = role === 'Beginner';

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.greeting}>
          Hi, <Text style={styles.name}>{firstName}</Text>
        </Text>
      </View>
      <View style={[styles.pill, isBeginnerBadge && styles.pillBeginner]}>
        <Ionicons
          name={isBeginnerBadge ? 'school-outline' : 'heart'}
          size={12}
          color={isBeginnerBadge ? '#92400E' : '#FFFFFF'}
          style={styles.pillIcon}
        />
        <Text
          style={[styles.pillText, isBeginnerBadge && styles.pillTextBeginner]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {role}
        </Text>
      </View>
      <Pressable
        onPress={onNotificationPress}
        style={styles.bellWrap}
        accessibilityLabel="Notifications"
        accessibilityRole="button"
      >
        <View style={styles.bellBg}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.brandBlue} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  greeting: {
    fontSize: 16,
    color: COLORS.heading,
  },
  name: {
    fontWeight: '700',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pillBg,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    maxWidth: 120,
  },
  pillBeginner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  pillIcon: {
    marginRight: 4,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  pillTextBeginner: {
    color: '#92400E',
  },
  bellWrap: {
    padding: 4,
  },
  bellBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bellBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
