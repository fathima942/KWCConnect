import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { AppButton } from '@/components/common/AppButton';
import { spacing } from '@/theme/spacing';

export default function CounsellingScreen() {
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
        <ThemedText type="subtitle">Counselling Services</ThemedText>
      </View>

      <View style={styles.content}>
        <EmptyState
          title="Professional Support"
          message="Access to professional counselling services will be available here. The Commission provides supportive and confidential assistance."
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
