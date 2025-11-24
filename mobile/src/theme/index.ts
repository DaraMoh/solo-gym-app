import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';
import {
  responsiveSpacing,
  responsiveVerticalSpacing,
  responsiveModerateSpacing,
  responsiveFontSize,
  scale,
  verticalScale,
  moderateScale,
} from './responsiveSpacing';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  responsiveSpacing,
  responsiveVerticalSpacing,
  responsiveModerateSpacing,
  responsiveFontSize,
};

export type Theme = typeof theme;

export {
  colors,
  typography,
  spacing,
  borderRadius,
  responsiveSpacing,
  responsiveVerticalSpacing,
  responsiveModerateSpacing,
  responsiveFontSize,
  scale,
  verticalScale,
  moderateScale,
};
