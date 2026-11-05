import { useQuery } from '@tanstack/react-query';

import { getAttendanceOverview } from '@/domain/meeting/api/attendanceOverviewApi';
import { meetingQueryKeys } from '@/domain/meeting/hooks/useHomeMeetingsQuery';

export function useAttendanceOverviewQuery(meetingId: number) {
  return useQuery({
    queryKey: meetingQueryKeys.attendanceOverview(meetingId),
    queryFn: () => getAttendanceOverview(meetingId),
  });
}
