import { useMutation } from '@tanstack/react-query';

import { checkLoginIdDuplicate } from '@/domain/auth/api/authApi';
import type { CheckLoginIdRequest } from '@/domain/auth/types';

export function useCheckLoginIdMutation() {
  return useMutation({
    mutationFn: (request: CheckLoginIdRequest) => checkLoginIdDuplicate(request),
  });
}
