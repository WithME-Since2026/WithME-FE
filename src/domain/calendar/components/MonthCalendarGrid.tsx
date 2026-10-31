import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import {
  formatDateKey,
  getMondayStartMonthGrid,
  WEEKDAY_LABELS_KO_MON_START,
} from '@/common/utils/date';

import {
  CALENDAR_DESIGN_COLORS,
  CALENDAR_LAYER_COLORS,
  CALENDAR_LAYERS,
} from '@/domain/calendar/constants/calendarLayers';
import type { CalendarEventResponse, CalendarLayerKey } from '@/domain/calendar/types';

const MAX_DOTS_PER_DAY = 3;

type MonthCalendarGridProps = {
  year: number;
  month: number;
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
  eventsByDateKey: Map<string, CalendarEventResponse[]>;
  enabledLayers: Record<CalendarLayerKey, boolean>;
};

export function MonthCalendarGrid({
  year,
  month,
  selectedDateKey,
  onSelectDate,
  eventsByDateKey,
  enabledLayers,
}: MonthCalendarGridProps) {
  const cells = getMondayStartMonthGrid(year, month);
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7),
  ).filter((week) => week.some((cell) => cell.isCurrentMonth));

  const todayKey = formatDateKey(new Date());

  return (
    <View style={styles.container}>
      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS_KO_MON_START.map((label, index) => (
          <Text
            key={label}
            style={[
              styles.weekdayLabel,
              index === 5 && styles.saturdayLabel,
              index === 6 && styles.sundayLabel,
            ]}
          >
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week) => (
        <View key={week[0].dateKey} style={styles.weekRow}>
          {week.map((cell, columnIndex) => {
            if (!cell.isCurrentMonth) {
              return <View key={cell.dateKey} style={styles.cell} />;
            }

            const dayEvents = (eventsByDateKey.get(cell.dateKey) ?? []).filter(
              (event) => enabledLayers[event.type],
            );
            const isToday = cell.dateKey === todayKey;
            const isSelected = cell.dateKey === selectedDateKey;
            const isHoliday = dayEvents.some((event) => event.type === 'HOLIDAY');

            return (
              <Pressable
                key={cell.dateKey}
                style={styles.cell}
                onPress={() => onSelectDate(cell.dateKey)}
                accessibilityRole="button"
                accessibilityLabel={`${cell.date.getFullYear()}년 ${cell.date.getMonth() + 1}월 ${cell.date.getDate()}일`}
                accessibilityState={{ selected: isSelected }}
              >
                <View
                  style={[
                    styles.dayBadge,
                    isToday && !isSelected && styles.todayBadge,
                    isSelected && styles.selectedBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      columnIndex === 5 && styles.saturdayLabel,
                      columnIndex === 6 && styles.sundayLabel,
                      isHoliday && styles.holidayLabel,
                      isSelected && styles.selectedLabel,
                    ]}
                  >
                    {cell.date.getDate()}
                  </Text>
                </View>
                <View style={styles.dotRow}>
                  {dayEvents.slice(0, MAX_DOTS_PER_DAY).map((event) => (
                    <View
                      key={event.eventId}
                      style={[
                        styles.dot,
                        {
                          // 캘린더 점 색은 카테고리별이 아니라 레이어(모임/할 일/공휴일) 토글 색으로 통일
                          backgroundColor: CALENDAR_LAYERS.find((l) => l.key === event.type)
                            ?.dotColor,
                        },
                      ]}
                    />
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingBottom: spacing.xs,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
    fontWeight: '500',
    color: CALENDAR_DESIGN_COLORS.weekdayNeutral,
  },
  weekRow: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBadge: {
    backgroundColor: CALENDAR_DESIGN_COLORS.todayBadgeBg,
  },
  selectedBadge: {
    borderRadius: borderRadius.md + 2,
    backgroundColor: CALENDAR_LAYER_COLORS.GROUP,
  },
  dayLabel: {
    ...typography.body1,
    color: colors.text.primary,
  },
  saturdayLabel: {
    color: CALENDAR_LAYER_COLORS.HOLIDAY,
  },
  sundayLabel: {
    color: CALENDAR_LAYER_COLORS.HOLIDAY,
    fontWeight: '700',
  },
  holidayLabel: {
    color: CALENDAR_LAYER_COLORS.HOLIDAY,
    fontWeight: '700',
  },
  selectedLabel: {
    color: colors.background,
    fontWeight: '700',
  },
  dotRow: {
    flexDirection: 'row',
    gap: 3,
    height: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
