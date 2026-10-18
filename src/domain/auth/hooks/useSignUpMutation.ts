import { useMutation } from '@tanstack/react-query';

import { tokenManager } from '@/common/api/tokenManager';

import { signUp } from '@/domain/auth/api/authApi';
import { useAuthStore } from '@/domain/auth/store/authStore';
import type { SignUpRequest } from '@/domain/auth/types';

export function useSignUpMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (request: SignUpRequest) => signUp(request),
    // 가입 응답에 토큰이 포함되어 바로 로그인 상태가 됨
    onSuccess: async (data) => {
      await tokenManager.setTokens(data.accessToken, data.refreshToken);
      setAuth(data.userId);
    },
  });
}
