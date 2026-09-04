// yooze.withme.common.response.ApiResponse 기준. 필드명이 success인 boolean이라 Lombok @Getter가
// isSuccess()를 생성하지만, Jackson이 실제로 내려주는 JSON 키는 (getter 규칙에 따라) "success"다
export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};
