import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';
import { AppButton } from '@/components/common/AppButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Official KWC Connect Web Landing Page.
 * Professional Government Service Website structure.
 */
export default function WebLandingPage() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 1. TOP ACCESSIBILITY / UTILITY BAR */}
      <View style={styles.utilityBar}>
        <View style={styles.contentContainer}>
          <View style={styles.utilityContent}>
            <View style={styles.accessibilityLinks}>
              <ThemedText type="small" style={styles.utilityLink}>Skip to Main Content</ThemedText>
              <ThemedText type="small" style={styles.utilityLink}>Screen Reader Access</ThemedText>
              <ThemedText type="small" style={styles.utilityLink}>A+ A A-</ThemedText>
            </View>
            <View style={styles.languageSelector}>
              <ThemedText type="smallBold" themeColor="primary">English</ThemedText>
              <ThemedText type="small" style={styles.utilityDivider}>|</ThemedText>
              <ThemedText type="small" style={styles.utilityLink}>മലയാളം</ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* 2. KWC HEADER */}
      <View style={styles.header}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Image
                source={require('@/assets/expo.icon/Assets/kwc_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.brandText}>
                <ThemedText type="smallBold" style={styles.govTitle}>GOVERNMENT OF KERALA</ThemedText>
                <ThemedText type="title" themeColor="primary" style={styles.commissionTitle}>
                  Kerala Women's Commission
                </ThemedText>
              </View>
            </View>
            <View style={styles.headerRight}>
              <AppButton
                title="Login"
                onPress={() => router.push('/(auth)/login')}
                style={styles.loginBtn}
              />
              <AppButton
                title="Sign Up"
                type="secondary"
                onPress={() => router.push('/(auth)/signup')}
                style={styles.signupBtn}
              />
            </View>
          </View>
        </View>
      </View>

      {/* 3. HORIZONTAL DESKTOP NAVIGATION */}
      <View style={styles.navBar}>
        <View style={styles.contentContainer}>
          <View style={styles.navContent}>
            <NavLink title="Home" active />
            <NavLink title="Services" />
            <NavLink title="File a Complaint" onPress={() => router.push('/(auth)/login')} />
            <NavLink title="Track Case" onPress={() => router.push('/(auth)/login')} />
            <NavLink title="Hearings" />
            <NavLink title="Counselling" />
            <NavLink title="About Us" />
            <NavLink title="Contact" />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 4. HERO / WELCOME SECTION */}
        <View style={styles.heroSection}>
          <View style={styles.contentContainer}>
            <View style={styles.heroContent}>
              <View style={styles.heroText}>
                <ThemedText type="smallBold" themeColor="primary" style={styles.heroBadge}>KWC CONNECT</ThemedText>
                <ThemedText type="title" style={styles.heroTitle}>
                  Empowering Women. Ensuring Justice.
                </ThemedText>
                <ThemedText style={styles.heroDescription} themeColor="textSecondary">
                  KWC Connect is the official digital platform of the Kerala Women's Commission. We provide secure and direct access to legal support, counselling, and case management services for every woman in Kerala.
                </ThemedText>
                <View style={styles.heroCta}>
                  <AppButton
                    title="File a Complaint"
                    onPress={() => router.push('/(auth)/login')}
                    style={styles.primaryCta}
                  />
                  <AppButton
                    title="Track Your Case"
                    type="secondary"
                    onPress={() => router.push('/(auth)/login')}
                    style={styles.secondaryCta}
                  />
                </View>
              </View>
              <View style={styles.heroImageContainer}>
                <Image
                  source={require('@/assets/expo.icon/Assets/images/hero-web.png')}
                  style={styles.heroIllustration}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>

        {/* 5. SERVICES SECTION */}
        <View style={styles.section}>
          <View style={styles.contentContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Online Services</ThemedText>
            <View style={styles.serviceGrid}>
              <ServiceCard
                title="Complaint Registration"
                desc="Submit a formal complaint securely to the Commission for scrutiny and action."
                icon="file-document-edit-outline"
              />
              <ServiceCard
                title="Real-time Tracking"
                desc="Monitor the current status and progress of your submitted complaints."
                icon="file-search-outline"
              />
              <ServiceCard
                title="Hearing Schedules"
                desc="Access information about upcoming hearings and Adalat proceedings."
                icon="calendar-clock"
              />
              <ServiceCard
                title="Counselling Access"
                desc="Request and manage appointments for professional counselling support."
                icon="account-heart-outline"
              />
            </View>
          </View>
        </View>

        {/* 6. INFORMATION / TRUST SECTION */}
        <View style={styles.trustSection}>
          <View style={styles.contentContainer}>
            <View style={styles.trustGrid}>
              <TrustItem icon="shield-check" title="Secure" desc="Encryption protected data" />
              <TrustItem icon="eye-off" title="Confidential" desc="Identity protection guaranteed" />
              <TrustItem icon="account-group" title="Accessible" desc="Easy for everyone to use" />
              <TrustItem icon="check-decagram" title="Official" desc="Direct Commission channel" />
            </View>
          </View>
        </View>

        {/* 7. FOOTER */}
        <View style={styles.footer}>
          <View style={styles.contentContainer}>
            <View style={styles.footerTop}>
              <View style={styles.footerCol}>
                <ThemedText type="smallBold" style={styles.footerHeading}>KWC CONNECT</ThemedText>
                <ThemedText type="small" style={styles.footerText}>
                  Kerala Women's Commission{'\n'}
                  LMS Compound, Near Museum{'\n'}
                  Thiruvananthapuram, Kerala 695033
                </ThemedText>
              </View>
              <View style={styles.footerCol}>
                <ThemedText type="smallBold" style={styles.footerHeading}>IMPORTANT LINKS</ThemedText>
                <FooterLink title="About the Commission" />
                <FooterLink title="Citizen Charter" />
                <FooterLink title="Our Services" />
                <FooterLink title="Resources" />
              </View>
              <View style={styles.footerCol}>
                <ThemedText type="smallBold" style={styles.footerHeading}>SUPPORT</ThemedText>
                <FooterLink title="Contact Us" />
                <FooterLink title="Help & FAQs" />
                <FooterLink title="Privacy Policy" />
                <FooterLink title="Terms of Use" />
              </View>
              <View style={styles.footerCol}>
                <ThemedText type="smallBold" style={styles.footerHeading}>HELPLINE</ThemedText>
                <ThemedText type="subtitle" themeColor="primary" style={styles.helpline}>181</ThemedText>
                <ThemedText type="small" style={styles.footerText}>24/7 Women Helpline</ThemedText>
              </View>
            </View>
            <View style={styles.footerBottom}>
              <ThemedText type="small" style={styles.footerCopy}>
                © 2024 Kerala Women's Commission. Developed for presentation. All Rights Reserved.
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const NavLink = ({ title, active, onPress }: { title: string, active?: boolean, onPress?: () => void }) => (
  <Pressable onPress={onPress} style={[styles.navLink, active && styles.activeNavLink]}>
    <ThemedText type="smallBold" style={[styles.navLinkText, active && styles.activeNavLinkText]}>
      {title}
    </ThemedText>
  </Pressable>
);

const ServiceCard = ({ title, desc, icon }: { title: string, desc: string, icon: any }) => (
  <View style={[styles.serviceCard, shadows.small]}>
    <View style={styles.serviceIconCircle}>
      <MaterialCommunityIcons name={icon} size={32} color="#7A1F3D" />
    </View>
    <ThemedText type="smallBold" style={styles.serviceCardTitle}>{title}</ThemedText>
    <ThemedText type="small" themeColor="textSecondary" style={styles.serviceCardDesc}>{desc}</ThemedText>
  </View>
);

const TrustItem = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <View style={styles.trustItem}>
    <MaterialCommunityIcons name={icon} size={24} color="#12355B" />
    <View style={styles.trustText}>
      <ThemedText type="smallBold">{title}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">{desc}</ThemedText>
    </View>
  </View>
);

const FooterLink = ({ title }: { title: string }) => (
  <ThemedText type="small" style={styles.footerColLink}>{title}</ThemedText>
);

const MAX_WIDTH = 1200;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
  },
  utilityBar: {
    backgroundColor: '#F0F0F3',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  utilityContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  accessibilityLinks: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  utilityLink: {
    fontSize: 11,
    color: '#666',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  utilityDivider: {
    fontSize: 11,
    color: '#CCC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  logo: {
    width: 80,
    height: 80,
  },
  brandText: {
    justifyContent: 'center',
  },
  govTitle: {
    fontSize: 11,
    letterSpacing: 1,
    opacity: 0.7,
  },
  commissionTitle: {
    fontSize: 24,
    lineHeight: 28,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  loginBtn: {
    height: 40,
    paddingHorizontal: spacing.xl,
  },
  signupBtn: {
    height: 40,
    paddingHorizontal: spacing.xl,
  },
  navBar: {
    backgroundColor: '#7A1F3D',
    minHeight: 48,
  },
  navContent: {
    flexDirection: 'row',
    height: '100%',
    flexWrap: 'wrap',
  },
  navLink: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  activeNavLink: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  navLinkText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  activeNavLinkText: {
    color: '#C89B3C',
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    backgroundColor: '#FFF6F7',
    paddingVertical: 80,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    flexWrap: 'wrap',
  },
  heroText: {
    flex: 1,
    minWidth: 320,
  },
  heroBadge: {
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 56,
    marginBottom: spacing.md,
  },
  heroDescription: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 40,
  },
  heroCta: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  primaryCta: {
    paddingHorizontal: 40,
  },
  secondaryCta: {
    paddingHorizontal: 40,
  },
  heroImageContainer: {
    flex: 1,
    alignItems: 'flex-end',
    minWidth: 320,
  },
  heroIllustration: {
    width: '100%',
    height: 550,
  },
  section: {
    paddingVertical: 80,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 60,
    fontSize: 32,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xl,
    justifyContent: 'center',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing.xl,
    width: '23%',
    minWidth: 260,
    borderWidth: 1,
    borderColor: '#F0F0F3',
  },
  serviceIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(122, 31, 61, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  serviceCardTitle: {
    fontSize: 18,
    marginBottom: spacing.sm,
  },
  serviceCardDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  trustSection: {
    paddingVertical: 40,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  trustGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    flexWrap: 'wrap',
    gap: spacing.xl,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 200,
  },
  trustText: {
    justifyContent: 'center',
  },
  footer: {
    backgroundColor: '#12355B',
    paddingTop: 80,
  },
  footerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 60,
    flexWrap: 'wrap',
    gap: spacing.xxl,
  },
  footerCol: {
    flex: 1,
    minWidth: 240,
  },
  footerHeading: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: spacing.xl,
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
  },
  footerColLink: {
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.md,
  },
  helpline: {
    color: '#C89B3C',
    fontSize: 48,
    lineHeight: 48,
    fontWeight: '900',
    marginBottom: 8,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerCopy: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  }
});
