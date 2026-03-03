import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { z } from 'zod';

import { CategoryChip } from '@/components/create/CategoryChip';
import { RequestLimitAlert } from '@/components/create/RequestLimitAlert';
import { FormTextArea } from '@/components/FormTextArea';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { REQUEST_CATEGORIES } from '@/constants/categories';

const LOGO = require('@/assets/images/pliz-logo.png');

const createRequestSchema = z.object({
  categoryId: z.string().min(1, 'Please select a category'),
  description: z
    .string()
    .min(1, 'Please describe your need')
    .refine(
      (val) => val.trim().split(/\s+/).filter(Boolean).length <= 40,
      'Maximum 40 words'
    ),
  amount: z
    .string()
    .min(1, 'Please enter an amount')
    .refine(
      (val) => {
        const num = Number(val.replace(/,/g, ''));
        return !isNaN(num) && num >= 0;
      },
      'Enter a valid amount'
    ),
  expiryHours: z.enum(['24', '48', '72']),
  showName: z.boolean(),
});

type CreateRequestFormData = z.infer<typeof createRequestSchema>;

const COLORS = {
  background: '#FFFFFF',
  brandBlue: '#2E8BEA',
  heading: '#1F2937',
  body: '#6B7280',
} as const;

const EXPIRY_OPTIONS = [
  { value: '24' as const, label: '24 hours' },
  { value: '48' as const, label: '48 hours' },
  { value: '72' as const, label: '72 hours' },
];

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function CreateScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRequestFormData>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      categoryId: '',
      description: '',
      amount: '0',
      expiryHours: '24',
      showName: true,
    },
  });

  const description = watch('description');
  const wordCount = countWords(description ?? '');

  const onContinue = (data: CreateRequestFormData) => {
    console.log('Create request', data);
    router.back();
  };

  const onBack = () => {
    router.back();
  };

  return (
    <Screen backgroundColor={COLORS.background} scrollable>
      <View style={styles.content}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={onBack}
              style={styles.backButton}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.heading} />
            </Pressable>
            <View style={styles.logoSection}>
              <Image source={LOGO} style={styles.logo} contentFit="contain" />
            </View>
            <View style={styles.backButtonSpacer} />
          </View>

          <Text style={styles.title}>Ask for Help</Text>
          <Text style={styles.subtitle}>
            Tell us what we need. Keep it simple and honest
          </Text>

          <RequestLimitAlert limit="₦10,000" />

          <Text style={styles.sectionTitle}>Select a Category</Text>
          <View style={styles.categoryGrid}>
            {REQUEST_CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.id}
                label={cat.label}
                icon={cat.icon}
                selected={selectedCategory === cat.id}
                onPress={() => {
                  setSelectedCategory(cat.id);
                  setValue('categoryId', cat.id);
                }}
              />
            ))}
          </View>
          {errors.categoryId ? (
            <Text style={styles.fieldError}>{errors.categoryId.message}</Text>
          ) : null}

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextArea
                label="Briefly Describe your need"
                placeholder="Be specific but brief. E.g., 'I need help with transport fare to get to my new job this week.'"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                wordCount={{ current: wordCount, max: 40 }}
                error={errors.description?.message}
                hint="No editing after submission. No images or attachments allowed."
                maxLength={300}
              />
            )}
          />

          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.amountWrap}>
                <Text style={styles.amountLabel}>How much do you need?</Text>
                <View style={styles.amountInputRow}>
                  <Text style={styles.amountPrefix}>₦</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0"
                    placeholderTextColor="#6B7280"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                  />
                </View>
                {errors.amount?.message ? (
                  <Text style={styles.amountError}>{errors.amount.message}</Text>
                ) : null}
              </View>
            )}
          />

          <View style={styles.sectionTitleRow}>
            <Ionicons name="time-outline" size={18} color={COLORS.heading} style={styles.sectionTitleIcon} />
            <Text style={styles.sectionTitle}>Request expires in</Text>
          </View>
          <View style={styles.expiryRow}>
            {EXPIRY_OPTIONS.map((opt) => (
              <Controller
                key={opt.value}
                control={control}
                name="expiryHours"
                render={({ field: { value, onChange } }) => (
                  <Pressable
                    onPress={() => onChange(opt.value)}
                    style={[styles.expiryChip, value === opt.value && styles.expiryChipSelected]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: value === opt.value }}
                  >
                    <Text
                      style={[
                        styles.expiryLabel,
                        value === opt.value && styles.expiryLabelSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                )}
              />
            ))}
          </View>
          <View style={styles.platformFeeBox}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.body} style={styles.platformFeeIcon} />
            <Text style={styles.platformFeeText}>
              A 5% platform fee applies to successful requests.
            </Text>
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Ionicons name="eye-outline" size={22} color={COLORS.heading} style={styles.toggleIcon} />
              <View>
                <Text style={styles.toggleTitle}>Show my name</Text>
                <Text style={styles.toggleSubtitle}>Givers will see your first name</Text>
              </View>
            </View>
            <Controller
              control={control}
              name="showName"
              render={({ field: { value, onChange } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: '#E5E7EB', true: COLORS.brandBlue }}
                  thumbColor="#FFFFFF"
                  accessibilityLabel="Show my name"
                />
              )}
            />
          </View>

          <PrimaryButton
            label="Continue"
            onPress={handleSubmit(onContinue)}
            variant="gradient"
            rightIcon="send"
            accessibilityLabel="Continue"
          />

          <Text style={styles.disclaimer}>
            By submitting, you agree that this request is truthful and you accept our community guidelines
          </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
  },
  backButtonSpacer: {
    width: 40,
  },
  logoSection: {
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.body,
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.heading,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  fieldError: {
    fontSize: 12,
    color: '#DC2626',
    marginBottom: 12,
  },
  expiryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  expiryChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  expiryChipSelected: {
    borderColor: '#D1D5DB',
    backgroundColor: '#F3F4F6',
  },
  expiryLabel: {
    fontSize: 14,
    color: COLORS.body,
  },
  expiryLabelSelected: {
    color: COLORS.heading,
    fontWeight: '600',
  },
  platformFeeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  platformFeeIcon: {
    marginRight: 10,
  },
  platformFeeText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.body,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 12,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    marginRight: 12,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.heading,
  },
  toggleSubtitle: {
    fontSize: 13,
    color: COLORS.body,
    marginTop: 2,
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.body,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  amountWrap: {
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.heading,
    marginBottom: 8,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 15,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  amountPrefix: {
    fontSize: 16,
    color: COLORS.heading,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  amountError: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 6,
  },
});
