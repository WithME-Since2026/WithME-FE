import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography } from '@/common/styles/theme';

type WithdrawStepHeaderProps = {
  step: 1 | 2 | 3;
  onBackPress: () => void;
};

// 회원 탈퇴 플로우(1~3단계) 공통 헤더: 뒤로가기 + 제목 + 단계 표시 + 진행률 바
export function WithdrawStepHeader({ step, onBackPress }: WithdrawStepHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable onPress={onBackPress} hitSlop={8} style={styles.sideButton}>
          <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.title}>회원 탈퇴</Text>
        <Text style={styles.stepLabel}>{step} / 3</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { flex: step }]} />
        {step < 3 && <View style={{ flex: 3 - step }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: spacing.md,
  },
  sideButton: {
    width: 44,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...typography.body1,
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
  },
  stepLabel: {
    width: 44,
    textAlign: 'right',
    ...typography.caption,
    fontSize: 13,
    color: colors.text.secondary,
  },
  progressTrack: {
    flexDirection: 'row',
    height: 2,
  },
  progressFill: {
    backgroundColor: colors.primary,
  },
});
