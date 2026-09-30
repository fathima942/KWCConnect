import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { AppTheme } from '@/types/theme';

export type ThemedViewProps = ViewProps & {
  themeColor?: keyof AppTheme['colors'];
};

/**
 * A themed View component that consumes the KWC Design System.
 */
export function ThemedView({ style, themeColor = 'background', ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme[themeColor] }, style]} {...otherProps} />;
}
