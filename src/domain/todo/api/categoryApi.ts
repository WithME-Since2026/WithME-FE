import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import {
  createMockCategory,
  deleteMockCategory,
  getMockTodoCategories,
  updateMockCategory,
} from '@/domain/todo/api/mockCategoryData';
import type {
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
  if (__DEV__) {
    return createMockCategory(request);
  }

  const response = await apiClient.post<ApiResponse<TodoCategoryResponse>>(
    '/api/v1/todo/category',
    request,
  );

  return response.data.data;
}

export async function updateCategory(request: UpdateCategoryRequest) {
  if (__DEV__) {
    return updateMockCategory(request);
  }

  const response = await apiClient.patch<ApiResponse<TodoCategoryResponse>>(
    '/api/v1/todo/category',
    request,
  );

  return response.data.data;
}

// TODO: BE에 카테고리 삭제 엔드포인트가 아직 없음 (CategoryController에 DELETE 매핑 미구현, 백엔드 API 추천 참고)
export async function deleteCategory(categoryId: number) {
  if (__DEV__) {
    return deleteMockCategory(categoryId);
  }

  await apiClient.delete(`/api/v1/todo/category/${categoryId}`);
}
