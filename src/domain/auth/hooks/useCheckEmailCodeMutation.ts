import { useMutation } from '@tanstack/react-query';

import { checkEmailVerificationCode } from '@/domain/auth/api/authApi';
import type { CheckEmailCodeRequest } from '@/domain/auth/types';

export function useCheckEmailCodeMutation() {
  return useMutation({
    mutationFn: (request: CheckEmailCodeRequest) => checkEmailVerificationCode(request),
  });
}
