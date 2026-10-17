import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tokenManager } from '@/common/api/tokenManager';

import { useAuthStore } from '@/domain/auth/store/authStore';
import { logout } from '@/domain/mypage/api/myPageApi';
import { useSubscriptionStore } from '@/domain/subscription/store/subscriptionStore';

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearSubscription = useSubscriptionStore((state) => state.clearSubscription);

  return useMutation({
    mutationFn: logout,
    // 서버 요청이 실패해도(네트워크 오류, 토큰 만료 등) 기기에서는 로그아웃되어야 함
    onSettled: async () => {
      await tokenManager.clearTokens();
      clearAuth();
      clearSubscription();
      queryClient.clear();
    },
  });
}
