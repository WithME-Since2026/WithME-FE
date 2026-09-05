import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateNotificationSettings } from '@/domain/mypage/api/myPageApi';
import { myPageQueryKeys } from '@/domain/mypage/hooks/useMyPageProfileQuery';

export function useUpdateNotificationSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(myPageQueryKeys.notificationSettings(), data);
    },
  });
}
