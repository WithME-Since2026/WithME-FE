import { useMutation } from '@tanstack/react-query';

import { findLoginId } from '@/domain/auth/api/authApi';
import type { FindLoginIdRequest } from '@/domain/auth/types';

export function useFindLoginIdMutation() {
  return useMutation({
    mutationFn: (request: FindLoginIdRequest) => findLoginId(request),
  });
}
