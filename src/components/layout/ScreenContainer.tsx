import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { spacing } from '@/theme/spacing';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  maxWidth?: number;
}

/**
 * Standardized container for application screens.
 * Handles background color, optional scrolling, and desktop max-width.
 */
export const ScreenContainer = ({
  children,
  style,
  scrollable = true,
  maxWidth = 800
}: ScreenContainerProps) => {
  const theme = useTheme();

  const content = (
    <View style={[styles.inner, { maxWidth }, style]}>
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.fixedContent}>
          {content}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  fixedContent: {
    flex: 1,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
});
