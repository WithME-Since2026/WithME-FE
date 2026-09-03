// yooze.withme.domain.todo.dto.response.TodoResponse 기준 (BE에 due-time 필드는 없고 dueDate만 존재)
export type TodoResponse = {
  todoId: number;
  categoryId: number | null;
  title: string;
  dueDate: string; // LocalDate → 'YYYY-MM-DD'
  completed: boolean;
  notificationStatus: boolean;
  // FE 전용 필드. 서버 응답엔 없는 필드라 optional — __DEV__ mock 상태로만 유지되고 새로고침 시 초기화된다 (백엔드 API 추천 참고)
  dueTime?: string | null;
  // FE 전용 필드. 롱프레스 미루기로 날짜가 바뀐 항목인지 표시 (BE에 미루기 이력이 없어 mock 상태로만 유지)
  isPostponed?: boolean;
  // FE 전용 필드. BE에 반복 관련 필드가 없어 __DEV__ mock에만 저장된다 (백엔드 API 추천 참고)
  recurrence?: TodoRecurrenceRule | null;
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

// yooze.withme.domain.todo.dto.response.CategoryResponse 기준 (카테고리 생성/수정 응답 — 목록 응답과 달리 todoCount가 없다)
export type CategoryResponse = {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  sortOrder: number;
};

// yooze.withme.domain.todo.dto.request.CreateCategoryRequest 기준 (POST /api/v1/todo/category)
export type CreateCategoryRequest = {
  categoryName: string;
  categoryColor: string; // '#RRGGBB'
};

// yooze.withme.domain.todo.dto.request.UpdateCategoryRequest 기준 (PATCH /api/v1/todo/category)
// categoryName/categoryColor/sortOrder는 undefined면 기존 값 유지 (BE의 strip 로직과 동일하게 null은 보내지 않는다)
export type UpdateCategoryRequest = {
  categoryId: number;
  categoryName?: string;
  categoryColor?: string;
  sortOrder?: number;
};

// yooze.withme.domain.todo.dto.request.CreateTodoRequest 기준 (POST /api/v1/todo)
export type CreateTodoRequest = {
  title: string;
  dueDate: string; // 'YYYY-MM-DD', BE에서 오늘 이후만 허용(@FutureOrPresent)
  categoryId: number | null;
  notificationStatus: boolean;
  // FE 전용 필드. BE에 시간 컬럼이 없어 __DEV__ mock에만 저장된다 (백엔드 API 추천 참고)
  dueTime: string | null;
  // FE 전용 필드. BE에 반복 관련 필드가 없어 __DEV__ mock에만 저장된다 (백엔드 API 추천 참고)
  recurrence: TodoRecurrenceRule | null;
};

// PATCH /api/v1/todo — 제목/카테고리/알림처럼 일반 수정을 담당한다.
// 완료 처리와 날짜 변경은 BE 계획상 별도 엔드포인트(PATCH /todo/completion, PATCH /todo/date)로 분리돼 있어
// 여기 포함하지 않는다 (셋 다 아직 컨트롤러 미구현 — 백엔드 API 추천 참고)
export type UpdateTodoRequest = {
  todoId: number;
  title?: string;
  categoryId?: number | null;
  notificationStatus?: boolean;
  // FE 전용 필드. BE에 반복 관련 필드가 없어 __DEV__ mock에만 저장된다 (백엔드 API 추천 참고)
  recurrence?: TodoRecurrenceRule | null;
};

// PATCH /api/v1/todo/date — todo 날짜 수정 전용 엔드포인트 (아직 미구현, 백엔드 API 추천 참고)
export type UpdateTodoDateRequest = {
  todoId: number;
  dueDate: string;
  // FE 전용 필드. BE에 시간 컬럼이 없어 __DEV__ mock에만 저장된다 (백엔드 API 추천 참고)
  dueTime?: string | null;
  isPostponed?: boolean;
};

// FE 전용 반복 규칙. BE에 반복 관련 필드/API가 전혀 없어 dueTime과 동일하게 __DEV__ mock에만 저장되고
// 새로고침 시 초기화된다 (백엔드 API 추천 참고). "안 함"은 recurrence를 null/undefined로 표현한다
export type TodoRecurrenceFrequency = 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
export type TodoRecurrenceUnit = 'DAY' | 'WEEK' | 'MONTH';
export type TodoRecurrenceEnd =
  | { type: 'NEVER' }
  | { type: 'ON_DATE'; date: string } // 'YYYY-MM-DD'
  | { type: 'AFTER_COUNT'; count: number };

export type TodoRecurrenceRule = {
  frequency: TodoRecurrenceFrequency;
  interval: number; // 매 N. '매주'/'매월' 칩은 항상 1이고 '맞춤'만 사용자가 조절한다
  unit: TodoRecurrenceUnit; // '매주'→WEEK, '매월'→MONTH로 고정되고 '맞춤'만 선택 가능하다
  weekdays: number[]; // 0(일)~6(토). unit === 'WEEK'일 때만 의미가 있다
  end: TodoRecurrenceEnd;
};
