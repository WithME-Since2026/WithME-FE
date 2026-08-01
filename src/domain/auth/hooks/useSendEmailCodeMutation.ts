import { useMutation } from '@tanstack/react-query';

import { sendEmailVerificationCode } from '@/domain/auth/api/authApi';
import type { SendEmailCodeRequest } from '@/domain/auth/types';

export function useSendEmailCodeMutation() {
  return useMutation({
    mutationFn: (request: SendEmailCodeRequest) => sendEmailVerificationCode(request),
  });
}
