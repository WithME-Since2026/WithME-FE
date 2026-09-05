import type { NotificationResponse } from '@/domain/notification/types';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

// GET /api/v1/notifications 연동 전까지 알림 목록을 확인할 수 있도록 현재 시각 기준으로 생성하는 mock 데이터
export function getMockNotifications(): NotificationResponse[] {
  const now = Date.now();

  return [
    {
      notificationId: 1,
      type: 'GROUP_JOIN_REQUEST',
      message: '이서연님이 수요일 독서모임 참가를 신청했어요.',
      createdAt: new Date(now - 1 * MINUTE).toISOString(),
      isRead: false,
    },
    {
      notificationId: 2,
      type: 'GROUP_SCHEDULE_CHANGED',
      message:
        '러닝크루 한강 일정이 7/12 → 7/13으로 바뀌었어요.\n참석 가능한지 다시 확인해 주세요.',
      createdAt: new Date(now - 1 * HOUR).toISOString(),
      isRead: false,
    },
    {
      notificationId: 3,
      type: 'GROUP_RESPONSE_DEADLINE',
      message: '주말 등산 모임 응답 마감이 3시간 남았어요.',
      createdAt: new Date(now - 3 * HOUR).toISOString(),
      isRead: false,
    },
    {
      notificationId: 4,
      type: 'GROUP_RESPONSE_RECEIVED',
      message: '김도현님이 수요일 독서모임 2회차에 참석으로 응답했어요.',
      createdAt: new Date(now - 26 * HOUR).toISOString(),
      isRead: true,
    },
  ];
}
