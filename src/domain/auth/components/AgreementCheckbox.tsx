import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type AgreementCheckboxProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
  // 생략 시(전체 동의 항목) 필수/선택 태그를 표시하지 않음
  requiredLabel?: '필수' | '선택';
  bold?: boolean;
};

export function AgreementCheckbox({
  label,
  checked,
  onToggle,
  requiredLabel,
  bold = false,
}: AgreementCheckboxProps) {
  return (
    <Pressable style={styles.row} onPress={onToggle} hitSlop={8}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={[styles.label, bold && styles.labelBold]}>
        {label}
        {requiredLabel && <Text style={styles.requiredTag}> ({requiredLabel})</Text>}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkMark: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '700',
  },
  label: {
    ...typography.body2,
    color: colors.text.primary,
  },
  labelBold: {
    fontWeight: '700',
  },
  requiredTag: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
