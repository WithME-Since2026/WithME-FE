import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import { ChatBubbleIcon } from '@/domain/onboarding/components/icons/ChatBubbleIcon';
import { CheckCircleIcon } from '@/domain/onboarding/components/icons/CheckCircleIcon';
import { LinkIcon } from '@/domain/onboarding/components/icons/LinkIcon';
import { OnboardingCard } from '@/domain/onboarding/components/OnboardingCard';
import { ONBOARDING_PASTEL, cardShadow } from '@/domain/onboarding/constants/cardStyle';

// "링크 하나로 앱 없이 참여할 수 있어요" 페이지의 카드 일러스트
export function LinkShareCard() {
  return (
    <OnboardingCard backgroundColor={ONBOARDING_PASTEL.green}>
      <View style={styles.linkRow}>
        <LinkIcon />
        <Text style={styles.linkText}>withme.app/join/abc123</Text>
      </View>

      <View style={styles.shareButton}>
        <ChatBubbleIcon />
        <Text style={styles.shareButtonText}>카카오로 공유</Text>
      </View>

      <View style={styles.pill}>
        <CheckCircleIcon />
        <Text style={styles.pillText}>앱 설치 없이 참여 가능</Text>
      </View>
    </OnboardingCard>
  );
}

const styles = StyleSheet.create({
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    ...cardShadow,
  },
  linkText: {
    ...typography.caption,
    color: colors.text.primary,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.secondary + '1A',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
  },
  shareButtonText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text.primary,
  },
  pill: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.success + '1A',
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  pillText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.success,
  },
});
