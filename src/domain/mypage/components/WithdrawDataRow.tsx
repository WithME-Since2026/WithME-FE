import { StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography } from '@/common/styles/theme';

type WithdrawDataRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  value: string;
  showDivider?: boolean;
};

// 탈퇴 1단계에서 삭제될 데이터 항목을 한 줄씩 보여주는 행 (아이콘 + 라벨/설명 + 값)
export function WithdrawDataRow({
  icon,
  label,
  description,
  value,
  showDivider = true,
}: WithdrawDataRowProps) {
  return (
    <View>
      <View style={styles.row}>
        <Ionicons name={icon} size={18} color={colors.text.primary} style={styles.icon} />
        <View style={styles.textGroup}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <Text style={styles.value}>{value}</Text>
      </View>
      {showDivider && <View style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  icon: {
    width: 24,
  },
  textGroup: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  label: {
    ...typography.body2,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  description: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  value: {
    ...typography.body2,
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
});
