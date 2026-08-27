// GET /api/v1/users/me/profile 실제 백엔드 DTO(ProfileResponse)와 동일한 필드명(userId, nickname, profileImg)
// TODO: isKakaoLinked는 ProfileResponse에 아직 없는 필드(User 엔티티엔 kakaoSync가 있음) — 백엔드에 노출되면 실제 값으로 교체
export type MyPageProfileResponse = {
  userId: number;
  nickname: string;
  isKakaoLinked: boolean;
  profileImg: string | null;
};

export type WeeklyAttendanceResponse = {
  weekLabel: string;
  // 0~1 사이의 해당 주 참석률
  attendanceRate: number;
};

// TODO: 실제 백엔드 AttendanceRateResponse는 { attendCount, absentCount, attendanceRate }만 반환함.
// groupCount/monthlyAttendCount/recentWeeks(주차별 통계)는 아직 대응하는 API가 없어 프론트에서 먼저 만들어 둔 형태 — 백엔드 명세 확정 시 다시 맞출 것
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

// PATCH /api/v1/users/me/profile 실제 백엔드 요청 DTO(UpdateNicknameRequest)와 동일한 필드명 — 닉네임만 수정 가능
export type UpdateNicknameRequest = {
  nickname: string;
};
