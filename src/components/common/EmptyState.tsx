import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppButton } from './AppButton';
import { spacing } from '@/theme/spacing';

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

/**
 * Generic empty state component for lists and dashboards.
 */
export const EmptyState = ({
  title,
  message,
  actionLabel,
  onAction,
  style
}: EmptyStateProps) => {
  return (
    <View style={[styles.container, style]}>
      <ThemedText type="subtitle" style={styles.title} themeColor="textPrimary">
        {title}
      </ThemedText>
      {message && (
        <ThemedText style={styles.message} themeColor="textSecondary">
          {message}
        </ThemedText>
      )}
      {actionLabel && onAction && (
        <AppButton
          title={actionLabel}
          onPress={onAction}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    width: '100%',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontSize: 14,
  },
  button: {
    minWidth: 200,
  },
});
