import { colors } from '@/common/styles/theme';

import type { CalendarLayerConfig } from '@/domain/calendar/types';

export const CALENDAR_LAYER_COLORS = {
  GROUP: colors.primary,
  TODO: '#D97706',
  HOLIDAY: '#DC2626',
} as const;

// 캘린더 메인뷰 리디자인(Figma 784-18087)에서 도입된 색상. 앱 전역 theme에는 아직 없어 캘린더 화면 범위로 로컬 정의함
export const CALENDAR_DESIGN_COLORS = {
  weekdayNeutral: '#49454F',
  todayBadgeBg: `${colors.primary}1A`,
} as const;

export const CALENDAR_LAYERS: CalendarLayerConfig[] = [
  {
    key: 'GROUP',
    label: '모임 일정',
    description: 'WithME 모임 · 회차 일정',
    dotColor: CALENDAR_LAYER_COLORS.GROUP,
  },
  {
    key: 'TODO',
    label: 'Todo',
    description: 'Todo 마감일 표시',
    dotColor: CALENDAR_LAYER_COLORS.TODO,
  },
  {
    key: 'HOLIDAY',
    label: '공휴일',
    description: '법정 공휴일',
    dotColor: CALENDAR_LAYER_COLORS.HOLIDAY,
  },
];
