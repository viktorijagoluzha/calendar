import { moderateScale } from '../utils/metrics';

export const borderRadius = {
  none: 0,
  sm: moderateScale(4),
  md: moderateScale(8),
  lg: moderateScale(12),
  xl: moderateScale(16),
  xxl: moderateScale(24),
  full: 9999,
};
