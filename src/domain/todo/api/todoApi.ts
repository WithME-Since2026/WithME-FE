import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import {
  createMockTodo,
  deleteMockTodo,
  getMockTodoList,
  updateMockTodo,
} from '@/domain/todo/api/mockTodoData';
import type {
  CreateTodoRequest,
  TodoListResponse,
  TodoResponse,
  UpdateTodoRequest,
} from '@/domain/todo/types';

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

// TODO: BE에 아직 할 일 수정 엔드포인트가 없음 (Todo.update()는 엔티티에 이미 있으나 컨트롤러 미구현)
export async function updateTodo(request: UpdateTodoRequest) {
  if (__DEV__) {
    return updateMockTodo(request);
  }

  const response = await apiClient.patch<ApiResponse<TodoResponse>>('/api/v1/todo', request);

  return response.data.data;
}

// TODO: BE에 아직 할 일 삭제 엔드포인트가 없음 (Todo.delete() 소프트 삭제는 엔티티에 이미 있으나 컨트롤러 미구현)
export async function deleteTodo(todoId: number) {
  if (__DEV__) {
    return deleteMockTodo(todoId);
  }

  await apiClient.delete(`/api/v1/todo/${todoId}`);
}
