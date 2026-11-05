import type {
  AttendanceOverviewResponse,
  AttendanceOverviewRoundResponse,
} from '@/domain/meeting/types';

const MOCK_MEMBERS: AttendanceOverviewRoundResponse['members'] = [
  { memberId: 1, name: '김철수', status: 'PENDING', absenceReason: null },
  { memberId: 2, name: '이영희', status: 'PENDING', absenceReason: null },
  { memberId: 3, name: '박민수', status: 'PENDING', absenceReason: null },
  { memberId: 4, name: '홍길동', status: 'ATTENDING', absenceReason: null },
  { memberId: 5, name: '김민지', status: 'ATTENDING', absenceReason: null },
  { memberId: 6, name: '이준서', status: 'ATTENDING', absenceReason: null },
  { memberId: 7, name: '최유진', status: 'ATTENDING', absenceReason: null },
  { memberId: 8, name: '강현우', status: 'ATTENDING', absenceReason: null },
  { memberId: 9, name: '최지원', status: 'NOT_ATTENDING', absenceReason: '출장 중이라 어렵습니다' },
  { memberId: 10, name: '정우진', status: 'NOT_ATTENDING', absenceReason: null },
];

// TODO: #31 회차·참석 현황 조회 연동 후 실제 API 응답으로 교체한다.
export async function getAttendanceOverview(
  meetingId: number,
): Promise<AttendanceOverviewResponse> {
  const isOneTimeEvent = meetingId === 4;
  const members = isOneTimeEvent
    ? MOCK_MEMBERS.filter((member) => [1, 2, 4, 5, 6, 7, 9].includes(member.memberId))
    : MOCK_MEMBERS;

  return {
    meetingId,
    title: isOneTimeEvent ? '팀 번개 회식' : '주간 팀 미팅',
    rounds: isOneTimeEvent
      ? [
          {
            roundId: 1,
            label: '단발성',
            dateText: '2025년 7월 20일 (일) 오후 6:00 · 홍대입구',
            isClosed: false,
            members,
          },
        ]
      : [
          {
            roundId: 3,
            label: '3회차',
            dateText: '2025년 7월 15일 (화) 오후 2:00 · 강남 사무실',
            isClosed: false,
            members,
          },
          {
            roundId: 2,
            label: '2회차',
            dateText: '2025년 7월 8일 (화) 오후 2:00 · 강남 사무실',
            isClosed: true,
            members,
          },
          {
            roundId: 1,
            label: '1회차',
            dateText: '2025년 7월 1일 (화) 오후 2:00 · 강남 사무실',
            isClosed: true,
            members,
          },
        ],
  };
}
