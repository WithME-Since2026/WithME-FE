import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import { getMockCalendarMonth } from '@/domain/calendar/api/mockCalendarData';
import type { CalendarMonthResponse } from '@/domain/calendar/types';

export async function getCalendarMonth(year: number, month: number) {
  // TODO: 백엔드 캘린더 조회 API(GET /api/v1/calender) 연동 전까지 mock 데이터 사용
  if (__DEV__) {
    return getMockCalendarMonth(year, month);
  }

  const response = await apiClient.get<ApiResponse<CalendarMonthResponse>>('/api/v1/calender', {
    params: { year, month },
  });

  return response.data.data;
}
