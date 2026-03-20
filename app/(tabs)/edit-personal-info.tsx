import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/Text';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { updateProfile } from '@/lib/api/profile';
import { PlizApiError } from '@/lib/api/types';
import { getAccessToken } from '@/lib/auth/access-token';

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
  editable = true,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldHeader}>
        <Ionicons name={icon} size={18} color={LABEL_GRAY} style={styles.fieldIcon} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      {editable ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      ) : (
        <View style={[styles.input, styles.readOnlyBox]}>
          <Text style={styles.readOnlyText}>{value || '—'}</Text>
          <Text style={styles.readOnlyHint}>Contact support to change your email.</Text>
        </View>
      )}
    </View>
  );
}

export default function EditPersonalInfoScreen() {
  const { user, isLoading, refreshUser } = useCurrentUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.profile) return;
    setFirstName(user.profile.firstName?.trim() ?? '');
    setLastName(user.profile.lastName?.trim() ?? '');
    setPhoneNumber(user.profile.phoneNumber?.trim() ?? '');
  }, [user?.profile]);

  const handleSave = useCallback(async () => {
    const fn = firstName.trim();
    const ln = lastName.trim();
    const phone = phoneNumber.trim();

    if (fn.length < 2) {
      Alert.alert('Check first name', 'First name must be at least 2 characters.');
      return;
    }
    if (ln.length < 2) {
      Alert.alert('Check last name', 'Last name must be at least 2 characters.');
      return;
    }
    if (phone.length > 0 && !/^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s/g, ''))) {
      Alert.alert(
        'Invalid phone',
        'Use international format, e.g. +2348012345678 (digits only after +).'
      );
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      Alert.alert('Session expired', 'Please sign in again.');
      return;
    }

    setSaving(true);
    try {
      const body: { firstName: string; lastName: string; phoneNumber?: string } = {
        firstName: fn,
        lastName: ln,
      };
      const normalizedPhone = phone.replace(/\s/g, '');
      if (normalizedPhone) {
        body.phoneNumber = normalizedPhone;
      }

      await updateProfile(token, body);
      await refreshUser();
      router.back();
    } catch (e) {
      const msg =
        e instanceof PlizApiError ? e.message : e instanceof Error ? e.message : 'Something went wrong';
      Alert.alert('Could not save', msg);
    } finally {
      setSaving(false);
    }
  }, [firstName, lastName, phoneNumber, refreshUser]);

  if (isLoading && !user) {
    return (
      <Screen backgroundColor="#FFFFFF">
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2E8BEA" />
        </View>
      </Screen>
    );
  }

  if (!user?.profile) {
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
        <Text style={styles.missingProfile}>
          Complete your profile first before editing these details.
        </Text>
      </Screen>
    );
  }

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
        label="First name"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First name"
        autoCapitalize="words"
      />
      <EditField
        icon="person-outline"
        label="Last name"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last name"
        autoCapitalize="words"
      />
      <EditField
        icon="mail-outline"
        label="Email"
        value={user.email}
        editable={false}
      />
      <EditField
        icon="call-outline"
        label="Phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="+2348012345678"
        keyboardType="phone-pad"
      />

      <PrimaryButton
        label={saving ? 'Saving…' : 'Save Changes'}
        onPress={() => void handleSave()}
        variant="gradient"
        disabled={saving}
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
  readOnlyBox: {
    paddingVertical: 12,
  },
  readOnlyText: {
    fontSize: 16,
    fontWeight: '600',
    color: VALUE_DARK,
  },
  readOnlyHint: {
    fontSize: 12,
    color: LABEL_GRAY,
    marginTop: 6,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  missingProfile: {
    fontSize: 15,
    color: LABEL_GRAY,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
