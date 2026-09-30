/**
 * Custom hook to access the KWC Design System theme based on the current color scheme.
 */

import { useColorScheme } from 'react-native';
import { colors, darkColors } from '@/theme/colors';

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return isDark ? darkColors : colors;
}
