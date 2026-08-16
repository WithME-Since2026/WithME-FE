import { formatDateKey } from '@/common/utils/date';

import type {
  CreateTodoRequest,
  TodoListResponse,
  TodoResponse,
  UpdateTodoRequest,
} from '@/domain/todo/types';

// GET /api/v1/todo/list 연동 전까지 Todo 화면을 확인할 수 있도록 오늘 기준 상대 날짜로 생성하는 mock 데이터
// categoryId는 mockCategoryData.ts의 카테고리(1 업무 / 2 개인 / 3 운동 / 4 학습)를 참조
function buildInitialMockTodos(): TodoResponse[] {
  const today = new Date();
  const offsetDay = (offset: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + offset);
    return formatDateKey(date);
  };

  return [
    {
      todoId: 1,
      title: '병원 예약 전화',
      dueDate: offsetDay(-1),
      completed: false,
      categoryId: 2,
      notificationStatus: false,
    },
    {
      todoId: 2,
      title: '기획서 초안 작성',
      dueDate: offsetDay(0),
      completed: false,
      categoryId: 1,
      notificationStatus: false,
    },
    {
      todoId: 3,
      title: '팀 미팅 준비',
      dueDate: offsetDay(0),
      completed: false,
      categoryId: 1,
      notificationStatus: false,
    },
    {
      todoId: 4,
      title: '운동 30분',
      dueDate: offsetDay(0),
      completed: false,
      categoryId: 3,
      notificationStatus: false,
    },
    {
      todoId: 5,
      title: '영어 단어 암기',
      dueDate: offsetDay(0),
      completed: false,
      categoryId: 4,
      notificationStatus: false,
    },
    {
      todoId: 6,
      title: '마트 장보기',
      dueDate: offsetDay(0),
      completed: true,
      categoryId: 2,
      notificationStatus: false,
    },
    {
      todoId: 7,
      title: '회의록 정리',
      dueDate: offsetDay(1),
      completed: false,
      categoryId: 1,
      notificationStatus: false,
    },
    {
      todoId: 8,
      title: '자격증 강의 듣기',
      dueDate: offsetDay(2),
      completed: false,
      categoryId: 4,
      notificationStatus: false,
    },
  ];
}

// __DEV__ 화면에서 새 할 일 추가 시트로 만든 항목이 목록에 바로 반영되도록 모듈 상태로 유지
let mockTodos = buildInitialMockTodos();
let nextMockTodoId = mockTodos.length + 1;

export function getMockTodoList(): TodoListResponse {
  return { todos: mockTodos };
}

export function createMockTodo(request: CreateTodoRequest): TodoResponse {
  const todo: TodoResponse = {
    todoId: nextMockTodoId++,
    categoryId: request.categoryId,
    title: request.title,
    dueDate: request.dueDate,
    completed: false,
    notificationStatus: request.notificationStatus,
  };

  mockTodos = [...mockTodos, todo];

  return todo;
}

// 카테고리 삭제 시 BE(Todo.changeCategory)와 동일하게 해당 todo들의 카테고리를 해제한다
export function clearMockTodosCategory(categoryId: number): void {
  mockTodos = mockTodos.map((todo) =>
    todo.categoryId === categoryId ? { ...todo, categoryId: null } : todo,
  );
}

// BE의 Todo.update와 동일하게 undefined인 필드는 기존 값을 유지한다
export function updateMockTodo(request: UpdateTodoRequest): TodoResponse {
  const target = mockTodos.find((todo) => todo.todoId === request.todoId);
  if (!target) {
    throw new Error('할 일을 찾을 수 없습니다.');
  }

  const updated: TodoResponse = {
    ...target,
    title: request.title ?? target.title,
    dueDate: request.dueDate ?? target.dueDate,
    notificationStatus: request.notificationStatus ?? target.notificationStatus,
  };

  mockTodos = mockTodos.map((todo) => (todo.todoId === request.todoId ? updated : todo));

  return updated;
}

// BE의 Todo.delete()와 동일하게 소프트 삭제 대상이므로 목록에서 제외한다
export function deleteMockTodo(todoId: number): void {
  mockTodos = mockTodos.filter((todo) => todo.todoId !== todoId);
}
