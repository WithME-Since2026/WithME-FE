import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import { BellIcon } from '@/domain/onboarding/components/icons/BellIcon';
import { BoltIcon } from '@/domain/onboarding/components/icons/BoltIcon';
import { CheckCircleIcon } from '@/domain/onboarding/components/icons/CheckCircleIcon';

// "일정 바뀌면 자동으로 참석 여부를 다시 확인해요" 페이지의 카드 일러스트
export function ScheduleReminderCard() {
  return (
    <View style={styles.card}>
      <View style={styles.notice}>
        <View style={styles.row}>
          <BellIcon />
          <Text style={styles.noticeTitle}>일정이 변경되었어요</Text>
        </View>
        <Text style={styles.noticeSubtitle}>7월 14일 → 7월 21일 · 재확인 요청</Text>
      </View>

      <View style={styles.notice}>
        <View style={styles.row}>
          <CheckCircleIcon color={colors.primary} />
          <Text style={styles.noticeTitle}>바뀐 일정 참석 확인</Text>
        </View>
        <Text style={styles.noticeSubtitle}>8명이 새 일정에 참석 확인했어요</Text>
      </View>

      <View style={styles.pill}>
        <BoltIcon />
        <Text style={styles.pillText}>자동으로 재확인 요청</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    width: '65%',
    backgroundColor: colors.pastel.blue,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  notice: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  noticeTitle: {
    ...typography.body2,
    fontWeight: '700',
    color: colors.text.primary,
  },
  noticeSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  pillText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
});
