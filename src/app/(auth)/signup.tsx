import React, { useState } from 'react';
import { StyleSheet, View, Image, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { spacing } from '@/theme/spacing';
import { useAuth } from '@/hooks/use-auth';

/**
 * Registration Details Page.
 * Redesigned for professional government service look.
 */
export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    district: '',
    address: '',
    mobileNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.dob) newErrors.dob = 'Required';
    if (!formData.gender) newErrors.gender = 'Required';
    if (!formData.district) newErrors.district = 'Required';
    if (!formData.address) newErrors.address = 'Required';

    if (!formData.mobileNumber) newErrors.mobileNumber = 'Required';
    else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Invalid number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (validate()) {
      setIsLoading(true);
      try {
        await signUp(formData.email, formData.password, {
          displayName: formData.fullName,
          email: formData.email,
          dob: formData.dob,
          gender: formData.gender,
          district: formData.district,
          address: formData.address,
          phoneNumber: formData.mobileNumber,
        });
      } catch (err: any) {
        setErrors({ ...errors, submit: err.message || 'Failed to create account.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isWeb = Platform.OS === 'web';

  const Content = (
    <View style={isWeb ? styles.webWrapper : styles.mobileWrapper}>
      <View style={styles.brandingContainer}>
        <Image
          source={require('@/assets/expo.icon/Assets/kwc_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText type="title" themeColor="primary" style={styles.appTitle}>
          Create Account
        </ThemedText>
        <ThemedText style={styles.instructions} themeColor="textSecondary">
          Provide your details to register with KWC Connect.
        </ThemedText>
      </View>

      <View style={styles.formContainer}>
        {errors.submit && (
          <ThemedText style={styles.errorBanner}>{errors.submit}</ThemedText>
        )}

        <View style={styles.formGrid}>
          <AppInput
            label="Full Name"
            placeholder="Enter your legal name"
            value={formData.fullName}
            onChangeText={(val) => setFormData({ ...formData, fullName: val })}
            error={errors.fullName}
            containerStyle={isWeb ? styles.halfWidth : undefined}
            required
          />

          <AppInput
            label="Email Address"
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(val) => setFormData({ ...formData, email: val })}
            error={errors.email}
            containerStyle={isWeb ? styles.halfWidth : undefined}
            required
          />

          <AppInput
            label="Password"
            placeholder="Minimum 6 characters"
            secureTextEntry
            value={formData.password}
            onChangeText={(val) => setFormData({ ...formData, password: val })}
            error={errors.password}
            containerStyle={isWeb ? styles.halfWidth : undefined}
            required
          />

          <AppInput
            label="Confirm Password"
            placeholder="Repeat your password"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(val) => setFormData({ ...formData, confirmPassword: val })}
            error={errors.confirmPassword}
            containerStyle={isWeb ? styles.halfWidth : undefined}
            required
          />

          <AppInput
            label="Mobile Number"
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            value={formData.mobileNumber}
            onChangeText={(val) => setFormData({ ...formData, mobileNumber: val })}
            error={errors.mobileNumber}
            containerStyle={isWeb ? styles.halfWidth : undefined}
            required
          />

          <AppInput
            label="Date of Birth"
            placeholder="DD/MM/YYYY"
            value={formData.dob}
            onChangeText={(val) => setFormData({ ...formData, dob: val })}
            error={errors.dob}
            containerStyle={isWeb ? styles.halfWidth : undefined}
            required
          />

          <AppInput
            label="Gender"
            placeholder="Select Gender"
            value={formData.gender}
            onChangeText={(val) => setFormData({ ...formData, gender: val })}
            error={errors.gender}
            containerStyle={isWeb ? styles.halfWidth : undefined}
            required
          />

          <AppInput
            label="District"
            placeholder="Select District"
            value={formData.district}
            onChangeText={(val) => setFormData({ ...formData, district: val })}
            error={errors.district}
            containerStyle={isWeb ? styles.halfWidth : undefined}
            required
          />

          <AppInput
            label="Address"
            placeholder="Enter your full address"
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: 'top', paddingTop: 12 }}
            value={formData.address}
            onChangeText={(val) => setFormData({ ...formData, address: val })}
            error={errors.address}
            required
          />
        </View>

        <AppButton
          title="Create Account"
          onPress={handleSignUp}
          loading={isLoading}
          style={styles.submitButton}
        />

        <AppButton
          title="Already have an account? Login"
          type="text"
          onPress={() => router.replace('/(auth)/login')}
        />
      </View>
    </View>
  );

  return (
    <ScreenContainer scrollable={true}>
      {Content}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mobileWrapper: {
    width: '100%',
    paddingBottom: 40,
  },
  webWrapper: {
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
    paddingVertical: 60,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: spacing.md,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  instructions: {
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 400,
  },
  formContainer: {
    width: '100%',
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Platform.OS === 'web' ? 24 : 0,
  },
  halfWidth: {
    width: '48.5%',
  },
  errorBanner: {
    color: '#C62828',
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});
