// GET /api/v1/users/me/profile 실제 백엔드 DTO(ProfileResponse)와 동일한 필드명(userId, nickname, profileImg)
// TODO: isKakaoLinked는 ProfileResponse에 아직 없는 필드(User 엔티티엔 kakaoSync가 있음) — 백엔드에 노출되면 실제 값으로 교체
export type MyPageProfileResponse = {
  userId: number;
  nickname: string;
  isKakaoLinked?: boolean;
  profileImg: string | null;
};

export type WeeklyAttendanceResponse = {
  weekLabel: string;
  // 0~1 사이의 해당 주 참석률
  attendanceRate: number;
};

// GET /api/v1/users/me/attendance 실제 백엔드 DTO(AttendanceRateResponse)와 동일한 필드명
export type MyPageAttendanceResponse = {
  attendCount: number;
  absentCount: number;
  // 0~1 사이의 참석률 (응답한 회차 중 ATTEND 비율)
  attendanceRate: number;
};

// GET/PATCH /api/v1/users/me/notifications 실제 백엔드 DTO(NotificationSettingsResponse)와 동일한 필드명
export type NotificationSettingsResponse = {
  notifyGroupRemind: boolean;
  notifyTodoDeadline: boolean;
  notifyGroupInvite: boolean;
};

export type UpdateNotificationSettingsRequest = NotificationSettingsResponse;

// PATCH /api/v1/users/me/profile 실제 백엔드 요청 DTO(UpdateNicknameRequest)와 동일한 필드명 — 닉네임만 수정 가능
export type UpdateNicknameRequest = {
  nickname: string;
};

export type GroupMemberPosition = 'OWNER' | 'CO_OWNER' | 'MEMBER';

// GET /api/v1/users/me/groups 실제 백엔드 DTO(MyGroupResponse)와 동일한 필드명
export type MyGroupResponse = {
  groupId: number;
  name: string;
  position: GroupMemberPosition;
};
