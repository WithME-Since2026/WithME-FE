import { useQuery } from '@tanstack/react-query';

import { getNotifications } from '@/domain/notification/api/notificationApi';

export const notificationQueryKeys = {
  all: ['notifications'] as const,
};

export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationQueryKeys.all,
    queryFn: getNotifications,
  });
}
