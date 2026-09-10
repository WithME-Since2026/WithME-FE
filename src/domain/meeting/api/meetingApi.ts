import type {
  CreateMeetingRequest,
  CreateMeetingResponse,
  HomeMeetingsResponse,
  InvitedMemberResponse,
  MeetingDetailResponse,
} from '@/domain/meeting/types';

const MOCK_HOME_MEETINGS: HomeMeetingsResponse = {
  featuredMeetings: [
    {
      meetingId: 1,
      role: 'OPERATOR',
      roundLabel: '3회차',
      title: '독독 코딩 스터디',
      dateLabel: '08.18 (화)',
      timeLabel: '19:00',
      locationText: '강남구 대학로',
      dDayLabel: 'D-1',
      attendance: { attending: 5, notAttending: 1, pending: 2 },
    },
    {
      meetingId: 2,
      role: 'PARTICIPANT',
      roundLabel: '2회차',
      title: '수요일 스페인어',
      dateLabel: '08.19 (수)',
      timeLabel: '19:00',
      locationText: '마포구 서교동',
      dDayLabel: 'D-1',
      attendance: { attending: 5, notAttending: 1, pending: 2 },
    },
  ],
  otherMeetings: [
    {
      meetingId: 4,
      role: 'OPERATOR',
      title: '금요일 영상 강의',
      scheduleText: '금 20:00 · 온라인',
      statusLabel: '완료',
    },
    {
      meetingId: 3,
      role: 'OPERATOR',
      title: '스터디',
      scheduleText: '화 19:00 · 마포구',
      statusLabel: '진행',
    },
    {
      meetingId: 5,
      role: 'PARTICIPANT',
      title: '토요일 영어회화',
      scheduleText: '토 10:00 · 종로구',
      statusLabel: '참석',
    },
  ],
};

// TODO: 백엔드 홈 API 확정 후 apiClient.get('/api/v1/meetings/home')으로 교체
export async function getHomeMeetings(): Promise<HomeMeetingsResponse> {
  return MOCK_HOME_MEETINGS;
}

const MOCK_MEETING_DETAILS: Record<number, MeetingDetailResponse> = {
  1: {
    meetingId: 1,
    role: 'OPERATOR',
    title: '화요일 독서모임',
    roundLabel: '3회차',
    dateText: '2025년 7월 15일 (화)',
    locationText: '서울 강남구 대학로 1',
    timeText: '오후 7:00 - 9:00',
    totalMemberCount: 8,
    attendance: { attending: 5, notAttending: 1, pending: 2 },
    attendees: [
      { memberId: 1, name: '김도연', initial: '김' },
      { memberId: 2, name: '이수진', initial: '이' },
      { memberId: 3, name: '박지성', initial: '박' },
      { memberId: 4, name: '최유리', initial: '최' },
      { memberId: 5, name: '정민준', initial: '정' },
      { memberId: 6, name: '강서연', initial: '강' },
      { memberId: 7, name: '윤태호', initial: '윤' },
      { memberId: 8, name: '임하은', initial: '임' },
    ],
    myAttendanceStatus: null,
  },
  2: {
    meetingId: 2,
    role: 'PARTICIPANT',
    title: '수요일 스페인어',
    roundLabel: '3회차',
    dateText: '2025년 7월 15일 (화)',
    locationText: '서울 강남구 대학로 1',
    timeText: '오후 7:00 - 9:00',
    totalMemberCount: 8,
    attendance: { attending: 5, notAttending: 1, pending: 2 },
    attendees: [
      { memberId: 1, name: '김도연', initial: '김' },
      { memberId: 2, name: '이수진', initial: '이' },
      { memberId: 3, name: '박지성', initial: '박' },
      { memberId: 4, name: '최유리', initial: '최' },
      { memberId: 5, name: '정민준', initial: '정' },
    ],
    myAttendanceStatus: 'ATTENDING',
  },
  3: {
    meetingId: 3,
    role: 'OPERATOR',
    title: '독독 코딩 스터디',
    roundLabel: '2회차',
    dateText: '2025년 7월 17일 (목)',
    locationText: '서울 강남구',
    timeText: '오후 7:00 - 9:00',
    totalMemberCount: 5,
    attendance: { attending: 3, notAttending: 0, pending: 2 },
    attendees: [
      { memberId: 1, name: '김도연', initial: '김' },
      { memberId: 2, name: '이수진', initial: '이' },
      { memberId: 3, name: '박지성', initial: '박' },
    ],
    myAttendanceStatus: null,
  },
  4: {
    meetingId: 4,
    role: 'OPERATOR',
    title: '금요일 영상 강의',
    roundLabel: '4회차',
    dateText: '2025년 7월 11일 (금)',
    locationText: '온라인',
    timeText: '오후 8:00 - 9:00',
    totalMemberCount: 6,
    attendance: { attending: 6, notAttending: 0, pending: 0 },
    attendees: [
      { memberId: 1, name: '김도연', initial: '김' },
      { memberId: 2, name: '이수진', initial: '이' },
      { memberId: 3, name: '박지성', initial: '박' },
    ],
    myAttendanceStatus: null,
  },
  5: {
    meetingId: 5,
    role: 'PARTICIPANT',
    title: '토요일 영어회화',
    roundLabel: '1회차',
    dateText: '2025년 7월 19일 (토)',
    locationText: '서울 종로구',
    timeText: '오전 10:00 - 12:00',
    totalMemberCount: 4,
    attendance: { attending: 3, notAttending: 0, pending: 1 },
    attendees: [
      { memberId: 1, name: '김도연', initial: '김' },
      { memberId: 2, name: '이수진', initial: '이' },
      { memberId: 3, name: '박지성', initial: '박' },
    ],
    myAttendanceStatus: 'ATTENDING',
  },
};

// TODO: 백엔드 모임 상세 API 확정 후 apiClient.get(`/api/v1/meetings/${meetingId}`)으로 교체
export async function getMeetingDetail(meetingId: number): Promise<MeetingDetailResponse> {
  const detail = MOCK_MEETING_DETAILS[meetingId];

  if (!detail) {
    throw new Error(`모임 상세 mock 데이터가 없습니다: meetingId=${meetingId}`);
  }

  return detail;
}

const MOCK_CONTACTS: InvitedMemberResponse[] = [
  { memberId: 1, name: '김도연', initial: '김', phoneLabel: '010-1234-****' },
  { memberId: 2, name: '이수진', initial: '이', phoneLabel: '친구 · 010-5678-****' },
  { memberId: 3, name: '박지성', initial: '박', phoneLabel: '010-9012-****' },
  { memberId: 4, name: '최유리', initial: '최', phoneLabel: '010-3456-****' },
];

// TODO: 백엔드 연락처 검색 API 확정 후 apiClient.get('/api/v1/contacts/search')으로 교체
export async function searchContacts(query: string): Promise<InvitedMemberResponse[]> {
  const trimmed = query.trim();

  if (!trimmed) {
    return MOCK_CONTACTS;
  }

  return MOCK_CONTACTS.filter((contact) => contact.name.includes(trimmed));
}

// TODO: 백엔드 모임 생성 API 확정 후 apiClient.post('/api/v1/meetings')으로 교체
export async function createMeeting(request: CreateMeetingRequest): Promise<CreateMeetingResponse> {
  const meetingId = Math.floor(Math.random() * 100000);
  const invitedMembers = MOCK_CONTACTS.filter((contact) =>
    request.invitedMemberIds.includes(contact.memberId),
  );

  // 방금 만든 모임을 상세 화면(모임 바로가기)에서 바로 조회할 수 있도록 mock 상세 데이터도 함께 생성
  MOCK_MEETING_DETAILS[meetingId] = {
    meetingId,
    role: 'OPERATOR',
    title: request.title,
    roundLabel: '1회차',
    dateText: request.firstMeetingDate,
    locationText: request.location,
    timeText: `${request.startTime} - ${request.endTime}`,
    totalMemberCount: invitedMembers.length + 1,
    attendance: { attending: 0, notAttending: 0, pending: invitedMembers.length },
    attendees: invitedMembers.map(({ memberId, name, initial }) => ({ memberId, name, initial })),
    myAttendanceStatus: null,
  };

  return {
    meetingId,
    title: request.title,
    inviteLink: 'withme.app/join/abc123',
  };
}
