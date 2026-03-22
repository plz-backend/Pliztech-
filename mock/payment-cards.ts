export interface PaymentCard {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  /** Issuer / bank when API provides it */
  bank?: string | null;
}

export const MOCK_PAYMENT_CARDS: PaymentCard[] = [
  {
    id: '1',
    brand: 'Visa',
    last4: '4521',
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
  },
];

export function formatExpiry(month: number, year: number): string {
  const mm = String(month).padStart(2, '0');
  const yy = String(year).slice(-2);
  return `${mm}/${yy}`;
}
