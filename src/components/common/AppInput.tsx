import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

/**
 * Standardized text input for KWC Connect forms.
 * Includes labels, validation errors and consistent styling.
 */
export const AppInput = ({
  label,
  error,
  containerStyle,
  required,
  ...rest
}: AppInputProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText type="smallBold" style={styles.label} themeColor="textSecondary">
          {label} {required && <ThemedText style={{ color: theme.error }}>*</ThemedText>}
        </ThemedText>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.surface,
            borderColor: error ? theme.error : theme.divider
          }
        ]}
      >
        <TextInput
          placeholderTextColor={theme.textSecondary + '80'}
          style={[styles.input, { color: theme.textPrimary }]}
          {...rest}
        />
      </View>
      {error && (
        <ThemedText style={[styles.errorText, { color: theme.error }]}>
          {error}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    marginBottom: spacing.xs,
    fontSize: 14,
  },
  inputWrapper: {
    height: 56,
    borderRadius: radius.medium,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
