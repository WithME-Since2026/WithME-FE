import { colors } from '@/common/styles/theme';

import type { CalendarLayerConfig } from '@/domain/calendar/types';

export const CALENDAR_LAYER_COLORS = {
  GROUP: colors.primary,
  TODO: '#477ae7',
  HOLIDAY: colors.weekend,
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
