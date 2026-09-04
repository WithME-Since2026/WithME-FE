import type {
  CategoryResponse,
  CreateCategoryRequest,
  TodoCategoryResponse,
  UpdateCategoryRequest,
} from '@/domain/todo/types';

// GET /api/v1/todo/category 연동 전까지 카테고리 목록을 확인할 수 있도록 만든 mock 데이터
let mockCategories: TodoCategoryResponse[] = [
  { categoryId: 1, categoryName: '업무', categoryColor: '#4A90FA', sortOrder: 0, todoCount: 3 },
  { categoryId: 2, categoryName: '개인', categoryColor: '#33B86B', sortOrder: 1, todoCount: 2 },
  { categoryId: 3, categoryName: '운동', categoryColor: '#F28C1A', sortOrder: 2, todoCount: 1 },
  { categoryId: 4, categoryName: '학습', categoryColor: '#8C33E0', sortOrder: 3, todoCount: 2 },
];
let nextMockCategoryId = mockCategories.length + 1;

export function getMockTodoCategories(): TodoCategoryResponse[] {
  return [...mockCategories].sort((a, b) => a.sortOrder - b.sortOrder);
}

// POST /api/v1/todo/category. sortOrder는 BE와 동일하게 맨 뒤에 이어붙인다
export function createMockCategory(request: CreateCategoryRequest): CategoryResponse {
  const sortOrder = mockCategories.length;

  const created: TodoCategoryResponse = {
    categoryId: nextMockCategoryId++,
    categoryName: request.categoryName,
    categoryColor: request.categoryColor,
    sortOrder,
    todoCount: 0,
  };

  mockCategories = [...mockCategories, created];

  return created;
}

// PATCH /api/v1/todo/category. undefined인 필드는 기존 값을 유지한다 (BE의 UpdateCategoryRequest와 동일한 규칙)
export function updateMockCategory(request: UpdateCategoryRequest): CategoryResponse {
  const target = mockCategories.find((category) => category.categoryId === request.categoryId);
  if (!target) {
    throw new Error('카테고리를 찾을 수 없습니다.');
  }

  const updated: TodoCategoryResponse = {
    ...target,
    categoryName: request.categoryName ?? target.categoryName,
    categoryColor: request.categoryColor ?? target.categoryColor,
    sortOrder: request.sortOrder ?? target.sortOrder,
  };

  mockCategories = mockCategories.map((category) =>
    category.categoryId === updated.categoryId ? updated : category,
  );

  return updated;
}

// TODO: BE에 카테고리 삭제 엔드포인트가 아직 없음(계획 문서에도 없음) — mock으로만 지원
export function deleteMockCategory(categoryId: number): void {
  mockCategories = mockCategories.filter((category) => category.categoryId !== categoryId);
}
