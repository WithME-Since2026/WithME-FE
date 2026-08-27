import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import {
  getMockMyPageAttendance,
  getMockMyPageProfile,
  getMockNotificationSettings,
} from '@/domain/mypage/api/mockMyPageData';
import type {
  MyPageAttendanceResponse,
  MyPageProfileResponse,
  NotificationSettingsResponse,
  UpdateNicknameRequest,
  UpdateNotificationSettingsRequest,
} from '@/domain/mypage/types';

export async function getMyPageProfile() {
  // TODO: 백엔드 프로필 조회 API(GET /api/v1/users/me/profile) 연동 전까지 mock 데이터 사용
  if (__DEV__) {
    return getMockMyPageProfile();
  }

  const response = await apiClient.get<ApiResponse<MyPageProfileResponse>>(
    '/api/v1/users/me/profile',
  );

  return response.data.data;
}

export async function updateMyPageProfile(request: UpdateNicknameRequest) {
  // TODO: 백엔드 프로필 수정 API(PATCH /api/v1/users/me/profile) 연동 전까지 mock 처리
  if (__DEV__) {
    return { ...getMockMyPageProfile(), nickname: request.nickname };
  }

  const response = await apiClient.patch<ApiResponse<MyPageProfileResponse>>(
    '/api/v1/users/me/profile',
    request,
  );

  return response.data.data;
}

export async function getMyPageAttendance() {
  // TODO: 백엔드 참여율 조회 API(GET /api/v1/users/me/attendance) 연동 전까지 mock 데이터 사용.
  // 실제 API는 attendCount/absentCount/attendanceRate만 반환하므로, 연동 시 이 함수의 응답 매핑을 다시 손봐야 함
  if (__DEV__) {
    return getMockMyPageAttendance();
  }

  const response = await apiClient.get<ApiResponse<MyPageAttendanceResponse>>(
    '/api/v1/users/me/attendance',
  );

  return response.data.data;
}

export async function getNotificationSettings() {
  // TODO: 백엔드 알림 설정 조회 API(GET /api/v1/users/me/notifications) 연동 전까지 mock 데이터 사용
  if (__DEV__) {
    return getMockNotificationSettings();
  }

  const response = await apiClient.get<ApiResponse<NotificationSettingsResponse>>(
    '/api/v1/users/me/notifications',
  );

  return response.data.data;
}

export async function updateNotificationSettings(request: UpdateNotificationSettingsRequest) {
  // TODO: 백엔드 알림 설정 수정 API(PATCH /api/v1/users/me/notifications) 연동 전까지 mock 처리
  if (__DEV__) {
    return request;
  }

  const response = await apiClient.patch<ApiResponse<NotificationSettingsResponse>>(
    '/api/v1/users/me/notifications',
    request,
  );

  return response.data.data;
}

export async function logout() {
  // TODO: 백엔드 로그아웃 API(POST /api/v1/my-page/logout) 연동 전까지 mock 처리
  if (__DEV__) {
    return;
  }

  await apiClient.post<ApiResponse<void>>('/api/v1/my-page/logout');
}
