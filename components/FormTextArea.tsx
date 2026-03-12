import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/Text';

const BORDER_RADIUS = 15;
const BORDER_COLOR = '#D1D5DB';
const HOVER_FOCUS_BORDER_COLOR = '#1766D1';
const ERROR_COLOR = '#DC2626';
const LABEL_COLOR = '#1F2937';
const BODY_COLOR = '#6B7280';
const INPUT_TEXT_COLOR = '#111827';

export interface FormTextAreaProps
  extends Omit<ComponentProps<typeof TextInput>, 'style'> {
  label: string;
  error?: string;
  hint?: string;
  wordCount?: { current: number; max: number };
  containerStyle?: ComponentProps<View>['style'];
}

export function FormTextArea({
  label,
  error,
  hint,
  wordCount,
  containerStyle,
  accessibilityLabel = label,
  ...inputProps
}: FormTextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = error
    ? ERROR_COLOR
    : isFocused
      ? HOVER_FOCUS_BORDER_COLOR
      : BORDER_COLOR;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {wordCount != null && (
          <Text style={styles.wordCount}>
            {wordCount.current}/{wordCount.max} words
          </Text>
        )}
      </View>
      <TextInput
        style={[styles.input, { borderColor }, error ? styles.inputError : undefined]}
        placeholderTextColor={BODY_COLOR}
        multiline
        textAlignVertical="top"
        accessibilityLabel={accessibilityLabel}
        showSoftInputOnFocus={true}
        {...inputProps}
        onFocus={(e) => {
          setIsFocused(true);
          inputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          inputProps.onBlur?.(e);
        }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: LABEL_COLOR,
  },
  wordCount: {
    fontSize: 12,
    color: BODY_COLOR,
  },
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: INPUT_TEXT_COLOR,
    minHeight: 100,
  },
  inputError: {
    borderColor: ERROR_COLOR,
  },
  error: {
    fontSize: 12,
    color: ERROR_COLOR,
    marginTop: 6,
  },
  hint: {
    fontSize: 12,
    color: BODY_COLOR,
    marginTop: 6,
  },
});
