import type { HomeMeetingsResponse } from '@/domain/meeting/types';

const MOCK_HOME_MEETINGS: HomeMeetingsResponse = {
  featuredMeetings: [
    {
      meetingId: 1,
      role: 'OPERATOR',
      title: '화요일 독서모임',
      scheduleText: '매주 화 · 오후 7:00',
      locationText: '서울 강남구 대학로',
      dDayLabel: 'D-1',
      attendance: { attending: 5, notAttending: 1, pending: 2 },
    },
    {
      meetingId: 2,
      role: 'PARTICIPANT',
      title: '수요일 스페인어',
      scheduleText: '매주 수 · 오후 7:00',
      locationText: '서울 마포구 서교동',
      dDayLabel: 'D-1',
      attendance: { attending: 5, notAttending: 1, pending: 2 },
    },
  ],
  otherMeetings: [
    {
      meetingId: 3,
      role: 'OPERATOR',
      title: '독독 코딩 스터디',
      scheduleText: '목 19:00 · 강남구',
      statusLabel: '진행',
    },
    {
      meetingId: 4,
      role: 'OPERATOR',
      title: '금요일 영상 강의',
      scheduleText: '금 20:00 · 온라인',
      statusLabel: '완료',
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
