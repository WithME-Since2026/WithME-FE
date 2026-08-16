import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import { getMockTodoList } from '@/domain/todo/api/mockTodoData';
import type { TodoListResponse } from '@/domain/todo/types';

export async function getTodoList() {
  // TODO: 백엔드 Todo 목록 조회 API(GET /api/v1/todo/list) 연동 전까지 mock 데이터 사용
  if (__DEV__) {
    return getMockTodoList();
  }

  const response = await apiClient.get<ApiResponse<TodoListResponse>>('/api/v1/todo/list');

  return response.data.data;
}
