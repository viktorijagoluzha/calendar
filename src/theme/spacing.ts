import {
  moderateScale,
  verticalScale,
  horizontalScale,
} from '../utils/metrics';

export const spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(32),
  huge: moderateScale(40),
  massive: moderateScale(60),
};

export const verticalSpacing = {
  xs: verticalScale(4),
  sm: verticalScale(8),
  md: verticalScale(12),
  lg: verticalScale(16),
  xl: verticalScale(20),
  xxl: verticalScale(24),
  xxxl: verticalScale(32),
  huge: verticalScale(40),
  massive: verticalScale(60),
};

export const horizontalSpacing = {
  xs: horizontalScale(4),
  sm: horizontalScale(8),
  md: horizontalScale(12),
  lg: horizontalScale(16),
  xl: horizontalScale(20),
  xxl: horizontalScale(24),
  xxxl: horizontalScale(32),
  huge: horizontalScale(40),
  massive: horizontalScale(60),
};
