// 서버 응답 필드명은 임의 변경하지 않음 — 백엔드 ApiResponse(boolean success)가 Jackson으로 직렬화될 때
// 실제 JSON 필드명은 "success"이다 (isSuccess가 아님)
export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};
