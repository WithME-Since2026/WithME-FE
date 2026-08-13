import { useMemo, useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyView } from '@/common/components/EmptyView';
import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import {
  formatDateKey,
  formatDayDetailLabel,
  formatMonthLabel,
  parseDateKey,
} from '@/common/utils/date';

import { CalendarLayerModal } from '@/domain/calendar/components/CalendarLayerModal';
import { CalendarMonthPickerModal } from '@/domain/calendar/components/CalendarMonthPickerModal';
import { DayEventList } from '@/domain/calendar/components/DayEventList';
import { MonthCalendarGrid } from '@/domain/calendar/components/MonthCalendarGrid';
import { CALENDAR_LAYERS } from '@/domain/calendar/constants/calendarLayers';
import { useCalendarMonthQuery } from '@/domain/calendar/hooks/useCalendarMonthQuery';
import type { CalendarEventResponse, CalendarLayerKey } from '@/domain/calendar/types';

type CalendarView = 'CALENDAR' | 'TODO';

const DEFAULT_ENABLED_LAYERS: Record<CalendarLayerKey, boolean> = {
  GROUP: true,
  TODO: true,
  HOLIDAY: false,
};

// 오전/오후 시각 표기를 분 단위로 변환해 하루 일정 목록을 시간순으로 정렬하기 위한 helper
function parseTimeToMinutes(time: string | null) {
  const match = time?.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
  if (!match) {
    return -1;
  }

  const [, period, hourText, minuteText] = match;
  const hour = (Number(hourText) % 12) + (period === '오후' ? 12 : 0);

  return hour * 60 + Number(minuteText);
}

const today = new Date();

// 모임 일정 + 할 일 마감을 한 화면에서 보여주는 통합 캘린더뷰. 레이어 토글로 항목별 표시 여부를 제어함
export function CalendarScreen() {
  const [activeView, setActiveView] = useState<CalendarView>('CALENDAR');
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(formatDateKey(today));
  const [enabledLayers, setEnabledLayers] =
    useState<Record<CalendarLayerKey, boolean>>(DEFAULT_ENABLED_LAYERS);
  const [isLayerModalOpen, setIsLayerModalOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  const { data: monthData, isLoading, isError } = useCalendarMonthQuery(currentYear, currentMonth);

  const eventsByDateKey = useMemo(() => {
    const map = new Map<string, CalendarEventResponse[]>();

    monthData?.events.forEach((event) => {
      const existing = map.get(event.date) ?? [];
      map.set(event.date, [...existing, event]);
    });

    return map;
  }, [monthData]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDateKey) {
      return [];
    }

    return (eventsByDateKey.get(selectedDateKey) ?? [])
      .filter((event) => enabledLayers[event.type])
      .sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
  }, [eventsByDateKey, selectedDateKey, enabledLayers]);

  const handleChangeMonth = (offset: number) => {
    const nextDate = new Date(currentYear, currentMonth - 1 + offset, 1);
    setCurrentYear(nextDate.getFullYear());
    setCurrentMonth(nextDate.getMonth() + 1);
    setSelectedDateKey(null);
  };

  const handleToggleLayer = (key: CalendarLayerKey) => {
    setEnabledLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectMonth = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    setSelectedDateKey(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.monthNavGroup}>
            <Pressable onPress={() => handleChangeMonth(-1)} hitSlop={8}>
              <Ionicons name="chevron-back" size={20} color={colors.text.primary} />
            </Pressable>
            <Pressable
              style={styles.monthLabelButton}
              onPress={() => setIsMonthPickerOpen(true)}
              hitSlop={8}
            >
              <Text style={styles.monthLabel}>{formatMonthLabel(currentYear, currentMonth)}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.text.secondary} />
            </Pressable>
          </View>

          <View style={styles.viewToggle}>
            {(['CALENDAR', 'TODO'] as const).map((view) => {
              const isActive = view === activeView;

              return (
                <Pressable
                  key={view}
                  style={[styles.viewToggleOption, isActive && styles.viewToggleOptionActive]}
                  onPress={() => setActiveView(view)}
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
        </View>

        <View style={styles.sectionDivider} />

        {activeView === 'TODO' ? (
          <EmptyView message="Todo 목록은 준비 중입니다." />
        ) : (
          <>
            <View style={styles.legendRow}>
              <View style={styles.legendChips}>
                {CALENDAR_LAYERS.filter((layer) => layer.key !== 'HOLIDAY').map((layer) => (
                  <View
                    key={layer.key}
                    style={[styles.legendChip, { backgroundColor: `${layer.dotColor}1A` }]}
                  >
                    <View style={[styles.legendDot, { backgroundColor: layer.dotColor }]} />
                    <Text style={[styles.legendLabel, { color: layer.dotColor }]}>
                      {layer.label}
                    </Text>
                  </View>
                ))}
              </View>
              <Pressable
                onPress={() => setIsLayerModalOpen(true)}
                hitSlop={8}
                accessibilityLabel="레이어 토글 버튼"
              >
                <Ionicons name="options-outline" size={20} color={colors.text.secondary} />
              </Pressable>
            </View>

            {isLoading && <LoadingView />}
            {isError && <ErrorView message="캘린더 정보를 불러오지 못했습니다." />}

            {!isLoading && !isError && (
              <>
                <MonthCalendarGrid
                  year={currentYear}
                  month={currentMonth}
                  selectedDateKey={selectedDateKey ?? ''}
                  onSelectDate={setSelectedDateKey}
                  eventsByDateKey={eventsByDateKey}
                  enabledLayers={enabledLayers}
                />

                {selectedDateKey ? (
                  <DayEventList
                    dateLabel={formatDayDetailLabel(parseDateKey(selectedDateKey))}
                    events={selectedDayEvents}
                  />
                ) : (
                  <Text style={styles.selectHint}>날짜를 선택해주세요.</Text>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>

      <CalendarLayerModal
        visible={isLayerModalOpen}
        enabledLayers={enabledLayers}
        onToggleLayer={handleToggleLayer}
        onClose={() => setIsLayerModalOpen(false)}
      />

      <CalendarMonthPickerModal
        visible={isMonthPickerOpen}
        year={currentYear}
        month={currentMonth}
        onSelect={handleSelectMonth}
        onClose={() => setIsMonthPickerOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthNavGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  monthLabelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  monthLabel: {
    ...typography.heading3,
    color: colors.text.primary,
  },
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
  sectionDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: -spacing.lg,
    marginTop: spacing.md,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  legendChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendLabel: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
  selectHint: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
