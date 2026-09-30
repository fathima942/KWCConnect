import { AppTheme } from '../types/theme';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';

/**
 * Official KWC Light Theme assembly.
 */
export const LightTheme: AppTheme = {
  dark: false,
  colors: colors,
  typography,
  spacing,
  radius,
  shadows,
};
