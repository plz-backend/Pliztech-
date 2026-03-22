import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  View,
} from 'react-native';

import { Text } from '@/components/Text';
import { z } from 'zod';

import { CategoryChip } from '@/components/create/CategoryChip';
import { ConfirmRequestModal } from '@/components/create/ConfirmRequestModal';
import { RequestLiveModal } from '@/components/create/RequestLiveModal';
import { RequestLimitAlert } from '@/components/create/RequestLimitAlert';
import { CTAButton } from '@/components/CTAButton';
import { FormTextArea } from '@/components/FormTextArea';
import { Screen } from '@/components/Screen';
import { categoryEmojiForId, REQUEST_CATEGORIES } from '@/constants/categories';
import {
  clampBegDescriptionForApi,
  createBeg,
  normalizeBegTitleForApi,
  uiCategoryToApiCategory,
} from '@/lib/api/beg';
import { PlizApiError } from '@/lib/api/types';
import { getAccessToken } from '@/lib/auth/access-token';

const LOGO = require('@/assets/images/pliz-logo.png');

const BEG_TITLE_MAX = 25;

const createRequestSchema = z.object({
  categoryId: z.string().min(1, 'Please select a category'),
  title: z
    .string()
    .min(1, 'Add a short title for your request')
    .max(BEG_TITLE_MAX, `Title must be ${BEG_TITLE_MAX} characters or less`)
    .refine((val) => val.trim().length > 0, 'Add a short title for your request'),
  description: z
    .string()
    .min(1, 'Please describe your need')
    .refine(
      (val) => val.trim().split(/\s+/).filter(Boolean).length <= 30,
      'Maximum 30 words (server limit)'
    ),
  amount: z
    .string()
    .min(1, 'Please enter an amount')
    .refine(
      (val) => {
        const num = Number(val.replace(/,/g, ''));
        return !isNaN(num) && num >= 100;
      },
      'Minimum amount is ₦100'
    ),
  expiryHours: z.enum(['24', '48', '72']),
  showName: z.boolean(),
});

type CreateRequestFormData = z.infer<typeof createRequestSchema>;

const DEFAULT_CREATE_VALUES: CreateRequestFormData = {
  categoryId: '',
  title: '',
  description: '',
  amount: '',
  expiryHours: '24',
  showName: true,
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<CreateRequestFormData | null>(null);
  const [liveSuccess, setLiveSuccess] = useState<{
    requestId: string;
    amount: number;
    categoryLabel: string;
    categoryId: string;
    expiryLine: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateRequestFormData>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: DEFAULT_CREATE_VALUES,
  });

  const description = watch('description');
  const titleValue = watch('title');
  const wordCount = countWords(description ?? '');
  const titleCharCount = (titleValue ?? '').length;

  const onContinue = async (data: CreateRequestFormData) => {
    if (isSubmitting) return;

    const token = await getAccessToken();
    if (!token) {
      Alert.alert('Sign in required', 'Please log in to submit a request.', [
        { text: 'OK', onPress: () => router.push('/(auth)/login' as import('expo-router').Href) },
      ]);
      return;
    }

    const title = normalizeBegTitleForApi(data.title);
    if (!title) {
      Alert.alert('Title required', 'Please enter a short title for your request.');
      return;
    }

    const cat = REQUEST_CATEGORIES.find((c) => c.id === data.categoryId);
    if (!cat) {
      Alert.alert('Category required', 'Please select a category.');
      return;
    }

    setPendingSubmit(data);
    setConfirmVisible(true);
  };

  const closeConfirmModal = () => {
    if (isSubmitting) return;
    setConfirmVisible(false);
    setPendingSubmit(null);
  };

  const onConfirmSubmit = async () => {
    const data = pendingSubmit;
    if (!data || isSubmitting) return;

    const token = await getAccessToken();
    if (!token) {
      Alert.alert('Sign in required', 'Please log in to submit a request.', [
        { text: 'OK', onPress: () => router.push('/(auth)/login' as import('expo-router').Href) },
      ]);
      return;
    }

    const amountRequested = Number(data.amount.replace(/,/g, ''));
    const descriptionForApi = clampBegDescriptionForApi(data.description);
    const title = normalizeBegTitleForApi(data.title);
    if (!title) {
      Alert.alert('Title required', 'Please enter a short title for your request.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { beg } = await createBeg(token, {
        title,
        description: descriptionForApi,
        category: uiCategoryToApiCategory(data.categoryId),
        amountRequested,
        mediaType: 'text',
      });

      const categoryMeta = REQUEST_CATEGORIES.find((c) => c.id === data.categoryId);
      const expiryHoursLabel =
        EXPIRY_OPTIONS.find((o) => o.value === data.expiryHours)?.label ?? '';

      setConfirmVisible(false);
      setPendingSubmit(null);
      setLiveSuccess({
        requestId: beg.id,
        amount: amountRequested,
        categoryLabel: categoryMeta?.label ?? 'Your request',
        categoryId: data.categoryId,
        expiryLine: `Expires in ${expiryHoursLabel}`,
      });
    } catch (e) {
      const msg =
        e instanceof PlizApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Something went wrong';
      Alert.alert('Could not submit', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onBack = () => {
    router.back();
  };

  const clearCreateFormAndLiveState = () => {
    setLiveSuccess(null);
    reset(DEFAULT_CREATE_VALUES);
    setSelectedCategory(null);
  };

  const onLiveDismissOrHome = () => {
    clearCreateFormAndLiveState();
    router.navigate('/(tabs)/(main)/index' as Href);
  };

  const onLiveViewRequest = () => {
    const id = liveSuccess?.requestId;
    clearCreateFormAndLiveState();
    if (id) {
      router.push({ pathname: '/(tabs)/request/[id]', params: { id } } as Href);
    }
  };

  const pendingCategory =
    pendingSubmit != null
      ? REQUEST_CATEGORIES.find((c) => c.id === pendingSubmit.categoryId)
      : undefined;
  const pendingAmount =
    pendingSubmit != null ? Number(pendingSubmit.amount.replace(/,/g, '')) : 0;
  const pendingExpiryLabel =
    pendingSubmit != null
      ? EXPIRY_OPTIONS.find((o) => o.value === pendingSubmit.expiryHours)?.label ?? ''
      : '';

  return (
    <Screen backgroundColor={COLORS.background} scrollable>
      {pendingSubmit != null && pendingCategory != null ? (
        <ConfirmRequestModal
          visible={confirmVisible}
          onClose={closeConfirmModal}
          onConfirm={onConfirmSubmit}
          categoryLabel={pendingCategory.label}
          categoryIcon={pendingCategory.icon}
          title={pendingSubmit.title}
          description={pendingSubmit.description}
          amountRequested={pendingAmount}
          expiryLabel={pendingExpiryLabel}
          submitting={isSubmitting}
        />
      ) : null}
      {liveSuccess != null ? (
        <RequestLiveModal
          visible
          onDismiss={onLiveDismissOrHome}
          onViewMyRequest={onLiveViewRequest}
          onBackToHome={onLiveDismissOrHome}
          amountRequested={liveSuccess.amount}
          categoryLabel={liveSuccess.categoryLabel}
          categoryEmoji={categoryEmojiForId(liveSuccess.categoryId)}
          expiryLine={liveSuccess.expiryLine}
        />
      ) : null}
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
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextArea
                variant="single"
                label="Short title"
                placeholder="e.g. Transport to new job"
                value={value}
                onChangeText={(t) => onChange(t.slice(0, BEG_TITLE_MAX))}
                onBlur={onBlur}
                maxLength={BEG_TITLE_MAX}
                error={errors.title?.message}
                hint="Shown on the feed (max 25 characters)."
                wordCount={{ current: titleCharCount, max: BEG_TITLE_MAX }}
                countUnit="characters"
                autoCapitalize="sentences"
              />
            )}
          />

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
                wordCount={{ current: wordCount, max: 30 }}
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
              <FormTextArea
                variant="single"
                prefix="₦"
                label="How much do you need?"
                placeholder="0"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                error={errors.amount?.message}
                hint="Minimum ₦100. Subject to your trust tier limit."
              />
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

          <CTAButton
            label="Continue"
            onPress={handleSubmit(onContinue)}
            variant="gradient"
            accessibilityLabel="Continue"
            disabled={isSubmitting}
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
});
