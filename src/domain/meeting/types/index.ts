export type MeetingRole = 'OPERATOR' | 'PARTICIPANT';

export type MeetingStatusLabel = '진행' | '완료' | '참석' | '대기';

export type MeetingAttendanceSummary = {
  attending: number;
  notAttending: number;
  pending: number;
};

export type FeaturedMeetingResponse = {
  meetingId: number;
  role: MeetingRole;
  roundLabel: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  locationText: string;
  dDayLabel: string;
  attendance: MeetingAttendanceSummary;
};

export type MeetingSummaryResponse = {
  meetingId: number;
  role: MeetingRole;
  title: string;
  scheduleText: string;
  statusLabel: MeetingStatusLabel;
};

export type HomeMeetingsResponse = {
  featuredMeetings: FeaturedMeetingResponse[];
  otherMeetings: MeetingSummaryResponse[];
};

export type MyAttendanceStatus = 'ATTENDING' | 'NOT_ATTENDING' | 'UNDECIDED';

export type MeetingAttendeeResponse = {
  memberId: number;
  name: string;
  initial: string;
};

export type MeetingDetailResponse = {
  meetingId: number;
  role: MeetingRole;
  title: string;
  roundLabel: string;
  dateText: string;
  locationText: string;
  timeText: string;
  totalMemberCount: number;
  attendance: MeetingAttendanceSummary;
  attendees: MeetingAttendeeResponse[];
  myAttendanceStatus: MyAttendanceStatus | null;
};

export type MeetingCategory = 'STUDY' | 'READING' | 'EXERCISE' | 'ETC';

export type MeetingRepeatOption = 'NONE' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';

export type CreateMeetingBasicInfo = {
  title: string;
  description: string;
  category: MeetingCategory;
  maxMemberCount: string;
};

export type CreateMeetingScheduleInfo = {
  firstMeetingDate: string;
  startTime: string;
  endTime: string;
  location: string;
  repeatOption: MeetingRepeatOption;
  repeatCount: string;
};

export type InvitedMemberResponse = {
  memberId: number;
  name: string;
  initial: string;
  phoneLabel: string;
};

export type CreateMeetingRequest = CreateMeetingBasicInfo &
  CreateMeetingScheduleInfo & {
    invitedMemberIds: number[];
  };

export type CreateMeetingResponse = {
  meetingId: number;
  title: string;
  inviteLink: string;
};
