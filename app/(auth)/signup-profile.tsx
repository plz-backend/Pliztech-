import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Text } from '@/components/Text';
import { z } from 'zod';

import { CTAButton } from '@/components/CTAButton';
import { FormTextInput } from '@/components/FormTextInput';
import { Screen } from '@/components/Screen';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { completeProfile } from '@/lib/api/profile';
import { PlizApiError } from '@/lib/api/types';
import { getAccessToken } from '@/lib/auth/access-token';

const LOGO = require('@/assets/images/pliz-logo.png');

/** E.164 — matches pliz-backend completeProfileValidation */
const E164_REGEX = /^\+?[1-9]\d{1,14}$/;

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(100, 'First name is too long'),
  middleName: z.string().max(100, 'Middle name is too long').optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(100, 'Last name is too long'),
  displayName: z.string().max(150, 'Display name is too long').optional(),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      E164_REGEX,
      'Use international format, e.g. +2348012345678 (country code, no spaces)'
    ),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const COLORS = {
  background: '#FFFFFF',
  brandBlue: '#2E8BEA',
  heading: '#1F2937',
  body: '#6B7280',
  link: '#2E8BEA',
  error: '#DC2626',
} as const;

export default function SignupProfileScreen() {
  const { refreshUser } = useCurrentUser();
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  const refreshToken = useCallback(async () => {
    setTokenChecked(false);
    const token = await getAccessToken();
    setAccessTokenState(token);
    setTokenChecked(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshToken();
    }, [refreshToken])
  );

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      displayName: '',
      phoneNumber: '',
    },
  });

  const applyApiFieldErrors = (err: PlizApiError) => {
    const fieldMap: Record<string, keyof ProfileFormData> = {
      firstName: 'firstName',
      middleName: 'middleName',
      lastName: 'lastName',
      phoneNumber: 'phoneNumber',
      displayName: 'displayName',
      agreeToTerms: 'firstName', // fallback
    };
    for (const item of err.errors) {
      const key = fieldMap[item.field];
      if (key) {
        setError(key, { type: 'server', message: item.message });
      }
    }
  };

  const onContinue = async (data: ProfileFormData) => {
    if (!accessToken) {
      setApiMessage('Sign in to complete your profile.');
      return;
    }
    if (!consentChecked) {
      setConsentError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    setConsentError(null);
    setApiMessage(null);
    setIsSubmitting(true);
    try {
      await completeProfile(accessToken, {
        firstName: data.firstName,
        middleName: data.middleName?.trim() || undefined,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber.trim(),
        displayName: data.displayName?.trim() || undefined,
        agreeToTerms: true,
        isAnonymous: false,
      });
      await refreshUser();
      router.replace('/(tabs)' as import('expo-router').Href);
    } catch (e) {
      if (e instanceof PlizApiError) {
        applyApiFieldErrors(e);
        if (e.errors.length === 0) {
          setApiMessage(e.message);
        }
        if (e.status === 401) {
          setApiMessage('Your session expired. Please sign in again.');
          setAccessTokenState(null);
        }
      } else {
        setApiMessage('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
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

  const onGoToLogin = () => {
    router.push('/(auth)/login' as import('expo-router').Href);
  };

  const needsSignIn = tokenChecked && !accessToken;

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

        {!tokenChecked ? (
          <ActivityIndicator color={COLORS.brandBlue} style={styles.tokenLoading} />
        ) : null}

        {needsSignIn ? (
          <View style={styles.authBanner}>
            <Text style={styles.authBannerText}>
              Sign in with a verified account to complete your profile. After registering, check your
              email to verify, then sign in.
            </Text>
            <Pressable onPress={onGoToLogin} style={styles.authBannerButton} accessibilityRole="button">
              <Text style={styles.authBannerButtonText}>Go to sign in</Text>
            </Pressable>
          </View>
        ) : null}

        {apiMessage ? (
          <Text style={styles.apiError} accessibilityLiveRegion="polite">
            {apiMessage}
          </Text>
        ) : null}

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
                editable={!needsSignIn}
              />
            )}
          />

          <Controller
            control={control}
            name="middleName"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Middle Name (optional)"
                placeholder="Michael"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.middleName?.message}
                accessibilityLabel="Middle name"
                editable={!needsSignIn}
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
                editable={!needsSignIn}
              />
            )}
          />

          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Display Name (optional)"
                placeholder="Defaults to your first and last name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.displayName?.message}
                accessibilityLabel="Display name"
                editable={!needsSignIn}
              />
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Phone Number"
                placeholder="+2348012345678"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                hint="International format (E.164), e.g. +234…"
                error={errors.phoneNumber?.message}
                accessibilityLabel="Phone number"
                editable={!needsSignIn}
              />
            )}
          />

          <View style={styles.consentRow}>
            <Pressable
              onPress={() => {
                if (needsSignIn) return;
                setConsentChecked((c) => !c);
                setConsentError(null);
              }}
              style={styles.checkboxTouch}
              accessibilityLabel={consentChecked ? 'Consent checked' : 'Consent unchecked'}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: consentChecked, disabled: needsSignIn }}
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
            label={isSubmitting ? 'Saving…' : 'Continue'}
            onPress={handleSubmit(onContinue)}
            variant="gradient"
            disabled={needsSignIn || !tokenChecked || isSubmitting}
            accessibilityLabel="Continue"
          />
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.brandBlue} style={styles.spinner} />
          ) : null}
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
  tokenLoading: {
    marginBottom: 16,
  },
  authBanner: {
    alignSelf: 'stretch',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  authBannerText: {
    fontSize: 14,
    color: COLORS.heading,
    lineHeight: 20,
    marginBottom: 12,
  },
  authBannerButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.brandBlue,
    borderRadius: 8,
  },
  authBannerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  apiError: {
    alignSelf: 'stretch',
    fontSize: 14,
    color: COLORS.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginBottom: 8,
  },
  spinner: {
    marginTop: 12,
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
