import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { AppButton } from '@/components/common/AppButton';
import { spacing } from '@/theme/spacing';

export default function CasesScreen() {
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
        <ThemedText type="subtitle">Track My Cases</ThemedText>
      </View>

      <View style={styles.content}>
        <EmptyState
          title="No Active Cases"
          message="You haven't submitted any complaints yet. Once submitted, you can track the real-time status of your case here."
          actionLabel="File a Complaint"
          onAction={() => router.push('/(app)/complaint')}
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
