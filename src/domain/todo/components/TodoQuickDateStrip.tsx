import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import { WEEKDAY_LABELS_KO, formatDateKey } from '@/common/utils/date';

type TodoQuickDateStripProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

// 선택한 날짜를 기준으로 앞뒤 이틀씩 보여주는 빠른 날짜 변경 스트립. 날짜를 누르면 그 날짜로 바로 이동
export function TodoQuickDateStrip({ selectedDate, onSelectDate }: TodoQuickDateStripProps) {
  const selectedDateKey = formatDateKey(selectedDate);

  const days = [-2, -1, 0, 1, 2].map((offset) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + offset);
    return date;
  });

  return (
    <View style={styles.container}>
      {days.map((date) => {
        const dateKey = formatDateKey(date);
        const isSelected = dateKey === selectedDateKey;

        return (
          <Pressable
            key={dateKey}
            style={[styles.dayChip, isSelected && styles.dayChipSelected]}
            onPress={() => onSelectDate(date)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <Text style={[styles.weekdayLabel, isSelected && styles.weekdayLabelSelected]}>
              {WEEKDAY_LABELS_KO[date.getDay()]}
            </Text>
            <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
              {date.getDate()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  dayChip: {
    width: 60,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayChipSelected: {
    backgroundColor: colors.primary,
  },
  weekdayLabel: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  weekdayLabelSelected: {
    color: colors.background,
  },
  dayLabel: {
    ...typography.body2,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  dayLabelSelected: {
    color: colors.background,
  },
});
