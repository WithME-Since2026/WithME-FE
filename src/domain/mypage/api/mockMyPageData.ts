import type {
  MyPageAttendanceResponse,
  MyPageProfileResponse,
  NotificationSettingsResponse,
} from '@/domain/mypage/types';

// GET /api/v1/my-page/profile 연동 전까지 마이페이지를 확인할 수 있도록 만든 mock 데이터
export function getMockMyPageProfile(): MyPageProfileResponse {
  return {
    userId: 1,
    nickname: '홍길동',
    isKakaoLinked: true,
    profileImg: null,
  };
}

// GET /api/v1/my-page/attendance 연동 전까지 참여율 통계를 확인할 수 있도록 만든 mock 데이터
export function getMockMyPageAttendance(): MyPageAttendanceResponse {
  return {
    groupCount: 5,
    monthlyAttendCount: 12,
    averageAttendanceRate: 0.92,
    recentWeeks: [
      { weekLabel: '6주전', attendanceRate: 0.42 },
      { weekLabel: '5주전', attendanceRate: 1 },
      { weekLabel: '4주전', attendanceRate: 0.52 },
      { weekLabel: '3주전', attendanceRate: 1 },
      { weekLabel: '2주전', attendanceRate: 0.15 },
      { weekLabel: '이번주', attendanceRate: 1 },
    ],
  };
}

// GET /api/v1/users/me/notifications 연동 전까지 알림 동의 상태를 확인할 수 있도록 만든 mock 데이터
export function getMockNotificationSettings(): NotificationSettingsResponse {
  return { notifyAgree: true };
}
