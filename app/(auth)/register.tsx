import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';
import { z } from 'zod';

import { CTAButton } from '@/components/CTAButton';
import { FormTextInput } from '@/components/FormTextInput';
import { Screen } from '@/components/Screen';
import { SocialButton } from '@/components/SocialButton';

const LOGO = require('@/assets/images/pliz-logo.png');

const signupSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

const COLORS = {
  background: '#FFFFFF',
  brandBlue: '#2E8BEA',
  heading: '#1F2937',
  body: '#6B7280',
  link: '#2E8BEA',
} as const;

export default function RegisterScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSignUp = (data: SignupFormData) => {
    // Stub: replace with real auth later
    console.log('Sign up', data);
    router.push('/(auth)/signup-profile' as import('expo-router').Href);
  };

  const onApple = () => {
    // TODO: expo-auth-session / Apple Auth
  };

  const onGoogle = () => {
    // TODO: expo-auth-session / Google
  };

  const onSignIn = () => {
    router.push('/(auth)/login' as import('expo-router').Href);
  };

  return (
    <Screen backgroundColor={COLORS.background} scrollable>
      <View style={styles.content}>
          <View style={styles.logoSection}>
            <Image source={LOGO} style={styles.logo} contentFit="contain" />
            
          </View>
          <Text style={styles.appName}>Pliz</Text>    
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Start your journey with Pliz</Text>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormTextInput
                  label="Email Address"
                  leftIcon="person-outline"
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

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormTextInput
                  label="Create Password"
                  leftIcon="lock-closed-outline"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!passwordVisible}
                  onToggleSecure={() => setPasswordVisible((v) => !v)}
                  hint="Use a mix of Letters, Numbers and Symbols"
                  error={errors.password?.message}
                  accessibilityLabel="Create password"
                />
              )}
            />

            <CTAButton
              label="Sign up"
              onPress={handleSubmit(onSignUp)}
              variant="gradient"
              accessibilityLabel="Sign up"
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialColumn}>
            <SocialButton provider="apple" onPress={onApple} />
            <SocialButton provider="google" onPress={onGoogle} />
          </View>

          <View style={styles.signInRow}>
            <Text style={styles.signInPrompt}>Already have an Account? </Text>
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.body,
    opacity: 0.4,
  },
  dividerText: {
    fontSize: 14,
    color: COLORS.body,
  },
  socialColumn: {
    width: '100%',
    gap: 12,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
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
