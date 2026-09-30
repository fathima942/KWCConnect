import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useTheme } from '@/hooks/use-theme';
import { spacing } from '@/theme/spacing';
import { colors } from '@/theme/colors';

/**
 * Web-specific navigation foundation using Expo Router UI.
 * Consumes the KWC Design System for styling.
 */
export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="cases" href="/cases" asChild>
            <TabButton>My Cases</TabButton>
          </TabTrigger>
          <TabTrigger name="complaint" href="/complaint" asChild>
            <TabButton>Complaint</TabButton>
          </TabTrigger>
          <TabTrigger name="counselling" href="/counselling" asChild>
            <TabButton>Counselling</TabButton>
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton>Profile</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        themeColor={isFocused ? 'backgroundSelected' : 'background'}
        style={styles.tabButtonView}>
        <ThemedText
          type="smallBold"
          themeColor={isFocused ? 'textPrimary' : 'textSecondary'}
        >
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const theme = useTheme();

  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={[styles.innerContainer, { backgroundColor: theme.backgroundElement }]}>
        <ThemedText type="smallBold" style={styles.brandText} themeColor="primary">
          KWC Connect
        </ThemedText>

        {props.children}
      </View>
    </View>
  );
}

const MAX_WIDTH = 800;

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    bottom: 0,
  },
  innerContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: spacing.sm,
    maxWidth: MAX_WIDTH,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
  },
});
