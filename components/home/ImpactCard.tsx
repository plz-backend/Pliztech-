import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

const GRADIENT_COLORS = ['#2E8BEA', '#172033'] as const;

export interface ImpactCardProps {
  totalGiven: number;
  peopleHelped: number;
  weeklyHelped: number;
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export function ImpactCard({ totalGiven, peopleHelped, weeklyHelped }: ImpactCardProps) {
  return (
    <LinearGradient
      colors={[...GRADIENT_COLORS]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="trending-up" size={20} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Your Impact</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <View style={styles.statLabelRow}>
            <Ionicons name="trending-up" size={14} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statLabel}>Total Given</Text>
          </View>
          <Text style={styles.statValue}>{formatNaira(totalGiven)}</Text>
        </View>
        <View style={styles.stat}>
          <View style={styles.statLabelRow}>
            <Ionicons name="people" size={14} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statLabel}>People Helped</Text>
          </View>
          <Text style={styles.statValue}>{peopleHelped}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Ionicons name="heart" size={14} color="#FFFFFF" style={styles.footerIcon} />
        <Text style={styles.footerText}>
          You have helped {weeklyHelped} people this week
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {
    flex: 1,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});
