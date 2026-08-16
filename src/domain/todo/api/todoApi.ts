import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import { createMockTodo, getMockTodoList } from '@/domain/todo/api/mockTodoData';
import type { CreateTodoRequest, TodoListResponse, TodoResponse } from '@/domain/todo/types';

export async function getTodoList() {
  // TODO: 백엔드 Todo 목록 조회 API(GET /api/v1/todo/list) 연동 전까지 mock 데이터 사용
  if (__DEV__) {
    return getMockTodoList();
  }

  const response = await apiClient.get<ApiResponse<TodoListResponse>>('/api/v1/todo/list');

  return response.data.data;
}

export async function createTodo(request: CreateTodoRequest) {
  // 로그인 없이 __DEV__ 바로가기로 들어온 경우 실제 유저 세션이 없어 mock으로 처리
  if (__DEV__) {
    return createMockTodo(request);
  }

  const response = await apiClient.post<ApiResponse<TodoResponse>>('/api/v1/todo', request);

  return response.data.data;
}
