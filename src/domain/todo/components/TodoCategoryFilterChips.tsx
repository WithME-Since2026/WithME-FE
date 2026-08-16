import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { TodoCategoryFilter, TodoCategoryResponse } from '@/domain/todo/types';

type TodoCategoryFilterChipsProps = {
  categories: TodoCategoryResponse[];
  value: TodoCategoryFilter;
  onChange: (value: TodoCategoryFilter) => void;
};

export function TodoCategoryFilterChips({
  categories,
  value,
  onChange,
}: TodoCategoryFilterChipsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.chip, value === 'ALL' && styles.chipActive]}
        onPress={() => onChange('ALL')}
        accessibilityRole="button"
        accessibilityState={{ selected: value === 'ALL' }}
      >
        <Text style={[styles.label, value === 'ALL' && styles.labelActive]}>전체</Text>
      </Pressable>

      {categories.map((category) => {
        const isActive = category.categoryId === value;

        return (
          <Pressable
            key={category.categoryId}
            style={[
              styles.chip,
              isActive && [styles.chipActive, { backgroundColor: category.categoryColor }],
            ]}
            onPress={() => onChange(category.categoryId)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {category.categoryName}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  labelActive: {
    color: colors.background,
  },
});
