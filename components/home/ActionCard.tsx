import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const GRADIENT_COLORS = ['#2E8BEA', '#172033'] as const;
const BRAND_BLUE = '#2E8BEA';
const HEADING = '#1F2937';
const ICON_BG_LIGHT = '#E8F4FD';
const ICON_BG_WHITE = '#F3F4F6';

export type ActionCardVariant = 'gradient' | 'solid';

export interface ActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  variant: ActionCardVariant;
  onPress: () => void;
}

export function ActionCard({ icon, title, subtitle, variant, onPress }: ActionCardProps) {
  const isGradient = variant === 'gradient';

  const content = (
    <>
      <View style={[styles.iconWrap, isGradient ? styles.iconWrapGradient : styles.iconWrapSolid]}>
        <Ionicons
          name={icon}
          size={28}
          color={isGradient ? '#FFFFFF' : BRAND_BLUE}
        />
      </View>
      <Text style={[styles.title, isGradient ? styles.titleLight : styles.titleDark]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, isGradient ? styles.subtitleLight : styles.subtitleDark]}>
        {subtitle}
      </Text>
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isGradient ? undefined : styles.cardSolid,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${subtitle}`}
    >
      {isGradient ? (
        <LinearGradient
          colors={[...GRADIENT_COLORS]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={styles.solidContent}>{content}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardSolid: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  solidContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconWrapGradient: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  iconWrapSolid: {
    backgroundColor: ICON_BG_WHITE,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  titleLight: {
    color: '#FFFFFF',
  },
  titleDark: {
    color: HEADING,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  subtitleLight: {
    color: 'rgba(255,255,255,0.9)',
  },
  subtitleDark: {
    color: '#6B7280',
  },
  pressed: {
    opacity: 0.9,
  },
});
