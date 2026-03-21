import Ionicons from '@expo/vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { CTAButton } from '@/components/CTAButton';
import { Text } from '@/components/Text';

import { ProgressBar } from '@/components/ProgressBar';
import { AmountChip } from '@/components/request/AmountChip';
import { RequestDetailHeader } from '@/components/request/RequestDetailHeader';
import { Screen } from '@/components/Screen';
import { REQUEST_CATEGORIES } from '@/constants/categories';
import {
  begFeedItemToRequestDetail,
  getBegById,
} from '@/lib/api/beg';
import { initializeDonation } from '@/lib/api/donations';
import { PlizApiError } from '@/lib/api/types';
import { getAccessToken } from '@/lib/auth/access-token';
import type { RequestDetail } from '@/mock/requests';
import {
  getPlatformFee,
  getRequestReceives,
} from '@/mock/requests';

const AMOUNT_OPTIONS = [
  { value: 1000, label: '₦1K' },
  { value: 2000, label: '₦2K' },
  { value: 5000, label: '₦5K' },
  { value: 10000, label: '₦10K' },
];

/** Figma-style emoji reaction pills (counts from API when available). */
const REACTION_PILLS: {
  emoji: string;
  field: 'thumbsUp' | 'hearts' | 'gifts' | 'crowns' | 'messages';
}[] = [
  { emoji: '👍', field: 'thumbsUp' },
  { emoji: '❤️', field: 'hearts' },
  { emoji: '😂', field: 'gifts' },
  { emoji: '🥳', field: 'crowns' },
  { emoji: '😢', field: 'messages' },
];

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

/** Wide readable column on tablet / web; full width on phones. */
const REQUEST_DETAIL_MAX_WIDTH = 960;

export default function RequestDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0];

  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const loadRequest = useCallback(async () => {
    if (!id) {
      setRequest(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const beg = await getBegById(id);
      setRequest(begFeedItemToRequestDetail(beg));
    } catch (e) {
      setRequest(null);
      setError(
        e instanceof PlizApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to load request'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadRequest();
  }, [loadRequest]);

  /** Default so Continue can POST without forcing a chip tap (was easy to miss → no fetch). */
  const [selectedAmount, setSelectedAmount] = useState<number | null>(
    AMOUNT_OPTIONS[0]?.value ?? null
  );
  const [customAmount, setCustomAmount] = useState('');
  const [showName, setShowName] = useState(true);
  /** Default `card` so Continue can call the API without an extra tap. Bank maps to `transfer` on the server. */
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [donationSubmitting, setDonationSubmitting] = useState(false);
  const customAmountRef = useRef<TextInput>(null);

  const amountNeeded = request ? Math.max(0, request.goal - request.raised) : 0;

  const onContinueDonation = useCallback(async () => {
    if (donationSubmitting) return;
    if (!id?.trim()) {
      Alert.alert('Request', 'Missing request id. Go back and open the request again.');
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      Alert.alert('Sign in required', 'Please log in to donate.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log in',
          onPress: () => router.push('/(auth)/login'),
        },
      ]);
      return;
    }

    const parsedCustom = parseInt(String(customAmount).replace(/\D/g, ''), 10);
    const rawAmount =
      selectedAmount ?? (Number.isFinite(parsedCustom) ? parsedCustom : 0);

    if (!Number.isFinite(rawAmount) || rawAmount < 100) {
      Alert.alert('Amount', 'Select a preset amount or enter at least ₦100.');
      return;
    }

    setDonationSubmitting(true);
    try {
      const result = await initializeDonation(token, {
        begId: id,
        amount: rawAmount,
        paymentMethod: paymentMethod === 'bank' ? 'bank' : 'card',
        isAnonymous: !showName,
      });

      if (result.kind === 'checkout') {
        await WebBrowser.openBrowserAsync(result.paymentUrl);
        void loadRequest();
      } else {
        Alert.alert(
          'Payment started',
          'Your donation is processing. You will see updates when it completes.',
          [{ text: 'OK', onPress: () => void loadRequest() }]
        );
      }
    } catch (e) {
      if (e instanceof PlizApiError) {
        const detail =
          e.errors.length > 0
            ? e.errors.map((x) => x.message).join('\n')
            : e.message;
        Alert.alert('Could not start donation', detail);
      } else {
        Alert.alert(
          'Could not start donation',
          e instanceof Error ? e.message : 'Something went wrong'
        );
      }
    } finally {
      setDonationSubmitting(false);
    }
  }, [
    id,
    donationSubmitting,
    paymentMethod,
    selectedAmount,
    customAmount,
    showName,
    loadRequest,
  ]);

  const categoryIcon = useMemo(() => {
    if (!request) return 'briefcase-outline' as keyof typeof Ionicons.glyphMap;
    const cat = REQUEST_CATEGORIES.find((c) => c.id === request.categoryId);
    return (cat?.icon ?? 'briefcase-outline') as keyof typeof Ionicons.glyphMap;
  }, [request]);

  if (!id) {
    return (
      <Screen backgroundColor="#FFFFFF">
        <View style={styles.pageContent}>
          <RequestDetailHeader />
          <View style={styles.centered}>
            <Text style={styles.errorText}>Request not found</Text>
          </View>
        </View>
      </Screen>
    );
  }

  if (loading && !request) {
    return (
      <Screen backgroundColor="#FFFFFF">
        <View style={styles.pageContent}>
          <RequestDetailHeader />
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#2E8BEA" />
            <Text style={styles.loadingHint}>Loading request…</Text>
          </View>
        </View>
      </Screen>
    );
  }

  if (error && !request) {
    return (
      <Screen backgroundColor="#FFFFFF">
        <View style={styles.pageContent}>
          <RequestDetailHeader />
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => void loadRequest()}
              accessibilityRole="button"
              accessibilityLabel="Retry loading request"
            >
              <Text style={styles.retryLabel}>Try again</Text>
            </Pressable>
          </View>
        </View>
      </Screen>
    );
  }

  if (!request) {
    return (
      <Screen backgroundColor="#FFFFFF">
        <View style={styles.pageContent}>
          <RequestDetailHeader />
          <View style={styles.centered}>
            <Text style={styles.errorText}>Request not found</Text>
          </View>
        </View>
      </Screen>
    );
  }

  const {
    name,
    initial,
    avatarColor,
    categoryLabel,
    badge,
    fullDescription,
    timeAgo,
    timeRemaining,
    raised,
    goal,
    percent,
    thumbsUp,
    hearts,
    gifts,
    crowns,
    messages,
  } = request;

  const platformFee = getPlatformFee(goal);
  const requesterReceives = getRequestReceives(goal);

  const reactionCounts: Record<string, number> = {
    thumbsUp,
    hearts,
    gifts,
    crowns,
    messages,
  };

  /** Figma: clock badge shows posted time (“8h ago”), not time remaining. */
  const fundingPostedBadge =
    timeRemaining === 'Expired' ? 'Ended' : timeAgo;

  return (
    <Screen backgroundColor="#FFFFFF">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        <View style={styles.pageContent}>
          <RequestDetailHeader
            onReportPress={() =>
              Alert.alert('Report request', 'Thanks for helping keep Pliz safe. Full reporting is coming soon.')
            }
          />

          <View style={styles.requesterRow}>
            <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.requesterInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {name}
                </Text>
                {badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.metaRow}>
                <Ionicons name={categoryIcon} size={15} color="#6B7280" style={styles.metaIcon} />
                <Text style={styles.meta} numberOfLines={1}>
                  {categoryLabel} · {timeAgo}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.description}>{fullDescription}</Text>

          <View style={styles.reactionsRow}>
            {REACTION_PILLS.map(({ emoji, field }) => (
              <View key={field} style={styles.reactionPill}>
                <Text style={styles.reactionEmoji}>{emoji}</Text>
                <Text style={styles.reactionCount}>{reactionCounts[field] ?? 0}</Text>
              </View>
            ))}
          </View>

          <View style={styles.fundingCard}>
            <View style={styles.fundingCardTop}>
              <View style={styles.fundingLeft}>
                <Text style={styles.fundingAmount}>
                  {formatNaira(raised)} / {formatNaira(goal)}
                </Text>
                <Text style={styles.stillNeeded}>
                  {formatNaira(amountNeeded)} still needed
                </Text>
              </View>
              <View
                style={[
                  styles.timeBadge,
                  timeRemaining === 'Expired' && styles.timeBadgeMuted,
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={timeRemaining === 'Expired' ? '#6B7280' : '#2E8BEA'}
                />
                <Text
                  style={[
                    styles.timeBadgeText,
                    timeRemaining === 'Expired' && styles.timeBadgeTextMuted,
                  ]}
                >
                  {fundingPostedBadge}
                </Text>
              </View>
            </View>

            <View style={styles.progressWrap}>
              <ProgressBar percent={percent} height={8} trackColor="#EEEEEE" fillColor="#2E8BEA" />
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.breakdownBlock}>
              <View style={styles.breakdownLine}>
                <Text style={styles.breakdownLabel}>Amount requested</Text>
                <Text style={styles.breakdownValue}>{formatNaira(goal)}</Text>
              </View>
              <View style={styles.breakdownLine}>
                <View style={styles.breakdownLabelRow}>
                  <Text style={styles.breakdownLabel}>Platform fee (5%)</Text>
                  <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
                </View>
                <Text style={styles.breakdownValueMuted}>-{formatNaira(platformFee)}</Text>
              </View>
              <View style={[styles.breakdownLine, styles.breakdownLineLast]}>
                <Text style={styles.breakdownReceivesLabel}>Requester receives</Text>
                <Text style={styles.breakdownReceivesValue}>{formatNaira(requesterReceives)}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Choose Amount</Text>
          <View style={styles.amountGrid}>
            {AMOUNT_OPTIONS.map((opt) => (
              <View key={opt.value} style={styles.amountGridCell}>
                <AmountChip
                  label={opt.label}
                  selected={selectedAmount === opt.value}
                  onPress={() => {
                    setSelectedAmount(opt.value);
                    setCustomAmount('');
                    customAmountRef.current?.blur();
                  }}
                />
              </View>
            ))}
          </View>
          <TextInput
            ref={customAmountRef}
            style={styles.customAmountField}
            placeholder="Custom Amount"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            value={customAmount}
            onChangeText={(t) => {
              setCustomAmount(t);
              if (t) setSelectedAmount(null);
            }}
            onFocus={() => setSelectedAmount(null)}
          />

          <View style={styles.privacyCard}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <Ionicons name="eye-outline" size={22} color="#1F2937" />
                <View style={styles.toggleTextWrap}>
                  <Text style={styles.toggleTitle}>Show my name</Text>
                  <Text style={styles.toggleSubtitle}>
                    Recipient will see your first name
                  </Text>
                </View>
              </View>
              <Switch
                value={showName}
                onValueChange={setShowName}
                trackColor={{ false: '#E5E7EB', true: '#2E8BEA' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentRow}>
            <Pressable
              style={[styles.paymentChip, paymentMethod === 'card' && styles.paymentChipSelected]}
              onPress={() => setPaymentMethod('card')}
            >
              <Ionicons
                name="card-outline"
                size={20}
                color={paymentMethod === 'card' ? '#2E8BEA' : '#1F2937'}
              />
              <Text
                style={[
                  styles.paymentLabel,
                  paymentMethod === 'card' && styles.paymentLabelSelected,
                ]}
              >
                Card
              </Text>
            </Pressable>
            <Pressable
              style={[styles.paymentChip, paymentMethod === 'bank' && styles.paymentChipSelected]}
              onPress={() => setPaymentMethod('bank')}
            >
              <Ionicons
                name="business-outline"
                size={20}
                color={paymentMethod === 'bank' ? '#2E8BEA' : '#1F2937'}
              />
              <Text
                style={[
                  styles.paymentLabel,
                  paymentMethod === 'bank' && styles.paymentLabelSelected,
                ]}
              >
                Bank Transfer
              </Text>
            </Pressable>
          </View>

          <CTAButton
            variant="gradient"
            label={donationSubmitting ? 'Processing…' : 'Continue'}
            onPress={() => void onContinueDonation()}
            disabled={donationSubmitting}
          />

          <Text style={styles.ctaSubtext}>
            Only {formatNaira(amountNeeded)} needed to complete this request
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    width: '100%',
    maxWidth: REQUEST_DETAIL_MAX_WIDTH,
    alignSelf: 'center',
    
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingHint: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
  },
  retryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E8BEA',
  },
  requesterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  requesterInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flexShrink: 1,
  },
  badge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E8BEA',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 6,
  },
  meta: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1F2937',
    marginBottom: 16,
  },
  reactionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  reactionEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  reactionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  fundingCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  fundingCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fundingLeft: {
    flex: 1,
    paddingRight: 8,
  },
  fundingAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  stillNeeded: {
    fontSize: 14,
    color: '#6B7280',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  timeBadgeMuted: {
    backgroundColor: '#F3F4F6',
  },
  timeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E8BEA',
  },
  timeBadgeTextMuted: {
    color: '#6B7280',
  },
  progressWrap: {
    marginBottom: 16,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  breakdownBlock: {
    gap: 0,
  },
  breakdownLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  breakdownLineLast: {
    marginBottom: 0,
    marginTop: 4,
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  breakdownValueMuted: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  breakdownReceivesLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  breakdownReceivesValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E8BEA',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amountGridCell: {
    width: '20%',
    marginBottom: 10,
  },
  /** Full-width control styled like Figma “Custom Amount” chip. */
  customAmountField: {
    width: '100%',
    minHeight: 48,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  privacyCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  toggleTextWrap: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  toggleSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  paymentChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  paymentChipSelected: {
    borderColor: '#2E8BEA',
    backgroundColor: '#EFF6FF',
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  paymentLabelSelected: {
    color: '#2E8BEA',
  },
  ctaSubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2E8BEA',
    textAlign: 'center',
    marginTop: 12,
  },
});
