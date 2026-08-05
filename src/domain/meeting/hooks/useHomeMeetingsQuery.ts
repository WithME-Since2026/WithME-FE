import { useQuery } from '@tanstack/react-query';

import { getHomeMeetings } from '@/domain/meeting/api/meetingApi';

export const meetingQueryKeys = {
  all: ['meeting'] as const,
  home: () => [...meetingQueryKeys.all, 'home'] as const,
};

export function useHomeMeetingsQuery() {
  return useQuery({
    queryKey: meetingQueryKeys.home(),
    queryFn: getHomeMeetings,
  });
}
