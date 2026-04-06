import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/Text';
import { CTA_COLORS, CTA_GRADIENT } from '@/constants/cta-buttons';

function formatNaira(amount: number) {
  return `₦${Math.round(amount).toLocaleString()}`;
}

export type RequestLiveModalProps = {
  visible: boolean;
  /** Close (X) — typically same as going home */
  onDismiss: () => void;
  onViewMyRequest: () => void;
  onBackToHome: () => void;
  amountRequested: number;
  categoryLabel: string;
  categoryEmoji: string;
  /** e.g. "Expires in 48 hours" */
  expiryLine: string;
};

export function RequestLiveModal({
  visible,
  onDismiss,
  onViewMyRequest,
  onBackToHome,
  amountRequested,
  categoryLabel,
  categoryEmoji,
  expiryLine,
}: RequestLiveModalProps) {
  const insets = useSafeAreaInsets();
  const amountStr = formatNaira(amountRequested);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onDismiss}>
      <View style={[styles.overlay, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.overlayDim} />

        <View style={styles.sheet}>
          <Pressable
            style={styles.closeBtn}
            onPress={onDismiss}
            hitSlop={12}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <View style={styles.closeCircle}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </View>
          </Pressable>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.heroIconWrap}>
              <View style={styles.sparkleCluster} pointerEvents="none">
                <Text style={styles.sparkle}>✦</Text>
                <Text style={[styles.sparkle, styles.sparkleMid]}>✦</Text>
                <Text style={[styles.sparkle, styles.sparkleSmall]}>✦</Text>
              </View>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={44} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.title}>Request submitted</Text>

            <Text style={styles.subtitle}>
              <Text style={styles.subtitleMuted}>Your request for </Text>
              <Text style={styles.subtitleAmount}>{amountStr}</Text>
              <Text style={styles.subtitleMuted}>
                {' '}
                has been received. An admin must approve it before it is published. Once approved, it
                will appear on your dashboard and in the community.
              </Text>
            </Text>

            <View style={styles.detailCard}>
              <View style={styles.categoryRow}>
                <Text style={styles.categoryLine}>
                  <Text style={styles.categoryEmoji}>{categoryEmoji} </Text>
                  <Text style={styles.categoryTitle}>{categoryLabel}</Text>
                </Text>
              </View>
              <View style={styles.expiryRow}>
                <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                <Text style={styles.expiryText}> {expiryLine}</Text>
              </View>
            </View>

            <View style={styles.tipBanner}>
              <Text style={styles.tipEmoji}>💡 </Text>
              <Text style={styles.tipText}>
                <Text style={styles.tipBold}>Note: </Text>
                Until it is approved, your request will not appear publicly. After approval, open your
                dashboard to view and share it.
              </Text>
            </View>

            <Pressable
              onPress={onViewMyRequest}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="View my request"
            >
              <Text style={styles.secondaryBtnText}>View My Request</Text>
            </Pressable>

            <Pressable onPress={onBackToHome} style={styles.primaryOuter} accessibilityRole="button">
              <LinearGradient
                colors={[...CTA_GRADIENT.gradientColors]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.primaryGradient}
              >
                <Text style={styles.primaryText}>Back to Home</Text>
              </LinearGradient>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const NAVY = '#172033';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  overlayDim: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    maxHeight: '92%',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    paddingTop: 52,
    paddingHorizontal: 22,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 2,
  },
  closeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  heroIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: 100,
    height: 100,
  },
  successCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: CTA_COLORS.blueStart,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CTA_COLORS.blueStart,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  sparkleCluster: {
    position: 'absolute',
    top: -4,
    right: -8,
    width: 56,
    height: 40,
    zIndex: 1,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 14,
    color: '#93C5FD',
    fontWeight: '300',
  },
  sparkleMid: {
    top: 8,
    right: 12,
    fontSize: 11,
    color: '#BFDBFE',
  },
  sparkleSmall: {
    top: 18,
    right: 2,
    fontSize: 9,
    color: '#93C5FD',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: NAVY,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  subtitleMuted: {
    color: '#6B7280',
  },
  subtitleAmount: {
    color: CTA_COLORS.blueStart,
    fontWeight: '700',
  },
  detailCard: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 18,
    alignItems: 'center',
  },
  categoryRow: {
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  categoryLine: {
    textAlign: 'center',
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiryText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  tipBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 22,
  },
  tipEmoji: {
    fontSize: 16,
    lineHeight: 22,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: CTA_COLORS.blueStart,
    fontWeight: '500',
  },
  tipBold: {
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  pressed: {
    opacity: 0.88,
  },
  primaryOuter: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
