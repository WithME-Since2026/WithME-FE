import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

export type CalendarViewToggleValue = 'CALENDAR' | 'TODO';

type CalendarViewToggleProps = {
  value: CalendarViewToggleValue;
  onChange: (value: CalendarViewToggleValue) => void;
};

// 캘린더 화면과 Todo 화면 상단에서 서로를 전환할 때 쓰는 알약 모양 탭
export function CalendarViewToggle({ value, onChange }: CalendarViewToggleProps) {
  return (
    <View style={styles.viewToggle}>
      {(['CALENDAR', 'TODO'] as const).map((view) => {
        const isActive = view === value;

        return (
          <Pressable
            key={view}
            style={[styles.viewToggleOption, isActive && styles.viewToggleOptionActive]}
            onPress={() => onChange(view)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.viewToggleLabel, isActive && styles.viewToggleLabelActive]}>
              {view === 'CALENDAR' ? '캘린더' : 'Todo'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    padding: 2,
  },
  viewToggleOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  viewToggleOptionActive: {
    backgroundColor: colors.primary,
  },
  viewToggleLabel: {
    ...typography.body2,
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  viewToggleLabelActive: {
    color: colors.background,
  },
});
