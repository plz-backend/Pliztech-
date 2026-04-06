import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, View } from 'react-native';

import { Text } from '@/components/Text';

import { Screen } from '@/components/Screen';
import {
  loadAccountSettings,
  saveAccountSettings,
  type AccountSettingsState,
} from '@/lib/preferences/account-settings-storage';

const ACCENT_BLUE = '#2E8BEA';
const BORDER_GRAY = '#E5E7EB';
const ICON_BG = '#DBEAFE';
const DESTRUCTIVE_RED = '#DC2626';
const SECTION_TITLE = '#6B7280';

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  showToggle,
  toggleValue,
  onToggleChange,
  destructive,
  isLast,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  destructive?: boolean;
  isLast?: boolean;
}) {
  const iconBg = destructive ? DESTRUCTIVE_RED : ICON_BG;
  const titleColor = destructive ? DESTRUCTIVE_RED : '#1F2937';

  const content = (
    <>
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color="#FFFFFF" />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: titleColor }]}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {showToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggleChange}
          trackColor={{ false: '#E5E7EB', true: ACCENT_BLUE }}
          thumbColor="#FFFFFF"
        />
      ) : onPress ? (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      ) : null}
    </>
  );

  const rowStyle = [styles.row, isLast && styles.rowLast];

  if (onPress && !showToggle) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [...rowStyle, pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={rowStyle}>{content}</View>;
}

export default function AccountSettingsScreen() {
  const [prefs, setPrefs] = useState<AccountSettingsState | null>(null);

  useEffect(() => {
    void loadAccountSettings().then(setPrefs);
  }, []);

  const persist = useCallback(async (next: AccountSettingsState) => {
    setPrefs(next);
    await saveAccountSettings(next);
  }, []);

  const darkMode = prefs?.darkMode ?? false;
  const emailNotifications = prefs?.emailNotifications ?? true;
  const smsNotifications = prefs?.smsNotifications ?? false;

  const handleLanguage = () => {
    Alert.alert(
      'Language',
      'Additional languages will be available in a future update. The app currently follows your device language where supported.'
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export my data',
      'A full data export is processed on the server. Contact support from your profile email with the subject “Data export” and we will send your package when the export API is enabled for your account.'
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'Permanent account deletion must be confirmed by support to protect donors and recipients. Contact support to request deletion. This screen will call the delete API when it is available.',
      [{ text: 'OK' }]
    );
  };

  return (
    <Screen backgroundColor="#F9FAFB" scrollable>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.title}>Account Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <SettingsSection title="Preferences">
        <SettingsRow
          icon="globe-outline"
          title="Language"
          onPress={handleLanguage}
          isLast={false}
        />
        <SettingsRow
          icon="moon-outline"
          title="Dark Mode"
          showToggle
          toggleValue={darkMode}
          onToggleChange={(v) => void persist({ darkMode: v, emailNotifications, smsNotifications })}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Notification Preferences">
        <SettingsRow
          icon="mail-outline"
          title="Email Notifications"
          subtitle="Receive updates via email"
          showToggle
          toggleValue={emailNotifications}
          onToggleChange={(v) => void persist({ darkMode, emailNotifications: v, smsNotifications })}
          isLast={false}
        />
        <SettingsRow
          icon="call-outline"
          title="SMS Notifications"
          subtitle="Get text message alerts"
          showToggle
          toggleValue={smsNotifications}
          onToggleChange={(v) => void persist({ darkMode, emailNotifications, smsNotifications: v })}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Data & Privacy">
        <SettingsRow
          icon="download-outline"
          title="Export My Data"
          subtitle="Download a copy of your data"
          onPress={handleExportData}
          isLast={false}
        />
        <SettingsRow
          icon="trash-outline"
          title="Delete Account"
          subtitle="Permanently delete your account"
          onPress={handleDeleteAccount}
          destructive
          isLast
        />
      </SettingsSection>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: SECTION_TITLE,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  pressed: {
    opacity: 0.7,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
});
