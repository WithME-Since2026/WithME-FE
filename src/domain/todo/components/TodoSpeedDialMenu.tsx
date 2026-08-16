import type { ReactNode } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import { TodoEditIcon } from '@/domain/todo/components/TodoEditIcon';

type SpeedDialAction = {
  key: string;
  title: string;
  subtitle: string;
  iconColor: string;
  renderIcon: (color: string) => ReactNode;
  onPress: () => void;
};

type TodoSpeedDialMenuProps = {
  onClose: () => void;
  onManageCategories: () => void;
  onCreateCategory: () => void;
  onCreateTodo: () => void;
};

// "+" FAB를 누르면 펼쳐지는 스피드다이얼 메뉴 (Figma 6g 스피드다이얼). 카드를 위로 쌓아 FAB 바로 위에 배치
export function TodoSpeedDialMenu({
  onClose,
  onManageCategories,
  onCreateCategory,
  onCreateTodo,
}: TodoSpeedDialMenuProps) {
  const actions: SpeedDialAction[] = [
    {
      key: 'manageCategories',
      title: '카테고리 관리',
      subtitle: '정렬·수정·삭제',
      iconColor: '#F28C1A',
      renderIcon: (color) => <Ionicons name="grid-outline" size={16} color={color} />,
      onPress: onManageCategories,
    },
    {
      key: 'createCategory',
      title: '새 카테고리',
      subtitle: '분류 만들기',
      iconColor: colors.success,
      renderIcon: (color) => <Ionicons name="pricetag-outline" size={16} color={color} />,
      onPress: onCreateCategory,
    },
    {
      key: 'createTodo',
      title: '새 할 일',
      subtitle: '빠른 할 일 추가',
      iconColor: '#4A90FA',
      renderIcon: (color) => <TodoEditIcon size={16} color={color} />,
      onPress: onCreateTodo,
    },
  ];

  return (
    <>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="스피드다이얼 메뉴 닫기"
      />

      <View style={styles.cardStack}>
        {actions.map((action) => (
          <Pressable key={action.key} style={styles.card} onPress={action.onPress}>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{action.title}</Text>
              <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
            </View>

            <View style={[styles.cardIcon, { backgroundColor: action.iconColor }]}>
              {action.renderIcon(colors.background)}
            </View>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
  },
  cardStack: {
    position: 'absolute',
    right: spacing.md,
    bottom: 152,
    gap: spacing.md,
  },
  card: {
    width: 172,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
  },
  cardText: {
    gap: 2,
  },
  cardTitle: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.primary,
  },
  cardSubtitle: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.secondary,
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
