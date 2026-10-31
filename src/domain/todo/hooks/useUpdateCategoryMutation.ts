import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateCategory } from '@/domain/todo/api/categoryApi';
import { todoCategoryQueryKeys } from '@/domain/todo/hooks/useTodoCategoriesQuery';
import type { UpdateCategoryRequest } from '@/domain/todo/types';

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateCategoryRequest) => updateCategory(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoCategoryQueryKeys.list() });
    },
  });
}
