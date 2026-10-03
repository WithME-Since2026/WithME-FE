import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMeeting } from '@/domain/meeting/api/meetingApi';
import { meetingQueryKeys } from '@/domain/meeting/hooks/useHomeMeetingsQuery';

export function useCreateMeetingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingQueryKeys.home() });
    },
  });
}
