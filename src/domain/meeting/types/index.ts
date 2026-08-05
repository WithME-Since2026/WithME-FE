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
  title: string;
  scheduleText: string;
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
