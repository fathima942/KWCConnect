import { ColorTokens } from '../types/theme';

/**
 * Official KWC Color Palette as defined in DESIGN_SYSTEM.md
 */
export const colors: ColorTokens = {
  primary: '#7A1F3D', // Deep Maroon
  secondary: '#12355B', // Deep Navy
  accent: '#C89B3C', // Warm Gold
  background: '#F8F9FA',
  surface: '#FFFFFF',
  textPrimary: '#222222',
  textSecondary: '#666666',
  success: '#2E7D32',
  warning: '#F9A825',
  error: '#C62828',
  divider: '#E0E0E0',
  backgroundSelected: '#F0F0F3',
  backgroundElement: '#F0F0F3',
};

/**
 * Dark mode color overrides
 */
export const darkColors: ColorTokens = {
  ...colors,
  background: '#121212',
  surface: '#1E1E1E',
  textPrimary: '#F8F9FA',
  textSecondary: '#B0B0B0',
  divider: '#333333',
  backgroundSelected: '#2E3135',
  backgroundElement: '#212225',
};
