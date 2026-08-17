import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import { formatRelativeTimeKo } from '@/common/utils/date';

import type { NotificationResponse, NotificationType } from '@/domain/notification/types';

type NotificationListItemProps = {
  notification: NotificationResponse;
  onAccept: (notificationId: number) => void;
  onReject: (notificationId: number) => void;
  onReconfirm: (notificationId: number) => void;
};

const ICON_BY_TYPE = {
  GROUP_JOIN_REQUEST: 'person-outline',
  GROUP_SCHEDULE_CHANGED: 'refresh-outline',
  GROUP_RESPONSE_DEADLINE: 'time-outline',
  GROUP_RESPONSE_RECEIVED: 'checkmark-outline',
} as const;

// Figma 알림 아바타 색상 (node 194:1390/194:1391 등 원본 SVG의 실제 fill/stroke 값)
const AVATAR_STYLE_BY_TYPE: Record<
  NotificationType,
  { backgroundColor: string; iconColor: string }
> = {
  GROUP_JOIN_REQUEST: { backgroundColor: colors.accentSoft, iconColor: colors.primary },
  GROUP_SCHEDULE_CHANGED: { backgroundColor: colors.accentSoft, iconColor: colors.primary },
  GROUP_RESPONSE_DEADLINE: { backgroundColor: colors.neutralSoft, iconColor: colors.neutralIcon },
  GROUP_RESPONSE_RECEIVED: { backgroundColor: colors.neutralSoft, iconColor: colors.neutralIcon },
};

export function NotificationListItem({
  notification,
  onAccept,
  onReject,
  onReconfirm,
}: NotificationListItemProps) {
  const { notificationId, type, message, createdAt, isRead } = notification;
  const avatarStyle = AVATAR_STYLE_BY_TYPE[type];

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: avatarStyle.backgroundColor }]}>
        <Ionicons name={ICON_BY_TYPE[type]} size={18} color={avatarStyle.iconColor} />
      </View>

      <View style={styles.body}>
        <View style={styles.messageRow}>
          <Text style={styles.message}>{message}</Text>
          {!isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.time}>{formatRelativeTimeKo(createdAt)}</Text>

        {type === 'GROUP_JOIN_REQUEST' && (
          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={() => onAccept(notificationId)}
            >
              <Text style={styles.actionButtonPrimaryLabel}>수락</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.actionButtonOutline]}
              onPress={() => onReject(notificationId)}
            >
              <Text style={styles.actionButtonOutlineLabel}>거절</Text>
            </Pressable>
          </View>
        )}

        {type === 'GROUP_SCHEDULE_CHANGED' && (
          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionButton, styles.actionButtonPrimary, styles.actionButtonWide]}
              onPress={() => onReconfirm(notificationId)}
            >
              <Text style={styles.actionButtonPrimaryLabel}>재확인하기</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    // 카드 사이 회색 배경이 보이도록 아래쪽에 여백을 둠
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  message: {
    ...typography.body2,
    fontSize: 13,
    color: colors.text.primary,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  time: {
    ...typography.caption,
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  actionButton: {
    width: 43,
    height: 28,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonWide: {
    width: 76,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
  },
  actionButtonPrimaryLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.background,
  },
  actionButtonOutline: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.neutralBorder,
  },
  actionButtonOutlineLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.neutralIcon,
  },
});
