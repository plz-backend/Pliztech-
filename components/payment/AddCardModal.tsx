import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Text } from '@/components/Text';
import { useEffect, useState } from 'react';

import { PrimaryButton } from '@/components/PrimaryButton';

export interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  onAddCard?: (card: {
    holderName: string;
    number: string;
    expiry: string;
    cvv: string;
  }) => void;
}

export function AddCardModal({
  visible,
  onClose,
  onAddCard,
}: AddCardModalProps) {
  const [holderName, setHolderName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (!visible) {
      setHolderName('');
      setNumber('');
      setExpiry('');
      setCvv('');
    }
  }, [visible]);

  const handleAddCard = () => {
    onAddCard?.({ holderName, number, expiry, cvv });
    onClose();
  };

  const formatCardNumber = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.handle} />
            <Text style={styles.title}>Add Payment Card</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Card Holder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Michael Momoh"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                autoCorrect={false}
                value={holderName}
                onChangeText={setHolderName}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={19}
                value={number}
                onChangeText={(t) => setNumber(formatCardNumber(t))}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.field, styles.fieldHalf]}>
                <Text style={styles.label}>Expiry</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={5}
                  value={expiry}
                  onChangeText={(t) => setExpiry(formatExpiry(t))}
                />
              </View>
              <View style={[styles.field, styles.fieldHalf]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="***"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={4}
                  value={cvv}
                  onChangeText={(t) => setCvv(t.replace(/\D/g, ''))}
                />
              </View>
            </View>

            <PrimaryButton label="Add Card" onPress={handleAddCard} variant="gradient" />
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  keyboardView: {
    gap: 0,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  field: {
    marginBottom: 20,
  },
  fieldHalf: {
    flex: 1,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
});
