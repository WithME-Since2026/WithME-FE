import { useMutation } from '@tanstack/react-query';

import { updateProfile } from '@/domain/user/api/userApi';
import type { UpdateProfileRequest } from '@/domain/user/types';

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (request: UpdateProfileRequest) => updateProfile(request),
  });
}
