import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { Screen } from '@/components/Screen';
import { MOCK_PROFILE } from '@/mock/profile';

const BORDER_GRAY = '#E5E7EB';
const LABEL_GRAY = '#6B7280';
const VALUE_DARK = '#1F2937';
const VERIFIED_GREEN = '#22C55E';
const ICON_BG = '#F3F4F6';

function InfoRow({
  icon,
  label,
  value,
  verified,
  isLast,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  verified?: boolean;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color="#4B5563" />
      </View>
      <View style={styles.labelValueWrap}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      {verified && (
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
        </View>
      )}
    </View>
  );
}

export default function PersonalInfoScreen() {
  const handleEdit = () => {
    router.push('/(tabs)/edit-personal-info');
  };

  return (
    <Screen backgroundColor="#FFFFFF">
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.title}>Personal Information</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>
        <InfoRow
          icon="person-outline"
          label="Full Name"
          value={MOCK_PROFILE.fullName}
          isLast={false}
        />
        <InfoRow
          icon="mail-outline"
          label="Email"
          value={MOCK_PROFILE.email}
          verified={MOCK_PROFILE.verified}
          isLast={false}
        />
        <InfoRow
          icon="call-outline"
          label="Phone"
          value={MOCK_PROFILE.phone}
          verified={MOCK_PROFILE.verified}
          isLast={false}
        />
        <InfoRow
          icon="location-outline"
          label="Location"
          value={MOCK_PROFILE.location}
          isLast
        />
      </View>

      <Pressable
        style={({ pressed }) => [styles.editButton, pressed && styles.editPressed]}
        onPress={handleEdit}
        accessibilityLabel="Edit personal information"
        accessibilityRole="button"
      >
        <Text style={styles.editText}>Edit</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: VALUE_DARK,
  },
  headerSpacer: {
    width: 40,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: LABEL_GRAY,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  labelValueWrap: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 13,
    color: LABEL_GRAY,
    marginBottom: 4,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '700',
    color: VALUE_DARK,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: VERIFIED_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editPressed: {
    opacity: 0.7,
  },
  editText: {
    fontSize: 16,
    fontWeight: '600',
    color: VALUE_DARK,
  },
});
