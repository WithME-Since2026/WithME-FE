import { useQuery } from '@tanstack/react-query';

import { getTodoCategories } from '@/domain/todo/api/categoryApi';
import type { TodoCategoryResponse } from '@/domain/todo/types';

export const todoCategoryQueryKeys = {
  all: ['todoCategory'] as const,
  list: () => [...todoCategoryQueryKeys.all, 'list'] as const,
};

// sortOrder 오름차순으로 정렬해 카테고리 목록(카테고리 관리 화면)과 할 일 생성/수정 시트의
// 칩 순서가 항상 같게 맞춘다. mock은 이미 정렬돼 오지만 실제 BE 응답 순서는 보장되지 않아 여기서 한 번 더 정렬한다
function sortByOrder(categories: TodoCategoryResponse[]) {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function useTodoCategoriesQuery() {
  return useQuery({
    queryKey: todoCategoryQueryKeys.list(),
    queryFn: getTodoCategories,
    select: sortByOrder,
  });
}
