import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import type { UpdateProfileRequest, UserProfileResponse } from '@/domain/user/types';

export async function updateProfile(request: UpdateProfileRequest) {
  const response = await apiClient.patch<ApiResponse<UserProfileResponse>>(
    '/api/v1/users/me/profile',
    request,
  );

  return response.data.data;
}
