import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import { BellIcon } from '@/domain/onboarding/components/icons/BellIcon';
import { BoltIcon } from '@/domain/onboarding/components/icons/BoltIcon';
import { CheckCircleIcon } from '@/domain/onboarding/components/icons/CheckCircleIcon';
import { OnboardingCard } from '@/domain/onboarding/components/OnboardingCard';
import { ONBOARDING_PASTEL, cardShadow, tinyText } from '@/domain/onboarding/constants/cardStyle';

// "일정 바뀌면 자동으로 참석 여부를 다시 확인해요" 페이지의 카드 일러스트
export function ScheduleReminderCard() {
  return (
    <OnboardingCard backgroundColor={ONBOARDING_PASTEL.blue}>
      <View style={styles.notice}>
        <View style={styles.row}>
          <BellIcon />
          <Text style={styles.noticeTitle}>일정이 변경되었어요</Text>
        </View>
        <Text style={styles.noticeSubtitle}>7월 14일 → 7월 21일 · 재확인 요청</Text>
      </View>

      <View style={styles.notice}>
        <View style={styles.row}>
          <CheckCircleIcon />
          <Text style={[styles.noticeTitle, styles.noticeTitleSuccess]}>바뀐 일정 참석 확인</Text>
        </View>
        <Text style={styles.noticeSubtitle}>8명이 새 일정에 참석 확인했어요</Text>
      </View>

      <View style={styles.pill}>
        <BoltIcon />
        <Text style={styles.pillText}>자동으로 재확인 요청</Text>
      </View>
    </OnboardingCard>
  );
}

const styles = StyleSheet.create({
  notice: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...cardShadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  noticeTitle: {
    ...tinyText,
    fontWeight: '700',
    color: colors.text.primary,
  },
  noticeTitleSuccess: {
    color: colors.success,
  },
  noticeSubtitle: {
    ...tinyText,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    // 위 "바뀐 일정 참석 확인" 박스와의 간격을 부모의 gap보다 더 벌리기 위해 추가
    marginTop: spacing.sm,
    backgroundColor: colors.primary + '1A',
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
