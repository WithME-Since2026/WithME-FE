export type MyPageProfileResponse = {
  userId: number;
  nickname: string;
  isKakaoLinked: boolean;
  profileImageUrl: string | null;
};

export type WeeklyAttendanceResponse = {
  weekLabel: string;
  // 0~1 사이의 해당 주 참석률
  attendanceRate: number;
};

export type MyPageAttendanceResponse = {
  groupCount: number;
  monthlyAttendCount: number;
  // 0~1 사이의 평균 참석률
  averageAttendanceRate: number;
  recentWeeks: WeeklyAttendanceResponse[];
};

// GET/PATCH /api/v1/users/me/notifications 실제 백엔드 DTO(NotificationSettingsResponse)와 동일한 필드명
export type NotificationSettingsResponse = {
  notifyAgree: boolean;
};

export type UpdateNotificationSettingsRequest = {
  notifyAgree: boolean;
};
