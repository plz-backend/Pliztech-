import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Screen } from '@/components/Screen';

// -----------------------------------------------------------------------------
// Constants (no magic numbers)
// -----------------------------------------------------------------------------
const COLORS = {
  background: '#FFFFFF',
  appName: '#007AFF',
  footer: '#6B7280',
} as const;

const SPACING = {
  logoSize: 380,
  eclipseSize: 400,
  appNameOverlap: 80, // negative margin to pull appName closer to logo
  slideUpDistance: 80,
} as const;

const FONT = {
  appNameSize: 28,
  appNameWeight: '700' as const,
} as const;

const SPLASH_DURATION_MS = 3500;
const NEXT_ROUTE = '/(public)/welcome';

// Logo asset
const LOGO_SOURCE: ImageSourcePropType = require('@/assets/images/pliz-logo.png');

const BOUNCE_SPRING = { damping: 10, stiffness: 90 } as const;

export default function SplashScreen() {
  const hasNavigated = useRef(false);

  const logoTranslateY = useSharedValue<number>(SPACING.slideUpDistance);
  const textOpacity = useSharedValue<number>(0);

  useEffect(() => {
    // 1. Logo slides up from the eclipse with a subtle bounce
    logoTranslateY.value = withSpring(0, BOUNCE_SPRING);

    // 2. PLIZ text appears below logo (900–1200ms)
    textOpacity.value = withDelay(900, withTiming(1, { duration: 400 }));
  }, [logoTranslateY, textOpacity]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (hasNavigated.current) return;
      hasNavigated.current = true;
      router.replace(NEXT_ROUTE);
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <Screen backgroundColor={COLORS.background} centerVertical>
      <View style={styles.centerSection}>
        {/* Eclipse: circular mask where logo slides up from; PLIZ text below */}
        <View style={styles.brandColumn}>
          <View style={[styles.eclipse, { width: SPACING.eclipseSize, height: SPACING.eclipseSize }]}>
            <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
              <Image
                source={LOGO_SOURCE}
                style={styles.logo}
                contentFit="contain"
                accessibilityLabel="Pliz app logo"
                accessibilityRole="image"
              />
            </Animated.View>
          </View>
          <Animated.Text
            style={[styles.appName, textAnimatedStyle]}
            accessibilityLabel="Pliz"
            accessibilityRole="text"
          >
            PLIZ
          </Animated.Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerSection: {
    alignItems: 'center',
  },
  eclipse: {
    borderRadius: 9999,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandColumn: {
    alignItems: 'center',
  },
  logoContainer: {
    width: SPACING.logoSize,
    height: SPACING.logoSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: SPACING.logoSize,
    height: SPACING.logoSize,
  },
  appName: {
    fontSize: FONT.appNameSize,
    fontWeight: FONT.appNameWeight,
    color: COLORS.appName,
    marginTop: -SPACING.appNameOverlap,
    zIndex: 1,
  },
});
