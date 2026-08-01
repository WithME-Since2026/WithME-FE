import { useMutation } from '@tanstack/react-query';

import { resetPassword } from '@/domain/auth/api/authApi';
import type { ResetPasswordRequest } from '@/domain/auth/types';

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (request: ResetPasswordRequest) => resetPassword(request),
  });
}
