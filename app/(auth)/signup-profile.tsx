import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';
import { z } from 'zod';

import { CTAButton } from '@/components/CTAButton';
import { FormTextInput } from '@/components/FormTextInput';
import { Screen } from '@/components/Screen';

const LOGO = require('@/assets/images/pliz-logo.png');

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  phoneNumber: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const COLORS = {
  background: '#FFFFFF',
  brandBlue: '#2E8BEA',
  heading: '#1F2937',
  body: '#6B7280',
  link: '#2E8BEA',
} as const;

export default function SignupProfileScreen() {
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      displayName: '',
      phoneNumber: '',
    },
  });

  const onContinue = (data: ProfileFormData) => {
    if (!consentChecked) {
      setConsentError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    setConsentError(null);
    // Stub: replace with API call to save profile
    console.log('Profile data', data);
    router.replace('/(tabs)' as import('expo-router').Href);
  };

  const onBack = () => {
    router.back();
  };

  const onTermsPress = () => {
    Linking.openURL('https://example.com/terms');
  };

  const onPrivacyPress = () => {
    Linking.openURL('https://example.com/privacy');
  };

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const displayName = watch('displayName');
  const allRequiredFilled =
    Boolean(firstName?.trim()) &&
    Boolean(lastName?.trim()) &&
    Boolean(displayName?.trim());
  const canSubmit = allRequiredFilled && consentChecked;

  return (
    <Screen backgroundColor={COLORS.background} scrollable>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.heading} />
          </Pressable>
          <View style={styles.logoSection}>
            <Image source={LOGO} style={styles.logo} contentFit="contain" />
          </View>
          <View style={styles.backButtonSpacer} />
        </View>

        <Text style={styles.appName}>Pliz</Text>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>This helps build trust in our community</Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="First Name"
                placeholder="John"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.firstName?.message}
                accessibilityLabel="First name"
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Last Name"
                placeholder="Doe"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.lastName?.message}
                accessibilityLabel="Last name"
              />
            )}
          />

          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Display Name"
                placeholder="eg. Johnny Doe"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.displayName?.message}
                accessibilityLabel="Display name"
              />
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Phone Number (optional)"
                placeholder="+234"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                hint="For account recovery and security alerts"
                error={errors.phoneNumber?.message}
                accessibilityLabel="Phone number"
              />
            )}
          />

          <View style={styles.consentRow}>
            <Pressable
              onPress={() => {
                setConsentChecked((c) => !c);
                setConsentError(null);
              }}
              style={styles.checkboxTouch}
              accessibilityLabel={consentChecked ? 'Consent checked' : 'Consent unchecked'}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: consentChecked }}
            >
              <Ionicons
                name={consentChecked ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={consentChecked ? COLORS.brandBlue : COLORS.body}
                style={consentChecked ? undefined : { opacity: 0.8 }}
              />
            </Pressable>
            <View style={styles.consentTextWrap}>
              <Text style={styles.consentText}>
                I agree to the{' '}
                <Text style={styles.consentLink} onPress={onTermsPress}>
                  Terms of Service
                </Text>
                {' '}and{' '}
                <Text style={styles.consentLink} onPress={onPrivacyPress}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
          {consentError ? <Text style={styles.consentError}>{consentError}</Text> : null}

          <CTAButton
            label="Continue"
            onPress={handleSubmit(onContinue)}
            variant="gradient"
            disabled={!canSubmit}
            accessibilityLabel="Continue"
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingBottom: 32,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
  },
  backButtonSpacer: {
    width: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 72,
    height: 72,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.brandBlue,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.body,
    marginBottom: 28,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  form: {
    width: '100%',
    marginBottom: 8,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 16,
    marginTop: 8,
  },
  checkboxTouch: {
    padding: 4,
    marginRight: 12,
  },
  consentTextWrap: {
    flex: 1,
  },
  consentText: {
    fontSize: 14,
    color: COLORS.heading,
    lineHeight: 22,
  },
  consentLink: {
    color: COLORS.link,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  consentError: {
    fontSize: 12,
    color: '#DC2626',
    marginBottom: 16,
    marginTop: -8,
  },
});
