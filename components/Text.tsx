import type { ComponentProps } from 'react';
import { Text as RNText } from 'react-native';

import { DEFAULT_TEXT_COLOR } from '@/constants/colors';

export type TextProps = ComponentProps<typeof RNText>;

/**
 * Text component with default color #172033.
 * Pass a style with color to override.
 */
export function Text({ style, ...props }: TextProps) {
  return <RNText style={[{ color: DEFAULT_TEXT_COLOR }, style]} {...props} />;
}
