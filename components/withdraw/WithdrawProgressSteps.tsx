import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

const BLUE = '#2E8BEA';
const TRACK = '#E5E7EB';

export type WithdrawProgressStepsProps = {
  currentStep: number;
  totalSteps?: number;
};

export function WithdrawProgressSteps({
  currentStep,
  totalSteps = 3,
}: WithdrawProgressStepsProps) {
  const safeStep = Math.min(Math.max(1, currentStep), totalSteps);

  return (
    <View style={styles.wrap}>
      <View style={styles.bars}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const n = i + 1;
          const active = n <= safeStep;
          return (
            <View
              key={n}
              style={[styles.segment, active ? styles.segmentActive : styles.segmentInactive]}
            />
          );
        })}
      </View>
      <Text style={styles.caption}>
        Step {safeStep} of {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 28,
  },
  bars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  segmentActive: {
    backgroundColor: BLUE,
  },
  segmentInactive: {
    backgroundColor: TRACK,
  },
  caption: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
});
