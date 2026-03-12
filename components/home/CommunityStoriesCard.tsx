import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

const HEADING = '#1F2937';
const BODY = '#6B7280';
const ICON_BG = '#E8F4FD';

export interface CommunityStoriesCardProps {
  onPress?: () => void;
}

export function CommunityStoriesCard({ onPress }: CommunityStoriesCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Community Stories - See how Pliz is making a difference"
    >
      <View style={styles.iconWrap}>
        <Ionicons name="sparkles" size={24} color="#2E8BEA" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Community Stories</Text>
        <Text style={styles.description}>See how Pliz is making a difference</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={BODY} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  pressed: {
    opacity: 0.95,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: HEADING,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: BODY,
  },
});
