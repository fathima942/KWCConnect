import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { spacing } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { AppButton } from '@/components/common/AppButton';

/**
 * Official KWC Connect Mobile Landing Page.
 * Redesigned for a professional, government-grade appearance.
 */
export default function MobileLandingPage() {
  const theme = useTheme();
  const router = useRouter();

  // Animation values
  const fadeAnimLogo = useRef(new Animated.Value(0)).current;
  const fadeAnimContent = useRef(new Animated.Value(0)).current;
  const slideAnimContent = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(300, [
      Animated.timing(fadeAnimLogo, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnimContent, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimContent, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Background Layer: Illustration (Bottom Artwork) */}
      <Image
        source={require('@/assets/expo.icon/Assets/images/hero-mobile.png')}
        style={styles.mobileHeroBg}
        resizeMode="contain"
      />

      {/* Content Layer */}
      <View style={styles.contentOverlay}>
        <Animated.View
          style={[
            styles.mainContentGroup,
            {
              opacity: fadeAnimContent,
              transform: [{ translateY: slideAnimContent }],
            },
          ]}
        >
          <View style={styles.brandingContainer}>
            <Image
              source={require('@/assets/expo.icon/Assets/kwc_logo.png')}
              style={styles.mainLogo}
              resizeMode="contain"
            />
            <ThemedText type="title" themeColor="primary" style={styles.appTitle}>
              KWC Connect
            </ThemedText>
            <ThemedText type="subtitle" themeColor="secondary" style={styles.orgTitle}>
              Kerala Women's Commission
            </ThemedText>
          </View>

          <View style={styles.descriptionWrapper}>
            <ThemedText style={styles.description} themeColor="textSecondary">
              Official digital platform of the Kerala Women's Commission. Access support services, manage complaints, and track cases securely.
            </ThemedText>
          </View>

          <View style={styles.actionSection}>
            <AppButton
              title="Login"
              onPress={() => router.push('/(auth)/login')}
              style={styles.button}
            />
            <AppButton
              title="Sign Up"
              type="secondary"
              onPress={() => router.push('/(auth)/signup')}
              style={styles.button}
            />
          </View>

          {/* Language Selector */}
          <View style={styles.languageContainer}>
            <ThemedText type="smallBold" themeColor="primary">English</ThemedText>
            <ThemedText type="small" style={styles.languageDivider}>|</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">മലയാളം</ThemedText>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mobileHeroBg: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    width: '100%',
    height: '45%',
    zIndex: 0,
    opacity: 0.9,
  },
  contentOverlay: {
    flex: 1,
    zIndex: 10,
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  mainContentGroup: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  brandingContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.xl,
  },
  mainLogo: {
    width: 110,
    height: 110,
    marginBottom: spacing.md,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 2,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  orgTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.9,
  },
  descriptionWrapper: {
    marginBottom: 28,
    maxWidth: 320,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 15,
  },
  actionSection: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  languageDivider: {
    opacity: 0.3,
  },
});
