import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { Text } from '@/components/Text';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressBar } from '@/components/ProgressBar';
import { AmountChip } from '@/components/request/AmountChip';
import { RequestDetailHeader } from '@/components/request/RequestDetailHeader';
import { Screen } from '@/components/Screen';
import {
  getPlatformFee,
  getRequestDetail,
  getRequestReceives,
} from '@/mock/requests';

const AMOUNT_OPTIONS = [
  { value: 1000, label: 'N1K' },
  { value: 2000, label: 'N2K' },
  { value: 5000, label: 'N5K' },
  { value: 10000, label: 'N10K' },
];

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export default function RequestDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0];
  const request = useMemo(
    () => (id ? getRequestDetail(id) : null),
    [id]
  );

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showName, setShowName] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | null>(null);

  const contributionAmount = selectedAmount ?? (customAmount ? parseInt(customAmount.replace(/\D/g, ''), 10) || 0 : 0);
  const amountNeeded = request ? request.goal - request.raised : 0;

  if (!request) {
    return (
      <Screen backgroundColor="#FFFFFF">
        <RequestDetailHeader />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Request not found</Text>
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

  return (
    <Screen backgroundColor="#FFFFFF">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <RequestDetailHeader />

        <View style={styles.requesterRow}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.requesterInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{name}</Text>
              {badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.meta}>
              {categoryLabel} · {timeAgo}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{fullDescription}</Text>

        <View style={styles.engagementRow}>
          <View style={styles.engagementItem}>
            <Ionicons name="thumbs-up-outline" size={18} color="#6B7280" />
            <Text style={styles.engagementCount}>{thumbsUp}</Text>
          </View>
          <View style={styles.engagementItem}>
            <Ionicons name="heart" size={18} color="#EF4444" />
            <Text style={styles.engagementCount}>{hearts}</Text>
          </View>
          <View style={styles.engagementItem}>
            <Ionicons name="gift-outline" size={18} color="#F59E0B" />
            <Text style={styles.engagementCount}>{gifts}</Text>
          </View>
          <View style={styles.engagementItem}>
            <Ionicons name="trophy-outline" size={18} color="#F59E0B" />
            <Text style={styles.engagementCount}>{crowns}</Text>
          </View>
          <View style={styles.engagementItem}>
            <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
            <Text style={styles.engagementCount}>{messages}</Text>
          </View>
        </View>

        <View style={styles.fundingSection}>
          <View style={styles.fundingTop}>
            <Text style={styles.fundingAmount}>
              {formatNaira(raised)} / {formatNaira(goal)}
            </Text>
            <View style={styles.timeWrap}>
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text style={styles.timeText}>{timeRemaining}</Text>
            </View>
          </View>
          <Text style={styles.stillNeeded}>
            {formatNaira(amountNeeded)} still needed
          </Text>
          <View style={styles.progressWrap}>
            <ProgressBar percent={percent} height={8} />
          </View>
        </View>

        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownRow}>
            Amount requested
            <Text style={styles.breakdownValue}> {formatNaira(goal)}</Text>
          </Text>
          <Text style={styles.breakdownRow}>
            Platform fee (5%) ⓘ
            <Text style={styles.breakdownValue}> -{formatNaira(platformFee)}</Text>
          </Text>
          <Text style={[styles.breakdownRow, styles.breakdownReceives]}>
            Requester receives
            <Text style={styles.breakdownReceivesValue}> {formatNaira(requesterReceives)}</Text>
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Choose Amount</Text>
        <View style={styles.amountRow}>
          {AMOUNT_OPTIONS.map((opt) => (
            <AmountChip
              key={opt.value}
              label={opt.label}
              selected={selectedAmount === opt.value}
              onPress={() => {
                setSelectedAmount(opt.value);
                setCustomAmount('');
              }}
            />
          ))}
        </View>
        <Pressable
          style={styles.customAmountButton}
          onPress={() => {
            setSelectedAmount(null);
          }}
        >
          <TextInput
            style={styles.customInput}
            placeholder="Custom Amount"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            value={customAmount}
            onChangeText={(t) => {
              setCustomAmount(t);
              if (t) setSelectedAmount(null);
            }}
          />
        </Pressable>

        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <Ionicons name="eye-outline" size={20} color="#1F2937" />
            <View>
              <Text style={styles.toggleTitle}>Show my name</Text>
              <Text style={styles.toggleSubtitle}>
                Recipient will see your first name
              </Text>
            </View>
          </View>
          <Switch
            value={showName}
            onValueChange={setShowName}
            trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentRow}>
          <Pressable
            style={[styles.paymentChip, paymentMethod === 'card' && styles.paymentChipSelected]}
            onPress={() => {
              setPaymentMethod('card');
              router.push({
                pathname: '/(tabs)/payment-cards',
                params: { requestId: id },
              });
            }}
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

        <PrimaryButton
          label="Continue"
          onPress={() => {}}
          variant="gradient"
        />

        <Text style={styles.ctaSubtext}>
          Only {formatNaira(amountNeeded)} needed to complete this request
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
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
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
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
  meta: {
    fontSize: 13,
    color: '#6B7280',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1F2937',
    marginBottom: 16,
  },
  engagementRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  engagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementCount: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  fundingSection: {
    marginBottom: 20,
  },
  fundingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fundingAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    color: '#6B7280',
  },
  stillNeeded: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  progressWrap: {
    marginBottom: 4,
  },
  breakdownSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  breakdownRow: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  breakdownValue: {
    color: '#1F2937',
    fontWeight: '600',
  },
  breakdownReceives: {
    marginBottom: 0,
  },
  breakdownReceivesValue: {
    color: '#2E8BEA',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  customAmountButton: {
    marginBottom: 24,
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 8,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },
});

// import { useLocalSearchParams } from 'expo-router';
// import { StyleSheet, Text, View } from 'react-native';

// export default function RequestDetailScreen() {
//   const params = useLocalSearchParams<{ id: string }>();
//   const id = typeof params.id === 'string' ? params.id : params.id?.[0];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Request Detail</Text>
//       <Text style={styles.id}>ID: {id}</Text>
//       <Text style={styles.text}>Basic screen is rendering correctly.</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     padding: 24,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 12,
//   },
//   id: {
//     fontSize: 18,
//     color: '#2563EB',
//     marginBottom: 12,
//   },
//   text: {
//     fontSize: 16,
//     color: '#374151',
//   },
// });