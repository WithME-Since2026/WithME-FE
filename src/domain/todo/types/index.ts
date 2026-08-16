// yooze.withme.domain.todo.dto.response.TodoResponse 기준 (BE에 due-time 필드는 없고 dueDate만 존재)
export type TodoResponse = {
  todoId: number;
  categoryId: number | null;
  title: string;
  dueDate: string; // LocalDate → 'YYYY-MM-DD'
  completed: boolean;
  notificationStatus: boolean;
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
