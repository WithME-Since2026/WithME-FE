import type { ReactNode } from 'react';

import { StyleSheet, View } from 'react-native';

import { borderRadius, spacing } from '@/common/styles/theme';

type OnboardingCardProps = {
  backgroundColor: string;
  children: ReactNode;
};

// 온보딩 3페이지 카드가 내용과 무관하게 항상 같은 크기/여백을 갖도록 통일한 공용 틀
export function OnboardingCard({ backgroundColor, children }: OnboardingCardProps) {
  return <View style={[styles.card, { backgroundColor }]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    width: '92%',
    height: 270,
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
});
