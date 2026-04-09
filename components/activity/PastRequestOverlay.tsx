import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTAButton } from '@/components/CTAButton';
import { ProgressBar } from '@/components/ProgressBar';
import { Text } from '@/components/Text';
import { avatarColorFromSeed } from '@/contexts/CurrentUserContext';
import {
    begFeedItemToRequestDetail,
    formatBegCreatedTimeAgo,
    getBegById,
} from '@/lib/api/beg';
import { getBegDonations, type BegDonationApiItem } from '@/lib/api/donations';
import { PlizApiError } from '@/lib/api/types';
import type { ActivityRequest, ActivityRequestStatus } from '@/mock/activity';
import type { RequestDetail } from '@/mock/requests';

const BG = '#F9FAFB';
const CARD = '#FFFFFF';
const BORDER = '#E5E7EB';
const TITLE = '#1F2937';
const MUTED = '#6B7280';
const BLUE = '#2E8BEA';
const GREEN = '#059669';
const SECTION_BLUE = '#1E40AF';
const TESTIMONY_MAX = 280;

function formatNaira(amount: number) {
  return `₦${Math.round(amount).toLocaleString()}`;
}

function statusMeta(status: ActivityRequestStatus): { label: string; showCheck: boolean } {
  switch (status) {
    case 'funded':
      return { label: 'Fully Funded', showCheck: true };
    case 'expired':
      return { label: 'Ended', showCheck: false };
    case 'cancelled':
      return { label: 'Cancelled', showCheck: false };
    case 'pending':
      return { label: 'Pending approval', showCheck: false };
    case 'active':
      return { label: 'Active', showCheck: false };
    default:
      return { label: 'Closed', showCheck: false };
  }
}

function donorInitial(name: string): string {
  const t = name.trim();
  if (!t) return '?';
  if (t.toLowerCase() === 'anonymous') return '?';
  return t.charAt(0).toUpperCase();
}

export interface PastRequestOverlayProps {
  visible: boolean;
  onClose: () => void;
  /** Row from Activity list (title, status, time, icon while loading). */
  summary: ActivityRequest | null;
}

export function PastRequestOverlay({ visible, onClose, summary }: PastRequestOverlayProps) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<RequestDetail | null>(null);
  const [donations, setDonations] = useState<BegDonationApiItem[]>([]);
  const [testimony, setTestimony] = useState('');

  const load = useCallback(async () => {
    if (!summary?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [b, d] = await Promise.all([
        getBegById(summary.id),
        getBegDonations(summary.id, { page: 1, limit: 50 }),
      ]);
      setDetail(begFeedItemToRequestDetail(b));
      setDonations(d.donations);
    } catch (e) {
      setDetail(null);
      setDonations([]);
      setError(
        e instanceof PlizApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Could not load this request.'
      );
    } finally {
      setLoading(false);
    }
  }, [summary?.id]);

  useEffect(() => {
    if (!visible || !summary?.id) {
      setDetail(null);
      setDonations([]);
      setError(null);
      setTestimony('');
      return;
    }
    void load();
  }, [visible, summary?.id, load]);

  const meta = summary ? statusMeta(summary.status) : { label: '', showCheck: false };
  const raised = detail?.raised ?? 0;
  const goal = detail?.goal ?? summary?.amount ?? 0;
  const pct = detail?.percent ?? (goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0);

  const title = summary?.title ?? 'Request';
  const timeAgo = summary?.timeAgo ?? detail?.timeAgo ?? '';
  const categoryIcon = (summary?.icon ?? 'help-outline') as keyof typeof Ionicons.glyphMap;

  const thumbsUp = detail?.thumbsUp ?? 0;
  const hearts = detail?.hearts ?? 0;
  const gifts = detail?.gifts ?? 0;
  const reactionTotal = thumbsUp + hearts + gifts;

  const onShareStory = () => {
    if (testimony.trim().length > 0) {
      Alert.alert(
        'Thanks for sharing',
        'Your story will appear here once sharing goes live. We’re glad this help made a difference.'
      );
    } else {
      Alert.alert('Add a story', 'Write a short testimony to share how this help made a difference (optional).');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.topBar}>
          <Pressable
            onPress={onClose}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={28} color={TITLE} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {loading && !detail ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={BLUE} />
              <Text style={styles.loadingText}>Loading request…</Text>
            </View>
          ) : null}

          {error && !detail ? (
            <View style={styles.loadingBox}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={() => void load()} style={styles.retryBtn}>
                <Text style={styles.retryLabel}>Try again</Text>
              </Pressable>
            </View>
          ) : null}

          {detail && summary ? (
            <>
              <View style={styles.titleRow}>
                <View style={styles.titleIconWrap}>
                  <Ionicons name={categoryIcon} size={22} color="#6B7280" />
                </View>
                <Text style={styles.mainTitle}>{title}</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  {timeAgo}
                  {meta.label ? ` · ${meta.label}` : ''}
                </Text>
                {meta.showCheck ? (
                  <Ionicons name="checkmark-circle" size={18} color={GREEN} style={styles.metaCheck} />
                ) : null}
              </View>

              <View style={styles.amountCard}>
                <View style={styles.amountCardTop}>
                  <View style={styles.amountCardLeft}>
                    <Ionicons name="trending-up" size={20} color={BLUE} />
                    <Text style={styles.amountCardTitle}>Amount reached</Text>
                  </View>
                  <View style={[styles.pctBadge, pct >= 100 && styles.pctBadgeFull]}>
                    <Text style={[styles.pctBadgeText, pct >= 100 && styles.pctBadgeTextFull]}>
                      {pct}%
                    </Text>
                  </View>
                </View>
                <ProgressBar percent={pct} height={10} trackColor="#E5E7EB" fillColor={BLUE} />
                <View style={styles.amountRow}>
                  <Text style={styles.amountRaised}>{formatNaira(raised)}</Text>
                  <Text style={styles.amountOf}>of {formatNaira(goal)}</Text>
                </View>
              </View>

              <Text style={styles.sectionHeading}>
                <Text style={styles.sectionEmoji}>👥 </Text>
                Donor ({donations.length})
              </Text>
              {donations.length === 0 && !loading ? (
                <Text style={styles.emptyDonors}>No public donor list yet.</Text>
              ) : null}
              {donations.map((row) => {
                const name = row.donor_name?.trim() || 'Anonymous';
                const initial = donorInitial(name);
                const color = avatarColorFromSeed(row.id);
                return (
                  <View key={row.id} style={styles.donorCard}>
                    <View style={[styles.donorAvatar, { backgroundColor: color }]}>
                      <Text style={styles.donorAvatarText}>{initial}</Text>
                    </View>
                    <View style={styles.donorInfo}>
                      <Text style={styles.donorName}>{name}</Text>
                      <Text style={styles.donorTime}>
                        {formatBegCreatedTimeAgo(row.created_at)}
                      </Text>
                    </View>
                    <Text style={styles.donorAmount}>{formatNaira(Number(row.amount) || 0)}</Text>
                  </View>
                );
              })}

              <Text style={styles.sectionHeading}>
                <Text style={styles.sectionEmoji}>✨ </Text>
                Reaction ({reactionTotal})
              </Text>
              <View style={styles.reactionRow}>
                <View style={styles.reactionPill}>
                  <Text style={styles.reactionEmoji}>👍</Text>
                  <Text style={styles.reactionCount}>{thumbsUp}</Text>
                </View>
                <View style={styles.reactionPill}>
                  <Text style={styles.reactionEmoji}>❤️</Text>
                  <Text style={styles.reactionCount}>{hearts}</Text>
                </View>
                <View style={styles.reactionPill}>
                  <Text style={styles.reactionEmoji}>😂</Text>
                  <Text style={styles.reactionCount}>{gifts}</Text>
                </View>
              </View>

              <View style={styles.testimonyHeader}>
                <Text style={styles.sectionHeadingInline}>
                  <Text style={styles.sectionEmoji}>❝ </Text>
                  Your testimony
                </Text>
                <Text style={styles.optionalLabel}>optional</Text>
              </View>
              <TextInput
                style={styles.testimonyInput}
                placeholder="Share how this help made a difference... (e.g. 'Thanks to the community, I made it to my interview and later got the job!')"
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={TESTIMONY_MAX}
                value={testimony}
                onChangeText={setTestimony}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {testimony.length}/{TESTIMONY_MAX}
              </Text>

              <View style={styles.ctaWrap}>
                <CTAButton
                  variant="gradient"
                  label="Share story"
                  leftIcon="paper-plane-outline"
                  onPress={onShareStory}
                  accessibilityLabel="Share story"
                />
              </View>
            </>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  loadingBox: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: MUTED,
  },
  errorText: {
    fontSize: 15,
    color: MUTED,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  retryBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
  },
  retryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: BLUE,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  titleIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: TITLE,
    lineHeight: 26,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  metaText: {
    fontSize: 14,
    color: MUTED,
  },
  metaCheck: {
    marginLeft: 6,
  },
  amountCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  amountCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TITLE,
  },
  pctBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pctBadgeFull: {
    backgroundColor: '#D1FAE5',
  },
  pctBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: BLUE,
  },
  pctBadgeTextFull: {
    color: GREEN,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 12,
  },
  amountRaised: {
    fontSize: 18,
    fontWeight: '700',
    color: TITLE,
  },
  amountOf: {
    fontSize: 14,
    color: MUTED,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: SECTION_BLUE,
    marginBottom: 12,
  },
  sectionHeadingInline: {
    fontSize: 16,
    fontWeight: '700',
    color: SECTION_BLUE,
  },
  sectionEmoji: {
    fontSize: 16,
  },
  emptyDonors: {
    fontSize: 14,
    color: MUTED,
    marginBottom: 16,
  },
  donorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 10,
  },
  donorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  donorAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  donorInfo: {
    flex: 1,
    minWidth: 0,
  },
  donorName: {
    fontSize: 16,
    fontWeight: '700',
    color: TITLE,
  },
  donorTime: {
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
  },
  donorAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: BLUE,
  },
  reactionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  reactionEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  reactionCount: {
    fontSize: 15,
    fontWeight: '600',
    color: TITLE,
  },
  testimonyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  optionalLabel: {
    fontSize: 13,
    color: MUTED,
  },
  testimonyInput: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    fontSize: 15,
    color: TITLE,
    marginBottom: 6,
  },
  charCount: {
    fontSize: 12,
    color: MUTED,
    marginBottom: 20,
  },
  ctaWrap: {
    alignItems: 'center',
    width: '100%',
  },
});
