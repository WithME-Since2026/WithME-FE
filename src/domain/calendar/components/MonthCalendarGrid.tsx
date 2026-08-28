import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import type { CalendarCell } from '@/common/utils/date';
import { formatDateKey, WEEKDAY_LABELS_KO } from '@/common/utils/date';

import {
  CALENDAR_DESIGN_COLORS,
  CALENDAR_LAYER_COLORS,
  CALENDAR_LAYERS,
} from '@/domain/calendar/constants/calendarLayers';
import type { CalendarEventResponse, CalendarLayerKey } from '@/domain/calendar/types';

const MAX_DOTS_PER_DAY = 3;

// WEEKDAY_LABELS_KO는 일요일 시작(일월화수목금토) 기준이라, 토·일이 오른쪽에 모이는
// 피그마 디자인(월화수목금토일)에 맞춰 표시용 라벨만 월요일 시작 순서로 재배열함
const DISPLAY_WEEKDAY_LABELS = [...WEEKDAY_LABELS_KO.slice(1), WEEKDAY_LABELS_KO[0]];

// getMonthGrid는 일요일 시작 그리드라, 이미 짜여진 주(week) 배열을 단순히 앞칸을 뒤로 돌리면
// (예: [일,월,...,토] → [월,...,토,일]) 그 "일"이 실제로는 그 주의 이전 일요일이라 날짜가
// 한 주씩 밀려 보이는 문제가 생김. 그래서 월요일 시작 그리드를 처음부터 별도로 계산함
function getMondayStartMonthGrid(year: number, month: number): CalendarCell[] {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const leadingOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, month - 1, 1 - leadingOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    return {
      date,
      dateKey: formatDateKey(date),
      isCurrentMonth: date.getMonth() === month - 1,
    };
  });
}

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
        {DISPLAY_WEEKDAY_LABELS.map((label, index) => (
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
