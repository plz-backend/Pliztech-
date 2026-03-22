import * as SecureStore from 'expo-secure-store';

const KEY = 'pliz_pending_donation_thank_you';

export type PendingDonationThankYou = {
  version: 2;
  amount: number;
  recipientName: string;
  begId: string;
  /** True when donor had “Show my name” on — controls privacy copy in the modal. */
  showRecipientName: boolean;
};

/**
 * Call before opening Paystack checkout so `/payment/callback` can show the thank-you sheet.
 */
export async function savePendingDonationThankYou(
  data: Omit<PendingDonationThankYou, 'version'>
): Promise<void> {
  const payload: PendingDonationThankYou = { ...data, version: 2 };
  await SecureStore.setItemAsync(KEY, JSON.stringify(payload));
}

export async function clearPendingDonationThankYou(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEY);
  } catch {
    /* ignore */
  }
}

export async function consumePendingDonationThankYouIfBegMatches(
  begId: string | null | undefined
): Promise<PendingDonationThankYou | null> {
  let raw: string | null;
  try {
    raw = await SecureStore.getItemAsync(KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<PendingDonationThankYou>;
    const valid =
      parsed?.version === 2 &&
      typeof parsed.amount === 'number' &&
      typeof parsed.recipientName === 'string' &&
      typeof parsed.begId === 'string' &&
      typeof parsed.showRecipientName === 'boolean';

    if (!valid) {
      await clearPendingDonationThankYou();
      return null;
    }

    const pending = parsed as PendingDonationThankYou;

    if (begId && pending.begId !== begId) {
      await clearPendingDonationThankYou();
      return null;
    }

    await clearPendingDonationThankYou();
    return pending;
  } catch {
    await clearPendingDonationThankYou();
    return null;
  }
}
