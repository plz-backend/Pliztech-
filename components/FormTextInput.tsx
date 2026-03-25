import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import {
  type StyleProp,
  type ViewStyle,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Text } from '@/components/Text';

const INPUT_HEIGHT = 50;
const BORDER_RADIUS = 15;
const BORDER_COLOR = '#9EA2AD';
const HOVER_FOCUS_BORDER_COLOR = '#1766D1';
const ERROR_COLOR = '#FF0000';
const LABEL_COLOR = '#172033';
const BODY_COLOR = '#6B7280';
const INPUT_TEXT_COLOR = '#111827';

export interface FormTextInputProps
  extends Omit<ComponentProps<typeof TextInput>, 'style'> {
  label: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  /** When set, show eye toggle; pass secureTextEntry and onToggleSecure from parent. */
  secureTextEntry?: boolean;
  onToggleSecure?: () => void;
  error?: string;
  /** Hint text below input (lighter gray, for guidance) */
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function FormTextInput({
  label,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  onToggleSecure,
  error,
  hint,
  containerStyle,
  accessibilityLabel = label,
  ...inputProps
}: FormTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const showEyeToggle =
    onToggleSecure != null && (secureTextEntry === true || secureTextEntry === false);

  const isActive = isFocused || isHovered;
  const borderColor = error
    ? ERROR_COLOR
    : isActive
      ? HOVER_FOCUS_BORDER_COLOR
      : BORDER_COLOR;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          { borderColor },
          error ? styles.inputWrapperError : undefined,
        ]}
        {...(Platform.OS === 'web' && {
          onMouseEnter: () => setIsHovered(true),
          onMouseLeave: () => setIsHovered(false),
        })}
      >
        {leftIcon != null && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={BODY_COLOR}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            leftIcon != null && styles.inputWithLeftIcon,
            Platform.OS === 'web' && styles.inputWeb,
          ]}
          placeholderTextColor={BODY_COLOR}
          secureTextEntry={secureTextEntry}
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
        {showEyeToggle ? (
          <Pressable
            onPress={onToggleSecure}
            style={styles.eyeButton}
            accessibilityLabel={secureTextEntry ? 'Show password' : 'Hide password'}
            accessibilityRole="button"
          >
            <Ionicons
              name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={BODY_COLOR}
            />
          </Pressable>
        ) : rightIcon != null ? (
          <Ionicons name={rightIcon} size={20} color={BODY_COLOR} style={styles.rightIcon} />
        ) : null}
      </View>
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: LABEL_COLOR,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 16,
    minHeight: INPUT_HEIGHT,
  },
  inputWrapperError: {
    borderColor: ERROR_COLOR,
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: INPUT_TEXT_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  /** Web: remove default focus outline inside rounded wrapper; wrapper shows border */
  inputWeb: {
    outlineWidth: 0,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 4,
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
