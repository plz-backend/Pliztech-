import HandHeartSvg from '@/assets/icons/hand-heart.svg';
import { View } from 'react-native';

const DEFAULT_SIZE = 48;
const DEFAULT_COLOR = '#FFFFFF';
const VIEWBOX_ASPECT = 35 / 39; // viewBox "0 0 39 35"

export interface BrandIconProps {
  /** Icon size (width). Height scales to preserve viewBox aspect. Default 48. */
  size?: number;
  /** Fill color. Default white. Uses currentColor in SVG. */
  color?: string;
  /** Accessibility label for the icon. */
  accessibilityLabel?: string;
}

export function BrandIcon({
  size = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  accessibilityLabel = 'Plz hand heart icon',
}: BrandIconProps) {
  const width = size;
  const height = size * VIEWBOX_ASPECT;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
    >
      <HandHeartSvg
        width={width}
        height={height}
        color={color}
      />
    </View>
  );
}
