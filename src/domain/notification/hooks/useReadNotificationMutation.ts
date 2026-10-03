import { useMutation, useQueryClient } from '@tanstack/react-query';

import { readNotification } from '@/domain/notification/api/notificationApi';
import { notificationQueryKeys } from '@/domain/notification/hooks/useNotificationsQuery';
import type { NotificationResponse } from '@/domain/notification/types';

export function useReadNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: readNotification,
    onSuccess: (_data, notificationId) => {
      queryClient.setQueryData<NotificationResponse[]>(notificationQueryKeys.all, (previous) =>
        previous?.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    },
  });
}
