import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

export type MeetingRoleFilter = 'ALL' | 'OPERATOR' | 'PARTICIPANT';

type MeetingRoleFilterTabsProps = {
  tabs: { value: MeetingRoleFilter; label: string }[];
  value: MeetingRoleFilter;
  onChange: (value: MeetingRoleFilter) => void;
};

export function MeetingRoleFilterTabs({ tabs, value, onChange }: MeetingRoleFilterTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.value === value;

        return (
          <Pressable
            key={tab.value}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(tab.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.meeting.filterTabBackground,
    borderRadius: borderRadius.lg,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  label: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  labelActive: {
    color: colors.text.primary,
  },
});
