import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

const HEADING = '#1F2937';
const BODY = '#6B7280';

export interface SummaryCardsProps {
  total: number;
  funded: number;
  active: number;
}

export function SummaryCards({ total, funded, active }: SummaryCardsProps) {
  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Text style={styles.value}>{total}</Text>
        <Text style={styles.label}>Total</Text>
      </View>
      <View style={styles.card}>
        <Text style={[styles.value, styles.valueGreen]}>{funded}</Text>
        <Text style={styles.label}>Funded</Text>
      </View>
      <View style={styles.card}>
        <Text style={[styles.value, styles.valueBlue]}>{active}</Text>
        <Text style={styles.label}>Active</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: HEADING,
    marginBottom: 4,
  },
  valueGreen: {
    color: '#059669',
  },
  valueBlue: {
    color: '#2E8BEA',
  },
  label: {
    fontSize: 13,
    color: BODY,
  },
});
