import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type SignUpStepIndicatorProps = {
  label: string;
  // 0~1 사이 진행률
  progress: number;
};

// 회원가입 화면 상단에 고정 표시되는 단계 라벨 + 진행률 바
export function SignUpStepIndicator({ label, progress }: SignUpStepIndicatorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  label: {
    ...typography.body2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  track: {
    height: 3,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
});
