/**
 * Global CTA (Call-to-Action) button styles.
 * Use these for consistent button styling across the app.
 *
 * @example
 * import { CTA_BUTTON } from '@/constants/cta-buttons';
 * <CTAButton variant="gradient" label="Sign Up" onPress={...} />
 */

/** Shared dimensions for all CTA buttons */
export const CTA_BUTTON = {
  width: 358,
  height: 46,
  borderRadius: 20,
  paddingVertical: 12,
  paddingHorizontal: 10,
  gap: 10,
} as const;

/** Gradient colors used across CTA variants */
export const CTA_COLORS = {
  blueStart: '#2E8BEA',
  blueEnd: '#172033',
  white: '#FFFFFF',
  blueSolid: '#69A1BA',
} as const;

/** 1. Gradient CTA - blue gradient background, white text */
export const CTA_GRADIENT = {
  ...CTA_BUTTON,
  textColor: CTA_COLORS.white,
  gradientColors: [CTA_COLORS.blueStart, CTA_COLORS.blueEnd] as const,
} as const;

/** 2. White CTA - white background, gradient text (approximated as blue) */
export const CTA_WHITE = {
  ...CTA_BUTTON,
  backgroundColor: CTA_COLORS.white,
  textColor: CTA_COLORS.blueStart, // gradient 180deg #2E8BEA → #172033
} as const;

/** 3. Transparent CTA - transparent bg, gradient border, gradient text */
export const CTA_TRANSPARENT = {
  ...CTA_BUTTON,
  borderWidth: 1,
  borderGradientColors: [CTA_COLORS.blueStart, CTA_COLORS.blueEnd] as const,
  textColor: CTA_COLORS.blueStart, // gradient 270deg
} as const;

/** 4. Blue CTA - solid blue background, white text */
export const CTA_BLUE = {
  ...CTA_BUTTON,
  backgroundColor: CTA_COLORS.blueSolid,
  textColor: CTA_COLORS.white,
} as const;
