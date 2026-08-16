import { useQuery } from '@tanstack/react-query';

import { getTodoCategories } from '@/domain/todo/api/categoryApi';

export const todoCategoryQueryKeys = {
  all: ['todoCategory'] as const,
  list: () => [...todoCategoryQueryKeys.all, 'list'] as const,
};

export function useTodoCategoriesQuery() {
  return useQuery({
    queryKey: todoCategoryQueryKeys.list(),
    queryFn: getTodoCategories,
  });
}
