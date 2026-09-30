import React from 'react';
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'text';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Standardized button for KWC Connect.
 * Supports primary, secondary and text variations.
 */
export const AppButton = ({
  title,
  onPress,
  type = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle
}: AppButtonProps) => {
  const theme = useTheme();

  const getButtonStyle = () => {
    switch (type) {
      case 'secondary':
        return [
          styles.button,
          styles.secondary,
          { borderColor: theme.primary },
          style
        ];
      case 'text':
        return [styles.textButton, style];
      default:
        return [
          styles.button,
          styles.primary,
          { backgroundColor: theme.primary },
          !disabled && shadows.small,
          style
        ];
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'secondary':
        return [styles.buttonText, { color: theme.primary }, textStyle];
      case 'text':
        return [styles.textButtonText, { color: theme.secondary }, textStyle];
      default:
        return [styles.buttonText, { color: '#FFFFFF' }, textStyle];
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        ...getButtonStyle() as any[],
        (pressed || disabled || loading) && { opacity: 0.7 }
      ]}
    >
      {loading ? (
        <ActivityIndicator color={type === 'primary' ? '#FFFFFF' : theme.primary} />
      ) : (
        <ThemedText type="smallBold" style={getTextStyle()}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
  },
  primary: {
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  textButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  buttonText: {
    fontSize: 16,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  textButtonText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
