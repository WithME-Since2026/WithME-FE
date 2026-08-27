import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateMyPageProfile } from '@/domain/mypage/api/myPageApi';
import { myPageQueryKeys } from '@/domain/mypage/hooks/useMyPageProfileQuery';
import type { MyPageProfileResponse } from '@/domain/mypage/types';

export function useUpdateMyPageProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyPageProfile,
    onSuccess: (data) => {
      queryClient.setQueryData<MyPageProfileResponse>(myPageQueryKeys.profile, data);
    },
  });
}
