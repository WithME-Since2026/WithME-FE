import { useMemo, useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { colors, spacing, typography } from '@/common/styles/theme';
import {
  formatDateKey,
  formatDayDetailLabel,
  formatMonthLabel,
  parseDateKey,
  parseKoreanTimeToMinutes,
} from '@/common/utils/date';

import type { RootStackParamList } from '@/app/navigation';

import { CalendarLayerModal } from '@/domain/calendar/components/CalendarLayerModal';
import { CalendarMonthPickerModal } from '@/domain/calendar/components/CalendarMonthPickerModal';
import { DayDetailSheet } from '@/domain/calendar/components/DayDetailSheet';
import { MonthCalendarGrid } from '@/domain/calendar/components/MonthCalendarGrid';
import { CALENDAR_DESIGN_COLORS } from '@/domain/calendar/constants/calendarLayers';
import { useCalendarMonthQuery } from '@/domain/calendar/hooks/useCalendarMonthQuery';
import type { CalendarEventResponse, CalendarLayerKey } from '@/domain/calendar/types';

type CalendarScreenProps = NativeStackScreenProps<RootStackParamList, 'Calendar'>;

const DEFAULT_ENABLED_LAYERS: Record<CalendarLayerKey, boolean> = {
  GROUP: true,
  TODO: true,
  HOLIDAY: false,
};

const today = new Date();

// 모임 일정 + 할 일 마감을 한 화면에서 보여주는 통합 캘린더뷰. 레이어 토글로 항목별 표시 여부를 제어함
export function CalendarScreen(_props: CalendarScreenProps) {
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
      .sort((a, b) => parseKoreanTimeToMinutes(a.time) - parseKoreanTimeToMinutes(b.time));
  }, [eventsByDateKey, selectedDateKey, enabledLayers]);

  const handleToggleLayer = (key: CalendarLayerKey) => {
    setEnabledLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectMonth = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    setSelectedDateKey(null);
  };

  const handlePrevMonth = () => {
    const isJanuary = currentMonth === 1;
    handleSelectMonth(isJanuary ? currentYear - 1 : currentYear, isJanuary ? 12 : currentMonth - 1);
  };

  const handleNextMonth = () => {
    const isDecember = currentMonth === 12;
    handleSelectMonth(
      isDecember ? currentYear + 1 : currentYear,
      isDecember ? 1 : currentMonth + 1,
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>캘린더</Text>
        <Pressable
          style={styles.iconButton}
          onPress={() => setIsLayerModalOpen(true)}
          hitSlop={8}
          accessibilityLabel="레이어 토글 버튼"
        >
          <Ionicons name="options-outline" size={18} color={colors.text.primary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.monthNavRow}>
          <Pressable
            style={styles.navButton}
            onPress={handlePrevMonth}
            hitSlop={8}
            accessibilityLabel="이전 달"
          >
            <Ionicons name="chevron-back" size={20} color={CALENDAR_DESIGN_COLORS.weekdayNeutral} />
          </Pressable>

          {/* 화살표를 누르면 연/월을 직접 지정할 수 있는 CalendarMonthPickerModal이 열림 */}
          <Pressable
            style={styles.monthLabelButton}
            onPress={() => setIsMonthPickerOpen(true)}
            hitSlop={8}
          >
            <Text style={styles.monthLabel}>{formatMonthLabel(currentYear, currentMonth)}</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={CALENDAR_DESIGN_COLORS.weekdayNeutral}
              style={styles.monthArrowIcon}
            />
          </Pressable>

          <Pressable
            style={styles.navButton}
            onPress={handleNextMonth}
            hitSlop={8}
            accessibilityLabel="다음 달"
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={CALENDAR_DESIGN_COLORS.weekdayNeutral}
            />
          </Pressable>
        </View>

        {isLoading && <LoadingView />}
        {isError && <ErrorView message="캘린더 정보를 불러오지 못했습니다." />}

        {!isLoading && !isError && (
          <MonthCalendarGrid
            year={currentYear}
            month={currentMonth}
            selectedDateKey={selectedDateKey ?? ''}
            onSelectDate={setSelectedDateKey}
            eventsByDateKey={eventsByDateKey}
            enabledLayers={enabledLayers}
          />
        )}
      </View>

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

      <DayDetailSheet
        visible={selectedDateKey !== null}
        dateLabel={selectedDateKey ? formatDayDetailLabel(parseDateKey(selectedDateKey)) : ''}
        events={selectedDayEvents}
        onClose={() => setSelectedDateKey(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    paddingBottom: 6,
  },
  title: {
    ...typography.heading1,
    color: colors.text.primary,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    // 추후 홈/캘린더/마이 하단 탭바가 합쳐질 자리를 미리 비워둠
    paddingBottom: 64,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 10,
  },
  navButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  monthArrowIcon: {
    marginTop: 3,
  },
  monthLabel: {
    ...typography.heading3,
    color: colors.text.primary,
  },
});
