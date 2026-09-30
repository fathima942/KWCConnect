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
 * Login Screen.
 * Citizens enter their email and password to sign in.
 */
export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isWeb = Platform.OS === 'web';

  const Content = (
    <View style={isWeb ? styles.webWrapper : styles.mobileWrapper}>
      {/* branding / header */}
      <View style={styles.brandingContainer}>
        <Image
          source={require('@/assets/expo.icon/Assets/kwc_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText type="title" themeColor="primary" style={styles.appTitle}>
          KWC Connect
        </ThemedText>
        <ThemedText type="subtitle" themeColor="secondary" style={styles.orgTitle}>
          Kerala Women's Commission
        </ThemedText>
      </View>

      <View style={styles.formContainer}>
        <ThemedText type="subtitle" style={styles.welcomeText}>Welcome back</ThemedText>
        <ThemedText style={styles.instructions} themeColor="textSecondary">
          Sign in to access your dashboard and services.
        </ThemedText>

        <View style={styles.form}>
          <AppInput
            label="Email Address"
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={error && !email ? 'Required' : undefined}
          />

          <AppInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={error && !password ? 'Required' : undefined}
          />

          {error && email && password && (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          )}

          <AppButton
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.submitButton}
          />

          <AppButton
            title="Don't have an account? Sign Up"
            type="text"
            onPress={() => router.replace('/(auth)/signup')}
          />
        </View>
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
    alignItems: 'center',
    paddingTop: 40,
  },
  webWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 80,
    paddingVertical: 80,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...Platform.select({
      web: { flex: 1, maxWidth: 450 }
    })
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: spacing.md,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  orgTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.9,
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
    ...Platform.select({
      ios: { marginTop: 30 },
      android: { marginTop: 30 },
    })
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 2,
  },
  instructions: {
    fontSize: 15,
    marginBottom: spacing.lg,
  },
  form: {
    width: '100%',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});
