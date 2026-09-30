import React from 'react';
import { StyleSheet, View, Platform, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, darkColors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface AppShellProps {
  children: React.ReactNode;
  withPadding?: boolean;
}

/**
 * The core application shell for KWC Connect.
 * Manages Safe Area, Responsive Width (Web), Theme Background, and Status Bar.
 */
export const AppShell = ({ children, withPadding = true }: AppShellProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const currentColors = isDark ? darkColors : colors;

  return (
    <View style={[styles.outerContainer, { backgroundColor: currentColors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.innerContainer,
            withPadding && styles.padding,
            { backgroundColor: currentColors.background }
          ]}
        >
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
};

const MAX_WIDTH = 800;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
  },
  padding: {
    paddingHorizontal: spacing.lg,
  },
});
