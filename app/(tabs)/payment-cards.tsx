import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { AddCardModal } from '@/components/payment/AddCardModal';
import { Screen } from '@/components/Screen';
import {
  formatExpiry,
  MOCK_PAYMENT_CARDS,
  type PaymentCard,
} from '@/mock/payment-cards';

const ACCENT_BLUE = '#2E8BEA';
const BORDER_GRAY = '#E5E7EB';
const BG_LIGHT = '#F9FAFB';

function PaymentCardItem({ card }: { card: PaymentCard }) {
  const expiry = formatExpiry(card.expiryMonth, card.expiryYear);
  return (
    <View style={styles.cardItem}>
      <View style={styles.cardIcon}>
        <Ionicons name="card-outline" size={24} color="#FFFFFF" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardBrand}>
          {card.brand} **** {card.last4}
        </Text>
        <Text style={styles.cardExpiry}>Expires {expiry}</Text>
        {card.isDefault && (
          <Text style={styles.defaultLabel}>Default</Text>
        )}
      </View>
      <Pressable
        style={styles.eyeButton}
        accessibilityLabel="View card details"
        accessibilityRole="button"
      >
        <Ionicons name="eye-outline" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

export default function PaymentCardsScreen() {
  const params = useLocalSearchParams<{ requestId?: string }>();
  const requestId = typeof params.requestId === 'string'
    ? params.requestId
    : params.requestId?.[0];
  const [addCardVisible, setAddCardVisible] = useState(false);

  const handleAddCard = () => setAddCardVisible(true);
  const handleCloseAddCard = () => setAddCardVisible(false);

  return (
    <Screen backgroundColor={BG_LIGHT}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.title}>Payment Cards</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_PAYMENT_CARDS.map((card) => (
          <PaymentCardItem key={card.id} card={card} />
        ))}

        <Pressable
          style={styles.addButton}
          onPress={handleAddCard}
          accessibilityLabel="Add new card"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={22} color={ACCENT_BLUE} />
          <Text style={styles.addButtonText}>Add New Card</Text>
        </Pressable>
      </ScrollView>

      <AddCardModal
        visible={addCardVisible}
        onClose={handleCloseAddCard}
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
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: ACCENT_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  defaultLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: ACCENT_BLUE,
  },
  eyeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ACCENT_BLUE,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: ACCENT_BLUE,
  },
});
