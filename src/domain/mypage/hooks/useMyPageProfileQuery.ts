import { useQuery } from '@tanstack/react-query';

import { getMyPageProfile } from '@/domain/mypage/api/myPageApi';

export const myPageQueryKeys = {
  profile: ['mypage', 'profile'] as const,
  attendance: ['mypage', 'attendance'] as const,
  notificationSettings: ['mypage', 'notification-settings'] as const,
};

export function useMyPageProfileQuery() {
  return useQuery({
    queryKey: myPageQueryKeys.profile,
    queryFn: getMyPageProfile,
  });
}
