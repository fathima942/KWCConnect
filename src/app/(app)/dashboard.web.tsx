import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme/spacing';
import { colors } from '@/theme/colors';
import { AppCard } from '@/components/common/AppCard';
import { EmptyState } from '@/components/common/EmptyState';
import { AppButton } from '@/components/common/AppButton';

/**
 * Professional Web Dashboard for KWC Connect.
 * Proper full-width horizontal structure.
 */
export default function WebDashboardScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 1. TOP HEADER / NAVBAR */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerBrand}>
            <ThemedText type="smallBold" themeColor="primary" style={styles.brandTitle}>
              KWC Connect
            </ThemedText>
          </View>

          <View style={styles.headerNav}>
            <NavLink title="Home" active onPress={() => router.push('/dashboard')} />
            <NavLink title="My Cases" onPress={() => router.push('/(app)/cases')} />
            <NavLink title="Hearings" onPress={() => router.push('/(app)/hearings')} />
            <NavLink title="Counselling" onPress={() => router.push('/(app)/counselling')} />
            <NavLink title="Resources" />
            <NavLink title="Contact Us" />
          </View>

          <View style={styles.headerUser}>
            <Pressable onPress={() => router.push('/(app)/profile')} style={styles.userProfile}>
              <MaterialCommunityIcons name="account-circle-outline" size={24} color={colors.primary} />
              <ThemedText type="smallBold">{user?.displayName || 'Citizen'}</ThemedText>
            </Pressable>
            <View style={styles.divider} />
            <AppButton
              title="Logout"
              type="text"
              onPress={signOut}
              style={styles.logoutButton}
              textStyle={styles.logoutText}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.mainScrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainContent}>

          {/* 2. WELCOME HERO */}
          <View style={styles.heroSection}>
            <View style={styles.heroText}>
              <ThemedText type="title" themeColor="primary" style={styles.heroTitle}>
                Welcome back, {user?.displayName || 'Citizen'}
              </ThemedText>
              <ThemedText style={styles.heroDescription} themeColor="textSecondary">
                Access Kerala Women's Commission services, manage complaints, and track your cases securely through our unified digital portal.
              </ThemedText>
              <AppButton
                title="File a Complaint"
                onPress={() => router.push('/(app)/complaint')}
                style={styles.heroCta}
              />
            </View>
          </View>

          {/* 3. SERVICES GRID */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Our Services</ThemedText>
            <View style={styles.serviceGrid}>
              <ServiceCard
                title="File a Complaint"
                desc="Submit details and evidence securely."
                icon="file-document-edit-outline"
                onPress={() => router.push('/(app)/complaint')}
              />
              <ServiceCard
                title="Track Your Case"
                desc="Check real-time status of your cases."
                icon="file-search-outline"
                onPress={() => router.push('/(app)/cases')}
              />
              <ServiceCard
                title="Hearings"
                desc="View upcoming hearing schedules."
                icon="calendar-clock"
                onPress={() => router.push('/(app)/hearings')}
              />
              <ServiceCard
                title="Counselling"
                desc="Access professional support services."
                icon="account-heart-outline"
                onPress={() => router.push('/(app)/counselling')}
              />
            </View>
          </View>

          <View style={styles.bottomRow}>
            {/* 4. RECENT CASES */}
            <View style={styles.casesSection}>
              <View style={styles.sectionHeader}>
                <ThemedText type="subtitle">Recent Cases</ThemedText>
                <Pressable onPress={() => router.push('/(app)/cases')}>
                  <ThemedText themeColor="primary" style={styles.viewAll}>View All</ThemedText>
                </Pressable>
              </View>

              <AppCard padding="xl" style={styles.casesCard}>
                <EmptyState
                  title="No complaints yet"
                  message="You haven't submitted any complaints yet. Your registered cases will appear in this list."
                />
              </AppCard>
            </View>

            {/* 5. EMERGENCY CONTACT */}
            <View style={styles.supportSection}>
               <ThemedText type="subtitle" style={styles.sectionTitle}>Emergency Support</ThemedText>
               <AppCard style={styles.emergencyCard} padding="xl">
                  <View style={styles.emergencyContent}>
                    <View>
                      <ThemedText type="smallBold" themeColor="primary">24/7 Helpline</ThemedText>
                      <ThemedText style={styles.emergencyDesc} themeColor="textSecondary">
                        Immediate assistance for women in distress.
                      </ThemedText>
                    </View>
                    <ThemedText type="title" themeColor="primary" style={styles.emergencyNumber}>181</ThemedText>
                  </View>
               </AppCard>
            </View>
          </View>
        </View>

        {/* 6. FOOTER */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerBrand}>
              <ThemedText type="smallBold" themeColor="primary">KWC Connect</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">Official Portal of Kerala Women's Commission</ThemedText>
            </View>
            <View style={styles.footerLinks}>
              <FooterLink title="About" />
              <FooterLink title="Privacy" />
              <FooterLink title="Terms" />
              <FooterLink title="Contact" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const NavLink = ({ title, active, onPress }: { title: string, active?: boolean, onPress?: () => void }) => (
  <Pressable onPress={onPress} style={styles.navLink}>
    <ThemedText
      type="smallBold"
      themeColor={active ? 'primary' : 'textSecondary'}
      style={active && styles.activeNavLink}
    >
      {title}
    </ThemedText>
  </Pressable>
);

const ServiceCard = ({ title, desc, icon, onPress }: { title: string, desc: string, icon: any, onPress: () => void }) => (
  <AppCard onPress={onPress} style={styles.serviceCard} padding="xl">
    <View style={styles.serviceIconCircle}>
      <MaterialCommunityIcons name={icon} size={32} color={colors.primary} />
    </View>
    <ThemedText type="smallBold" style={styles.serviceTitle}>{title}</ThemedText>
    <ThemedText type="small" themeColor="textSecondary" style={styles.serviceDesc}>{desc}</ThemedText>
  </AppCard>
);

const FooterLink = ({ title }: { title: string }) => (
  <ThemedText type="small" style={styles.footerLink} themeColor="textSecondary">{title}</ThemedText>
);

const MAX_WIDTH = 1200;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    width: '100%',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 100,
    ...Platform.select({
      web: { position: 'sticky', top: 0 } as any
    })
  },
  headerContent: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 22,
    letterSpacing: -0.5,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginLeft: 60,
    flex: 1,
  },
  navLink: {
    paddingVertical: 10,
  },
  activeNavLink: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  logoutButton: {
    paddingHorizontal: 0,
    height: 'auto',
  },
  logoutText: {
    color: '#666',
    fontSize: 14,
  },
  mainScrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  mainContent: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    paddingHorizontal: spacing.xl,
    paddingVertical: 40,
  },
  heroSection: {
    backgroundColor: 'rgba(122, 31, 61, 0.02)',
    padding: 60,
    borderRadius: 24,
    marginBottom: 60,
    borderWidth: 1,
    borderColor: 'rgba(122, 31, 61, 0.05)',
  },
  heroText: {
    maxWidth: 600,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 32,
  },
  heroCta: {
    width: 220,
  },
  section: {
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 24,
  },
  serviceGrid: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  serviceCard: {
    flex: 1,
    minHeight: 220,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  serviceIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(122, 31, 61, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  serviceTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  serviceDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 40,
  },
  casesSection: {
    flex: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  viewAll: {
    fontSize: 15,
    fontWeight: '700',
  },
  casesCard: {
    minHeight: 250,
    justifyContent: 'center',
  },
  supportSection: {
    flex: 1,
  },
  emergencyCard: {
    backgroundColor: '#FFF6F7',
    borderColor: 'rgba(122, 31, 61, 0.1)',
  },
  emergencyContent: {
    alignItems: 'center',
    gap: 20,
  },
  emergencyDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  emergencyNumber: {
    fontSize: 48,
    fontWeight: '900',
  },
  footer: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 60,
    marginTop: 60,
    alignItems: 'center',
  },
  footerContent: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerBrand: {
    gap: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 32,
  },
  footerLink: {
    fontSize: 14,
  }
});
