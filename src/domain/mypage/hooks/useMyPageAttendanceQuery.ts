import { useQuery } from '@tanstack/react-query';

import { getMyPageAttendance } from '@/domain/mypage/api/myPageApi';
import { myPageQueryKeys } from '@/domain/mypage/hooks/useMyPageProfileQuery';

export function useMyPageAttendanceQuery() {
  return useQuery({
    queryKey: myPageQueryKeys.attendance(),
    queryFn: getMyPageAttendance,
  });
}
