import { useEffect, useMemo, useState } from 'react';

import { Alert, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalendarViewToggle } from '@/common/components/CalendarViewToggle';
import { EmptyView } from '@/common/components/EmptyView';
import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import {
  formatDateKey,
  formatDayDetailLabel,
  isSameDateKey,
  parseDateKey,
} from '@/common/utils/date';

import type { RootStackParamList } from '@/app/navigation';

import { TodoCategoryFilterChips } from '@/domain/todo/components/TodoCategoryFilterChips';
import { TodoCreateSheet } from '@/domain/todo/components/TodoCreateSheet';
import { TodoDatePickerSheet } from '@/domain/todo/components/TodoDatePickerSheet';
import { TodoEditSheet } from '@/domain/todo/components/TodoEditSheet';
import { TodoListItem } from '@/domain/todo/components/TodoListItem';
import { TodoQuickActionPanel } from '@/domain/todo/components/TodoQuickActionPanel';
import type { TodoPostponeTarget } from '@/domain/todo/components/TodoQuickActionPanel';
import { TodoQuickDateStrip } from '@/domain/todo/components/TodoQuickDateStrip';
import { TodoSpeedDialMenu } from '@/domain/todo/components/TodoSpeedDialMenu';
import { TodoUndoToast } from '@/domain/todo/components/TodoUndoToast';
import { useDeleteTodoMutation } from '@/domain/todo/hooks/useDeleteTodoMutation';
import { useTodoCategoriesQuery } from '@/domain/todo/hooks/useTodoCategoriesQuery';
import { useTodoListQuery } from '@/domain/todo/hooks/useTodoListQuery';
import { useUpdateTodoMutation } from '@/domain/todo/hooks/useUpdateTodoMutation';
import type { TodoCategoryFilter, TodoResponse } from '@/domain/todo/types';

const UNDO_WINDOW_SECONDS = 5;

type UndoToastState = {
  todoId: number;
  previousDueDate: string;
  previousDueTime: string | null;
  previousIsPostponed: boolean;
  label: string;
  secondsLeft: number;
};

type TodoScreenProps = NativeStackScreenProps<RootStackParamList, 'Todo'>;

type TodoSection = {
  key: string;
  title: string;
  titleColor: string;
  isOverdue: boolean;
  data: TodoResponse[];
};

export function TodoScreen({ navigation }: TodoScreenProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoryFilter, setCategoryFilter] = useState<TodoCategoryFilter>('ALL');
  // TODO: 백엔드 완료 처리 API(PATCH /api/v1/todo/completion) 연동 전까지 로컬 상태로만 완료 여부 반영
  const [completedOverrides, setCompletedOverrides] = useState<Record<number, boolean>>({});
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [longPressedTodoId, setLongPressedTodoId] = useState<number | null>(null);
  const [isPostponeDatePickerOpen, setIsPostponeDatePickerOpen] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [undoToast, setUndoToast] = useState<UndoToastState | null>(null);

  const {
    data: todoListData,
    isLoading: isTodosLoading,
    isError: isTodosError,
  } = useTodoListQuery();
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useTodoCategoriesQuery();
  const { mutate: updateTodo } = useUpdateTodoMutation();
  const { mutate: deleteTodo } = useDeleteTodoMutation();

  const isLoading = isTodosLoading || isCategoriesLoading;
  const isError = isTodosError || isCategoriesError;

  const categoriesById = useMemo(() => {
    return new Map(categories.map((category) => [category.categoryId, category]));
  }, [categories]);

  const selectedDateKey = formatDateKey(selectedDate);
  // BE는 마감일로 오늘 이전 날짜를 허용하지 않아(@FutureOrPresent), 지연 항목을 보는 중이면 오늘로 보정
  const createSheetInitialDateKey =
    selectedDateKey < formatDateKey(new Date()) ? formatDateKey(new Date()) : selectedDateKey;

  const todos = useMemo(() => {
    return (todoListData?.todos ?? []).map((todo) => ({
      ...todo,
      completed: completedOverrides[todo.todoId] ?? todo.completed,
    }));
  }, [todoListData, completedOverrides]);

  const sections = useMemo(() => {
    const matchesCategory = (todo: TodoResponse) =>
      categoryFilter === 'ALL' || todo.categoryId === categoryFilter;

    // 지연 여부는 실제 오늘 날짜 기준으로 판단 (날짜 스트립으로 어느 날짜를 보고 있든 무관하게 유지)
    const todayKey = formatDateKey(new Date());
    const isOverdue = (todo: TodoResponse) => todo.dueDate < todayKey && !todo.completed;

    const overdueTodos = todos.filter((todo) => isOverdue(todo) && matchesCategory(todo));
    // 지연 항목은 실제 마감일이 선택한 날짜와 같아도 '지연' 섹션에서만 보이도록 여기서는 제외
    const dueTodos = todos.filter(
      (todo) => todo.dueDate === selectedDateKey && !isOverdue(todo) && matchesCategory(todo),
    );

    const dateSectionLabel = isSameDateKey(selectedDate, new Date())
      ? '오늘'
      : formatDayDetailLabel(selectedDate);

    const result: TodoSection[] = [];

    if (overdueTodos.length > 0) {
      result.push({
        key: 'overdue',
        title: '지연',
        titleColor: colors.error,
        isOverdue: true,
        data: overdueTodos,
      });
    }

    if (dueTodos.length > 0) {
      result.push({
        key: 'due',
        title: dateSectionLabel,
        titleColor: colors.text.secondary,
        isOverdue: false,
        data: dueTodos,
      });
    }

    // 오늘을 보고 있을 때는 내일 할 일도 바로 이어서 보여준다
    if (isSameDateKey(selectedDate, new Date())) {
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrowKey = formatDateKey(tomorrowDate);

      const tomorrowTodos = todos.filter(
        (todo) => todo.dueDate === tomorrowKey && matchesCategory(todo),
      );

      if (tomorrowTodos.length > 0) {
        result.push({
          key: 'tomorrow',
          title: '내일',
          titleColor: colors.text.secondary,
          isOverdue: false,
          data: tomorrowTodos,
        });
      }
    }

    return result;
  }, [todos, selectedDateKey, selectedDate, categoryFilter]);

  const longPressedTodo = todos.find((todo) => todo.todoId === longPressedTodoId) ?? null;
  const editingTodo = todos.find((todo) => todo.todoId === editingTodoId) ?? null;

  // Undo 토스트의 초 카운트다운. 0이 되면 토스트를 닫고 되돌릴 수 없게 한다
  useEffect(() => {
    if (!undoToast) {
      return;
    }
    if (undoToast.secondsLeft <= 0) {
      setUndoToast(null);
      return;
    }

    const timer = setTimeout(() => {
      setUndoToast((prev) => (prev ? { ...prev, secondsLeft: prev.secondsLeft - 1 } : prev));
    }, 1000);

    return () => clearTimeout(timer);
  }, [undoToast]);

  const handleToggleComplete = (todoId: number) => {
    setLongPressedTodoId(null);
    setCompletedOverrides((prev) => {
      const base = todoListData?.todos.find((todo) => todo.todoId === todoId)?.completed ?? false;
      const current = prev[todoId] ?? base;

      return { ...prev, [todoId]: !current };
    });
  };

  const commitPostpone = (todo: TodoResponse, newDueDate: string, label: string) => {
    const previousDueDate = todo.dueDate;
    const previousDueTime = todo.dueTime;
    const previousIsPostponed = todo.isPostponed;
    // 미루기는 날짜만 바꾸는 동작이라 기존 시간은 더 이상 의미가 없어 지우고,
    // 목록에는 시간 대신 새로 바뀐 날짜를 보여준다 (TodoListItem 참고)
    updateTodo({ todoId: todo.todoId, dueDate: newDueDate, dueTime: null, isPostponed: true });
    setLongPressedTodoId(null);
    setUndoToast({
      todoId: todo.todoId,
      previousDueDate,
      previousDueTime,
      previousIsPostponed,
      label,
      secondsLeft: UNDO_WINDOW_SECONDS,
    });
  };

  const handlePostpone = (target: TodoPostponeTarget) => {
    if (!longPressedTodo) {
      return;
    }

    const targetDate = new Date();
    if (target === 'TOMORROW') {
      targetDate.setDate(targetDate.getDate() + 1);
    } else if (target === 'NEXT_WEEK') {
      targetDate.setDate(targetDate.getDate() + 7);
    }

    const labelByTarget: Record<TodoPostponeTarget, string> = {
      TODAY: '오늘',
      TOMORROW: '내일',
      NEXT_WEEK: '다음 주',
    };

    commitPostpone(
      longPressedTodo,
      formatDateKey(targetDate),
      `${labelByTarget[target]}로 변경했습니다`,
    );
  };

  const handleConfirmPostponeDate = (dateKey: string) => {
    if (!longPressedTodo) {
      return;
    }

    const date = parseDateKey(dateKey);
    commitPostpone(
      longPressedTodo,
      dateKey,
      `${date.getMonth() + 1}월 ${date.getDate()}일로 변경했습니다`,
    );
  };

  const handleEdit = () => {
    if (!longPressedTodo) {
      return;
    }

    setEditingTodoId(longPressedTodo.todoId);
    setLongPressedTodoId(null);
  };

  const handleDelete = () => {
    if (!longPressedTodo) {
      return;
    }

    const { todoId, title } = longPressedTodo;
    setLongPressedTodoId(null);
    Alert.alert('할 일을 삭제할까요?', `"${title}"을(를) 삭제하면 되돌릴 수 없어요.`, [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => deleteTodo(todoId) },
    ]);
  };

  const handleUndo = () => {
    if (!undoToast) {
      return;
    }

    updateTodo({
      todoId: undoToast.todoId,
      dueDate: undoToast.previousDueDate,
      dueTime: undoToast.previousDueTime,
      isPostponed: undoToast.previousIsPostponed,
    });
    setUndoToast(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerSection}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {/* TODO: 홈 화면 추가되면 홈으로 이동하는 버튼으로 교체 예정, 그 전까지 비활성화 */}
            <Pressable disabled hitSlop={8} accessibilityLabel="뒤로가기">
              <Ionicons name="chevron-back" size={20} color={colors.text.disabled} />
            </Pressable>
            <Text style={styles.headerTitle}>Todo</Text>
          </View>

          <CalendarViewToggle
            value="TODO"
            onChange={(view) => {
              if (view === 'CALENDAR') {
                navigation.navigate('Calendar');
              }
            }}
          />
        </View>
      </View>

      <View style={styles.subHeaderSection}>
        <TodoQuickDateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        <TodoCategoryFilterChips
          categories={categories}
          value={categoryFilter}
          onChange={setCategoryFilter}
        />
      </View>

      <View style={styles.divider} />

      {isLoading && <LoadingView />}
      {isError && <ErrorView message="Todo 목록을 불러오지 못했습니다." />}

      {!isLoading && !isError && sections.length === 0 && (
        <EmptyView message="표시할 Todo가 없습니다." />
      )}

      {!isLoading && !isError && sections.length > 0 && (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.todoId)}
          renderItem={({ item, section }) => (
            <>
              <TodoListItem
                todo={item}
                category={item.categoryId ? (categoriesById.get(item.categoryId) ?? null) : null}
                isOverdue={section.isOverdue}
                isSelected={item.todoId === longPressedTodoId}
                onToggleComplete={handleToggleComplete}
                onLongPress={(todoId) =>
                  setLongPressedTodoId((prev) => (prev === todoId ? null : todoId))
                }
              />
              {item.todoId === longPressedTodoId && (
                <TodoQuickActionPanel
                  onPostpone={handlePostpone}
                  onPickDate={() => setIsPostponeDatePickerOpen(true)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </>
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionHeaderText, { color: section.titleColor }]}>
                {section.title}
              </Text>
            </View>
          )}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {isSpeedDialOpen && (
        <TodoSpeedDialMenu
          onClose={() => setIsSpeedDialOpen(false)}
          onManageCategories={() => {
            setIsSpeedDialOpen(false);
            navigation.navigate('CategoryManage');
          }}
          onCreateCategory={() => {
            setIsSpeedDialOpen(false);
            navigation.navigate('CategoryCreate', undefined);
          }}
          onCreateTodo={() => {
            setIsSpeedDialOpen(false);
            setIsCreateSheetOpen(true);
          }}
        />
      )}

      <TodoCreateSheet
        visible={isCreateSheetOpen}
        categories={categories}
        initialDateKey={createSheetInitialDateKey}
        onClose={() => setIsCreateSheetOpen(false)}
      />

      <TodoDatePickerSheet
        visible={isPostponeDatePickerOpen}
        selectedDateKey={longPressedTodo?.dueDate ?? formatDateKey(new Date())}
        onConfirm={handleConfirmPostponeDate}
        onClose={() => setIsPostponeDatePickerOpen(false)}
      />

      <TodoEditSheet
        visible={editingTodoId !== null}
        todo={editingTodo}
        categories={categories}
        onClose={() => setEditingTodoId(null)}
      />

      {undoToast && (
        <TodoUndoToast
          message={undoToast.label}
          secondsLeft={undoToast.secondsLeft}
          onUndo={handleUndo}
        />
      )}

      {!undoToast && (
        <Pressable
          style={styles.fab}
          onPress={() => setIsSpeedDialOpen((prev) => !prev)}
          accessibilityLabel={isSpeedDialOpen ? '메뉴 닫기' : 'Todo 추가 메뉴 열기'}
        >
          <Text style={styles.fabIcon}>{isSpeedDialOpen ? '×' : '+'}</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // CalendarScreen의 content(paddingTop/paddingHorizontal)와 동일한 값을 사용해 두 화면의
  // 헤더(뒤로가기/타이틀/토글)가 화면상 같은 좌표에 오도록 맞춤
  headerSection: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  // 헤더 아래 날짜 스트립/카테고리 필터는 헤더보다 더 아래에 위치하도록 별도 여백 부여
  subHeaderSection: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    ...typography.heading3,
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  listContent: {
    paddingBottom: spacing.xxl * 2,
  },
  sectionHeader: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  sectionHeaderText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: 60,
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    ...typography.heading2,
    fontSize: 28,
    color: colors.background,
    lineHeight: 32,
  },
});
