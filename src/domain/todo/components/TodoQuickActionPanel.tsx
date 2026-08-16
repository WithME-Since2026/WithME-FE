import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

export type TodoPostponeTarget = 'TODAY' | 'TOMORROW' | 'NEXT_WEEK';

type TodoQuickActionPanelProps = {
  onPostpone: (target: TodoPostponeTarget) => void;
  onPickDate: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const POSTPONE_OPTIONS: {
  target: TodoPostponeTarget;
  label: string;
  color: string;
  bg: string;
}[] = [
  { target: 'TODAY', label: '오늘', color: '#4A90FA', bg: '#EBF1FE' },
  { target: 'TOMORROW', label: '내일', color: '#33B86B', bg: '#EBF8F0' },
  { target: 'NEXT_WEEK', label: '다음 주', color: '#F28C1A', bg: '#FEF4E8' },
];

// 할 일을 롱프레스했을 때 항목 바로 아래 인라인으로 뜨는 빠른 미루기/수정/삭제 패널
// (Figma 6b 롱프레스 퀵 액션)
export function TodoQuickActionPanel({
  onPostpone,
  onPickDate,
  onEdit,
  onDelete,
}: TodoQuickActionPanelProps) {
  return (
    <View style={styles.card}>
      <View style={styles.pillRow}>
        {POSTPONE_OPTIONS.map((option) => (
          <Pressable
            key={option.target}
            style={[styles.pill, { backgroundColor: option.bg }]}
            onPress={() => onPostpone(option.target)}
          >
            <View style={[styles.pillDot, { backgroundColor: option.color }]} />
            <Text style={[styles.pillLabel, { color: option.color }]}>{option.label}</Text>
          </Pressable>
        ))}
        <Pressable style={[styles.pill, { backgroundColor: '#F4EBFC' }]} onPress={onPickDate}>
          <View style={[styles.pillDot, { backgroundColor: '#8C33E0' }]} />
          <Text style={[styles.pillLabel, { color: '#8C33E0' }]}>날짜 선택</Text>
        </Pressable>
      </View>

      <View style={styles.divider} />

      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton} onPress={onEdit}>
          <Text style={styles.actionLabel}>수정</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={onDelete}>
          <Text style={[styles.actionLabel, styles.deleteLabel]}>삭제</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.sm,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  pillRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 32,
    borderRadius: borderRadius.full,
    paddingHorizontal: 2,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillLabel: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
    marginHorizontal: -spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text.primary,
  },
  deleteLabel: {
    color: colors.error,
  },
});
