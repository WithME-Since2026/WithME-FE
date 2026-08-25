import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type SettingsListItemBadgeVariant = 'accent' | 'neutral';

type SettingsListItemProps = {
  label: string;
  badge?: { label: string; variant: SettingsListItemBadgeVariant };
  onPress: () => void;
  showDivider?: boolean;
};

export function SettingsListItem({
  label,
  badge,
  onPress,
  showDivider = true,
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
          <Ionicons name="chevron-forward" size={18} color={colors.text.secondary} />
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
    paddingVertical: spacing.md,
  },
  label: {
    ...typography.body2,
    fontSize: 15,
    color: colors.text.primary,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.hairline,
    marginHorizontal: spacing.md,
  },
  badgeAccent: {
    minWidth: 23,
    height: 24,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeAccentLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  badgeNeutral: {
    height: 24,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutralSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNeutralLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.neutralIcon,
  },
});
