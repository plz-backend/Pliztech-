import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Text } from '@/components/Text';

import { AppHeaderTitleRow } from '@/components/layout/AppHeaderTitleRow';
import { Screen } from '@/components/Screen';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import {
  getKycStatus,
  resendKycPhoneOtp,
  sendKycPhoneOtp,
  submitKyc,
  updateKyc,
  verifyKycPhoneOtp,
  type KycStatusPayload,
} from '@/lib/api/kyc';
import { PlizApiError } from '@/lib/api/types';
import { getAccessToken } from '@/lib/auth/access-token';
import {
  isUnauthorizedSessionError,
  recoverFromUnauthorized,
} from '@/lib/auth/session-expired';

const RESEND_COOLDOWN_SEC = 60;

function identityReviewInFlight(
  verification: KycStatusPayload['verification'] | undefined
): boolean {
  if (!verification?.verificationType) return false;
  return verification.status === 'pending' || verification.status === 'under_review';
}

export default function KycVerificationScreen() {
  const { refreshUser, signOut } = useCurrentUser();

  const [status, setStatus] = useState<KycStatusPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const [bvn, setBvn] = useState('');
  const [otpBusy, setOtpBusy] = useState(false);
  const [bvnBusy, setBvnBusy] = useState(false);
  const [resendSec, setResendSec] = useState(0);

  useEffect(() => {
    if (resendSec <= 0) return;
    const t = setInterval(() => {
      setResendSec((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [resendSec]);

  const loadStatus = useCallback(
    async (retryAfterRefresh = false) => {
      const token = await getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getKycStatus(token);
        setStatus(data);
      } catch (e) {
        if (isUnauthorizedSessionError(e) && !retryAfterRefresh) {
          const recovered = await recoverFromUnauthorized(signOut);
          if (recovered) {
            await loadStatus(true);
            return;
          }
        }
        const msg = e instanceof PlizApiError ? e.message : 'Could not load verification status.';
        Alert.alert('Error', msg);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    },
    [signOut]
  );

  useFocusEffect(
    useCallback(() => {
      void loadStatus();
    }, [loadStatus])
  );

  const steps = status?.steps ?? [];
  const verification = status?.verification;
  const ui = status?.ui;

  const showPhoneSection = steps[0]?.completed === true && steps[1]?.completed === false;

  const showBvnForm =
    steps[1]?.completed === true &&
    !verification?.isVerified &&
    !identityReviewInFlight(verification) &&
    (verification?.status !== 'rejected' || verification?.canRetry === true);

  const useUpdateEndpoint = verification?.status === 'rejected' && verification?.canRetry;

  const handleUiPrimary = async () => {
    if (!ui) return;
    const url = ui.buttonUrl;

    if (url.startsWith('mailto:')) {
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
      return;
    }

    if (url === '/kyc/status') {
      await loadStatus();
      return;
    }

    if (url === '/begs/create') {
      router.push('/(tabs)/(main)/create');
      return;
    }

    if (url === '/kyc/start' || url === '/kyc/update') {
      if (!steps[0]?.completed) {
        router.push('/(tabs)/personal-info');
        return;
      }
      if (!steps[1]?.completed) {
        Alert.alert(
          'Verify your phone',
          'Confirm the phone number on your profile — we will send a code by SMS.'
        );
        return;
      }
      if (showBvnForm) {
        Alert.alert(
          'Enter your BVN',
          'Use the Bank Verification Number field below, then submit.'
        );
        return;
      }
      await loadStatus();
    }
  };

  const onSendOtp = async () => {
    const token = await getAccessToken();
    if (!token) return;
    setOtpBusy(true);
    try {
      await sendKycPhoneOtp(token);
      setResendSec(RESEND_COOLDOWN_SEC);
      Alert.alert('Code sent', 'Enter the 6-digit code we sent to your phone.');
      await loadStatus();
    } catch (e) {
      const msg = e instanceof PlizApiError ? e.message : 'Could not send code.';
      Alert.alert('Could not send', msg);
    } finally {
      setOtpBusy(false);
    }
  };

  const onResendOtp = async () => {
    if (resendSec > 0) return;
    const token = await getAccessToken();
    if (!token) return;
    setOtpBusy(true);
    try {
      await resendKycPhoneOtp(token);
      setResendSec(RESEND_COOLDOWN_SEC);
      Alert.alert('Code sent', 'A new code is on its way.');
    } catch (e) {
      const msg = e instanceof PlizApiError ? e.message : 'Could not resend.';
      Alert.alert('Could not resend', msg);
    } finally {
      setOtpBusy(false);
    }
  };

  const onVerifyOtp = async () => {
    const token = await getAccessToken();
    if (!token) return;
    const code = otp.replace(/\D/g, '');
    if (code.length !== 6) {
      Alert.alert('Invalid code', 'Enter the 6-digit code from SMS.');
      return;
    }
    setOtpBusy(true);
    try {
      await verifyKycPhoneOtp(token, code);
      setOtp('');
      await loadStatus();
      await refreshUser();
      Alert.alert('Phone verified', 'You can now verify your identity with your BVN.');
    } catch (e) {
      const msg = e instanceof PlizApiError ? e.message : 'Verification failed.';
      Alert.alert('Could not verify', msg);
    } finally {
      setOtpBusy(false);
    }
  };

  const onSubmitBvn = async () => {
    const token = await getAccessToken();
    if (!token) return;
    const digits = bvn.replace(/\D/g, '');
    if (digits.length !== 11) {
      Alert.alert('Invalid BVN', 'BVN must be exactly 11 digits.');
      return;
    }
    setBvnBusy(true);
    try {
      if (useUpdateEndpoint) {
        await updateKyc(token, { verificationType: 'bvn', bvn: digits });
      } else {
        await submitKyc(token, { verificationType: 'bvn', bvn: digits });
      }
      setBvn('');
      await loadStatus();
      await refreshUser();
      Alert.alert(
        'Submitted',
        'We are verifying your details. This usually takes less than two minutes.'
      );
    } catch (e) {
      const msg = e instanceof PlizApiError ? e.message : 'Submission failed.';
      Alert.alert('Could not submit', msg);
    } finally {
      setBvnBusy(false);
    }
  };

  return (
    <Screen backgroundColor="#F9FAFB" scrollable>
      <AppHeaderTitleRow title="Identity verification" backIconColor="#9CA3AF" />

      <View style={styles.content}>
        {loading && !status ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#EA580C" />
          </View>
        ) : status && ui ? (
          <>
            <View style={styles.heroCard}>
              <Text style={styles.heroTitle}>{ui.title}</Text>
              <Text style={styles.heroBody}>{ui.body}</Text>
              <Pressable
                style={({ pressed }) => [styles.heroButton, pressed && styles.pressed]}
                onPress={() => void handleUiPrimary()}
              >
                <Text style={styles.heroButtonText}>{ui.buttonLabel}</Text>
                <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
              </Pressable>
            </View>

            <Text style={styles.sectionLabel}>Progress</Text>
            <View style={styles.stepsCard}>
              {steps.map((s, i) => (
                <View
                  key={s.step}
                  style={[styles.stepRow, i === steps.length - 1 && styles.stepRowLast]}
                >
                  <View style={styles.stepIcon}>
                    <Ionicons
                      name={s.completed ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={s.completed ? '#22C55E' : '#D1D5DB'}
                    />
                  </View>
                  <View style={styles.stepText}>
                    <Text style={styles.stepLabel}>{s.label}</Text>
                    <Text style={styles.stepDesc}>{s.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            {verification?.status === 'rejected' && verification.rejectionReason ? (
              <View style={styles.rejectBanner}>
                <Ionicons name="alert-circle-outline" size={20} color="#B45309" />
                <Text style={styles.rejectText}>{verification.rejectionReason}</Text>
              </View>
            ) : null}

            {showPhoneSection ? (
              <View style={styles.actionCard}>
                <Text style={styles.actionTitle}>Phone number</Text>
                <Text style={styles.actionHint}>
                  We send a one-time code to the number on your profile.
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
                  onPress={() => void onSendOtp()}
                  disabled={otpBusy}
                >
                  {otpBusy ? (
                    <ActivityIndicator color="#EA580C" />
                  ) : (
                    <Text style={styles.secondaryBtnText}>Send verification code</Text>
                  )}
                </Pressable>
                <TextInput
                  style={styles.input}
                  placeholder="6-digit code"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={(t) => setOtp(t.replace(/\D/g, ''))}
                />
                <View style={styles.otpActions}>
                  <Pressable
                    style={({ pressed }) => [styles.linkBtn, pressed && styles.pressed]}
                    onPress={() => void onVerifyOtp()}
                    disabled={otpBusy}
                  >
                    <Text style={styles.linkBtnText}>Verify code</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.linkBtn,
                      resendSec > 0 && styles.linkDisabled,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => void onResendOtp()}
                    disabled={otpBusy || resendSec > 0}
                  >
                    <Text style={styles.linkBtnText}>
                      {resendSec > 0 ? `Resend (${resendSec}s)` : 'Resend code'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : null}

            {showBvnForm ? (
              <View style={styles.actionCard}>
                <Text style={styles.actionTitle}>BVN verification</Text>
                <Text style={styles.actionHint}>
                  Enter the 11-digit Bank Verification Number linked to your bank account. NIN and
                  passport with document upload can be added from the web app when available.
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="11-digit BVN"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={11}
                  value={bvn}
                  onChangeText={(t) => setBvn(t.replace(/\D/g, ''))}
                />
                <Pressable
                  style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
                  onPress={() => void onSubmitBvn()}
                  disabled={bvnBusy}
                >
                  {bvnBusy ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryBtnText}>
                      {useUpdateEndpoint ? 'Resubmit BVN' : 'Submit BVN'}
                    </Text>
                  )}
                </Pressable>
              </View>
            ) : null}

            {!steps[0]?.completed ? (
              <Pressable
                style={({ pressed }) => [styles.outlineBtn, pressed && styles.pressed]}
                onPress={() => router.push('/(tabs)/personal-info')}
              >
                <Text style={styles.outlineBtnText}>Complete profile first</Text>
              </Pressable>
            ) : null}
          </>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },
  centered: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  heroBody: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EA580C',
    paddingVertical: 14,
    borderRadius: 12,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.88,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stepRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stepRowLast: {
    borderBottomWidth: 0,
  },
  stepIcon: {
    marginRight: 12,
    paddingTop: 2,
  },
  stepText: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  rejectBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  rejectText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  actionHint: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDBA74',
    backgroundColor: '#FFFBF0',
    marginBottom: 12,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EA580C',
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkBtn: {
    paddingVertical: 8,
  },
  linkDisabled: {
    opacity: 0.5,
  },
  linkBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB',
  },
  primaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#EA580C',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  outlineBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  outlineBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
});
