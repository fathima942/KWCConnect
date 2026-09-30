import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: keyof typeof spacing;
}

/**
 * Standardized card component for KWC Connect.
 */
export const AppCard = ({
  children,
  style,
  onPress,
  padding = 'md'
}: AppCardProps) => {
  const theme = useTheme();

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          padding: spacing[padding]
        },
        shadows.small,
        style
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.medium,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
});
