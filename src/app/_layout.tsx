import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppShell } from '@/components/layout/AppShell';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LoadingView } from '@/components/common/LoadingView';

/**
 * Root Layout for KWC Connect.
 * Following Expo SDK 57 and Expo Router architecture.
 */

// Prevent the splash screen from auto-hiding until assets are loaded.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, isInitialLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    ...MaterialCommunityIcons.font,
  });

  useEffect(() => {
    if (isInitialLoading || !fontsLoaded) return;

    const rootSegment = segments[0] as string;
    const inAuthGroup = rootSegment === '(auth)';
    const inProtectedGroup = rootSegment === '(app)';

    if (!user && inProtectedGroup) {
      // User is not signed in and trying to access a protected route
      router.replace('/');
    } else if (user && inAuthGroup) {
      // User is signed in and trying to access an auth route
      router.replace('/dashboard');
    }
  }, [user, isInitialLoading, fontsLoaded, segments, router]);

  if (isInitialLoading || (!fontsLoaded && !fontError)) {
    return <LoadingView />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(app)" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AuthProvider>
          <AppShell withPadding={false}>
            <AnimatedSplashOverlay />
            <RootLayoutNav />
          </AppShell>
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
