import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { PageDots } from '@/components/PageDots';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';

const HERO_IMAGE = require('@/assets/images/onboarding/onboarding-2-hero.png');

const BACKGROUND = '#FFFFFF';
const TITLE_COLOR = '#212529';
const BODY_COLOR = '#566C80';

export default function Onboarding2Screen() {
  const onContinue = () => {
    router.replace('/onboarding-3' as import('expo-router').Href);
  };

  return (
    <Screen backgroundColor={BACKGROUND}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Image
            source={HERO_IMAGE}
            style={styles.heroImage}
            contentFit="contain"
            accessibilityLabel="Ask or give: circles and icons"
            accessibilityRole="image"
          />
        </View>

        <View style={styles.textSection}>
          <Text
            style={styles.title}
            accessibilityRole="header"
            accessibilityLabel="Ask or Give, Your Choice"
          >
            Ask or Give, Your Choice
          </Text>
          <Text
            style={styles.body}
            accessibilityLabel="Need help with groceries? A Bus Ticket? Or want to support a cause? It starts with a simple request or donation"
          >
            Need help with groceries? A Bus Ticket? Or want to support a cause? It starts with a
            simple request or donation
          </Text>

          <View style={styles.dotsWrapper}>
            <PageDots total={3} activeIndex={1} accessibilityLabel="Onboarding step 2 of 3" />
          </View>
        </View>

        <View style={styles.buttons}>
          <PrimaryButton
            label="Continue"
            onPress={onContinue}
            accessibilityLabel="Continue to next onboarding step"
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
    width: '100%',
    maxWidth: 320,
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
});
