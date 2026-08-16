import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import { parseDateKey } from '@/common/utils/date';

import type { TodoCategoryResponse, TodoResponse } from '@/domain/todo/types';

// 지연된 항목이나 미루기로 날짜가 바뀐 항목은 시간 대신 해당 날짜를 짧게 보여준다
function formatDateLabel(dateKey: string) {
  const date = parseDateKey(dateKey);

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

type TodoListItemProps = {
  todo: TodoResponse;
  category: TodoCategoryResponse | null;
  isOverdue: boolean;
  // 롱프레스 퀵 액션 패널이 열려 있는 항목인지 (Figma 6b 롱프레스 퀵 액션)
  isSelected?: boolean;
  onToggleComplete: (todoId: number) => void;
  onLongPress?: (todoId: number) => void;
};

export function TodoListItem({
  todo,
  category,
  isOverdue,
  isSelected = false,
  onToggleComplete,
  onLongPress,
}: TodoListItemProps) {
  const categoryColor = category?.categoryColor ?? colors.text.secondary;
  const titleColor = todo.completed
    ? colors.text.disabled
    : isOverdue
      ? colors.error
      : colors.text.primary;
  // 완료 체크 표시는 카테고리가 있으면 카테고리 색상, 없으면 메인 색상을 사용한다
  const completedColor = category?.categoryColor ?? colors.primary;
  const checkboxColor = todo.completed ? completedColor : isOverdue ? colors.error : colors.border;
  const timeOrDateLabel =
    isOverdue || todo.isPostponed ? formatDateLabel(todo.dueDate) : todo.dueTime;

  return (
    <Pressable
      style={[styles.row, isSelected && styles.rowSelected]}
      onLongPress={onLongPress ? () => onLongPress(todo.todoId) : undefined}
      delayLongPress={400}
    >
      <Pressable
        style={[
          styles.checkbox,
          { borderColor: checkboxColor },
          todo.completed && { backgroundColor: completedColor, borderColor: completedColor },
        ]}
        onPress={() => onToggleComplete(todo.todoId)}
        hitSlop={8}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.completed }}
      >
        {todo.completed && <Ionicons name="checkmark" size={14} color={colors.background} />}
      </Pressable>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, { color: titleColor }, todo.completed && styles.titleCompleted]}
          >
            {todo.title}
          </Text>
          {timeOrDateLabel && <Text style={styles.timeLabel}>{timeOrDateLabel}</Text>}
        </View>

        {category && (
          <View style={[styles.categoryTag, { backgroundColor: `${categoryColor}1F` }]}>
            <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
            <Text style={[styles.categoryLabel, { color: categoryColor }]}>
              {category.categoryName}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowSelected: {
    backgroundColor: `${colors.primary}0D`,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    borderBottomWidth: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  title: {
    ...typography.body2,
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  timeLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.secondary,
    flexShrink: 0,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
  },
  categoryTag: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryLabel: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '500',
  },
});
