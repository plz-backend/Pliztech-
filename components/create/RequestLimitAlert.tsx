import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

const BRAND_BLUE = '#2E8BEA';
const HEADING = '#1F2937';
const BODY = '#6B7280';

export interface RequestLimitAlertProps {
  limit: string;
  verifyMessage?: string;
}

export function RequestLimitAlert({
  limit,
  verifyMessage = 'Verify your account to request more',
}: RequestLimitAlertProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="alert-circle" size={24} color={BRAND_BLUE} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.limitText}>You can request up to {limit}</Text>
        <Text style={styles.verifyText}>{verifyMessage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconWrap: {
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  limitText: {
    fontSize: 15,
    fontWeight: '700',
    color: HEADING,
    marginBottom: 2,
  },
  verifyText: {
    fontSize: 13,
    color: BODY,
  },
});
