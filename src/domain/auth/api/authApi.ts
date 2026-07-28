import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import type {
  CheckLoginIdRequest,
  CheckLoginIdResponse,
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
} from '@/domain/auth/types';

export async function loginLocal(request: LoginRequest) {
  // apiClient의 baseURL은 호스트까지만 포함하므로 버전 prefix는 각 API에서 직접 명시
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/api/v1/auth/login/local',
    request,
  );

  return response.data.data;
}

export async function checkLoginIdDuplicate(request: CheckLoginIdRequest) {
  const response = await apiClient.post<ApiResponse<CheckLoginIdResponse>>(
    '/api/v1/auth/id/dup-check',
    request,
  );

  return response.data.data;
}

export async function signUp(request: SignUpRequest) {
  // API 명세상 회원가입 엔드포인트명이 sign-in으로 되어 있어 그대로 사용
  const response = await apiClient.post<ApiResponse<SignUpResponse>>(
    '/api/v1/auth/sign-in',
    request,
  );

  return response.data.data;
}
