import { useQuery } from '@tanstack/react-query';

import {
  getNotifications,
  getUnreadNotificationCount,
} from '@/domain/notification/api/notificationApi';

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  unreadCount: () => [...notificationQueryKeys.all, 'unread-count'] as const,
};

export function useUnreadNotificationCountQuery() {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
  });
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationQueryKeys.all,
    queryFn: getNotifications,
  });
}
