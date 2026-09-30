import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { AppButton } from '@/components/common/AppButton';
import { spacing } from '@/theme/spacing';

export default function HearingsScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <AppButton
          title="← Back"
          type="text"
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <ThemedText type="subtitle">Hearings & Adalats</ThemedText>
      </View>

      <View style={styles.content}>
        <EmptyState
          title="No Scheduled Hearings"
          message="When a hearing or adalat is scheduled for your case, the date, time and location details will appear here."
          actionLabel="Return to Dashboard"
          onAction={() => router.replace('/(app)/dashboard')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    paddingHorizontal: 0,
    height: 'auto',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
