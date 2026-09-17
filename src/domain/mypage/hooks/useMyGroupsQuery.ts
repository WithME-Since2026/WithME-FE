import { useQuery } from '@tanstack/react-query';

import { getUserGroups } from '@/domain/mypage/api/myPageApi';
import { myPageQueryKeys } from '@/domain/mypage/hooks/useMyPageProfileQuery';

export function useMyGroupsQuery() {
  return useQuery({
    queryKey: myPageQueryKeys.groups(),
    queryFn: getUserGroups,
  });
}
