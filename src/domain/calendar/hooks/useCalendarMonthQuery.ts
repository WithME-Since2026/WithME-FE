import { useQuery } from '@tanstack/react-query';

import { getCalendarMonth } from '@/domain/calendar/api/calendarApi';

export const calendarQueryKeys = {
  all: ['calendar'] as const,
  month: (year: number, month: number) => [...calendarQueryKeys.all, 'month', year, month] as const,
};

export function useCalendarMonthQuery(year: number, month: number) {
  return useQuery({
    queryKey: calendarQueryKeys.month(year, month),
    queryFn: () => getCalendarMonth(year, month),
  });
}
