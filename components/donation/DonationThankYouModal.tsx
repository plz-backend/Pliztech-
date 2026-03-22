import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/Text';

const BLUE = '#2E8BEA';
const TITLE = '#111827';
const MUTED = '#6B7280';
const BADGE_BORDER = '#2E8BEA';
const BADGE_BG = '#EFF6FF';

function formatNaira(amount: number) {
  return `₦${Math.round(amount).toLocaleString()}`;
}

function recipientEncouragementName(fullName: string): string {
  const t = fullName.trim();
  if (!t) return 'them';
  return t.split(/\s+/)[0] ?? t;
}

export type DonationThankYouModalProps = {
  visible: boolean;
  onDone: () => void;
  amount: number;
  recipientName: string;
  /** When true, show “{name} will see your first name…”. When false, show anonymous copy. */
  showRecipientName: boolean;
};

export function DonationThankYouModal({
  visible,
  onDone,
  amount,
  recipientName,
  showRecipientName,
}: DonationThankYouModalProps) {
  const insets = useSafeAreaInsets();
  const encouragementTarget = recipientEncouragementName(recipientName);
  const displayRecipient =
    recipientName.trim() || 'the recipient';

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onDone}>
      <View style={[styles.backdrop, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.iconCluster}>
            <View style={styles.sparkleTL}>
              <Text style={styles.sparkleText}>✦</Text>
            </View>
            <View style={styles.sparkleTR}>
              <Text style={styles.sparkleText}>✦</Text>
            </View>
            <View style={styles.sparkleTM}>
              <Text style={styles.sparkleTextSmall}>✦</Text>
            </View>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={36} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.heading}>Thank You!</Text>

          <Text style={styles.bodyLine}>
            <Text style={styles.bodyMuted}>Your </Text>
            <Text style={styles.bodyAmount}>{formatNaira(amount)}</Text>
            <Text style={styles.bodyMuted}> donation to </Text>
            <Text style={styles.bodyName}>{displayRecipient}</Text>
            <Text style={styles.bodyMuted}> is on its way.</Text>
          </Text>

          {showRecipientName ? (
            <Text style={styles.privacyLine}>
              {displayRecipient} will see your first name with your donation.
            </Text>
          ) : (
            <Text style={styles.privacyLine}>
              Your donation will appear anonymously to {displayRecipient}.
            </Text>
          )}

          <View style={styles.differenceBadge}>
            <Text style={styles.differenceBadgeText}>You made a difference today</Text>
          </View>

          <Text style={styles.encouragePrompt}>
            Send {encouragementTarget} some encouragement
          </Text>

          <View style={styles.flagRow}>
            {[0, 1, 2, 3].map((i) => (
              <Pressable
                key={i}
                style={styles.flagBtn}
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                accessibilityLabel="Send encouragement"
                accessibilityRole="button"
              >
                <Ionicons name="flag-outline" size={22} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={onDone}
            style={styles.doneOuter}
            accessibilityRole="button"
            accessibilityLabel="Done"
          >
            <LinearGradient
              colors={['#5BA8F0', '#1a3a5c']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.doneGradient}
            >
              <Text style={styles.doneLabel}>Done</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const CHECK_SIZE = 88;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  iconCluster: {
    width: CHECK_SIZE + 36,
    height: CHECK_SIZE + 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  checkCircle: {
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: CHECK_SIZE / 2,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleTL: {
    position: 'absolute',
    top: 2,
    left: 0,
  },
  sparkleTR: {
    position: 'absolute',
    top: 0,
    right: 4,
  },
  sparkleTM: {
    position: 'absolute',
    top: -4,
    right: 28,
  },
  sparkleText: {
    fontSize: 18,
    color: BLUE,
    fontWeight: '700',
  },
  sparkleTextSmall: {
    fontSize: 14,
    color: BLUE,
    fontWeight: '700',
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: TITLE,
    textAlign: 'center',
    marginBottom: 16,
  },
  bodyLine: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  bodyMuted: {
    color: MUTED,
  },
  bodyAmount: {
    color: BLUE,
    fontWeight: '700',
  },
  bodyName: {
    color: TITLE,
    fontWeight: '700',
  },
  privacyLine: {
    fontSize: 14,
    lineHeight: 20,
    color: MUTED,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  differenceBadge: {
    borderWidth: 1,
    borderColor: BADGE_BORDER,
    backgroundColor: BADGE_BG,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 24,
  },
  differenceBadgeText: {
    fontSize: 15,
    fontWeight: '600',
    color: BLUE,
    textAlign: 'center',
  },
  encouragePrompt: {
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
    marginBottom: 14,
  },
  flagRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 28,
  },
  flagBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneOuter: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 20,
    overflow: 'hidden',
  },
  doneGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  doneLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
