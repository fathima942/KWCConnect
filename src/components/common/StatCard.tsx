import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';

interface StatCardProps {
  label: string;
  value: string;
}

/**
 * A standardized statistics card for the KWC Connect Home Screen.
 */
export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <View style={styles.card}>
      <ThemedText type="smallBold" style={styles.value} themeColor="primary">
        {value}
      </ThemedText>
      <ThemedText type="small" style={styles.label} themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.medium,
    ...shadows.small,
    margin: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  value: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  label: {
    textAlign: 'center',
  },
});
