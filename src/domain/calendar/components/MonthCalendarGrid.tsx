import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import { formatDateKey, getMonthGrid, WEEKDAY_LABELS_KO } from '@/common/utils/date';

import { CALENDAR_LAYERS } from '@/domain/calendar/constants/calendarLayers';
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
  const cells = getMonthGrid(year, month);
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7),
  ).filter((week) => week.some((cell) => cell.isCurrentMonth));

  const todayKey = formatDateKey(new Date());

  return (
    <View style={styles.container}>
      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS_KO.map((label, index) => (
          <Text
            key={label}
            style={[
              styles.weekdayLabel,
              index === 0 && styles.sundayLabel,
              index === 6 && styles.saturdayLabel,
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

            return (
              <Pressable
                key={cell.dateKey}
                style={styles.cell}
                onPress={() => onSelectDate(cell.dateKey)}
              >
                <View style={[styles.dayBadge, isSelected && styles.selectedBadge]}>
                  <Text
                    style={[
                      styles.dayLabel,
                      columnIndex === 0 && styles.sundayLabel,
                      columnIndex === 6 && styles.saturdayLabel,
                      isToday && !isSelected && styles.todayLabel,
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
    marginTop: spacing.sm,
  },
  weekdayRow: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}14`,
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.primary}33`,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    ...typography.body2,
    fontWeight: '500',
    color: `${colors.primary}55`,
  },
  weekRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  cell: {
    flex: 1,
    minHeight: 68,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  dayBadge: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadge: {
    backgroundColor: colors.primary,
  },
  dayLabel: {
    ...typography.body1,
    color: colors.text.primary,
  },
  saturdayLabel: {
    color: colors.weekend,
  },
  sundayLabel: {
    color: colors.weekend,
    fontWeight: '700',
  },
  todayLabel: {
    color: colors.primary,
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
