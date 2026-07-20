import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import type { LoginRequest, LoginResponse } from '@/domain/auth/types';

export async function loginLocal(request: LoginRequest) {
  // apiClient의 baseURL은 호스트까지만 포함하므로 버전 prefix는 각 API에서 직접 명시
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/api/v1/auth/login/local',
    request,
  );

  return response.data.data;
}
