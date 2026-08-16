import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { TodoCategoryResponse, TodoResponse } from '@/domain/todo/types';

type TodoListItemProps = {
  todo: TodoResponse;
  category: TodoCategoryResponse | null;
  isOverdue: boolean;
  onToggleComplete: (todoId: number) => void;
};

export function TodoListItem({ todo, category, isOverdue, onToggleComplete }: TodoListItemProps) {
  const categoryColor = category?.categoryColor ?? colors.text.secondary;
  const titleColor = todo.completed
    ? colors.text.disabled
    : isOverdue
      ? colors.error
      : colors.text.primary;
  const checkboxColor = todo.completed ? categoryColor : isOverdue ? colors.error : colors.border;

  return (
    <View style={styles.row}>
      <Pressable
        style={[
          styles.checkbox,
          { borderColor: checkboxColor },
          todo.completed && { backgroundColor: categoryColor, borderColor: categoryColor },
        ]}
        onPress={() => onToggleComplete(todo.todoId)}
        hitSlop={8}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.completed }}
      >
        {todo.completed && <Ionicons name="checkmark" size={14} color={colors.background} />}
      </Pressable>

      <View style={styles.content}>
        <Text
          style={[styles.title, { color: titleColor }, todo.completed && styles.titleCompleted]}
        >
          {todo.title}
        </Text>

        {category && (
          <View style={[styles.categoryTag, { backgroundColor: `${categoryColor}1F` }]}>
            <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
            <Text style={[styles.categoryLabel, { color: categoryColor }]}>
              {category.categoryName}
            </Text>
          </View>
        )}
      </View>
    </View>
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
  title: {
    ...typography.body2,
    fontSize: 13,
    fontWeight: '500',
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
