import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import { getMockTodoCategories } from '@/domain/todo/api/mockCategoryData';
import type { TodoCategoryResponse } from '@/domain/todo/types';

export async function getTodoCategories() {
  // TODO: 백엔드 카테고리 조회 API(GET /api/v1/todo/category) 연동 전까지 mock 데이터 사용
  if (__DEV__) {
    return getMockTodoCategories();
  }

  const response =
    await apiClient.get<ApiResponse<TodoCategoryResponse[]>>('/api/v1/todo/category');

  return response.data.data;
}
