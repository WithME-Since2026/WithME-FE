import axios, { type InternalAxiosRequestConfig } from 'axios';

import { tokenManager } from './tokenManager';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

// 재발급을 시도하면 안 되는 요청 (로그인 실패 401, 재발급 자체의 401)
const NO_REISSUE_URLS = ['/api/v1/auth/login', '/api/v1/auth/reissue'];

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// common이 domain(authStore)에 의존하지 않도록 세션 만료 후처리는 app 레이어에서 주입
let onSessionExpired: () => void = () => {};
export function setOnSessionExpired(handler: () => void) {
  onSessionExpired = handler;
}

// 동시에 여러 요청이 401을 받아도 재발급은 한 번만 요청
let reissuePromise: Promise<string> | null = null;

async function reissueAccessToken() {
  const refreshToken = await tokenManager.getRefreshToken();
  if (!refreshToken) {
    throw new Error('리프레시 토큰 없음');
  }

  // apiClient를 쓰면 인터셉터를 다시 타므로 기본 axios로 호출
  const response = await axios.post(`${BASE_URL}/api/v1/auth/reissue`, { refreshToken });
  const { accessToken, refreshToken: newRefreshToken } = response.data.data;
  await tokenManager.setTokens(accessToken, newRefreshToken);
  return accessToken as string;
}

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (
      error.response?.status !== 401 ||
      !config ||
      config._retry ||
      NO_REISSUE_URLS.includes(config.url ?? '')
    ) {
      return Promise.reject(error);
    }

    config._retry = true;
    try {
      reissuePromise ??= reissueAccessToken().finally(() => {
        reissuePromise = null;
      });
      await reissuePromise;
      // 요청 인터셉터가 새 토큰으로 Authorization 헤더를 다시 세팅함
      return apiClient(config);
    } catch {
      await tokenManager.clearTokens();
      onSessionExpired();
      return Promise.reject(error);
    }
  },
);
