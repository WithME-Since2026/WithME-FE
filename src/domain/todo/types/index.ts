// yooze.withme.domain.todo.dto.response.TodoResponse 기준 (BE에 due-time 필드는 없고 dueDate만 존재)
export type TodoResponse = {
  todoId: number;
  categoryId: number | null;
  title: string;
  dueDate: string; // LocalDate → 'YYYY-MM-DD'
  completed: boolean;
  notificationStatus: boolean;
  // FE 전용 필드. BE에 시간 컬럼이 없어 __DEV__ mock 상태로만 유지되고 새로고침 시 초기화된다 (백엔드 API 추천 참고)
  dueTime: string | null;
  // FE 전용 필드. 롱프레스 미루기로 날짜가 바뀐 항목인지 표시 (BE에 미루기 이력이 없어 mock 상태로만 유지)
  isPostponed: boolean;
};

export type TodoListResponse = {
  todos: TodoResponse[];
};

// yooze.withme.domain.todo.dto.response.CategoryDetailResponse 기준 (GET /api/v1/todo/category 응답)
export type TodoCategoryResponse = {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  sortOrder: number;
  todoCount: number;
};

export type TodoCategoryFilter = 'ALL' | number; // number = categoryId

// yooze.withme.domain.todo.dto.request.CreateTodoRequest 기준 (POST /api/v1/todo)
export type CreateTodoRequest = {
  title: string;
  dueDate: string; // 'YYYY-MM-DD', BE에서 오늘 이후만 허용(@FutureOrPresent)
  categoryId: number | null;
  notificationStatus: boolean;
  // FE 전용 필드. BE에 시간 컬럼이 없어 __DEV__ mock에만 저장된다 (백엔드 API 추천 참고)
  dueTime: string | null;
};

// yooze.withme.domain.todo.entity.Todo.update(title, dueDate, notificationStatus) 기준.
// BE에 아직 이 필드들을 노출하는 PATCH 엔드포인트가 없음 (백엔드 API 추천 참고)
export type UpdateTodoRequest = {
  todoId: number;
  title?: string;
  dueDate?: string;
  notificationStatus?: boolean;
  // FE 전용 필드. BE에 시간 컬럼이 없어 __DEV__ mock에만 저장된다 (백엔드 API 추천 참고)
  dueTime?: string | null;
  isPostponed?: boolean;
};

// yooze.withme.domain.todo.dto.request.CreateCategoryRequest 기준 (POST /api/v1/todo/category)
export type CreateCategoryRequest = {
  categoryName: string;
  categoryColor: string; // '#RRGGBB'
};

// yooze.withme.domain.todo.dto.request.UpdateCategoryRequest 기준 (PATCH /api/v1/todo/category)
// null인 필드는 "변경하지 않음"을 의미
export type UpdateCategoryRequest = {
  categoryId: number;
  categoryName?: string;
  categoryColor?: string;
  sortOrder?: number;
};
