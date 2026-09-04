export type CalendarEventType = 'GROUP' | 'TODO' | 'HOLIDAY';

export type CalendarEventResponse = {
  eventId: number;
  type: CalendarEventType;
  title: string;
  date: string; // 'YYYY-MM-DD'
  time: string | null; // '오전 10:00' 형태의 표시용 시각, 종일 일정이면 null
  // 모임 일정이면 모임 이름, 할 일이면 카테고리명, 공휴일이면 '법정 공휴일'
  badgeLabel: string;
  location: string | null; // 모임 일정의 장소, 그 외 타입은 null
  // 할 일이면 그 할 일의 카테고리 색상('#RRGGBB'), 카테고리가 없거나 할 일이 아니면 null
  // (null일 때는 레이어 기본색(CALENDAR_LAYERS)으로 대체해서 표시)
  color: string | null;
  // 할 일 완료 여부. 할 일(TODO)이 아니면 항상 false
  completed: boolean;
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
