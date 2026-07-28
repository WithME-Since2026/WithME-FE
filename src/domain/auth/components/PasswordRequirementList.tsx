import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import { PASSWORD_MIN_LENGTH, type PasswordRuleStatus } from '@/common/utils/validators';

type PasswordRequirementListProps = {
  status: PasswordRuleStatus;
};

// 새 비밀번호 입력 시 규칙 충족 여부를 실시간으로 보여주는 체크리스트
export function PasswordRequirementList({ status }: PasswordRequirementListProps) {
  const items: { label: string; satisfied: boolean }[] = [
    { label: `${PASSWORD_MIN_LENGTH}자 이상`, satisfied: status.minLength },
    { label: '영문 포함', satisfied: status.hasLetter },
    { label: '숫자 포함', satisfied: status.hasNumber },
    { label: '특수문자 포함 (선택)', satisfied: status.hasSpecialChar },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>비밀번호 조건</Text>
      {items.map((item) => (
        <View key={item.label} style={styles.row}>
          <View style={[styles.mark, item.satisfied && styles.markSatisfied]}>
            {item.satisfied && <Text style={styles.markIcon}>✓</Text>}
          </View>
          <Text style={[styles.label, item.satisfied && styles.labelSatisfied]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  heading: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs / 2,
  },
  mark: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  markSatisfied: {
    backgroundColor: colors.success,
  },
  markIcon: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.background,
  },
  label: {
    ...typography.caption,
    color: colors.text.disabled,
  },
  labelSatisfied: {
    color: colors.text.primary,
  },
});
