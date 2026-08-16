import { apiClient } from '@/common/api/apiClient';
import type { ApiResponse } from '@/common/types/api';

import {
  completeMockTodo,
  createMockTodo,
  deleteMockTodo,
  getMockTodoList,
  updateMockTodo,
  updateMockTodoDate,
} from '@/domain/todo/api/mockTodoData';
import type {
  CompleteTodoRequest,
  CreateTodoRequest,
  TodoListResponse,
  TodoResponse,
  UpdateTodoDateRequest,
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

// TODO: BE에 아직 완료 처리 엔드포인트가 없음 (계획된 PATCH /api/v1/todo/completion, 백엔드 API 추천 참고)
export async function completeTodo(request: CompleteTodoRequest) {
  if (__DEV__) {
    return completeMockTodo(request);
  }

  const response = await apiClient.patch<ApiResponse<TodoResponse>>(
    '/api/v1/todo/completion',
    request,
  );

  return response.data.data;
}

// TODO: BE에 아직 날짜 수정 엔드포인트가 없음 (계획된 PATCH /api/v1/todo/date, 백엔드 API 추천 참고)
export async function updateTodoDate(request: UpdateTodoDateRequest) {
  if (__DEV__) {
    return updateMockTodoDate(request);
  }

  const response = await apiClient.patch<ApiResponse<TodoResponse>>('/api/v1/todo/date', request);

  return response.data.data;
}

// TODO: BE에 아직 할 일 삭제 엔드포인트가 없음. 계획된 DELETE /api/v1/todo는 경로에 id가 없고
// body로 todoId를 받는 방식이라(Category의 PATCH와 동일한 컨벤션) path param 대신 body로 보낸다
export async function deleteTodo(todoId: number) {
  if (__DEV__) {
    return deleteMockTodo(todoId);
  }

  await apiClient.delete('/api/v1/todo', { data: { todoId } });
}
