import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type SettingsListItemBadgeVariant = 'accent' | 'neutral';

type SettingsListItemProps = {
  label: string;
  badge?: { label: string; variant: SettingsListItemBadgeVariant };
  onPress: () => void;
  showDivider?: boolean;
  // 알림 설정처럼 그 자리에서 펼쳐지는 행일 때만 전달 — 펼쳐졌으면 화살표가 아래를 향하게 함
  expanded?: boolean;
};

export function SettingsListItem({
  label,
  badge,
  onPress,
  showDivider = true,
  expanded,
}: SettingsListItemProps) {
  return (
    <View>
      <Pressable style={styles.row} onPress={onPress}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.trailing}>
          {badge && (
            <View style={badge.variant === 'accent' ? styles.badgeAccent : styles.badgeNeutral}>
              <Text
                style={
                  badge.variant === 'accent' ? styles.badgeAccentLabel : styles.badgeNeutralLabel
                }
              >
                {badge.label}
              </Text>
            </View>
          )}
          <Ionicons
            name={expanded ? 'chevron-down' : 'chevron-forward'}
            size={16}
            color={colors.text.secondary}
          />
        </View>
      </Pressable>
      {showDivider && <View style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 15,
  },
  label: {
    ...typography.body2,
    fontSize: 15,
    color: colors.text.primary,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.notifDivider,
    marginHorizontal: spacing.md,
  },
  badgeAccent: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.linkBlueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeAccentLabel: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: colors.linkBlue,
  },
  badgeNeutral: {
    height: 24,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.settingsBadgeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNeutralLabel: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '500',
    color: colors.notifReadText,
  },
});
