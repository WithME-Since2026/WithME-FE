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
  // 섹션의 마지막 항목 아래에는 구분선을 그리지 않기 위한 플래그
  showDivider?: boolean;
};

const ICON_BY_TYPE = {
  GROUP_JOIN_REQUEST: 'person-outline',
  GROUP_SCHEDULE_CHANGED: 'refresh-outline',
  GROUP_RESPONSE_DEADLINE: 'time-outline',
  GROUP_RESPONSE_RECEIVED: 'checkmark-outline',
} as const;

// Figma 알림 아바타 색상 (node 761:15618 실제 fill 값, 알림 유형별로 서로 다름)
const AVATAR_STYLE_BY_TYPE: Record<
  NotificationType,
  { backgroundColor: string; iconColor: string }
> = {
  GROUP_JOIN_REQUEST: { backgroundColor: colors.notifJoinBg, iconColor: colors.primary },
  GROUP_SCHEDULE_CHANGED: {
    backgroundColor: colors.notifScheduleBg,
    iconColor: colors.notifScheduleIcon,
  },
  GROUP_RESPONSE_DEADLINE: {
    backgroundColor: colors.notifDeadlineBg,
    iconColor: colors.notifDeadlineIcon,
  },
  GROUP_RESPONSE_RECEIVED: {
    backgroundColor: colors.notifReceivedBg,
    iconColor: colors.notifReceivedIcon,
  },
};

// 아바타 지름(40) + 아바타-본문 간격(spacing.sm) + 좌측 여백(spacing.lg)만큼
// 안쪽으로 들여써서, 구분선이 본문 텍스트 시작 위치와 나란히 맞도록 함 (Figma node 761:15812 참고)
const DIVIDER_INSET = 40 + spacing.sm + spacing.lg;

export function NotificationListItem({
  notification,
  onAccept,
  onReject,
  onReconfirm,
  showDivider = true,
}: NotificationListItemProps) {
  const { notificationId, type, message, createdAt, isRead } = notification;
  const avatarStyle = AVATAR_STYLE_BY_TYPE[type];

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: avatarStyle.backgroundColor },
            isRead && styles.avatarRead,
          ]}
        >
          <Ionicons name={ICON_BY_TYPE[type]} size={18} color={avatarStyle.iconColor} />
        </View>

        <View style={styles.body}>
          <View style={styles.messageRow}>
            <Text style={[styles.message, isRead ? styles.messageRead : styles.messageUnread]}>
              {message}
            </Text>
            {!isRead && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.time}>{formatRelativeTimeKo(createdAt)}</Text>

          {type === 'GROUP_JOIN_REQUEST' && !isRead && (
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

          {type === 'GROUP_SCHEDULE_CHANGED' && !isRead && (
            <View style={styles.actionRow}>
              <Pressable
                style={[styles.actionButton, styles.actionButtonPrimary]}
                onPress={() => onReconfirm(notificationId)}
              >
                <Text style={styles.actionButtonPrimaryLabel}>재확인하기</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {showDivider && <View style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: DIVIDER_INSET,
    backgroundColor: colors.notifDivider,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRead: {
    opacity: 0.6,
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
    flex: 1,
  },
  messageUnread: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  messageRead: {
    fontWeight: '400',
    color: colors.notifReadText,
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
    color: colors.notifTimestamp,
    marginTop: spacing.xs / 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  actionButton: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: colors.notifTimestamp,
  },
  actionButtonOutlineLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text.primary,
  },
});
