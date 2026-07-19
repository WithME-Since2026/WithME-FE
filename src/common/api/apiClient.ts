import axios from 'axios';

import { tokenManager } from './tokenManager';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    // 401: 토큰 만료 시 초기화 후 로그인 화면 이동 (navigation ref 연결 후 처리)
    if (error.response?.status === 401) {
      await tokenManager.clearTokens();
    }
    return Promise.reject(error);
  },
);
