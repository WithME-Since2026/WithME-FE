import { useMutation, useQueryClient } from '@tanstack/react-query';

import { readAllNotifications } from '@/domain/notification/api/notificationApi';
import { notificationQueryKeys } from '@/domain/notification/hooks/useNotificationsQuery';
import type { NotificationResponse } from '@/domain/notification/types';

export function useReadAllNotificationsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () => {
      queryClient.setQueryData<NotificationResponse[]>(notificationQueryKeys.all, (previous) =>
        previous?.map((notification) => ({ ...notification, isRead: true })),
      );
    },
  });
}
