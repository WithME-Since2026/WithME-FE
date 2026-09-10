import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/common/styles/theme';

export type MeetingRoleFilter = 'ALL' | 'OPERATOR' | 'PARTICIPANT';

type MeetingRoleFilterTabsProps = {
  tabs: { value: MeetingRoleFilter; label: string; count: number }[];
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
            style={styles.tab}
            onPress={() => onChange(tab.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <View style={styles.tabContent}>
              <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
              <Text style={[styles.count, isActive ? styles.countActive : styles.countInactive]}>
                {tab.count}
              </Text>
            </View>
            {isActive && <View style={styles.underline} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.meeting.outlineBorder,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    ...typography.body2,
    color: colors.meeting.mutedText,
  },
  labelActive: {
    fontWeight: '600',
    color: colors.meeting.primary,
  },
  count: {
    ...typography.caption,
    fontWeight: '700',
  },
  countActive: {
    color: colors.meeting.primary,
  },
  countInactive: {
    color: colors.meeting.pendingText,
  },
  underline: {
    marginTop: spacing.sm,
    height: 2.5,
    width: '70%',
    borderRadius: 1.5,
    backgroundColor: colors.meeting.primary,
  },
});
