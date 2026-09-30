import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface ErrorViewProps {
  message?: string;
}

/**
 * A generic error placeholder for KWC Connect.
 * Displayed when a component or screen fails to load.
 */
export const ErrorView = ({ message = 'An unexpected error occurred.' }: ErrorViewProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Error</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: 'transparent',
  },
  title: {
    ...typography.headingM,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
