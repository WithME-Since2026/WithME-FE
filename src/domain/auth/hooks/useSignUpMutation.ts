import { useMutation } from '@tanstack/react-query';

import { signUp } from '@/domain/auth/api/authApi';
import type { SignUpRequest } from '@/domain/auth/types';

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (request: SignUpRequest) => signUp(request),
  });
}
