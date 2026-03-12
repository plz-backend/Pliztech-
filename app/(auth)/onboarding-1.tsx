import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { PageDots } from '@/components/PageDots';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { SecondaryButton } from '@/components/SecondaryButton';

const BACKGROUND = '#FFFFFF';
const TITLE_COLOR = '#212529';
const BODY_COLOR = '#566C80';

const HERO_IMAGE = require('@/assets/images/onboarding/onboarding-1-hero.png');

export default function Onboarding1Screen() {
  const onContinue = () => {
    router.replace('/onboarding-2' as import('expo-router').Href);
  };

  const onSkip = () => {
    router.replace('/login' as import('expo-router').Href);
  };

  return (
    <Screen backgroundColor={BACKGROUND}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Image
            source={HERO_IMAGE}
            style={styles.heroImage}
            contentFit="contain"
            accessibilityLabel="Hand with hearts and community icons"
          />
        </View>

        <View style={styles.textSection}>
          <Text
            style={styles.title}
            accessibilityRole="header"
            accessibilityLabel="Small help, Big Impact"
          >
            Small help, Big Impact
          </Text>
          <Text
            style={styles.body}
            accessibilityLabel="Pliz connects people who need a little help with those who can give it. Simple, direct and human"
          >
            Pliz connects people who need a little help with those who can give it. Simple, direct
            and human
          </Text>

          <View style={styles.dotsWrapper}>
            <PageDots total={3} activeIndex={0} accessibilityLabel="Onboarding step 1 of 3" />
          </View>
        </View>

        <View style={styles.buttons}>
          <PrimaryButton
            label="Continue"
            onPress={onContinue}
            accessibilityLabel="Continue to next onboarding step"
          />
          <View style={styles.skipButtonWrapper}>
            <SecondaryButton
              label="Skip"
              onPress={onSkip}
              accessibilityLabel="Skip onboarding and go to login"
            />
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    // justifyContent: 'space-between',
    // flexDirection: 'column',
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
    gap: 14,
    width: '100%',
  },
  skipButtonWrapper: {
    width: '100%',
  },
});
