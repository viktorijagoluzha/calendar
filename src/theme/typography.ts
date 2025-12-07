import { moderateScale } from '../utils/metrics';
import { colors } from './colors';

export const typography = {
  h1: {
    fontSize: moderateScale(32),
    fontWeight: '700' as const,
    lineHeight: moderateScale(40),
    color: colors.text.primary,
  },
  h2: {
    fontSize: moderateScale(28),
    fontWeight: '600' as const,
    lineHeight: moderateScale(36),
    color: colors.text.primary,
  },
  h3: {
    fontSize: moderateScale(24),
    fontWeight: '600' as const,
    lineHeight: moderateScale(32),
    color: colors.text.primary,
  },
  h4: {
    fontSize: moderateScale(20),
    fontWeight: '600' as const,
    lineHeight: moderateScale(28),
    color: colors.text.primary,
  },
  h5: {
    fontSize: moderateScale(18),
    fontWeight: '600' as const,
    lineHeight: moderateScale(24),
    color: colors.text.primary,
  },
  h6: {
    fontSize: moderateScale(16),
    fontWeight: '600' as const,
    lineHeight: moderateScale(22),
    color: colors.text.primary,
  },
  body1: {
    fontSize: moderateScale(16),
    fontWeight: '400' as const,
    lineHeight: moderateScale(24),
    color: colors.text.primary,
  },
  body2: {
    fontSize: moderateScale(14),
    fontWeight: '400' as const,
    lineHeight: moderateScale(20),
    color: colors.text.secondary,
  },
  subtitle1: {
    fontSize: moderateScale(16),
    fontWeight: '500' as const,
    lineHeight: moderateScale(24),
    color: colors.text.primary,
  },
  subtitle2: {
    fontSize: moderateScale(14),
    fontWeight: '500' as const,
    lineHeight: moderateScale(20),
    color: colors.text.secondary,
  },
  caption: {
    fontSize: moderateScale(12),
    fontWeight: '400' as const,
    lineHeight: moderateScale(16),
    color: colors.text.tertiary,
  },
  button: {
    fontSize: moderateScale(16),
    fontWeight: '600' as const,
    lineHeight: moderateScale(24),
    textTransform: 'none' as const,
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '500' as const,
    lineHeight: moderateScale(20),
    color: colors.text.secondary,
  },
};
