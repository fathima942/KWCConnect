import React from 'react';
import { StyleSheet, View, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppCard } from '@/components/common/AppCard';
import { EmptyState } from '@/components/common/EmptyState';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme/spacing';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

/**
 * Mobile-First Citizen Dashboard.
 * Optimized for a professional government-service experience.
 */
export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ScreenContainer scrollable={true} style={styles.container}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <View style={styles.brandWrapper}>
          <ThemedText type="smallBold" themeColor="primary" style={styles.brandTitle}>
            KWC Connect
          </ThemedText>
        </View>
        <Pressable
          onPress={() => router.push('/(app)/profile')}
          style={styles.profileButton}
          accessibilityLabel="My Profile"
        >
          <View style={styles.avatarCircle}>
             <MaterialCommunityIcons name="account-circle-outline" size={28} color={colors.primary} />
          </View>
        </Pressable>
      </View>

      {/* 2. WELCOME */}
      <View style={styles.welcomeSection}>
        <ThemedText themeColor="textSecondary" style={styles.greeting}>
          Namaste,
        </ThemedText>
        <ThemedText type="subtitle" themeColor="textPrimary" style={styles.userName}>
          {user?.displayName || 'Citizen'}
        </ThemedText>
        <ThemedText style={styles.subGreeting} themeColor="textSecondary">
          How can we help you today?
        </ThemedText>
      </View>

      {/* 3. PRIMARY ACTION */}
      <AppCard
        onPress={() => router.push('/(app)/complaint')}
        style={styles.primaryActionCard}
        padding="xl"
      >
        <View style={styles.primaryActionContent}>
          <View style={[styles.primaryIconBox, { backgroundColor: 'rgba(122, 31, 61, 0.08)' }]}>
            <MaterialCommunityIcons name="file-document-edit-outline" size={32} color={colors.primary} />
          </View>
          <View style={styles.primaryTextWrapper}>
            <ThemedText type="smallBold" themeColor="primary" style={styles.primaryActionTitle}>
              File a Complaint
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Submit a new complaint securely to the Commission.
            </ThemedText>
          </View>
        </View>
      </AppCard>

      {/* 4. QUICK SERVICES GRID */}
      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <QuickServiceCard
            title="Track Case"
            icon="file-search-outline"
            onPress={() => router.push('/(app)/cases')}
          />
          <QuickServiceCard
            title="Hearings"
            icon="calendar-clock"
            onPress={() => router.push('/(app)/hearings')}
          />
        </View>
        <View style={styles.row}>
          <QuickServiceCard
            title="Counselling"
            icon="account-heart-outline"
            onPress={() => router.push('/(app)/counselling')}
          />
          <QuickServiceCard
            title="My Profile"
            icon="account-circle-outline"
            onPress={() => router.push('/(app)/profile')}
          />
        </View>
      </View>

      {/* 5. RECENT CASES */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <ThemedText type="smallBold" style={styles.sectionTitle}>
            Recent Cases
          </ThemedText>
          <Pressable onPress={() => router.push('/(app)/cases')}>
            <ThemedText themeColor="primary" style={styles.viewAll}>
              View All
            </ThemedText>
          </Pressable>
        </View>

        <AppCard padding="lg" style={styles.emptyCard}>
          <EmptyState
            title="No complaints yet"
            message="Your registered cases will appear here."
            style={styles.emptyState}
          />
        </AppCard>
      </View>

      {/* 6. EMERGENCY CONTACT */}
      <View style={[styles.emergencyBar, { backgroundColor: colors.primary }]}>
        <View style={styles.emergencyInfo}>
          <ThemedText style={styles.emergencyLabel}>Emergency Contact</ThemedText>
          <ThemedText style={styles.emergencySub}>Immediate assistance 24/7</ThemedText>
        </View>
        <ThemedText type="subtitle" style={styles.emergencyNum}>181</ThemedText>
      </View>
    </ScreenContainer>
  );
}

const QuickServiceCard = ({ title, icon, onPress }: { title: string, icon: any, onPress: () => void }) => (
  <AppCard
    style={styles.serviceCard}
    onPress={onPress}
    padding="lg"
  >
    <View style={styles.serviceIconWrapper}>
      <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
    </View>
    <ThemedText type="smallBold" style={styles.serviceTitle}>{title}</ThemedText>
  </AppCard>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: Platform.OS === 'android' ? spacing.md : 0,
  },
  brandWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  profileButton: {
    padding: 4,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
    borderWidth: 1,
    borderColor: 'rgba(122, 31, 61, 0.05)',
  },
  welcomeSection: {
    marginBottom: spacing.xxl,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 2,
  },
  userName: {
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 6,
  },
  subGreeting: {
    fontSize: 15,
  },
  primaryActionCard: {
    marginBottom: spacing.xl,
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(122, 31, 61, 0.1)',
  },
  primaryActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  primaryIconBox: {
    width: 60,
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryTextWrapper: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  gridContainer: {
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  serviceCard: {
    flex: 1,
    minHeight: 110,
    justifyContent: 'center',
  },
  serviceIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(18, 53, 91, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  serviceTitle: {
    fontSize: 15,
  },
  recentSection: {
    marginBottom: spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: 'rgba(0,0,0,0.01)',
    borderStyle: 'dashed',
    borderColor: 'rgba(0,0,0,0.1)',
  },
  emptyState: {
    padding: spacing.lg,
  },
  emergencyBar: {
    padding: spacing.xl,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    ...shadows.medium,
  },
  emergencyInfo: {
    flex: 1,
    gap: 4,
  },
  emergencyLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emergencySub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
  },
  emergencyNum: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
  },
});
