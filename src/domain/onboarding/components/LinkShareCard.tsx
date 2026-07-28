import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import { ChatBubbleIcon } from '@/domain/onboarding/components/icons/ChatBubbleIcon';
import { CheckCircleIcon } from '@/domain/onboarding/components/icons/CheckCircleIcon';
import { LinkIcon } from '@/domain/onboarding/components/icons/LinkIcon';

// "링크 하나로 앱 없이 참여할 수 있어요" 페이지의 카드 일러스트
export function LinkShareCard() {
  return (
    <View style={styles.card}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    width: '65%',
    backgroundColor: colors.pastel.green,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  linkText: {
    ...typography.body2,
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
    ...typography.body2,
    fontWeight: '700',
    color: colors.text.primary,
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
    color: colors.success,
  },
});
