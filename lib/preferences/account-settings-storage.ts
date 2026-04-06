import * as SecureStore from 'expo-secure-store';

const KEY = 'account_settings_v1';

export type AccountSettingsState = {
  darkMode: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
};

const DEFAULTS: AccountSettingsState = {
  darkMode: false,
  emailNotifications: true,
  smsNotifications: false,
};

export async function loadAccountSettings(): Promise<AccountSettingsState> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<AccountSettingsState>;
    return {
      darkMode: typeof parsed.darkMode === 'boolean' ? parsed.darkMode : DEFAULTS.darkMode,
      emailNotifications:
        typeof parsed.emailNotifications === 'boolean'
          ? parsed.emailNotifications
          : DEFAULTS.emailNotifications,
      smsNotifications:
        typeof parsed.smsNotifications === 'boolean'
          ? parsed.smsNotifications
          : DEFAULTS.smsNotifications,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export async function saveAccountSettings(state: AccountSettingsState): Promise<void> {
  await SecureStore.setItemAsync(KEY, JSON.stringify(state));
}
