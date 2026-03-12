import Ionicons from '@expo/vector-icons/Ionicons';
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

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const COLORS = {
  background: '#FFFFFF',
  brandBlue: '#2E8BEA',
  heading: '#1F2937',
  body: '#6B7280',
  link: '#2E8BEA',
} as const;

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSignIn = (data: LoginFormData) => {
    // Stub: replace with real auth later
    console.log('Sign in', data, { rememberMe });
    router.replace('/(tabs)' as import('expo-router').Href);
  };

  const onForgotPassword = () => {
    router.push('/(auth)/forgot-password' as import('expo-router').Href);
  };

  const onApple = () => {
    // TODO: expo-auth-session / Apple Auth
  };

  const onGoogle = () => {
    // TODO: expo-auth-session / Google
  };

  const onRegister = () => {
    router.push('/(auth)/register' as import('expo-router').Href);
  };

  return (
    <Screen backgroundColor={COLORS.background} scrollable>
      <View style={styles.content}>
          {/* Logo + brand name (logo centered; Pliz left-aligned in content) */}
          <View style={styles.logoSection}>
            <Image source={LOGO} style={styles.logo} contentFit="contain" />
            
          </View>
          <Text style={styles.appName}>Pliz</Text>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>
            Sign in to continue helping or receiving help
          </Text>

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
                  label="Password"
                  leftIcon="lock-closed-outline"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!passwordVisible}
                  onToggleSecure={() => setPasswordVisible((v) => !v)}
                  error={errors.password?.message}
                  accessibilityLabel="Password"
                />
              )}
            />

            <View style={styles.rememberForgotRow}>
              <Pressable
                onPress={() => setRememberMe((v) => !v)}
                style={styles.rememberRow}
                accessibilityLabel="Remember me"
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.rememberLabel}>Remember me</Text>
              </Pressable>
              <Pressable
                onPress={onForgotPassword}
                accessibilityLabel="Forgot password"
                accessibilityRole="link"
              >
                <Text style={styles.forgotLink}>Forgot Password?</Text>
              </Pressable>
            </View>

            <CTAButton
              label="Sign In"
              onPress={handleSubmit(onSignIn)}
              variant="gradient"
              accessibilityLabel="Sign in"
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

          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>Don&apos;t have an Account? </Text>
            <Pressable onPress={onRegister} accessibilityLabel="Register" accessibilityRole="link">
              <Text style={styles.registerLink}>Register</Text>
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
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  welcomeSubtitle: {
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
  rememberForgotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.body,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.brandBlue,
    borderColor: COLORS.brandBlue,
  },
  rememberLabel: {
    fontSize: 15,
    color: COLORS.heading,
    fontWeight: '500',
  },
  forgotLink: {
    fontSize: 14,
    color: COLORS.link,
    fontWeight: '500',
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
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    flexWrap: 'wrap',
  },
  registerPrompt: {
    fontSize: 14,
    color: COLORS.body,
  },
  registerLink: {
    fontSize: 14,
    color: COLORS.link,
    fontWeight: '600',
  },
});
