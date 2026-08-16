import { clearMockTodosCategory } from '@/domain/todo/api/mockTodoData';
import type {
  CreateCategoryRequest,
  TodoCategoryResponse,
  UpdateCategoryRequest,
} from '@/domain/todo/types';

// GET/POST/PATCH /api/v1/todo/category 연동 전까지 카테고리 관리 화면을 확인할 수 있도록 만든 mock 데이터
// __DEV__ 화면에서 생성/수정/삭제한 내용이 목록에 바로 반영되도록 모듈 상태로 유지
let mockCategories: TodoCategoryResponse[] = [
  { categoryId: 1, categoryName: '업무', categoryColor: '#4A90FA', sortOrder: 0, todoCount: 3 },
  { categoryId: 2, categoryName: '개인', categoryColor: '#33B86B', sortOrder: 1, todoCount: 2 },
  { categoryId: 3, categoryName: '운동', categoryColor: '#F28C1A', sortOrder: 2, todoCount: 1 },
  { categoryId: 4, categoryName: '학습', categoryColor: '#8C33E0', sortOrder: 3, todoCount: 2 },
];
let nextMockCategoryId = mockCategories.length + 1;

function sortedCategories() {
  return [...mockCategories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getMockTodoCategories(): TodoCategoryResponse[] {
  return sortedCategories();
}

export function createMockCategory(request: CreateCategoryRequest): TodoCategoryResponse {
  const category: TodoCategoryResponse = {
    categoryId: nextMockCategoryId++,
    categoryName: request.categoryName,
    categoryColor: request.categoryColor,
    sortOrder: mockCategories.length,
    todoCount: 0,
  };

  mockCategories = [...mockCategories, category];

  return category;
}

// BE의 reorderCategories와 동일하게 sortOrder를 "목표 인덱스"로 해석해 나머지를 재계산한다
export function updateMockCategory(request: UpdateCategoryRequest): TodoCategoryResponse {
  const target = mockCategories.find((category) => category.categoryId === request.categoryId);
  if (!target) {
    throw new Error('카테고리를 찾을 수 없습니다.');
  }

  if (request.sortOrder !== undefined && request.sortOrder !== target.sortOrder) {
    const others = sortedCategories().filter(
      (category) => category.categoryId !== request.categoryId,
    );
    const targetIndex = Math.min(request.sortOrder, others.length);
    others.splice(targetIndex, 0, target);
    others.forEach((category, index) => {
      category.sortOrder = index;
    });
  }

  if (request.categoryName !== undefined) {
    target.categoryName = request.categoryName;
  }
  if (request.categoryColor !== undefined) {
    target.categoryColor = request.categoryColor;
  }

  mockCategories = [...mockCategories];

  return target;
}

export function deleteMockCategory(categoryId: number): void {
  mockCategories = mockCategories.filter((category) => category.categoryId !== categoryId);
  // BE에서도 카테고리 삭제 시 해당 todo의 categoryId를 null로 해제한다 (Todo.changeCategory)
  clearMockTodosCategory(categoryId);
}
