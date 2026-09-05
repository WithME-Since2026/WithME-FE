import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tokenManager } from '@/common/api/tokenManager';

import { useAuthStore } from '@/domain/auth/store/authStore';
import { logout } from '@/domain/mypage/api/myPageApi';

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await tokenManager.clearTokens();
      clearAuth();
      queryClient.clear();
    },
  });
}
