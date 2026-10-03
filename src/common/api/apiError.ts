import axios from 'axios';

import type { ApiResponse } from '@/common/types/api';

// BE(GeneralExceptionAdvice)는 항상 { success: false, code, message } 형태로 에러를 내려준다.
// react-query의 error는 기본적으로 Error 타입이라, axios 에러인지 확인하고 안전하게 메시지를 꺼낸다
export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError<ApiResponse<unknown>>(error) && error.response?.data?.message) {
    return error.response.data.message;
  }

  return fallbackMessage;
}
