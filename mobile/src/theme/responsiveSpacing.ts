import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

/**
 * Responsive spacing utilities using react-native-size-matters
 * These scale based on screen dimensions for consistent layouts across devices
 */

// Horizontal scaling (based on screen width)
export const responsiveSpacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  '2xl': scale(40),
  '3xl': scale(48),
  '4xl': scale(64),
  '5xl': scale(80),
};

// Vertical scaling (based on screen height)
export const responsiveVerticalSpacing = {
  xs: verticalScale(4),
  sm: verticalScale(8),
  md: verticalScale(16),
  lg: verticalScale(24),
  xl: verticalScale(32),
  '2xl': verticalScale(40),
  '3xl': verticalScale(48),
  '4xl': verticalScale(64),
  '5xl': verticalScale(80),
};

// Moderate scaling (scales with both dimensions, with a factor of 0.5 by default)
// Good for font sizes and elements that shouldn't scale as much
export const responsiveModerateSpacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
  '2xl': moderateScale(40),
  '3xl': moderateScale(48),
  '4xl': moderateScale(64),
  '5xl': moderateScale(80),
};

// Font size scaling
export const responsiveFontSize = {
  xs: moderateScale(10),
  sm: moderateScale(12),
  base: moderateScale(14),
  lg: moderateScale(16),
  xl: moderateScale(18),
  '2xl': moderateScale(20),
  '3xl': moderateScale(24),
  '4xl': moderateScale(32),
  '5xl': moderateScale(40),
};

// Re-export scaling functions for custom use
export { scale, verticalScale, moderateScale };
