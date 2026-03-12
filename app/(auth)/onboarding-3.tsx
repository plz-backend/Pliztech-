import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { PageDots } from '@/components/PageDots';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';

const HERO_IMAGE = require('@/assets/images/onboarding/onboarding-3-hero.png');
const BACKGROUND = '#FFFFFF';
const TITLE_COLOR = '#212529';
const BODY_COLOR = '#566C80';
const PAGE_DOTS_ACTIVE_BLUE = '#2E8BEA';

export default function Onboarding3Screen() {
  const onGetStarted = () => {
    router.replace('/(public)/welcome' as import('expo-router').Href);
  };

  return (
    <Screen backgroundColor={BACKGROUND}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Image
            source={HERO_IMAGE}
            style={styles.heroImage}
            contentFit="contain"
            accessibilityLabel="Safe and verified illustration"
            accessibilityRole="image"
          />
        </View>

        <View style={styles.textSection}>
          <Text
            style={styles.title}
            accessibilityRole="header"
            accessibilityLabel="Safe and Verified"
          >
            Safe and Verified
          </Text>
          <Text
            style={styles.body}
            accessibilityLabel="Every user is verified. Every transaction is secure. We protect both sides so you can focus on what matters."
          >
            Every user is verified. Every transaction is secure. We protect both sides so you can
            focus on what matters.
          </Text>

          <View style={styles.dotsWrapper}>
            <PageDots
              total={3}
              activeIndex={2}
              activeColor={PAGE_DOTS_ACTIVE_BLUE}
              accessibilityLabel="Onboarding step 3 of 3"
            />
          </View>
        </View>

        <View style={styles.buttons}>
          <PrimaryButton
            label="Get Started"
            onPress={onGetStarted}
            accessibilityLabel="Finish onboarding and go to login"
            variant="gradient"
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    // justifyContent: 'space-between',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  heroSection: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  heroImage: {
    maxWidth: 320,
    width: '100%',
    aspectRatio: 1,
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: TITLE_COLOR,
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: BODY_COLOR,
    textAlign: 'center',
    maxWidth: 340,
    marginBottom: 20,
  },
  dotsWrapper: {
    marginBottom: 8,
  },
  buttons: {
    width: '100%',
  },
});
