import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import {
  createMockCategory,
  deleteMockCategory,
  getMockTodoCategories,
  updateMockCategory,
} from '@/domain/todo/api/mockCategoryData';
import type {
  CategoryResponse,
  CreateCategoryRequest,
  TodoCategoryResponse,
  UpdateCategoryRequest,
} from '@/domain/todo/types';

export async function getTodoCategories() {
  // TODO: 백엔드 카테고리 조회 API(GET /api/v1/todo/category) 연동 전까지 mock 데이터 사용
  if (__DEV__) {
    return getMockTodoCategories();
  }

  const response =
    await apiClient.get<ApiResponse<TodoCategoryResponse[]>>('/api/v1/todo/category');

  return response.data.data;
}

export async function createCategory(request: CreateCategoryRequest) {
  // 로그인 없이 __DEV__ 바로가기로 들어온 경우 실제 유저 세션이 없어 mock으로 처리
  if (__DEV__) {
    return createMockCategory(request);
  }

  const response = await apiClient.post<ApiResponse<CategoryResponse>>(
    '/api/v1/todo/category',
    request,
  );

  return response.data.data;
}

export async function updateCategory(request: UpdateCategoryRequest) {
  if (__DEV__) {
    return updateMockCategory(request);
  }

  const response = await apiClient.patch<ApiResponse<CategoryResponse>>(
    '/api/v1/todo/category',
    request,
  );

  return response.data.data;
}

// TODO: BE에 카테고리 삭제 엔드포인트가 아직 없음(계획 문서에도 없음). Todo 삭제(DELETE /api/v1/todo,
// body로 id 전달)와 동일한 컨벤션으로 가정한 경로 — 실제 엔드포인트가 정해지면 함께 맞춰야 한다
export async function deleteCategory(categoryId: number) {
  if (__DEV__) {
    return deleteMockCategory(categoryId);
  }

  await apiClient.delete('/api/v1/todo/category', { data: { categoryId } });
}
