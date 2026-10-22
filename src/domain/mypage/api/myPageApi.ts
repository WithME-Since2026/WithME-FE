import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import type {
  MyGroupResponse,
  MyPageAttendanceResponse,
  MyPageProfileResponse,
  NotificationSettingsResponse,
  UpdateNicknameRequest,
  UpdateNotificationSettingsRequest,
} from '@/domain/mypage/types';

export async function getMyPageProfile() {
  const response = await apiClient.get<ApiResponse<MyPageProfileResponse>>(
    '/api/v1/users/me/profile',
  );

  return response.data.data;
}

export async function updateMyPageProfile(request: UpdateNicknameRequest) {
  const response = await apiClient.patch<ApiResponse<MyPageProfileResponse>>(
    '/api/v1/users/me/profile',
    request,
  );

  return response.data.data;
}

export async function getMyPageAttendance() {
  const response = await apiClient.get<ApiResponse<MyPageAttendanceResponse>>(
    '/api/v1/users/me/attendance',
  );

  return response.data.data;
}

export async function getUserGroups() {
  const response = await apiClient.get<ApiResponse<MyGroupResponse[]>>('/api/v1/users/me/groups');

  return response.data.data;
}

export async function getNotificationSettings() {
  const response = await apiClient.get<ApiResponse<NotificationSettingsResponse>>(
    '/api/v1/users/me/notifications',
  );

  return response.data.data;
}

export async function updateNotificationSettings(request: UpdateNotificationSettingsRequest) {
  const response = await apiClient.patch<ApiResponse<NotificationSettingsResponse>>(
    '/api/v1/users/me/notifications',
    request,
  );

  return response.data.data;
}

// TODO: FCM 연동 후 deviceId를 body로 보내면 서버가 해당 기기 FCM 토큰도 삭제함
export async function logout() {
  await apiClient.post<ApiResponse<void>>('/api/v1/auth/logout');
}
