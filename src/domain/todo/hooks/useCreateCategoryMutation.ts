import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCategory } from '@/domain/todo/api/categoryApi';
import { todoCategoryQueryKeys } from '@/domain/todo/hooks/useTodoCategoriesQuery';
import type { CreateCategoryRequest } from '@/domain/todo/types';

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCategoryRequest) => createCategory(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoCategoryQueryKeys.list() });
    },
  });
}
