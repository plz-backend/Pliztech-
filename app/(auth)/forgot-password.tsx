import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';
import { z } from 'zod';

import { FormTextInput } from '@/components/FormTextInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';

const LOGO = require('@/assets/images/pliz-logo.png');

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const COLORS = {
  background: '#FFFFFF',
  brandBlue: '#2E8BEA',
  heading: '#1F2937',
  body: '#6B7280',
  link: '#2E8BEA',
} as const;

export default function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSendResetLink = (data: ForgotPasswordFormData) => {
    // Stub: replace with real password reset API
    console.log('Send reset link to', data.email);
    router.push({
      pathname: '/(auth)/forgot-password-confirmation',
      params: { email: data.email },
    });
  };

  const onBack = () => {
    router.back();
  };

  const onSignIn = () => {
    router.replace('/(auth)/login' as import('expo-router').Href);
  };

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
        <Text style={styles.title}>Forgot Password ?</Text>
        <Text style={styles.subtitle}>
          No worries! Enter your email and we&apos;ll send you a reset link.
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Email Address"
                leftIcon="mail-outline"
                placeholder="you@example.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email?.message}
                accessibilityLabel="Email address"
              />
            )}
          />

          <PrimaryButton
            label="Send Reset Link"
            onPress={handleSubmit(onSendResetLink)}
            variant="gradient"
            accessibilityLabel="Send reset link"
          />
        </View>

        <View style={styles.signInRow}>
          <Text style={styles.signInPrompt}>Remember your password? </Text>
          <Pressable onPress={onSignIn} accessibilityLabel="Sign in" accessibilityRole="link">
            <Text style={styles.signInLink}>Sign in</Text>
          </Pressable>
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
    justifyContent: 'center',
  },
  logo: {
    width: 48,
    height: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.brandBlue,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.body,
    marginBottom: 28,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  form: {
    width: '100%',
    marginBottom: 24,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  signInPrompt: {
    fontSize: 14,
    color: COLORS.body,
  },
  signInLink: {
    fontSize: 14,
    color: COLORS.link,
    fontWeight: '600',
  },
});
