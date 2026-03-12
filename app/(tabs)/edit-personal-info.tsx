import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/Text';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { MOCK_PROFILE } from '@/mock/profile';

const BORDER_GRAY = '#E5E7EB';
const LABEL_GRAY = '#6B7280';
const VALUE_DARK = '#1F2937';
const INPUT_BG = '#F9FAFB';

function EditField({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldHeader}>
        <Ionicons name={icon} size={18} color={LABEL_GRAY} style={styles.fieldIcon} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

export default function EditPersonalInfoScreen() {
  const [fullName, setFullName] = useState<string>(MOCK_PROFILE.fullName);
  const [email, setEmail] = useState<string>(MOCK_PROFILE.email);
  const [phone, setPhone] = useState<string>(MOCK_PROFILE.phone);
  const [location, setLocation] = useState<string>(MOCK_PROFILE.location);

  const handleSave = () => {
    // TODO: Persist changes
    router.back();
  };

  return (
    <Screen backgroundColor="#FFFFFF" scrollable>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.title}>Personal information</Text>
        <View style={styles.headerSpacer} />
      </View>

      <EditField
        icon="person-outline"
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Michael Momoh"
        autoCapitalize="words"
      />
      <EditField
        icon="mail-outline"
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="Momohmykael@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <EditField
        icon="call-outline"
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        placeholder="+234 816 732 6920"
        keyboardType="phone-pad"
      />
      <EditField
        icon="location-outline"
        label="Location"
        value={location}
        onChangeText={setLocation}
        placeholder="Abuja, Nigeria"
        autoCapitalize="words"
      />

      <PrimaryButton
        label="Save Changes"
        onPress={handleSave}
        variant="gradient"
      />
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
  field: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: LABEL_GRAY,
  },
  input: {
    backgroundColor: INPUT_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: VALUE_DARK,
  },
});
