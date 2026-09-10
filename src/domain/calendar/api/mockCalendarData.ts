import { toDateKey } from '@/common/utils/date';

import type { CalendarEventResponse, CalendarMonthResponse } from '@/domain/calendar/types';

// GET /api/v1/calender 연동 전까지 통합 캘린더뷰를 확인할 수 있도록 요청한 달 기준으로 생성하는 mock 데이터
export function getMockCalendarMonth(year: number, month: number): CalendarMonthResponse {
  const day = (value: number) => toDateKey(year, month, value);

  const events: CalendarEventResponse[] = [
    {
      eventId: 1,
      type: 'GROUP',
      title: '팀 스탠드업',
      date: day(2),
      time: '오전 10:00',
      badgeLabel: '모임',
    },
    {
      eventId: 2,
      type: 'TODO',
      title: '주간 회고 작성',
      date: day(7),
      time: null,
      badgeLabel: 'Todo',
    },
    {
      eventId: 3,
      type: 'GROUP',
      title: '독서 모임',
      date: day(8),
      time: '오후 7:00',
      badgeLabel: '모임',
    },
    {
      eventId: 4,
      type: 'GROUP',
      title: '러닝 크루',
      date: day(8),
      time: '오전 7:00',
      badgeLabel: '모임',
    },
    {
      eventId: 5,
      type: 'GROUP',
      title: '팀 스탠드업',
      date: day(11),
      time: '오전 10:00',
      badgeLabel: '모임',
    },
    {
      eventId: 6,
      type: 'TODO',
      title: '기획서 초안 마감',
      date: day(11),
      time: '오후 2:00',
      badgeLabel: 'Todo',
    },
    {
      eventId: 7,
      type: 'GROUP',
      title: '디자인 리뷰',
      date: day(11),
      time: '오후 4:00',
      badgeLabel: '모임',
    },
    {
      eventId: 8,
      type: 'GROUP',
      title: '스터디 모임',
      date: day(15),
      time: '오후 8:00',
      badgeLabel: '모임',
    },
    {
      eventId: 9,
      type: 'GROUP',
      title: '보드게임 모임',
      date: day(15),
      time: '오후 3:00',
      badgeLabel: '모임',
    },
    {
      eventId: 10,
      type: 'GROUP',
      title: '등산 모임',
      date: day(15),
      time: '오전 9:00',
      badgeLabel: '모임',
    },
    {
      eventId: 11,
      type: 'TODO',
      title: '보고서 제출',
      date: day(16),
      time: null,
      badgeLabel: 'Todo',
    },
    {
      eventId: 12,
      type: 'GROUP',
      title: '영화 모임',
      date: day(20),
      time: '오후 6:00',
      badgeLabel: '모임',
    },
    {
      eventId: 13,
      type: 'GROUP',
      title: '커피챗',
      date: day(22),
      time: '오전 11:00',
      badgeLabel: '모임',
    },
    {
      eventId: 14,
      type: 'GROUP',
      title: '요가 모임',
      date: day(22),
      time: '오후 7:30',
      badgeLabel: '모임',
    },
    {
      eventId: 15,
      type: 'TODO',
      title: '월간 정산',
      date: day(25),
      time: null,
      badgeLabel: 'Todo',
    },
    {
      eventId: 16,
      type: 'GROUP',
      title: '사진 모임',
      date: day(28),
      time: '오후 1:00',
      badgeLabel: '모임',
    },
    // TODO: 공휴일 API 연동 전까지 레이어 토글 확인용으로 매달 3일에 고정 노출
    {
      eventId: 17,
      type: 'HOLIDAY',
      title: '샘플 공휴일',
      date: day(3),
      time: null,
      badgeLabel: '공휴일',
    },
  ];

  return { events };
}
