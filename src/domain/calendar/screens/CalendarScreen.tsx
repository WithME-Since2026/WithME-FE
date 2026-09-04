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
import { CategoryManageSheet } from '@/domain/todo/components/CategoryManageSheet';
import { TodoCreateSheet } from '@/domain/todo/components/TodoCreateSheet';
import { TodoEditSheet } from '@/domain/todo/components/TodoEditSheet';
import { TodoQuickActionSheet } from '@/domain/todo/components/TodoQuickActionSheet';
import { useTodoCategoriesQuery } from '@/domain/todo/hooks/useTodoCategoriesQuery';
import { useTodoListQuery } from '@/domain/todo/hooks/useTodoListQuery';
import { useUpdateTodoCompletionMutation } from '@/domain/todo/hooks/useUpdateTodoCompletionMutation';

type CalendarScreenProps = NativeStackScreenProps<RootStackParamList, 'Calendar'>;

const DEFAULT_ENABLED_LAYERS: Record<CalendarLayerKey, boolean> = {
  GROUP: true,
  TODO: true,
  HOLIDAY: false,
};

// domain/todo의 실제 할 일과 domain/calendar의 mock 이벤트가 서로 다른 id 체계를 쓰기 때문에
// 캘린더 이벤트 id와 겹치지 않도록 큰 오프셋을 더해 구분한다
const TODO_EVENT_ID_OFFSET = 1_000_000;

const today = new Date();

// 모임 일정 + 할 일 마감을 한 화면에서 보여주는 통합 캘린더뷰. 레이어 토글로 항목별 표시 여부를 제어함
export function CalendarScreen(_props: CalendarScreenProps) {
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  // 진입 시 오늘 날짜 시트가 바로 뜨지 않고 달력이 보이도록 선택 없음 상태로 시작
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [enabledLayers, setEnabledLayers] =
    useState<Record<CalendarLayerKey, boolean>>(DEFAULT_ENABLED_LAYERS);
  const [isLayerModalOpen, setIsLayerModalOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isTodoCreateSheetOpen, setIsTodoCreateSheetOpen] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [quickActionTodoId, setQuickActionTodoId] = useState<number | null>(null);
  const [isCategoryManageOpen, setIsCategoryManageOpen] = useState(false);

  const { data: monthData, isLoading, isError } = useCalendarMonthQuery(currentYear, currentMonth);
  const { data: categories } = useTodoCategoriesQuery();
  const { data: todoListData } = useTodoListQuery();
  const { mutate: updateTodoCompletion } = useUpdateTodoCompletionMutation();

  const eventsByDateKey = useMemo(() => {
    const map = new Map<string, CalendarEventResponse[]>();

    const addEvent = (event: CalendarEventResponse) => {
      const existing = map.get(event.date) ?? [];
      map.set(event.date, [...existing, event]);
    };

    monthData?.events.forEach(addEvent);

    // "할 일 추가" 시트로 만든 할 일이 캘린더에도 바로 보이도록 domain/todo의 실제 목록을 합쳐서 보여준다.
    // TODO: 백엔드가 캘린더/할 일 API를 통합하기 전까지는 이렇게 화면에서 두 mock 데이터를 합치는 임시 방편이다
    todoListData?.todos.forEach((todo) => {
      const category = categories?.find((item) => item.categoryId === todo.categoryId);

      addEvent({
        eventId: TODO_EVENT_ID_OFFSET + todo.todoId,
        type: 'TODO',
        title: todo.title,
        date: todo.dueDate,
        time: todo.dueTime ?? null,
        badgeLabel: category?.categoryName ?? 'Todo',
        location: null,
        color: category?.categoryColor ?? null,
        completed: todo.completed,
      });
    });

    return map;
  }, [monthData, todoListData, categories]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDateKey) {
      return [];
    }

    return (eventsByDateKey.get(selectedDateKey) ?? [])
      .filter((event) => enabledLayers[event.type])
      .sort((a, b) => parseKoreanTimeToMinutes(a.time) - parseKoreanTimeToMinutes(b.time));
  }, [eventsByDateKey, selectedDateKey, enabledLayers]);

  const editingTodo = todoListData?.todos.find((todo) => todo.todoId === editingTodoId) ?? null;
  const quickActionTodo =
    todoListData?.todos.find((todo) => todo.todoId === quickActionTodoId) ?? null;

  // TODO_EVENT_ID_OFFSET 미만이면 mockCalendarData 자체의 예시 이벤트라 실제 할 일이 아니므로 무시한다
  const toTodoId = (eventId: number) =>
    eventId < TODO_EVENT_ID_OFFSET ? null : eventId - TODO_EVENT_ID_OFFSET;

  const handleOpenTodoActions = (eventId: number) => {
    const todoId = toTodoId(eventId);

    if (todoId !== null) {
      // 빠른 날짜 변경 팝업은 캘린더 그리드 위에 바로 뜨는 디자인(Figma 784-22833)이라
      // 할 일/모임 일정이 나열된 날짜 상세 시트는 먼저 닫는다
      setSelectedDateKey(null);
      setQuickActionTodoId(todoId);
    }
  };

  const handleEditFromQuickActions = () => {
    setQuickActionTodoId(null);
    setEditingTodoId(quickActionTodoId);
  };

  const handleToggleTodoComplete = (eventId: number, completed: boolean) => {
    const todoId = toTodoId(eventId);

    // mockCalendarData 자체의 예시 이벤트는 실제 할 일이 아니라 완료 처리를 보낼 대상이 없다
    if (todoId !== null) {
      updateTodoCompletion({ todoId, completed });
    }
  };

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
        onAddTodo={() => setIsTodoCreateSheetOpen(true)}
        onOpenTodoActions={handleOpenTodoActions}
        onToggleTodoComplete={handleToggleTodoComplete}
      />

      <TodoCreateSheet
        visible={isTodoCreateSheetOpen}
        categories={categories ?? []}
        initialDateKey={selectedDateKey ?? formatDateKey(today)}
        onClose={() => setIsTodoCreateSheetOpen(false)}
        onAddCategory={() => setIsCategoryManageOpen(true)}
      />

      <TodoEditSheet
        visible={editingTodoId !== null}
        todo={editingTodo}
        categories={categories ?? []}
        onClose={() => setEditingTodoId(null)}
        onAddCategory={() => setIsCategoryManageOpen(true)}
      />

      <TodoQuickActionSheet
        visible={quickActionTodoId !== null}
        todo={quickActionTodo}
        onClose={() => setQuickActionTodoId(null)}
        onEditTodo={handleEditFromQuickActions}
      />

      <CategoryManageSheet
        visible={isCategoryManageOpen}
        categories={categories ?? []}
        onClose={() => setIsCategoryManageOpen(false)}
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
