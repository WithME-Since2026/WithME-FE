import { useMemo, useState } from 'react';

import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalendarViewToggle } from '@/common/components/CalendarViewToggle';
import { EmptyView } from '@/common/components/EmptyView';
import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import { formatDateKey, formatDayDetailLabel, isSameDateKey } from '@/common/utils/date';

import type { RootStackParamList } from '@/app/navigation';

import { TodoCategoryFilterChips } from '@/domain/todo/components/TodoCategoryFilterChips';
import { TodoCreateSheet } from '@/domain/todo/components/TodoCreateSheet';
import { TodoListItem } from '@/domain/todo/components/TodoListItem';
import { TodoQuickDateStrip } from '@/domain/todo/components/TodoQuickDateStrip';
import { TodoSpeedDialMenu } from '@/domain/todo/components/TodoSpeedDialMenu';
import { useTodoCategoriesQuery } from '@/domain/todo/hooks/useTodoCategoriesQuery';
import { useTodoListQuery } from '@/domain/todo/hooks/useTodoListQuery';
import type { TodoCategoryFilter, TodoResponse } from '@/domain/todo/types';

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

    return result;
  }, [todos, selectedDateKey, selectedDate, categoryFilter]);

  const handleToggleComplete = (todoId: number) => {
    setCompletedOverrides((prev) => {
      const base = todoListData?.todos.find((todo) => todo.todoId === todoId)?.completed ?? false;
      const current = prev[todoId] ?? base;

      return { ...prev, [todoId]: !current };
    });
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
            <TodoListItem
              todo={item}
              category={item.categoryId ? (categoriesById.get(item.categoryId) ?? null) : null}
              isOverdue={section.isOverdue}
              onToggleComplete={handleToggleComplete}
            />
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
          // TODO: 카테고리 관리 화면 미구현 (GET/PATCH /api/v1/todo/category API는 이미 구현됨)
          onManageCategories={() => setIsSpeedDialOpen(false)}
          // TODO: 카테고리 생성 화면 미구현 (POST /api/v1/todo/category API는 이미 구현됨)
          onCreateCategory={() => setIsSpeedDialOpen(false)}
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

      <Pressable
        style={styles.fab}
        onPress={() => setIsSpeedDialOpen((prev) => !prev)}
        accessibilityLabel={isSpeedDialOpen ? '메뉴 닫기' : 'Todo 추가 메뉴 열기'}
      >
        {isSpeedDialOpen ? (
          <Ionicons name="close" size={28} color={colors.background} />
        ) : (
          <Text style={styles.fabIcon}>+</Text>
        )}
      </Pressable>
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
