import { useQuery } from '@tanstack/react-query';

import { getNotificationSettings } from '@/domain/mypage/api/myPageApi';
import { myPageQueryKeys } from '@/domain/mypage/hooks/useMyPageProfileQuery';

export function useNotificationSettingsQuery() {
  return useQuery({
    queryKey: myPageQueryKeys.notificationSettings,
    queryFn: getNotificationSettings,
  });
}
