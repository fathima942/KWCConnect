import { AppTheme } from '../types/theme';
import { darkColors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';

/**
 * Official KWC Dark Theme assembly.
 */
export const DarkTheme: AppTheme = {
  dark: true,
  colors: darkColors,
  typography,
  spacing,
  radius,
  shadows,
};
