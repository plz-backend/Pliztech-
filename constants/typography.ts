import type { TextStyle } from 'react-native';

/**
 * Global typography styles based on SF Pro typeface.
 * Use these across the app for consistent text styling.
 *
 * SF Pro (San Francisco) on iOS via fontFamily: 'System'.
 * On Android, 'System' gives Roboto. Load SF Pro via expo-font for Android if needed.
 *
 * @example
 * import { typography } from '@/constants/typography';
 * <Text style={[typography.h1, { color: '#1F2937' }]}>Title</Text>
 * <Text style={typography.body}>Body text</Text>
 */

/** Primary typeface: SF Pro. Uses system font (SF Pro on iOS, Roboto on Android). */
export const FONT_FAMILY = 'System';

/** Font weights (SF Pro) */
export const FONT_WEIGHT = {
  thin: '100' as TextStyle['fontWeight'],
  extraLight: '200' as TextStyle['fontWeight'],
  light: '300' as TextStyle['fontWeight'],
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extraBold: '800' as TextStyle['fontWeight'],
  black: '900' as TextStyle['fontWeight'],
} as const;

/** Font sizes (px) */
export const FONT_SIZE = {
  /** Minor details */
  xs: 8,
  /** Small info */
  sm: 10,
  /** Labels & input, secondary CTA */
  md: 12,
  /** Success messages, body */
  base: 14,
  /** Main text, primary CTA, default button */
  lg: 16,
  /** h3 */
  xl: 18,
  /** h2 */
  '2xl': 20,
  /** h1 */
  '3xl': 24,
} as const;

/** Line heights */
export const LINE_HEIGHT = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 20,
  xl: 24,
} as const;

/** Base text style with SF Pro font family */
const withFont = (style: TextStyle): TextStyle => ({
  ...style,
  fontFamily: FONT_FAMILY,
});

/** HEADERS */
export const typography = {
  h1: withFont({
    fontSize: FONT_SIZE['3xl'],
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: FONT_SIZE['3xl'] * 1.2,
  }),

  h2: withFont({
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: FONT_SIZE['2xl'] * 1.2,
  }),

  h3: withFont({
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: FONT_SIZE.xl * 1.2,
  }),

  /** Primary text for CTAs */
  primaryCta: withFont({
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semiBold,
    lineHeight: LINE_HEIGHT.base,
  }),

  /** Secondary text for CTAs */
  secondaryCta: withFont({
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: LINE_HEIGHT.md,
  }),

  /** BODY */
  /** Main text - body, settings, popups */
  body: withFont({
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: LINE_HEIGHT.base,
  }),

  /** Main text large variant */
  bodyLarge: withFont({
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: LINE_HEIGHT.base,
  }),

  /** Success messages, requester names in browse */
  bodyEmphasis: withFont({
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semiBold,
    lineHeight: LINE_HEIGHT.base,
  }),

  /** Labels & input placeholder */
  label: withFont({
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: LINE_HEIGHT.md,
  }),

  /** Small info */
  caption: withFont({
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: LINE_HEIGHT.sm,
  }),

  /** Minor details */
  overline: withFont({
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: LINE_HEIGHT.xs,
  }),

  /** BUTTONS */
  /** Default button text */
  button: withFont({
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: LINE_HEIGHT.base,
  }),

  /** Pop ups and confirmations - small */
  buttonSmall: withFont({
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semiBold,
    lineHeight: LINE_HEIGHT.md,
  }),

  /** Pop ups and confirmations - extra small */
  buttonXs: withFont({
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semiBold,
    lineHeight: LINE_HEIGHT.sm,
  }),

  /** Text links */
  link: withFont({
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: LINE_HEIGHT.base,
  }),
} as const;

export type TypographyKey = keyof typeof typography;
