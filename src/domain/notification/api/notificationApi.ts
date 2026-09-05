import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import { getMockNotifications } from '@/domain/notification/api/mockNotificationData';
import type { NotificationResponse } from '@/domain/notification/types';

export async function getNotifications() {
  // TODO: 백엔드 알림 목록 조회 API(GET /api/v1/notifications) 연동 전까지 mock 데이터 사용
  if (__DEV__) {
    return getMockNotifications();
  }

  const response =
    await apiClient.get<ApiResponse<NotificationResponse[]>>('/api/v1/notifications');

  return response.data.data;
}

export async function readNotification(notificationId: number) {
  // TODO: 백엔드 단일 알림 읽음 처리 API(PATCH /api/v1/notifications/{notification_id}/read) 연동 전까지 mock 처리
  if (__DEV__) {
    return;
  }

  await apiClient.patch<ApiResponse<void>>(`/api/v1/notifications/${notificationId}/read`);
}

export async function readAllNotifications() {
  // TODO: 백엔드 알림 전체 읽음 처리 API(PATCH /api/v1/notifications/read) 연동 전까지 mock 처리
  if (__DEV__) {
    return;
  }

  await apiClient.patch<ApiResponse<void>>('/api/v1/notifications/read');
}
