import { useQuery } from '@tanstack/react-query';

import { getMyPageProfile } from '@/domain/mypage/api/myPageApi';

export const myPageQueryKeys = {
  all: ['mypage'] as const,
  profile: () => [...myPageQueryKeys.all, 'profile'] as const,
  attendance: () => [...myPageQueryKeys.all, 'attendance'] as const,
  notificationSettings: () => [...myPageQueryKeys.all, 'notification-settings'] as const,
};

export function useMyPageProfileQuery() {
  return useQuery({
    queryKey: myPageQueryKeys.profile(),
    queryFn: getMyPageProfile,
  });
}
