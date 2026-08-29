import type { TodoCategoryResponse } from '@/domain/todo/types';

// GET /api/v1/todo/category 연동 전까지 카테고리 목록을 확인할 수 있도록 만든 mock 데이터
const mockCategories: TodoCategoryResponse[] = [
  { categoryId: 1, categoryName: '업무', categoryColor: '#4A90FA', sortOrder: 0, todoCount: 3 },
  { categoryId: 2, categoryName: '개인', categoryColor: '#33B86B', sortOrder: 1, todoCount: 2 },
  { categoryId: 3, categoryName: '운동', categoryColor: '#F28C1A', sortOrder: 2, todoCount: 1 },
  { categoryId: 4, categoryName: '학습', categoryColor: '#8C33E0', sortOrder: 3, todoCount: 2 },
];

export function getMockTodoCategories(): TodoCategoryResponse[] {
  return [...mockCategories].sort((a, b) => a.sortOrder - b.sortOrder);
}
