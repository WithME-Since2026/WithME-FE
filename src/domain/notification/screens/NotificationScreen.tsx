import { useMemo, useState } from 'react';

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyView } from '@/common/components/EmptyView';
import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { Toast } from '@/common/components/Toast';
import { colors, spacing, typography } from '@/common/styles/theme';
import { formatDateKey } from '@/common/utils/date';

import type { RootStackParamList } from '@/app/navigation';

import { NotificationListItem } from '@/domain/notification/components/NotificationListItem';
import { useNotificationsQuery } from '@/domain/notification/hooks/useNotificationsQuery';
import { useReadAllNotificationsMutation } from '@/domain/notification/hooks/useReadAllNotificationsMutation';
import { useReadNotificationMutation } from '@/domain/notification/hooks/useReadNotificationMutation';
import type { NotificationResponse } from '@/domain/notification/types';

type NotificationScreenProps = NativeStackScreenProps<RootStackParamList, 'Notification'>;

type NotificationListRow =
  | { kind: 'header'; label: string; topSpacing: boolean }
  | { kind: 'item'; notification: NotificationResponse; showDivider: boolean };

// 오늘/이전 알림 그룹으로 나눠 알림 목록을 보여주는 화면
// 하단 탭바는 다른 팀원이 별도로 작업 중이라 여기서는 자리만 비워둠 (충돌 방지)
export function NotificationScreen({ navigation }: NotificationScreenProps) {
  const { data: notifications, isLoading, isError } = useNotificationsQuery();
  const readNotificationMutation = useReadNotificationMutation();
  const readAllNotificationsMutation = useReadAllNotificationsMutation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { todayNotifications, pastNotifications, hasUnread } = useMemo(() => {
    const todayKey = formatDateKey(new Date());
    const today: NotificationResponse[] = [];
    const past: NotificationResponse[] = [];
    let unread = false;

    notifications?.forEach((notification) => {
      if (!notification.isRead) {
        unread = true;
      }

      if (formatDateKey(new Date(notification.createdAt)) === todayKey) {
        today.push(notification);
      } else {
        past.push(notification);
      }
    });

    return { todayNotifications: today, pastNotifications: past, hasUnread: unread };
  }, [notifications]);

  const rows = useMemo<NotificationListRow[]>(() => {
    const result: NotificationListRow[] = [];

    if (todayNotifications.length > 0) {
      result.push({ kind: 'header', label: '오늘', topSpacing: false });
      todayNotifications.forEach((notification, index) => {
        result.push({
          kind: 'item',
          notification,
          showDivider: index < todayNotifications.length - 1,
        });
      });
    }

    if (pastNotifications.length > 0) {
      result.push({ kind: 'header', label: '이전', topSpacing: todayNotifications.length > 0 });
      pastNotifications.forEach((notification, index) => {
        result.push({
          kind: 'item',
          notification,
          showDivider: index < pastNotifications.length - 1,
        });
      });
    }

    return result;
  }, [todayNotifications, pastNotifications]);

  // TODO: 그룹 참가 신청 수락/거절, 일정 재확인 전용 API가 아직 명세되지 않아 우선 읽음 처리만 연동
  const handleAccept = (notificationId: number) => {
    readNotificationMutation.mutate(notificationId);
    setToastMessage('참가 신청을 수락했어요');
  };
  const handleReject = (notificationId: number) => {
    readNotificationMutation.mutate(notificationId);
    setToastMessage('참가 신청을 거절했어요');
  };
  const handleReconfirm = (notificationId: number) => {
    readNotificationMutation.mutate(notificationId);
    // Figma에는 거절 토스트 문구만 명시되어 있어, 수락/재확인 문구는 같은 톤으로 맞춰 작성함
    setToastMessage('일정을 재확인했어요');
  };

  const isEmpty = !isLoading && !isError && (notifications?.length ?? 0) === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.title}>알림</Text>
        <Pressable
          onPress={() => readAllNotificationsMutation.mutate()}
          disabled={!hasUnread}
          hitSlop={8}
        >
          <Text style={[styles.markAllReadLabel, !hasUnread && styles.markAllReadLabelDisabled]}>
            모두 읽음
          </Text>
        </Pressable>
      </View>

      {isLoading && <LoadingView />}
      {isError && <ErrorView message="알림을 불러오지 못했습니다." />}
      {isEmpty && <EmptyView message="새로운 알림이 없습니다." />}

      {!isLoading && !isError && !isEmpty && (
        <FlatList
          data={rows}
          contentContainerStyle={styles.list}
          keyExtractor={(row) =>
            row.kind === 'header'
              ? `header-${row.label}`
              : `notification-${row.notification.notificationId}`
          }
          renderItem={({ item }) =>
            item.kind === 'header' ? (
              <Text style={[styles.sectionLabel, item.topSpacing && styles.sectionLabelSpacing]}>
                {item.label}
              </Text>
            ) : (
              <NotificationListItem
                notification={item.notification}
                onAccept={handleAccept}
                onReject={handleReject}
                onReconfirm={handleReconfirm}
                showDivider={item.showDivider}
              />
            )
          }
        />
      )}

      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}

      {/* TODO: 하단 탭바(홈/캘린더/마이)는 다른 팀원이 작업 중 — 완료되면 여기에 연결 */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...typography.heading3,
    color: colors.text.primary,
  },
  markAllReadLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
  markAllReadLabelDisabled: {
    color: colors.notifTimestamp,
  },
  list: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.notifReadText,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
  sectionLabelSpacing: {
    marginTop: spacing.md,
  },
});
