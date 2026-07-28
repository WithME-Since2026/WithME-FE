import { useMutation } from '@tanstack/react-query';

import { tokenManager } from '@/common/api/tokenManager';

import { loginLocal } from '@/domain/auth/api/authApi';
import { useAuthStore } from '@/domain/auth/store/authStore';
import type { LoginRequest } from '@/domain/auth/types';

export function useLoginMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (request: LoginRequest) => loginLocal(request),
    onSuccess: async (data) => {
      // 토큰을 먼저 저장해야 이후 화면의 API 요청에 Authorization 헤더가 바로 실림
      await tokenManager.setTokens(data.accessToken, data.refreshToken);
      setAuth(data.userId);
    },
  });
}
