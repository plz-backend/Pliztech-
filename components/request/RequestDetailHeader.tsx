import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

const LOGO = require('@/assets/images/pliz-logo.png');

export type RequestDetailHeaderProps = {
  /** Report / flag this request (Figma: top-right flag). */
  onReportPress?: () => void;
};

export function RequestDetailHeader({ onReportPress }: RequestDetailHeaderProps) {
  const handleReport = () => {
    if (onReportPress) {
      onReportPress();
      return;
    }
    Alert.alert('Report request', 'Thanks for looking out for the community. Reporting will be available soon.');
  };

  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => router.back()}
        style={styles.backCircle}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <Ionicons name="arrow-back" size={22} color="#1F2937" />
      </Pressable>
      <View style={styles.logoWrap}>
        <Image source={LOGO} style={styles.logo} contentFit="contain" />
      </View>
      <Pressable
        style={styles.iconCircle}
        onPress={handleReport}
        accessibilityLabel="Report or flag this request"
        accessibilityRole="button"
      >
        <Ionicons name="flag-outline" size={20} color="#1F2937" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  logo: {
    width: 40,
    height: 40,
  },
});
