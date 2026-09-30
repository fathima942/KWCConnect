import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';

interface ServiceCardProps {
  title: string;
}

/**
 * A standardized service card for the KWC Connect Home Screen.
 */
export const ServiceCard = ({ title }: ServiceCardProps) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconPlaceholder, { backgroundColor: colors.background }]} />
      <ThemedText type="smallBold" style={styles.title} themeColor="textPrimary">
        {title}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.medium,
    ...shadows.small,
    margin: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  title: {
    textAlign: 'center',
  },
});
