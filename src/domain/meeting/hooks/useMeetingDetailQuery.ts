import { useQuery } from '@tanstack/react-query';

import { getMeetingDetail } from '@/domain/meeting/api/meetingApi';
import { meetingQueryKeys } from '@/domain/meeting/hooks/useHomeMeetingsQuery';

export function useMeetingDetailQuery(meetingId: number) {
  return useQuery({
    queryKey: meetingQueryKeys.detail(meetingId),
    queryFn: () => getMeetingDetail(meetingId),
  });
}
