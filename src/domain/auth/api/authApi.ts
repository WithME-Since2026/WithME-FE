import axios from 'axios';

import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import type {
  CheckEmailCodeRequest,
  CheckEmailCodeResponse,
  CheckLoginIdRequest,
  CheckLoginIdResponse,
  FindLoginIdRequest,
  FindLoginIdResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendEmailCodeRequest,
  SendEmailCodeResponse,
  SignUpRequest,
  SignUpResponse,
} from '@/domain/auth/types';

export async function loginLocal(request: LoginRequest) {
  // apiClient의 baseURL은 호스트까지만 포함하므로 버전 prefix는 각 API에서 직접 명시
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/api/v1/auth/login',
    request,
  );

  return response.data.data;
}

// 서버는 사용 가능하면 200, 중복이면 409로만 구분하고 바디에 결과 필드가 없음
export async function checkLoginIdDuplicate(
  request: CheckLoginIdRequest,
): Promise<CheckLoginIdResponse> {
  try {
    await apiClient.get<ApiResponse<null>>('/api/v1/auth/id-check', { params: request });
    return { isDuplicated: false };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      return { isDuplicated: true };
    }
    throw error;
  }
}

export async function signUp(request: SignUpRequest) {
  const response = await apiClient.post<ApiResponse<SignUpResponse>>(
    '/api/v1/auth/sign-up',
    request,
  );

  return response.data.data;
}

export async function sendEmailVerificationCode(request: SendEmailCodeRequest) {
  const response = await apiClient.post<ApiResponse<SendEmailCodeResponse>>(
    '/api/v1/auth/email',
    request,
  );

  return response.data.data;
}

export async function checkEmailVerificationCode(request: CheckEmailCodeRequest) {
  const response = await apiClient.post<ApiResponse<CheckEmailCodeResponse>>(
    '/api/v1/auth/email/check',
    request,
  );

  return response.data.data;
}

export async function findLoginId(request: FindLoginIdRequest) {
  const response = await apiClient.post<ApiResponse<FindLoginIdResponse>>(
    '/api/v1/auth/id',
    request,
  );

  return response.data.data;
}

export async function resetPassword(request: ResetPasswordRequest) {
  const response = await apiClient.post<ApiResponse<ResetPasswordResponse>>(
    '/api/v1/auth/password/change',
    request,
  );

  return response.data.data;
}
