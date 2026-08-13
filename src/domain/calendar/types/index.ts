export type CalendarEventType = 'GROUP' | 'TODO' | 'HOLIDAY';

export type CalendarEventResponse = {
  eventId: number;
  type: CalendarEventType;
  title: string;
  date: string; // 'YYYY-MM-DD'
  time: string | null; // '오전 10:00' 형태의 표시용 시각, 종일 일정이면 null
  // 모임 일정이면 모임 이름, 할 일이면 카테고리명, 공휴일이면 '공휴일'
  badgeLabel: string;
};

export type CalendarMonthResponse = {
  events: CalendarEventResponse[];
};

export type CalendarLayerKey = 'GROUP' | 'TODO' | 'HOLIDAY';

export type CalendarLayerConfig = {
  key: CalendarLayerKey;
  label: string;
  description: string;
  dotColor: string;
  disabled?: boolean;
};
