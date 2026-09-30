import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme/spacing';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <AppButton
          title="← Back"
          type="text"
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <ThemedText type="subtitle">Citizen Profile</ThemedText>
      </View>

      <View style={styles.content}>
        <AppCard style={styles.profileCard}>
          <View style={styles.profileItem}>
            <ThemedText type="smallBold" themeColor="textSecondary">Full Name</ThemedText>
            <ThemedText type="subtitle" style={styles.value}>{user?.displayName || 'Not provided'}</ThemedText>
          </View>

          <View style={styles.profileItem}>
            <ThemedText type="smallBold" themeColor="textSecondary">Mobile Number</ThemedText>
            <ThemedText style={styles.value}>{user?.phoneNumber}</ThemedText>
          </View>

          <View style={styles.profileItem}>
            <ThemedText type="smallBold" themeColor="textSecondary">Role</ThemedText>
            <ThemedText style={[styles.value, styles.role]}>{user?.role?.toUpperCase()}</ThemedText>
          </View>
        </AppCard>

        <AppButton
          title="Edit Profile"
          type="secondary"
          onPress={() => {}}
          style={styles.actionButton}
        />

        <AppButton
          title="Sign Out"
          onPress={signOut}
          style={[styles.actionButton, styles.signOutButton]}
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
  },
  profileCard: {
    marginBottom: spacing.xxl,
    gap: spacing.lg,
  },
  profileItem: {
    gap: 4,
  },
  value: {
    fontSize: 18,
  },
  role: {
    fontWeight: '700',
    color: '#7A1F3D',
  },
  actionButton: {
    marginBottom: spacing.md,
  },
  signOutButton: {
    marginTop: spacing.xl,
  }
});
