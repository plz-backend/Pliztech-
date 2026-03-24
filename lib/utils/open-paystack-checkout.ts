import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

/**
 * Opens Paystack hosted checkout. On web, uses same-tab navigation so the
 * browser does not block the window (popup blockers block window.open after async work).
 */
export async function openPaystackCheckout(paymentUrl: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.location.assign(paymentUrl);
    }
    return;
  }
  await WebBrowser.openBrowserAsync(paymentUrl);
}
