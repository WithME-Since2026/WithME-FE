import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { InvitedMemberResponse } from '@/domain/meeting/types';
import { getAvatarColor } from '@/domain/meeting/utils/avatarColor';

type InviteMemberRowProps = {
  member: InvitedMemberResponse;
  avatarColorIndex: number;
  onRemove: () => void;
};

export function InviteMemberRow({ member, avatarColorIndex, onRemove }: InviteMemberRowProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: getAvatarColor(avatarColorIndex) }]}>
        <Text style={styles.avatarLabel}>{member.initial}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.phone}>{member.phoneLabel}</Text>
      </View>

      <Pressable onPress={onRemove} hitSlop={8}>
        <Ionicons name="close" size={20} color={colors.meeting.pendingText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.meeting.outlineBorder,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.background,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.meeting.strongText,
  },
  phone: {
    ...typography.caption,
    color: colors.meeting.mutedText,
  },
});
