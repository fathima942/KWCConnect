import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

const MAROON = '#7A1F3D';
const NAVY = '#12355B';
const GOLD = '#C89B3C';

export default function ComplaintMethodPage() {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 800;

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.desktopScrollContent,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={21}
            color={NAVY}
          />

          <ThemedText
            style={styles.backText}
            themeColor="textSecondary"
          >
            Back
          </ThemedText>
        </Pressable>

        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.titleAccent} />

          <ThemedText
            type="title"
            themeColor="primary"
            style={styles.title}
          >
            File a Complaint
          </ThemedText>

          <ThemedText
            style={styles.subtitle}
            themeColor="textSecondary"
          >
            Choose how you would like to provide your complaint
            details.
          </ThemedText>

          <ThemedText
            style={styles.description}
            themeColor="textSecondary"
          >
            You can describe your complaint naturally using your
            voice, or enter the details yourself. You will be able
            to review and edit your information before submitting it.
          </ThemedText>
        </View>

        {/* Complaint options */}
        <View
          style={[
            styles.optionsContainer,
            isDesktop && styles.desktopOptions,
          ]}
        >
          {/* SPEAK OPTION */}
          <View style={styles.optionCard}>
            <View
              style={[
                styles.iconContainer,
                styles.voiceIconBackground,
              ]}
            >
              <MaterialCommunityIcons
                name="microphone-outline"
                size={36}
                color={MAROON}
              />
            </View>

            <View style={styles.cardContent}>
              <ThemedText
                style={styles.cardTitle}
                themeColor="primary"
              >
                Speak Your Complaint
              </ThemedText>

              <ThemedText
                style={styles.cardDescription}
                themeColor="textSecondary"
              >
                Describe what happened naturally using your voice.
                Your complaint will be converted into text and
                prepared for your review.
              </ThemedText>

              <View style={styles.featureRow}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={18}
                  color={GOLD}
                />

                <ThemedText
                  style={styles.featureText}
                  themeColor="textSecondary"
                >
                  Speak in Malayalam or English
                </ThemedText>
              </View>

              <View style={styles.featureRow}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={18}
                  color={GOLD}
                />

                <ThemedText
                  style={styles.featureText}
                  themeColor="textSecondary"
                >
                  Review and edit before submission
                </ThemedText>
              </View>
            </View>

            <Pressable
              onPress={() => router.push('/complaint-speak')}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <MaterialCommunityIcons
                name="microphone"
                size={20}
                color="#FFFFFF"
              />

              <ThemedText style={styles.primaryButtonText}>
                Start Speaking
              </ThemedText>
            </Pressable>
          </View>

          {/* MANUAL OPTION */}
          <View style={styles.optionCard}>
            <View
              style={[
                styles.iconContainer,
                styles.manualIconBackground,
              ]}
            >
              <MaterialCommunityIcons
                name="file-edit-outline"
                size={36}
                color={NAVY}
              />
            </View>

            <View style={styles.cardContent}>
              <ThemedText
                style={styles.cardTitle}
                themeColor="primary"
              >
                Fill the Form Manually
              </ThemedText>

              <ThemedText
                style={styles.cardDescription}
                themeColor="textSecondary"
              >
                Enter your complaint information yourself using
                the official complaint form.
              </ThemedText>

              <View style={styles.featureRow}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={18}
                  color={GOLD}
                />

                <ThemedText
                  style={styles.featureText}
                  themeColor="textSecondary"
                >
                  Enter details at your own pace
                </ThemedText>
              </View>

              <View style={styles.featureRow}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={18}
                  color={GOLD}
                />

                <ThemedText
                  style={styles.featureText}
                  themeColor="textSecondary"
                >
                  Review your information before submission
                </ThemedText>
              </View>
            </View>

            <Pressable
              onPress={() => {
                // Manual complaint form will be connected in the next step.
                console.log('Manual complaint selected');
              }}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <MaterialCommunityIcons
                name="file-edit-outline"
                size={20}
                color={NAVY}
              />

              <ThemedText style={styles.secondaryButtonText}>
                Fill Form Manually
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Review / trust information */}
        <View style={styles.trustCard}>
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={23}
            color={NAVY}
          />

          <View style={styles.trustContent}>
            <ThemedText
              style={styles.trustTitle}
              themeColor="primary"
            >
              Your complaint, your review
            </ThemedText>

            <ThemedText
              style={styles.trustText}
              themeColor="textSecondary"
            >
              You will have the opportunity to review and edit your
              complaint details before submitting.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
  },

  desktopScrollContent: {
    maxWidth: 1180,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 36,
    paddingTop: 28,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 2,
    marginBottom: 24,
  },

  backText: {
    fontSize: 15,
    fontWeight: '600',
  },

  pressed: {
    opacity: 0.65,
  },

  headerSection: {
    marginBottom: 30,
  },

  titleAccent: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: GOLD,
    marginBottom: 14,
  },

  title: {
    fontSize: 32,
    lineHeight: 39,
    fontWeight: '800',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 19,
    lineHeight: 28,
    fontWeight: '600',
    marginBottom: 8,
  },

  description: {
    maxWidth: 760,
    fontSize: 15,
    lineHeight: 24,
  },

  optionsContainer: {
    gap: 18,
  },

  desktopOptions: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  optionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E1E4',
    borderRadius: 18,
    padding: 24,
    minHeight: 390,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },

  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  voiceIconBackground: {
    backgroundColor: '#F7EDEF',
  },

  manualIconBackground: {
    backgroundColor: '#EEF2F7',
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '800',
    marginBottom: 10,
  },

  cardDescription: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 20,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginBottom: 10,
  },

  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },

  primaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: MAROON,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 20,
    paddingHorizontal: 18,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  secondaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: NAVY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 20,
    paddingHorizontal: 18,
  },

  secondaryButtonText: {
    color: NAVY,
    fontSize: 15,
    fontWeight: '800',
  },

  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },

  trustCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 22,
    padding: 17,
    borderRadius: 14,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E3E8EF',
  },

  trustContent: {
    flex: 1,
  },

  trustTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },

  trustText: {
    fontSize: 13,
    lineHeight: 20,
  },
});