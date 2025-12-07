export { colors } from './colors';
export { spacing, verticalSpacing, horizontalSpacing } from './spacing';
export { typography } from './typography';
export { shadows } from './shadows';
export { borderRadius } from './borderRadius';

import { colors } from './colors';
import { spacing, verticalSpacing, horizontalSpacing } from './spacing';
import { typography } from './typography';
import { shadows } from './shadows';
import { borderRadius } from './borderRadius';

export const theme = {
  colors,
  spacing,
  verticalSpacing,
  horizontalSpacing,
  typography,
  shadows,
  borderRadius,
};

export type Theme = typeof theme;
