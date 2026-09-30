import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { typography } from '@/theme/typography';
import { AppTheme } from '@/types/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'code';
  themeColor?: keyof AppTheme['colors'];
};

/**
 * A themed Text component that consumes the KWC Design System.
 */
export function ThemedText({ style, type = 'default', themeColor = 'textPrimary', ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    ...typography.body,
  },
  title: {
    ...typography.headingXL,
  },
  subtitle: {
    ...typography.headingL,
  },
  small: {
    ...typography.caption,
  },
  smallBold: {
    ...typography.caption,
    fontWeight: '700',
  },
  link: {
    ...typography.button,
    textDecorationLine: 'underline',
  },
  code: {
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', web: 'monospace' }),
    fontSize: 14,
  },
});
